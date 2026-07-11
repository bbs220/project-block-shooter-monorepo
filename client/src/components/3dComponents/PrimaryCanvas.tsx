import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import { useTweakpane } from "../../hooks/useTweakPane";
import Ground from "./Ground";
import { useGameStore } from "../../stores/useGameStore";
import { NetworkManager } from "../NetworkManager";

const PrimaryScene = () => {
  // pull authoritative player coordinates from zustand
  const players = useGameStore((state) => state.players);

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

      {/* render all networked players based on server coordinates */}
      {Object.entries(players).map(([id, pos]) => (
        <group key={id} position={[pos.x, pos.y, pos.z]}>
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={pos.color} />
          </mesh>
          <Text position={[0, 1.5, 0]} fontSize={0.5} color="white">
            {pos.name}
          </Text>
        </group>
      ))}
      <Ground />
    </>
  );
};

const PrimaryCanvas = () => {
  const { sceneColor } = useTweakpane({
    sceneColor: "#404040",
  });

  return (
    <>
      {/* network manager runs silently outside the 3d canvas */}
      <NetworkManager />
      <Canvas shadows="variance">
        <color attach="background" args={[sceneColor]} />
        <PrimaryScene />
      </Canvas>
    </>
  );
};

export default PrimaryCanvas;
