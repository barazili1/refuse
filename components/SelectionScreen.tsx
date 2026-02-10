
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Platform, 
  Language 
} from '../types';
import { 
  Check, 
  ChevronRight, 
  Hexagon, 
  Terminal,
  Globe,
  ShieldCheck,
  Cpu,
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

const RainEffect: React.FC = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.2 + 0.05,
      height: Math.random() * 60 + 30,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {drops.map((drop) => (
        <MotionDiv
          key={drop.id}
          initial={{ y: -200 }}
          animate={{ y: '110vh' }}
          transition={{
            duration: drop.duration,
            repeat: Infinity,
            ease: "linear",
            delay: drop.delay,
          }}
          className="absolute bg-gradient-to-b from-red-600/0 via-red-600/40 to-red-600/0 w-[1px]"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  );
};

export const SelectionScreen: React.FC<SelectionScreenProps> = ({ onSelect, language, onLanguageChange }) => {
  const [selected, setSelected] = useState<Platform>('1XBET');
  const [isConnecting, setIsConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeSteps, setActiveSteps] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const t = translations[language];
  const isRtl = language === 'ar';

  const platforms = [
    {
      id: '1XBET' as Platform,
      name: '1xBet',
      img: 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766500879248-4e7a13ac-b97d-4a9b-8d80-8ed58e40c847.jpeg'
    },
    {
      id: 'MELBET' as Platform,
      name: 'Melbet',
      img: 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766501545744-4b13c58a-2947-489e-b7e5-9c15372aa331.jpg'
    }
  ];

  const statusSteps = [
    isRtl ? "جاري الاتصال بالسيرفر" : "Connecting to server",
    isRtl ? "تحليل مصفوفة الأمان" : "Analyzing security matrix",
    isRtl ? "ربط البروتوكول VIP" : "Linking VIP protocol",
    isRtl ? "تم الاتصال بنجاح" : "Successfully connected"
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(220, 38, 38, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for(let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for(let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    if (isConnecting) {
      const duration = 2000;
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
    <div className={`flex flex-col h-full bg-black relative overflow-hidden`}>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <RainEffect />

      {/* SLEEK TOP BAR */}
      <MotionDiv 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] h-14 bg-zinc-950/80 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-xl"
      >
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                  <Hexagon className="w-5 h-5 text-red-600 animate-pulse" />
              </div>
              <h1 className="text-[10px] font-black text-white tracking-[0.2em] uppercase italic">
                DRAGON <span className="text-red-600">VIP</span>
              </h1>
          </div>
          <button 
              onClick={() => { playSound('toggle'); onLanguageChange?.(language === 'en' ? 'ar' : 'en'); }}
              className="h-8 px-3 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white uppercase tracking-tighter flex items-center gap-2"
          >
              <Globe className="w-3 h-3 text-red-600" />
              {language === 'en' ? 'AR' : 'EN'}
          </button>
      </MotionDiv>

      {/* CONTENT */}
      <div className={`flex-1 flex flex-col pt-24 pb-10 px-8 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
        
        <div className="text-center mb-10">
          <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <Zap className="w-2.5 h-2.5 text-red-600" />
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-[0.2em]">{isRtl ? "اختر المنصة" : "SELECT PLATFORM"}</span>
          </MotionDiv>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">
            DRAGON <span className="text-red-600">VIP</span>
          </h2>
          <div className="h-[1px] w-8 bg-red-600/40 mx-auto mt-2" />
        </div>

        {/* SIDE BY SIDE PLATFORMS - SMALLER SIZE */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-12 w-full">
          {platforms.map((p) => (
            <button 
              key={p.id}
              onClick={() => { playSound('click'); setSelected(p.id); }}
              disabled={isConnecting}
              className={`group relative aspect-square rounded-3xl transition-all duration-500 overflow-hidden flex items-center justify-center border-2 ${
                selected === p.id 
                  ? 'border-red-600 bg-red-600/5 shadow-[0_0_30px_rgba(220,38,38,0.2)]' 
                  : 'border-white/5 bg-zinc-950/40 hover:border-zinc-800'
              }`}
            >
              <div className="p-4 w-full h-full">
                <img 
                  src={p.img} 
                  alt={p.name} 
                  className={`w-full h-full object-cover rounded-2xl transition-all duration-700 ${
                    selected === p.id ? 'grayscale-0 scale-105 opacity-100' : 'grayscale opacity-20 scale-100'
                  }`} 
                />
              </div>

              {selected === p.id && (
                <MotionDiv
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-600 flex items-center justify-center shadow-lg z-20"
                >
                  <Check className="w-3.5 h-3.5 text-black stroke-[4px]" />
                </MotionDiv>
              )}
            </button>
          ))}
        </div>

        {/* BOTTOM METRICS */}
        <div className="mt-auto space-y-6 max-w-sm mx-auto w-full">
          <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center border border-red-600/20">
               <Cpu className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
               <div className="flex justify-between items-center mb-1">
                  <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">{isRtl ? "حالة النظام" : "SYSTEM HEALTH"}</span>
                  <span className="text-[8px] font-black text-red-600 uppercase">99.9%</span>
               </div>
               <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <MotionDiv 
                    animate={{ x: [-100, 200] }} 
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-full w-20 bg-gradient-to-r from-transparent via-red-600 to-transparent" 
                  />
               </div>
            </div>
          </div>

          <button 
            onClick={handleProceed}
            disabled={isConnecting}
            className="group relative w-full h-16 rounded-2xl bg-white text-black font-black text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-2xl hover:bg-zinc-100 active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden italic"
          >
            <span>{isRtl ? "دخول آمن" : "LAUNCH SYSTEM"}</span>
            <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* CONNECTION DIALOG */}
      <AnimatePresence>
        {isConnecting && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6">
             <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xs text-center">
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-red-600/30" />
                  
                  <div className="flex items-center justify-center mb-6">
                     <div className="w-14 h-14 rounded-2xl bg-black border border-red-600/20 flex items-center justify-center">
                        <Terminal className="w-7 h-7 text-red-600 animate-pulse" />
                     </div>
                  </div>

                  <div className="space-y-3 mb-8">
                     {statusSteps.map((step, i) => (
                       <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${isRtl ? 'flex-row-reverse' : 'flex-row'} ${activeSteps.includes(i) ? 'opacity-100' : 'opacity-10'}`}>
                         {activeSteps.includes(i) ? <Check className="w-3 h-3 text-red-600" /> : <Loader2 className="w-3 h-3 text-zinc-700 animate-spin" />}
                         <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tight">{step}</span>
                       </div>
                     ))}
                  </div>

                  <div className="relative h-1 w-full bg-zinc-950 rounded-full overflow-hidden mb-2">
                     <MotionDiv className="absolute h-full bg-red-600 shadow-[0_0_10px_#dc2626]" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-red-600 font-mono tracking-widest">{Math.round(progress)}%</span>
                </div>
             </MotionDiv>
          </div>
        )}
      </AnimatePresence>

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 0px; }`}</style>
    </div>
  );
};
