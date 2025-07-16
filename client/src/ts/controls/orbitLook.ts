import * as THREE from "three";
import { ViewportGizmo } from "three-viewport-gizmo";
import { OrbitControls } from "three/examples/jsm/Addons.js";

function addOrbitLook(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  const orbitCtrls = new OrbitControls(camera, renderer.domElement);
  orbitCtrls.enableDamping = true;
  orbitCtrls.dampingFactor = 0.04;
  const gizmo = new ViewportGizmo(camera, renderer, {
    className: "debugGizmo",
  });
  gizmo.attachControls(orbitCtrls);
  console.log("attached orbit controls");
  return { orbitCtrls, gizmo };
}

export default addOrbitLook;
