import "dotenv/config";
import { logger } from "./utils/logger.js";
import geckos from "@geckos.io/server";
import RAPIER from "@dimforge/rapier3d-compat";
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

async function startServer() {
  // wait for webassembly to compile and load
  await RAPIER.init();

  // create a physics world with standard earth gravity
  const gravity = { x: 0.0, y: -9.81, z: 0.0 };
  const world = new RAPIER.World(gravity);
  logger.info("physics world initialized with v0.19.2");

  function gameLoop() {
    // step the physics simulation forward
    world.step();

    // broadcast the clean serialized state
    io.emit("state", getPlayersState());
  }

  setInterval(gameLoop, tickInterval);
}

// 3. boot the server
startServer();
