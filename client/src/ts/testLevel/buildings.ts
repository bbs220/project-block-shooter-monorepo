import * as THREE from "three";

const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
export const buildingMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  wireframe: false,
});

export function regenerateBuildings() {
  const gridX = 50;
  const gridZ = 50;
  const buildingCount = gridX * gridZ;
  const spacing = 1;

  const buildingsMesh = new THREE.InstancedMesh(
    buildingGeometry,
    buildingMaterial,
    buildingCount
  );

  buildingsMesh.castShadow = true;
  buildingsMesh.receiveShadow = true;

  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  let i = 0;
  for (let x = 0; x < gridX; x++) {
    for (let z = 0; z < gridZ; z++) {
      if (Math.random() > 0.5) {
        const height = Math.random() * 3 + 1;
        dummy.position.set(
          (x - (gridX - 1) / 2) * spacing,
          height / 2,
          (z - (gridZ - 1) / 2) * spacing
        );
        dummy.scale.set(0.5, height, 0.5);
        dummy.updateMatrix();
        buildingsMesh.setMatrixAt(i, dummy.matrix);
        color.setHSL(Math.random(), 0.8, 0.6);
        buildingsMesh.setColorAt(i, color);
        i++;
      }
    }
  }

  buildingsMesh.count = i;

  if (buildingsMesh && buildingsMesh.instanceColor) {
    buildingsMesh.instanceColor.needsUpdate = true;
  }

  return buildingsMesh;
}

const buildingsMesh = regenerateBuildings();

export default buildingsMesh;
