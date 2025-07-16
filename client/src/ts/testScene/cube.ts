import * as THREE from "three";

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.ShaderMaterial({});
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.castShadow = true;

export default cubeMesh;
