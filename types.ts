
export interface PredictionStep {
  row: number;
  col: number;
}

export interface PredictionResult {
  path: number[]; // Array of column indices (0-4) for rows 0-9
  confidence: number;
  id: string;
  timestamp: number;
  analysis: string;
  gridData?: boolean[][];
}

// Added MinesPredictionResult interface to support Mines AI game prediction data
export interface MinesPredictionResult {
  safeSpots: number[]; // Array of cell indices (0-24)
  confidence: number;
  id: string;
  timestamp: number;
  analysis: string;
}

export interface CrashPredictionResult {
  predictedCrash: number;
  safeCashout: number;
  confidence: number;
  id: string;
  timestamp: number;
  analysis: string;
  history: number[];
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

export interface UserProfile {
  username: string;
  joinDate: number;
  stats: {
    gamesPlayed: number;
    totalWinnings: number;
    rank: string;
    trustScore: number;
  };
  preferences: {
    notifications: boolean;
    sound: boolean;
    haptics: boolean;
    showBalance: boolean;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  titleKey?: string;
  messageKey?: string;
  description?: string;
  timestamp: number;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}
