import * as THREE from "three";
import Stats from "stats-gl";
import { Pane } from "tweakpane";
import { CSS2DRenderer, RGBELoader } from "three/examples/jsm/Addons.js";
import { citrusOrchard } from "./utils/assetPaths";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.01,
  3000
);
camera.position.set(0, 1, 6);

const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

const renderer3D = new THREE.WebGLRenderer({
  canvas: gameCanvas,
  alpha: true,
  antialias: true,
});
renderer3D.setPixelRatio(window.devicePixelRatio);
renderer3D.setSize(window.innerWidth, window.innerHeight);
renderer3D.toneMapping = THREE.AgXToneMapping;
renderer3D.toneMappingExposure = 1;
renderer3D.shadowMap.enabled = true;
renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer3D.domElement);

const renderer2D = new CSS2DRenderer();
renderer2D.setSize(window.innerWidth, window.innerHeight);
renderer2D.domElement.style.position = "absolute";
renderer2D.domElement.style.top = "0%";
renderer2D.domElement.style.left = "0%";
renderer2D.domElement.style.pointerEvents = "none";
document.body.appendChild(renderer2D.domElement);

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

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer3D.setSize(window.innerWidth, window.innerHeight);
  renderer2D.setSize(window.innerWidth, window.innerHeight);
});

const stats = new Stats({
  trackGPU: true,
  trackHz: true,
});
document.body.appendChild(stats.dom);

const pane = new Pane({ title: "⚙️ Settings" });
pane.expanded = false;

function animate() {
  requestAnimationFrame(animate);
  renderer3D.render(scene, camera);
  renderer2D.render(scene, camera);
  stats.update();
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;
}
animate();
