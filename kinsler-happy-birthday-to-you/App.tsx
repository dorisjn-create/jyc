import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { Overlay } from './components/Overlay';
import { TreeMorphState } from './types';
import { Loader } from '@react-three/drei';

function App() {
  const [morphState, setMorphState] = useState<TreeMorphState>(TreeMorphState.TREE_SHAPE);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* 2D UI Layer */}
      <Overlay morphState={morphState} setMorphState={setMorphState} />

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={[1, 2]} // Optimize pixel ratio
          gl={{ 
            antialias: false, // Postprocessing handles AA usually, or we turn it off for perf with bloom
            toneMapping: 3, // ACESFilmic
            toneMappingExposure: 1.5
          }}
          shadows
        >
          <Suspense fallback={null}>
            <Experience morphState={morphState} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Loading Overlay from Drei */}
      <Loader 
        containerStyles={{ background: '#050505' }}
        innerStyles={{ width: '200px', height: '2px', background: '#044f2e' }}
        barStyles={{ background: '#D4AF37', height: '2px' }}
        dataInterpolation={(p) => `Loading Signature Experience ${p.toFixed(0)}%`}
        dataStyles={{ color: '#D4AF37', fontFamily: '"Playfair Display", serif', fontSize: '14px' }}
      />
    </div>
  );
}

export default App;
