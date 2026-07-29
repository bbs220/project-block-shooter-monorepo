import type { Ref } from "react";
import * as THREE from "three";

type BasicShapeProps = {
  ref?: Ref<THREE.Mesh>;
  boxColor: string;
};

const BasicShape = ({ ref, boxColor }: BasicShapeProps) => {
  return (
    <mesh position={[0, 1, 0]} castShadow ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={boxColor} />
    </mesh>
  );
};

export default BasicShape;
