import { ServerChannel } from "@geckos.io/server";
import { getRandomColor, getRandomName } from "./utils/helpers.js";
import { players } from "./gameState.js";
import { logger } from "./utils/logger.js";

export function handleConnection(channel: ServerChannel) {
  if (!channel.id) return;

  const playerName = getRandomName();

  players.set(channel.id, {
    name: playerName,
    color: getRandomColor(),
    team: "none",
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    health: 100,
    isDead: false,
    kills: 0,
    deaths: 0,
    currentWeapon: "rifle",
    ammo: 30,
    isReloading: false,
  });

  logger.info(`user connected: ${playerName} (${channel.id})`); // lowercase comment applied [cite: 44]
}

export function handlePlayerInput(id: string, data: any) {
  const player = players.get(id);
  if (player) {
    player.yaw = data.yaw || 0;
    player.pitch = data.pitch || 0;
    player.x += data.moveX || 0;
    player.z += data.moveZ || 0;
  }
}

export function handleDisconnect(id: string, reason: string) {
  const player = players.get(id);
  logger.info(`user disconnected: ${player?.name || id} (${reason})`);
  players.delete(id);
}
