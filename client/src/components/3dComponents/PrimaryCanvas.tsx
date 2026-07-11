import { Canvas } from "@react-three/fiber";
import { useGameStore } from "../../stores/useGameStore";
import { PerspectiveCamera, Text } from "@react-three/drei";
import LocalPlayer from "./LocalPlayer";
import Ground from "./Ground";
import { NetworkManager } from "../NetworkManager";

const PrimaryScene = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);

  return (
    <>
      <PerspectiveCamera makeDefault fov={60} />

      {/* captures mouse and moves camera */}
      <LocalPlayer />

      <ambientLight color="#ffffff" intensity={0.8} />
      <directionalLight position={[0, 5, 0]} intensity={1} castShadow />

      {/* render all players EXCEPT the local one */}
      {Object.entries(players)
        .filter(([id]) => id !== localId)
        .map(([id, pos]) => (
          <group
            key={id}
            position={[pos.x, pos.y, pos.z]}
            rotation={[0, pos.yaw, 0]}
          >
            {/* offset mesh up by 1 so the base rests on the floor (y=0) */}
            <mesh castShadow position={[0, 1, 0]}>
              <capsuleGeometry args={[0.5, 1, 4, 16]} />
              <meshStandardMaterial color={pos.color} />
            </mesh>
            {/* optional: offset text above the capsule */}
            <Text position={[0, 2.5, 0]} fontSize={0.4} color="white">
              {pos.name}
            </Text>
          </group>
        ))}

      <Ground />
    </>
  );
};

const PrimaryCanvas = () => {
  return (
    <>
      {/* network manager runs silently outside the 3d canvas */}
      <NetworkManager />
      <Canvas shadows="variance">
        <color attach="background" args={["#404040"]} />
        <PrimaryScene />
      </Canvas>
    </>
  );
};

export default PrimaryCanvas;
