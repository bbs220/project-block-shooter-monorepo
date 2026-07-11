import type { Ref, RefObject } from "react";

const BasicShape = ({ ref, boxColor }: { ref: RefObject; boxColor: any }) => {
  return (
    <mesh position={[0, 1, 0]} castShadow ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={boxColor} />
    </mesh>
  );
};
export default BasicShape;
