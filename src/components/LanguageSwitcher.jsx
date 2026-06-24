import { useI18n } from "../i18n/I18nContext.jsx";

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
    </svg>
  );
}

export function LanguageSwitcher({ compact, showLabel }) {
  const { t, lang, setLang, locales } = useI18n();

  return (
    <div className={"lang-switch" + (compact ? " lang-switch--compact" : "") + (showLabel ? " lang-switch--labeled" : "")}>
      {showLabel && <span className="lang-switch-label">{t("common.language")}</span>}
      <div className="lang-switch-control">
        <span className="lang-switch-icon" aria-hidden="true"><GlobeIcon /></span>
        <select
          className="lang-switch-select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label={t("common.language")}
        >
          {locales.map(({ code, label }) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
