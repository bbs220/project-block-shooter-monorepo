import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import addOrbitLook from "./controls/orbitLook";
import addCamera from "./core/coreCamera";
import addRenderer3D from "./core/coreRenderer";
import addScene from "./core/coreScene";
import { framesMonitor, inspectorUI } from "./helpers/debugOptions";
import { progressManager } from "./helpers/loadingScreen";
import addRenderer2D from "./other/otherRenderer";
import buildingsMesh from "./testScene/buildings";
import groundMesh from "./testScene/ground";
import { citrusOrchard } from "./utils/assetPaths";
import addPointerLook, { debugInfo } from "./controls/pointerLook";

const scene = addScene();
const camera = addCamera();
const renderer3D = addRenderer3D();
const renderer2D = addRenderer2D();

scene.add(buildingsMesh);
scene.add(groundMesh);

const hdriLoader = new RGBELoader(progressManager);
hdriLoader.load(citrusOrchard, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
  scene.backgroundBlurriness = 0;
});

const orbitLook = addOrbitLook(camera, renderer3D);
const pointerLook = addPointerLook(camera, renderer3D);

orbitLook.orbitCtrls.enabled = true;
orbitLook.gizmo.enabled = true;
pointerLook.pointerCtrls.enabled = false;
debugInfo.style.display = "none";
camera.position.set(0, 2, 4);

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
  renderer3D.render(scene, camera);
}

function clean2DRender() {
  renderer2D.render(scene, camera);
}

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

    // Then enable only the selected one
    if (selectedControl === "Orbit") {
      orbitLook.orbitCtrls.enabled = true;
      orbitLook.gizmo.enabled = true;
      debugInfo.style.display = "none";
      camera.position.set(0, 2, 4);
    } else if (selectedControl === "PointerLock") {
      pointerLook.pointerCtrls.enabled = true;
      debugInfo.style.display = "flex";
      camera.position.set(0, 0.5, 0);
    }
  });

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
