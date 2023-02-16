import { Html, useProgress } from "@react-three/drei";

const Loading = () => {
  const { progress } = useProgress();
  console.log("Loading");
  return <Html center>{progress} % loaded</Html>;
};

export default Loading;
