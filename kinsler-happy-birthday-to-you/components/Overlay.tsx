import React from 'react';
import { TreeMorphState } from '../types';
import { Sparkles, Play, Pause, GitGraph, Box } from 'lucide-react';

interface OverlayProps {
  morphState: TreeMorphState;
  setMorphState: (state: TreeMorphState) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ morphState, setMorphState }) => {
  const isTree = morphState === TreeMorphState.TREE_SHAPE;

  const toggleState = () => {
    setMorphState(isTree ? TreeMorphState.SCATTERED : TreeMorphState.TREE_SHAPE);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8 md:p-12">
      
      {/* Header */}
      <header className="flex justify-between items-start animate-fade-in">
        <div>
          <h1 className="font-serif text-4xl md:text-6xl text-arix-gold tracking-tighter drop-shadow-lg">
            KINSLER
          </h1>
          <p className="font-sans text-arix-goldLight text-xs md:text-sm tracking-[0.3em] uppercase mt-2 opacity-80">
            Happy Birthday To You
          </p>
        </div>
        <div className="hidden md:block">
            <div className="border border-arix-emeraldLight bg-arix-emerald/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-arix-goldLight text-xs font-sans tracking-widest">
                    CELEBRATION
                </span>
            </div>
        </div>
      </header>

      {/* Main Control - Center Bottom */}
      <div className="pointer-events-auto self-center mb-8 flex flex-col items-center gap-6">
        
        <div className="bg-black/30 backdrop-blur-md border border-arix-gold/30 p-1 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <button
            onClick={toggleState}
            className={`
                group relative flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-700 ease-out
                ${isTree 
                ? 'bg-arix-gold text-arix-black hover:bg-white' 
                : 'bg-arix-emerald text-arix-gold hover:bg-arix-emeraldLight border border-arix-gold/20'
                }
            `}
            >
            <span className="relative z-10 font-sans font-bold tracking-widest uppercase text-sm">
                {isTree ? 'Make a Wish' : 'Assemble Gift'}
            </span>
            <span className="relative z-10">
                {isTree ? <Sparkles size={16} /> : <Box size={16} />}
            </span>
            
            {/* Glow effect */}
            {isTree && (
                <div className="absolute inset-0 rounded-full bg-arix-gold blur-md opacity-50 animate-pulse"></div>
            )}
            </button>
        </div>

        <p className={`
            font-serif italic text-arix-goldLight/70 transition-opacity duration-1000
            ${isTree ? 'opacity-100' : 'opacity-0'}
        `}>
            "May your year be golden."
        </p>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-end text-arix-emeraldLight/60 font-sans text-[10px] uppercase tracking-widest">
        <div className="flex gap-4">
            <span>React 19</span>
            <span>Three.js</span>
            <span>R3F</span>
        </div>
        <div className="text-right">
            Interactive Experience <br />
            v1.0.5
        </div>
      </div>
    </div>
  );
};