import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";

const moveState = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
};

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

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const drag = 10;
const acceleration = 40;

const smol = (num: number): string => {
  const fixedNum = num.toFixed(2);
  if (num >= 0) {
    return `+${fixedNum}`;
  }
  return fixedNum;
};

const instructions = document.getElementById(
  "loadingBackground"
) as HTMLDivElement;

const debugInfo = document.createElement("div");
debugInfo.id = "debugInfo";
document.body.appendChild(debugInfo);

const keysInfo = document.createElement("div");
keysInfo.id = "keysInfo";
debugInfo.appendChild(keysInfo);

const statusInfo = document.createElement("div");
statusInfo.id = "statusInfo";
debugInfo.appendChild(statusInfo);

function addPointerLook(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  const pointerCtrls = new PointerLockControls(camera, renderer.domElement);

  instructions.addEventListener("click", () => {
    pointerCtrls.lock();
  });

  pointerCtrls.addEventListener("lock", () => {
    console.log("Pointer locked");
    instructions.style.display = "none";
  });

  pointerCtrls.addEventListener("unlock", () => {
    console.log("Pointer unlocked");
    instructions.style.display = "block";
  });

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

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

      // Apply the final movement
      pointerCtrls.moveRight(-velocity.x * delta);
      pointerCtrls.moveForward(-velocity.z * delta);

      statusInfo.innerText = `Position X: ${smol(camera.position.x)}, Y: ${smol(
        camera.position.y
      )}, Z: ${smol(camera.position.z)}
      Velocity X: ${smol(velocity.x)}, Y: ${smol(velocity.y)}, Z: ${smol(
        velocity.z
      )}`;
    }
  }

  return { pointerCtrls, runControls };
}

export default addPointerLook;
