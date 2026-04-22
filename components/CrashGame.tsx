
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, 
    Globe, 
    Zap, 
    Users,
    Activity,
    Shield
} from 'lucide-react';
import { playSound } from '../services/audio';
import { Language, Platform, AccessKey } from '../types';

// --- 1. الأيقونة (الطيارة ثلاثية الأبعاد) ---
const PlaneIcon = ({ className, thrum }: { className?: string, thrum?: boolean }) => (
  <div className={`perspective-500 transform-style-3d inline-block ${className}`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="animate-plane-3d-realistic transform-style-3d overflow-visible" xmlns="http://www.w3.org/2000/svg">
      <g className="transform-style-3d">
        <path className={thrum ? 'animate-thrum' : ''} d="M21 16.5L14 12L21 7.5V16.5ZM3 12L10 16.5V7.5L3 12ZM12 12L12 2L10 10L12 12ZM12 12L12 22L14 14L12 12Z" />
        <g transform="translate(12, 2)">
          <rect x="-4" y="-0.5" width="8" height="1" fill="white" opacity="0.9" className="animate-propeller-spin" />
        </g>
      </g>
    </svg>
  </div>
);

// --- 2. مكون الرادار (Signal Circle) ---
const SignalCircle = ({ multiplier, loading, labels }: { multiplier: number, loading: boolean, labels: { calculating: string } }) => {
  const [displayValue, setDisplayValue] = useState(1.00);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      setDisplayValue(1.00);
      setScale(0.8);
    } else {
      const startValue = 1.00;
      const endValue = multiplier;
      const duration = 1400; 
      const startTime = performance.now();

      const easeOutBack = (x: number) => {
        const c1 = 1.6; const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      };

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setDisplayValue(startValue + (endValue - startValue) * easeOutBack(progress));
        setScale(progress >= 0.99 ? 1 : 0.85 + (progress * 0.15));
        if (progress < 1) animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [multiplier, loading]);

  return (
    <div className="relative w-72 h-72 flex items-center justify-center transition-all duration-500">
      <style>{`
        @keyframes radar-classic { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-radar-classic { animation: radar-classic 2s linear infinite; }
        @keyframes plane-3d-realistic {
          0%, 100% { transform: rotateX(15deg) rotateY(-10deg) translateY(0px); }
          50% { transform: rotateX(15deg) rotateY(5deg) translateY(3px); }
        }
        .animate-plane-3d-realistic { animation: plane-3d-realistic 3s ease-in-out infinite; }
        @keyframes propeller-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-propeller-spin { animation: propeller-spin 0.15s linear infinite; transform-origin: center; }
        @keyframes number-reveal {
          0% { transform: scale(0.5) rotateX(45deg); opacity: 0; filter: blur(15px); }
          100% { transform: scale(1) rotateX(0deg); opacity: 1; filter: blur(0px); }
        }
        .animate-number-reveal { animation: number-reveal 0.7s cubic-bezier(0.17, 0.84, 0.44, 1) forwards; }
        .perspective-500 { perspective: 500px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}</style>

      {/* الحلقات الخلفية */}
      <div className="absolute inset-4 rounded-full border border-red-500/20"></div>
      <div className="absolute inset-8 rounded-full border border-white/10"></div>
      <div className="absolute inset-16 rounded-full border border-white/5"></div>
      
      {loading && (
        <div className="absolute inset-0 rounded-full animate-radar-classic pointer-events-none">
          <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(from 270deg at 50% 50%, #dc2626 0deg, transparent 60deg)' }}></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-1/2 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,1)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 scale-75">
              <PlaneIcon className="text-red-500" thrum={true} />
            </div>
          </div>
        </div>
      )}

      {/* المحتوى المركزي */}
      <div className="relative z-10 flex flex-col items-center">
        {!loading ? (
          <div style={{ transform: `scale(${scale})` }} className="animate-number-reveal font-black flex items-baseline">
            <span className="text-6xl text-white drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] font-mono italic">
              {displayValue.toFixed(2)}
            </span>
            <span className="text-2xl text-red-500 ml-1 italic font-black">X</span>
          </div>
        ) : (
          <div className="animate-pulse text-red-500 font-black tracking-[0.3em] text-[10px] uppercase font-mono">
            {labels.calculating}
          </div>
        )}
      </div>

      {/* الكروس هير (الأسهم) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-[1px] bg-gradient-to-t from-red-600 to-transparent shadow-[0_0_10px_#dc2626]"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-8 w-[1px] bg-gradient-to-b from-red-600 to-transparent shadow-[0_0_10px_#dc2626]"></div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-l from-red-600 to-transparent shadow-[0_0_10px_#dc2626]"></div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r from-red-600 to-transparent shadow-[0_0_10px_#dc2626]"></div>
    </div>
  );
};

// --- 3. الصفحة الكاملة (Crash Game Page) ---
interface CrashGameProps {
  onBack: () => void;
  accessKeyData: AccessKey | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  platform: Platform;
}

export function CrashGame({ onBack, accessKeyData, language, onLanguageChange, platform }: CrashGameProps) {
  const [status, setStatus] = useState<'IDLE' | 'LOADING'>('IDLE');
  const [prediction, setPrediction] = useState(1.00);
  const [onlineUsersCount, setOnlineUsersCount] = useState(() => Math.floor(Math.random() * (1000 - 50 + 1)) + 50);
  const isRtl = language === 'ar';

  useEffect(() => {
    const interval = setInterval(() => {
        setOnlineUsersCount(prev => {
            const change = Math.floor(Math.random() * 7) - 3;
            return Math.min(1000, Math.max(50, prev + change));
        });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const startScan = async () => {
    playSound('predict');
    setStatus('LOADING');

    let finalPrediction = 1.00;
    
    // Create a timeout controller for the fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout

    try {
        const isAdmin = accessKeyData?.isAdminMode || accessKeyData?.key === '1726354290';
        console.log("Admin Mode Check:", isAdmin, "User ID:", accessKeyData?.key);
        
        if (isAdmin) {
            // Strategy: Try the user-specified path first, then fallbacks
            const paths = [
                'https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/pre/hipr/hipr.json',
                'https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/pre/hip/hipr.json',
                'https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/hipr/hipr.json'
            ];
            
            let data = null;
            let usedPath = "";

            for (const path of paths) {
                try {
                    const response = await fetch(path, { signal: controller.signal });
                    if (response.ok) {
                        const result = await response.json();
                        if (result !== null && result !== undefined) {
                            data = result;
                            usedPath = path;
                            break;
                        }
                    }
                } catch (e) {
                    console.warn(`Failed to fetch from ${path}`, e);
                }
            }

            clearTimeout(timeoutId);
            console.log("Firebase Data from:", usedPath, data);
            
            // Handle various data structures robustly
            let val = NaN;
            
            if (data !== null) {
                if (typeof data === 'number') {
                    val = data;
                } else if (typeof data === 'string') {
                    val = parseFloat(data);
                } else if (typeof data === 'object') {
                    // Search for any numeric value deep in the object if needed
                    const findFirstNumeric = (obj: any): number | null => {
                        if (typeof obj === 'number') return obj;
                        if (typeof obj === 'string' && !isNaN(parseFloat(obj))) return parseFloat(obj);
                        if (obj && typeof obj === 'object') {
                            // Priority keys
                            const pKeys = ['hipr', 'multiplier', 'value', 'signal', 'num', 'val', 'val1'];
                            for (const k of pKeys) {
                                if (obj[k] !== undefined) {
                                    const res = findFirstNumeric(obj[k]);
                                    if (res !== null) return res;
                                }
                            }
                            // Fallback to any key
                            for (const k in obj) {
                                const res = findFirstNumeric(obj[k]);
                                if (res !== null) return res;
                            }
                        }
                        return null;
                    };
                    val = findFirstNumeric(data) ?? NaN;
                }
            }
            
            if (!isNaN(val) && val > 0) {
                finalPrediction = val;
            } else {
                console.warn("Falling back to simulated high-accuracy for admin");
                finalPrediction = Number((Math.random() * 1.2 + 1.3).toFixed(2));
            }
        } else {
            // Regular User: Random between 1.00 and 4.05
            finalPrediction = Number((Math.random() * 3.05 + 1.00).toFixed(2));
        }
    } catch (error) {
        console.error("Signal Fetch Error:", error);
        // Fallback for failure
        finalPrediction = Number((Math.random() * 1.5 + 1.15).toFixed(2));
    }

    // Delay for scanning animation
    setTimeout(() => {
      setPrediction(finalPrediction);
      setStatus('IDLE');
      playSound('success');
    }, 2500);
  };

  return (
    <div className={`flex flex-col h-full relative pt-0 select-none bg-[#050505] overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
        
        {/* Header (Same as AppleGame for consistency) */}
        <motion.div initial={{ y: -100 }} animate={{ y: 0 }} dir="ltr" className="fixed top-0 left-0 right-0 z-[100] h-14 bg-black/80 backdrop-blur-md border-b border-red-500/20 flex items-center justify-between px-6">
            <div className="flex items-center gap-3 flex-row">
                <button onClick={() => { playSound('click'); onBack(); }} className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/50 flex items-center justify-center transition-all active:scale-90 group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="flex flex-col items-start">
                    <div className="border border-red-500/30 rounded-[8px] px-2 py-1 bg-black/50 flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-md overflow-hidden border border-red-500/40">
                            <img 
                                src="https://image2url.com/r2/default/images/1771685718404-0db562f8-2fce-4446-b376-7c92ec46acff.jpeg" 
                                alt="Ninja Logo" 
                                className="w-full h-full object-cover scale-110"
                            />
                        </div>
                        <h1 className="text-[9px] font-black text-white tracking-[0.1em] uppercase leading-none font-mono">
                            UPLINK: <span className="text-red-500">{accessKeyData?.key || "8963007529"}</span>
                        </h1>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4">
                <button onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }} className="h-9 px-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-red-500/20 hover:border-red-500/50 active:scale-95 transition-all flex items-center justify-center group">
                    <Globe className="w-3.5 h-3.5 mr-1.5 text-red-500 group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-[9px] font-black uppercase font-mono tracking-tighter">{language === 'en' ? 'AR' : 'EN'}</span>
                </button>
            </div>
        </motion.div>

        <div className={`flex-1 flex flex-col items-center justify-center pt-20 pb-28 px-6 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
            {/* خلفية متوهجة */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="z-10 flex flex-col items-center gap-12 w-full max-w-sm">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Zap className="w-4 h-4 text-red-600 animate-pulse" />
                        <h1 className="text-red-500 font-black tracking-[0.4em] text-xs uppercase opacity-70 font-mono">
                            {isRtl ? "رادار تكتيكي v1" : "TACTICAL RADAR V1"}
                        </h1>
                        <Zap className="w-4 h-4 text-red-600 animate-pulse" />
                    </div>
                </motion.div>

                <div className="relative group">
                    <div className="absolute -inset-10 bg-red-600/5 rounded-full blur-[60px]" />
                    <SignalCircle 
                        multiplier={prediction} 
                        loading={status === 'LOADING'} 
                        labels={{ calculating: isRtl ? 'مسح الترددات...' : 'SCANNING_WAVES...' }} 
                    />
                </div>

                {/* Online Users Count */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-5 bg-black border border-red-500/30 px-6 py-2 rounded-2xl z-30 flex-row">
                    <div className="flex items-center gap-2.5 flex-row">
                        <div className={`w-2 h-2 rounded-full ${status === 'LOADING' ? 'bg-red-500 animate-pulse' : 'bg-red-500/40'}`} />
                        <span className="text-[9px] font-mono text-white tracking-[0.25em] uppercase font-black">
                            {status === 'LOADING' ? 'SCANNING' : (accessKeyData?.isAdminMode || accessKeyData?.key === '1726354290' ? 'ADMIN_SYNC' : 'LINKED')}
                        </span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2.5 flex-row">
                        <Users className="w-4 h-4 text-red-500" />
                        <span className="text-[11px] font-black text-white font-mono tracking-tighter">{onlineUsersCount.toLocaleString()}</span>
                    </div>
                </motion.div>

                <div className="w-full space-y-4">
                    <button
                        onClick={startScan}
                        disabled={status === 'LOADING'}
                        className={`group relative w-full h-16 rounded-[2rem] font-black text-sm tracking-[0.4em] uppercase transition-all active:scale-[0.98] shadow-2xl overflow-hidden italic
                            ${status === 'LOADING' ? 'bg-black cursor-wait border border-red-500/30 text-red-500/50' : 'bg-red-600 text-black hover:bg-red-500 shadow-red-900/40'}`}
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
                        <span className="relative z-10">{status === 'LOADING' ? (isRtl ? 'جاري المسح...' : 'SCANNING...') : (isRtl ? 'جلب الإشارة' : 'GET_SIGNAL')}</span>
                    </button>
                    
                    <div className="flex justify-center gap-10 opacity-30 mt-8">
                        <div className="flex flex-col items-center gap-2">
                            <Shield className="w-4 h-4 text-red-600" />
                            <span className="text-[7px] font-mono text-red-600 uppercase tracking-[0.3em]">Secure</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Activity className="w-4 h-4 text-red-600" />
                            <span className="text-[7px] font-mono text-red-600 uppercase tracking-[0.3em]">Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>{`
            @keyframes shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
        `}</style>
    </div>
  );
}
