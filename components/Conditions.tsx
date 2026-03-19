
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

const oneXBetDownloadUrl = "https://1xbet.com/mobile/"; 
const melbetDownloadUrl = "https://melbet.com/mobile/"; 

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
        : 'https://pub-35faf01d0bac49249f374189fd3a24d9.r2.dev/images/1766501545744-4b13c58a-2947-489e-b7e5-9c15372aa331.jpg';
    
    const promoCode = platform === '1XBET' ? 'V8S' : 'TOO3';
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
            {/* MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto pt-24 pb-32 px-6 relative z-10 custom-scrollbar">
                <div className="max-w-sm mx-auto">
                    
                    {/* MISSION STATUS HEADER */}
                    <div className="mb-8 flex items-end justify-between border-b border-amber-500/10 pb-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic">MISSION_ACTIVE</span>
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">{isRtl ? "بروتوكول الوصول" : "ACCESS PROTOCOL"}</h2>
                        </div>
                        <div className="text-right">
                            <span className="text-[6px] font-mono text-zinc-500 uppercase block mb-1">UPLINK_STABILITY</span>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className={`w-3 h-1 rounded-full ${i < 4 ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* STEPS LIST */}
                    <div className="space-y-4">
                        
                        {/* STEP 01: INSTALL */}
                        <div className="bg-zinc-900/30 border border-amber-500/10 rounded-2xl p-5 relative overflow-hidden group">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-black text-amber-500 shrink-0">01</div>
                                <div className="flex-1">
                                    <h3 className="text-[11px] font-black text-white uppercase tracking-wider mb-1">{t.install_app}</h3>
                                    <p className="text-[9px] text-zinc-500 italic mb-4">{t.install_desc}</p>
                                    <a href={downloadUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-black font-black text-[9px] uppercase tracking-widest hover:bg-amber-400 transition-colors">
                                        <Download className="w-3 h-3" /> {t.install_btn}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* STEP 02 & 03: PROMO & DEPOSIT */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-900/30 border border-amber-500/10 rounded-2xl p-5">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[10px] font-black text-amber-500 mb-3">02</div>
                                <div onClick={handleCopy} className="cursor-pointer group/copy">
                                    <span className="text-[6px] text-zinc-600 font-black uppercase block mb-1 tracking-widest">PROMO_CODE</span>
                                    <div className="flex items-center justify-between bg-black/40 p-2 rounded-lg border border-amber-500/5 group-hover/copy:border-amber-500/20 transition-all">
                                        <span className="text-sm font-mono font-black text-white">{promoCode}</span>
                                        {copied ? <Check className="w-3 h-3 text-amber-500" /> : <Copy className="w-3 h-3 text-zinc-500" />}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-zinc-900/30 border border-amber-500/10 rounded-2xl p-5">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[10px] font-black text-amber-500 mb-3">03</div>
                                <div className="space-y-1">
                                    <span className="text-[6px] text-zinc-600 font-black uppercase block tracking-widest">MIN_DEPOSIT</span>
                                    <div className="flex justify-between items-center bg-black/40 px-2 py-1 rounded-lg border border-amber-500/5">
                                        <span className="text-[9px] font-mono font-black text-amber-500">$5 / 250 EGP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STEP 04: VERIFICATION */}
                        <div className="bg-zinc-900/30 border border-amber-500/10 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-xs font-black text-amber-500">04</div>
                                <h3 className="text-[11px] font-black text-white uppercase tracking-wider">{t.verify_account}</h3>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="relative">
                                    <input 
                                        type="tel" 
                                        value={userId} 
                                        onChange={handleUserIdChange} 
                                        placeholder="USER_ID" 
                                        className={`w-full bg-black/40 border h-10 px-4 rounded-xl text-white font-mono text-xs focus:outline-none transition-all ${errors.userId ? 'border-amber-500' : 'border-amber-500/10 focus:border-amber-500/30'}`} 
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <label className={`h-20 rounded-xl border border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${errors.screenshot ? 'border-amber-500 bg-amber-500/5' : 'border-amber-500/10 bg-black/40 hover:border-amber-500/20'}`}>
                                        <input type="file" hidden onChange={handleFileChange} />
                                        {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover opacity-60" alt="" /> : <><Scan className="w-4 h-4 text-amber-500/30" /><span className="text-[6px] text-zinc-600 font-black uppercase mt-1">RECEIPT</span></>}
                                    </label>
                                    <label className={`h-20 rounded-xl border border-dashed flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ${errors.profileScreenshot ? 'border-amber-500 bg-amber-500/5' : 'border-amber-500/10 bg-black/40 hover:border-amber-500/20'}`}>
                                        <input type="file" hidden onChange={handleProfileFileChange} />
                                        {profilePreviewUrl ? <img src={profilePreviewUrl} className="w-full h-full object-cover opacity-60" alt="" /> : <><Image className="w-4 h-4 text-amber-500/30" /><span className="text-[6px] text-zinc-600 font-black uppercase mt-1">PROFILE</span></>}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* INITIALIZE BUTTON */}
                    <div className="pt-10">
                        <button 
                            onClick={validateAndSubmit} 
                            disabled={isSubmitting} 
                            className="w-full h-14 rounded-2xl bg-amber-500 text-black font-black text-[11px] tracking-widest uppercase flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-20"
                        >
                            <span>{isRtl ? "تأكيد الوصول" : "INITIALIZE UPLINK"}</span>
                            <ShieldCheck className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* SUBMISSION OVERLAY */}
            <AnimatePresence>
                {isSubmitting && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/98 backdrop-blur-3xl p-8">
                        <div className="w-full max-w-xs text-center">
                            <div className="bg-zinc-950/80 border border-amber-500/20 rounded-[3rem] p-10 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
                                <div className="flex items-center justify-center mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-black border border-amber-500/30 flex items-center justify-center relative">
                                        <Terminal className="w-8 h-8 text-amber-500" />
                                    </div>
                                </div>
                                <div className="space-y-3 mb-8 text-center">
                                    <h3 className="text-[9px] font-black text-white uppercase tracking-[0.3em] italic">{statusText}</h3>
                                    <div className="text-3xl font-mono font-black text-amber-500 italic">{Math.round(overallProgress)}%</div>
                                </div>
                                <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-[1px]">
                                    <div className="h-full bg-amber-500 rounded-full transition-all duration-300 ease-out" style={{ width: `${overallProgress}%` }} />
                                </div>
                                <div className="mt-6 text-[6px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                                  SECURE_HANDSHAKE_IN_PROGRESS...
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
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </div>
    );
};
