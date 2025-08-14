import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
import { clicksImg, keysImg } from "../utils/assetPaths";

const moveState = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
  isSprinting: false,
  isCrouching: false,
};

const mouseState = {
  isZooming: false,
  isShooting: false,
};

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const drag = 10;
const walkacceleration = 10;
const sprintAcceleration = 30; // increased acceleration for sprinting

const originalFov = 60;
const zoomedFov = 30;
const zoomSpeed = 0.1;

// constants for camera height
const standingHeight = 0.5;
const crouchingHeight = 0.2;
const crouchSpeed = 0.1;

const smol = (num: number): string => {
  const fixedNum = num.toFixed(2);
  if (num >= 0) {
    return `+${fixedNum}`;
  }
  return fixedNum;
};

// this shit will be removed later on
export const debugInfo = document.createElement("div");
debugInfo.id = "debugInfo";
document.body.appendChild(debugInfo);

// this shit will stay
export const uiContainer = document.createElement("div");
uiContainer.id = "uiContainer";
document.body.appendChild(uiContainer);

const reticle = document.createElement("div");
reticle.id = "reticle";
reticle.style.width = "15px";
reticle.style.height = "15px";
reticle.style.border = `3px solid #ffffffff`;
reticle.style.borderRadius = "50%";
reticle.style.transition = "all 0.2s ease-in-out";
uiContainer.appendChild(reticle);

const keysInfo = document.createElement("div");
keysInfo.id = "keysInfo";

const keyMappings = [
  { src: keysImg.shift, code: "ShiftLeft" },
  { src: keysImg.c, code: "KeyC" },
  { src: keysImg.w, code: "KeyW" },
  { src: clicksImg.left, code: "ClickLeft" },
  { src: clicksImg.right, code: "ClickRight" },
  { src: keysImg.space, code: "Space" },
  { src: keysImg.a, code: "KeyA" },
  { src: keysImg.s, code: "KeyS" },
  { src: keysImg.d, code: "KeyD" },
  { src: keysImg.i, code: "KeyI" },
];

for (const key of keyMappings) {
  const gridItem = document.createElement("img");
  gridItem.className = "cells";
  gridItem.src = key.src;
  gridItem.setAttribute("data-key", key.code);
  keysInfo.appendChild(gridItem);
}

debugInfo.appendChild(keysInfo);

const statusInfo = document.createElement("div");
statusInfo.id = "statusInfo";
debugInfo.appendChild(statusInfo);

const cursorLockInstructions = document.createElement("div");
cursorLockInstructions.id = "cursorLockInstructions";
cursorLockInstructions.innerText = `Please click here to lock your cursor.
  You can get your cursor back by pressing the Esc key.`;
debugInfo.appendChild(cursorLockInstructions);

const style = document.createElement("style");
style.innerHTML = `
.key-pressed {
  filter: invert(1);
  transform: scale(1.2);
}
`;
document.head.appendChild(style);

function onKeyDown(event: KeyboardEvent) {
  const keyElement = document.querySelector(`[data-key="${event.code}"]`);
  if (keyElement) {
    keyElement.classList.add("key-pressed");
  }

  switch (event.code) {
    case "KeyW":
      moveState.moveForward = true;
      break;
    case "KeyS":
      moveState.moveBackward = true;
      break;
    case "KeyA":
      moveState.moveLeft = true;
      break;
    case "KeyD":
      moveState.moveRight = true;
      break;
    case "KeyC":
      moveState.isCrouching = true;
      moveState.isSprinting = false; // prevent sprinting while crouching
      break;
    case "ShiftLeft":
    case "ShiftRight":
      if (!moveState.isCrouching) {
        // only allow sprinting if not crouching
        moveState.isSprinting = true;
      }
      break;
  }
}

function onKeyUp(event: KeyboardEvent) {
  const keyElement = document.querySelector(`[data-key="${event.code}"]`);
  if (keyElement) {
    keyElement.classList.remove("key-pressed");
  }

  switch (event.code) {
    case "KeyW":
      moveState.moveForward = false;
      break;
    case "KeyS":
      moveState.moveBackward = false;
      break;
    case "KeyA":
      moveState.moveLeft = false;
      break;
    case "KeyD":
      moveState.moveRight = false;
      break;
    case "KeyC":
      moveState.isCrouching = false;
      if (moveState.moveForward && event.shiftKey) {
        moveState.isSprinting = true;
      }
      break;
    case "ShiftLeft":
    case "ShiftRight":
      moveState.isSprinting = false;
      break;
  }
}

