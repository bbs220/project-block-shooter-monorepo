import "dotenv/config";
import { logger } from "./utils/logger.js";
import geckos from "@geckos.io/server";
import RAPIER from "@dimforge/rapier3d-compat";
import { getFullState, matchData } from "./state/gameState.js";
import {
  handleConnection,
  handleDisconnect,
  handlePlayerInput,
  handleShoot,
  handleSwitchWeapon,
  handleReload,
} from "./events/playerEvents.js";

// export world so playerEvents can import it
export let world: RAPIER.World;

const io = geckos();

async function startServer() {
  // wait for webassembly to compile and load
  await RAPIER.init();

  // initialize world before allowing any connections
  world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
  logger.info("physics world initialized");

  // now safe to listen for connections
  io.listen(9208);

  io.onConnection((channel) => {
    if (!channel.id) return;

    handleConnection(channel);

    channel.on("playerInput", (data: any) => {
      handlePlayerInput(channel.id as string, data);
    });

    channel.on("shoot", (data: any) => {
      handleShoot(channel.id as string, data);
    });

    channel.on("switchWeapon", (weaponId: any) => {
      handleSwitchWeapon(channel.id as string, weaponId);
    });

    channel.on("reload", () => {
      handleReload(channel.id as string);
    });

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
    // step the physics simulation forward
    world.step();

    // broadcast the clean serialized state
    io.emit("state", getFullState());
  }

  setInterval(gameLoop, tickInterval);

  setInterval(() => {
    if (matchData.matchState === "playing") {
      matchData.timeRemaining -= 1;

      if (matchData.timeRemaining <= 0) {
        matchData.matchState = "ended";
        logger.info("match has ended!");

        // simple mvp reset: wait 5 seconds, then restart the match
        setTimeout(() => {
          matchData.timeRemaining = 240;
          matchData.teamScores = { red: 0, blue: 0 };
          matchData.matchState = "playing";
          logger.info("new match started!");
        }, 5000);
      }
    }
  }, 1000);
}

// boot the server
startServer();
