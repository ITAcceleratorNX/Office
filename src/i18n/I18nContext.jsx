import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createTranslator } from "./translate.js";
import {
  DEFAULT_LOCALE, LOCALES, LOCALE_CODES, STORAGE_KEY, detectLocale, isLocale,
} from "./index.js";

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(detectLocale);

  const setLang = useCallback((next) => {
    if (!isLocale(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => createTranslator(LOCALES[lang] || LOCALES[DEFAULT_LOCALE]), [lang]);

  const value = useMemo(() => ({
    lang,
    setLang,
    t,
    locales: LOCALE_CODES.map((code) => ({
      code,
      label: LOCALES[code].meta.label,
    })),
  }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
