
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, XCircle, Target, AlertCircle, Scan, Cpu } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

const MotionDiv = motion.div as any;

interface GridProps {
  path: number[]; 
  isAnalyzing: boolean;
  predictionId?: string;
  onCellClick?: (rowIndex: number, colIndex: number) => void;
  rowCount: number;
  difficulty: string;
  revealRotten?: boolean;
  gridData?: boolean[][]; 
  language: Language;
}

const COLS = 5;
const ODDS_MAP = ["1.23", "1.54", "1.93", "2.41", "4.02", "6.71", "11.18", "27.96", "69.91", "349.54", "x500", "x1k", "x2.5k", "x5k", "MAX"];
const COL_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export const Grid: React.FC<GridProps> = ({ path, isAnalyzing, predictionId, rowCount, difficulty, revealRotten = false, gridData, language }) => {
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);
  const t = translations[language];
  const renderRowIndices = useMemo(() => Array.from({ length: rowCount }, (_, i) => rowCount - 1 - i), [rowCount]);
  const isFailure = !isAnalyzing && predictionId && (path.length === 0 || path.every(v => v === -1));
  const isSuccess = !isAnalyzing && predictionId && !isFailure;

  useEffect(() => {
      if (isSuccess) {
          setShowSuccessFlash(true);
          const timer = setTimeout(() => setShowSuccessFlash(false), 800);
          return () => clearTimeout(timer);
      }
  }, [predictionId, isSuccess]);

  const boardLayout = useMemo(() => {
    if (!predictionId) return null;
    return Array.from({ length: rowCount }).map((_, rowIndex) => {
        const safeColIndex = path[rowIndex] !== undefined ? path[rowIndex] : -1;
        if (safeColIndex === -1 && !gridData) return Array(COLS).fill('unknown');
        if (gridData && gridData[rowIndex]) {
            const realRow = gridData[rowIndex];
            return realRow.map((isSafe, colIndex) => colIndex === safeColIndex ? 'path' : (isSafe ? 'good' : 'bad'));
        }
        const badAppleCounts = Array.from({ length: 10 }, (_, i) => i + 1 <= 4 ? 1 : (i + 1 <= 7 ? 2 : (i + 1 <= 9 ? 3 : 4)));
        const numBad = badAppleCounts[rowIndex] || 1;
        const indices = Array.from({ length: COLS }, (_, i) => i);
        const potentialBadIndices = indices.filter(i => i !== safeColIndex);
        for (let i = potentialBadIndices.length - 1; i > 0; i--) {
             const j = Math.floor(Math.random() * (i + 1));
             [potentialBadIndices[i], potentialBadIndices[j]] = [potentialBadIndices[j], potentialBadIndices[i]];
        }
        const badIndices = potentialBadIndices.slice(0, numBad);
        return indices.map(colIndex => colIndex === safeColIndex ? 'path' : (badIndices.includes(colIndex) ? 'bad' : 'good'));
    });
  }, [predictionId, path, rowCount, gridData]);

  const getExtraVisibleIndex = (rowIndex: number, layoutRow: string[]) => {
      const goodIndices = layoutRow.map((type, idx) => type === 'good' ? idx : -1).filter(idx => idx !== -1);
      return goodIndices.length === 0 ? -1 : goodIndices[(rowIndex * 7 + 3) % goodIndices.length];
  };

  return (
    <div className="relative w-full mx-auto select-none overflow-hidden h-full flex flex-col">
      <div className={`flex flex-col gap-1.5 p-1 relative z-10 flex-1 ${showSuccessFlash ? 'brightness-150' : ''}`}>
        <div className="flex items-center gap-2 mb-2 px-1">
            <div className="w-10 flex justify-center opacity-20"><Target className="w-3 h-3 text-amber-500" /></div>
            <div className="grid grid-cols-5 gap-1.5 flex-1">{COL_LETTERS.map(l => <div key={l} className="flex flex-col items-center"><span className="text-[6px] font-black text-zinc-700 font-mono tracking-[0.25em] uppercase">{l}</span></div>)}</div>
        </div>
        <AnimatePresence>
            {isAnalyzing && (
                <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 rounded-[2rem] overflow-hidden border border-amber-500/20">
                    <div className="relative z-20 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-black/90 border border-amber-500/40 flex items-center justify-center relative">
                            <Cpu className="w-8 h-8 text-amber-500" />
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic">SCANNING_MATRIX</h3>
                            <p className="text-[7px] font-mono text-amber-500/60 uppercase tracking-widest">bypass_security_node_0x4F</p>
                        </div>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
        {renderRowIndices.map((rowIndex) => {
          const currentOdd = ODDS_MAP[rowIndex] || "MAX";
          const hasSelection = path[rowIndex] !== undefined && path[rowIndex] !== -1;
          const showResult = (hasSelection || (path.length > 0 && path[0] !== -1)) && !isAnalyzing && boardLayout;
          const isNeonOdd = rowIndex % 2 !== 0;
          let layoutRow: string[] = [];
          let extraVisibleIndex = -1;
          if (showResult && boardLayout && boardLayout[rowIndex]) {
              layoutRow = boardLayout[rowIndex];
              if (difficulty === 'Medium') extraVisibleIndex = getExtraVisibleIndex(rowIndex, layoutRow);
          }
          return (
            <div key={`row-${rowIndex}`} className="flex items-center gap-2.5">
               <div className="w-10 flex items-center justify-end relative h-full min-h-[44px]"><div className={`w-full py-1.5 rounded-xl border text-center flex flex-col items-center justify-center ${showResult ? (isNeonOdd ? 'border-amber-500/40 bg-amber-500/10 text-amber-500' : 'border-white/20 bg-white/10 text-white') : 'border-white/5 bg-white/0 text-zinc-900'}`}><span className="font-mono text-[8px] font-black tracking-tighter italic leading-none">{currentOdd}</span></div></div>
              <div className="grid grid-cols-5 gap-1.5 flex-1">
                {Array.from({ length: COLS }).map((_, colIndex) => {
                  const cellType = showResult && layoutRow.length > 0 ? layoutRow[colIndex] : 'unknown';
                  const isPath = cellType === 'path';
                  const isBad = cellType === 'bad';
                  const isGood = cellType === 'good';
                  let isVisible = false;
                  if (showResult && layoutRow.length > 0) isVisible = (difficulty === 'Hard') || (difficulty === 'Medium' ? (isPath || colIndex === extraVisibleIndex) : isPath) || (revealRotten && isBad);
                  return (
                    <div key={`cell-${rowIndex}-${colIndex}`} className={`aspect-[1.2/1] w-full flex items-center justify-center relative rounded-xl transition-all duration-300 ${isVisible && showResult ? (isPath ? 'bg-amber-500/20 border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : (isBad ? 'bg-red-500/10 border border-red-500/30' : 'bg-zinc-900/50 border border-zinc-800')) : 'bg-zinc-900/30 border border-zinc-800/50'}`}>
                      
                      {isVisible && showResult ? (
                        <MotionDiv initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="w-full h-full flex items-center justify-center p-2">
                          {isPath || isGood ? (
                            <Apple className={`w-[70%] h-[70%] ${isPath ? 'text-amber-500 fill-amber-500/20' : 'text-zinc-700'}`} />
                          ) : isBad ? (
                            <div className="relative flex items-center justify-center w-full h-full">
                              <Apple className="w-[60%] h-[60%] text-red-500/40" />
                              <XCircle className="absolute w-1/2 h-1/2 text-red-500" />
                            </div>
                          ) : (
                            <Apple className="w-[60%] h-[60%] text-zinc-800" />
                          )}
                        </MotionDiv>
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-amber-500 animate-pulse' : 'bg-zinc-800'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {isFailure && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 rounded-[2.5rem] p-10 text-center border-2 border-amber-500/30">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center mb-8">
                <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h3 className="text-xl font-black text-white uppercase mb-3 italic font-en tracking-[0.3em]">LINK_FAILURE</h3>
            <p className="text-zinc-400 text-[9px] font-mono uppercase tracking-[0.25em] max-w-[200px] leading-relaxed mb-8">{t.matrixFailureMsg}</p>
            <button onClick={() => { window.location.reload(); }} className="w-full max-w-[180px] py-5 bg-amber-500 text-black font-black text-[9px] uppercase tracking-[0.4em] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                <Scan className="w-4 h-4" />
                <span>{t.retrySync}</span>
            </button>
        </div>
      )}
    </div>
  );
};
