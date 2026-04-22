
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Platform, 
  Language 
} from '../types';
import { 
  Check, 
  ChevronRight, 
  Terminal,
  Globe,
  ShieldCheck,
  Loader2,
  Zap,
  Cpu,
  Activity,
  Lock,
  Database,
  Wifi,
  Layers
} from 'lucide-react';
import { playSound } from '../services/audio';

interface SelectionScreenProps {
  onSelect: (platform: Platform) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export function SelectionScreen({ onSelect, language, onLanguageChange }: SelectionScreenProps) {
  const [selected, setSelected] = useState<Platform>('1XBET');
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState<number[]>([]);
  
  const isRtl = language === 'ar';

  const platforms = [
    {
      id: '1XBET' as Platform,
      name: '1xBet',
      img: 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766500879248-4e7a13ac-b97d-4a9b-8d80-8ed58e40c847.jpeg',
      code: 'NODE_01',
      region: 'Global-Alpha',
      status: 'Stable'
    },
    {
      id: 'PRO1BET' as Platform,
      name: 'Pro1Bet',
      img: 'https://www.image2url.com/r2/default/images/1776873423891-0ea7e3eb-77d4-4c33-9fe1-5d63aab53607.jpeg',
      code: 'NODE_02',
      region: 'Global-Beta',
      status: 'Optimized'
    }
  ];

  const statusSteps = [
    isRtl ? "جاري تهيئة الاتصال" : "Initializing Uplink",
    isRtl ? "مزامنة البيانات المشفرة" : "Syncing Encrypted Data",
    isRtl ? "تفعيل بروتوكول النينجا" : "Activating Ninja Protocol",
    isRtl ? "تم الربط بنجاح" : "Uplink Established"
  ];

  useEffect(() => {
    if (isConnecting) {
      const duration = 3000;
      const interval = 30;
      const stepValue = 100 / (duration / interval);

      const timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + stepValue;
          if (next >= 15 && !activeSteps.includes(0)) setActiveSteps(s => [...s, 0]);
          if (next >= 45 && !activeSteps.includes(1)) setActiveSteps(s => [...s, 1]);
          if (next >= 75 && !activeSteps.includes(2)) setActiveSteps(s => [...s, 2]);
          if (next >= 95 && !activeSteps.includes(3)) setActiveSteps(s => [...s, 3]);
          if (next >= 100) { clearInterval(timer); return 100; }
          return next;
        });
      }, interval);

