export const GRAVITY = { x: 0, y: -30, z: 0 }; // heavier downforce

export const PHYSICS_CONFIG = {
  JUMP_FORCE: 16.0, // Counteracts heavy gravity
  WALK_SPEED: 5.0,
  SPRINT_SPEED: 8.5,
};

export const PLAYER_CONFIG = {
  RADIUS: 0.5,
  HALF_HEIGHT: 0.5, // rapier measures from center to the start of the curved cap. (Total height = 2.0 units)
  EYE_LEVEL_OFFSET: 0.5, // distance from the center of the body up to the camera/shooter raycast
};
