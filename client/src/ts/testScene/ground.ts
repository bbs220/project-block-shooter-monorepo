import * as THREE from "three";
import { darkTile } from "../utils/assetPaths";

const anisotrophicValue = 16;

const groundSize = 32;

const tilingValue = groundSize;

const darkTexture = new THREE.TextureLoader().load(darkTile, (texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(tilingValue, tilingValue);
  texture.anisotropy = anisotrophicValue;
  texture.colorSpace = THREE.SRGBColorSpace;
});

const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
const groundMaterial = new THREE.MeshStandardMaterial({
  map: darkTexture,
  wireframe: false,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.receiveShadow = true;
groundMesh.position.set(0, -1, 0);
groundMesh.rotation.set(-Math.PI / 2, 0, 0);

export default groundMesh;
