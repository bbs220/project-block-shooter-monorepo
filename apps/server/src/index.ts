import "dotenv/config";
import { logger } from "./utils/logger.js";
import geckos from "@geckos.io/server";
import RAPIER from "@dimforge/rapier3d-compat";
import { getFullState, matchData, players } from "./state/gameState.js";
import {
  handleConnection,
  handleDisconnect,
  handlePlayerInput,
  handleShoot,
  handleSwitchWeapon,
  handleReload,
} from "./events/playerEvents.js";
import { getRandomSpawn } from "./utils/helpers.js";
import { envValid } from "./utils/envValid.js";
import { MAPS } from "@block-shooter/shared";

const PORT = Number(envValid.PORT);

// export world so playerEvents can import it
export let world: RAPIER.World;

const io = geckos();

async function startServer() {
  // wait for webassembly to compile and load
  await RAPIER.init();

  // initialize world before allowing any connections
  world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
  logger.info("physics world initialized");

  const currentMap = MAPS["arena_01"];
  const thickness = currentMap.floor.thickness;

  // static rigid body for the floor.
  // shift it down by half the thickness (-0.5) so the top surface sits perfectly at Y = 0.
  const groundBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
    0,
    -thickness / 2,
    0,
  );
  const groundBody = world.createRigidBody(groundBodyDesc);

  // cuboid collider.
  // rapier uses half-extents. A 100x1x100 floor needs half-extents of 50x0.5x50.
  const groundColliderDesc = RAPIER.ColliderDesc.cuboid(
    currentMap.floor.width / 2,
    thickness / 2,
    currentMap.floor.depth / 2,
  );
  world.createCollider(groundColliderDesc, groundBody);

  logger.info(`Loaded Map: ${currentMap.name}`);

  // now safe to listen for connections
  io.listen(PORT);

  io.onConnection((channel) => {
    if (!channel.id) return;

    handleConnection(channel);

    channel.on("playerInput", (data: any) => {
      handlePlayerInput(channel.id as string, data);
    });

    channel.on("shoot", (data: any) => {
      handleShoot(channel.id as string, data, io);
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

  let debugTickCounter = 0;

  function gameLoop() {
    // step the physics simulation forward
    world.step();

    const statePayload = getFullState();

    players.forEach((p) => {
      if (!p.isDead && p.body) {
        const pos = p.body.translation();

        // We now trust the physics engine as the ultimate source of truth
        p.x = pos.x;
        p.y = pos.y;
        p.z = pos.z;
      }
    });

    debugTickCounter++;
    if (debugTickCounter % 60 === 0) {
      // very heavy logs do not run this for long time
      // logger.info(
      //   "📡 GECKOS PAYLOAD SNAPSHOT:\n" + JSON.stringify(statePayload, null, 2),
      // );
    }

    // broadcast the clean serialized state
    io.emit("state", getFullState());
  }

  setInterval(gameLoop, tickInterval);

  // the 1hz slow loop for the match timer
  setInterval(() => {
    const playerCount = players.size;

    // if the server is completely empty, reset and wait.
    if (playerCount === 0) {
      if (matchData.matchState !== "waiting") {
        matchData.matchState = "waiting";
        matchData.timeRemaining = 240;
        matchData.teamScores = { red: 0, blue: 0 };
        logger.info("server empty, match reset to waiting state.");
      }
      return; // stop here, don't tick the clock down!
    }

    // if players are here and we are waiting, start the match!
    if (matchData.matchState === "waiting" && playerCount > 0) {
      matchData.matchState = "playing";
      logger.info("players detected, starting match!");
    }

    // tick the clock down if we are actively playing
    if (matchData.matchState === "playing") {
      matchData.timeRemaining -= 1;

      if (matchData.timeRemaining <= 0) {
        matchData.matchState = "ended";
        logger.info("match has ended!");

        // simple mvp reset: wait 5 seconds, then restart the match
        setTimeout(() => {
          // double check if everyone left during the 5-second scoreboard screen
          matchData.matchState = players.size > 0 ? "playing" : "waiting";
          matchData.timeRemaining = 240;
          matchData.teamScores = { red: 0, blue: 0 };

          const modes = ["tdm", "ctp"];
          matchData.mode = modes[Math.floor(Math.random() * modes.length)];
          logger.info(
            `server selected new mode: ${matchData.mode.toUpperCase()}`,
          );

          // reset all players' stats and health for the new match
          players.forEach((p) => {
            p.kills = 0;
            p.deaths = 0;
            p.health = 100;
            p.isDead = false;

            // teleport everyone back to a proper team spawn point
            const newSpawn = getRandomSpawn(p.team);
            p.x = newSpawn.x;
            p.z = newSpawn.z;
            p.body.setTranslation(
              {
                x: newSpawn.x,
                y: 10.0, // drop them from the sky again!
                z: newSpawn.z,
              },
              true,
            ); // 'true' wakes the body up if it went to sleep
          });

          logger.info("new match started!");
        }, 5000);
      }
    }
  }, 1000);
}

// boot the server
startServer();
