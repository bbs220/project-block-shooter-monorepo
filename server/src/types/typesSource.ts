export type ServerPlayerState = {
  name: string;
  color: string;
  team: "red" | "blue" | "none";

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

  // combat & weapons
  currentWeapon: "rifle" | "pistol" | "burstRifle";
  ammo: number;
  magazines: {
    rifle: number;
    pistol: number;
    burstRifle: number;
  };
  isReloading: boolean;
  lastShotTime: number;
  reloadTimer: NodeJS.Timeout | null;
};
