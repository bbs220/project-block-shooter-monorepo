export type ServerPlayerState = {
  name: string;
  color: string;
  team: "red" | "blue" | "none";
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  health: number;
  isDead: boolean;
  kills: number;
  deaths: number;
  currentWeapon: "rifle" | "pistol";
  ammo: number;
  isReloading: boolean;
  lastShotTime: number;
};
