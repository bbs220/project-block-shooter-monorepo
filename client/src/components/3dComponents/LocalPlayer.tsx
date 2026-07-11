import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import { useGameStore } from "../../stores/useGameStore";

// track key states outside the component to avoid re-renders
const keys = { w: false, a: false, s: false, d: false };

export default function LocalPlayer() {
  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const channel = useGameStore((state) => state.channel);

  const lastEmit = useRef(0);
  const initialized = useRef(false);

  useEffect(() => {
    // continuously track which keys are currently held down
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys) {
        keys[key as keyof typeof keys] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys) {
        keys[key as keyof typeof keys] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // pull camera directly from the frame state to bypass compiler errors
  useFrame((state, delta) => {
    if (!localId) return;

    const camera = state.camera;
    const me = players[localId];

    // only snap to server position on the very first spawn to get the initial coordinates
    if (me && !initialized.current) {
      camera.position.set(me.x, me.y + 1.5, me.z);
      initialized.current = true;
    }

    // calculate raw input direction (-1 to 1)
    const moveZ = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
    const moveX = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);

    let deltaX = 0;
    let deltaZ = 0;

    if (moveX !== 0 || moveZ !== 0) {
      const yaw = camera.rotation.y;
      const speed = 5 * delta; // 5 units per second

      // rotate the movement vector by the camera's yaw using trig
      deltaX = (moveX * Math.cos(yaw) + moveZ * Math.sin(yaw)) * speed;
      deltaZ = (moveZ * Math.cos(yaw) - moveX * Math.sin(yaw)) * speed;

      // client-side prediction: instantly move local camera
      camera.position.x += deltaX;
      camera.position.z += deltaZ;
    }

    // throttle network emission to roughly 20hz
    const now = performance.now();
    if (channel && now - lastEmit.current > 50) {
      // bundle movement and look data into one payload
      channel.emit("playerInput", {
        yaw: camera.rotation.y,
        pitch: camera.rotation.x,
        moveX: deltaX,
        moveZ: deltaZ,
      });
      lastEmit.current = now;
    }
  });

  return <PointerLockControls />;
}
