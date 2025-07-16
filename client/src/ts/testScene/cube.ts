import * as THREE from "three";
import { greenTile } from "../utils/assetPaths";

const darkTexture = new THREE.TextureLoader().load(greenTile, (texture) => {
  texture.anisotropy = 16;
  texture.colorSpace = THREE.SRGBColorSpace;
});

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({
  map: darkTexture,
});
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.castShadow = true;

export default cubeMesh;