      const finishTimer = setTimeout(() => { onSelect(selected); }, duration + 500);
      return () => { clearInterval(timer); clearTimeout(finishTimer); };
    }
  }, [isConnecting, onSelect, selected, activeSteps]);

  const handleProceed = () => {
    playSound('click');
    setIsConnecting(true);
  };

  return (
    <div className={`flex flex-col h-full bg-[#020202] relative overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-red-600/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-red-600/[0.03] rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Futuristic Header */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] h-20 bg-black/40 backdrop-blur-xl border-b border-red-600/10 flex items-center justify-between px-8"
      >
          <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute -inset-1 bg-red-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                <div className="relative w-11 h-11 rounded-xl bg-black border border-red-600/30 flex items-center justify-center overflow-hidden">
                    <img 
                        src="https://image2url.com/r2/default/images/1771685718404-0db562f8-2fce-4446-b376-7c92ec46acff.jpeg" 
                        alt="Ninja Logo" 
                        className="w-full h-full object-cover opacity-90 scale-110"
                    />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-black text-white tracking-[0.4em] uppercase italic leading-none">
                  NINJA <span className="text-red-600">VIO</span>
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[7px] font-mono text-zinc-500 uppercase tracking-widest">SYSTEM_ONLINE_v4.5</span>
                </div>
              </div>
          </div>

          <button 
              onClick={() => { playSound('toggle'); onLanguageChange?.(language === 'en' ? 'ar' : 'en'); }}
              className="h-10 px-5 rounded-xl bg-white/[0.03] border border-white/5 text-[9px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-red-600/10 hover:border-red-600/30 transition-all active:scale-95 group"
          >
              <Globe className="w-4 h-4 text-red-600 group-hover:rotate-180 transition-transform duration-700" />
              {language === 'en' ? 'AR' : 'EN'}
          </button>
      </motion.div>

      <div className={`flex-1 flex flex-col pt-32 pb-12 px-8 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[1px] w-8 bg-red-600/50" />
            <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.4em]">{isRtl ? "تحديد الهدف" : "TARGET_ACQUISITION"}</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
            {isRtl ? "اختر المنصة" : "SELECT_NODE"}
          </h2>
        </motion.div>

        <div className="flex-1 flex flex-col gap-5 max-w-sm mx-auto w-full">
          {platforms.map((p, idx) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.15 }}
            >
              <button 
                onClick={() => { playSound('click'); setSelected(p.id); }}
                disabled={isConnecting}
                className={`group relative w-full rounded-[2.5rem] transition-all duration-700 overflow-hidden flex flex-col p-6 border-2 ${
                  selected === p.id 
                    ? 'border-red-600 bg-red-600/[0.07] shadow-[0_0_50px_rgba(220,38,38,0.1)]' 
                    : 'border-white/[0.03] bg-zinc-900/20 hover:border-white/10'
                }`}
              >
                {/* Status Badge */}
                <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-2 ${selected === p.id ? 'bg-red-600 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                  <div className={`w-1 h-1 rounded-full ${selected === p.id ? 'bg-black animate-pulse' : 'bg-zinc-600'}`} />
                  {p.status}
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20 rounded-3xl overflow-hidden border border-white/5 bg-black shrink-0 group-hover:scale-105 transition-transform duration-700">
                    <img 
                      src={p.img} 
                      alt={p.name} 
                      className={`w-full h-full object-cover transition-all duration-1000 ${
                        selected === p.id ? 'grayscale-0 opacity-100' : 'grayscale opacity-20 group-hover:opacity-40'
                      }`} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  <div className="flex-1 flex flex-col items-start">
                    <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-[0.3em] mb-1.5">{p.code}</span>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-wider leading-none group-hover:text-red-600 transition-colors">{p.name}</h3>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Wifi size={10} className={selected === p.id ? 'text-red-600' : 'text-zinc-700'} />
                        <span className="text-[8px] font-mono text-zinc-500 uppercase">{p.region}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selection Indicator */}
                <AnimatePresence>
                  {selected === p.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-6 pt-6 border-t border-red-600/10 flex items-center justify-between"
                    >
                      <div className="flex gap-1.5">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-6 h-1 rounded-full bg-red-600/20 overflow-hidden">
                            <motion.div 
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                              className="w-full h-full bg-red-600"
                            />
                          </div>
                        ))}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                        <Check className="w-4 h-4 text-black stroke-[4px]" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 space-y-10 max-w-sm mx-auto w-full"
        >
          <button 
            onClick={handleProceed}
            disabled={isConnecting}
            className="group relative w-full h-20 rounded-[2.5rem] bg-red-600 text-black font-black text-sm tracking-[0.5em] uppercase flex items-center justify-center gap-4 hover:bg-red-500 active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden italic shadow-[0_20px_50px_rgba(220,38,38,0.25)]"
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
            <span className="relative z-10">{isRtl ? "بدء المزامنة" : "INITIALIZE_LINK"}</span>
            <ChevronRight className={`w-6 h-6 relative z-10 transition-transform group-hover:translate-x-2 ${isRtl ? 'rotate-180 group-hover:-translate-x-2' : ''}`} />
          </button>
          
          <div className="flex justify-center gap-10 opacity-30">
             <div className="flex flex-col items-center gap-2 group cursor-help">
                <div className="w-10 h-10 rounded-xl border border-red-600/20 flex items-center justify-center group-hover:border-red-600/50 transition-colors">
                  <ShieldCheck size={18} className="text-red-600" />
                </div>
                <span className="text-[7px] font-mono text-red-600 uppercase tracking-[0.3em]">Encrypted</span>
             </div>
             <div className="flex flex-col items-center gap-2 group cursor-help">
                <div className="w-10 h-10 rounded-xl border border-red-600/20 flex items-center justify-center group-hover:border-red-600/50 transition-colors">
                  <Layers size={18} className="text-red-600" />
                </div>
                <span className="text-[7px] font-mono text-red-600 uppercase tracking-[0.3em]">Multi-Layer</span>
             </div>
             <div className="flex flex-col items-center gap-2 group cursor-help">
                <div className="w-10 h-10 rounded-xl border border-red-600/20 flex items-center justify-center group-hover:border-red-600/50 transition-colors">
                  <Database size={18} className="text-red-600" />
                </div>
                <span className="text-[7px] font-mono text-red-600 uppercase tracking-[0.3em]">Secure_DB</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Connection Overlay */}
      <AnimatePresence>
        {isConnecting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8"
          >
             <div className="w-full max-w-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#050505] border border-red-600/20 rounded-[4rem] p-12 relative overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.15)]"
                >
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-900 overflow-hidden">
                    <motion.div 
                      className="h-full bg-red-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  
                  <div className="flex flex-col items-center mb-12">
                    <div className="relative mb-10">
                      <div className="relative w-28 h-28 rounded-[2.5rem] bg-black border border-red-600/30 flex items-center justify-center">
                          <Terminal className="w-14 h-14 text-red-600" />
                          <div className="absolute -inset-4 rounded-[3rem] border border-red-600/20 animate-ping opacity-20" />
                          <div className="absolute -inset-8 rounded-[3.5rem] border border-red-600/10 animate-ping opacity-10 delay-300" />
                      </div>
                    </div>
                    <h4 className="text-3xl font-black text-white uppercase tracking-[0.1em] italic">{isRtl ? "جاري الربط" : "ESTABLISHING"}</h4>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.5em]">DATA_STREAM_ACTIVE</span>
                    </div>
                  </div>

                  <div className="space-y-6 mb-12">
                     {statusSteps.map((step, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: activeSteps.includes(i) ? 1 : 0.1, x: 0 }}
                         transition={{ duration: 0.5 }}
                         className={`flex items-center gap-5 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
                       >
                         <div className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 transition-all duration-700 ${activeSteps.includes(i) ? 'bg-red-600/20 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-zinc-800'}`}>
                           {activeSteps.includes(i) ? <Check className="w-4 h-4 text-red-600 stroke-[3px]" /> : <Loader2 className="w-4 h-4 text-zinc-800 animate-spin" />}
                         </div>
                         <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">{step}</span>
                       </motion.div>
                     ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end px-2">
                      <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">UPLINK_STRENGTH</span>
                      <span className="text-4xl font-black text-red-600 font-mono italic">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <motion.div 
                         className="h-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]" 
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }} 
                       />
                    </div>
                  </div>
                </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
