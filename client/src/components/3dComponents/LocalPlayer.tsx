import { useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { useGameStore } from "../../stores/useGameStore";
import { WEAPONS } from "../../utils/weapons";

// track key states outside the component to avoid re-renders
const keys = { w: false, a: false, s: false, d: false };

export default function LocalPlayer() {
  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const channel = useGameStore((state) => state.channel);

  const lastEmit = useRef(0);
  const initialized = useRef(false);
  const lastShotClient = useRef(0);
  const isShooting = useRef(false);
  const triggerReady = useRef(true);
  const burstShotsLeft = useRef(0);

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

      // weapon switching
      if (key === "1" && channel) channel.emit("switchWeapon", "rifle");
      if (key === "2" && channel) channel.emit("switchWeapon", "pistol");
      if (key === "3" && channel) channel.emit("switchWeapon", "burstRifle");

      // reloading
      if (key === "r" && channel) channel.emit("reload");
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys) {
        keys[key as keyof typeof keys] = false;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // 0 is left click
      if (e.button === 0) {
        isShooting.current = true;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 0) {
        isShooting.current = false;
        // reset the trigger so semi/single weapons can fire again
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

    // 1. snap on first load, or if server marks us dead (resets camera on respawn)
    if (me) {
      if (!initialized.current || me.isDead) {
        camera.position.set(me.x, me.y + 1.5, me.z);
        initialized.current = true;
      }
    }

    // true fps standard: w is forward (+1), s is backward (-1)
    const forward = (keys.w ? 1 : 0) - (keys.s ? 1 : 0);

    // invert the a/d input to fix the axis flip
    const right = (keys.a ? 1 : 0) - (keys.d ? 1 : 0);

    let deltaX = 0;
    let deltaZ = 0;

    if (forward !== 0 || right !== 0) {
      const speed = 5 * delta;

      // get the exact direction the camera is looking
      camera.getWorldDirection(frontVector.current);

      // flatten it to the x/z plane so looking up/down doesn't slow you down
      frontVector.current.y = 0;
      frontVector.current.normalize();

      // calculate the exact right direction using a cross product with the world up vector
      sideVector.current
        .crossVectors(camera.up, frontVector.current)
        .normalize();

      // combine them based on user input
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

    const now = performance.now();

    // handle weapon firing modes
    if (me && !me.isDead && !me.isReloading && me.ammo > 0) {
      const weapon = WEAPONS[me.currentWeapon];

      // check if we should initiate a new shot/burst from mouse hold
      if (isShooting.current && channel) {
        if (now - lastShotClient.current >= weapon.fireRate) {
          if (weapon.mode === "auto" || triggerReady.current) {
            // if it's a burst weapon, queue up 3 shots (or whatever ammo is left)
            if (weapon.mode === "burst") {
              burstShotsLeft.current = Math.min(3, me.ammo);
            } else {
              // get the exact mathematical direction of the crosshair
              const dir = new THREE.Vector3();
              camera.getWorldDirection(dir);

              // standard auto/semi/single shot
              channel.emit("shoot", {
                dirX: dir.x,
                dirY: dir.y,
                dirZ: dir.z,
              });
              lastShotClient.current = now;
            }

            // force trigger release for semi/single/burst
            if (weapon.mode !== "auto") {
              triggerReady.current = false;
            }
          }
        }
      }

      // handle the ongoing burst queue completely independently of the mouse button
      if (burstShotsLeft.current > 0 && channel) {
        if (now - lastShotClient.current >= weapon.fireRate) {
          // get the exact mathematical direction of the crosshair
          const dir = new THREE.Vector3();
          camera.getWorldDirection(dir);

          channel.emit("shoot", {
            dirX: dir.x,
            dirY: dir.y,
            dirZ: dir.z,
          });

          lastShotClient.current = now;
          burstShotsLeft.current -= 1;
        }
      }
    }

    // throttle network emission, but send absolute position
    if (channel && now - lastEmit.current > 50) {
      channel.emit("playerInput", {
        yaw: camera.rotation.y,
        pitch: camera.rotation.x,
        x: camera.position.x, // send exact x
        z: camera.position.z, // send exact z
      });
      lastEmit.current = now;
    }
  });

  return <PointerLockControls />;
}
