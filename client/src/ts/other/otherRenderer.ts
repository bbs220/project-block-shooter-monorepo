import { CSS2DRenderer } from "three/examples/jsm/Addons.js";

function addRenderer2D() {
  const renderer2D = new CSS2DRenderer();
  renderer2D.setSize(window.innerWidth, window.innerHeight);
  renderer2D.domElement.style.position = "absolute";
  renderer2D.domElement.style.top = "0%";
  renderer2D.domElement.style.left = "0%";
  renderer2D.domElement.style.pointerEvents = "none";
  document.body.appendChild(renderer2D.domElement);
  return renderer2D;
}

export default addRenderer2D;
