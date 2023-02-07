import "./App.css";

import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { useRef } from "react";
import * as faceMesh from "@mediapipe/face_mesh";

function App() {
  const webcamref = useRef(null);
  const canvasref = useRef(null);

  const runfacemesh = async () => {
    console.log(faceMesh.VERSION);
    const detector = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: "tfjs", // or 'tfjs'
      }
    );

    console.log(detector);
    setInterval(() => {
      detect(detector);
    }, 100);
  };

  const detect = async (res) => {
    //check data is available
    if (
      typeof webcamref.current !== "undefined" &&
      webcamref.current !== null &&
      webcamref.current.video.readyState === 4
    ) {
      //get video properties
      const video = webcamref.current.video;
      const videoWidth = webcamref.current.video.videoWidth;
      const videoHeight = webcamref.current.video.videoHeight;

      //set video height and width
      webcamref.current.video.width = videoWidth;
      webcamref.current.video.height = videoHeight;

      //set canvas height and width
      canvasref.current.width = videoWidth;
      canvasref.current.height = videoHeight;
      //make detections
      const faces = await res.estimateFaces(video);
      console.log(faces);

      //draw mesh
      // const ctx = canvasRef.current.getContext("2d");
      // drawHand(hand, ctx);
    }
  };

  runfacemesh();
  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamref}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
        <canvas
          ref={canvasref}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
