
import React, { useState, useEffect, useRef } from 'react';
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
  Zap
} from 'lucide-react';
import { playSound } from '../services/audio';
import { translations } from '../translations';

const MotionDiv = motion.div as any;

// Missing interface added below
interface SelectionScreenProps {
  onSelect: (platform: Platform) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, language, onLanguageChange }) => {
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
      code: 'NODE_01'
    },
    {
      id: 'MELBET' as Platform,
      name: 'Melbet',
      img: 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766501545744-4b13c58a-2947-489e-b7e5-9c15372aa331.jpg',
      code: 'NODE_02'
    }
  ];

  const statusSteps = [
    isRtl ? "جاري الاتصال بالسيرفر" : "Connecting to server",
    isRtl ? "تحليل مصفوفة الأمان" : "Analyzing security matrix",
    isRtl ? "ربط البروتوكول VIP" : "Linking VIP protocol",
    isRtl ? "تم الاتصال بنجاح" : "Successfully connected"
  ];

  useEffect(() => {
    if (isConnecting) {
      const duration = 2500;
      const interval = 30;
      const stepValue = 100 / (duration / interval);

      const timer = setInterval(() => {
        setProgress(prev => {
          const next = prev + stepValue;
          if (next >= 10 && !activeSteps.includes(0)) setActiveSteps(s => [...s, 0]);
          if (next >= 40 && !activeSteps.includes(1)) setActiveSteps(s => [...s, 1]);
          if (next >= 70 && !activeSteps.includes(2)) setActiveSteps(s => [...s, 2]);
          if (next >= 90 && !activeSteps.includes(3)) setActiveSteps(s => [...s, 3]);
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
    <div className={`flex flex-col h-full bg-[#050505] relative overflow-hidden`}>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-16 bg-black border-b border-amber-500/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
              <div className="relative w-9 h-9 rounded-lg bg-black border border-amber-500/20 flex items-center justify-center overflow-hidden">
                  <img 
                      src="https://image2url.com/r2/default/images/1771685718404-0db562f8-2fce-4446-b376-7c92ec46acff.jpeg" 
                      alt="Logo" 
                      className="w-full h-full object-cover"
                  />
              </div>
              <div className="flex flex-col">
                <h1 className="text-[11px] font-black text-white tracking-[0.3em] uppercase italic leading-none">
                  NINJA <span className="text-amber-500/70">VIP</span>
                </h1>
                <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Version 4.5.1 Secure</span>
              </div>
          </div>
          <button 
              onClick={() => { playSound('toggle'); onLanguageChange?.(language === 'en' ? 'ar' : 'en'); }}
              className="h-9 px-4 rounded-lg bg-amber-500/5 border border-amber-500/10 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:bg-amber-500/10 transition-all active:scale-95"
          >
              <Globe className="w-3.5 h-3.5 text-amber-500/70" />
              {language === 'en' ? 'ARABIC' : 'ENGLISH'}
          </button>
      </div>

      <div className={`flex-1 flex flex-col pt-28 pb-10 px-8 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic relative inline-block">
            <span className="relative z-10">CORE SELECTION</span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-amber-500/20" />
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto w-full">
          {platforms.map((p, idx) => (
            <div key={p.id}>
              <button 
                onClick={() => { playSound('click'); setSelected(p.id); }}
                disabled={isConnecting}
                className={`group relative w-full rounded-2xl transition-all duration-300 overflow-hidden flex items-center p-4 border-2 ${
                  selected === p.id 
                    ? 'border-amber-500 bg-amber-500/10' 
                    : 'border-amber-500/5 bg-zinc-950/40 hover:border-amber-500/20'
                }`}
              >
                <div className="absolute top-0 left-0 px-2 py-0.5 bg-amber-500 text-[6px] font-black text-black uppercase tracking-widest rounded-br-lg">
                  {p.code}
                </div>

                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-amber-500/10 bg-black shrink-0">
                  <img 
                    src={p.img} 
                    alt={p.name} 
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      selected === p.id ? 'grayscale-0 opacity-100' : 'grayscale opacity-30 group-hover:opacity-50'
                    }`} 
                  />
                </div>

                <div className="ml-6 flex-1 flex flex-col items-start">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${selected === p.id ? 'text-amber-500' : 'text-zinc-500'}`}>
                    {isRtl ? "المنصة" : "PLATFORM"}
                  </span>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-wider">{p.name}</h3>
                </div>

                {selected === p.id && (
                  <div className="mr-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-black stroke-[4px]" />
                    </div>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-8 max-w-sm mx-auto w-full pt-12">
          <button 
            onClick={handleProceed}
            disabled={isConnecting}
            className="group relative w-full h-12 rounded-xl bg-amber-500 text-black font-black text-[11px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 hover:bg-amber-400 active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden italic"
          >
            <span className="relative z-10">{isRtl ? "بدء التشغيل" : "INITIALIZE LINK"}</span>
            <ChevronRight className={`w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
          
          <div className="flex justify-center gap-8 opacity-50">
             <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={14} className="text-amber-500" />
                <span className="text-[6px] font-mono text-amber-500 uppercase tracking-widest">Encrypted</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <Terminal size={14} className="text-amber-500" />
                <span className="text-[6px] font-mono text-amber-500 uppercase tracking-widest">Verified</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <Zap size={14} className="text-amber-500" />
                <span className="text-[6px] font-mono text-amber-500 uppercase tracking-widest">Optimized</span>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isConnecting && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-6">
             <div className="w-full max-w-sm">
                <div className="bg-zinc-950 border border-amber-500/10 rounded-[2.5rem] p-10 relative overflow-hidden">
                  <div className="flex flex-col items-center mb-10">
                    <div className="relative mb-6">
                      <div className="relative w-20 h-20 rounded-2xl bg-black border border-amber-500/20 flex items-center justify-center">
                          <Terminal className="w-10 h-10 text-amber-500" />
                      </div>
                    </div>
                    <h4 className="text-xl font-black text-white uppercase tracking-[0.2em] italic">{isRtl ? "جاري الربط" : "ESTABLISHING LINK"}</h4>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-2">Protocol: NINJA_VIP_v4</span>
                  </div>

                  <div className="space-y-4 mb-10">
                     {statusSteps.map((step, i) => (
                       <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'} ${activeSteps.includes(i) ? 'opacity-100' : 'opacity-20'}`}>
                         <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${activeSteps.includes(i) ? 'bg-amber-500/10 border-amber-500/50' : 'border-zinc-800'}`}>
                           {activeSteps.includes(i) ? <Check className="w-3 h-3 text-amber-500" /> : <Loader2 className="w-3 h-3 text-zinc-700 animate-spin" />}
                         </div>
                         <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">{step}</span>
                       </div>
                     ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{isRtl ? "التقدم" : "PROGRESS"}</span>
                      <span className="text-xl font-black text-white font-mono">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-amber-500 transition-all duration-300 ease-out" 
                         style={{ width: `${progress}%` }} 
                       />
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
