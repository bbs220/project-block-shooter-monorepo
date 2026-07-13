import "dotenv/config";
import { logger } from "./utils/logger.js";
import geckos from "@geckos.io/server";
import {
  handleConnection,
  handleDisconnect,
  handlePlayerInput,
} from "./playerEvents.js";
import { getPlayersState } from "./gameState.js";

const io = geckos();
io.listen(9208);

io.onConnection((channel) => {
  if (!channel.id) return;

  // delegate connection logic
  handleConnection(channel);

  // delegate input logic
  channel.on("playerInput", (data: any) => {
    handlePlayerInput(channel.id as string, data);
  });

  // delegate disconnect logic
  channel.onDisconnect((reason) => {
    handleDisconnect(channel.id as string, reason);
  });

  channel.on("error", (err) => {
    logger.error(`channel error for ${channel.id}: ${err}`);
  });
});

const tickRate = 60;
const tickInterval = 1000 / tickRate;

function gameLoop() {
  // fetch clean serialized state and broadcast [cite: 381, 382]
  io.emit("state", getPlayersState());
}

setInterval(gameLoop, tickInterval);
