import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

// Import images
import heroImg from "./assets/marketing pictures/bayarea10.jpg";
import gallery1 from "./assets/marketing pictures/bayarea3.jpg";
import gallery2 from "./assets/marketing pictures/bayarea5.jpg";
import gallery3 from "./assets/marketing pictures/bayarea7.jpg";
import gallery4 from "./assets/marketing pictures/bayarea9.jpg";
import gallery5 from "./assets/marketing pictures/bayarea1.jpg";
import gallery6 from "./assets/marketing pictures/bayarea12.jpg";
import gallery7 from "./assets/marketing pictures/bayarea14.jpg";
import gallery8 from "./assets/marketing pictures/bayarea16.jpg";
import gallery9 from "./assets/marketingSpread/DSCF2249.JPG";
import gallery10 from "./assets/marketingSpread/earlGrey.JPG";
import gallery11 from "./assets/marketing pictures/japan1.jpg";
import gallery12 from "./assets/marketing pictures/socal1.jpg";

// Logo SVG component using their miso mascot colors
function MisoLogo({ size = 38 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="30" cy="30" r="22" stroke="#1E2A5E" strokeWidth="4" fill="none" />
      <line x1="12" y1="48" x2="38" y2="10" stroke="#E8303F" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="16" y1="52" x2="42" y2="14" stroke="#E8303F" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

// Intersection observer hook
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeUp({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useFadeUp();
  return (
    <div ref={ref} className={`fade-up ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  );
}

// Smooth scroll helper
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const marqueeItems = [
  "Social Media Marketing", "Food Photography", "Video Production",
  "Influencer Outreach", "Ad Marketing", "Graphic Design",
  "Event Planning", "Brand Strategy",
];

const galleryImages = [
  { src: gallery1, label: "Bay Area", cls: "tall" },
  { src: gallery2, label: "Food Photography", cls: "" },
  { src: gallery3, label: "Restaurant Content", cls: "" },
  { src: gallery4, label: "Bay Area Eats", cls: "wide" },
  { src: gallery5, label: "Plating", cls: "" },
  { src: gallery6, label: "Ambiance", cls: "tall" },
  { src: gallery7, label: "Close-up", cls: "" },
  { src: gallery8, label: "Presentation", cls: "" },
  { src: gallery9, label: "Portrait", cls: "" },
  { src: gallery10, label: "Drinks", cls: "" },
  { src: gallery11, label: "Japan", cls: "wide" },
  { src: gallery12, label: "SoCal", cls: "" },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const navClick = (id: string) => {
    setMenuOpen(false);
    scrollTo(id);
  };

  return (
    <>
      {/* Preloader */}
      <div className={`preloader ${loaded ? "hidden" : ""}`}>
        <div style={{ textAlign: "center" }}>
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="22" stroke="#E8303F" strokeWidth="4" fill="none"
              strokeDasharray="138" strokeDashoffset="138" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" values="138;0" dur="1s" fill="freeze" />
            </circle>
            <line x1="12" y1="48" x2="38" y2="10" stroke="#E8303F" strokeWidth="3.5" strokeLinecap="round" opacity="0">
              <animate attributeName="opacity" values="0;1" dur=".3s" begin=".5s" fill="freeze" />
            </line>
            <line x1="16" y1="52" x2="42" y2="14" stroke="#E8303F" strokeWidth="3.5" strokeLinecap="round" opacity="0">
              <animate attributeName="opacity" values="0;1" dur=".3s" begin=".6s" fill="freeze" />
            </line>
          </svg>
        </div>
      </div>

      {/* Nav */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a className="nav-brand" href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <MisoLogo />
          <span>Miso Marketing</span>
        </a>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><a onClick={() => navClick("gallery")}>Portfolio</a></li>
          <li><a onClick={() => navClick("about")}>About</a></li>
          <li><a onClick={() => navClick("why")}>Why Us</a></li>
          <li><a onClick={() => navClick("pricing")}>Pricing</a></li>
          <li><a className="nav-cta" onClick={() => navClick("contact")}>Get Started</a></li>
        </ul>
        <button className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grain" />
        <div className="hero-content">
          <div className="hero-text">
            <div className="section-label">Bay Area · San Jose, CA</div>
            <h1>Let us <em>cook</em><br />so you can cook.</h1>
            <div className="hero-stats">
              <div>
                <span className="stat-num">200+</span>
                <span className="stat-label">Restaurants Served</span>
              </div>
              <div>
                <span className="stat-num">4+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div>
                <span className="stat-num">1M</span>
                <span className="stat-label">Monthly Views</span>
              </div>
            </div>
            <p>
              Jack & Annie built Miso Marketing from a passion for saving restaurants.
              Now we turn food businesses into social media destinations — photography,
              video, strategy, and everything in between.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => scrollTo("pricing")}>
                See Our Plans →
              </button>
              <button className="btn-secondary" onClick={() => scrollTo("about")}>
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-wrapper">
              <img src={heroImg} alt="Miso Marketing food photography" loading="eager" />
            </div>
            <div className="hero-badge">
              <span className="stat-num">500K+</span>
              <span className="stat-label">Monthly Views</span>
            </div>
            <div className="hero-float-card">
              <span>Instagram Growth</span>
              <span className="float-views">11K Followers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span className="marquee-item" key={i}>
              <span className="marquee-dot" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <section className="gallery" id="gallery">
        <FadeUp>
          <div className="section-label" style={{ justifyContent: "center" }}>Our Work</div>
        </FadeUp>
        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div className={`gallery-item ${img.cls}`} key={i}>
              <img src={img.src} alt={img.label} loading="lazy" />
              <div className="gallery-overlay">
                <span>{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="about" id="about">
        <FadeUp><div className="section-label">Who We Are</div></FadeUp>
        <div className="about-grid">
          <div className="about-text">
            <FadeUp>
              <h2>Two foodies who turned a pandemic passion into a career.</h2>
            </FadeUp>
            <FadeUp>
              <p>
                We started Miso Marketing during COVID with one mission: save our favorite
                restaurants from closing. What began as helping local Bay Area spots stay
                alive on social media became a full-scale marketing agency serving 200+
                restaurants worldwide.
              </p>
            </FadeUp>
            <FadeUp>
              <p>
                With 7 years of photography, videography, and design experience plus 4
                years deep in social media strategy — we don't just make pretty content.
                We make content that fills seats.
              </p>
            </FadeUp>
          </div>
          <div className="about-features">
            {[
              { icon: "📸", title: "Photography & Video", desc: "7 years of professional food photography and videography that makes people stop scrolling." },
              { icon: "📱", title: "Social Strategy", desc: "Data-driven posting with monthly insights. We don't guess — we measure and optimize." },
              { icon: "🤝", title: "Influencer Network", desc: "We coordinate collaborations and outreach with influencers to maximize your reach." },
              { icon: "📊", title: "Ad Marketing", desc: "Strategized campaigns targeted to your local audience for maximum exposure and ROI." },
            ].map((f, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="about-feature">
                  <div className="about-feature-icon">{f.icon}</div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="why" id="why">
        <div className="why-bg" />
        <div className="why-inner">
          <FadeUp><div className="section-label">Why Miso Marketing</div></FadeUp>
          <FadeUp><h2>Go from unknown to viral in a matter of months.</h2></FadeUp>
          <div className="why-cards">
            {[
              {
                num: "01", title: "Boost Your Presence",
                desc: "In the heart of Silicon Valley, your audience is on social media several times a day. One mouthwatering video or eye-catching photo is all it takes to bring new customers through your door.",
              },
              {
                num: "02", title: "Strategy & Purpose",
                desc: "We don't just post content and call it a day. Every photo, reel, collaboration, and ad is set up with intent for growth and maximized exposure. Monthly insights keep you informed.",
              },
              {
                num: "03", title: "One Monthly Payment",
                desc: "Content creation, social media management, influencer coordination, ad strategy — all handled. We turned our passion into our career so you can focus on what you do best: cooking.",
              },
            ].map((c, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="why-card">
                  <span className="why-card-num">{c.num}</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="pricing">
        <FadeUp>
          <div className="section-label" style={{ justifyContent: "center" }}>Our Plans</div>
        </FadeUp>
        <FadeUp><h2>Simple pricing, serious results.</h2></FadeUp>
        <FadeUp>
          <p>From a single collaboration to full-service management — pick the plan that fits your restaurant.</p>
        </FadeUp>
        <div className="pricing-grid">
          {[
            {
              tag: "One-Time", price: "$200", period: "per post",
              contract: "No contract required", featured: false,
              items: [
                "1 post on our influencer IG & TikTok",
                "Carousel post or video reel",
                "Story posts included",
                "In-person photo & video shoot (~1hr)",
                "3+ hours of professional editing",
              ],
              cta: "Book a Collab",
            },
            {
              tag: "Standard Photo", price: "$500", period: "per month",
              contract: "Min. 3 month contract", featured: false,
              items: [
                "Influencer outreach & coordination",
                "2 posts on FB & IG per week",
                "Carousel photo posts + stories",
                "Ad marketing with targeting strategy",
                "2 in-person photo shoots/month (~3hrs)",
                "6+ hours of editing",
              ],
              cta: "Get Started",
            },
            {
              tag: "Most Popular", price: "$1,000", period: "per month",
              contract: "Min. 3 month contract", featured: true,
              items: [
                "Influencer outreach & coordination",
                "2 posts on FB & IG per week",
                "Photo posts, video reels & stories",
                "Ad marketing with targeting strategy",
                "Monthly insights & consulting",
                "3 photo + video shoots/month (~8hrs)",
                "15+ hours of editing",
              ],
              cta: "Get Started",
            },
            {
              tag: "Premium", price: "$1,500", period: "per month",
              contract: "Min. 3 month contract", featured: false,
              items: [
                "Influencer outreach & event planning",
                "3 posts on FB & IG per week",
                "Photos, reels, stories & graphic design",
                "Menu design, flyers & more",
                "Ad marketing with full strategy",
                "On-call shoots 3+ times/month (~10hrs)",
                "20+ hours of editing",
              ],
              cta: "Get Started",
            },
          ].map((plan, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className={`pricing-card ${plan.featured ? "featured" : ""}`}>
                <span className="pricing-tag">{plan.tag}</span>
                <div className="pricing-price">{plan.price}</div>
                <div className="pricing-period">{plan.period}</div>
                <div className="pricing-contract">{plan.contract}</div>
                <ul className="pricing-list">
                  {plan.items.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
                <button className="pricing-btn" onClick={() => scrollTo("contact")}>
                  {plan.cta}
                </button>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <div className="cta-inner">
          <div className="cta-content">
            <FadeUp>
              <h2>Ready to fill more seats?</h2>
              <p>
                Get in touch with Jack & Annie and let's start turning your restaurant
                into a social media destination.
              </p>
              <div className="contact-form">
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Your name"
                  id="contactName"
                />
                <input
                  type="email"
                  className="contact-input"
                  placeholder="Your email"
                  id="contactEmail"
                />
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Restaurant name"
                  id="contactRestaurant"
                />
                <textarea
                  className="contact-input contact-textarea"
                  placeholder="Tell us about your restaurant and goals..."
                  id="contactMessage"
                  rows={4}
                />
                <button
                  className="cta-btn"
                  onClick={() => {
                    const name = (document.getElementById("contactName") as HTMLInputElement).value;
                    const email = (document.getElementById("contactEmail") as HTMLInputElement).value;
                    const restaurant = (document.getElementById("contactRestaurant") as HTMLInputElement).value;
                    const message = (document.getElementById("contactMessage") as HTMLTextAreaElement).value;
                    const subject = encodeURIComponent(`Inquiry from ${name} — ${restaurant}`);
                    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nRestaurant: ${restaurant}\n\n${message}`);
                    window.location.href = `mailto:misomarketinggroup@gmail.com?subject=${subject}&body=${body}`;
                  }}
                >
                  Send Message →
                </button>
              </div>
              <div className="cta-links">
                <span>📍 San Jose, CA</span>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-inner">
          <div>
            <div className="footer-brand">Miso Marketing</div>
            <p className="footer-desc">
              Bay Area social media marketing for restaurants. Founded by Jack & Annie —
              two foodies on a mission to help restaurants thrive online.
            </p>
          </div>
          <div className="footer-col">
            <h4>Navigate</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("gallery"); }}>Portfolio</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("about"); }}>About</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("why"); }}>Why Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("pricing"); }}>Pricing</a>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("pricing"); }}>Photography</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("pricing"); }}>Video Production</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollTo("pricing"); }}>Influencer Marketing</a>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <a href="https://www.instagram.com/itsjackandannie" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@itsjackandannie" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="mailto:misomarketinggroup@gmail.com">Email Us</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Miso Marketing Group. All rights reserved.
        </div>
      </footer>
    </>
  );
}
