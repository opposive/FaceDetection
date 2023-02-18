import { useFrame, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useRef } from "react";

const ThreeD = ({ getJoints, getPosition }) => {
  // console.log("success");
  const fbx = useLoader(FBXLoader, "assets/3dobjects/Glass-1__cv1.fbx");
  const boxRef = useRef();

  let kp;

  const normalize = (min, max, val) => {
    return ((val - min) / (max - min)) * Math.PI;
  };

  const getYRotation = (p1, p2, p3) => {
    let e1 = Math.abs(p1.x - p3.x);
    let e2 = Math.abs(p2.x - p3.x);
    return normalize(-100, 100, e2 - e1) - Math.PI / 2;
  };

  const getZRotation = (p1, p2) => {
    let e1 = Math.abs(p1.y);
    let e2 = Math.abs(p2.y);
    return normalize(-150, 150, e2 - e1) - Math.PI / 2;
  };

  useFrame((state) => {
    kp = getJoints();
    // console.log(state);
    if (kp !== undefined && kp !== null) {
      kp.forEach((p) => {
        let maskbox = p.box;
        let maskpoint = p.keypoints[6];
        let x = maskpoint.x;
        let y = maskpoint.y;

        let mskwidth = maskbox.width;

        // console.log("this is z" + z);
        console.log(boxRef.current.scale);
        // console.log(mskwidth);

        boxRef.current.scale.x = (mskwidth / 150) * 0.0008;
        boxRef.current.scale.y = (mskwidth / 150) * 0.0008;
        boxRef.current.scale.z = (mskwidth / 150) * 0.0008;

        boxRef.current.position.x = ((x - 320) / 320) * 1.6;
        boxRef.current.position.y = -((y - 240) / 240) * 1.5;

        boxRef.current.rotation.y = -getYRotation(
          p.keypoints[143],
          p.keypoints[372],
          p.keypoints[6]
        );
        boxRef.current.rotation.z = -getZRotation(
          p.keypoints[143],
          p.keypoints[372]
        );
      });
    }
  });
  return (
    <>
      <group>
        <mesh ref={boxRef} scale={[0.0008, 0.0008, 0.0008]}>
          <primitive object={fbx} />
          <meshStandardMaterial color={"blue"} />
        </mesh>
      </group>
    </>
  );
};

export default ThreeD;
