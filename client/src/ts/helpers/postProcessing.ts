import * as THREE from "three";
import {
  AfterimagePass,
  EffectComposer,
  RenderPass,
  UnrealBloomPass,
  OutputPass,
} from "three/examples/jsm/Addons.js";
import { inspectorUI } from "./debugOptions";

export function addPostProcessing(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  const composer = new EffectComposer(renderer);

  const baseRenderPass = new RenderPass(scene, camera);
  composer.addPass(baseRenderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0,
    0,
    0
  );
  bloomPass.enabled = false;
  const bloomParams = { strength: 0.2, radius: 0, threshold: 0 };
  bloomPass.strength = bloomParams.strength;
  bloomPass.radius = bloomParams.radius;
  bloomPass.threshold = bloomParams.threshold;
  composer.addPass(bloomPass);

  const afterImgPass = new AfterimagePass(0.92);
  afterImgPass.enabled = false;
  composer.addPass(afterImgPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  const postFolder = inspectorUI.addFolder({
    title: "✨ Post Processing",
    expanded: false,
  });

  const bloomSubFolder = postFolder.addFolder({
    title: "Bloom",
    expanded: false,
  });

  bloomSubFolder.addBinding(bloomPass, "enabled", {
    label: "Enabled",
  });

  bloomSubFolder
    .addBinding(bloomParams, "strength", {
      label: "Strength",
      min: 0.0,
      max: 3.0,
    })
    .on("change", ({ value }) => {
      bloomPass.strength = Number(value);
    });

  bloomSubFolder
    .addBinding(bloomParams, "radius", {
      label: "Radius",
      min: 0.0,
      max: 1.0,
    })
    .on("change", ({ value }) => {
      bloomPass.radius = Number(value);
    });

  bloomSubFolder
    .addBinding(bloomParams, "threshold", {
      label: "Threshold",
      min: 0.0,
      max: 1.0,
      step: 0.001,
    })
    .on("change", ({ value }) => {
      bloomPass.threshold = Number(value);
    });

  const afterImgSubFolder = postFolder.addFolder({
    title: "After Image",
    expanded: false,
  });

  afterImgSubFolder.addBinding(afterImgPass, "enabled", {
    label: "Enabled",
  });

  afterImgSubFolder.addBinding(afterImgPass.uniforms["damp"], "value", {
    label: "Trail Length",
    min: 0.1,
    max: 1,
    step: 0.01,
  });

  return { composer };
}
