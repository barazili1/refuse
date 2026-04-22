
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, XCircle, Target, AlertCircle, Scan, Cpu, ShieldAlert } from 'lucide-react';
import { translations } from '../translations';
import { Language } from '../types';

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

export function Grid({ path, isAnalyzing, predictionId, rowCount, difficulty, revealRotten = false, gridData, language }: GridProps) {
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
        const badAppleCounts = Array.from({ length: 15 }, (_, i) => i + 1 <= 4 ? 1 : (i + 1 <= 7 ? 2 : (i + 1 <= 9 ? 3 : 4)));
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
    <div className="relative w-full mx-auto select-none overflow-hidden h-full flex flex-col bg-[#050505]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(rgba(220,38,38,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      
      <div className={`flex flex-col gap-1.5 p-3 relative z-10 flex-1 transition-all duration-300 ${showSuccessFlash ? 'brightness-125' : ''}`}>
        <div className="flex items-center gap-3 mb-4 px-1">
            <div className="w-12 flex justify-center opacity-40"><Target className="w-4 h-4 text-red-600 animate-pulse" /></div>
            <div className="grid grid-cols-5 gap-2 flex-1">
                {COL_LETTERS.map(l => (
                    <div key={l} className="flex flex-col items-center">
                        <span className="text-[7px] font-black text-zinc-500 font-mono tracking-[0.3em] uppercase">{l}</span>
                        <div className="w-1 h-1 rounded-full bg-red-600/30 mt-1" />
                    </div>
                ))}
            </div>
        </div>

        <AnimatePresence>
            {isAnalyzing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm rounded-[2.5rem] overflow-hidden border border-red-600/30">
                    <div className="relative z-20 flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="absolute -inset-8 bg-red-600/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative w-24 h-24 rounded-3xl bg-black border border-red-600/40 flex items-center justify-center">
                                <Cpu className="w-12 h-12 text-red-600" />
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-2 border-dashed border-red-600/20 rounded-3xl" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-sm font-black text-white uppercase tracking-[0.6em] italic animate-pulse">DECRYPTING_...</h3>
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-1 w-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <div className="h-1 w-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <div className="h-1 w-2 bg-red-600 rounded-full animate-bounce" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col gap-2">
            {renderRowIndices.map((rowIndex) => {
                const currentOdd = ODDS_MAP[rowIndex] || "MAX";
                const hasSelection = path[rowIndex] !== undefined && path[rowIndex] !== -1;
                const showResult = (hasSelection || (path.length > 0 && path[0] !== -1)) && !isAnalyzing && boardLayout;
                const isEvenRow = rowIndex % 2 === 0;
                
                let layoutRow: string[] = [];
                let extraVisibleIndex = -1;
                if (showResult && boardLayout && boardLayout[rowIndex]) {
                    layoutRow = boardLayout[rowIndex];
                    if (difficulty === 'Medium') extraVisibleIndex = getExtraVisibleIndex(rowIndex, layoutRow);
                }

                return (
                    <div key={`row-${rowIndex}`} className="flex items-center gap-3">
                        <div className="w-12 flex items-center justify-end h-full">
                            <div className={`w-full py-2 rounded-xl border text-center transition-all duration-500 shadow-lg ${showResult ? (isEvenRow ? 'border-red-600/60 bg-red-600/20 text-red-500 shadow-red-900/40' : 'border-white/30 bg-white/10 text-white') : 'border-white/5 bg-transparent text-zinc-800'}`}>
                                <span className="font-mono text-[9px] font-black italic tracking-tighter leading-none">{currentOdd}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-5 gap-2 flex-1">
                            {Array.from({ length: COLS }).map((_, colIndex) => {
                                const cellType = showResult && layoutRow.length > 0 ? layoutRow[colIndex] : 'unknown';
                                const isPath = cellType === 'path';
                                const isBad = cellType === 'bad';
                                const isGood = cellType === 'good';
                                
                                let isVisible = false;
                                if (showResult && layoutRow.length > 0) {
                                    isVisible = (difficulty === 'Hard') || 
                                                (difficulty === 'Medium' ? (isPath || colIndex === extraVisibleIndex) : isPath) || 
                                                (revealRotten && isBad);
                                }

                                return (
                                    <div key={`cell-${rowIndex}-${colIndex}`} className={`aspect-[1.1/1] w-full flex items-center justify-center relative rounded-2xl transition-all duration-500 overflow-hidden group/cell ${isVisible && showResult ? (isPath ? 'bg-red-600/25 border-2 border-red-600 shadow-[0_0_25px_rgba(220,38,38,0.5)] z-20 scale-105' : (isBad ? 'bg-zinc-950/80 border border-red-900/40' : 'bg-red-950/20 border border-red-500/10')) : 'bg-zinc-900/40 border border-white/5'}`}>
                                        
                                        {/* Scanline line for active cells */}
                                        {isPath && isVisible && showResult && (
                                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-[1px] bg-red-400/50 shadow-[0_0_10px_#f87171] animate-scanline" />
                                            </div>
                                        )}

                                        {isVisible && showResult ? (
                                            <motion.div initial={{ scale: 0.4, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="w-full h-full flex items-center justify-center p-2.5">
                                                {isPath ? (
                                                    <div className="relative w-full h-full flex items-center justify-center">
                                                        <div className="absolute inset-0 bg-red-600/10 rounded-full blur-md animate-pulse" />
                                                        <Apple className="w-[85%] h-[85%] text-red-500 fill-red-500/20 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                                                    </div>
                                                ) : isGood ? (
                                                    <Apple className="w-[70%] h-[70%] text-red-900" />
                                                ) : isBad ? (
                                                    <div className="relative flex items-center justify-center w-full h-full">
                                                        <Apple className="w-[70%] h-[70%] text-zinc-900 opacity-40 shrink-0" />
                                                        <XCircle className="absolute w-[60%] h-[60%] text-red-600/80" />
                                                    </div>
                                                ) : (
                                                    <Apple className="w-[70%] h-[70%] text-zinc-900 opacity-20" />
                                                )}
                                            </motion.div>
                                        ) : (
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <div className={`w-1 h-1 rounded-full transition-all duration-700 ${isAnalyzing ? 'bg-red-600 scale-150 shadow-[0_0_12px_rgba(220,38,38,1)]' : 'bg-zinc-800'}`} />
                                                <div className="absolute inset-[3px] border-[1px] border-white/[0.02] rounded-xl group-hover/cell:border-red-600/10 transition-colors" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {isFailure && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/98 backdrop-blur-md rounded-[2.5rem] p-10 text-center border-2 border-red-600/40 shadow-[0_0_100px_rgba(0,0,0,1)]">
            <div className="relative mb-10">
                <div className="absolute -inset-8 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-24 h-24 rounded-full bg-black border border-red-600/50 flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.3)]">
                    <ShieldAlert className="w-12 h-12 text-red-600" />
                </div>
            </div>
            <h3 className="text-2xl font-black text-white uppercase mb-4 italic font-en tracking-[0.4em] leading-none">UPLINK_DENIED</h3>
            <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.3em] max-w-[240px] leading-relaxed mb-10 italic">
                {t.matrixFailureMsg || "ENCRYPTION_WAVE_LOST. TARGET_SERVER_REJECTED_HANDSHAKE_0x004"}
            </p>
            <button onClick={() => { window.location.reload(); }} className="w-full max-w-[220px] h-16 bg-red-600 text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-red-500 shadow-[0_15px_40px_rgba(220,38,38,0.4)] italic">
                <Scan className="w-5 h-5" />
                <span>{t.retrySync || "RE_INITIALIZE"}</span>
            </button>
        </div>
      )}

      <style>{`
        @keyframes scanline {
            0% { top: 0; opacity: 0; }
            5% { opacity: 0.8; }
            50% { opacity: 0.3; }
            95% { opacity: 0.8; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scanline {
            animation: scanline 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
;
