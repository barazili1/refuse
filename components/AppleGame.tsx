
import React, { useState, useEffect, useMemo } from 'react';
import { Grid } from './Grid';
import { generatePrediction } from '../services/gemini';
import { fetchAppleGridData, updateAppleGridData } from '../services/database';
import { playSound } from '../services/audio';
import { GameState, PredictionResult, AccessKey, Language, Platform } from '../types';
import { translations } from '../translations';
import { 
    Target,
    Zap,
    Shield,
    Eye,
    EyeOff,
    RotateCcw,
    Users,
    Globe,
    ChevronLeft,
    ChevronDown,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface AppleGameProps {
  onBack: () => void;
  accessKeyData: AccessKey | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  platform: Platform;
}

export const AppleGame: React.FC<AppleGameProps> = ({ onBack, accessKeyData, language, onLanguageChange, platform }) => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [isUpdating, setIsUpdating] = useState(false);
  const [predictionProgress, setPredictionProgress] = useState(0); 
  const t = translations[language];
  const isRtl = language === 'ar';
  const [onlineUsersCount, setOnlineUsersCount] = useState(() => Math.floor(Math.random() * (1000 - 50 + 1)) + 50);

  const [rowCount, setRowCount] = useState(() => {
    try {
        const saved = localStorage.getItem('fortune-ai-rows');
        if (saved) return Math.min(10, Math.max(5, parseInt(saved, 10)));
    } catch (e) {}
    return 10;
  });

  const [difficulty, setDifficulty] = useState<'Easy' | 'Pro'>(() => {
    try {
        const saved = localStorage.getItem('fortune-ai-difficulty');
        if (saved === 'Easy' || saved === 'Pro') return saved as 'Easy' | 'Pro';
    } catch (e) {}
    return 'Pro';
  });

  const [currentResult, setCurrentResult] = useState<PredictionResult | null>(() => {
    try {
        const saved = localStorage.getItem('fortune-ai-last-result');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed.path)) return parsed;
        }
    } catch (e) {}
    return null;
  });

  const [revealRotten, setRevealRotten] = useState(false);
  const [isRiskMenuOpen, setIsRiskMenuOpen] = useState(false);
  const [isHeightMenuOpen, setIsHeightMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
        setOnlineUsersCount(prev => {
            const change = Math.floor(Math.random() * 7) - 3;
            return Math.min(1000, Math.max(50, prev + change));
        });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
      localStorage.setItem('fortune-ai-rows', rowCount.toString());
      localStorage.setItem('fortune-ai-difficulty', difficulty);
      if (currentResult) {
          localStorage.setItem('fortune-ai-last-result', JSON.stringify(currentResult));
          if (gameState === GameState.IDLE) setGameState(GameState.PREDICTED);
      }
  }, [rowCount, difficulty, currentResult, gameState]);

  const handlePredict = async () => {
    if (gameState === GameState.ANALYZING) return;
    setPredictionProgress(0);
    setGameState(GameState.ANALYZING);
    playSound('predict');
    setPredictionProgress(15);
    await new Promise(r => setTimeout(r, 700));
    setPredictionProgress(45);
    let realGridData = null;
    if (accessKeyData?.isAdminMode) {
        realGridData = await fetchAppleGridData(platform);
    }
    await new Promise(r => setTimeout(r, 1000));
    setPredictionProgress(80);
    await new Promise(r => setTimeout(r, 800));
    let result: PredictionResult;
    if (realGridData) {
        const path: number[] = [];
        for (let i = 0; i < rowCount; i++) {
            if (i < realGridData.length) {
                const row = realGridData[i];
                const safeIndices = row.map((isSafe, idx) => isSafe ? idx : -1).filter(idx => idx !== -1);
                if (safeIndices.length > 0) {
                    path.push(safeIndices[Math.floor(Math.random() * safeIndices.length)]);
                } else path.push(-1);
            } else path.push(Math.floor(Math.random() * 5));
        }
        result = {
            path,
            confidence: 99, 
            analysis: language === 'ar' ? "تم اعتراض الخادم بنجاح. فك تشفير مصفوفة الاحتمالات." : "SERVER INTERCEPTED. DECRYPTING PROBABILITY MATRIX.",
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            gridData: realGridData
        };
    } else {
        result = await generatePrediction(rowCount, difficulty === 'Pro' ? 'Hard' : 'Easy');
    }
    setPredictionProgress(100);
    playSound('success');
    setTimeout(() => {
        setGameState(GameState.PREDICTED);
        setCurrentResult(result);
    }, 400);
  };

  const handleNewGame = async () => {
      if (isUpdating) return;
      setIsUpdating(true);
      playSound('click');
      await updateAppleGridData(platform);
      await new Promise(r => setTimeout(r, 600));
      setGameState(GameState.IDLE);
      setCurrentResult(null);
      setRevealRotten(false);
      setIsUpdating(false);
      playSound('success');
  };

  const handleDifficultySelect = (val: 'Easy' | 'Pro') => {
    playSound('click');
    setDifficulty(val);
    setIsRiskMenuOpen(false);
    if(currentResult) {
        setGameState(GameState.IDLE);
        setCurrentResult(null);
    }
  };

  const handleHeightSelect = (val: number) => {
    playSound('click');
    setRowCount(val);
    setIsHeightMenuOpen(false);
    if(currentResult) {
        setGameState(GameState.IDLE);
        setCurrentResult(null);
    }
  };

  const isAnalyzing = gameState === GameState.ANALYZING;

  return (
    <div className={`flex flex-col h-full relative pt-0 select-none bg-[#050505] overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
        <MotionDiv initial={{ y: -100 }} animate={{ y: 0 }} dir="ltr" className="fixed top-0 left-0 right-0 z-[100] h-14 bg-black/80 backdrop-blur-md border-b border-amber-500/20 flex items-center justify-between px-6">
            <div className="flex items-center gap-3 flex-row">
                <button onClick={() => { playSound('click'); onBack(); }} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-amber-500/20 hover:border-amber-500/50 flex items-center justify-center transition-all active:scale-90 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col items-start">
                    <div className="border border-amber-500/30 rounded-[8px] px-2 py-1 bg-black/50 flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md overflow-hidden border border-amber-500/40">
                            <img 
                                src="https://image2url.com/r2/default/images/1771685718404-0db562f8-2fce-4446-b376-7c92ec46acff.jpeg" 
                                alt="Logo" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-[9px] font-black text-white tracking-[0.1em] uppercase leading-none font-mono">
                            UPLINK: <span className="text-amber-500">{accessKeyData?.key || "8963007529"}</span>
                        </h1>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }} className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-amber-500/20 hover:border-amber-500/50 active:scale-95 transition-all flex items-center justify-center group">
                    <Globe className="w-3.5 h-3.5 mr-1.5 text-amber-500 group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-[9px] font-black uppercase font-mono tracking-tighter">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
            </div>
        </MotionDiv>
        <div className={`flex-1 overflow-y-auto custom-scrollbar pt-20 pb-28 px-6 relative z-10 flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
            <MotionDiv layout initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-8 group z-10 shrink-0 transform-gpu">
                <div className={`bg-black/40 p-0.5 rounded-[2.5rem] border transition-all duration-700 overflow-hidden min-h-[420px] flex flex-col justify-end ${isAnalyzing ? 'border-amber-500/50' : 'border-white/10'}`}>
                    <Grid path={currentResult?.path || []} isAnalyzing={isAnalyzing} predictionId={currentResult?.id} onCellClick={() => {}} rowCount={rowCount} difficulty={difficulty === 'Pro' ? 'Hard' : 'Easy'} revealRotten={revealRotten} gridData={currentResult?.gridData} language={language} />
                </div>
                
                <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-5 bg-black border border-amber-500/30 px-6 py-2 rounded-2xl z-30 flex-row">
                    <div className="flex items-center gap-2.5 flex-row">
                        <div className={`w-2 h-2 rounded-full ${isAnalyzing ? 'bg-amber-500' : 'bg-amber-500/40'}`} />
                        <span className="text-[9px] font-mono text-white tracking-[0.25em] uppercase font-black">{isAnalyzing ? 'SCANNING' : 'LINKED'}</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2.5 flex-row">
                        <Users className="w-4 h-4 text-amber-500" />
                        <span className="text-[11px] font-black text-white font-mono tracking-tighter">{onlineUsersCount.toLocaleString()}</span>
                    </div>
                </MotionDiv>
            </MotionDiv>
            <div className="space-y-4 relative z-10 shrink-0 pb-10">
                <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="relative space-y-1.5">
                        <label className={`block text-[7px] text-zinc-500 uppercase font-black tracking-[0.4em] italic px-1 ${isRtl ? 'text-right' : 'text-left'}`}>{t.riskLevel}</label>
                        <button disabled={isAnalyzing} onClick={() => { playSound('click'); setIsRiskMenuOpen(!isRiskMenuOpen); setIsHeightMenuOpen(false); }} className={`w-full h-12 bg-black border rounded-2xl px-4 flex items-center justify-between group transition-all disabled:opacity-30 ${isRiskMenuOpen ? 'border-amber-500/60' : 'border-white/10 hover:border-amber-500/30'}`}>
                            <div className="flex items-center gap-2.5">
                                {difficulty === 'Easy' ? <Shield className="w-4 h-4 text-amber-500" /> : <Zap className="w-4 h-4 text-amber-500" />}
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{difficulty}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform duration-500 ${isRiskMenuOpen ? 'rotate-180 text-amber-500' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isRiskMenuOpen && (
                                <MotionDiv initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-[110%] left-0 right-0 z-[120] bg-black border border-amber-500/30 rounded-2xl overflow-hidden">
                                    {['Easy', 'Pro'].map((mode) => (
                                        <button key={mode} onClick={() => handleDifficultySelect(mode as 'Easy' | 'Pro')} className={`w-full h-12 px-5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest transition-all ${difficulty === mode ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:bg-amber-500/10 hover:text-white'}`}>
                                            <div className="flex items-center gap-3">
                                                {mode === 'Easy' ? <Shield size={12} /> : <Zap size={12} />}
                                                {mode}
                                            </div>
                                            {difficulty === mode && <div className="w-2 h-2 rounded-full bg-black" />}
                                        </button>
                                    ))}
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="relative space-y-1.5">
                        <label className={`block text-[7px] text-zinc-500 uppercase font-black tracking-[0.4em] italic px-1 ${isRtl ? 'text-right' : 'text-left'}`}>{t.gridHeight}</label>
                        <button disabled={isAnalyzing} onClick={() => { playSound('click'); setIsHeightMenuOpen(!isHeightMenuOpen); setIsRiskMenuOpen(false); }} className={`w-full h-12 bg-black border rounded-2xl px-4 flex items-center justify-between group transition-all disabled:opacity-30 ${isHeightMenuOpen ? 'border-amber-500/60' : 'border-white/10 hover:border-amber-500/30'}`}>
                            <span className="text-[11px] font-black text-white font-mono italic">{rowCount}</span>
                            <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform duration-500 ${isHeightMenuOpen ? 'rotate-180 text-amber-500' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isHeightMenuOpen && (
                                <MotionDiv initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-[110%] left-0 right-0 z-[120] bg-black border border-amber-500/30 rounded-2xl overflow-hidden grid grid-cols-2 p-2 gap-2">
                                    {[5, 6, 7, 8, 9, 10].map((val) => (
                                        <button key={val} onClick={() => handleHeightSelect(val)} className={`h-11 rounded-xl flex items-center justify-center text-[11px] font-black font-mono transition-all ${rowCount === val ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:bg-amber-500/10 hover:text-white bg-white/5'}`}>{val}</button>
                                    ))}
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <button onClick={handlePredict} disabled={isAnalyzing || isUpdating} className={`group relative w-full h-16 rounded-[2rem] overflow-hidden transition-all active:scale-[0.96] ${isAnalyzing ? 'bg-black cursor-wait border border-amber-500/30' : 'bg-amber-500 hover:bg-amber-400'}`}>
                        {isAnalyzing && (
                            <MotionDiv 
                                initial={{ width: 0 }} 
                                animate={{ width: `${predictionProgress}%` }} 
                                className="absolute inset-y-0 bg-amber-500/30 pointer-events-none transform-gpu" 
                            />
                        )}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                            {isAnalyzing ? (
                                <div className="flex items-center gap-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                                    <span className="text-[10px] font-black tracking-[0.6em] text-amber-500 uppercase italic font-en">DECRYPTING_...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 flex-row">
                                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Target className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <span className="text-sm font-black tracking-[0.5em] text-black uppercase italic">{t.generatePrediction}</span>
                                </div>
                            )}
                        </div>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={handleNewGame} disabled={isUpdating || isAnalyzing} className="h-14 rounded-2xl border border-white/10 bg-black/50 text-zinc-500 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/5 transition-all active:scale-95 font-black text-[9px] uppercase tracking-[0.35em] flex items-center justify-center gap-3 flex-row disabled:opacity-20">
                            <RotateCcw className={`w-4 h-4 ${isUpdating ? 'animate-spin text-amber-500' : 'group-hover:text-amber-500'}`} />
                            <span>{t.resync}</span>
                        </button>
                        <button onClick={() => { if(!currentResult) return; playSound('toggle'); setRevealRotten(!revealRotten); }} disabled={!currentResult || isAnalyzing} className={`h-14 rounded-2xl border transition-all active:scale-95 font-black text-[9px] uppercase tracking-[0.35em] flex items-center justify-center gap-3 flex-row ${!currentResult ? 'border-white/5 opacity-20' : revealRotten ? 'bg-amber-500/15 border-amber-500 text-amber-500' : 'border-white/10 bg-black/50 text-zinc-500 hover:text-white hover:border-amber-500/50 hover:bg-amber-500/5'}`}>
                            {revealRotten ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span>{revealRotten ? t.hideRotten : t.revealRotten}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
