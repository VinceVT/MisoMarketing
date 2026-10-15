import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import "./Portfolio.css";
import FadeUp from "./FadeUp";
import MisoLogo from "./MisoLogo";
import { portfolioPhotos } from "./portfolioPhotos";

// Sections on the home page. From here they need the leading slash, otherwise
// a bare "#about" would just look for that id on this page and do nothing.
const homeLinks = [
  { href: "/#about", label: "About" },
  { href: "/#why", label: "Why Us" },
  { href: "/#pricing", label: "Services" },
];

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

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Where to send focus back to once the lightbox closes.
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastTrigger = useRef<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      {/* Nav — same furniture as the home page, pointing back at it. */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a className="nav-brand" href="/">
          <MisoLogo />
          <span>Miso Marketing</span>
        </a>
        <ul id="primary-nav" className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <a href="/portfolio.html" aria-current="page" onClick={() => setMenuOpen(false)}>
              Portfolio
            </a>
          </li>
          {homeLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
            </li>
          ))}
          <li>
            <a className="nav-cta" href="/#contact" onClick={() => setMenuOpen(false)}>
              Get Started
            </a>
          </li>
        </ul>
        <button
          className="nav-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
        >
          <span /><span /><span />
        </button>
      </nav>

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
              <a className="btn-primary portfolio-header-cta" href="/#contact">
                Work With Us →
              </a>
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
                In the meantime, the <a href="/#gallery">highlights are on our home page</a>,
                and there is plenty more on{" "}
                <a href="https://www.instagram.com/itsjackandannie" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>.
              </p>
            </div>
          )}
        </section>

        {/* Closing CTA */}
        <section className="portfolio-cta">
          <FadeUp>
            <h2>Like what you see?</h2>
            <p>
              Let&rsquo;s make your restaurant look this good. Get in touch with Jack &amp; Annie.
            </p>
            <a className="btn-primary" href="/#contact">Get Started →</a>
          </FadeUp>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-brand">Miso Marketing</div>
            <p className="footer-desc">
              Bay Area social media marketing for restaurants. Founded by Jack &amp; Annie —
              two foodies on a mission to help restaurants thrive online.
            </p>
          </div>
          <div className="footer-col">
            <h4>Navigate</h4>
            <a href="/portfolio.html">Portfolio</a>
            <a href="/#about">About</a>
            <a href="/#why">Why Us</a>
            <a href="/#pricing">Services</a>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="https://www.instagram.com/itsjackandannie" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@itsjackandannie" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="mailto:misomarketinggroup@gmail.com">Email Us</a>
          </div>
          <div className="footer-col footer-legal">
            <h4>Legal</h4>
            <a href="/privacy.html">Privacy Policy</a>
            <a href="/terms.html">Terms of Service</a>
            <a href="/accessibility.html">Accessibility</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-disclaimer">
            Photography on this page is our own work, shot for our clients and shown
            with their permission. Please don&rsquo;t reuse it without asking us first.
          </p>
          <p>© 2026 Miso Marketing Group. All rights reserved.</p>
        </div>
      </footer>

      {openIndex !== null && (
        <Lightbox index={openIndex} onClose={close} onStep={step} />
      )}
    </>
  );
}
