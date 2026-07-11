import { create } from "zustand";

interface PlayerState {
  x: number;
  y: number;
  z: number;
  color: string;
  name: string;
}

interface GameState {
  players: Record<string, PlayerState>;
  localId: string | null;
  setPlayers: (players: Record<string, PlayerState>) => void;
  setLocalId: (id: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: {},
  localId: null,
  setPlayers: (players) => set({ players }),
  setLocalId: (id) => set({ localId: id }),
}));
