import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { citrusOrchard } from "./utils/assetPaths";
import addScene from "./core/coreScene";
import addCamera from "./core/coreCamera";
import addRenderer3D from "./core/coreRenderer";
import addRenderer2D from "./other/otherRenderer";
import { framesMonitor } from "./helpers/debugOptions";
import addOrbitLook from "./controls/orbitLook";
import groundMesh from "./testScene/ground";
import ballMesh from "./testScene/ball";

const scene = addScene();

const camera = addCamera();

const renderer3D = addRenderer3D();

const renderer2D = addRenderer2D();

scene.add(ballMesh);

scene.add(groundMesh);

const hdriLoader = new RGBELoader();
hdriLoader.load(citrusOrchard, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
  scene.backgroundBlurriness = 0;
});

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
