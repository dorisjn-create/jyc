import React, { useRef } from 'react';
import { OrbitControls, Environment, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { TreeParticles } from './TreeParticles';
import { StarTopper } from './StarTopper';
import { TreeMorphState } from '../types';
import * as THREE from 'three';

interface ExperienceProps {
  morphState: TreeMorphState;
}

export const Experience: React.FC<ExperienceProps> = ({ morphState }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 25]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        minDistance={10} 
        maxDistance={40} 
        autoRotate={morphState === TreeMorphState.TREE_SHAPE}
        autoRotateSpeed={0.5}
      />

      {/* Environment & Background */}
      <color attach="background" args={['#020403']} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Environment preset="city" />

      {/* Lighting - Cinematic */}
      <ambientLight intensity={0.2} color="#002a18" />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" castShadow />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#044f2e" />
      <spotLight 
        position={[0, 20, 0]} 
        angle={0.5} 
        penumbra={1} 
        intensity={2} 
        color="#fff" 
        castShadow 
      />

      {/* The Core Interactive Elements */}
      <group position={[0, -2, 0]}>
        {/* Deep Green "Needles" */}
        <TreeParticles count={1800} type="LEAF" morphState={morphState} />
        
        {/* Golden Ornaments - Fewer but impactful */}
        <TreeParticles count={300} type="ORNAMENT" morphState={morphState} />
        
        {/* The Golden 5-Pointed Star Topper */}
        <StarTopper morphState={morphState} />
        
        {/* A base glow to ground the tree */}
        {morphState === TreeMorphState.TREE_SHAPE && (
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -9, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshBasicMaterial color="#000" transparent opacity={0.5} />
            </mesh>
        )}
      </group>

      {/* Post Processing for the "Arix Signature" Look */}
      <EffectComposer disableNormalPass>
        {/* Luxury Glow */}
        <Bloom 
            luminanceThreshold={0.5} 
            mipmapBlur 
            intensity={1.2} 
            radius={0.6}
            levels={8}
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
};