import { ServerChannel } from "@geckos.io/server";
import RAPIER from "@dimforge/rapier3d-compat";
import { getRandomColor, getRandomName } from "../utils/helpers.js";
import { players } from "../state/gameState.js";
import { logger } from "../utils/logger.js";
import { world } from "../index.js";
import { WEAPONS } from "../utils/weapons.js";

// 1. Import Rapier and the physics world (we will set 'world' up in index.ts next)
export function handleConnection(channel: ServerChannel) {
  if (!channel.id) return;

  const playerName = getRandomName();

  // 2. Create the Rapier RigidBody & Capsule Collider
  // Player center is at Y=1 so the 2-unit tall capsule rests on Y=0
  const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
    0,
    1,
    0,
  );
  const body = world.createRigidBody(bodyDesc);

  // Tag the physics body with the player's network ID so the raycaster knows who it hit
  body.userData = { id: channel.id };

  // Capsule args in Rapier are (half-height, radius). 0.5 + 0.5 = 1.0 half height total = 2.0 full height
  const colliderDesc = RAPIER.ColliderDesc.capsule(0.5, 0.5);
  world.createCollider(colliderDesc, body);

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
    ammo: WEAPONS["rifle"].magSize,
    magazines: {
      rifle: WEAPONS["rifle"].magSize,
      pistol: WEAPONS["pistol"].magSize,
      burstRifle: WEAPONS["burstRifle"].magSize,
    },
    isReloading: false,
    lastShotTime: 0,
    reloadTimer: null,
    body: body, // Add the physics body to the player state
  });

  logger.info(`User connected: ${playerName} (${channel.id})`);
}

export function handlePlayerInput(id: string, data: any) {
  const player = players.get(id);
  if (player) {
    player.yaw = data.yaw || 0;
    player.pitch = data.pitch || 0;
    player.x += data.moveX || 0;
    player.z += data.moveZ || 0;

    // 3. Move the actual physics collider to match the new coordinates
    player.body.setNextKinematicTranslation({
      x: player.x,
      y: player.y + 1, // Keep center mass at Y=1
      z: player.z,
    });
  }
}

export function handleSwitchWeapon(
  id: string,
  weaponId: "rifle" | "pistol" | "burstRifle",
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
    weaponId === "rifle" ||
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

export function handleShoot(id: string, data: any) {
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

  const pitch = data.pitch || 0;
  const yaw = data.yaw || 0;
  const dirX = -Math.sin(yaw) * Math.cos(pitch);
  const dirY = Math.sin(pitch);
  const dirZ = -Math.cos(yaw) * Math.cos(pitch);

  const origin = { x: shooter.x, y: shooter.y + 1.5, z: shooter.z };
  const direction = { x: dirX, y: dirY, z: dirZ };

  // 4. Mathematical Rapier Raycast (Replaces all the manual trig!)
  const ray = new RAPIER.Ray(origin, direction);

  // castRay(ray, maxToi, solid, collisionGroups, filterFlags, filterTarget, filterRigidBody)
  // We pass `shooter.body` as the 7th argument to guarantee the ray ignores the shooter's own capsule
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
    // Extract the network ID we saved in userData during connection
    const hitId = hit.collider.parent()?.userData?.id;

    if (hitId && hitId !== id) {
      const hitPlayer = players.get(hitId);

      if (hitPlayer && !hitPlayer.isDead) {
        hitPlayer.health -= weapon.damage;

        logger.info(
          `${shooter.name} hit ${hitPlayer.name} with ${weapon.name}! hp: ${hitPlayer.health}`,
        );

        if (hitPlayer.health <= 0) {
          hitPlayer.isDead = true;
          shooter.kills += 1;
          hitPlayer.deaths += 1;

          logger.info(
            `${shooter.name} killed ${hitPlayer.name} with ${weapon.name}!`,
          );

          // Respawn logic
          setTimeout(() => {
            if (players.has(hitId)) {
              const p = players.get(hitId)!;
              p.health = 100;
              p.isDead = false;
              p.x = 0;
              p.z = 0;
              // 5. Teleport the physics body back to spawn too!
              p.body.setNextKinematicTranslation({ x: 0, y: 1, z: 0 });
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
    logger.info(`User disconnected: ${player.name} (${reason})`);

    // 6. Clean up the physics body so ghost colliders don't block bullets
    if (player.body) {
      world.removeRigidBody(player.body);
    }
  }
  players.delete(id);
}
