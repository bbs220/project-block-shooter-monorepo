import * as THREE from "three";
import testVert from "../../shaders/testVert.glsl";
import testFrag from "../../shaders/testFrag.glsl";

const ballGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const ballMaterial = new THREE.ShaderMaterial({
  fragmentShader: testFrag,
  vertexShader: testVert,
  wireframe: false,
});
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
ballMesh.castShadow = true;

export default ballMesh;
