import { useEffect } from "react";
import { go } from "../navigation.js";
import { Ic, WA, WT } from "../components/ui-core.jsx";

export function ThankYou() {
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
        <h1>Спасибо! Заявка отправлена</h1>
        <p>Ваша заявка отправлена. Специалист свяжется с вами для уточнения деталей и подберёт подходящие офисные решения.</p>
        <div className="ty-actions">
          <a className="btn btn-primary btn-lg" onClick={() => go("/")}>Вернуться на главную</a>
          <a className="btn btn-light btn-lg" href={WA(WT.general)} target="_blank" rel="noopener">{Ic.wa({ s: 18 })} Написать в WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
