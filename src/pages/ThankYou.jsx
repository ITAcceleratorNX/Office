import { useEffect } from "react";
import { go } from "../navigation.js";
import { Ic } from "../components/ui-core.jsx";
import { useI18n } from "../i18n/I18nContext.jsx";
import { useTMK } from "../hooks/useTMK.js";

export function ThankYou() {
  const { t } = useI18n();
  const { waLink, WA_TEXT } = useTMK();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="ty-wrap">
      <span className="glow" />
      <div className="ty-card">
        <div className="ty-check">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1>{t("thankYou.title")}</h1>
        <p>{t("thankYou.text")}</p>
        <div className="ty-actions">
          <a className="btn btn-primary btn-lg" onClick={() => go("/")}>{t("common.backHome")}</a>
          <a className="btn btn-light btn-lg" href={waLink(WA_TEXT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} {t("common.writeWhatsapp")}</a>
        </div>
      </div>
    </div>
  );
}
