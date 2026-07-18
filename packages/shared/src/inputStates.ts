// polled every frame for physics
export const movementState = {
  forward: false, // w
  backward: false, // s
  left: false, // a
  right: false, // d
  sprint: false, // Shift
  jump: false, // Spacebar
};

// read once per click/press
export const combatState = {
  isShooting: false, // m0
  isAiming: false, // m1
  isSwitching: false, // 1 or 2 or 3
  isReloading: false, // r
};
