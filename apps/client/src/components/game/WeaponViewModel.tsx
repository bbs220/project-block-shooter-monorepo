import { useEffect, useRef } from "react";
import { Clone, useGLTF } from "@react-three/drei";
import { Group, MathUtils, Object3D, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../stores/useGameStore";
import { modelsBank } from "../../utils/assetPaths";
import { combatState, type WeaponId } from "@block-shooter/shared";
import {
  useEquipAnimation,
  useIdleSway,
  useMouseSway,
  useRecoil,
  useMagazineReload,
  useStrafeSway,
} from "../../hooks/useWeaponAnimations";

type WeaponTransform = {
  posX: number;
  posY: number;
  posZ: number;
  adsX: number;
  adsY: number;
  adsZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
};

const WEAPON_TRANSFORMS: Record<WeaponId, WeaponTransform> = {
  assaultRifle: {
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
  },
  pistol: {
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
  },
  burstRifle: {
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
  },
};

export default function WeaponViewModel() {
  const groupRef = useRef<Group>(null);

  const localId = useGameStore((state) => state.localId);
  const players = useGameStore((state) => state.players);
  const me = localId ? players[localId] : null;
  const currentWeapon = (me?.currentWeapon as WeaponId) || "assaultRifle";
  const isReloading = me?.isReloading || false;

  const { scene } = useGLTF(
    modelsBank[currentWeapon] || modelsBank.assaultRifle,
  );

  const magNodeRef = useRef<Object3D | null>(null);
  const originalMagPos = useRef(new Vector3());

  useEffect(() => {
    let found: Object3D | null = null;

    scene.traverse((child) => {
      if (child.name.toLowerCase().includes("mag")) {
        found = child;
      }
    });

    magNodeRef.current = found;

    if (found) {
      originalMagPos.current.copy((found as Object3D).position);
    }
  }, [scene]);

  // read transforms directly from our static config based on the current weapon
  const { posX, posY, posZ, adsX, adsY, adsZ, rotX, rotY, rotZ, scale } =
    WEAPON_TRANSFORMS[currentWeapon] || WEAPON_TRANSFORMS.assaultRifle;

  const getEquipOffset = useEquipAnimation(currentWeapon);
  const getStrafeRoll = useStrafeSway(combatState.isAiming);
  const getMouseSway = useMouseSway(combatState.isAiming);
  const getIdleSway = useIdleSway(combatState.isAiming);
  const getRecoil = useRecoil();
  const getMagDrop = useMagazineReload(isReloading);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const targetX = combatState.isAiming ? adsX : posX;
    const targetY = combatState.isAiming ? adsY : posY;
    const targetZ = combatState.isAiming ? adsZ : posZ;

    const equipOffset = getEquipOffset();
    const strafeRoll = getStrafeRoll();
    const mouseSway = getMouseSway();
    const idleSway = getIdleSway(delta);
    const recoil = getRecoil();
    const magOffset = getMagDrop(delta);

    if (magNodeRef.current) {
      magNodeRef.current.position.y = originalMagPos.current.y + magOffset;
    }

    // final blended transforms without any main-weapon reload dip
    groupRef.current.position.set(
      MathUtils.lerp(
        groupRef.current.position.x,
        targetX + mouseSway * 0.5 + idleSway.x,
        0.15,
      ),
      MathUtils.lerp(
        groupRef.current.position.y,
        targetY + equipOffset + idleSway.y + recoil.y,
        0.15,
      ),
      MathUtils.lerp(groupRef.current.position.z, targetZ + recoil.z, 0.15),
    );

    groupRef.current.rotation.set(
      rotX - recoil.rotX,
      rotY - mouseSway,
      rotZ + strafeRoll + mouseSway * 0.5,
    );
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <Clone object={scene} />
    </group>
  );
}

Object.values(modelsBank).forEach((path) => useGLTF.preload(path));
