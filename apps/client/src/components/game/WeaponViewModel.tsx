import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../stores/useGameStore";
import { useTweakpane } from "../../hooks/useTweakPane";
import { modelsBank } from "../../utils/assetPaths";
import { combatState } from "@block-shooter/shared";

export default function WeaponViewModel() {
  const groupRef = useRef<Group>(null);

  // active weapon for the local player
  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const me = localId ? players[localId] : null;
  const currentWeapon = me?.currentWeapon || "assaultRifle";

  // preload current glb
  const modelPath = modelsBank[currentWeapon] || modelsBank.assaultRifle;
  const { scene } = useGLTF(modelPath);

  const { posX, posY, posZ, adsX, adsY, adsZ, rotX, rotY, rotZ, scale } =
    useTweakpane({
      // hip-fire
      posX: 0.29,
      posY: -0.09,
      posZ: -0.52,

      // ads
      adsX: 0.0,
      adsY: -0.6,
      adsZ: -0.4,

      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scale: 0.16,
    });

  // vertical offset tracker for the equip animation
  const equipYOffset = useRef(-0.6);

  useEffect(() => {
    equipYOffset.current = -0.6; // drop model when switching
  }, [currentWeapon]);

  useFrame(() => {
    if (!groupRef.current) return;

    // handle equip vertical animation
    equipYOffset.current = MathUtils.lerp(equipYOffset.current, 0, 0.15);

    // determine target position based on whether player is aiming
    const targetX = combatState.isAiming ? adsX : posX;
    const targetY = combatState.isAiming ? adsY : posY;
    const targetZ = combatState.isAiming ? adsZ : posZ;

    // smoothly LERP the current position towards the target position
    // add equipYOffset to targetY so the "pull out" animation works even if you hold right-click while switching!
    groupRef.current.position.x = MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      0.15,
    );
    groupRef.current.position.y = MathUtils.lerp(
      groupRef.current.position.y,
      targetY + equipYOffset.current,
      0.15,
    );
    groupRef.current.position.z = MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.15,
    );

    groupRef.current.rotation.set(rotX, rotY, rotZ);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[scale, scale, scale]} />
    </group>
  );
}

Object.values(modelsBank).forEach((path) => useGLTF.preload(path));
