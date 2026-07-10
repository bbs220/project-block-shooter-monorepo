import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useTweakpane } from "../../hooks/useTweakPane";

const PrimaryCanvas = () => {
  const { sceneColor, boxColor } = useTweakpane({
    sceneColor: "#404040",
    boxColor: "#00ffff",
  });

  return (
    <Canvas shadows={`variance`}>
      <color attach="background" args={[sceneColor]} />
      <PerspectiveCamera makeDefault position={[0, 5, 10]} />
      <OrbitControls makeDefault />
      <ambientLight color={`#ffffff`} intensity={0.8} />
      <directionalLight
        position={[0, 5, 0]}
        color={`#ffff00`}
        intensity={1}
        castShadow
      />

      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={boxColor} />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color={`#ffffff`} />
      </mesh>
    </Canvas>
  );
};

export default PrimaryCanvas;
