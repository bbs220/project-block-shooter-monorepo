import * as THREE from "three";
import { buildingMaterial, regenerateBuildings } from "./buildings";
import groundMesh, { groundMaterial } from "./ground";
import { inspectorUI } from "../helpers/debugOptions";

export function addTestLevel(scene: THREE.Scene) {
  let buildingsMesh = regenerateBuildings();
  scene.add(groundMesh);
  scene.add(buildingsMesh);

  const buildingsState = {
    visible: buildingsMesh.visible,
    wireframe: buildingMaterial.wireframe,
  };

  const testLevelFolder = inspectorUI.addFolder({
    title: "🏙️ Test Level",
    expanded: false,
  });

  const groundFolder = testLevelFolder.addFolder({
    title: "Ground",
    expanded: false,
  });

  groundFolder.addBinding(groundMesh, "visible", { label: "Visible" });
  groundFolder.addBinding(groundMaterial, "wireframe", { label: "Wireframe" });

  const positionFolder = groundFolder.addFolder({
    title: "Position",
    expanded: false,
  });

  positionFolder.addBinding(groundMesh.position, "x", {
    min: -10,
    max: 10,
    label: "X",
  });
  positionFolder.addBinding(groundMesh.position, "y", {
    min: -10,
    max: 10,
    label: "Y",
  });
  positionFolder.addBinding(groundMesh.position, "z", {
    min: -10,
    max: 10,
    label: "Z",
  });

  const rotationFolder = groundFolder.addFolder({
    title: "Rotation",
    expanded: false,
  });
  rotationFolder.addBinding(groundMesh.rotation, "x", {
    min: -180 * (Math.PI / 180),
    max: 180 * (Math.PI / 180),
    label: "X",
    format: (value) => `${((value * 180) / Math.PI).toFixed(0)}°`,
  });
  rotationFolder.addBinding(groundMesh.rotation, "y", {
    min: -180 * (Math.PI / 180),
    max: 180 * (Math.PI / 180),
    label: "Y",
    format: (value) => `${((value * 180) / Math.PI).toFixed(0)}°`,
  });
  rotationFolder.addBinding(groundMesh.rotation, "z", {
    min: -180 * (Math.PI / 180),
    max: 180 * (Math.PI / 180),
    label: "Z",
    format: (value) => `${((value * 180) / Math.PI).toFixed(0)}°`,
  });

  const scaleFolder = groundFolder.addFolder({
    title: "Scale",
    expanded: false,
  });

  scaleFolder.addBinding(groundMesh.scale, "x", {
    min: 1,
    max: 100,
    label: "X",
  });
  scaleFolder.addBinding(groundMesh.scale, "y", {
    min: 1,
    max: 100,
    label: "Y",
  });
  scaleFolder.addBinding(groundMesh.scale, "z", {
    min: 1,
    max: 100,
    label: "Z",
  });

  const resetButton = groundFolder.addButton({
    title: "Reset Ground Transform",
  });

  resetButton.on("click", () => {
    groundMesh.position.set(0, 0, 0);
    groundMesh.rotation.set(-Math.PI / 2, 0, 0);
    groundMesh.scale.set(1, 1, 1);
    groundFolder.refresh();
  });

  const buildingsFolder = testLevelFolder.addFolder({
    title: "Buildings",
    expanded: false,
  });

  buildingsFolder
    .addBinding(buildingsState, "visible", { label: "Visible" })
    .on("change", (ev) => {
      buildingsMesh.visible = ev.value;
    });

  buildingsFolder
    .addBinding(buildingsState, "wireframe", { label: "Wireframe" })
    .on("change", (ev) => {
      buildingMaterial.wireframe = ev.value;
    });

  const regenerateButton = buildingsFolder.addButton({
    title: "Regenerate Buildings",
  });

  regenerateButton.on("click", () => {
    scene.remove(buildingsMesh);
    buildingsMesh = regenerateBuildings();
    buildingsMesh.visible = buildingsState.visible;
    (buildingsMesh.material as THREE.MeshStandardMaterial).wireframe =
      buildingsState.wireframe;
    scene.add(buildingsMesh);
  });
}
