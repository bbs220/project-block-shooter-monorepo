import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/Addons.js";

function addPointerLook(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  const pointerCtrls = new PointerLockControls(camera, renderer.domElement);
  console.log(pointerCtrls);
}

export default addPointerLook;
