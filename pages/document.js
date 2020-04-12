import {useRef, useEffect, useState} from 'react';
import useSWR from 'swr';
import hark from 'hark';
import getUserMedia from 'getusermedia';

const fetcher = (url) => fetch(url).then((r) => r.json());

const DocumentPage = () => {
  const [src, setSrc] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioCtx = useRef();
  const source = useRef();
  const destination = useRef();
  const chunks = useRef();

  useEffect(() => {
    audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    destination.current = audioCtx.current.createMediaStreamDestination();
    chunks.current = [];
    getUserMedia({video: false, audio: true}, (err, stream) => {
      if (err) throw err;

      source.current = audioCtx.current.createMediaStreamSource(stream);
      const mediaRecorder = new MediaRecorder(destination.current.stream);

      mediaRecorder.ondataavailable = function(evt) {
        chunks.current.push(evt.data);
      };
      mediaRecorder.onstop = async function(evt) {
        let blob = new Blob(chunks.current, {
          type: 'audio/flac',
        });
        setSrc(URL.createObjectURL(blob));
        const response = await postDoc(blob);
        console.log('response if any');
        console.log(response);
      };

      setMediaRecorder(mediaRecorder);
      let speechEvents = hark(stream, {});

      speechEvents.on('speaking', () => {
        console.log('You are speaking');
        source.current.connect(destination.current);
        mediaRecorder.start();
        setIsRecording(true);
      });

      speechEvents.on('stopped_speaking', () => {
        console.log('You stopped speaking');
        mediaRecorder.stop();
        chunks.current = [];
        setIsRecording(false);
      });
    });
  }, []);

  const {data, error} = useSWR('/api/documents');

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  console.log('data');
  console.log(data);
  const fetchedDoc = data.foundDocument;
  async function postDoc(doc) {
    const formData = new FormData();
    formData.append('audio', doc);
    const response = await fetch('https://dev-api.nicetalks.co/v1/audio', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    const localSave = await fetch('api/documents', {
      method: 'POST',
      body: JSON.stringify({
        text: data.transcript,
      }),
    });

    return data;
  }

  return (
    <>
      <div>
        <h1>Transcript for meeting {fetchedDoc && fetchedDoc.id}</h1>
        <em className="pulled-right">{fetchedDoc && fetchedDoc.createdAt}</em>
      </div>
      <div>
        <code>{fetchedDoc && fetchedDoc.text}</code>
      </div>
    </>
  );
};

export default DocumentPage;
