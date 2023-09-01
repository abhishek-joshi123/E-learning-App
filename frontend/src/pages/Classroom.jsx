
import React, { useState } from 'react'

export default function Classroom() {

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);

  async function startRecording() {

    let url;
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      setRecordedChunks([]);
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = event => {
        if (event.data.size > 0) {
          setRecordedChunks(prevChunks => [...prevChunks, event.data]);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
        url = URL.createObjectURL(recordedBlob);
        // console.log(url);
        setRecordedChunks([]);
        setMediaRecorder(null);
        setRecording(false);
        setRecordedUrl(url.slice(27,url.length));
        console.log(url);
        console.log(url.slice(27,url.length-1));
        
      };

      setMediaRecorder(recorder);
      setRecording(true);
      recorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  } 

  function stopRecording() {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
      }
  }

  return (
    <div>
      <video id="recordedScreen" controls src={recordedUrl}></video>
      <button onClick={startRecording} disabled={recording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop Recording
      </button>
    </div>
  )
}
