import * as THREE from "three";
import testVert from "../../shaders/testVert.glsl";
import testFrag from "../../shaders/testFrag.glsl";

const cubeGeometry = new THREE.SphereGeometry(0.5, 12, 12);
const cubeMaterial = new THREE.ShaderMaterial({
  fragmentShader: testFrag,
  vertexShader: testVert,
});
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
cubeMesh.castShadow = true;

export default cubeMesh;
