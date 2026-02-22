
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
          className="absolute bg-gradient-to-b from-lime-600/0 via-lime-600/40 to-lime-600/0 w-[1px]"
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
  
  const isRtl = language === 'ar';

  const platforms = [
    {
      id: '1XBET' as Platform,
      name: '1xBet',
      img: 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766500879248-4e7a13ac-b97d-4a9b-8d80-8ed58e40c847.jpeg',
      code: 'NODE_01'
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
      ctx.strokeStyle = 'rgba(163, 230, 53, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      for(let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for(let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      const time = Date.now() / 2000;
      const scanY = (Math.sin(time) * 0.5 + 0.5) * canvas.height;
      ctx.strokeStyle = 'rgba(163, 230, 53, 0.15)';
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(canvas.width, scanY); ctx.stroke();
      
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
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <RainEffect />

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-20 left-10 text-[7px] font-mono text-lime-400 uppercase tracking-[0.5em] vertical-text">DRAGON_SYSTEM_CORE</div>
        <div className="absolute bottom-20 right-10 text-[7px] font-mono text-lime-400 uppercase tracking-[0.5em] vertical-text rotate-180">ENCRYPTION_ACTIVE</div>
        
        <div className="absolute top-24 right-8 flex flex-col items-end gap-1">
           <div className="w-12 h-[1px] bg-lime-400/30" />
           <span className="text-[6px] font-mono text-zinc-500">LATENCY: 12ms</span>
           <span className="text-[6px] font-mono text-zinc-500">PACKETS: SECURE</span>
        </div>
      </div>

      <MotionDiv 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] h-16 bg-zinc-950/80 border-b border-white/5 flex items-center justify-between px-6 backdrop-blur-xl"
      >
          <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-lime-400/20 blur-sm rounded-lg animate-pulse" />
                <div className="relative w-9 h-9 rounded-lg bg-black border border-lime-400/30 flex items-center justify-center overflow-hidden">
                    <img 
                        src="https://image2url.com/r2/default/images/1771685718404-0db562f8-2fce-4446-b376-7c92ec46acff.jpeg" 
                        alt="Logo" 
                        className="w-full h-full object-cover"
                    />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-[11px] font-black text-white tracking-[0.3em] uppercase italic leading-none">
                  DRAGON <span className="text-lime-400">VIP</span>
                </h1>
                <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Version 4.5.1 Secure</span>
              </div>
          </div>
          <button 
              onClick={() => { playSound('toggle'); onLanguageChange?.(language === 'en' ? 'ar' : 'en'); }}
              className="h-9 px-4 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors"
          >
              <Globe className="w-3.5 h-3.5 text-lime-400" />
              {language === 'en' ? 'ARABIC' : 'ENGLISH'}
          </button>
      </MotionDiv>

      <div className={`flex-1 flex flex-col pt-28 pb-10 px-8 relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="text-center mb-12">
          <MotionDiv 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-lime-400/5 border border-lime-400/20 mb-6"
          >
            <Zap className="w-3 h-3 text-lime-400 animate-pulse" />
            <span className="text-[8px] font-black text-lime-400 uppercase tracking-[0.3em]">{isRtl ? "اختر مصفوفة البيانات" : "SELECT DATA MATRIX"}</span>
          </MotionDiv>
          
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic relative inline-block">
            <span className="relative z-10">CORE SELECTION</span>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-lime-400/50 to-transparent" />
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 max-w-sm mx-auto w-full">
          {platforms.map((p, idx) => (
            <MotionDiv
              key={p.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <button 
                onClick={() => { playSound('click'); setSelected(p.id); }}
                disabled={isConnecting}
                className={`group relative w-full rounded-2xl transition-all duration-500 overflow-hidden flex items-center p-4 border-2 ${
                  selected === p.id 
                    ? 'border-lime-400 bg-lime-400/5 shadow-[0_0_40px_rgba(163,230,53,0.15)]' 
                    : 'border-white/5 bg-zinc-950/40 hover:border-white/10'
                }`}
              >
                <div className="absolute top-0 left-0 px-2 py-0.5 bg-lime-400 text-[6px] font-black text-black uppercase tracking-widest rounded-br-lg opacity-80">
                  {p.code}
                </div>

                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-black shrink-0">
                  <img 
                    src={p.img} 
                    alt={p.name} 
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      selected === p.id ? 'grayscale-0 scale-110 opacity-100' : 'grayscale opacity-30 scale-100'
                    }`} 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-lime-400/20 to-transparent transition-opacity duration-500 ${selected === p.id ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                <div className="ml-6 flex-1 flex flex-col items-start">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${selected === p.id ? 'text-lime-400' : 'text-zinc-500'}`}>
                    {isRtl ? "المنصة" : "PLATFORM"}
                  </span>
                  <h3 className="text-xl font-black text-white uppercase italic tracking-wider">{p.name}</h3>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${selected === p.id ? 'bg-lime-400 animate-pulse shadow-[0_0_8px_rgba(163,230,53,1)]' : 'bg-zinc-800'}`} />
                    <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">{selected === p.id ? 'LINK_READY' : 'STANDBY'}</span>
                  </div>
                </div>

                {selected === p.id && (
                  <MotionDiv
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="mr-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-lime-400 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.5)]">
                      <Check className="w-4 h-4 text-black stroke-[4px]" />
                    </div>
                  </MotionDiv>
                )}

                <div className="absolute bottom-2 right-2 flex gap-1 opacity-20">
                   {[...Array(3)].map((_, i) => <div key={i} className="w-1 h-1 bg-white rounded-full" />)}
                </div>
              </button>
            </MotionDiv>
          ))}
        </div>

        <div className="mt-auto space-y-8 max-w-sm mx-auto w-full pt-12">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-400/20 to-transparent blur opacity-50" />
            <div className="relative bg-zinc-950/80 border border-white/5 p-5 rounded-2xl backdrop-blur-xl flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-lime-400/5 flex items-center justify-center border border-lime-400/20 group-hover:border-lime-400/40 transition-colors">
                 <Cpu className="w-6 h-6 text-lime-400" />
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black text-white uppercase tracking-widest">{isRtl ? "استقرار النظام" : "SYSTEM STABILITY"}</span>
                      <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black text-lime-400 font-mono">99.98%</span>
                 </div>
                 <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden p-[1px]">
                    <MotionDiv 
                      animate={{ width: ['20%', '99%', '95%'] }} 
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      className="h-full bg-lime-400 rounded-full shadow-[0_0_10px_rgba(163,230,53,0.5)]" 
                    />
                 </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleProceed}
            disabled={isConnecting}
            className="group relative w-full h-10 rounded-xl bg-white text-black font-black text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:bg-zinc-100 active:scale-[0.98] transition-all disabled:opacity-50 overflow-hidden italic"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative z-10">{isRtl ? "بدء التشغيل" : "INITIALIZE LINK"}</span>
            <ChevronRight className={`w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>
          
          <div className="flex justify-center gap-8 opacity-30">
             <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={12} className="text-lime-400" />
                <span className="text-[6px] font-mono text-white uppercase">Encrypted</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <Terminal size={12} className="text-lime-400" />
                <span className="text-[6px] font-mono text-white uppercase">Verified</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <Zap size={12} className="text-lime-400" />
                <span className="text-[6px] font-mono text-white uppercase">Optimized</span>
             </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isConnecting && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]/98 backdrop-blur-3xl p-6">
             <MotionDiv 
               initial={{ opacity: 0, scale: 0.9, y: 20 }} 
               animate={{ opacity: 1, scale: 1, y: 0 }} 
               exit={{ opacity: 0, scale: 1.1 }}
               className="w-full max-w-sm"
             >
                <div className="bg-zinc-950 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-lime-400/30 rounded-tl-[2.5rem]" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-lime-400/30 rounded-br-[2.5rem]" />
                  
                  <div className="flex flex-col items-center mb-10">
                    <div className="relative mb-6">
                      <div className="absolute -inset-4 bg-lime-400/20 blur-xl rounded-full animate-pulse" />
                      <div className="relative w-20 h-20 rounded-2xl bg-black border border-lime-400/30 flex items-center justify-center">
                          <Terminal className="w-10 h-10 text-lime-400" />
                      </div>
                    </div>
                    <h4 className="text-xl font-black text-white uppercase tracking-[0.2em] italic">{isRtl ? "جاري الربط" : "ESTABLISHING LINK"}</h4>
                    <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest mt-2">Protocol: DRAGON_VIP_v4</span>
                  </div>

                  <div className="space-y-4 mb-10">
                     {statusSteps.map((step, i) => (
                       <div key={i} className={`flex items-center gap-4 transition-all duration-500 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'} ${activeSteps.includes(i) ? 'opacity-100' : 'opacity-20'}`}>
                         <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${activeSteps.includes(i) ? 'bg-lime-400/10 border-lime-400/50' : 'border-zinc-800'}`}>
                           {activeSteps.includes(i) ? <Check className="w-3 h-3 text-lime-400" /> : <Loader2 className="w-3 h-3 text-zinc-700 animate-spin" />}
                         </div>
                         <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">{step}</span>
                       </div>
                     ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">{isRtl ? "التقدم" : "PROGRESS"}</span>
                      <span className="text-xl font-black text-lime-400 font-mono">{Math.round(progress)}%</span>
                    </div>
                    <div className="relative h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-[2px]">
                       <MotionDiv 
                         className="h-full bg-lime-400 rounded-full shadow-[0_0_15px_#a3e635]" 
                         style={{ width: `${progress}%` }} 
                       />
                    </div>
                  </div>
                </div>
             </MotionDiv>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </div>
  );
};
