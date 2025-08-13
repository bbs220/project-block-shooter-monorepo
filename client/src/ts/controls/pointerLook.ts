import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";
import { clicksImg, keysImg } from "../utils/assetPaths";

const moveState = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
};

const mouseState = {
  isZooming: false,
  isShooting: false,
};

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const drag = 10;
const acceleration = 10;

const originalFov = 60;
const zoomedFov = 30;
const zoomSpeed = 0.1;

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
const keys = [
  keysImg.shift,
  keysImg.ctrl,
  keysImg.w,
  clicksImg.right,
  keysImg.space,
  keysImg.a,
  keysImg.s,
  keysImg.d,
];

for (let i = 0; i < 8; i++) {
  const gridItem = document.createElement("img");
  gridItem.id = `Cell ${i + 1}`;
  gridItem.className = "cells";
  gridItem.src = keys[i] || `Cell ${i + 1}`;
  keysInfo.appendChild(gridItem);
}

debugInfo.appendChild(keysInfo);

const statusInfo = document.createElement("div");
statusInfo.id = "statusInfo";
debugInfo.appendChild(statusInfo);

function onKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case "w":
      moveState.moveForward = true;
      break;
    case "s":
      moveState.moveBackward = true;
      break;
    case "a":
      moveState.moveLeft = true;
      break;
    case "d":
      moveState.moveRight = true;
      break;
  }
}

function onKeyUp(event: KeyboardEvent) {
  switch (event.key) {
    case "w":
      moveState.moveForward = false;
      break;
    case "s":
      moveState.moveBackward = false;
      break;
    case "a":
      moveState.moveLeft = false;
      break;
    case "d":
      moveState.moveRight = false;
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
  });

  pointerCtrls.addEventListener("unlock", () => {
    console.log("Pointer unlocked");
  });

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Prevent the default right-click context menu
  document.addEventListener("contextmenu", (e) => e.preventDefault());

  // Left mouse click to shoot
  document.addEventListener("mousedown", (event: MouseEvent) => {
    if (!pointerCtrls.isLocked) return;

    if (event.button === 0) {
      mouseState.isShooting = true;
      reticle.style.width = "5px";
      reticle.style.height = "5px";
    }
  });

  document.addEventListener("mouseup", (event: MouseEvent) => {
    if (!pointerCtrls.isLocked) return;

    if (event.button === 0) {
      mouseState.isShooting = false;
      reticle.style.width = "15px";
      reticle.style.height = "15px";
    }
  });

  // right mouse click to zoom
  document.addEventListener("mousedown", (event: MouseEvent) => {
    if (!pointerCtrls.isLocked) return;

    if (event.button === 2) {
      mouseState.isZooming = true;
    }
  });

  document.addEventListener("mouseup", (event: MouseEvent) => {
    if (!pointerCtrls.isLocked) return;

    if (event.button === 2) {
      mouseState.isZooming = false;
    }
  });

  function runControls(delta: number) {
    if (pointerCtrls.isLocked && delta) {
      // Apply drag
      velocity.x -= velocity.x * drag * delta;
      velocity.z -= velocity.z * drag * delta;

      // Apply acceleration only if a key is pressed
      if (
        moveState.moveForward ||
        moveState.moveBackward ||
        moveState.moveLeft ||
        moveState.moveRight
      ) {
        direction.z =
          Number(moveState.moveForward) - Number(moveState.moveBackward);
        direction.x = Number(moveState.moveRight) - Number(moveState.moveLeft);
        direction.normalize(); // Ensure constant speed in all directions

        velocity.z -= direction.z * acceleration * delta;
        velocity.x -= direction.x * acceleration * delta;
      }

      pointerCtrls.moveRight(-velocity.x * delta);
      pointerCtrls.moveForward(-velocity.z * delta);

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
