
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Copy, 
    Check, 
    Download, 
    ShieldCheck, 
    Fingerprint, 
    Terminal, 
    Scan, 
    ChevronLeft,
    Globe,
    Image,
    Zap
} from 'lucide-react';
import { Language, Platform } from '../types';
import { playSound } from '../services/audio';
import { translations } from '../translations';

const MotionDiv = motion.div as any;

const melbetDownloadUrl = "https://melbet.com/mobile/"; 

const RainEffect: React.FC = () => {
  const drops = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.15 + 0.05,
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
          className="absolute bg-gradient-to-b from-lime-600/0 via-lime-600/40 to-lime-600/0 w-[1px]"
          style={{ left: `${drop.left}%`, height: `${drop.height}px`, opacity: drop.opacity }}
        />
      ))}
    </div>
  );
};

export const Conditions: React.FC<{ 
    onComplete: (isAdmin: boolean, userId: string) => void; 
    onBack?: () => void; 
    language: Language; 
    onLanguageChange: (lang: Language) => void; 
    platform: Platform; 
}> = ({ onComplete, onBack, language, onLanguageChange, platform }) => {
    const isRtl = language === 'ar';
    const t = translations[language];
    const [copied, setCopied] = useState(false);
    const [userId, setUserId] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ userId?: boolean; screenshot?: boolean; profileScreenshot?: boolean; userIdLength?: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [overallProgress, setOverallProgress] = useState(0);
    const [statusText, setStatusText] = useState("UPLINK_INITIALIZING");

    const platformImg = 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766501545744-4b13c58a-2947-489e-b7e5-9c15372aa331.jpg';
    const promoCode = 'TOO3';

    const handleCopy = () => {
        playSound('toggle');
        navigator.clipboard.writeText(promoCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
            setErrors(prev => ({ ...prev, screenshot: false }));
            playSound('success');
        }
    };

    const handleProfileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfilePreviewUrl(URL.createObjectURL(e.target.files[0]));
            setErrors(prev => ({ ...prev, profileScreenshot: false }));
            playSound('success');
        }
    };

    const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (val.length <= 15) {
            setUserId(val);
            if (val.length >= 8) setErrors(prev => ({ ...prev, userId: false, userIdLength: false }));
        }
    };

    const validateAndSubmit = async () => {
        playSound('click');
        const trimmedId = userId.trim();
        const isLengthValid = trimmedId.length >= 8 && trimmedId.length <= 15;
        const newErrors = { userId: !trimmedId, userIdLength: !isLengthValid && !!trimmedId, screenshot: !previewUrl, profileScreenshot: !profilePreviewUrl };
        setErrors(newErrors);

        if (!newErrors.userId && !newErrors.userIdLength && !newErrors.screenshot && !newErrors.profileScreenshot) {
            setIsSubmitting(true);
            setStatusText("SYSTEM UPLINK...");
            let isAdminVerified = trimmedId === '1726354290';
            const duration = 4000;
            const increment = 100 / (duration / 30);
            const timer = setInterval(() => {
                setOverallProgress(prev => {
                    const next = prev + increment;
                    if (next >= 33 && next < 66) setStatusText("VERIFYING DEPOSIT...");
                    if (next >= 66 && next < 95) setStatusText("VERIFYING ID...");
                    if (next >= 100) { setStatusText("AUTHENTICATED"); clearInterval(timer); return 100; }
                    return next;
                });
            }, 30);
            setTimeout(() => { playSound('success'); onComplete(isAdminVerified, trimmedId); }, duration + 500);
        }
    };

    return (
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex flex-col h-full bg-[#050505] relative overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
            <RainEffect />
            
            {/* SCANLINE EFFECT */}
            <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            {/* HUD BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
                <div className="absolute inset-0 bg-grid-moving" />
                <div className="absolute top-40 left-10 text-[6px] font-mono text-lime-600 uppercase tracking-[0.5em] vertical-text">MISSION_BRIEFING_ACTIVE</div>
                <div className="absolute bottom-40 right-10 text-[6px] font-mono text-lime-600 uppercase tracking-[0.5em] vertical-text rotate-180">COMMAND_CENTER_UPLINK</div>
            </div>

            {/* TOP BAR */}
            <MotionDiv dir="ltr" className="fixed top-0 left-0 right-0 h-16 bg-zinc-950/80 border-b border-white/5 flex items-center justify-between px-6 z-[100] backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button onClick={() => { playSound('click'); onBack(); }} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="flex flex-col">
                        <h1 className="text-[11px] font-black text-white tracking-[0.3em] uppercase italic leading-none">DRAGON <span className="text-lime-400">VIP</span></h1>
                        <span className="text-[6px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Command Center</span>
                    </div>
                </div>
                <button onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }} className="h-9 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors">
                    <Globe className="w-3.5 h-3.5 text-lime-400" />
                    {language === 'en' ? 'ARABIC' : 'ENGLISH'}
                </button>
            </MotionDiv>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto pt-24 pb-32 px-6 relative z-10 custom-scrollbar">
                <div className="max-w-sm mx-auto">
                    
                    {/* MISSION STATUS HEADER */}
                    <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                                <span className="text-[8px] font-black text-lime-400 uppercase tracking-widest italic">MISSION_ACTIVE</span>
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{isRtl ? "بروتوكول الوصول" : "ACCESS PROTOCOL"}</h2>
                        </div>
                        <div className="text-right">
                            <span className="text-[6px] font-mono text-zinc-500 uppercase block mb-1">UPLINK_STABILITY</span>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-3 h-1 rounded-full ${i < 4 ? 'bg-lime-400' : 'bg-zinc-800'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* BENTO GRID */}
                    <div className="grid grid-cols-6 gap-3">
                        
                        {/* NODE 01: INSTALL (Large) */}
                        <MotionDiv 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="col-span-6 bg-zinc-950 border border-white/5 rounded-3xl p-6 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                <Download className="w-32 h-32 text-lime-400" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-[10px] font-black text-lime-400 italic">01</div>
                                        <h3 className="text-[12px] font-black text-white uppercase italic tracking-wider">{t.install_app}</h3>
                                    </div>
                                    <span className="text-[6px] font-mono text-zinc-600 uppercase tracking-widest">PHASE_INIT</span>
                                </div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl border border-white/10 overflow-hidden shrink-0 shadow-2xl">
                                        <img src={platformImg} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <p className="text-[10px] text-zinc-400 italic leading-relaxed">{t.install_desc}</p>
                                </div>
                                <a href={melbetDownloadUrl} target="_blank" rel="noopener" className="w-full h-12 rounded-xl bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all italic shadow-xl">
                                    <Download className="w-4 h-4" /> {t.install_btn}
                                </a>
                            </div>
                        </MotionDiv>

                        {/* NODE 02: PROMO (Square) */}
                        <MotionDiv 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="col-span-3 bg-zinc-950 border border-white/5 rounded-3xl p-5 relative overflow-hidden group"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-6 h-6 rounded-md bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-[8px] font-black text-lime-400 italic">02</div>
                                    <span className="text-[5px] font-mono text-zinc-700 uppercase tracking-widest">SYNC</span>
                                </div>
                                <div onClick={handleCopy} className="bg-black/40 border border-white/5 p-3 rounded-xl cursor-pointer group/copy hover:border-lime-400/30 transition-all">
                                    <span className="text-[6px] text-zinc-600 font-black uppercase block mb-1 tracking-widest">ENCRYPTION_KEY</span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-mono font-black text-white tracking-widest">{promoCode}</span>
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${copied ? 'bg-lime-400 text-black' : 'text-zinc-500 group-hover/copy:text-lime-400'}`}>
                                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>

                        {/* NODE 03: DEPOSIT (Square) */}
                        <MotionDiv 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="col-span-3 bg-zinc-950 border border-white/5 rounded-3xl p-5 relative overflow-hidden group"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-6 h-6 rounded-md bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-[8px] font-black text-lime-400 italic">03</div>
                                    <span className="text-[5px] font-mono text-zinc-700 uppercase tracking-widest">VAL</span>
                                </div>
                                <div className="space-y-2" dir="ltr">
                                    <div className="flex justify-between items-center bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                                        <span className="text-[7px] font-mono text-zinc-600">USD</span>
                                        <span className="text-[11px] font-mono font-black text-white">$5.00</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                                        <span className="text-[7px] font-mono text-zinc-600">EGP</span>
                                        <span className="text-[11px] font-mono font-black text-white">250</span>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>

                        {/* NODE 04: VERIFY (Wide) */}
                        <MotionDiv 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="col-span-6 bg-zinc-950 border border-white/5 rounded-3xl p-6 relative overflow-hidden group"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-[10px] font-black text-lime-400 italic">04</div>
                                    <h3 className="text-[12px] font-black text-white uppercase italic tracking-wider">{t.verify_account}</h3>
                                </div>
                                <span className="text-[6px] font-mono text-zinc-600 uppercase tracking-widest">PHASE_AUTH</span>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="relative">
                                    <label className="text-[7px] text-zinc-600 font-black uppercase tracking-widest block mb-2 italic">USER_MATRIX_ID</label>
                                    <div className="relative">
                                        <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lime-400/40" />
                                        <input 
                                            type="tel" 
                                            value={userId} 
                                            onChange={handleUserIdChange} 
                                            placeholder="000000000" 
                                            className={`w-full bg-black/60 border h-12 pl-12 pr-4 rounded-xl text-white font-mono text-sm focus:outline-none transition-all ${errors.userId ? 'border-lime-400/50' : 'border-white/5 focus:border-lime-400/40'}`} 
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <input type="file" id="scr" hidden onChange={handleFileChange} />
                                        <label htmlFor="scr" className={`h-24 rounded-2xl border border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${errors.screenshot ? 'border-lime-400 bg-lime-400/5' : 'border-white/10 bg-black/40 hover:border-lime-400/20'}`}>
                                            {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover opacity-60" alt="" /> : <><Scan className="w-5 h-5 text-zinc-800" /><span className="text-[7px] text-zinc-700 font-black uppercase mt-2 tracking-tighter">RECEIPT</span></>}
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <input type="file" id="prof" hidden onChange={handleProfileFileChange} />
                                        <label htmlFor="prof" className={`h-24 rounded-2xl border border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${errors.profileScreenshot ? 'border-lime-400 bg-lime-400/5' : 'border-white/10 bg-black/40 hover:border-lime-400/20'}`}>
                                            {profilePreviewUrl ? <img src={profilePreviewUrl} className="w-full h-full object-cover opacity-60" alt="" /> : <><Image className="w-5 h-5 text-zinc-800" /><span className="text-[7px] text-zinc-700 font-black uppercase mt-2 tracking-tighter">PROFILE</span></>}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>

                        {/* MOCK SYSTEM LOGS */}
                        <div className="col-span-6 bg-black/40 border border-white/5 rounded-2xl p-4 h-20 overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none z-10" />
                            <div className="text-[6px] font-mono text-zinc-600 space-y-1 animate-pulse">
                                <p>[SYSTEM] INITIALIZING SECURITY CLEARANCE...</p>
                                <p>[UPLINK] ESTABLISHING SECURE CONNECTION TO CORE...</p>
                                <p>[AUTH] WAITING FOR USER MATRIX IDENTIFICATION...</p>
                                <p>[SYNC] ENCRYPTION KEYS GENERATED SUCCESSFULLY.</p>
                                <p>[LOG] MISSION_BRIEFING_LOADED_AT_{new Date().toLocaleTimeString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* INITIALIZE BUTTON */}
                    <div className="pt-10">
                        <button 
                            onClick={validateAndSubmit} 
                            disabled={isSubmitting} 
                            className="group relative w-full h-16 rounded-2xl bg-lime-400 text-black font-black text-[12px] tracking-[0.4em] uppercase flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(163,230,53,0.3)] active:scale-[0.98] transition-all disabled:opacity-20 overflow-hidden italic"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <span className="relative z-10">{isRtl ? "تأكيد الوصول" : "INITIALIZE UPLINK"}</span>
                            <ShieldCheck className="w-6 h-6 relative z-10" />
                        </button>
                        
                        <div className="flex justify-center gap-8 mt-6 opacity-30">
                            <div className="flex items-center gap-2">
                                <Terminal size={12} className="text-lime-400" />
                                <span className="text-[7px] font-mono text-white uppercase">Encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap size={12} className="text-lime-400" />
                                <span className="text-[7px] font-mono text-white uppercase">Verified</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SUBMISSION OVERLAY */}
            <AnimatePresence>
                {isSubmitting && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]/98 backdrop-blur-3xl p-8">
                        <MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xs text-center">
                            <div className="bg-zinc-950 border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-lime-400/30" />
                                <div className="flex items-center justify-center mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-black border border-lime-400/30 flex items-center justify-center relative">
                                        <Terminal className="w-8 h-8 text-lime-400 animate-pulse" />
                                        <div className="absolute inset-0 bg-lime-400/5 blur-xl rounded-full animate-pulse" />
                                    </div>
                                </div>
                                <div className="space-y-3 mb-8 text-center">
                                    <h3 className="text-[9px] font-black text-white uppercase tracking-[0.3em] italic">{statusText}</h3>
                                    <div className="text-3xl font-mono font-black text-lime-400 italic">{Math.round(overallProgress)}%</div>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden p-[1px]">
                                    <MotionDiv className="h-full bg-lime-400 rounded-full shadow-[0_0_15px_#a3e635]" style={{ width: `${overallProgress}%` }} />
                                </div>
                            </div>
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                }
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </MotionDiv>
    );
};
