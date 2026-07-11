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
  setPlayers: (players: Record<string, PlayerState>) => void;
}

export const useGameStore = create<GameState>((set) => ({
  players: {},
  setPlayers: (players) => set({ players }),
}));
