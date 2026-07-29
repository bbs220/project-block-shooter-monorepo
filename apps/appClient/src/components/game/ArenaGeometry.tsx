import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping, Texture } from "three";
import { useMemo } from "react";
import { gridTextures } from "../../utils/assetPaths";
import { RigidBody } from "@react-three/rapier";
import { MAPS } from "@block-shooter/shared";

const ArenaGeometry = () => {
  const [greenTexture, darkTexture] = useLoader(TextureLoader, [
    gridTextures.green2,
    gridTextures.dark2,
  ]);

  const currentMap = MAPS.arena_01;

  // helper function to easily clone, wrap, and scale textures
  const setupTexture = (tex: Texture, repeatX: number, repeatY: number) => {
    const cloned = tex.clone();
    cloned.wrapS = cloned.wrapT = RepeatWrapping;
    cloned.anisotropy = 16;
    cloned.repeat.set(repeatX, repeatY);
    cloned.needsUpdate = true;
    return cloned;
  };

  const floorMap = useMemo(
    () =>
      setupTexture(
        greenTexture,
        currentMap.floor.width / 2,
        currentMap.floor.depth / 2,
      ),
    [greenTexture, currentMap.floor.width, currentMap.floor.depth],
  );

  const nsWallMap = useMemo(
    () =>
      setupTexture(
        darkTexture,
        currentMap.floor.width / 2,
        currentMap.walls[0].height / 2,
      ),
    [darkTexture, currentMap.floor.width, currentMap.walls],
  );

  const ewWallMap = useMemo(
    () =>
      setupTexture(
        darkTexture,
        currentMap.floor.depth / 2,
        currentMap.walls[2].height / 2,
      ),
    [darkTexture, currentMap.floor.depth, currentMap.walls],
  );

  return (
    <RigidBody type="fixed">
      <mesh
        position={[currentMap.floor.x, currentMap.floor.y, currentMap.floor.z]}
        receiveShadow
      >
        <boxGeometry
          args={[
            currentMap.floor.width,
            currentMap.floor.thickness,
            currentMap.floor.depth,
          ]}
        />
        <meshStandardMaterial map={floorMap} />
      </mesh>

      {currentMap.walls.map((wall) => {
        const isNorthSouth = wall.name === "north" || wall.name === "south";
        return (
          <mesh
            key={wall.name}
            position={[wall.x, wall.y, wall.z]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[wall.width, wall.height, wall.depth]} />
            <meshStandardMaterial map={isNorthSouth ? nsWallMap : ewWallMap} />
          </mesh>
        );
      })}
    </RigidBody>
  );
};

export default ArenaGeometry;
