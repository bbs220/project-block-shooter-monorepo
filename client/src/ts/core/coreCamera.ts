import * as THREE from "three";

function addCamera() {
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    3000
  );
  // dont set the camera position here EVER
  return camera;
}

export default addCamera;
