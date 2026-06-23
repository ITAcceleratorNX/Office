import { useState, useEffect, useRef, Children } from "react";
import { Ic } from "./ui-core.jsx";
import { useMatchMedia } from "../hooks/useMatchMedia.js";

const MOBILE_MQ = "(max-width: 660px)";

export function CardsCarousel({ children, className = "", resetKey }) {
  const mobile = useMatchMedia(MOBILE_MQ);
  const slides = Children.toArray(children);
  const [index, setIndex] = useState(0);
  const touchX = useRef(null);

  useEffect(() => {
    setIndex(0);
  }, [resetKey, slides.length]);

  const gridClass = ("cards-grid" + (className ? " " + className : "")).trim();

  if (!mobile) {
    return <div className={gridClass}>{children}</div>;
  }

  const last = Math.max(0, slides.length - 1);
  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(last, i + 1));

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (dx > 48) prev();
    else if (dx < -48) next();
  };

  return (
    <div className={"cards-carousel" + (className ? " " + className : "")}>
      <div
        className="cards-carousel-viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="cards-carousel-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className="cards-carousel-slide" key={slide.key ?? i}>
              {slide}
            </div>
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="cards-carousel-nav" aria-live="polite">
          <button
            type="button"
            className="cards-carousel-btn cards-carousel-btn--prev"
            onClick={prev}
            disabled={index === 0}
            aria-label="Предыдущий объект"
          >
            <span className="cards-carousel-btn-ic cards-carousel-btn-ic--prev">{Ic.arrow({ s: 18 })}</span>
          </button>
          <span className="cards-carousel-meta">{index + 1} / {slides.length}</span>
          <button
            type="button"
            className="cards-carousel-btn cards-carousel-btn--next"
            onClick={next}
            disabled={index === last}
            aria-label="Следующий объект"
          >
            <span className="cards-carousel-btn-ic">{Ic.arrow({ s: 18 })}</span>
          </button>
        </div>
      )}
    </div>
  );
}
