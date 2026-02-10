
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
  const logoUrl = "https://image2url.com/r2/default/images/1767391654654-34f1434f-a850-4fa8-808e-fce24d1fcf4e.jpg";

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out 
      bg-black
      ${exit ? 'opacity-0 scale-110 blur-xl' : 'opacity-100'} 
      ${isArabic ? 'font-ar' : ''}`}>
      
      {/* ENHANCED BACKGROUND LIGHTING ANIMATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.15)_0%,transparent_50%)]" />
        
        {/* Sweeping Light Beams */}
        <MotionDiv 
          animate={{ 
            x: ['-100%', '200%'],
            rotate: [0, 15]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-[40%] bg-gradient-to-r from-transparent via-red-600/10 to-transparent skew-x-12 opacity-30 blur-2xl"
        />
        
        <MotionDiv 
          animate={{ 
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)]"
        />

        <Particles theme="dark" count={60} />
      </div>
      
      <div className="relative z-10 flex flex-col items-center w-full px-6 flex-1 justify-center">
        {/* Centered Logo Presentation */}
        <div className="relative mb-10">
          <MotionDiv 
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="relative"
          >
            {/* Spinning decorative borders */}
            <div className="absolute -inset-8 border border-red-600/20 rounded-full animate-[spin_15s_linear_infinite]" />
            <div className="absolute -inset-12 border border-white/5 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
            <div className="absolute -inset-1 w-full h-full bg-red-600/20 blur-3xl rounded-full animate-pulse" />

            <div className="relative w-44 h-44 rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_20px_50px_rgba(220,38,38,0.2)]">
                <img 
                  src={logoUrl} 
                  alt="Dragon Logo"
                  className="w-full h-full object-cover select-none p-1.5 rounded-[2.3rem]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </MotionDiv>
        </div>

        {/* Branding Title - Sized down and updated as requested */}
        <div className="text-center space-y-4">
          <MotionDiv 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-3xl font-black tracking-[0.2em] uppercase 
              ${isArabic ? 'font-ar tracking-normal' : 'font-en'}
              text-white`}
          >
            DRAGON <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">VIP</span>
          </MotionDiv>
        </div>
      </div>

      {/* LOWER BOTTOM PROGRESS BAR - DIMENSIONS: 200x25, RED FILL, NO STROKE */}
      <div className="pb-20 flex flex-col items-center gap-5">
        <div className="relative w-[200px] h-[25px] bg-zinc-950/80 rounded-full border border-white/10 overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Red Progress fill */}
          <MotionDiv 
            className="absolute inset-y-0 left-0 bg-red-600 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            style={{ width: `${progress}%` }}
          />
          
          {/* Glass Overlay Reflective effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
          
          {/* Center percentage indicator */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="text-[10px] font-black font-mono text-white tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {Math.floor(progress)}%
            </span>
          </div>

          {/* Glowing scanner tip */}
          <MotionDiv 
            style={{ left: `${progress}%` }}
            className="absolute inset-y-0 w-8 -ml-4 bg-white/20 blur-md z-20"
          />
        </div>
        
        <MotionDiv
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`text-[9px] font-black tracking-[0.5em] uppercase font-mono text-zinc-500`}
        >
          {isArabic ? 'جاري تهيئة المصفوفة' : 'Initializing Matrix'}
        </MotionDiv>
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
