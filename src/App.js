import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import "./App.css";
import Loading from "./Components/FallBack/Loading";
import ThreeD from "./Components/Three/thethree";
import Camera from "./Components/Tracking/Camera";

function App() {
  let kp;

  const [isloaded, setisloaded] = useState(false);
  // console.log(kp);
  // let position;

  const mapJoints = (keypoints) => {
    kp = keypoints;
  };

  const getJoints = () => {
    return kp;
  };

  // console.log(kp);
  return (
    <div className="App">
      <header className="App-header">
        <Camera mapJoints={mapJoints} setdetected={setisloaded} />
        <Canvas
          camera={{ position: [0, 0, 2], fov: 60 }}
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
        >
          <Suspense fallback={<Loading />}>
            {isloaded ? <ThreeD getJoints={getJoints} /> : <></>}
          </Suspense>
          <ambientLight args={["#ffffff", 1]} />
        </Canvas>
      </header>
    </div>
  );
}

export default App;
