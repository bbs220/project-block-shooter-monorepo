import * as THREE from "three";
import type addOrbitLook from "./orbitLook";
import type addPointerLook from "./pointerLook";
import { inspectorUI } from "../helpers/debugOptions";
import { allMovementValues, debugInfo, uiContainer } from "./pointerLook";

type OrbitLook = ReturnType<typeof addOrbitLook>;
type PointerLook = ReturnType<typeof addPointerLook>;

export function setupControlSwitching(
  orbitLook: OrbitLook,
  pointerLook: PointerLook,
  camera: THREE.PerspectiveCamera
) {
  // defaults
  debugInfo.style.display = "none";
  uiContainer.style.display = "none";

  const switchControls = {
    activeControl: "Orbit",
  };

  const controlsFolder = inspectorUI.addFolder({
    title: "🕹️ Controls",
    expanded: false,
  });

  controlsFolder
    .addBinding(switchControls, "activeControl", {
      label: "Control Mode",
      options: {
        Orbit: "Orbit",
        PointerLock: "PointerLock",
      },
    })
    .on("change", (ev) => {
      const selectedControl = ev.value;
      console.log(`Switched to ${selectedControl} controls`);

      // Disable all controls first
      orbitLook.orbitCtrls.enabled = false;
      orbitLook.gizmo.enabled = false;
      pointerLook.pointerCtrls.enabled = false;

      if (selectedControl === "Orbit") {
        orbitLook.orbitCtrls.enabled = true;
        orbitLook.gizmo.enabled = true;
        debugInfo.style.display = "none";
        uiContainer.style.display = "none";
        camera.position.set(0, 2, 4);
        orbitControlsFolder.hidden = false;
        pointerCtrlsFolder.hidden = true;
      } else if (selectedControl === "PointerLock") {
        pointerLook.pointerCtrls.enabled = true;
        debugInfo.style.display = "flex";
        uiContainer.style.display = "flex";
        camera.position.set(0, 0.5, 0);
        orbitControlsFolder.hidden = true;
        pointerCtrlsFolder.hidden = false;
      }
    });

  const orbitControlsFolder = controlsFolder.addFolder({
    title: "Orbit Controls",
    expanded: true,
  });

  orbitControlsFolder.addBinding(orbitLook.orbitCtrls, "autoRotate", {
    label: "Auto Rotate",
  });

  orbitControlsFolder.addBinding(orbitLook.orbitCtrls, "autoRotateSpeed", {
    label: "Rotation Speed",
    min: 2,
    max: 10,
  });

  orbitControlsFolder.addBinding(orbitLook.orbitCtrls, "enableZoom", {
    label: "Zoom",
  });

  orbitControlsFolder.addBinding(orbitLook.orbitCtrls, "zoomSpeed", {
    label: "Zoom speed",
    min: 2,
    max: 10,
  });

  orbitControlsFolder.addBinding(orbitLook.orbitCtrls, "enablePan", {
    label: "Panning",
  });

  orbitControlsFolder.addBinding(orbitLook.orbitCtrls, "panSpeed", {
    label: "Panning Speed",
    min: 2,
    max: 10,
  });

  const resetOrbit = orbitControlsFolder.addButton({ title: "Back to Origin" });

  resetOrbit.on("click", () => {
    camera.position.set(0, 2, 4);
    orbitLook.orbitCtrls.target.set(0, 0, 0);
    orbitLook.orbitCtrls.update();
    orbitControlsFolder.refresh();
  });

  const pointerCtrlsFolder = controlsFolder.addFolder({
    title: "PointerLock",
    expanded: true,
    hidden: true,
  });

  pointerCtrlsFolder.addBinding(pointerLook.pointerCtrls, "pointerSpeed", {
    label: "Cursor Speed",
    min: 1,
    max: 100,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "walkacceleration", {
    label: "Walk Speed",
    min: 1,
    max: 100,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "sprintAcceleration", {
    label: "Sprint Speed",
    min: 1,
    max: 100,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "crouchAcceleration", {
    label: "Crouch Speed",
    min: 1,
    max: 100,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "jumpForce", {
    label: "Jump Force",
    min: 1,
    max: 50,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "drag", {
    label: "Drag Force",
    min: 1,
    max: 100,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "standingHeight", {
    label: "Standing Height",
    min: 0.1,
    max: 1,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "crouchingHeight", {
    label: "Crouching Height",
    min: 0.1,
    max: 1,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "originalFov", {
    label: "Original FOV",
    min: 1,
    max: 80,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "zoomedFov", {
    label: "Zoom FOV",
    min: 1,
    max: 80,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "zoomSpeed", {
    label: "Zoom Transistion Speed",
    min: 0.1,
    max: 1,
    readonly: true,
  });

  pointerCtrlsFolder.addBinding(allMovementValues, "crouchSpeed", {
    label: "Crouching Transistion Speed",
    min: 0.1,
    max: 1,
    readonly: true,
  });

  const resetPointer = pointerCtrlsFolder.addButton({
    title: "Reset to Default",
  });

  resetPointer.on("click", () => {
    pointerLook.pointerCtrls.pointerSpeed = 1;
    allMovementValues.drag = 10;
    allMovementValues.walkacceleration = 10;
    allMovementValues.sprintAcceleration = 30;
    allMovementValues.crouchAcceleration = 5;
    allMovementValues.originalFov = 60;
    allMovementValues.zoomedFov = 30;
    allMovementValues.zoomSpeed = 0.1;
    allMovementValues.standingHeight = 0.5;
    allMovementValues.crouchingHeight = 0.2;
    allMovementValues.crouchSpeed = 0.1;
    pointerCtrlsFolder.refresh();
  });
}
