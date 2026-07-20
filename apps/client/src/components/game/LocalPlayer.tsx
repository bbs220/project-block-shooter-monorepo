import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGameStore } from "../../stores/useGameStore";
import { WEAPONS, movementState, combatState } from "@block-shooter/shared";

export default function LocalPlayer() {
  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const channel = useGameStore((state) => state.channel);
  const setLocked = useGameStore((state) => state.setLocked);
  const setCrosshairSpread = useGameStore((state) => state.setCrosshairSpread);

  const lastEmit = useRef(0);
  const initialized = useRef(false);
  const lastShotClient = useRef(0);
  const triggerReady = useRef(true);
  const burstShotsLeft = useRef(0);
  const currentSpread = useRef(0);

  const PLAYER_HEIGHT = 1.5; // Lock camera to this height

  const direction = useRef(new THREE.Vector3());
  const frontVector = useRef(new THREE.Vector3());
  const sideVector = useRef(new THREE.Vector3());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Write directly to your shared state
      if (key === "w") movementState.forward = true;
      if (key === "s") movementState.backward = true;
      if (key === "a") movementState.left = true;
      if (key === "d") movementState.right = true;
      if (key === "shift") movementState.sprint = true;
      if (key === " ") movementState.jump = true;

      // Weapon switching
      if (key === "1" && channel) channel.emit("switchWeapon", "assaultRifle");
      if (key === "2" && channel) channel.emit("switchWeapon", "pistol");
      if (key === "3" && channel) channel.emit("switchWeapon", "burstRifle");

      // Reloading
      if (key === "r" && channel) channel.emit("reload");
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "w") movementState.forward = false;
      if (key === "s") movementState.backward = false;
      if (key === "a") movementState.left = false;
      if (key === "d") movementState.right = false;
      if (key === "shift") movementState.sprint = false;
      if (key === " ") movementState.jump = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 && useGameStore.getState().isLocked) {
        combatState.isShooting = true;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        combatState.isShooting = false;
        triggerReady.current = true;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [channel]);

  useFrame((state, delta) => {
    if (!localId) return;

    const camera = state.camera;
    const me = players[localId];

    if (me) {
      if (!initialized.current || me.isDead) {
        camera.position.set(me.x, PLAYER_HEIGHT, me.z);
        initialized.current = true;
      }
    }

    if (currentSpread.current > 0) {
      currentSpread.current -= delta * 60;
      if (currentSpread.current < 0) currentSpread.current = 0;
    }

    // --- READ FROM MOVEMENT STATE ---
    const forward =
      (movementState.forward ? 1 : 0) - (movementState.backward ? 1 : 0);
    const right = (movementState.left ? 1 : 0) - (movementState.right ? 1 : 0);

    if (forward !== 0 || right !== 0) {
      // Sprint logic
      const baseSpeed = movementState.sprint ? 8.5 : 5.0;
      const speed = baseSpeed * delta;

      camera.getWorldDirection(frontVector.current);
      frontVector.current.y = 0; // lock vertical look from affecting speed
      frontVector.current.normalize();

      sideVector.current
        .crossVectors(camera.up, frontVector.current)
        .normalize();

      direction.current
        .set(0, 0, 0)
        .addScaledVector(frontVector.current, forward)
        .addScaledVector(sideVector.current, right)
        .normalize()
        .multiplyScalar(speed);

      camera.position.x += direction.current.x;
      camera.position.z += direction.current.z;

      currentSpread.current = Math.min(currentSpread.current + delta * 30, 15);
    }

    // Hard-lock Y position to prevent drift
    camera.position.y = PLAYER_HEIGHT;

    const now = performance.now();

    // --- READ FROM COMBAT STATE ---
    if (me && !me.isDead && !me.isReloading && me.ammo > 0) {
      const weapon = WEAPONS[me.currentWeapon];

      if (combatState.isShooting && channel) {
        if (now - lastShotClient.current >= weapon.fireRate) {
          if (weapon.mode === "auto" || triggerReady.current) {
            if (weapon.mode === "burst") {
              burstShotsLeft.current = Math.min(3, me.ammo);
            } else {
              const dir = new THREE.Vector3();
              camera.getWorldDirection(dir);

              channel.emit("shoot", {
                dirX: dir.x,
                dirY: dir.y,
                dirZ: dir.z,
              });

              lastShotClient.current = now;
              currentSpread.current = Math.min(currentSpread.current + 15, 40);
            }

            if (weapon.mode !== "auto") {
              triggerReady.current = false;
            }
          }
        }
      }

      if (burstShotsLeft.current > 0 && channel) {
        if (now - lastShotClient.current >= weapon.fireRate) {
          const dir = new THREE.Vector3();
          camera.getWorldDirection(dir);

          channel.emit("shoot", {
            dirX: dir.x,
            dirY: dir.y,
            dirZ: dir.z,
          });

          lastShotClient.current = now;
          burstShotsLeft.current -= 1;
          currentSpread.current = Math.min(currentSpread.current + 15, 40);
        }
      }
    }

    setCrosshairSpread(currentSpread.current);

    if (channel && now - lastEmit.current > 50) {
      channel.emit("playerInput", {
        yaw: camera.rotation.y,
        pitch: camera.rotation.x,
        x: camera.position.x,
        y: 1.0, // Hardcoded center of body for flat-plane physics
        z: camera.position.z,
      });
      lastEmit.current = now;
    }
  });

  return (
    <PointerLockControls
      selector="#play-button"
      onLock={() => setLocked(true)}
      onUnlock={() => setLocked(false)}
    />
  );
}
