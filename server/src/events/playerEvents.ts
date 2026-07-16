import { GeckosServer, ServerChannel } from "@geckos.io/server";
import RAPIER from "@dimforge/rapier3d-compat";
import {
  getRandomColor,
  getRandomName,
  getRandomSpawn,
} from "../utils/helpers.js";
import { matchData, players } from "../state/gameState.js";
import { logger } from "../utils/logger.js";
import { world } from "../index.js";
import { WEAPONS } from "../utils/weapons.js";

// import rapier and the physics world
export function handleConnection(channel: ServerChannel) {
  if (!channel.id) return;

  const playerName = getRandomName();

  // count existing players to balance the lobby
  let redCount = 0;
  let blueCount = 0;

  players.forEach((p) => {
    if (p.team === "red") redCount++;
    if (p.team === "blue") blueCount++;
  });

  // assign to the smaller team (default to red on ties)
  const assignedTeam = redCount <= blueCount ? "red" : "blue";

  const spawnPoint = getRandomSpawn(assignedTeam);

  // assign distinct hex colors so players can visually identify enemies
  const teamColor = assignedTeam === "red" ? "#ef4444" : "#3b82f6";

  const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
    spawnPoint.x,
    1,
    spawnPoint.z,
  );
  const body = world.createRigidBody(bodyDesc);
  body.userData = { id: channel.id };

  const colliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.5);
  world.createCollider(colliderDesc, body);

  players.set(channel.id, {
    name: playerName,
    color: teamColor, // use team color instead of random
    team: assignedTeam, // assign actual team
    x: spawnPoint.x,
    y: 0,
    z: spawnPoint.z,
    yaw: 0,
    pitch: 0,
    health: 100,
    isDead: false,
    kills: 0,
    deaths: 0,
    currentWeapon: "assaultRifle",
    ammo: WEAPONS["assaultRifle"].magSize,
    magazines: {
      assaultRifle: WEAPONS["assaultRifle"].magSize,
      pistol: WEAPONS["pistol"].magSize,
      burstRifle: WEAPONS["burstRifle"].magSize,
    },
    isReloading: false,
    lastShotTime: 0,
    reloadTimer: null,
    body: body,
  });

  logger.info(
    `user connected: ${playerName} (${channel.id}) joined team ${assignedTeam}`,
  );
}

export function handlePlayerInput(id: string, data: any) {
  const player = players.get(id);

  // block movement if dead so they can't run around as a ghost
  if (player && !player.isDead) {
    player.yaw = data.yaw ?? player.yaw;
    player.pitch = data.pitch ?? player.pitch;

    // trust the absolute position sent by the client to prevent delta-loss desync
    player.x = data.x ?? player.x;
    player.z = data.z ?? player.z;

    // move the actual physics collider to match the exact new coordinates
    player.body.setNextKinematicTranslation({
      x: player.x,
      y: player.y + 1, // keep center mass at y=1
      z: player.z,
    });
  }
}

export function handleSwitchWeapon(
  id: string,
  weaponId: "assaultRifle" | "pistol" | "burstRifle",
) {
  const player = players.get(id);

  if (!player || player.isDead) return;

  if (player.isReloading) {
    player.isReloading = false;
    if (player.reloadTimer) {
      clearTimeout(player.reloadTimer);
      player.reloadTimer = null;
    }
  }

  if (
    weaponId === "assaultRifle" ||
    weaponId === "pistol" ||
    weaponId === "burstRifle"
  ) {
    player.currentWeapon = weaponId;
    player.ammo = player.magazines[weaponId];
  }
}

export function handleReload(id: string) {
  const player = players.get(id);
  if (!player || player.isDead || player.isReloading) return;

  const weapon = WEAPONS[player.currentWeapon];
  if (player.ammo === weapon.magSize) return;

  player.isReloading = true;

  player.reloadTimer = setTimeout(() => {
    if (players.has(id)) {
      const p = players.get(id)!;
      p.magazines[p.currentWeapon] = weapon.magSize;
      p.ammo = weapon.magSize;
      p.isReloading = false;
      p.reloadTimer = null;
    }
  }, weapon.reloadTime);
}

export function handleShoot(id: string, data: any, io: GeckosServer) {
  const shooter = players.get(id);
  if (!shooter || shooter.isDead || shooter.isReloading) return;

  const weapon = WEAPONS[shooter.currentWeapon];
  const range = weapon.range ?? 100;
  const now = Date.now();

  if (now - shooter.lastShotTime < weapon.fireRate - 10) return;
  if (shooter.ammo <= 0) return;

  shooter.magazines[shooter.currentWeapon] -= 1;
  shooter.ammo = shooter.magazines[shooter.currentWeapon];
  shooter.lastShotTime = now;

  // origin: exactly at the shooter's camera level
  const origin = { x: shooter.x, y: shooter.y + 1.5, z: shooter.z };

  // direction: use the exact 3d vector sent by the client
  const direction = { x: data.dirX, y: data.dirY, z: data.dirZ };

  // fire the true physics raycast
  const ray = new RAPIER.Ray(origin, direction);

  // castray ignores the shooter's own body so they don't shoot themselves
  const hit = world.castRay(
    ray,
    range,
    true,
    undefined,
    undefined,
    undefined,
    shooter.body,
  );

  if (hit && hit.collider) {
    // extract the id of the hit player
    const hitId = hit.collider.parent()?.userData?.id;

    if (hitId && hitId !== id) {
      const hitPlayer = players.get(hitId);

      if (hitPlayer && !hitPlayer.isDead) {
        // prevent friendly fire (block damage if on the same team)
        if (shooter.team === hitPlayer.team) {
          return;
        }

        hitPlayer.health -= weapon.damage;

        logger.info(
          `${shooter.name} hit ${hitPlayer.name} with ${weapon.name}! hp: ${hitPlayer.health}`,
        );

        if (hitPlayer.health <= 0) {
          hitPlayer.isDead = true;
          shooter.kills += 1;
          hitPlayer.deaths += 1;
          // update tdm match specific scores
          if (matchData.mode === "tdm") {
            matchData.teamScores[shooter.team] += 1;
          }

          logger.info(
            `${shooter.name} killed ${hitPlayer.name} with ${weapon.name}!`,
          );

          io.emit("kill_feed", {
            id: Math.random().toString(36).substring(2, 9), // unique key
            shooter: shooter.name,
            target: hitPlayer.name,
            weapon: weapon.name,
            shooterTeam: shooter.team,
            targetTeam: hitPlayer.team,
          });

          // respawn logic
          setTimeout(() => {
            if (players.has(hitId)) {
              const p = players.get(hitId)!;
              p.health = 100;
              p.isDead = false;
              const newSpawn = getRandomSpawn(p.team);
              p.x = newSpawn.x;
              p.z = newSpawn.z;
              p.body.setNextKinematicTranslation({
                x: newSpawn.x,
                y: 1,
                z: newSpawn.z,
              });
              logger.info(`${p.name} respawned!`);
            }
          }, 3000);
        }
      }
    }
  }

  if (shooter.ammo === 0) {
    handleReload(id);
  }
}

export function handleDisconnect(id: string, reason: string) {
  const player = players.get(id);
  if (player) {
    logger.info(`user disconnected: ${player.name} (${reason})`);

    // clean up the physics body so ghost colliders don't block bullets
    if (player.body) {
      world.removeRigidBody(player.body);
    }
  }
  players.delete(id);
}
