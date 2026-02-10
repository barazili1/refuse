
import { GoogleGenAI } from "@google/genai";
import { PredictionResult, MinesPredictionResult } from '../types';

// Initialize the Google GenAI client with the API Key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GRID_COLS = 5;

const getRandomAnalysis = (): string => {
  const phrases = [
    "Pattern recognition sequence complete. Central corridor favored.",
    "Deviations detected in lateral rows. Zig-zag pattern highly probable.",
    "Grid density analysis suggests low trap probability in selected path.",
    "RNG seed oscillation detected. Safety path calculated with 92% variance.",
    "Vertical trendline established. Left-side bias detected in upper rows."
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
};

export const generatePrediction = async (rowCount: number, difficulty: string): Promise<PredictionResult> => {
  await new Promise(r => setTimeout(r, 1200));

  const path: number[] = [];
  let lastCol = 2;

  for (let i = 0; i < rowCount; i++) {
    const r = Math.random();
    let col;
    if (r > 0.7) {
        col = Math.floor(Math.random() * GRID_COLS);
    } else {
        const move = Math.floor(Math.random() * 3) - 1;
        col = Math.max(0, Math.min(GRID_COLS - 1, lastCol + move));
    }
    path.push(col);
    lastCol = col;
  }

  const confidence = Math.floor(Math.random() * (99 - 82) + 82);

  return {
    path: path,
    confidence: confidence,
    analysis: getRandomAnalysis(),
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
};

// Added generateMinesPrediction for Mines game support
export const generateMinesPrediction = async (mineCount: number): Promise<MinesPredictionResult> => {
  // Simulate AI processing
  await new Promise(r => setTimeout(r, 1200));

  const totalCells = 25;
  const safeSpotsCount = Math.max(3, 10 - Math.floor(mineCount / 2));
  const safeSpots: number[] = [];
  
  while (safeSpots.length < safeSpotsCount) {
    const r = Math.floor(Math.random() * totalCells);
    if (!safeSpots.includes(r)) {
      safeSpots.push(r);
    }
  }

  return {
    safeSpots,
    confidence: Math.floor(Math.random() * (99 - 85) + 85),
    analysis: "Probability matrix bypassed. Safety nodes identified in the grid cluster."
  };
};