import ru from "./locales/ru.js";
import en from "./locales/en.js";
import kk from "./locales/kk.js";
import zh from "./locales/zh.js";

export const LOCALES = {
  ru,
  en,
  kk,
  zh,
};

export const LOCALE_CODES = ["ru", "en", "kk", "zh"];
export const DEFAULT_LOCALE = "ru";
export const STORAGE_KEY = "tmk_lang";

export const FORMAT_KEYS = ["office", "serviced", "turnkey", "unknown"];

export function isLocale(code) {
  return LOCALE_CODES.includes(code);
}

export function detectLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isLocale(saved)) return saved;
  } catch { /* ignore */ }
  const nav = (navigator.language || "").slice(0, 2).toLowerCase();
  if (isLocale(nav)) return nav;
  return DEFAULT_LOCALE;
}
