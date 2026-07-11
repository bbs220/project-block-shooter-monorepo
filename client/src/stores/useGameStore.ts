import { create } from "zustand";
import type { ClientChannel } from "@geckos.io/client";

// specific types for strictness
export type WeaponType = "rifle" | "pistol";
export type TeamType = "red" | "blue" | "none";
export type MatchState = "waiting" | "playing" | "ended";
export type GameMode = "tdm" | "ctp";

export interface PlayerState {
  // identity
  name: string;
  color: string;
  team: TeamType;

  // transform
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;

  // combat stats
  health: number;
  isDead: boolean;
  kills: number;
  deaths: number;

  // weapon state
  currentWeapon: WeaponType;
  ammo: number;
  isReloading: boolean;
}

export interface GameStore {
  // network & identity
  localId: string | null;
  channel: ClientChannel | null;

  // global match state
  mode: GameMode;
  matchState: MatchState;
  timeRemaining: number;
  teamScores: { red: number; blue: number };

  // players dictionary
  players: Record<string, PlayerState>;

  // actions
  setLocalId: (id: string) => void;
  setChannel: (channel: ClientChannel) => void;
  setPlayers: (players: Record<string, PlayerState>) => void;

  // generic updater for match info (time, scores, etc)
  updateMatchData: (data: Partial<GameStore>) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  localId: null,
  channel: null,

  // default match state
  mode: "tdm",
  matchState: "waiting",
  timeRemaining: 240, // 4 minutes in seconds
  teamScores: { red: 0, blue: 0 },

  players: {},

  // setters
  setLocalId: (id) => set({ localId: id }),
  setChannel: (channel) => set({ channel }),
  setPlayers: (players) => set({ players }),
  updateMatchData: (data) => set((state) => ({ ...state, ...data })),
}));
