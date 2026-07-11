import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useTweakpane } from "../../hooks/useTweakPane";
import { useRef } from "react";
import * as THREE from "three";
import BasicShape from "./BasicShape";
import Ground from "./Ground";

const PrimaryScene = ({ boxColor }: { boxColor: string }) => {
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
        color="#ffff00"
        intensity={1}
        castShadow
      />

      <BasicShape ref={ref} boxColor={boxColor} />

      <Ground />
    </>
  );
};

const PrimaryCanvas = () => {
  const { sceneColor, boxColor } = useTweakpane({
    sceneColor: "#404040",
    boxColor: "#00ffff",
  });

  return (
    <Canvas shadows="variance">
      <color attach="background" args={[sceneColor]} />
      <PrimaryScene boxColor={boxColor} />
    </Canvas>
  );
};

export default PrimaryCanvas;
