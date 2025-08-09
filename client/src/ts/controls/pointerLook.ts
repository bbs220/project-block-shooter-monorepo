import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";

const moveState = {
  moveForward: false,
  moveBackward: false,
  moveLeft: false,
  moveRight: false,
};

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const drag = 10;
const speed = 40;

const instructions = document.getElementById(
  "loadingBackground"
) as HTMLDivElement;

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

        velocity.z -= direction.z * speed * delta;
        velocity.x -= direction.x * speed * delta;
      }

      // Apply the final movement
      pointerCtrls.moveRight(-velocity.x * delta);
      pointerCtrls.moveForward(-velocity.z * delta);
    }
  }

  return { pointerCtrls, runControls };
}

export default addPointerLook;
