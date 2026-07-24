import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Group, MathUtils } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../stores/useGameStore";
import { useTweakpane } from "../../hooks/useTweakPane";
import { modelsBank } from "../../utils/assetPaths";
import { combatState } from "@block-shooter/shared";
import {
  useEquipAnimation,
  useMouseSway,
  useStrafeSway,
} from "../../hooks/useWeaponAnimations";

export default function WeaponViewModel() {
  const groupRef = useRef<Group>(null);

  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const me = localId ? players[localId] : null;
  const currentWeapon = me?.currentWeapon || "assaultRifle";

  const { scene } = useGLTF(
    modelsBank[currentWeapon] || modelsBank.assaultRifle,
  );

  const { posX, posY, posZ, adsX, adsY, adsZ, rotX, rotY, rotZ, scale } =
    useTweakpane({
      posX: 0.29,
      posY: -0.09,
      posZ: -0.52,
      adsX: 0.0,
      adsY: -0.12,
      adsZ: -0.4,
      rotX: 0,
      rotY: 0,
      rotZ: 0,
      scale: 0.16,
    });

  const getEquipOffset = useEquipAnimation(currentWeapon);
  const getStrafeRoll = useStrafeSway(combatState.isAiming);
  const getMouseSway = useMouseSway(combatState.isAiming);

  useFrame(() => {
    if (!groupRef.current) return;

    // calculate Targets
    const targetX = combatState.isAiming ? adsX : posX;
    const targetY = combatState.isAiming ? adsY : posY;
    const targetZ = combatState.isAiming ? adsZ : posZ;

    // fetch modular animation offsets
    const equipOffset = getEquipOffset();
    const strafeRoll = getStrafeRoll();
    const mouseSway = getMouseSway();

    // add mouseSway to the X position so the gun shifts slightly left/right on screen
    groupRef.current.position.set(
      MathUtils.lerp(
        groupRef.current.position.x,
        targetX + mouseSway * 0.5,
        0.15,
      ),
      MathUtils.lerp(groupRef.current.position.y, targetY + equipOffset, 0.15),
      MathUtils.lerp(groupRef.current.position.z, targetZ, 0.15),
    );

    // apply mouseSway to the Y rotation (yaw) and blend it with strafeRoll on the Z rotation (roll)
    groupRef.current.rotation.set(
      rotX,
      rotY - mouseSway, // yaw lag: gun points slightly away from the turn direction
      rotZ + strafeRoll + mouseSway * 0.5, // roll tilt: blend A/D tilt with mouse tilt
    );
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[scale, scale, scale]} />
    </group>
  );
}

Object.values(modelsBank).forEach((path) => useGLTF.preload(path));
