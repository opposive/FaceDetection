import { useFrame, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { useRef, useState } from "react";

const ThreeD = ({ getJoints, getPosition }) => {
  // console.log("success");
  const fbx = useLoader(FBXLoader, "assets/3dobjects/Glass-1__cv1.fbx");
  const boxRef = useRef();

  const [kpstate, setkpstate] = useState(false);

  let kp;

  const normalize = (min, max, val) => {
    return ((val - min) / (max - min)) * Math.PI;
  };

  const getYRotation = (p1, p2, p3) => {
    let e1 = Math.abs(p1.x - p3.x);
    let e2 = Math.abs(p2.x - p3.x);
    return normalize(-190, 190, e2 - e1) - Math.PI / 2;
  };

  const getZRotation = (p1, p2) => {
    let e1 = Math.abs(p1.y);
    let e2 = Math.abs(p2.y);
    return normalize(-190, 190, e2 - e1) - Math.PI / 2;
  };

  console.log(kp);

  useFrame((state) => {
    requestAnimationFrame(() => {
      kp = getJoints();
    });

    console.log(typeof kp);
    // if (kp !== null && kp !== undefined) {
    //   setkpstate(true);
    // }

    // console.log(kpstate);

    // console.log(state);
    if (kp !== undefined && kp !== null && kp.length > 0) {
      kp.forEach((p) => {
        let maskbox = p.box;
        let maskpoint = p.keypoints[6];
        let x = maskpoint.x;
        let y = maskpoint.y;

        let mskwidth = maskbox.width;

        // console.log("this is z" + z);
        // console.log(mskwidth);

        // console.log(boxRef);

        boxRef.current.children.length >= 0
          ? boxRef.current.children.forEach(() => {
              requestAnimationFrame(() => {
                boxRef.current.children[0].scale.x = (mskwidth / 180) * 0.0008;
                boxRef.current.children[0].scale.y = (mskwidth / 180) * 0.0008;
                boxRef.current.children[0].scale.z = (mskwidth / 180) * 0.0008;

                boxRef.current.children[0].position.x = ((x - 320) / 320) * 1.6;
                boxRef.current.children[0].position.y =
                  -((y - 240) / 240) * 1.5;

                boxRef.current.children[0].rotation.y = -getYRotation(
                  p.keypoints[143],
                  p.keypoints[372],
                  p.keypoints[6]
                );
                boxRef.current.children[0].rotation.z = -getZRotation(
                  p.keypoints[143],
                  p.keypoints[372]
                );
              });
            })
          : console.log("small");
      });
    }
  });
  return (
    <>
      <group ref={boxRef}>
        <mesh scale={[0.0008, 0.0008, 0.0008]}>
          <primitive object={fbx} />
          <meshStandardMaterial color={"blue"} />
        </mesh>
      </group>
    </>
  );
};

export default ThreeD;
