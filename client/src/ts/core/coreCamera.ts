import * as THREE from "three";

function addCamera() {
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    3000
  );
  camera.position.set(0, 2, 4);
  return camera;
}

export default addCamera;
