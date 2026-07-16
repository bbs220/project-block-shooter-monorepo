export type WeaponId = "assaultRifle" | "pistol" | "burstRifle";
export type FireMode = "auto" | "semi" | "single" | "burst"; // added burst

export interface WeaponStats {
  id: WeaponId;
  name: string;
  damage: number;
  fireRate: number;
  magSize: number;
  reloadTime: number;
  range: number;
  mode: FireMode;
}

export const WEAPONS: Record<WeaponId, WeaponStats> = {
  assaultRifle: {
    id: "assaultRifle",
    name: "Assault Rifle",
    damage: 25,
    fireRate: 120,
    magSize: 30,
    reloadTime: 2000,
    range: 150,
    mode: "auto",
  },
  pistol: {
    id: "pistol",
    name: "Heavy Pistol",
    damage: 40,
    fireRate: 400,
    magSize: 12,
    reloadTime: 1200,
    range: 75,
    mode: "semi",
  },
  burstRifle: {
    id: "burstRifle",
    name: "Tactical Burst",
    damage: 30,
    fireRate: 100, // fast delay between the 3 bullets
    magSize: 24, // divisible by 3
    reloadTime: 2200,
    range: 180,
    mode: "burst",
  },
};
