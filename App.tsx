
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppleGame } from './components/AppleGame';
import { SplashScreen } from './components/SplashScreen';
import { SelectionScreen } from './components/SelectionScreen';
import { Conditions } from './components/Conditions';
import { GameSelection } from './components/GameSelection';
import { CrashGame } from './components/CrashGame';
import { ViewState, AccessKey, Language, Platform } from './types';
import { playSound } from './services/audio';

export function App() {
  const [isBooting, setIsBooting] = useState(true);
  
  const [platform, setPlatform] = useState<Platform>(() => {
    try {
      return (localStorage.getItem('selected_platform') as Platform) || '1XBET';
    } catch { return '1XBET'; }
  });

  const [accessKeyData, setAccessKeyData] = useState<AccessKey | null>(() => {
      try {
          const saved = localStorage.getItem('access_key_data');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.key) return parsed;
          }
      } catch (e) { 
        console.warn("Storage reading error, using default guest ID"); 
      }
      
      return {
        key: '8963007529',
        isActive: true,
        type: 'SESSION',
        createdAt: Date.now(),
        isAdminMode: false
      };
  });

  // Keep localStorage in sync with current state
  useEffect(() => {
    if (accessKeyData) {
      try {
        localStorage.setItem('access_key_data', JSON.stringify(accessKeyData));
      } catch (e) {
        console.error("Failed to persist ID", e);
      }
    }
  }, [accessKeyData]);

  const [view, setView] = useState<ViewState>(() => {
    try {
        const saved = localStorage.getItem('selected_platform');
        // If they already picked a platform, jump to the game selection, else selection
        return saved ? 'GAME_SELECTION' : 'SELECTION';
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
    setView('GAME_SELECTION');
  };

  const handleSignOut = () => {
    playSound('click');
    localStorage.removeItem('selected_platform');
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

    if (view === 'GAME_SELECTION') {
        return (
            <GameSelection 
                platform={platform} 
                language={language} 
                onLanguageChange={handleLanguageChange} 
                onSelect={(v) => setView(v)}
                onBack={() => setView('CONDITIONS')}
            />
        );
    }

    if (view === 'CRASH') {
        return (
            <CrashGame 
                onBack={() => setView('GAME_SELECTION')} 
                accessKeyData={accessKeyData} 
                language={language} 
                onLanguageChange={handleLanguageChange} 
                platform={platform} 
            />
        );
    }

    return <AppleGame 
      onBack={() => setView('GAME_SELECTION')} 
      accessKeyData={accessKeyData} 
      language={language} 
      onLanguageChange={handleLanguageChange} 
      platform={platform} 
    />;
  };

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-red-500/30 overflow-hidden relative ${language === 'ar' ? 'font-ar' : 'font-en'}`}>
      <AnimatePresence mode="wait">
        {isBooting ? (
          <SplashScreen key="splash" language={language} onComplete={() => setIsBooting(false)} />
        ) : (
          <motion.div 
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto relative flex flex-col min-h-screen bg-transparent z-10"
          >
            <AnimatePresence mode="wait">
                <motion.div key={view} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: "easeOut" }} className="flex-1 flex flex-col">
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
