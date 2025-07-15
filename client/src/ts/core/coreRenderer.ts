import * as THREE from "three";

function addRenderer3D() {
  const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

  const renderer3D = new THREE.WebGLRenderer({
    canvas: gameCanvas,
    alpha: true,
    antialias: true,
  });
  renderer3D.setPixelRatio(window.devicePixelRatio);
  renderer3D.setSize(window.innerWidth, window.innerHeight);
  renderer3D.toneMapping = THREE.AgXToneMapping;
  renderer3D.toneMappingExposure = 1;
  renderer3D.shadowMap.enabled = true;
  renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer3D.domElement);
  return renderer3D;
}

export default addRenderer3D;
