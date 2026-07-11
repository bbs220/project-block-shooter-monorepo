import "dotenv/config";
import { logger } from "./utils/logger.js";
import geckos from "@geckos.io/server";
import { getRandomColor, getRandomName } from "./utils/helpers.js";
import { ServerPlayerState } from "./types/typesSource.js";

// store player data
const players = new Map<string, ServerPlayerState>();

const io = geckos();
io.listen(9208);

io.onConnection((channel) => {
  if (!channel.id) return;

  const playerName = getRandomName();
  players.set(channel.id, {
    name: playerName,
    color: getRandomColor(),
    team: "none", // auto-assign this later when match starts

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
    ammo: 30, // rifle clip size
    isReloading: false,
  });

  logger.info(`User connected: ${playerName} (${channel.id})`);

  channel.on("move", (data: any) => {
    const player = players.get(channel.id as string);
    if (player) {
      player.x += data.x || 0;
      player.y += data.y || 0;
      player.z += data.z || 0;

      // using the readable name in logs
      logger.info(`${player.name} moved to X:${player.x} Z:${player.z}`);
    }
  });

  channel.on("look", (data: any) => {
    const player = players.get(channel.id as string);
    if (player) {
      player.yaw = data.yaw || 0;
      player.pitch = data.pitch || 0;
    }
  });

  channel.onDisconnect((reason) => {
    if (!channel.id) return;
    const player = players.get(channel.id as string);
    logger.info(`user disconnected: ${player?.name || channel.id} (${reason})`);
    players.delete(channel.id as string);
  });

  channel.on("error", (err) => {
    logger.error(`channel error for ${channel.id}: ${err}`);
  });
});

const tickRate = 60;
const tickInterval = 1000 / tickRate;

function gameLoop() {
  // broadcast the entire player state to everyone 60 times a second
  const state = Object.fromEntries(players);
  io.emit("state", state);
}

setInterval(gameLoop, tickInterval);
