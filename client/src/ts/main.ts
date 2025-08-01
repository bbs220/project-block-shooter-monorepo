import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import addOrbitLook from "./controls/orbitLook";
import addCamera from "./core/coreCamera";
import addRenderer3D from "./core/coreRenderer";
import addScene from "./core/coreScene";
import { framesMonitor } from "./helpers/debugOptions";
import { progressManager } from "./helpers/loadingScreen";
import addRenderer2D from "./other/otherRenderer";
import buildingsMesh from "./testScene/buildings";
import groundMesh from "./testScene/ground";
import { citrusOrchard } from "./utils/assetPaths";

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

// this is for debugging view
// it comes with a gizmo
const orbitLock = addOrbitLook(camera, renderer3D);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer3D.setSize(window.innerWidth, window.innerHeight);
  renderer2D.setSize(window.innerWidth, window.innerHeight);
  orbitLock.gizmo.update();
});

function clean3DRender() {
  renderer3D.render(scene, camera);
}

function clean2DRender() {
  renderer2D.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  clean3DRender();
  clean2DRender();
  orbitLock.orbitCtrls.update();
  orbitLock.gizmo.render();
  framesMonitor.update();
}
animate();
