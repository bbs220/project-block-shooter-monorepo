import { Canvas } from "@react-three/fiber";

import { useTweakpane } from "../../hooks/useTweakPane";
import { useGameStore } from "../../stores/useGameStore";
import { PerspectiveCamera } from "@react-three/drei";
import LocalPlayer from "./LocalPlayer";
import Ground from "./Ground";
import { NetworkManager } from "../NetworkManager";

const PrimaryScene = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);

  return (
    <>
      <PerspectiveCamera makeDefault fov={75} />

      {/* captures mouse and moves camera */}
      <LocalPlayer />

      <ambientLight color="#ffffff" intensity={0.8} />
      <directionalLight position={[0, 5, 0]} intensity={1} castShadow />

      {/* render all players EXCEPT the local one */}
      {Object.entries(players)
        .filter(([id]) => id !== localId)
        .map(([id, pos]) => (
          <group key={id} position={[pos.x, pos.y, pos.z]}>
            <mesh castShadow>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={pos.color} />
            </mesh>
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
