import * as THREE from "three";
import addOrbitLook from "./controls/orbitLook";
import addCamera from "./core/coreCamera";
import addRenderer3D from "./core/coreRenderer";
import addScene from "./core/coreScene";
import { framesMonitor } from "./helpers/debugOptions";
import addRenderer2D from "./other/otherRenderer";
import addPointerLook from "./controls/pointerLook";
import { addHDRI } from "./helpers/hdriLoader";
import { addPostProcessing } from "./helpers/postProcessing";
import { addTestLevel } from "./testLevel/testLevel";
import { setupControlSwitching } from "./controls/switchControls";

const scene = addScene();
const camera = addCamera();
const renderer3D = addRenderer3D();
const renderer2D = addRenderer2D();

addTestLevel(scene);

addHDRI(scene);
const initPostProcessing = addPostProcessing(scene, camera, renderer3D);

const orbitLook = addOrbitLook(camera, renderer3D);
const pointerLook = addPointerLook(camera, renderer3D);

// setting up initial states
orbitLook.orbitCtrls.enabled = true;
orbitLook.gizmo.enabled = true;
pointerLook.pointerCtrls.enabled = false;

camera.position.set(0, 2, 4);

// new function to set up the control switching logic
setupControlSwitching(orbitLook, pointerLook, camera);

const debugClock = new THREE.Clock();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer3D.setSize(window.innerWidth, window.innerHeight);
  renderer2D.setSize(window.innerWidth, window.innerHeight);
  if (orbitLook.gizmo.enabled) {
    orbitLook.gizmo.update();
  }
});

function clean3DRender() {
  // renderer3D.render(scene, camera);
  initPostProcessing.composer.render();
}

function clean2DRender() {
  renderer2D.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  clean3DRender();
  clean2DRender();
  const delta = debugClock.getDelta();

  if (orbitLook.orbitCtrls.enabled) {
    orbitLook.orbitCtrls.update();
  }
  if (orbitLook.gizmo.enabled) {
    orbitLook.gizmo.render();
  }
  if (pointerLook.pointerCtrls.enabled) {
    pointerLook.runControls(delta);
  }

  framesMonitor.update();
}

animate();
