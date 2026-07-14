import { Canvas } from "@react-three/fiber";
import { useGameStore } from "../../stores/useGameStore";
import { PerspectiveCamera } from "@react-three/drei";
import LocalPlayer from "./LocalPlayer";
import Ground from "./Ground";
import { NetworkManager } from "../NetworkManager";
import CrosshairUI from "./CrosshairUI";
import PlayerLabel from "./PlayerLabel";
import { Physics, RigidBody } from "@react-three/rapier";
import { useTweakpane } from "../../hooks/useTweakPane";

const PrimaryScene = () => {
  const players = useGameStore((state) => state.players);
  const localId = useGameStore((state) => state.localId);

  const { showPhyDebug } = useTweakpane({
    showPhyDebug: false,
  });

  return (
    <>
      <Physics debug={showPhyDebug}>
        <PerspectiveCamera makeDefault fov={60} />

        {/* captures mouse and moves camera */}
        <LocalPlayer />

        <ambientLight color="#ffffff" intensity={0.8} />
        <directionalLight position={[0, 5, 0]} intensity={1} castShadow />

        {/* render all players EXCEPT the local one */}
        {Object.entries(players)
          .filter(([id, pos]) => id !== localId && !pos.isDead)
          .map(([id, pos]) => (
            <RigidBody
              key={id}
              type="kinematicPosition"
              position={[pos.x, pos.y, pos.z]}
            >
              <group rotation={[0, pos.yaw, 0]}>
                <mesh castShadow position={[0, 1, 0]}>
                  <capsuleGeometry args={[0.5, 1, 4, 16]} />
                  <meshStandardMaterial color={pos.color} />
                </mesh>
                <PlayerLabel player={pos} />
              </group>
            </RigidBody>
          ))}

        <Ground />
      </Physics>
    </>
  );
};

const PrimaryCanvas = () => {
  return (
    <>
      <CrosshairUI />
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
