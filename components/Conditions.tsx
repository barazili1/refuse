
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Copy, 
    Check, 
    Download, 
    ShieldCheck, 
    Terminal, 
    Scan, 
    ChevronLeft,
    Globe,
    Image,
    Zap,
    Lock,
    ArrowRight,
    ExternalLink
} from 'lucide-react';
import { Language, Platform } from '../types';
import { playSound } from '../services/audio';
import { translations } from '../translations';

const MotionDiv = motion.div as any;

const oneXBetDownloadUrl = "https://1xbet.com/mobile/"; 
const melbetDownloadUrl = "https://1xbet.com/mobile/"; 

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

    const platformImg = platform === '1XBET' 
        ? 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766500879248-4e7a13ac-b97d-4a9b-8d80-8ed58e40c847.jpeg'
        : 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766500879248-4e7a13ac-b97d-4a9b-8d80-8ed58e40c847.jpeg';
    
    const promoCode = platform === '1XBET' ? 'Abdo7' : 'Abdo7';
    const downloadUrl = platform === '1XBET' ? oneXBetDownloadUrl : melbetDownloadUrl;

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
        <div className={`flex flex-col h-full bg-[#050505] relative overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
            </div>

            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 z-[100] h-16 bg-black/80 backdrop-blur-md border-b border-amber-500/10 flex items-center justify-between px-6">
                <button 
                    onClick={() => { playSound('click'); onBack?.(); }}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-amber-500/20 hover:border-amber-500/50 transition-all"
                >
                    <ChevronLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
                
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-black border border-amber-500/20 overflow-hidden">
                        <img 
                            src="https://image2url.com/r2/default/images/1771685718404-0db562f8-2fce-4446-b376-7c92ec46acff.jpeg" 
                            alt="Logo" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase italic">NINJA <span className="text-amber-500">VIP</span></span>
                </div>

                <button 
                    onClick={() => { playSound('toggle'); onLanguageChange?.(language === 'en' ? 'ar' : 'en'); }}
                    className="h-10 px-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2"
                >
                    <Globe className="w-3.5 h-3.5 text-amber-500" />
                    {language === 'en' ? 'AR' : 'EN'}
                </button>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto pt-24 pb-32 px-6 relative z-10 custom-scrollbar">
                <div className="max-w-md mx-auto">
                    
                    {/* HEADER SECTION */}
                    <MotionDiv 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                            <Lock className="w-3 h-3 text-amber-500" />
                            <span className="text-[8px] font-black text-amber-500 uppercase tracking-[0.2em]">{isRtl ? "تأمين الاتصال" : "SECURE UPLINK"}</span>
                        </div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                            {isRtl ? "بروتوكول التحقق" : "VERIFICATION PROTOCOL"}
                        </h2>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
                            {isRtl ? "أكمل الخطوات التالية للوصول إلى المصفوفة" : "COMPLETE STEPS TO ACCESS THE MATRIX"}
                        </p>
                    </MotionDiv>

                    {/* STEPS LIST - VERTICAL LAYOUT */}
                    <div className="space-y-6">
                        
                        {/* STEP 01: INSTALL */}
                        <MotionDiv 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative"
                        >
                            <div className="absolute -left-3 top-0 bottom-0 w-[1px] bg-gradient-to-b from-amber-500/50 via-amber-500/10 to-transparent" />
                            <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-amber-500/20 transition-all group">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-amber-500/20 flex items-center justify-center text-sm font-black text-amber-500 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.05)]">01</div>
                                    <div className="flex-1">
                                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                                            {t.install_app}
                                            <Zap className="w-3 h-3 text-amber-500 animate-pulse" />
                                        </h3>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed mb-5 italic">{t.install_desc}</p>
                                        <a href={downloadUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest hover:bg-amber-400 transition-all active:scale-95 shadow-lg shadow-amber-500/20">
                                            <Download className="w-4 h-4" /> {t.install_btn}
                                            <ExternalLink className="w-3 h-3 opacity-50" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>

                        {/* STEP 02: PROMO CODE */}
                        <MotionDiv 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute -left-3 top-0 bottom-0 w-[1px] bg-amber-500/10" />
                            <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-amber-500/20 transition-all">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-amber-500/20 flex items-center justify-center text-sm font-black text-amber-500 shrink-0">02</div>
                                    <div className="flex-1">
                                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">{isRtl ? "كود التفعيل" : "ACTIVATION CODE"}</h3>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed mb-4 italic">
                                            {isRtl ? "استخدم الكود التالي عند التسجيل لتفعيل ميزات VIP" : "USE THIS CODE DURING REGISTRATION TO ACTIVATE VIP FEATURES"}
                                        </p>
                                        <div onClick={handleCopy} className="cursor-pointer group/copy relative">
                                            <div className="flex items-center justify-between bg-black/60 p-4 rounded-2xl border border-amber-500/10 group-hover/copy:border-amber-500/30 transition-all">
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-1">PROMO_CODE</span>
                                                    <span className="text-xl font-mono font-black text-white tracking-widest">{promoCode}</span>
                                                </div>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                                </div>
                                            </div>
                                            {copied && (
                                                <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute -top-8 right-0 text-[8px] font-black text-green-500 uppercase">COPIED_TO_CLIPBOARD</MotionDiv>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>

                        {/* STEP 03: DEPOSIT */}
                        <MotionDiv 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative"
                        >
                            <div className="absolute -left-3 top-0 bottom-0 w-[1px] bg-amber-500/10" />
                            <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-amber-500/20 transition-all">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-amber-500/20 flex items-center justify-center text-sm font-black text-amber-500 shrink-0">03</div>
                                    <div className="flex-1">
                                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">{isRtl ? "الإيداع الأول" : "INITIAL DEPOSIT"}</h3>
                                        <p className="text-[10px] text-zinc-400 leading-relaxed mb-4 italic">
                                            {isRtl ? "قم بإيداع الحد الأدنى لتفعيل خوارزمية التوقع" : "DEPOSIT MINIMUM AMOUNT TO ACTIVATE PREDICTION ALGORITHM"}
                                        </p>
                                        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-amber-500/5">
                                            <div className="flex flex-col">
                                                <span className="text-[7px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-1">MIN_THRESHOLD</span>
                                                <span className="text-lg font-mono font-black text-amber-500">$5 / 250 EGP</span>
                                            </div>
                                            <div className="ml-auto w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>

                        {/* STEP 04: VERIFICATION */}
                        <MotionDiv 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative"
                        >
                            <div className="absolute -left-3 top-0 bottom-0 w-[1px] bg-amber-500/10" />
                            <div className="bg-zinc-900/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 hover:border-amber-500/20 transition-all">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-black border border-amber-500/20 flex items-center justify-center text-sm font-black text-amber-500 shrink-0">04</div>
                                    <div className="flex-1">
                                        <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">{t.verify_account}</h3>
                                        
                                        <div className="space-y-4">
                                            <div className="relative group/input">
                                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                                    <Terminal className="w-4 h-4 text-zinc-600 group-focus-within/input:text-amber-500 transition-colors" />
                                                </div>
                                                <input 
                                                    type="tel" 
                                                    value={userId} 
                                                    onChange={handleUserIdChange} 
                                                    placeholder="ENTER_USER_ID" 
                                                    className={`w-full bg-black/60 border h-12 pl-12 pr-4 rounded-2xl text-white font-mono text-sm focus:outline-none transition-all ${errors.userId || errors.userIdLength ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 focus:border-amber-500/30'}`} 
                                                />
                                                {(errors.userId || errors.userIdLength) && (
                                                    <span className="text-[7px] text-red-500 font-black uppercase mt-1 block px-2">INVALID_ID_FORMAT</span>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <label className={`h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group/upload ${errors.screenshot ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-black/60 hover:border-amber-500/20'}`}>
                                                    <input type="file" hidden onChange={handleFileChange} />
                                                    {previewUrl ? (
                                                        <img src={previewUrl} className="w-full h-full object-cover opacity-80" alt="" />
                                                    ) : (
                                                        <>
                                                            <Scan className="w-6 h-6 text-zinc-700 group-hover/upload:text-amber-500 transition-colors mb-2" />
                                                            <span className="text-[7px] text-zinc-500 font-black uppercase tracking-widest">RECEIPT_SCAN</span>
                                                        </>
                                                    )}
                                                </label>
                                                <label className={`h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group/upload ${errors.profileScreenshot ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-black/60 hover:border-amber-500/20'}`}>
                                                    <input type="file" hidden onChange={handleProfileFileChange} />
                                                    {profilePreviewUrl ? (
                                                        <img src={profilePreviewUrl} className="w-full h-full object-cover opacity-80" alt="" />
                                                    ) : (
                                                        <>
                                                            <Image className="w-6 h-6 text-zinc-700 group-hover/upload:text-amber-500 transition-colors mb-2" />
                                                            <span className="text-[7px] text-zinc-500 font-black uppercase tracking-widest">PROFILE_SCAN</span>
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </MotionDiv>
                    </div>

                    {/* INITIALIZE BUTTON */}
                    <MotionDiv 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="pt-12"
                    >
                        <button 
                            onClick={validateAndSubmit} 
                            disabled={isSubmitting} 
                            className="group relative w-full h-16 rounded-[2rem] bg-amber-500 text-black font-black text-xs tracking-[0.3em] uppercase flex items-center justify-center gap-4 active:scale-[0.98] transition-all disabled:opacity-20 shadow-[0_10px_30px_rgba(245,158,11,0.2)]"
                        >
                            <span className="relative z-10">{isRtl ? "تأكيد الوصول للمصفوفة" : "INITIALIZE MATRIX UPLINK"}</span>
                            <ShieldCheck className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </button>
                        
                        <div className="mt-8 flex justify-center gap-8 opacity-30">
                            <div className="flex flex-col items-center gap-1">
                                <ShieldCheck size={14} className="text-amber-500" />
                                <span className="text-[6px] font-mono text-amber-500 uppercase tracking-widest">End-to-End</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Terminal size={14} className="text-amber-500" />
                                <span className="text-[6px] font-mono text-amber-500 uppercase tracking-widest">Verified</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Zap size={14} className="text-amber-500" />
                                <span className="text-[6px] font-mono text-amber-500 uppercase tracking-widest">High-Speed</span>
                            </div>
                        </div>
                    </MotionDiv>
                </div>
            </div>

            {/* SUBMISSION OVERLAY */}
            <AnimatePresence>
                {isSubmitting && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8">
                        <div className="w-full max-w-xs text-center">
                            <div className="bg-zinc-950/80 border border-amber-500/20 rounded-[3rem] p-10 relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.1)]">
                                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                                <div className="flex items-center justify-center mb-8">
                                    <div className="w-20 h-20 rounded-3xl bg-black border border-amber-500/30 flex items-center justify-center relative">
                                        <Terminal className="w-10 h-10 text-amber-500" />
                                        <div className="absolute inset-0 rounded-3xl border border-amber-500/50 animate-ping opacity-20" />
                                    </div>
                                </div>
                                <div className="space-y-3 mb-8 text-center">
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] italic">{statusText}</h3>
                                    <div className="text-4xl font-mono font-black text-amber-500 italic">{Math.round(overallProgress)}%</div>
                                </div>
                                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-[1px]">
                                    <div className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out" style={{ width: `${overallProgress}%` }} />
                                </div>
                                <div className="mt-8 text-[7px] font-mono text-zinc-600 uppercase tracking-[0.4em] animate-pulse">
                                  ESTABLISHING_SECURE_HANDSHAKE...
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                }
            `}</style>
        </div>
    );
};