export function addPointerLook(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  const pointerCtrls = new PointerLockControls(camera, renderer.domElement);

  debugInfo.addEventListener("click", () => {
    pointerCtrls.lock();
  });

  pointerCtrls.addEventListener("lock", () => {
    console.log("Pointer locked");
    cursorLockInstructions.style.display = "none";
  });

  pointerCtrls.addEventListener("unlock", () => {
    console.log("Pointer unlocked");
    cursorLockInstructions.style.display = "flex";
  });

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // prevent the default right-click context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // left mouse click to shoot
  document.addEventListener("mousedown", (event: MouseEvent) => {
    if (!pointerCtrls.isLocked) return;

    if (event.button === 0) {
      const keyElement = document.querySelector(`[data-key="ClickLeft"]`);
      if (keyElement) {
        keyElement.classList.add("key-pressed");
      }
      mouseState.isShooting = true;
      reticle.style.width = "5px";
      reticle.style.height = "5px";
    }
  });

  document.addEventListener("mouseup", (event: MouseEvent) => {
    if (!pointerCtrls.isLocked) return;

    if (event.button === 0) {
      const keyElement = document.querySelector(`[data-key="ClickLeft"]`);
      if (keyElement) {
        keyElement.classList.remove("key-pressed");
      }
      mouseState.isShooting = false;
      reticle.style.width = "15px";
      reticle.style.height = "15px";
    }
  });

  // right mouse click to zoom
  document.addEventListener("mousedown", (event: MouseEvent) => {
    if (!pointerCtrls.isLocked) return;

    if (event.button === 2) {
      const keyElement = document.querySelector(`[data-key="ClickRight"]`);
      if (keyElement) {
        keyElement.classList.add("key-pressed");
      }
      mouseState.isZooming = true;
    }
  });

  document.addEventListener("mouseup", (event: MouseEvent) => {
    if (!pointerCtrls.isLocked) return;

    if (event.button === 2) {
      const keyElement = document.querySelector(`[data-key="ClickRight"]`);
      if (keyElement) {
        keyElement.classList.remove("key-pressed");
      }
      mouseState.isZooming = false;
    }
  });

  function runControls(delta: number) {
    if (pointerCtrls.isLocked && delta) {
      // apply drag
      velocity.x -= velocity.x * drag * delta;
      velocity.z -= velocity.z * drag * delta;

      // determine current acceleration based on crouching, then sprinting
      let currentAcceleration;
      if (moveState.isCrouching) {
        currentAcceleration = walkacceleration / 2; // Halve acceleration when crouching
      } else if (moveState.isSprinting && moveState.moveForward) {
        currentAcceleration = sprintAcceleration;
      } else {
        currentAcceleration = walkacceleration;
      }

      // apply acceleration only if a key is pressed
      if (
        moveState.moveForward ||
        moveState.moveBackward ||
        moveState.moveLeft ||
        moveState.moveRight
      ) {
        direction.z =
          Number(moveState.moveForward) - Number(moveState.moveBackward);
        direction.x = Number(moveState.moveRight) - Number(moveState.moveLeft);
        direction.normalize(); // ensure constant speed in all directions

        velocity.z -= direction.z * currentAcceleration * delta;
        velocity.x -= direction.x * currentAcceleration * delta;
      }

      pointerCtrls.moveRight(-velocity.x * delta);
      pointerCtrls.moveForward(-velocity.z * delta);

      // camera height adjustment
      const targetY = moveState.isCrouching ? crouchingHeight : standingHeight;
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        targetY,
        crouchSpeed
      );

      if (mouseState.isZooming) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, zoomedFov, zoomSpeed);
      } else {
        camera.fov = THREE.MathUtils.lerp(camera.fov, originalFov, zoomSpeed);
      }
      camera.updateProjectionMatrix();

      statusInfo.innerText = `Position X: ${smol(camera.position.x)}, Y: ${smol(
        camera.position.y
      )}, Z: ${smol(camera.position.z)}
      Velocity X: ${smol(velocity.x)}, Y: ${smol(velocity.y)}, Z: ${smol(
        velocity.z
      )}
      FOV: ${smol(camera.fov)}`;
    }
  }

  return { pointerCtrls, runControls };
}

export default addPointerLook;
