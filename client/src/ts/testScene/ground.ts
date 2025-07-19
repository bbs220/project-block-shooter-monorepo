import * as THREE from "three";
import { darkTile } from "../utils/assetPaths";
import { inspectorUI } from "../helpers/debugOptions";
import { progressManager } from "../helpers/loadingScreen";

const anisotrophicValue = 16;

const groundSize = 32;

const tilingValue = groundSize;

const darkTexture = new THREE.TextureLoader(progressManager).load(
  darkTile,
  (texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(tilingValue, tilingValue);
    texture.anisotropy = anisotrophicValue;
    texture.colorSpace = THREE.SRGBColorSpace;
  }
);

const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
const groundMaterial = new THREE.MeshStandardMaterial({
  map: darkTexture,
  wireframe: false,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.set(0, -1, 0);
groundMesh.scale.set(1, 1, 1);
groundMesh.rotation.set(-Math.PI / 2, 0, 0);

const groundFolder = inspectorUI.addFolder({
  title: "⛰️ Ground",
  expanded: false,
});

groundFolder.addBinding(groundMaterial, "wireframe", { label: "Wireframe" });

const positionFolder = groundFolder.addFolder({
  title: "Position",
  expanded: false,
});

positionFolder.addBinding(groundMesh.position, "x", {
  min: -10,
  max: 10,
  label: "X",
});
positionFolder.addBinding(groundMesh.position, "y", {
  min: -10,
  max: 10,
  label: "Y",
});
positionFolder.addBinding(groundMesh.position, "z", {
  min: -10,
  max: 10,
  label: "Z",
});

const rotationFolder = groundFolder.addFolder({
  title: "Rotation",
  expanded: false,
});
rotationFolder.addBinding(groundMesh.rotation, "x", {
  min: -180 * (Math.PI / 180),
  max: 180 * (Math.PI / 180),
  label: "X",
  format: (value) => `${((value * 180) / Math.PI).toFixed(0)}°`,
});
rotationFolder.addBinding(groundMesh.rotation, "y", {
  min: -180 * (Math.PI / 180),
  max: 180 * (Math.PI / 180),
  label: "Y",
  format: (value) => `${((value * 180) / Math.PI).toFixed(0)}°`,
});
rotationFolder.addBinding(groundMesh.rotation, "z", {
  min: -180 * (Math.PI / 180),
  max: 180 * (Math.PI / 180),
  label: "Z",
  format: (value) => `${((value * 180) / Math.PI).toFixed(0)}°`,
});

const scaleFolder = groundFolder.addFolder({ title: "Scale", expanded: false });

scaleFolder.addBinding(groundMesh.scale, "x", { min: 1, max: 10, label: "X" });
scaleFolder.addBinding(groundMesh.scale, "y", { min: 1, max: 10, label: "Y" });

const resetButton = groundFolder.addButton({
  title: "Reset Ground Transform",
});

resetButton.on("click", () => {
  groundMesh.position.set(0, -1, 0);
  groundMesh.rotation.set(-Math.PI / 2, 0, 0);
  groundMesh.scale.set(1, 1, 1);
  groundFolder.refresh();
});

export default groundMesh;
