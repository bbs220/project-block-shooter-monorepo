import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useRef } from "react";
import { useGameStore } from "../../stores/useGameStore";

export default function LocalPlayer() {
  const { camera } = useThree();
  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const channel = useGameStore((state) => state.channel);

  const lastEmit = useRef(0);

  useFrame(() => {
    if (!localId) return;

    const me = players[localId];
    if (me) {
      // eye level offset for a 2-unit tall capsule
      camera.position.set(me.x, me.y + 1.5, me.z);
    }

    // throttle network emission to roughly 20hz to prevent flooding
    const now = performance.now();
    if (channel && now - lastEmit.current > 50) {
      channel.emit("look", {
        yaw: camera.rotation.y,
        pitch: camera.rotation.x,
      });
      lastEmit.current = now;
    }
  });

  return <PointerLockControls />;
}
