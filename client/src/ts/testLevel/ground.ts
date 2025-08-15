import * as THREE from "three";
import { darkTile } from "../utils/assetPaths";
import { progressManager } from "../helpers/loadingScreen";

const anisotrophicValue = 16;

const groundSize = 50;

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
export const groundMaterial = new THREE.MeshStandardMaterial({
  map: darkTexture,
  wireframe: false,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.set(0, 0, 0);
groundMesh.scale.set(1, 1, 1);
groundMesh.rotation.set(-Math.PI / 2, 0, 0);

export default groundMesh;
