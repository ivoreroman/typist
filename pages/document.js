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
      mediaRecorder.onstop = function(evt) {
        let blob = new Blob(chunks.current, {
          type: 'audio/flac',
        });
        setSrc(URL.createObjectURL(blob));
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

  const {data: fetchedDoc, error} = useSWR('/api/documents');

  if (error) return <div>failed to load</div>;
  if (!fetchedDoc) return <div>loading...</div>;
  return (
    <>
      <div>
        <h1>Transcript for meeting {fetchedDoc.id}</h1>
        <em className="pulled-right">{fetchedDoc.createdAt}</em>
      </div>
      <div>
        <code>{fetchedDoc.doc}</code>
      </div>
      {src && !isRecording && (
        <audio controls>
          <source src={src} type="audio/flac" />
        </audio>
      )}
    </>
  );
};

export default DocumentPage;
