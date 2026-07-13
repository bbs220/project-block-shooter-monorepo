import { ServerChannel } from "@geckos.io/server";
import { getRandomColor, getRandomName } from "../utils/helpers.js";
import { players } from "../state/gameState.js";
import { logger } from "../utils/logger.js";
import { ServerPlayerState } from "../types/typesSource.js";
import { WEAPONS } from "../utils/weapons.js";

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
    ammo: WEAPONS["rifle"].magSize, // Current visible ammo
    // NEW: Persistent ammo tracker for both weapons
    magazines: {
      rifle: WEAPONS["rifle"].magSize,
      pistol: WEAPONS["pistol"].magSize,
    },
    isReloading: false,
    lastShotTime: 0,
    reloadTimer: null, // NEW: Track the timeout
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

export function handleSwitchWeapon(id: string, weaponId: "rifle" | "pistol") {
  const player = players.get(id);

  // Notice we removed `player.isReloading` from this rejection check
  if (!player || player.isDead) return;

  // 1. If switching while reloading, CANCEL the ongoing reload
  if (player.isReloading) {
    player.isReloading = false;
    if (player.reloadTimer) {
      clearTimeout(player.reloadTimer);
      player.reloadTimer = null;
    }
  }

  if (weaponId === "rifle" || weaponId === "pistol") {
    player.currentWeapon = weaponId;

    // 2. Retrieve the exact ammo left in the holster (no more free ammo)
    player.ammo = player.magazines[weaponId];
  }
}

export function handleReload(id: string) {
  const player = players.get(id);
  if (!player || player.isDead || player.isReloading) return;

  const weapon = WEAPONS[player.currentWeapon];
  if (player.ammo === weapon.magSize) return; // already full

  player.isReloading = true;

  // 3. Save the timeout ID to the player object so we can abort it if needed
  player.reloadTimer = setTimeout(() => {
    if (players.has(id)) {
      const p = players.get(id)!;
      // Refill both the persistent magazine and the active ammo counter
      p.magazines[p.currentWeapon] = weapon.magSize;
      p.ammo = weapon.magSize;
      p.isReloading = false;
      p.reloadTimer = null;
    }
  }, weapon.reloadTime);
}

export function handleShoot(id: string, data: any) {
  const shooter = players.get(id);
  // block shooting if dead or currently reloading
  if (!shooter || shooter.isDead || shooter.isReloading) return;

  const weapon = WEAPONS[shooter.currentWeapon];
  const now = Date.now();

  // 1. validate fire rate (add 10ms grace period for network jitter)
  if (now - shooter.lastShotTime < weapon.fireRate - 10) return;

  // 2. validate ammo
  if (shooter.ammo <= 0) return;

  // successful shot! deduct from both the persistent magazine and the active display counter
  shooter.magazines[shooter.currentWeapon] -= 1;
  shooter.ammo = shooter.magazines[shooter.currentWeapon];
  shooter.lastShotTime = now;

  // calculate the 3d direction vector based on pitch and yaw
  const pitch = data.pitch || 0;
  const yaw = data.yaw || 0;

  const dirX = -Math.sin(yaw) * Math.cos(pitch);
  const dirY = Math.sin(pitch);
  const dirZ = -Math.cos(yaw) * Math.cos(pitch);

  // shooter's eye level (origin of the ray)
  const origin = { x: shooter.x, y: shooter.y + 1.5, z: shooter.z };

  let closestHit: { id: string; player: ServerPlayerState } | null = null;
  let closestDistance = Infinity;

  // check every other player to see if the ray hits them
  players.forEach((target, targetId) => {
    if (targetId === id || target.isDead) return;

    // target's center mass
    const targetCenter = { x: target.x, y: target.y + 1, z: target.z };

    const vX = targetCenter.x - origin.x;
    const vY = targetCenter.y - origin.y;
    const vZ = targetCenter.z - origin.z;

    const t = vX * dirX + vY * dirY + vZ * dirZ;

    // 3. validate distance limit using weapon.range
    if (t > 0 && t <= weapon.range) {
      const closestPointX = origin.x + dirX * t;
      const closestPointY = origin.y + dirY * t;
      const closestPointZ = origin.z + dirZ * t;

      const distToRay = Math.sqrt(
        Math.pow(targetCenter.x - closestPointX, 2) +
          Math.pow(targetCenter.y - closestPointY, 2) +
          Math.pow(targetCenter.z - closestPointZ, 2),
      );

      // 0.6 is a slightly generous hitbox (lag compensation)
      if (distToRay < 0.6 && t < closestDistance) {
        closestDistance = t;
        closestHit = { id: targetId, player: target };
      }
    }
  });

  // 4. apply correct weapon damage if we hit a target
  if (closestHit) {
    const hitPlayer = closestHit.player;

    hitPlayer.health -= weapon.damage;

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
        if (closestHit === null) return;
        if (players.has(closestHit.id)) {
          const p = players.get(closestHit.id)!;
          p.health = 100;
          p.isDead = false;
          // respawn back at center
          p.x = 0;
          p.z = 0;
          logger.info(`${p.name} respawned! after 3 seconds`);
        }
      }, 3000);
    }
  }

  // 5. auto-trigger a reload immediately if that shot emptied the clip
  if (shooter.ammo === 0) {
    handleReload(id);
  }
}

export function handleDisconnect(id: string, reason: string) {
  const player = players.get(id);
  logger.info(`User disconnected: ${player?.name || id} (${reason})`);
  players.delete(id);
}
