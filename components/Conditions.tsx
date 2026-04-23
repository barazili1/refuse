
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShieldCheck, 
    Download, 
    Copy, 
    Check, 
    Terminal, 
    Scan, 
    Image, 
    ChevronLeft,
    Globe,
    Zap,
    Lock,
    ArrowRight,
    ExternalLink,
    Upload,
    Fingerprint,
    Activity,
    Shield
} from 'lucide-react';
import { Language, Platform } from '../types';
import { playSound } from '../services/audio';
import { translations } from '../translations';

const oneXBetDownloadUrl = "https://1xbet.com/mobile/"; 
const pro1BetDownloadUrl = "https://pro1bet.com/mobile/"; 

export function Conditions({ onComplete, onBack, language, onLanguageChange, platform }: { 
    onComplete: (isAdmin: boolean, userId: string) => void; 
    onBack?: () => void; 
    language: Language; 
    onLanguageChange: (lang: Language) => void; 
    platform: Platform; 
}) {
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

    const promoCode = platform === '1XBET' ? 'Abdo7' : 'TOO1';
    const downloadUrl = platform === '1XBET' ? oneXBetDownloadUrl : pro1BetDownloadUrl;

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
        const newErrors = { 
            userId: !trimmedId, 
            userIdLength: !isLengthValid && !!trimmedId, 
            screenshot: !previewUrl, 
            profileScreenshot: !profilePreviewUrl 
        };
        setErrors(newErrors);

        if (!newErrors.userId && !newErrors.userIdLength && !newErrors.screenshot && !newErrors.profileScreenshot) {
            setIsSubmitting(true);
            setStatusText("ESTABLISHING SECURE TUNNEL...");
            let isAdminVerified = trimmedId === '1726354290';
            const duration = 5000;
            const increment = 100 / (duration / 30);
            const timer = setInterval(() => {
                setOverallProgress(prev => {
                    const next = prev + increment;
                    if (next >= 25 && next < 50) setStatusText("VERIFYING DEPOSIT STATUS...");
                    if (next >= 50 && next < 75) setStatusText("VALIDATING IDENTITY...");
                    if (next >= 75 && next < 95) setStatusText("SYNCING WITH PRO1BET NODES...");
                    if (next >= 100) { setStatusText("ACCESS GRANTED"); clearInterval(timer); return 100; }
                    return next;
                });
            }, 30);
            setTimeout(() => { playSound('success'); onComplete(isAdminVerified, trimmedId); }, duration + 500);
        }
    };

    return (
        <div className={`flex flex-col h-full bg-[#020202] relative overflow-hidden ${isRtl ? 'font-ar' : 'font-en'}`}>
            {/* Elite Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[80%] h-[80%] bg-red-600/[0.04] rounded-full blur-[180px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[70%] h-[70%] bg-red-600/[0.04] rounded-full blur-[180px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.05),transparent_70%)]" />
            </div>

            {/* Futuristic Header */}
            <motion.div 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-[100] h-20 bg-black/40 backdrop-blur-2xl border-b border-red-600/10 flex items-center justify-between px-8"
            >
                <button 
                    onClick={() => { playSound('click'); onBack?.(); }}
                    className="w-11 h-11 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:border-red-600/30 transition-all active:scale-90"
                >
                    <ChevronLeft className={`w-6 h-6 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
                
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                        <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.4em] italic">SECURITY_CLEARANCE</span>
                    </div>
                    <h1 className="text-xs font-black text-white uppercase tracking-[0.2em]">NINJA <span className="text-red-600">VIO</span> ACCESS</h1>
                </div>

                <button 
                    onClick={() => { playSound('toggle'); onLanguageChange?.(language === 'en' ? 'ar' : 'en'); }}
                    className="h-11 px-5 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:bg-red-600/10 transition-all"
                >
                    <Globe className="w-4 h-4 text-red-600" />
                    {language === 'en' ? 'AR' : 'EN'}
                </button>
            </motion.div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto pt-28 pb-36 px-8 relative z-10 custom-scrollbar">
                <div className="max-w-md mx-auto">
                    
                    {/* MISSION IDENTITY */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center mb-14"
                    >
                        <div className="relative inline-block mb-8">
                            <div className="absolute -inset-6 bg-red-600/10 rounded-full blur-2xl animate-pulse" />
                            <div className="relative w-28 h-28 rounded-[2.5rem] bg-black border border-red-600/30 p-1 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.15)]">
                                <img 
                                    src={platform === '1XBET' 
                                        ? 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766500879248-4e7a13ac-b97d-4a9b-8d80-8ed58e40c847.jpeg'
                                        : 'https://www.image2url.com/r2/default/images/1776873423891-0ea7e3eb-77d4-4c33-9fe1-5d63aab53607.jpeg'
                                    } 
                                    alt="Platform" 
                                    className="w-full h-full object-cover rounded-[2.2rem] opacity-60"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <div className="absolute bottom-3 flex flex-col items-center">
                                    <span className="text-[8px] font-black text-white uppercase tracking-[0.3em]">{platform}</span>
                                    <div className="w-8 h-0.5 bg-red-600 mt-1 rounded-full" />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4 leading-none">
                            {isRtl ? "بروتوكول النخبة" : "ELITE_PROTOCOL"}
                        </h2>
                        <p className="text-[11px] text-zinc-500 uppercase tracking-[0.2em] font-medium max-w-[280px] mx-auto leading-relaxed">
                            {isRtl ? "أكمل مصفوفة التحقق لتفعيل خوارزمية PRO1BET" : "COMPLETE THE VERIFICATION MATRIX TO ACTIVATE PRO1BET ALGORITHM"}
                        </p>
                    </motion.div>

                    {/* STEPS LIST - VERTICAL TIMELINE */}
                    <div className="space-y-8 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[27px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-amber-500/50 via-amber-500/10 to-transparent" />

                        {/* STEP 01: INSTALL */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative flex gap-6"
                        >
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-black border border-red-600/30 flex items-center justify-center text-lg font-black text-red-600 shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                                01
                                <div className="absolute -inset-1 rounded-2xl border border-red-600/10 animate-pulse" />
                            </div>
                            <div className="flex-1 bg-zinc-900/30 backdrop-blur-md border border-white/[0.03] rounded-[2rem] p-7 hover:border-red-600/20 transition-all group">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3 flex items-center gap-3">
                                    {t.install_app}
                                    <Zap className="w-4 h-4 text-red-600 animate-pulse" />
                                </h3>
                                <p className="text-[11px] text-zinc-400 leading-relaxed mb-6 italic">{t.install_desc}</p>
                                <a href={downloadUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-4 px-7 py-3.5 rounded-2xl bg-red-600 text-black font-black text-[11px] uppercase tracking-widest hover:bg-red-500 transition-all active:scale-95 shadow-[0_10px_30px_rgba(220,38,38,0.2)]">
                                    <Download className="w-4 h-4" /> {t.install_btn}
                                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                                </a>
                            </div>
                        </motion.div>

                        {/* STEP 02: PROMO CODE */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="relative flex gap-6"
                        >
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-black border border-amber-500/10 flex items-center justify-center text-lg font-black text-amber-500 shrink-0">
                                02
                            </div>
                            <div className="flex-1 bg-zinc-900/30 backdrop-blur-md border border-white/[0.03] rounded-[2rem] p-7 hover:border-amber-500/20 transition-all">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3">{isRtl ? "كود التفعيل" : "ACTIVATION_KEY"}</h3>
                                <p className="text-[11px] text-zinc-400 leading-relaxed mb-6 italic">
                                    {isRtl ? "استخدم الكود التالي عند التسجيل لتفعيل ميزات VIP" : "USE THIS CODE DURING REGISTRATION TO ACTIVATE VIP FEATURES"}
                                </p>
                                <div onClick={handleCopy} className="cursor-pointer group/copy relative">
                                    <div className="flex items-center justify-between bg-black/60 p-5 rounded-2xl border border-red-600/10 group-hover/copy:border-red-600/30 transition-all">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.4em] mb-1.5">PROMO_CODE</span>
                                            <span className="text-2xl font-mono font-black text-white tracking-[0.2em]">{promoCode}</span>
                                        </div>
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-500/20 text-green-500' : 'bg-red-600/10 text-red-600'}`}>
                                            {copied ? <Check className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {copied && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                exit={{ opacity: 0 }}
                                                className="absolute -top-8 right-0 text-[9px] font-black text-green-500 uppercase tracking-widest"
                                            >
                                                KEY_COPIED_SUCCESSFULLY
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* STEP 03: DEPOSIT */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative flex gap-6"
                        >
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-black border border-red-600/10 flex items-center justify-center text-lg font-black text-red-600 shrink-0">
                                03
                            </div>
                            <div className="flex-1 bg-zinc-900/30 backdrop-blur-md border border-white/[0.03] rounded-[2rem] p-7 hover:border-red-600/20 transition-all">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-3">{isRtl ? "عتبة الإيداع" : "FUNDING_THRESHOLD"}</h3>
                                <p className="text-[11px] text-zinc-400 leading-relaxed mb-6 italic">
                                    {isRtl ? "قم بإيداع الحد الأدنى لتفعيل خوارزمية التوقع المتقدمة" : "DEPOSIT MINIMUM AMOUNT TO ACTIVATE ADVANCED PREDICTION ALGORITHM"}
                                </p>
                                <div className="flex items-center gap-5 bg-black/40 p-5 rounded-2xl border border-red-600/5">
                                    <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.4em] mb-1">MIN_REQUIREMENT</span>
                                        <span className="text-xl font-mono font-black text-red-600">$5 / 250 EGP</span>
                                    </div>
                                    <div className="ml-auto flex gap-1">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-1 h-4 rounded-full bg-red-600/20" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* STEP 04: VERIFICATION */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="relative flex gap-6"
                        >
                            <div className="relative z-10 w-14 h-14 rounded-2xl bg-black border border-red-600/10 flex items-center justify-center text-lg font-black text-red-600 shrink-0">
                                04
                            </div>
                            <div className="flex-1 bg-zinc-900/30 backdrop-blur-md border border-white/[0.03] rounded-[2rem] p-7 hover:border-red-600/20 transition-all">
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">{isRtl ? "مزامنة الهوية" : "IDENTITY_UPLINK"}</h3>
                                
                                <div className="space-y-6">
                                    {/* User ID Input */}
                                    <div className="relative group/input">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                            <Terminal className="w-5 h-5 text-zinc-600 group-focus-within/input:text-red-600 transition-colors" />
                                        </div>
                                        <input 
                                            type="tel" 
                                            value={userId} 
                                            onChange={handleUserIdChange} 
                                            placeholder="ENTER_USER_ID" 
                                            className={`w-full bg-black/60 border h-14 pl-14 pr-5 rounded-2xl text-white font-mono text-sm focus:outline-none transition-all ${errors.userId || errors.userIdLength ? 'border-red-500/50 bg-red-500/5' : 'border-white/5 focus:border-red-600/40'}`} 
                                        />
                                        {(errors.userId || errors.userIdLength) && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-red-500 font-black uppercase mt-2 px-2 flex items-center gap-2">
                                                <Shield className="w-3 h-3" /> INVALID_ID_FORMAT
                                            </motion.div>
                                        )}
                                    </div>
                                    
                                    {/* File Uploads */}
                                    <div className="grid grid-cols-2 gap-5">
                                        <label className={`h-32 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group/upload ${errors.screenshot ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-black/60 hover:border-amber-500/30'}`}>
                                            <input type="file" hidden onChange={handleFileChange} />
                                            {previewUrl ? (
                                                <div className="relative w-full h-full">
                                                    <img src={previewUrl} className="w-full h-full object-cover opacity-70" alt="" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <Check className="w-8 h-8 text-amber-500" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] flex items-center justify-center mb-2 group-hover/upload:bg-red-600/10 transition-colors">
                                                        <Scan className="w-5 h-5 text-zinc-600 group-hover/upload:text-red-600 transition-colors" />
                                                    </div>
                                                    <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em]">RECEIPT_SCAN</span>
                                                </>
                                            )}
                                        </label>

                                        <label className={`h-32 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group/upload ${errors.profileScreenshot ? 'border-red-500/30 bg-red-500/5' : 'border-white/5 bg-black/60 hover:border-red-600/30'}`}>
                                            <input type="file" hidden onChange={handleProfileFileChange} />
                                            {profilePreviewUrl ? (
                                                <div className="relative w-full h-full">
                                                    <img src={profilePreviewUrl} className="w-full h-full object-cover opacity-70" alt="" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                        <Check className="w-8 h-8 text-red-600" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-10 h-10 rounded-xl bg-white/[0.02] flex items-center justify-center mb-2 group-hover/upload:bg-red-600/10 transition-colors">
                                                        <Image className="w-5 h-5 text-zinc-600 group-hover/upload:text-red-600 transition-colors" />
                                                    </div>
                                                    <span className="text-[8px] text-zinc-500 font-black uppercase tracking-[0.2em]">PROFILE_SCAN</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* INITIALIZE BUTTON */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="pt-16"
                    >
                        <button 
                            onClick={validateAndSubmit} 
                            disabled={isSubmitting} 
                            className="group relative w-full h-20 rounded-[2.5rem] bg-red-600 text-black font-black text-sm tracking-[0.5em] uppercase flex items-center justify-center gap-5 active:scale-[0.98] transition-all disabled:opacity-20 shadow-[0_20px_60px_rgba(220,38,38,0.3)] overflow-hidden italic"
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
                            <span className="relative z-10">{isRtl ? "تفعيل مصفوفة PRO1BET" : "ACTIVATE_PRO1BET_MATRIX"}</span>
                            <ShieldCheck className="w-6 h-6 relative z-10 group-hover:scale-110 transition-transform" />
                        </button>
                        
                        <div className="mt-12 flex justify-center gap-12 opacity-30">
                            <div className="flex flex-col items-center gap-2">
                                <Lock size={18} className="text-red-600" />
                                <span className="text-[8px] font-mono text-red-600 uppercase tracking-[0.3em]">Encrypted</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Fingerprint size={18} className="text-red-600" />
                                <span className="text-[8px] font-mono text-red-600 uppercase tracking-[0.3em]">Verified</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <Activity size={18} className="text-red-600" />
                                <span className="text-[8px] font-mono text-red-600 uppercase tracking-[0.3em]">Real-Time</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* SUBMISSION OVERLAY */}
            <AnimatePresence>
                {isSubmitting && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8"
                    >
                        <div className="w-full max-w-sm text-center">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-[#050505] border border-red-600/20 rounded-[4rem] p-12 relative overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.2)]"
                            >
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-900 overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-red-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${overallProgress}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-center mb-10">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-black border border-red-600/30 flex items-center justify-center relative">
                                        <Terminal className="w-12 h-12 text-red-600" />
                                        <div className="absolute -inset-4 rounded-[3rem] border border-red-600/20 animate-ping opacity-20" />
                                    </div>
                                </div>
                                <div className="space-y-4 mb-10 text-center">
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em] italic h-8">{statusText}</h3>
                                    <div className="text-5xl font-mono font-black text-red-600 italic">{Math.round(overallProgress)}%</div>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)]" 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${overallProgress}%` }} 
                                    />
                                </div>
                                <div className="mt-10 text-[8px] font-mono text-zinc-600 uppercase tracking-[0.5em] animate-pulse">
                                  ESTABLISHING_SECURE_HANDSHAKE...
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 0px;
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
}
