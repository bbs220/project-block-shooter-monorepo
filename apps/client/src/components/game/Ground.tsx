import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { useMemo } from "react";
import { gridColorPath } from "../../utils/assetPaths";
import { RigidBody } from "@react-three/rapier";
import { MAPS } from "@block-shooter/shared";

const Ground = () => {
  const originalMap = useLoader(TextureLoader, gridColorPath);

  // clone the texture to safely modify it without upsetting the react compiler
  const clonedMap = useMemo(() => {
    const texture = originalMap.clone();

    // set the wrapping mode to repeat
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.anisotropy = 16;

    // tile the texture 50 times
    texture.repeat.set(50, 50);
    texture.needsUpdate = true;

    return texture;
  }, [originalMap]);

  return (
    <RigidBody type="fixed">
      <mesh position={[0, -0.5, 0]} receiveShadow>
        {/* Width: 100, Height (Thickness): 1, Depth: 100 */}
        <boxGeometry
          args={[
            MAPS.arena_01.floor.width,
            MAPS.arena_01.floor.thickness,
            MAPS.arena_01.floor.depth,
          ]}
        />
        <meshStandardMaterial map={clonedMap} />
      </mesh>
    </RigidBody>
  );
};

export default Ground;
