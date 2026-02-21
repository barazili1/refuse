
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
    Loader2,
    SignalHigh,
    Terminal,
    Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const RainEffect: React.FC = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 1.5 + 0.8,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.2 + 0.05,
      height: Math.random() * 80 + 40,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {drops.map((drop) => (
        <MotionDiv
          key={drop.id}
          initial={{ y: -200 }}
          animate={{ y: '110vh' }}
          transition={{ duration: drop.duration, repeat: Infinity, ease: "linear", delay: drop.delay }}
          className="absolute bg-gradient-to-b from-lime-600/0 via-lime-600 to-lime-600/0 w-[1px] transform-gpu"
          style={{ left: `${drop.left}%`, height: `${drop.height}px`, opacity: drop.opacity }}
        />
      ))}
    </div>
  );
};

const DecryptText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text.split('').map((char, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
};

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
  const [statusMessage, setStatusMessage] = useState("");
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
    setStatusMessage(isRtl ? "جاري الاتصال بنظام التوقع..." : "UPLINK ESTABLISHED...");
    await new Promise(r => setTimeout(r, 700));
    setPredictionProgress(45);
    setStatusMessage(isRtl ? "تحليل مصفوفة الاحتمالات..." : "MATRIX SCANNING...");
    let realGridData = null;
    if (accessKeyData?.isAdminMode) {
        realGridData = await fetchAppleGridData(platform);
    }
    await new Promise(r => setTimeout(r, 1000));
    setPredictionProgress(80);
    setStatusMessage(isRtl ? "استخراج المسار الذهبي..." : "OPTIMIZING PATH...");
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
    setStatusMessage(isRtl ? "اكتمل التحليل" : "DECRYPTION COMPLETE");
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
  const riskPercentage = difficulty === 'Easy' ? 24 : 88;

  return (
    <div className={`flex flex-col h-full relative pt-0 select-none bg-black overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
        <RainEffect />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,1)_100%)]" />
        </div>
        <MotionDiv initial={{ y: -100 }} animate={{ y: 0 }} dir="ltr" className="fixed top-0 left-0 right-0 z-[100] h-14 bg-zinc-950/80 border-b border-lime-400/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)] flex items-center justify-between px-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 flex-row">
                <button onClick={() => { playSound('click'); onBack(); }} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-lime-400/10 hover:border-lime-400/30 flex items-center justify-center transition-all active:scale-90 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col items-start">
                    <div className="border border-lime-400/20 rounded-[8px] px-2 py-1 bg-black/50 flex items-center gap-2.5 backdrop-blur-xl">
                        <div className="w-5 h-5 rounded-md overflow-hidden border border-lime-400/30">
                            <img 
                                src="https://image2url.com/r2/default/images/1771685718404-0db562f8-2fce-4446-b376-7c92ec46acff.jpeg" 
                                alt="Logo" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-[9px] font-black text-white tracking-[0.1em] uppercase leading-none font-mono">
                            UPLINK: <span className="text-lime-400">{accessKeyData?.key || "8963007529"}</span>
                        </h1>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end opacity-40">
                    <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-widest">System_Status: Optimal</span>
                    <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-0.5 bg-lime-400/30" />)}
                    </div>
                </div>
                <button onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }} className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-lime-400/10 hover:border-lime-400/30 active:scale-95 transition-all flex items-center justify-center shadow-lg group">
                    <Globe className="w-3.5 h-3.5 mr-1.5 text-lime-400 group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-[9px] font-black uppercase font-mono tracking-tighter">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
            </div>
        </MotionDiv>
        <div className={`flex-1 overflow-y-auto custom-scrollbar pt-20 pb-28 px-6 relative z-10 flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
            <MotionDiv layout initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative mb-6 group z-10 shrink-0 transform-gpu">
                <div className={`bg-zinc-950/50 backdrop-blur-[30px] p-0.5 rounded-[2rem] border transition-all duration-700 overflow-hidden min-h-[400px] flex flex-col justify-end ${isAnalyzing ? 'border-lime-400/40 shadow-[0_0_20px_rgba(163,230,53,0.1)]' : 'border-white/10'}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.08)_0%,transparent_100%)] pointer-events-none" />
                    
                    {/* Corner Accents */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-lime-400/20 rounded-tl-lg pointer-events-none" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-lime-400/20 rounded-tr-lg pointer-events-none" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-lime-400/20 rounded-bl-lg pointer-events-none" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-lime-400/20 rounded-br-lg pointer-events-none" />

                    <AnimatePresence>
                        {isAnalyzing && (
                            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-lime-400/5 z-40 pointer-events-none overflow-hidden">
                              <MotionDiv animate={{ y: ['-100%', '100%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }} className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-lime-400/20 to-transparent transform-gpu" />
                            </MotionDiv>
                        )}
                    </AnimatePresence>
                    <Grid path={currentResult?.path || []} isAnalyzing={isAnalyzing} predictionId={currentResult?.id} onCellClick={() => {}} rowCount={rowCount} difficulty={difficulty === 'Pro' ? 'Hard' : 'Easy'} revealRotten={revealRotten} gridData={currentResult?.gridData} language={language} />
                </div>
                
                <MotionDiv initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-zinc-950 border border-lime-400/20 px-4 py-1.5 rounded-xl z-30 shadow-[0_15px_40px_rgba(0,0,0,0.8)] backdrop-blur-3xl flex-row">
                    <div className="flex items-center gap-2 flex-row">
                        <div className={`w-1.5 h-1.5 rounded-full ${isAnalyzing ? 'bg-lime-400 animate-ping' : 'bg-lime-400/40'}`} />
                        <span className="text-[8px] font-mono text-white tracking-[0.2em] uppercase font-black">{isAnalyzing ? 'SCANNING' : 'LINKED'}</span>
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-2 flex-row">
                        <Users className="w-3.5 h-3.5 text-lime-400/60" />
                        <span className="text-[10px] font-black text-white font-mono tracking-tighter">{onlineUsersCount.toLocaleString()}</span>
                    </div>
                </MotionDiv>
            </MotionDiv>
            <div className="space-y-3 relative z-10 shrink-0 pb-8">
                <div className="grid grid-cols-2 gap-3 mb-1">
                    <div className="relative space-y-1">
                        <label className={`block text-[6px] text-zinc-600 uppercase font-black tracking-[0.4em] italic px-1 ${isRtl ? 'text-right' : 'text-left'}`}>{t.riskLevel}</label>
                        <button disabled={isAnalyzing} onClick={() => { playSound('click'); setIsRiskMenuOpen(!isRiskMenuOpen); setIsHeightMenuOpen(false); }} className={`w-full h-11 bg-zinc-950 border rounded-xl px-4 flex items-center justify-between group transition-all disabled:opacity-30 ${isRiskMenuOpen ? 'border-lime-400/50 shadow-[0_0_10px_rgba(163,230,53,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                            <div className="flex items-center gap-2">
                                {difficulty === 'Easy' ? <Shield className="w-3 h-3 text-lime-400" /> : <Zap className="w-3 h-3 text-lime-400" />}
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">{difficulty}</span>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${isRiskMenuOpen ? 'rotate-180 text-lime-400' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isRiskMenuOpen && (
                                <MotionDiv initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-[100%] left-0 right-0 mb-2 z-[120] bg-zinc-950 border border-lime-400/20 rounded-xl overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                                    {['Easy', 'Pro'].map((mode) => (
                                        <button key={mode} onClick={() => handleDifficultySelect(mode as 'Easy' | 'Pro')} className={`w-full h-11 px-4 flex items-center justify-between text-[8px] font-black uppercase tracking-widest transition-all ${difficulty === mode ? 'bg-lime-400 text-black' : 'text-zinc-500 hover:bg-lime-400/5 hover:text-white'}`}>
                                            <div className="flex items-center gap-2">
                                                {mode === 'Easy' ? <Shield size={10} /> : <Zap size={10} />}
                                                {mode}
                                            </div>
                                            {difficulty === mode && <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />}
                                        </button>
                                    ))}
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="relative space-y-1">
                        <label className={`block text-[6px] text-zinc-600 uppercase font-black tracking-[0.4em] italic px-1 ${isRtl ? 'text-right' : 'text-left'}`}>{t.gridHeight}</label>
                        <button disabled={isAnalyzing} onClick={() => { playSound('click'); setIsHeightMenuOpen(!isHeightMenuOpen); setIsRiskMenuOpen(false); }} className={`w-full h-11 bg-zinc-950 border rounded-xl px-4 flex items-center justify-between group transition-all disabled:opacity-30 ${isHeightMenuOpen ? 'border-lime-400/50 shadow-[0_0_10px_rgba(163,230,53,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                            <span className="text-[10px] font-black text-white font-mono italic">{rowCount}</span>
                            <ChevronDown className={`w-3.5 h-3.5 text-zinc-600 transition-transform ${isHeightMenuOpen ? 'rotate-180 text-lime-400' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isHeightMenuOpen && (
                                <MotionDiv initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute bottom-[100%] left-0 right-0 mb-2 z-[120] bg-zinc-950 border border-lime-400/20 rounded-xl overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl grid grid-cols-2 p-1.5 gap-1.5">
                                    {[5, 6, 7, 8, 9, 10].map((val) => (
                                        <button key={val} onClick={() => handleHeightSelect(val)} className={`h-10 rounded-lg flex items-center justify-center text-[10px] font-black font-mono transition-all ${rowCount === val ? 'bg-lime-400 text-black shadow-[0_0_10px_rgba(163,230,53,0.3)]' : 'text-zinc-500 hover:bg-lime-400/5 hover:text-white bg-white/5'}`}>{val}</button>
                                    ))}
                                </MotionDiv>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <button onClick={handlePredict} disabled={isAnalyzing || isUpdating} className={`group relative w-full h-14 rounded-[1.5rem] overflow-hidden transition-all active:scale-[0.97] ${isAnalyzing ? 'bg-zinc-900 cursor-wait' : 'bg-white shadow-[0_10px_20px_rgba(255,255,255,0.05)] hover:bg-zinc-100'}`}>
                        {isAnalyzing && (
                            <MotionDiv 
                                initial={{ width: 0 }} 
                                animate={{ width: `${predictionProgress}%` }} 
                                className="absolute inset-y-0 bg-lime-400/20 pointer-events-none transform-gpu" 
                            />
                        )}
                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                            {isAnalyzing ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-lime-400" />
                                    <span className="text-[9px] font-black tracking-[0.5em] text-lime-400 uppercase italic font-en">DECRYPTING_...</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 flex-row">
                                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Target className="w-3.5 h-3.5 text-lime-400" />
                                    </div>
                                    <span className="text-xs font-black tracking-[0.4em] text-black uppercase italic">{t.generatePrediction}</span>
                                </div>
                            )}
                        </div>
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleNewGame} disabled={isUpdating || isAnalyzing} className="h-12 rounded-xl border border-white/10 bg-zinc-950/50 text-zinc-500 hover:text-white hover:border-white/20 transition-all active:scale-95 font-black text-[8px] uppercase tracking-[0.3em] flex items-center justify-center gap-2.5 flex-row disabled:opacity-20">
                            <RotateCcw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin text-lime-400' : ''}`} />
                            <span>{t.resync}</span>
                        </button>
                        <button onClick={() => { if(!currentResult) return; playSound('toggle'); setRevealRotten(!revealRotten); }} disabled={!currentResult || isAnalyzing} className={`h-12 rounded-xl border transition-all active:scale-95 font-black text-[8px] uppercase tracking-[0.3em] flex items-center justify-center gap-2.5 flex-row ${!currentResult ? 'border-white/5 opacity-20' : revealRotten ? 'bg-lime-400/10 border-lime-400 text-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.2)]' : 'border-white/10 bg-zinc-950/50 text-zinc-500 hover:text-white hover:border-white/20'}`}>
                            {revealRotten ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{revealRotten ? t.hideRotten : t.revealRotten}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
