import * as THREE from "three";
import { progressManager } from "./loadingScreen";
import { citrusOrchard } from "../utils/assetPaths";
import { RGBELoader } from "three/examples/jsm/Addons.js";

export function addHDRI(scene: THREE.Scene) {
  const hdriLoader = new RGBELoader(progressManager);
  hdriLoader.load(citrusOrchard, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
    scene.backgroundBlurriness = 0;
  });
}
