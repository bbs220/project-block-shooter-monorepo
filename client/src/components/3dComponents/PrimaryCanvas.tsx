import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useTweakpane } from "../../hooks/useTweakPane";
import { useRef } from "react";
import * as THREE from "three";
import BasicShape from "./BasicShape";
import Ground from "./Ground";

const PrimaryScene = () => {
  const { boxColor } = useTweakpane({
    boxColor: "#00ff00",
  });
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta;
      ref.current.rotation.y += delta;
      ref.current.rotation.z += delta;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <OrbitControls makeDefault />
      <ambientLight color="#ffffff" intensity={0.8} />
      <directionalLight
        position={[0, 5, 0]}
        color="#ffffff"
        intensity={1}
        castShadow
      />

      <BasicShape ref={ref} boxColor={boxColor} />

      <Ground />
    </>
  );
};

const PrimaryCanvas = () => {
  const { sceneColor } = useTweakpane({
    sceneColor: "#404040",
  });

  return (
    <Canvas shadows="variance">
      <color attach="background" args={[sceneColor]} />
      <PrimaryScene />
    </Canvas>
  );
};

export default PrimaryCanvas;
