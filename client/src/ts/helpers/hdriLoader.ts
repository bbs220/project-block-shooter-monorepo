import * as THREE from "three";
import { progressManager } from "./loadingScreen";
import { citrusOrchard } from "../utils/assetPaths";
import { RGBELoader } from "three/examples/jsm/Addons.js";
import { inspectorUI } from "./debugOptions";

export function addHDRI(scene: THREE.Scene) {
  let hdrTexture: THREE.Texture | null = null;

  const hdriLoader = new RGBELoader(progressManager);
  hdriLoader.load(citrusOrchard, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    hdrTexture = texture;
    scene.background = hdrTexture;
    scene.environment = hdrTexture;
    scene.backgroundBlurriness = 0;
  });

  const hdriOptions = {
    enabled: true,
    blurriness: 0,
  };

  const hdrFolder = inspectorUI.addFolder({
    title: "🌄 HDRI",
    expanded: false,
  });

  hdrFolder
    .addBinding(hdriOptions, "enabled", { label: "Enabled" })
    .on("change", (event) => {
      if (event.value) {
        if (hdrTexture) {
          scene.background = hdrTexture;
          scene.environment = hdrTexture;
        }
      } else {
        scene.background = null;
        scene.environment = null;
      }
    });

  hdrFolder
    .addBinding(hdriOptions, "blurriness", {
      min: 0,
      max: 1,
      step: 0.01,
      label: "Blurriness",
    })
    .on("change", (event) => {
      if (hdrTexture) {
        scene.backgroundBlurriness = event.value;
      }
    });
}
