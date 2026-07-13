export type WeaponId = "rifle" | "pistol";

export interface WeaponStats {
  id: WeaponId;
  name: string;
  damage: number;
  fireRate: number; // minimum time between shots in milliseconds
  magSize: number;
  reloadTime: number; // in milliseconds
  range: number; // max raycast distance
}

export const WEAPONS: Record<WeaponId, WeaponStats> = {
  rifle: {
    id: "rifle",
    name: "Assault Rifle",
    damage: 25,
    fireRate: 120, // fast firing
    magSize: 30,
    reloadTime: 2000,
    range: 150,
  },
  pistol: {
    id: "pistol",
    name: "Heavy Pistol",
    damage: 40, // hits harder
    fireRate: 400, // shoots slower
    magSize: 12,
    reloadTime: 1200,
    range: 75, // shorter range
  },
};
