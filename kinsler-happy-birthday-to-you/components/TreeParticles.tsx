import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeMorphState, ParticleData } from '../types';

// Utility to generate random point in sphere
const randomInSphere = (radius: number): THREE.Vector3 => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  const sinPhi = Math.sin(phi);
  return new THREE.Vector3(
    r * sinPhi * Math.cos(theta),
    r * sinPhi * Math.sin(theta),
    r * Math.cos(phi)
  );
};

interface TreeParticlesProps {
  count: number;
  type: 'LEAF' | 'ORNAMENT';
  morphState: TreeMorphState;
}

export const TreeParticles: React.FC<TreeParticlesProps> = ({ count, type, morphState }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate data once
  const particles = useMemo(() => {
    const data: ParticleData[] = [];
    const height = 18;
    const baseRadius = 6;

    for (let i = 0; i < count; i++) {
      // 1. SCATTER POSITION (Chaos)
      const scatterPos = randomInSphere(25); // Large radius spread

      // 2. TREE POSITION (Order)
      // Cone Spiral math
      const yRatio = i / count; // 0 to 1
      const y = (yRatio * height) - (height / 2); // Center vertically
      
      // Radius decreases as we go up
      const r = (1 - yRatio) * baseRadius;
      
      // Golden angle for organic spiral distribution
      const angle = i * 2.4; 
      
      // Add some noise to tree shape so it's not perfect geometric cone
      const jitter = type === 'LEAF' ? 0.2 : 0.5;
      const x = Math.cos(angle) * r + (Math.random() - 0.5) * jitter;
      const z = Math.sin(angle) * r + (Math.random() - 0.5) * jitter;

      const treePos = new THREE.Vector3(x, y, z);

      data.push({
        id: i,
        scatterPosition: scatterPos,
        treePosition: treePos,
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: type === 'LEAF' ? Math.random() * 0.5 + 0.5 : Math.random() * 0.8 + 0.4,
        speed: Math.random() * 0.2 + 0.1
      });
    }
    return data;
  }, [count, type]);

  // Animation Loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Determine target factor (0 = Scatter, 1 = Tree)
    const targetFactor = morphState === TreeMorphState.TREE_SHAPE ? 1 : 0;
    
    // Smooth interpolation factor (Lerp the lerp for smoothness)
    // We use a custom property on the mesh to store current morph value
    const userData = meshRef.current.userData as { currentMorph?: number };
    if (userData.currentMorph === undefined) userData.currentMorph = 0;
    
    // Smooth damping towards target
    const step = delta * 1.5; // Speed of transition
    if (userData.currentMorph < targetFactor) {
      userData.currentMorph = Math.min(targetFactor, userData.currentMorph + step);
    } else if (userData.currentMorph > targetFactor) {
      userData.currentMorph = Math.max(targetFactor, userData.currentMorph - step);
    }

    const morphFactor = THREE.MathUtils.smoothstep(userData.currentMorph, 0, 1);
    
    // Rotate the whole tree slightly
    if (morphState === TreeMorphState.TREE_SHAPE) {
       meshRef.current.rotation.y += delta * 0.1;
    } else {
       // Slow chaotic rotation when scattered
       meshRef.current.rotation.y += delta * 0.02;
    }

    particles.forEach((particle, i) => {
      // Interpolate position
      const currentPos = new THREE.Vector3().lerpVectors(
        particle.scatterPosition,
        particle.treePosition,
        morphFactor
      );

      // Add gentle floating motion
      const time = state.clock.getElapsedTime();
      const floatY = Math.sin(time * particle.speed + particle.id) * 0.2 * (1 - morphFactor * 0.8); 
      // Float is reduced when in tree shape for stability
      
      currentPos.y += floatY;

      dummy.position.copy(currentPos);
      
      // Interpolate rotation (Chaotic -> Aligned upwards/outwards)
      // For simplicity, we keep random rotation but stabilize it in tree form
      dummy.rotation.set(
        particle.rotation[0] + time * 0.1, 
        particle.rotation[1] + time * 0.1, 
        particle.rotation[2]
      );
      
      // Look at center if tree
      if (morphFactor > 0.8) {
         dummy.lookAt(0, currentPos.y, 0);
      }

      dummy.scale.setScalar(particle.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  // Materials
  const material = useMemo(() => {
    if (type === 'LEAF') {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#004d25'), // Deep Emerald
        roughness: 0.4,
        metalness: 0.3,
        emissive: new THREE.Color('#001a0d'),
        emissiveIntensity: 0.2,
      });
    } else {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#FFD700'), // Gold
        roughness: 0.1,
        metalness: 1, // High metal
        emissive: new THREE.Color('#C5A000'),
        emissiveIntensity: 0.8, // Glowy gold
      });
    }
  }, [type]);

  // Geometry
  const geometry = useMemo(() => {
    if (type === 'LEAF') {
      // Tetrahedrons look like abstract pine needles/crystals
      return new THREE.TetrahedronGeometry(0.3, 0);
    } else {
      // Spheres for ornaments
      return new THREE.IcosahedronGeometry(0.4, 1);
    }
  }, [type]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      castShadow
      receiveShadow
    />
  );
};
