import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Group } from "three";
import { useGameStore } from "../../stores/useGameStore";
import { useTweakpane } from "../../hooks/useTweakPane";
import { modelsBank } from "../../utils/assetPaths";

export default function WeaponViewModel() {
  const groupRef = useRef<Group>(null);

  // active weapon for the local player
  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const me = localId ? players[localId] : null;
  const currentWeapon = me?.currentWeapon || "assaultRifle";

  // preload/load the current GLTF
  const modelPath = modelsBank[currentWeapon] || modelsBank.assaultRifle;
  const { scene } = useGLTF(modelPath);

  // controls for fine-tuning offset & rotation
  const { posX, posY, posZ, rotX, rotY, rotZ, scale } = useTweakpane({
    posX: 0.3,
    posY: -0.1,
    posZ: -0.5,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    scale: 0.4,
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={scene}
        position={[posX, posY, posZ]}
        rotation={[rotX, rotY, rotZ]}
        scale={[scale, scale, scale]}
      />
    </group>
  );
}

// pre-load models to prevent hitching on weapon switch
Object.values(modelsBank).forEach((path) => useGLTF.preload(path));
