import { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../stores/useGameStore";
import { useTweakpane } from "../../hooks/useTweakPane";
import { modelsBank } from "../../utils/assetPaths";

export default function WeaponViewModel() {
  const groupRef = useRef<Group>(null);

  // Active weapon for the local player
  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const me = localId ? players[localId] : null;
  const currentWeapon = me?.currentWeapon || "assaultRifle";

  // Preload/load current GLTF
  const modelPath = modelsBank[currentWeapon] || modelsBank.assaultRifle;
  const { scene } = useGLTF(modelPath);

  // Controls for fine-tuning resting transform
  const { posX, posY, posZ, rotX, rotY, rotZ, scale } = useTweakpane({
    posX: 0.29,
    posY: -0.09,
    posZ: -0.52,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    scale: 0.16,
  });

  // 1. Vertical offset tracker for the equip animation (starts dropped down)
  const equipYOffset = useRef(-0.6);

  // 2. Whenever the current weapon changes, kick the weapon down instantly!
  useEffect(() => {
    equipYOffset.current = -0.6; // Drop model 0.6 units below screen
  }, [currentWeapon]);

  useFrame(() => {
    if (!groupRef.current) return;

    // 3. Smoothly glides the weapon back up to 0 (resting height)
    // 0.15 controls the speed of the equip motion
    equipYOffset.current = MathUtils.lerp(equipYOffset.current, 0, 0.15);

    // Apply resting position + equip animation offset
    groupRef.current.position.set(posX, posY + equipYOffset.current, posZ);

    groupRef.current.rotation.set(rotX, rotY, rotZ);
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[scale, scale, scale]} />
    </group>
  );
}

// Preload all models so there's zero lag/hitch when switching
Object.values(modelsBank).forEach((path) => useGLTF.preload(path));
