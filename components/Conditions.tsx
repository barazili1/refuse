
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Copy, 
    Check, 
    Download, 
    ArrowRight, 
    ArrowLeft,
    ShieldCheck, 
    Fingerprint, 
    Terminal, 
    Scan, 
    ChevronLeft,
    Globe,
    Image,
    Hexagon
} from 'lucide-react';
import { Language, Platform } from '../types';
import { playSound } from '../services/audio';
import { translations } from '../translations';

const MotionDiv = motion.div as any;

const xbetDownloadUrl = "https://reffpa.com/L?tag=d_2845435m_27409c_&site=2845435&ad=27409";
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
          className="absolute bg-gradient-to-b from-red-600/0 via-red-600/40 to-red-600/0 w-[1px]"
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
    const t = translations[language];
    const isRtl = language === 'ar';
    const [copied, setCopied] = useState(false);
    const [userId, setUserId] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [profilePreviewUrl, setProfilePreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ userId?: boolean; screenshot?: boolean; profileScreenshot?: boolean; userIdLength?: boolean }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [overallProgress, setOverallProgress] = useState(0);
    const [statusText, setStatusText] = useState("UPLINK_INITIALIZING");
    const [currentStep, setCurrentStep] = useState(0);

    const platformImg = platform === '1XBET' 
        ? 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766500879248-4e7a13ac-b97d-4a9b-8d80-8ed58e40c847.jpeg'
        : 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766501545744-4b13c58a-2947-489e-b7e5-9c15372aa331.jpg';
    const promoCode = platform === '1XBET' ? 'V8S' : 'TOO3';

    const handleCopy = () => {
        playSound('toggle');
        navigator.clipboard.writeText(promoCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const nextStep = () => { if (currentStep < 3) { playSound('click'); setCurrentStep(prev => prev + 1); } };
    const prevStep = () => { if (currentStep > 0) { playSound('click'); setCurrentStep(prev => prev - 1); } };

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
        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`flex flex-col h-full bg-black relative overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
            <RainEffect />
            <MotionDiv dir="ltr" className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-white/5 flex items-center justify-between px-6 z-[100] shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-3">
                    {onBack && <button onClick={() => { playSound('click'); onBack(); }} className="p-1 text-zinc-500 hover:text-white transition-colors"><ChevronLeft className="w-6 h-6" /></button>}
                    <h1 className="text-[12px] font-black text-white tracking-[0.3em] uppercase italic">DRAGON <span className="text-red-600">VIP</span></h1>
                </div>
                <button onClick={() => { playSound('toggle'); onLanguageChange(language === 'en' ? 'ar' : 'en'); }} className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-tighter flex items-center gap-2"><Globe className="w-4 h-4 text-red-600" />{language === 'en' ? 'AR' : 'EN'}</button>
            </MotionDiv>
            <div className="pt-28 px-8 mb-8 relative z-10">
                <div className="flex items-center justify-between max-w-sm mx-auto relative px-2">
                    <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-zinc-900 -translate-y-1/2 z-0" />
                    <MotionDiv initial={{ width: 0 }} animate={{ width: `${(currentStep / 3) * 100}%` }} className="absolute top-1/2 left-4 h-[1px] bg-red-600 -translate-y-1/2 z-0 shadow-[0_0_15px_#dc2626]" />
                    {[0, 1, 2, 3].map((step) => (
                        <div key={step} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10 transition-all duration-700 ${currentStep === step ? 'bg-red-600 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] scale-110' : (currentStep > step ? 'bg-black border-red-600 text-red-600' : 'bg-black border-zinc-800 text-zinc-800')}`}>{currentStep > step ? <Check className="w-5 h-5 stroke-[4px]" /> : <span className="text-xs font-black font-mono">{step + 1}</span>}</div>
                    ))}
                </div>
            </div>
            <div className="flex-1 px-8 pb-32 relative z-10 flex flex-col justify-center max-w-sm mx-auto w-full">
                <AnimatePresence mode="wait">
                    <MotionDiv key={currentStep} initial={{ opacity: 0, x: isRtl ? -40 : 40, filter: 'blur(10px)' }} animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, x: isRtl ? 40 : -40, filter: 'blur(10px)' }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="bg-zinc-950/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Hexagon className="w-40 h-40 text-red-600" /></div>
                        <div className={`mb-10 ${isRtl ? 'text-right' : 'text-left'}`}>
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] font-mono block mb-2 italic">ACCESS_STEP_0{currentStep + 1}</span>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{currentStep === 0 && t.install_app}{currentStep === 1 && t.registration}{currentStep === 2 && t.activation_deposit}{currentStep === 3 && t.verify_account}</h2>
                            <div className="h-0.5 w-10 bg-red-600/40 mt-3" />
                        </div>
                        <div className={`min-h-[200px] flex flex-col justify-center ${isRtl ? 'text-right' : 'text-left'}`}>
                            {currentStep === 0 && (
                                <>
                                    <div className="flex items-center gap-6 mb-8 flex-row"><div className="w-16 h-16 rounded-2xl bg-black border border-white/10 p-1 shrink-0 overflow-hidden shadow-2xl"><img src={platformImg} className="w-full h-full object-cover rounded-xl" alt="" /></div><p className="text-[12px] text-zinc-400 font-medium leading-relaxed italic">{t.install_desc}</p></div>
                                    <a href={platform === '1XBET' ? xbetDownloadUrl : melbetDownloadUrl} target="_blank" rel="noopener" className="w-full h-14 rounded-2xl bg-white text-black font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-4 active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(255,255,255,0.1)]"><Download className="w-5 h-5" /> {t.install_btn}</a>
                                </>
                            )}
                            {currentStep === 1 && (
                                <>
                                    <p className="text-[12px] text-zinc-400 mb-8 font-medium leading-relaxed italic">{t.reg_desc}</p>
                                    <div onClick={handleCopy} className="bg-black/60 border border-white/5 p-6 rounded-[2rem] cursor-pointer flex items-center justify-between group hover:border-red-600/30 transition-all">
                                        <div><span className="text-[8px] text-zinc-600 font-black uppercase block mb-1 tracking-widest italic">PROTOCOL_SYNC_ID</span><span className="text-2xl font-mono font-black text-white tracking-widest">{promoCode}</span></div>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${copied ? 'bg-red-600 text-white' : 'bg-white/5 text-zinc-500 group-hover:text-red-600'}`}>{copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</div>
                                    </div>
                                </>
                            )}
                            {currentStep === 2 && (
                                <>
                                    <p className="text-[12px] text-zinc-400 mb-8 font-medium leading-relaxed italic">{t.min_deposit}</p>
                                    <div className="grid grid-cols-2 gap-4" dir="ltr">
                                        <div className="bg-black/40 border border-white/5 p-6 rounded-[2rem] text-center backdrop-blur-md"><span className="text-[8px] text-zinc-600 font-black block mb-1 uppercase tracking-widest italic">BASE_USD</span><span className="text-2xl font-mono font-black text-white">$5.00</span></div>
                                        <div className="bg-black/40 border border-white/5 p-6 rounded-[2rem] text-center backdrop-blur-md"><span className="text-[8px] text-zinc-600 font-black block mb-1 uppercase tracking-widest italic">BASE_EGP</span><span className="text-2xl font-mono font-black text-white">250</span></div>
                                    </div>
                                </>
                            )}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="relative"><label className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.2em] block mb-3 italic">{t.userid_label}</label><div className="relative"><Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" /><input type="tel" value={userId} onChange={handleUserIdChange} placeholder="000000000" className={`w-full bg-black/60 border-2 h-16 pl-14 pr-6 rounded-2xl text-white font-mono text-lg focus:outline-none transition-all ${errors.userId ? 'border-red-600/50' : 'border-white/5 focus:border-red-600/40'}`} /></div></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative"><input type="file" id="scr" hidden onChange={handleFileChange} /><label htmlFor="scr" className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${errors.screenshot ? 'border-red-600 bg-red-600/5' : 'border-white/10 bg-black/40 hover:border-red-600/20'}`}>{previewUrl ? <img src={previewUrl} className="w-full h-full object-cover opacity-60" alt="" /> : <><Scan className="w-6 h-6 text-zinc-800" /><span className="text-[7px] text-zinc-700 font-black uppercase mt-2 tracking-tighter">RECEIPT</span></>}</label></div>
                                        <div className="relative"><input type="file" id="prof" hidden onChange={handleProfileFileChange} /><label htmlFor="prof" className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${errors.profileScreenshot ? 'border-red-600 bg-red-600/5' : 'border-white/10 bg-black/40 hover:border-red-600/20'}`}>{profilePreviewUrl ? <img src={profilePreviewUrl} className="w-full h-full object-cover opacity-60" alt="" /> : <><Image className="w-6 h-6 text-zinc-800" /><span className="text-[7px] text-zinc-700 font-black uppercase mt-2 tracking-tighter">PROFILE</span></>}</label></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </MotionDiv>
                </AnimatePresence>
                <div className="mt-10 flex gap-4">
                    {currentStep > 0 && <button onClick={prevStep} className="w-16 h-16 rounded-[1.5rem] bg-zinc-950 border border-white/5 text-zinc-500 flex items-center justify-center active:scale-90 transition-all hover:text-white"><ArrowLeft className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} /></button>}
                    {currentStep < 3 ? <button onClick={nextStep} className="flex-1 h-16 rounded-[1.5rem] bg-white text-black font-black text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] active:scale-[0.98] transition-all italic"><span>{isRtl ? "المتابعة" : "NEXT STEP"}</span><ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} /></button> : <button onClick={validateAndSubmit} disabled={isSubmitting} className="flex-1 h-16 rounded-[1.5rem] bg-red-600 text-white font-black text-xs tracking-[0.4em] uppercase flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(220,38,38,0.3)] active:scale-[0.98] transition-all disabled:opacity-20 italic"><span>{isRtl ? "تأكيد الوصول" : "AUTHORIZE"}</span><ShieldCheck className="w-5 h-5" /></button>}
                </div>
            </div>
            <AnimatePresence>{isSubmitting && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8"><MotionDiv initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xs text-center"><div className="bg-zinc-950/50 border border-red-600/20 rounded-[4rem] p-12 shadow-[0_0_150px_rgba(220,38,38,0.15)] relative overflow-hidden"><div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600/30" /><div className="flex items-center justify-center mb-10"><div className="w-20 h-20 rounded-3xl bg-black border border-red-600/20 flex items-center justify-center relative"><Terminal className="w-10 h-10 text-red-600 animate-pulse" /><div className="absolute inset-0 bg-red-600/5 blur-xl rounded-full animate-pulse" /></div></div><div className="space-y-3 mb-10 text-center"><h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] italic">{statusText}</h3><div className="text-4xl font-mono font-black text-red-600 italic">{Math.round(overallProgress)}%</div></div><div className="h-2 w-full bg-zinc-900/50 rounded-full overflow-hidden mb-8 p-0.5"><MotionDiv className="h-full bg-red-600 rounded-full shadow-[0_0_20px_#dc2626]" style={{ width: `${overallProgress}%` }} /></div></div></MotionDiv></div>}</AnimatePresence>
        </MotionDiv>
    );
};
