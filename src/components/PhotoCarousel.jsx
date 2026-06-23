import { useCallback, useEffect, useRef, useState } from "react";
import { Ic } from "./ui-core.jsx";

function CarouselImage({ src, alt, eager }) {
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="photo-carousel-img"
    />
  );
}

export function PhotoCarousel({ title, photos = [], fallback }) {
  const slides = photos.length > 0 ? photos : fallback ? [fallback] : [];
  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const viewportRef = useRef(null);
  const thumbsRef = useRef(null);
  const touchX = useRef(null);

  const last = slides.length - 1;
  const hasMany = slides.length > 1;
  const hasGallery = photos.length > 1;

  useEffect(() => {
    setIndex(0);
  }, [title, slides.length]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;

    const update = () => setSlideWidth(node.offsetWidth);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [slides.length]);

  useEffect(() => {
    const el = thumbsRef.current?.querySelector(".photo-carousel-thumb.is-active");
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const goPrev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(() => setIndex((i) => Math.min(last, i + 1)), [last]);

  useEffect(() => {
    if (!hasMany) return undefined;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, hasMany]);

  if (!slides.length) return null;

  const offset = slideWidth > 0 ? index * slideWidth : 0;

  return (
    <section className="section photo-carousel-section">
      <div className="container">
        <div className="photo-carousel-head">
          <span className="eyebrow">{hasGallery ? "Интерьеры" : "Фото объекта"}</span>
          <h2 className="photo-carousel-title">Офисные пространства</h2>
          {hasGallery && (
            <p className="photo-carousel-desc">
              Реальные фото {title} — листайте карусель или выберите миниатюру
            </p>
          )}
        </div>

        <div className="photo-carousel">
          <div
            ref={viewportRef}
            className="photo-carousel-viewport"
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current == null || !hasMany) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (dx > 50) goPrev();
              else if (dx < -50) goNext();
            }}
          >
            <div
              className="photo-carousel-track"
              style={{
                transform: `translate3d(-${offset}px, 0, 0)`,
                width: slideWidth > 0 ? slideWidth * slides.length : undefined,
              }}
            >
              {slides.map((src, i) => (
                <div
                  className="photo-carousel-slide"
                  key={`${src}-${i}`}
                  style={{ width: slideWidth > 0 ? slideWidth : undefined }}
                >
                  <CarouselImage
                    src={src}
                    alt={`${title} — фото ${i + 1}`}
                    eager={i === index || i === index + 1}
                  />
                </div>
              ))}
            </div>

            {hasMany && (
              <>
                <button
                  type="button"
                  className="photo-carousel-arrow photo-carousel-arrow--prev"
                  onClick={goPrev}
                  disabled={index === 0}
                  aria-label="Предыдущее фото"
                >
                  <span className="photo-carousel-arrow-icon photo-carousel-arrow-icon--prev">
                    {Ic.arrow({ s: 20 })}
                  </span>
                </button>
                <button
                  type="button"
                  className="photo-carousel-arrow photo-carousel-arrow--next"
                  onClick={goNext}
                  disabled={index === last}
                  aria-label="Следующее фото"
                >
                  <span className="photo-carousel-arrow-icon">{Ic.arrow({ s: 20 })}</span>
                </button>
                <span className="photo-carousel-badge" aria-live="polite">
                  {index + 1} / {slides.length}
                </span>
              </>
            )}
          </div>

          {hasMany && (
            <>
              <div className="photo-carousel-dots" role="tablist" aria-label="Номер фото">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Фото ${i + 1}`}
                    className={"photo-carousel-dot" + (i === index ? " is-active" : "")}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>

              <div className="photo-carousel-thumbs" ref={thumbsRef} role="tablist" aria-label="Миниатюры">
                {slides.map((src, i) => (
                  <button
                    type="button"
                    key={`thumb-${src}-${i}`}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Фото ${i + 1}`}
                    className={"photo-carousel-thumb" + (i === index ? " is-active" : "")}
                    onClick={() => setIndex(i)}
                  >
                    <CarouselImage src={src} alt="" eager={i === index} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
