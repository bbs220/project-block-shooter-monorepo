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
  useIdleSway,
  useMouseSway,
  useRecoil,
  useReloadAnimation,
  useStrafeSway,
} from "../../hooks/useWeaponAnimations";

export default function WeaponViewModel() {
  const groupRef = useRef<Group>(null);

  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const me = localId ? players[localId] : null;
  const currentWeapon = me?.currentWeapon || "assaultRifle";
  const isReloading = me?.isReloading || false;

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
  const getIdleSway = useIdleSway(combatState.isAiming);
  const getRecoil = useRecoil();
  const getReloadAnim = useReloadAnimation(isReloading);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const targetX = combatState.isAiming ? adsX : posX;
    const targetY = combatState.isAiming ? adsY : posY;
    const targetZ = combatState.isAiming ? adsZ : posZ;

    // fetch modular offsets
    const equipOffset = getEquipOffset();
    const strafeRoll = getStrafeRoll();
    const mouseSway = getMouseSway();
    const idleSway = getIdleSway(delta);
    const recoil = getRecoil();
    const reloadAnim = getReloadAnim(delta);

    // apply final blended transforms
    groupRef.current.position.set(
      MathUtils.lerp(
        groupRef.current.position.x,
        targetX + mouseSway * 0.5 + idleSway.x,
        0.15,
      ) + reloadAnim.pos.x,
      MathUtils.lerp(
        groupRef.current.position.y,
        targetY + equipOffset + idleSway.y + recoil.y,
        0.15,
      ) + reloadAnim.pos.y,
      MathUtils.lerp(groupRef.current.position.z, targetZ + recoil.z, 0.15) +
        reloadAnim.pos.z,
    );

    groupRef.current.rotation.set(
      rotX - recoil.rotX + reloadAnim.rot.x,
      rotY - mouseSway + reloadAnim.rot.y,
      rotZ + strafeRoll + mouseSway * 0.5 + reloadAnim.rot.z,
    );
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[scale, scale, scale]} />
    </group>
  );
}

Object.values(modelsBank).forEach((path) => useGLTF.preload(path));
