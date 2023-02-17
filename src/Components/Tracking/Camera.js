import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { useEffect, useRef } from "react";

function Camera(props) {
  const webcamref = useRef(null);
  const canvasref = useRef(null);

  const style = {
    position: "absolute",
    marginLeft: "auto",
    marginRight: "auto",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: 9,
    width: 640,
    height: 480,
  };

  const runfacemesh = async () => {
    // console.log(faceMesh.VERSION);
    const detector = await faceLandmarksDetection.createDetector(
      faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
      {
        runtime: "tfjs", // or 'tfjs'
        maxFaces: 3,
      }
    );

    props.setdetected(true);
    console.log(props);
    console.log("Detector loaded");

    // console.log(detector);
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
      // console.log(faces);

      //draw mesh
      requestAnimationFrame(() => {
        draw(faces);
      });
    }
  };

  const draw = (predictions) => {
    try {
      props.mapJoints(predictions);

      if (canvasref.current) {
        const ctx = canvasref.current.getContext("2d");
        if (ctx) {
          predictions.forEach((prediction) => {
            // drawBox(ctx, prediction);
            drawFaceMesh(ctx, prediction);
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const drawFaceMesh = (ctx, prediction) => {
    // props.mapPosition(position);

    //nose point
    const x = prediction.keypoints[6].x;
    const y = prediction.keypoints[6].y;

    //left eye end
    const x2 = prediction.keypoints[143].x;
    const y2 = prediction.keypoints[143].y;

    //right eye end
    const x3 = prediction.keypoints[372].x;
    const y3 = prediction.keypoints[372].y;

    //right ear end
    const x4 = prediction.keypoints[356].x;
    const y4 = prediction.keypoints[356].y;

    //left ear end
    const x5 = prediction.keypoints[127].x;
    const y5 = prediction.keypoints[127].y;

    const width = prediction.box.width;
    const height = prediction.box.height;
    // console.log(prediction.box);

    // ctx.fillRect(0, 0, 10, 10);

    ctx.fillRect(x, y, 2, 2);
    ctx.fillRect(x2, y2, 2, 2);
    ctx.fillRect(x3, y3, 2, 2);
    ctx.fillRect(x4, y4, 2, 2);
    ctx.fillRect(x5, y5, 2, 2);

    ctx.fillStyle = "#69ffe1";

    // const img = new Image();
    // img.src = "assets/Images/glass2.png";
    // console.log(y5);

    // ctx.drawImage(img, x5, y, width, height / 3);
    ctx.fill();
  };

  useEffect(() => {
    runfacemesh();
  }, [webcamref.current?.video?.readyState]);
  return (
    <>
      <Webcam ref={webcamref} style={style} />
      <canvas ref={canvasref} style={style} />
    </>
  );
}

export default Camera;
