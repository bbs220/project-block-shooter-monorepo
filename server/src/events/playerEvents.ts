import { ServerChannel } from "@geckos.io/server";
import { getRandomColor, getRandomName } from "../utils/helpers.js";
import { players } from "../state/gameState.js";
import { logger } from "../utils/logger.js";

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

  logger.info(`User connected: ${playerName} (${channel.id})`);
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

export function handleShoot(id: string, data: any) {
  const shooter = players.get(id);
  if (!shooter || shooter.isDead) return;

  // 1. calculate the 3d direction vector based on pitch and yaw
  // in three.js, the camera looks down the negative z axis
  const pitch = data.pitch || 0;
  const yaw = data.yaw || 0;

  const dirX = -Math.sin(yaw) * Math.cos(pitch);
  const dirY = Math.sin(pitch);
  const dirZ = -Math.cos(yaw) * Math.cos(pitch);

  // shooter's eye level (origin of the ray)
  const origin = { x: shooter.x, y: shooter.y + 1.5, z: shooter.z };

  let closestHit = null;
  let closestDistance = Infinity;

  // 2. check every other player to see if the ray hits them
  players.forEach((target, targetId) => {
    if (targetId === id || target.isDead) return;

    // target's center mass (a 2-unit tall capsule rests on y=0, so center is y=1)
    const targetCenter = { x: target.x, y: target.y + 1, z: target.z };

    // vector from shooter to target
    const vX = targetCenter.x - origin.x;
    const vY = targetCenter.y - origin.y;
    const vZ = targetCenter.z - origin.z;

    // dot product projects the target onto the ray
    const t = vX * dirX + vY * dirY + vZ * dirZ;

    // if t < 0, the target is behind the shooter
    if (t > 0) {
      // find the closest point on the ray to the target's center
      const closestPointX = origin.x + dirX * t;
      const closestPointY = origin.y + dirY * t;
      const closestPointZ = origin.z + dirZ * t;

      // distance from the target's center to that closest point on the ray
      const distToRay = Math.sqrt(
        Math.pow(targetCenter.x - closestPointX, 2) +
          Math.pow(targetCenter.y - closestPointY, 2) +
          Math.pow(targetCenter.z - closestPointZ, 2),
      );

      // 0.5 is the radius of our player capsule
      // we use 0.6 here to give a slightly generous hitbox (lag compensation)
      if (distToRay < 0.6 && t < closestDistance) {
        closestDistance = t;
        closestHit = { id: targetId, player: target };
      }
    }
  });

  // 3. apply damage if we hit the closest valid target
  if (closestHit) {
    const hitPlayer = closestHit.player;

    // rifle does 25 damage per body shot
    hitPlayer.health -= 25;

    logger.info(
      `${shooter.name} hit ${hitPlayer.name}! hp: ${hitPlayer.health}`,
    );

    if (hitPlayer.health <= 0) {
      hitPlayer.isDead = true;
      shooter.kills += 1;
      hitPlayer.deaths += 1;
      logger.info(`${shooter.name} killed ${hitPlayer.name}!`);

      // simple respawn logic for mvp (reset after 3 seconds)
      setTimeout(() => {
        if (players.has(closestHit.id)) {
          const p = players.get(closestHit.id)!;
          p.health = 100;
          p.isDead = false;
          // respawn back at center
          p.x = 0;
          p.z = 0;
        }
      }, 3000);
    }
  }
}

export function handleDisconnect(id: string, reason: string) {
  const player = players.get(id);
  logger.info(`User disconnected: ${player?.name || id} (${reason})`);
  players.delete(id);
}
