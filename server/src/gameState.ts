import { ServerPlayerState } from "./types/typesSource.js";

// central authoritative state
export const players = new Map<string, ServerPlayerState>();

// helper to serialize state for geckos broadcast
export const getPlayersState = () => {
  return Object.fromEntries(players);
};
