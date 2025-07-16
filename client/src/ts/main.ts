import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { citrusOrchard } from "./utils/assetPaths";
import addScene from "./core/coreScene";
import addCamera from "./core/coreCamera";
import addRenderer3D from "./core/coreRenderer";
import addRenderer2D from "./other/otherRenderer";
import { framesMonitor } from "./helpers/debugOptions";
import addOrbitLook from "./controls/orbitLook";

const scene = addScene();

const camera = addCamera();

const renderer3D = addRenderer3D();

const renderer2D = addRenderer2D();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: "#00ff00" });
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
scene.add(cube);

const geo = new THREE.PlaneGeometry(100, 100);
const mat = new THREE.MeshStandardMaterial({ color: "#00ffff" });
const gr = new THREE.Mesh(geo, mat);
gr.receiveShadow = true;
gr.position.set(0, -1, 0);
gr.rotation.set(-Math.PI / 2, 0, 0);
scene.add(gr);

const hdriLoader = new RGBELoader();
hdriLoader.load(citrusOrchard, (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
});

const point = new THREE.PointLight("#ffffff", 100);
point.position.set(0, 5, 0);
point.castShadow = true;
scene.add(point);

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
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
}
animate();
