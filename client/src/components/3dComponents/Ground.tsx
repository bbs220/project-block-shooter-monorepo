import { useLoader } from "@react-three/fiber";
import { TextureLoader, RepeatWrapping } from "three";
import { useMemo } from "react";
import { gridColorPath } from "../../utils/assetPaths";

const Ground = () => {
  const originalMap = useLoader(TextureLoader, gridColorPath);

  // clone the texture to safely modify it without upsetting the react compiler
  const gridMap = useMemo(() => {
    const texture = originalMap.clone();

    // set the wrapping mode to repeat
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.anisotropy = 16;

    // tile the texture 25 times
    texture.repeat.set(25, 25);

    // tell three.js the texture has been updated
    texture.needsUpdate = true;

    return texture;
  }, [originalMap]);

  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial map={gridMap} />
    </mesh>
  );
};

export default Ground;
