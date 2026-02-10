
export interface PredictionResult {
  path: number[]; 
  confidence: number;
  id: string;
  timestamp: number;
  analysis: string;
  gridData?: boolean[][];
}

// Added MinesPredictionResult interface for Mines game
export interface MinesPredictionResult {
  safeSpots: number[];
  confidence: number;
  analysis: string;
}

export enum GameState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  PREDICTED = 'PREDICTED',
  ERROR = 'ERROR'
}

export type Platform = '1XBET' | 'MELBET';
export type ViewState = 'APPLE' | 'SELECTION' | 'CONDITIONS';
export type Language = 'ar' | 'en';

export interface AccessKey {
  key: string;
  isActive: boolean;
  type: string;
  name?: string;
  createdAt: number;
  expiresAt?: number;
  description?: string;
  isAdminMode?: boolean;
}