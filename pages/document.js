import useSWR from "swr";

import { useRef, useEffect, useState } from "react";

const fetcher = url => fetch(url).then(r => r.json());

const Recorder = () => {
  const [source, setSource] = useState(null);
  const [src, setSrc] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioCtx = useRef();
  const destination = useRef();
  const chunks = useRef();

  const onRecordClick = () => {
    if (mediaRecorder && destination.current && chunks.current && source) {
      if (!isRecording) {
        source.connect(destination.current);
        mediaRecorder.start();
        setIsRecording(true);
      } else {
        mediaRecorder.stop();
        chunks.current = [];
        setIsRecording(false);
      }
    }
  };

  useEffect(() => {
    audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    destination.current = audioCtx.current.createMediaStreamDestination();
    chunks.current = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function(stream) {
        setSource(audioCtx.current.createMediaStreamSource(stream));
        const mediaRecorder = new MediaRecorder(destination.current.stream);

        mediaRecorder.ondataavailable = function(evt) {
          chunks.current.push(evt.data);
        };
        mediaRecorder.onstop = function(evt) {
          let blob = new Blob(chunks.current, {
            type: "audio/flac; codecs=flac"
          });
          setSrc(URL.createObjectURL(blob));
        };

        setMediaRecorder(mediaRecorder);
      })
      .catch(function(err) {
        console.log("error getting audio => ", err);
      });
  }, []);

  return (
    <>
      <button onClick={onRecordClick}>{isRecording ? "Stop" : "Record"}</button>
      {src && !isRecording && (
        <audio controls>
          <source src={src} type="audio/flac" />
        </audio>
      )}
    </>
  );
};

const DocumentPage = () => {
  const { data: fetchedDoc, error } = useSWR("/api/documents");

  if (error) return <div>failed to load</div>;
  if (!fetchedDoc) return <div>loading...</div>;

  return (
    <>
      <div>
        <Recorder />
        <h1>Transcript for meeting {fetchedDoc.id}</h1>
        <em className="pulled-right">{fetchedDoc.createdAt}</em>
      </div>
      <div>
        <code>{fetchedDoc.doc}</code>
      </div>
    </>
  );
};

export default DocumentPage;
