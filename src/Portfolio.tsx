import { useCallback, useEffect, useRef, useState } from "react";
import "./Portfolio.css";
import FadeUp from "./FadeUp";
import ContactSection from "./ContactSection";
import { portfolioPhotos } from "./portfolioPhotos";

/** Tells the grid how wide a thumbnail actually renders, so the browser can
 *  pick the smallest candidate that still looks sharp. Mirrors Portfolio.css. */
const GRID_SIZES =
  "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, (max-width: 1400px) 33vw, 440px";

function Lightbox({
  index,
  onClose,
  onStep,
}: {
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const photo = portfolioPhotos[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Move focus into the dialog on open, and keep Tab from escaping it.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onStep(1);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onStep(-1);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, onStep]);

  // Stop the page behind the overlay from scrolling.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${portfolioPhotos.length}`}
      ref={dialogRef}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <button ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Close photo">
        &times;
      </button>

      <button
        className="lightbox-nav lightbox-prev"
        onClick={() => onStep(-1)}
        aria-label="Previous photo"
      >
        &#8249;
      </button>

      <figure className="lightbox-figure">
        <img src={photo.full} alt={photo.alt} width={photo.width} height={photo.height} />
        <figcaption>
          {index + 1} / {portfolioPhotos.length}
        </figcaption>
      </figure>

      <button
        className="lightbox-nav lightbox-next"
        onClick={() => onStep(1)}
        aria-label="Next photo"
      >
        &#8250;
      </button>
    </div>
  );
}

/** The portfolio as a view within the single page. App owns the nav and the
 *  footer, so this renders only what changes: header, grid, lightbox, CTA.
 *  `onGoHome` switches back to the home view and scrolls to a section there. */
export default function PortfolioView({ onGoHome }: { onGoHome: (id: string) => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Where to send focus back to once the lightbox closes.
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastTrigger = useRef<number | null>(null);

  const open = (i: number) => {
    lastTrigger.current = i;
    setOpenIndex(i);
  };

  const close = useCallback(() => {
    setOpenIndex(null);
    const i = lastTrigger.current;
    if (i !== null) triggerRefs.current[i]?.focus();
  }, []);

  const step = useCallback((delta: number) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      const total = portfolioPhotos.length;
      const next = (current + delta + total) % total;
      lastTrigger.current = next;
      return next;
    });
  }, []);

  const hasPhotos = portfolioPhotos.length > 0;

  return (
    <>
      <main>
        {/* Header */}
        <header className="portfolio-header">
          <div className="portfolio-header-inner">
            <FadeUp>
              <div className="section-label">Our Work</div>
            </FadeUp>
            <FadeUp>
              <h1>
                Food that looks<br />as good as it <em>tastes</em>.
              </h1>
            </FadeUp>
            <FadeUp>
              <p>
                Every plate, every room, every detail — shot on location at the
                restaurants we work with across the Bay Area and beyond. This is the
                work we make for our clients, straight out of the kitchen.
              </p>
            </FadeUp>
            <FadeUp>
              <button
                className="btn-primary portfolio-header-cta"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                Work With Us →
              </button>
            </FadeUp>
          </div>
        </header>

        {/* Grid */}
        <section className="portfolio-grid-section" aria-label="Photo gallery">
          {hasPhotos ? (
            <>
              <ul className="portfolio-grid">
                {portfolioPhotos.map((photo, i) => (
                  <li key={photo.slug} className="portfolio-tile">
                    <button
                      ref={(el) => { triggerRefs.current[i] = el; }}
                      className="portfolio-tile-btn"
                      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                      onClick={() => open(i)}
                      aria-label={`Open photo ${i + 1} of ${portfolioPhotos.length} — ${photo.alt}`}
                    >
                      <picture>
                        <source type="image/webp" srcSet={photo.srcSet} sizes={GRID_SIZES} />
                        <img
                          src={photo.fallback}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          loading={i < 4 ? "eager" : "lazy"}
                          decoding="async"
                        />
                      </picture>
                      <span className="portfolio-tile-zoom" aria-hidden="true">View</span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="portfolio-count">
                {portfolioPhotos.length} photos from our client work.
              </p>
            </>
          ) : (
            /* Shown when the photo set has not been imported yet, so the page
               degrades to an honest message instead of a grid of broken images.
               Populate it with: npm run import-portfolio */
            <div className="portfolio-empty">
              <h2>Our gallery is being updated.</h2>
              <p>
                We&rsquo;re putting together a fresh set of our latest restaurant work.
                In the meantime, the{" "}
                <button className="portfolio-empty-link" onClick={() => onGoHome("gallery")}>
                  highlights are on our home page
                </button>,
                and there is plenty more on{" "}
                <a href="https://www.instagram.com/itsjackandannie" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>.
              </p>
            </div>
          )}
        </section>

        {/* The same contact block the home view ends on, so a visitor who has
            just scrolled the whole gallery can write to us without leaving it. */}
        <ContactSection />
      </main>

      {openIndex !== null && (
        <Lightbox index={openIndex} onClose={close} onStep={step} />
      )}
    </>
  );
}
