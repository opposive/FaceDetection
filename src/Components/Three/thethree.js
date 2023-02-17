import { useFrame, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import React, { useMemo, useRef } from "react";

const ThreeD = ({ getJoints }) => {
  console.log("trued");
  // console.log("success");
  const fbx = useLoader(FBXLoader, "assets/3dobjects/Glass-1__cv1.fbx");
  const boxRef = useRef();

  const revref = useRef([]);
  revref.current = [];

  const addtorefs = (el) => {
    console.log(el);
    if (el && !revref.current.includes(el)) {
      console.log("this is el");
      revref.push(el);
    }
  };

  function isIterable(input) {
    if (input === null || input === undefined) {
      return false;
    }

    return true;
  }

  let kp = [];

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

  // console.log(kp);
  const refsById = useMemo(() => {
    const refs = {};
    kp !== undefined
      ? kp.forEach((e, i) => {
          // console.log("more than one");
          refs[i] = React.createRef(null);
        })
      : (refs[0] = boxRef);
    return refs;
  }, [kp]);

  const refs = {};

  useFrame(() => {
    kp = getJoints();
    // console.log(kp);
    // kp?.forEach((e, i) => {
    //   console.log("more than one");
    //   refs[i] = React.createRef(null);
    // });

    if (kp !== undefined && kp !== null) {
      // console.log(kp);
      kp.forEach((p, i) => {
        console.log(i);
        let maskpoint = p.keypoints[6];
        let x = maskpoint.x;
        let y = maskpoint.y;
        let z = maskpoint.z;
        console.log(refsById);
        refsById[i].current.position.x = ((x - 320) / 320) * 2;
        refsById[i].current.position.y = -((y - 240) / 240) * 2;
        refsById[i].current.position.z = (-z / 240) * 2;
        refsById[i].current.rotation.y = -getYRotation(
          p.keypoints[143],
          p.keypoints[372],
          p.keypoints[6]
        );
        refsById[i].current.rotation.z = -getZRotation(
          p.keypoints[143],
          p.keypoints[372]
        );
      });
    }
  });

  return (
    <>
      {kp !== undefined ? (
        kp.forEach((e, i) => {
          // console.log(revref.current);
          return (
            <group ref={refsById[i]}>
              <mesh scale={[0.0008, 0.0008, 0.0008]}>
                <primitive object={fbx} />
                <meshStandardMaterial color={"blue"} />
              </mesh>
            </group>
          );
        })
      ) : (
        <group ref={refsById[0]}>
          <mesh scale={[0.0008, 0.0008, 0.0008]}>
            <primitive object={fbx} />
            <meshStandardMaterial color={"blue"} />
          </mesh>
        </group>
      )}
    </>
  );
};

export default ThreeD;
