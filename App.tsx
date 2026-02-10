
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppleGame } from './components/AppleGame';
import { SplashScreen } from './components/SplashScreen';
import { SelectionScreen } from './components/SelectionScreen';
import { Conditions } from './components/Conditions';
import { ViewState, AccessKey, Language, Platform } from './types';
import { translations } from './translations';
import { playSound } from './services/audio';

const MotionDiv = motion.div as any;

export const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  
  const [platform, setPlatform] = useState<Platform>(() => {
    try {
      return (localStorage.getItem('selected_platform') as Platform) || '1XBET';
    } catch { return '1XBET'; }
  });

  const [accessKeyData, setAccessKeyData] = useState<AccessKey | null>(() => {
      try {
          const saved = localStorage.getItem('access_key_data');
          return saved ? JSON.parse(saved) : {
            key: 'GUEST_000',
            isActive: true,
            type: 'SESSION',
            createdAt: Date.now(),
            isAdminMode: false
          };
      } catch { 
          return {
            key: 'GUEST_000',
            isActive: true,
            type: 'SESSION',
            createdAt: Date.now(),
            isAdminMode: false
          }; 
      }
  });

  // Persist accessKeyData changes
  useEffect(() => {
    if (accessKeyData) {
      localStorage.setItem('access_key_data', JSON.stringify(accessKeyData));
    }
  }, [accessKeyData]);

  const [view, setView] = useState<ViewState>(() => {
    try {
        const saved = localStorage.getItem('selected_platform');
        return saved ? 'APPLE' : 'SELECTION';
    } catch { return 'SELECTION'; }
  });

  const [language, setLanguage] = useState<Language>(() => {
      try { return (localStorage.getItem('app_language') as Language) || 'en'; } catch { return 'en'; }
  });

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const handlePlatformSelect = (p: Platform) => {
    setPlatform(p);
    localStorage.setItem('selected_platform', p);
    setView('CONDITIONS');
  };

  const handleConditionsComplete = (isAdmin: boolean, userId: string) => {
    setAccessKeyData({
      key: userId,
      isActive: true,
      type: 'VERIFIED',
      createdAt: Date.now(),
      isAdminMode: isAdmin
    });
    setView('APPLE');
  };

  const handleSignOut = () => {
    playSound('click');
    localStorage.removeItem('selected_platform');
    // We keep the accessKeyData so the ID persists unless explicitly reset
    setView('SELECTION');
  };

  const renderContent = () => {
    if (view === 'SELECTION') {
      return <SelectionScreen onSelect={handlePlatformSelect} language={language} onLanguageChange={handleLanguageChange} />;
    }

    if (view === 'CONDITIONS') {
      return (
        <Conditions 
          platform={platform} 
          language={language} 
          onLanguageChange={handleLanguageChange} 
          onComplete={handleConditionsComplete}
          onBack={() => setView('SELECTION')}
        />
      );
    }

    return <AppleGame 
      onBack={handleSignOut} 
      accessKeyData={accessKeyData} 
      language={language} 
      onLanguageChange={handleLanguageChange} 
      platform={platform} 
    />;
  };

  return (
    <div className={`min-h-screen bg-[#050505] text-white selection:bg-red-500/30 ${language === 'ar' ? 'font-ar' : 'font-en'}`}>
      <AnimatePresence mode="wait">
        {isBooting ? (
          <SplashScreen key="splash" language={language} onComplete={() => setIsBooting(false)} />
        ) : (
          <MotionDiv 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto relative flex flex-col min-h-screen bg-[#050505]"
          >
            <AnimatePresence mode="wait">
                <MotionDiv key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
                    {renderContent()}
                </MotionDiv>
            </AnimatePresence>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};
