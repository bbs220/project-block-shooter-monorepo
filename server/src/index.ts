import "dotenv/config";
import { logger } from "./utils/logger.js";
import geckos from "@geckos.io/server";
import { getPlayersState } from "./state/gameState.js";
import {
  handleConnection,
  handleDisconnect,
  handlePlayerInput,
  handleShoot,
  handleSwitchWeapon,
  handleReload,
} from "./events/playerEvents.js";

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

  // delegate shooting logic
  channel.on("shoot", (data: any) => {
    handleShoot(channel.id as string, data);
  });

  // delegate weapon switching
  channel.on("switchWeapon", (weaponId: any) => {
    handleSwitchWeapon(channel.id as string, weaponId);
  });

  // delegate reloading
  channel.on("reload", () => {
    handleReload(channel.id as string);
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
  // fetch clean serialized state and broadcast
  io.emit("state", getPlayersState());
}

setInterval(gameLoop, tickInterval);
