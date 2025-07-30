import * as THREE from "three";
// import testVert from "../../shaders/testVert.glsl";
// import testFrag from "../../shaders/testFrag.glsl";

const ballGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const ballMaterial = new THREE.MeshStandardMaterial({
  color: "blue",
  wireframe: false,
});
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
ballMesh.position.set(0, 1, 0);
ballMesh.castShadow = true;

export default ballMesh;
