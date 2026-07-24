import { useEffect, useRef } from "react";
import { MathUtils } from "three";

export function useEquipAnimation(currentWeapon: string) {
  const equipYOffset = useRef(-0.6);

  useEffect(() => {
    equipYOffset.current = -0.6;
  }, [currentWeapon]);

  // return a function that useFrame will call every tick
  const update = () => {
    equipYOffset.current = MathUtils.lerp(equipYOffset.current, 0, 0.15);
    return equipYOffset.current;
  };

  return update;
}

export function useStrafeSway(isAiming: boolean) {
  const targetTilt = useRef(0);
  const currentTilt = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "a") targetTilt.current = 0.08;
      if (e.key.toLowerCase() === "d") targetTilt.current = -0.08;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "a" && targetTilt.current > 0)
        targetTilt.current = 0;
      if (e.key.toLowerCase() === "d" && targetTilt.current < 0)
        targetTilt.current = 0;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const update = () => {
    currentTilt.current = MathUtils.lerp(
      currentTilt.current,
      targetTilt.current,
      0.1,
    );
    const adsMultiplier = isAiming ? 0.2 : 1.0;
    return currentTilt.current * adsMultiplier;
  };

  return update;
}

export function useMouseSway(isAiming: boolean) {
  // raw mouse movement
  const mouseDeltaX = useRef(0);
  // smoothed, interpolated sway value
  const currentSway = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // capture movement if we are actually playing (pointer locked)
      if (document.pointerLockElement) {
        // forces the value negative when turning right, causing the gun to drag left
        mouseDeltaX.current = MathUtils.clamp(
          e.movementX * -0.002,
          -0.15,
          0.15,
        );
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const update = () => {
    // decay the raw mouse delta rapidly back to 0 when the mouse stops moving
    mouseDeltaX.current = MathUtils.lerp(mouseDeltaX.current, 0, 0.2);

    // mmoothly interpolate our visual sway towards that mouse delta
    // changing 0.15 controls how "heavy" the gun feels. Lower = heavier/laggier.
    currentSway.current = MathUtils.lerp(
      currentSway.current,
      mouseDeltaX.current,
      0.15,
    );

    // tighten it up significantly when Aiming Down Sights
    const adsMultiplier = isAiming ? 0.1 : 1.0;

    return currentSway.current * adsMultiplier;
  };

  return update;
}

export function useIdleSway(isAiming: boolean) {
  const time = useRef(0);

  // pass 'delta' in from useFrame so the breathing is framerate-independent
  const update = (delta: number) => {
    time.current += delta;

    // tighten the breathing significantly if aiming down sights
    const adsMultiplier = isAiming ? 0.1 : 1.0;

    // sine and cosine to create a smooth, continuous figure-8 floating effect
    return {
      y: Math.sin(time.current * 1.5) * 0.005 * adsMultiplier,
      x: Math.cos(time.current * 1.2) * 0.002 * adsMultiplier,
    };
  };

  return update;
}

export function useRecoil() {
  const recoilZ = useRef(0); // kickback towards camera
  const recoilRotX = useRef(0); // muzzle climb upwards

  useEffect(() => {
    // listen for a custom event that we will fire when clicking the mouse
    const onShoot = () => {
      // impulse on shoot. Math.min prevents the gun from flying through your face if you spam click
      recoilZ.current = Math.min(recoilZ.current + 0.06, 0.15);
      recoilRotX.current = Math.min(recoilRotX.current + 0.08, 0.25);
    };

    window.addEventListener("weapon-fired", onShoot);
    return () => window.removeEventListener("weapon-fired", onShoot);
  }, []);

  const update = () => {
    // smoothly spring the weapon back to 0 resting position every frame
    recoilZ.current = MathUtils.lerp(recoilZ.current, 0, 0.15);
    recoilRotX.current = MathUtils.lerp(recoilRotX.current, 0, 0.1);

    return { z: recoilZ.current, rotX: recoilRotX.current };
  };

  return update;
}
