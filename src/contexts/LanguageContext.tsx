import React, { createContext, useContext, useState } from 'react';
import { Language } from '@/types';

interface LangContextType {
  lang: Language;
  toggleLang: () => void;
  t: (bn: string, en: string) => string;
}

const LangContext = createContext<LangContextType>({ lang: 'bn', toggleLang: () => {}, t: (bn) => bn });

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('versatile_lang') as Language) || 'bn';
  });

  const toggleLang = () => {
    setLang(l => {
      const next = l === 'bn' ? 'en' : 'bn';
      localStorage.setItem('versatile_lang', next);
      return next;
    });
  };

  const t = (bn: string, en: string) => lang === 'bn' ? bn : en;

  return <LangContext.Provider value={{ lang, toggleLang, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);
