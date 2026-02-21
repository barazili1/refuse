
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Particles } from './Particles';
import { Language } from '../types';
import { Shield, Zap, Terminal, Hexagon } from 'lucide-react';

const MotionDiv = motion.div as any;

interface SplashScreenProps {
  onComplete: () => void;
  language?: Language;
  theme?: 'dark' | 'light';
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, language = 'en', theme = 'dark' }) => {
  const [progress, setProgress] = useState(0);
  const [exit, setExit] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const duration = 4000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => setExit(true), 500);
        setTimeout(() => {
          onCompleteRef.current();
        }, 1200);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []); 

  const isArabic = language === 'ar';
  const logoUrl = "https://image2url.com/r2/default/images/1771685718404-0db562f8-2fce-4446-b376-7c92ec46acff.jpeg";

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out 
      bg-[#050505]
      ${exit ? 'opacity-0 scale-110 blur-xl' : 'opacity-100'} 
      ${isArabic ? 'font-ar' : ''}`}>
      
      {/* IMMERSIVE BACKGROUND HUD */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Scanning Grid */}
        <div className="absolute inset-0 opacity-[0.03] bg-grid-moving" />
        
        {/* Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

        {/* Dynamic Red Pulses */}
        <MotionDiv 
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.2)_0%,transparent_70%)]"
        />

        {/* Corner HUD Elements */}
        <div className="absolute top-8 left-8 flex flex-col gap-1 opacity-20">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-lime-400 animate-pulse" />
            <span className="text-[8px] font-mono text-white tracking-widest uppercase">System_Status: Active</span>
          </div>
          <div className="text-[7px] font-mono text-zinc-500 uppercase">Kernel_Hash: 0x8F2A...9C1E</div>
        </div>

        <div className="absolute top-8 right-8 flex flex-col items-end gap-1 opacity-20">
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-mono text-white tracking-widest uppercase">Encryption: AES-256</span>
            <Shield size={8} className="text-lime-400" />
          </div>
          <div className="text-[7px] font-mono text-zinc-500 uppercase">Uptime: 99.99%</div>
        </div>

        <Particles theme="dark" count={40} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center w-full px-6 flex-1 justify-center">
        {/* Central Tech Core */}
        <div className="relative mb-12">
          <MotionDiv 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Rotating Tech Rings */}
            <MotionDiv 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-16 border border-dashed border-lime-400/20 rounded-full"
            />
            <MotionDiv 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 border border-lime-400/10 rounded-full"
            />
            
            {/* Hexagonal Frame */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-lime-400/20 blur-2xl rounded-full animate-pulse" />
              
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Hexagon SVG Background */}
                <svg className="absolute inset-0 w-full h-full text-zinc-900 fill-current drop-shadow-[0_0_20px_rgba(163,230,53,0.3)]" viewBox="0 0 100 100">
                  <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" />
                  <path d="M50 8 L87 27 L87 73 L50 92 L13 73 L13 27 Z" className="text-lime-400/20" />
                </svg>

                <div className="relative w-28 h-28 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                  <img 
                    src={logoUrl} 
                    alt="Dragon Logo"
                    className="w-full h-full object-cover select-none opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-lime-400/20 via-transparent to-transparent" />
                </div>
              </div>

              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-lime-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-lime-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-lime-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-lime-400" />
            </div>
          </MotionDiv>
        </div>

        {/* Branding Title */}
        <div className="text-center space-y-2">
          <MotionDiv 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`text-4xl font-black tracking-[0.3em] uppercase 
              ${isArabic ? 'font-ar tracking-normal' : 'font-en'}
              text-white relative`}
          >
            <span className="relative z-10">DRAGON</span>
            <span className="absolute -inset-1 text-lime-400/30 blur-sm select-none">DRAGON</span>
          </MotionDiv>
          
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center justify-center gap-4"
          >
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-lime-400/50" />
            <span className="text-lime-400 font-bold tracking-[0.5em] text-xs uppercase drop-shadow-[0_0_8px_rgba(163,230,53,0.8)]">
              VIP EDITION
            </span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-lime-400/50" />
          </MotionDiv>
        </div>
      </div>

      {/* REDESIGNED PROGRESS SECTION */}
      <div className="pb-24 flex flex-col items-center gap-6 w-full max-w-[260px]">
        <div className="w-full flex justify-between items-end mb-1">
           <div className="flex flex-col">
              <span className="text-[7px] font-black text-lime-400/60 uppercase tracking-[0.2em]">Core Engine</span>
              <span className="text-[11px] font-black text-white uppercase tracking-widest">
                {progress < 30 ? (isArabic ? 'جاري التحميل' : 'Loading') : 
                 progress < 70 ? (isArabic ? 'تحليل البيانات' : 'Analyzing') : 
                 (isArabic ? 'النظام جاهز' : 'System Ready')}
              </span>
           </div>
           <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-black font-mono text-lime-400 leading-none">
                {Math.floor(progress).toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold text-zinc-600 uppercase">%</span>
           </div>
        </div>

        <div className="relative w-full h-[14px] bg-zinc-950/50 border border-white/5 p-[3px] rounded-sm overflow-hidden backdrop-blur-sm">
          {/* Background Track Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: 'repeating-linear-gradient(90deg, #fff, #fff 1px, transparent 1px, transparent 10px)' }} />
          
          {/* The Progress Fill */}
          <MotionDiv 
            className="relative h-full bg-lime-400 rounded-sm shadow-[0_0_25px_rgba(163,230,53,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
            
            {/* Leading Edge Sparkle */}
            <MotionDiv 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="absolute top-0 right-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_#fff]" 
            />
          </MotionDiv>
        </div>

        {/* Status Indicators */}
        <div className="w-full flex justify-between items-center px-1">
           <div className="flex gap-1.5">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 h-1 rounded-full transition-colors duration-500 ${progress > (i+1)*16 ? 'bg-lime-400 shadow-[0_0_5px_rgba(163,230,53,0.8)]' : 'bg-zinc-800'}`} 
                />
              ))}
           </div>
           <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-zinc-500 animate-pulse">
             {isArabic ? 'تشفير آمن' : 'Secure Link Established'}
           </span>
        </div>
      </div>

      {/* Footer System Hash */}
      <div className="absolute bottom-6 opacity-10 flex items-center gap-2">
         <span className="text-[7px] font-black tracking-[0.8em] font-mono uppercase text-white">
            DRAGON_OS_v4.5.1_SECURE_BUILD
         </span>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
