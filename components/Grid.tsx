
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
      <div className={`flex flex-col gap-1.5 p-1 relative z-10 transition-all duration-300 flex-1 ${showSuccessFlash ? 'brightness-125' : ''}`}>
        <div className="flex items-center gap-2.5 mb-1 px-0.5">
            <div className="w-12 flex justify-center opacity-10"><Target className="w-2.5 h-2.5 text-zinc-500" /></div>
            <div className="grid grid-cols-5 gap-1.5 flex-1">{COL_LETTERS.map(l => <div key={l} className="flex flex-col items-center"><span className="text-[6px] font-black text-zinc-800 font-mono tracking-[0.2em] uppercase">{l}</span></div>)}</div>
        </div>
        <AnimatePresence>
            {isAnalyzing && (
                <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-[2rem] overflow-hidden">
                    <MotionDiv animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-red-600/5" />
                    <div className="relative z-20 flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-black/80 border border-red-600/30 flex items-center justify-center relative"><Cpu className="w-8 h-8 text-red-600 animate-pulse" /><div className="absolute inset-0 bg-red-600/5 blur-xl animate-pulse" /></div>
                        <div className="text-center space-y-1"><h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic animate-pulse">ANALYZING_MATRIX</h3><p className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">bypass_security_node_0x4F</p></div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none opacity-10 font-mono text-[8px] text-red-600 overflow-hidden leading-none p-4 select-none">{Array.from({ length: 15 }).map((_, i) => <div key={i} className="whitespace-nowrap">{Math.random().toString(16).repeat(10)}</div>)}</div>
                </MotionDiv>
            )}
        </AnimatePresence>
        {renderRowIndices.map((rowIndex) => {
          const currentOdd = ODDS_MAP[rowIndex] || "MAX";
          const hasSelection = path[rowIndex] !== undefined && path[rowIndex] !== -1;
          const showResult = (hasSelection || (path.length > 0 && path[0] !== -1)) && !isAnalyzing && boardLayout;
          const isRedOdd = rowIndex % 2 !== 0;
          let layoutRow: string[] = [];
          let extraVisibleIndex = -1;
          if (showResult && boardLayout && boardLayout[rowIndex]) {
              layoutRow = boardLayout[rowIndex];
              if (difficulty === 'Medium') extraVisibleIndex = getExtraVisibleIndex(rowIndex, layoutRow);
          }
          return (
            <div key={`row-${rowIndex}`} className="flex items-center gap-2.5">
               <div className="w-12 flex items-center justify-end relative h-full min-h-[46px]"><div className={`w-full py-1.5 rounded-lg border text-center flex flex-col items-center justify-center transition-all duration-300 ${showResult ? (isRedOdd ? 'border-red-600/30 bg-red-600/5 text-red-500' : 'border-white/20 bg-white/5 text-white') : 'border-white/5 bg-white/0 text-zinc-800'}`}><span className="font-mono text-[8.5px] font-black tracking-tighter italic leading-none">{currentOdd}</span></div></div>
              <div className="grid grid-cols-5 gap-1.5 flex-1">
                {Array.from({ length: COLS }).map((_, colIndex) => {
                  const cellType = showResult && layoutRow.length > 0 ? layoutRow[colIndex] : 'unknown';
                  const isPath = cellType === 'path';
                  const isBad = cellType === 'bad';
                  const isGood = cellType === 'good';
                  let isVisible = false;
                  if (showResult && layoutRow.length > 0) isVisible = (difficulty === 'Hard') || (difficulty === 'Medium' ? (isPath || colIndex === extraVisibleIndex) : isPath) || (revealRotten && isBad);
                  return (
                    <div key={`cell-${rowIndex}-${colIndex}`} style={{ willChange: 'transform, opacity' }} className={`aspect-square w-full rounded-[15px] flex items-center justify-center relative border transition-colors duration-500 transform-gpu ${isVisible && showResult ? (isPath ? 'bg-green-600/10 border-green-500 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]' : (isBad ? 'bg-red-900/10 border-red-600' : (isGood ? 'bg-green-900/5 border-green-600/30' : 'bg-white/0 border-white/5'))) : 'bg-white/0 border-white/[0.03]'}`}>
                      {isVisible && showResult ? (
                        <MotionDiv initial={{ scale: 0, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: (rowIndex * 0.12) + (colIndex * 0.02) }} className="w-full h-full flex items-center justify-center p-1 transform-gpu">{isPath || isGood ? <Apple className={`w-[85%] h-[85%] ${isPath ? 'text-green-500 fill-green-500/20' : 'text-green-900/40 fill-green-900/5'}`} /> : isBad ? <div className={`relative flex items-center justify-center ${difficulty === 'Hard' ? 'opacity-60' : 'opacity-30'}`}><Apple className="w-[70%] h-[70%] text-red-700 fill-red-900/5" /><XCircle className="absolute w-1/2 h-1/2 text-red-500/80" /></div> : <Apple className={`w-[70%] h-[70%] ${difficulty === 'Hard' ? 'text-green-900/40 fill-green-900/5' : 'text-zinc-800 opacity-5'}`} />}</MotionDiv>
                      ) : (
                        <div className={`w-1 h-1 rounded-full transition-all duration-500 ${isAnalyzing ? 'bg-red-600 scale-[2] animate-pulse' : 'bg-zinc-900 opacity-20'}`} />
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
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/80 rounded-[2.5rem] p-8 text-center backdrop-blur-xl"><div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-6"><AlertCircle className="w-8 h-8 text-red-600 animate-pulse" /></div><h3 className="text-lg font-black text-white uppercase mb-2 italic font-en tracking-widest">LINK_FAILURE</h3><p className="text-zinc-500 text-[8px] font-mono uppercase tracking-[0.2em] max-w-[180px] leading-relaxed mb-6">{t.matrixFailureMsg}</p><button onClick={() => { window.location.reload(); }} className="w-full max-w-[160px] py-4 bg-white/10 text-white border border-white/10 font-black text-[8px] uppercase tracking-[0.3em] rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2"><Scan className="w-3.5 h-3.5" /><span>{t.retrySync}</span></button></div>
      )}
    </div>
  );
};
