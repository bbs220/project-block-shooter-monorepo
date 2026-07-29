import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { combatState } from "@block-shooter/shared";

const vignetteShader = {
  uniforms: {
    darkness: { value: 0.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0); 
    }
  `,
  fragmentShader: `
    uniform float darkness;
    varying vec2 vUv;
    void main() {
      vec2 center = vUv - 0.5;
      float dist = length(center);
      float vignette = smoothstep(0.3, 0.7, dist);

      gl_FragColor = vec4(0.0, 0.0, 0.0, vignette * darkness);
    }
  `,
};

export default function AdsVignette() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(() => {
    if (!materialRef.current) return;

    const targetDarkness = combatState.isAiming ? 0.8 : 0.0;

    // lerp the GLSL uniform
    materialRef.current.uniforms.darkness.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.darkness.value,
      targetDarkness,
      0.15,
    );
  });

  return (
    <mesh
      frustumCulled={false} // ensure it never disappears
      renderOrder={9999} // force it to draw last
    >
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        args={[vignetteShader]}
        transparent={true}
        depthTest={false} // ignore depth so it renders over walls/guns
        depthWrite={false}
      />
    </mesh>
  );
}
