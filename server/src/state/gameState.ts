import { ServerPlayerState } from "../types/typesSource.js";

// central authoritative state
export const players = new Map<string, ServerPlayerState>();

// helper to serialize state for geckos broadcast
export const getPlayersState = () => {
  const safeState: Record<string, any> = {};

  players.forEach((player, id) => {
    // Destructure the player object to extract everything EXCEPT reloadTimer
    const { reloadTimer, ...safePlayerData } = player;

    // Assign the clean data to our broadcast object
    safeState[id] = safePlayerData;
  });

  return safeState;
};
