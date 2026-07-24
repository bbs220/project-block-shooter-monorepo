import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { useMemo } from "react";
import { gridTextures } from "../../utils/assetPaths";
import { RigidBody } from "@react-three/rapier";
import { MAPS } from "@block-shooter/shared";

const ArenaGeometry = () => {
  const [greenTexture, darkTexture] = useLoader(TextureLoader, [
    gridTextures.green2,
    gridTextures.dark2,
  ]);

  const width = MAPS.arena_01.floor.width; // 100
  const depth = MAPS.arena_01.floor.depth; // 100
  const floorThick = MAPS.arena_01.floor.thickness; // 1

  const wallHeight = 10;
  const wallThick = 1;
  const halfHeight = wallHeight / 2;

  // floor Map
  const floorMap = useMemo(() => {
    const tex = greenTexture.clone();
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.anisotropy = 16;
    tex.repeat.set(width / 2, depth / 2);
    tex.needsUpdate = true;
    return tex;
  }, [greenTexture, width, depth]);

  // north/south wall map
  const nsWallMap = useMemo(() => {
    const tex = darkTexture.clone();
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.anisotropy = 16;
    tex.repeat.set(width / 2, wallHeight / 2);
    tex.needsUpdate = true;
    return tex;
  }, [darkTexture, width, wallHeight]);

  // east/west wall map
  const ewWallMap = useMemo(() => {
    const tex = darkTexture.clone();
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.anisotropy = 16;
    tex.repeat.set(depth / 2, wallHeight / 2);
    tex.needsUpdate = true;
    return tex;
  }, [darkTexture, depth, wallHeight]);

  return (
    <RigidBody type="fixed">
      {/* floor */}
      <mesh position={[0, -floorThick / 2, 0]} receiveShadow>
        <boxGeometry args={[width, floorThick, depth]} />
        <meshStandardMaterial map={floorMap} />
      </mesh>

      {/* north wall */}
      <mesh position={[0, halfHeight, -depth / 2]} receiveShadow castShadow>
        <boxGeometry args={[width, wallHeight, wallThick]} />
        <meshStandardMaterial map={nsWallMap} />
      </mesh>

      {/* south wall */}
      <mesh position={[0, halfHeight, depth / 2]} receiveShadow castShadow>
        <boxGeometry args={[width, wallHeight, wallThick]} />
        <meshStandardMaterial map={nsWallMap} />
      </mesh>

      {/* east wall */}
      <mesh position={[width / 2, halfHeight, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThick, wallHeight, depth]} />
        <meshStandardMaterial map={ewWallMap} />
      </mesh>

      {/* west wall */}
      <mesh position={[-width / 2, halfHeight, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThick, wallHeight, depth]} />
        <meshStandardMaterial map={ewWallMap} />
      </mesh>
    </RigidBody>
  );
};

export default ArenaGeometry;
