import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGameStore } from "../../stores/useGameStore";

// track key states outside the component to avoid re-renders
const keys = { w: false, a: false, s: false, d: false };

export default function LocalPlayer() {
  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const channel = useGameStore((state) => state.channel);

  const lastEmit = useRef(0);
  const initialized = useRef(false);

  // vector caches to avoid garbage collection stuttering
  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());

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

  useFrame((state, delta) => {
    if (!localId) return;

    const camera = state.camera;
    const me = players[localId];

    // only snap to server position on the very first spawn to get the initial coordinates
    if (me && !initialized.current) {
      camera.position.set(me.x, me.y + 1.5, me.z);
      initialized.current = true;
    }

    // true fps standard: w is forward (+1), s is backward (-1)
    const forward = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);

    // invert the a/d input to fix the axis flip
    const right = (keys.a ? 1 : 0) - (keys.d ? 1 : 0);

    let deltaX = 0;
    let deltaZ = 0;

    if (forward !== 0 || right !== 0) {
      const speed = 5 * delta;

      // 1. get the exact direction the camera is looking
      camera.getWorldDirection(frontVector.current);

      // 2. flatten it to the x/z plane so looking up/down doesn't slow you down
      frontVector.current.y = 0;
      frontVector.current.normalize();

      // 3. calculate the exact right direction using a cross product with the world up vector
      sideVector.current
        .crossVectors(camera.up, frontVector.current)
        .normalize();

      // 4. combine them based on user input
      direction.current
        .set(0, 0, 0)
        .addScaledVector(frontVector.current, forward)
        .addScaledVector(sideVector.current, right)
        .normalize()
        .multiplyScalar(speed);

      deltaX = direction.current.x;
      deltaZ = direction.current.z;

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
