import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { applyTranslations, translateText } from '../utils/i18n';

const STORAGE_KEY = 'storefront-language';

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || 'ar');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';

    const runTranslate = () => applyTranslations(document.body, language);
    runTranslate();

    const observer = new MutationObserver(() => {
      runTranslate();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['placeholder', 'title', 'aria-label'],
    });

    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    dir: language === 'ar' ? 'rtl' : 'ltr',
    t: (key) => translateText(key, language),
  }), [language]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
