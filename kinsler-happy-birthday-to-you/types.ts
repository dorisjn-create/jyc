import { Vector3 } from 'three';

export enum TreeMorphState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface ParticleData {
  id: number;
  scatterPosition: Vector3;
  treePosition: Vector3;
  rotation: [number, number, number];
  scale: number;
  speed: number; // For individual slight movements
}

export interface SceneState {
  morphState: TreeMorphState;
  setMorphState: (state: TreeMorphState) => void;
}
