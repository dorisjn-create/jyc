import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState } from '../types';

interface StarTopperProps {
  morphState: TreeMorphState;
}

export const StarTopper: React.FC<StarTopperProps> = ({ morphState }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Positions
  // Tree Top is approx y=9 relative to center of particles.
  const treePos = useMemo(() => new THREE.Vector3(0, 9.5, 0), []);
  const scatterPos = useMemo(() => new THREE.Vector3(0, 15, -5), []); // Floats up and away slightly
  
  // Animation state
  const currentMorph = useRef(0);

  // Generate 5-Pointed Star Shape
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const points = 5;
    const outerRadius = 1.2;
    const innerRadius = 0.5;

    for (let i = 0; i < points * 2; i++) {
      // Calculate angle: start from top (-PI/2)
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius; // In 2D shape, y is up/down

      if (i === 0) {
        shape.moveTo(x, y);
      } else {
        shape.lineTo(x, y);
      }
    }
    shape.closePath();
    return shape;
  }, []);

  const extrudeSettings = useMemo(() => ({
    depth: 0.4,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 2
  }), []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const target = morphState === TreeMorphState.TREE_SHAPE ? 1 : 0;
    const step = delta * 1.5;
    
    // Smooth transition logic similar to particles
    if (currentMorph.current < target) {
      currentMorph.current = Math.min(target, currentMorph.current + step);
    } else if (currentMorph.current > target) {
      currentMorph.current = Math.max(target, currentMorph.current - step);
    }
    
    const factor = THREE.MathUtils.smoothstep(currentMorph.current, 0, 1);
    
    // Position interpolation
    groupRef.current.position.lerpVectors(scatterPos, treePos, factor);
    
    // Rotation animation
    const time = state.clock.getElapsedTime();
    // Continuous slow rotation
    groupRef.current.rotation.y = time * 0.5;
    
    // When scattered, add some chaotic tilt
    const tilt = (1 - factor) * 0.5;
    groupRef.current.rotation.z = Math.sin(time) * tilt;
    groupRef.current.rotation.x = Math.cos(time * 0.8) * tilt;

    // Scale pulsing
    const scale = 1 + Math.sin(time * 2) * 0.05;
    groupRef.current.scale.setScalar(scale);
  });

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFD700'),
    emissive: new THREE.Color('#FFD700'),
    emissiveIntensity: 0.8,
    roughness: 0.1,
    metalness: 1.0,
  }), []);

  return (
    <group ref={groupRef}>
      {/* Center the extruded geometry because extrude starts at z=0 */}
      <mesh material={material} castShadow position={[0, 0, -0.2]}>
        <extrudeGeometry args={[starShape, extrudeSettings]} />
      </mesh>
      
      {/* Central glow point */}
      <pointLight intensity={3} distance={6} color="#FFD700" />
    </group>
  );
};