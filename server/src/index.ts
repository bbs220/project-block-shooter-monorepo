import "dotenv/config";
import { logger } from "./utils/logger.js";
import geckos from "@geckos.io/server";
import { getRandomColor, getRandomName } from "./utils/helpers.js";

// store player data
const players = new Map<
  string,
  { x: number; y: number; z: number; color: string; name: string }
>();

const io = geckos();
io.listen(9208);

io.onConnection((channel) => {
  if (!channel.id) return;

  const playerName = getRandomName();
  players.set(channel.id, {
    x: 0,
    y: 0,
    z: 0,
    color: getRandomColor(),
    name: playerName,
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
