import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { useMemo } from "react";
import { gridTextures } from "../../utils/assetPaths";
import { RigidBody } from "@react-three/rapier";
import { MAPS } from "@block-shooter/shared";

const ArenaGeometry = () => {
  const originalMap = useLoader(TextureLoader, gridTextures.green2);

  // clone the texture to safely modify it
  const clonedMap = useMemo(() => {
    const texture = originalMap.clone();
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.anisotropy = 16;
    texture.repeat.set(50, 50);
    texture.needsUpdate = true;
    return texture;
  }, [originalMap]);

  const width = MAPS.arena_01.floor.width; // 100
  const depth = MAPS.arena_01.floor.depth; // 100
  const floorThick = MAPS.arena_01.floor.thickness; // 1

  const wallHeight = 10;
  const wallThick = 1;
  const halfHeight = wallHeight / 2;

  return (
    // single fixed RigidBody perfectly wraps all 5 meshes into one static physics object
    <RigidBody type="fixed">
      {/* floor */}
      <mesh position={[0, -floorThick / 2, 0]} receiveShadow>
        <boxGeometry args={[width, floorThick, depth]} />
        <meshStandardMaterial map={clonedMap} />
      </mesh>

      {/* north wall */}
      <mesh position={[0, halfHeight, -depth / 2]} receiveShadow castShadow>
        <boxGeometry args={[width, wallHeight, wallThick]} />
        <meshStandardMaterial map={clonedMap} color="#888888" />
      </mesh>

      {/* south wall */}
      <mesh position={[0, halfHeight, depth / 2]} receiveShadow castShadow>
        <boxGeometry args={[width, wallHeight, wallThick]} />
        <meshStandardMaterial map={clonedMap} color="#888888" />
      </mesh>

      {/* east wall */}
      <mesh position={[width / 2, halfHeight, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThick, wallHeight, depth]} />
        <meshStandardMaterial map={clonedMap} color="#888888" />
      </mesh>

      {/* west wall */}
      <mesh position={[-width / 2, halfHeight, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThick, wallHeight, depth]} />
        <meshStandardMaterial map={clonedMap} color="#888888" />
      </mesh>
    </RigidBody>
  );
};

export default ArenaGeometry;
