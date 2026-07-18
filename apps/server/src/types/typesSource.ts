import RAPIER from "@dimforge/rapier3d-compat";

export type ServerPlayerState = {
  name: string;
  color: string;
  team: "red" | "blue";

  // position and rotation
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;

  // player status
  health: number;
  isDead: boolean;
  kills: number;
  deaths: number;
  body: RAPIER.RigidBody;

  // combat & weapons
  currentWeapon: "assaultRifle" | "pistol" | "burstRifle";
  ammo: number;
  magazines: {
    assaultRifle: number;
    pistol: number;
    burstRifle: number;
  };
  isReloading: boolean;
  lastShotTime: number;
  reloadTimer: NodeJS.Timeout | null;
};
