import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useGameStore } from "../../stores/useGameStore";

export default function LocalPlayer() {
  const { camera } = useThree();
  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);

  useFrame(() => {
    if (!localId) return;

    const me = players[localId];
    if (me) {
      // snap camera to the server's authoritative position
      // add 0.5 to y so the camera is at "eye level" instead of the floor
      camera.position.set(me.x, me.y + 0.5, me.z);
    }
  });

  return <PointerLockControls />;
}
