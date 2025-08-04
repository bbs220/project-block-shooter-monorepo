import * as THREE from "three";
import { inspectorUI } from "../helpers/debugOptions";

function addScene() {
  const scene = new THREE.Scene();
  const sceneFolder = inspectorUI.addFolder({
    title: "🌎 Scene",
    expanded: false,
  });

  return scene;
}

export default addScene;
