import { useEffect, useRef } from "react";
import { MathUtils } from "three";

export function useEquipAnimation(currentWeapon: string) {
  const equipYOffset = useRef(-0.6);

  useEffect(() => {
    equipYOffset.current = -0.6; // Drop down when weapon changes
  }, [currentWeapon]);

  // We return a function that useFrame will call every tick
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
  // Store the raw mouse movement
  const mouseDeltaX = useRef(0);
  // Store the smoothed, interpolated sway value
  const currentSway = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Only capture movement if we are actually playing (pointer locked)
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
    // 1. Decay the raw mouse delta rapidly back to 0 when the mouse stops moving
    mouseDeltaX.current = MathUtils.lerp(mouseDeltaX.current, 0, 0.2);

    // 2. Smoothly interpolate our visual sway towards that mouse delta
    // Changing 0.15 controls how "heavy" the gun feels. Lower = heavier/laggier.
    currentSway.current = MathUtils.lerp(
      currentSway.current,
      mouseDeltaX.current,
      0.15,
    );

    // 3. Tighten it up significantly when Aiming Down Sights
    const adsMultiplier = isAiming ? 0.1 : 1.0;

    return currentSway.current * adsMultiplier;
  };

  return update;
}
