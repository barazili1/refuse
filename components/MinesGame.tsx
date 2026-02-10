import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bomb, Shield, ChevronLeft, Minus, Plus, Zap, Target, Binary, Globe } from 'lucide-react';
import { generateMinesPrediction } from '../services/gemini';
import { playSound } from '../services/audio';
import { MinesPredictionResult, Language, AccessKey } from '../types';
import { translations } from '../translations';

const MotionDiv = motion.div as any;

interface MinesGameProps {
    onBack: () => void;
    accessKeyData: AccessKey | null;
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

export const MinesGame: React.FC<MinesGameProps> = ({ onBack, accessKeyData, language, onLanguageChange }) => {
    const [mineCount, setMineCount] = useState(3);
    const [result, setResult] = useState<MinesPredictionResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const t = translations[language];

    const handlePredict = async () => {
        setIsAnalyzing(true);
        setResult(null);
        playSound('predict');
        
        try {
            const prediction = await generateMinesPrediction(mineCount);
            // Artificial delay for UX "scanning" feel
            await new Promise(r => setTimeout(r, 1200));
            
            setResult(prediction);
            playSound('success');
        } catch (error) {
            console.error("Mines Prediction Error:", error);
            playSound('crash');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <MotionDiv 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col p-4 pb-24 h-full overflow-y-auto bg-[#050505] text-left"
        >
            <div className="flex items-center justify-between mb-8">
                <button onClick={() => { playSound('click'); onBack(); }} className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-sm font-black text-white uppercase tracking-[0.2em]">{t.minesAi}</h1>
                    <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">{t.safetyGrid}</span>
                </div>
                <button 
                  onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }}
                  className="p-2 rounded-xl bg-zinc-900/50 border border-white/5 text-zinc-400 hover:text-white transition-all flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-red-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
            </div>

            {/* Mines Grid Visualization */}
            <div className="bg-[#09090b] p-4 rounded-3xl border border-white/5 shadow-2xl mb-8 relative group">
                <div className="absolute inset-0 bg-green-600/5 blur-3xl opacity-50 pointer-events-none" />
                <div className="grid grid-cols-5 gap-2 aspect-square relative z-10">
                    {Array.from({ length: 25 }).map((_, i) => {
                        const isSafe = result?.safeSpots.includes(i);
                        return (
                            <MotionDiv 
                                key={i}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.01 }}
                                className={`
                                    rounded-lg border flex items-center justify-center transition-all duration-500
                                    ${isSafe 
                                        ? 'bg-green-600/20 border-green-600/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                                        : 'bg-[#121214] border-white/5'}
                                `}
                            >
                                {isAnalyzing ? (
                                    <div className="w-1 h-1 bg-green-600/40 rounded-full animate-pulse" />
                                ) : isSafe ? (
                                    <MotionDiv
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="relative"
                                    >
                                        <Shield className="w-5 h-5 text-green-500" />
                                        <div className="absolute inset-0 bg-green-500/20 blur-md animate-pulse" />
                                    </MotionDiv>
                                ) : (
                                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                                )}
                            </MotionDiv>
                        );
                    })}
                </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
                <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{t.totalMines}</span>
                        <div className="flex items-center gap-4 bg-black/20 rounded-xl p-1 border border-white/5">
                            <button 
                                onClick={() => { playSound('click'); setMineCount(m => Math.max(1, m - 1)); }}
                                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-black text-white font-mono w-4 text-center">{mineCount}</span>
                            <button 
                                onClick={() => { playSound('click'); setMineCount(m => Math.min(24, m + 1)); }}
                                className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                        {[1, 3, 5, 10, 24].map(val => (
                            <button
                                key={val}
                                onClick={() => { playSound('click'); setMineCount(val); }}
                                className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${mineCount === val ? 'bg-green-700 border-green-600 text-white' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Analysis Console */}
                <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 min-h-[100px] relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                        <Binary className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex items-center gap-2 mb-2 relative z-10">
                        <div className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-green-600 animate-pulse' : 'bg-zinc-600'}`} />
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{t.aiAnalysis}</span>
                        {result && <span className="ml-auto text-[9px] font-mono text-green-500">{result.confidence}% {t.confidence}</span>}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 leading-relaxed relative z-10">
                        {isAnalyzing ? (
                            <span className="text-green-500 animate-pulse">{t.scanning}</span>
                        ) : result ? (
                            result.analysis
                        ) : (
                            <span className="text-zinc-700 italic">... {t.systemIdle} ...</span>
                        )}
                    </div>
                </div>

                <button 
                    onClick={handlePredict}
                    disabled={isAnalyzing}
                    className="w-full h-14 bg-green-700 hover:bg-green-600 disabled:opacity-50 disabled:bg-zinc-800 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                    {isAnalyzing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>{t.scanning}</span>
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5 fill-current" />
                            <span>{t.prediction}</span>
                        </>
                    )}
                </button>
            </div>
        </MotionDiv>
    );
};
