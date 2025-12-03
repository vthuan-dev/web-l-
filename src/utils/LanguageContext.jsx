import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Import translations dynamically
        let translations;
        if (language === 'en') {
          translations = await import('../i18n/en.json');
        } else {
          translations = await import('../i18n/vi.json');
        }
        setTranslations(translations.default || translations);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if error
        if (language !== 'en') {
          try {
            const fallbackTranslations = await import('../i18n/en.json');
            setTranslations(fallbackTranslations.default || fallbackTranslations);
          } catch (fallbackError) {
            console.error('Error loading fallback translations:', fallbackError);
          }
        }
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    return value || key;
  };

  const switchLanguage = (newLang) => {
    if (newLang === 'en' || newLang === 'vi') {
      setLanguage(newLang);
      localStorage.setItem('wizus_language', newLang);
    }
  };

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem('wizus_language');
    if (savedLang && (savedLang === 'en' || savedLang === 'vi')) {
      setLanguage(savedLang);
    }
  }, []);

  const value = {
    language,
    translations,
    t,
    switchLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
