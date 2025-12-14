import React, { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState } from '../types';

interface BirthdayTextProps {
  morphState: TreeMorphState;
}

export const BirthdayText: React.FC<BirthdayTextProps> = ({ morphState }) => {
  const textRef = useRef<THREE.Mesh>(null);
  const opacityRef = useRef(0);

  useFrame((state, delta) => {
    if (!textRef.current) return;

    // Target opacity: 1 when SCATTERED, 0 when TREE
    const targetOpacity = morphState === TreeMorphState.SCATTERED ? 1 : 0;
    const step = delta * 2; // Fade speed

    if (opacityRef.current < targetOpacity) {
      opacityRef.current = Math.min(targetOpacity, opacityRef.current + step);
    } else if (opacityRef.current > targetOpacity) {
      opacityRef.current = Math.max(targetOpacity, opacityRef.current - step);
    }

    // Apply opacity to material
    const material = textRef.current.material as THREE.MeshStandardMaterial;
    material.opacity = opacityRef.current;
    material.transparent = true;
    material.depthWrite = false; // Prevents occlusion issues when fading
    
    // Gentle floating motion around World Y=0 (Local Y=2 due to group offset in Experience)
    const time = state.clock.getElapsedTime();
    textRef.current.position.y = 2 + Math.sin(time * 0.5) * 0.5;
  });

  return (
    <Text
      ref={textRef}
      // Using Great Vibes font from Google Fonts CDN for the "flower body" cursive look
      font="https://fonts.gstatic.com/s/greatvibes/v14/RWmMoKWR9v4ksMflq1L1x9P9_30.woff"
      fontSize={3.5}
      maxWidth={25}
      lineHeight={1.2}
      letterSpacing={0.05}
      textAlign="center"
      anchorX="center"
      anchorY="middle"
    >
      Happy Birthday{'\n'}Kinsler
      <meshStandardMaterial
        color="#D4AF37"
        emissive="#D4AF37"
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </Text>
  );
};
