import { useState, useEffect, useCallback } from "react";
import "./App.css";
import FadeUp from "./FadeUp";
import MisoLogo from "./MisoLogo";

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

// Website build tiers. Three one-off builds that step up in scope, plus a
// monthly care plan — a restaurant's real ongoing need is menu and hours
// changes, which is what makes a site go stale when nobody owns it.
// No prices here, matching the marketing plans: every job is quoted.
const webPlans = [
  {
    tag: "One Page", title: "Starter Site",
    contract: "One-time build", featured: false,
    items: [
      "Single-page site, everything in one scroll",
      "Menu, hours, location & contact",
      "Mobile-first and fast on a phone",
      "Google Business Profile set up",
      "Tap-to-call and tap-for-directions",
      "1 round of revisions",
    ],
  },
  {
    tag: "Most Popular", title: "Full Website",
    contract: "One-time build", featured: true,
    items: [
      "Up to 5 pages — home, menu, about, gallery, contact",
      "Reservation and ordering links",
      "Your photography built into the design",
      "Local SEO so you turn up in nearby searches",
      "Instagram feed on the page",
      "2 rounds of revisions",
    ],
  },
  {
    tag: "Premium", title: "Premium Build",
    contract: "One-time build", featured: false,
    items: [
      "Everything in Full Website",
      "Online ordering built in, not just linked",
      "Events, catering & private dining pages",
      "Email signup for your mailing list",
      "Multiple locations supported",
      "Analytics set up so you can see what works",
      "3 rounds of revisions",
    ],
  },
  {
    tag: "Monthly", title: "Care Plan",
    contract: "Month to month, cancel anytime", featured: false,
    items: [
      "Hosting, domain & security certificate handled",
      "Unlimited menu and hours updates",
      "Backups and security monitoring",
      "Monthly report on visitors and clicks",
      "Priority support when something breaks",
      "Add to any build above",
    ],
  },
];

const emptyForm = { name: "", email: "", restaurant: "", message: "" };

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    // Visitors who ask for reduced motion skip the branded loading animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLoaded(true);
      return;
    }
    const timer = setTimeout(() => setLoaded(true), 900);
    return () => clearTimeout(timer);
  }, []);

  // Visitors coming from /portfolio.html arrive on a URL like /#contact. The
  // browser does its own fragment scroll while parsing, before React has
  // rendered anything, so the target does not exist yet and the page just sits
  // at the top. Scroll to it once the section is actually on the page.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    const jump = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    jump();
    // Images above the target have no intrinsic size, so the page grows as they
    // load and the first jump lands short. Correct it once everything is in.
    if (document.readyState === "complete") return;
    window.addEventListener("load", jump);
    return () => window.removeEventListener("load", jump);
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

  const updateField =
    (field: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  // The form never posts anywhere. It hands a pre-filled draft to the visitor's
  // own mail client, so nothing reaches us unless they send it themselves.
  // This is described in /privacy.html#form — keep the two in sync.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Inquiry from ${form.name} — ${form.restaurant}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nRestaurant: ${form.restaurant}\n\n${form.message}`
    );
    window.location.href = `mailto:misomarketinggroup@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* Preloader */}
      <div className={`preloader ${loaded ? "hidden" : ""}`} aria-hidden="true">
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
        <ul id="primary-nav" className={`nav-links ${menuOpen ? "open" : ""}`}>
          {/* Portfolio is its own page now, so it navigates instead of scrolling.
              The gallery section below stays put as a teaser for it. */}
          <li>
            <a href="/portfolio.html" onClick={() => setMenuOpen(false)}>
              Portfolio
            </a>
          </li>
          {[
            { id: "about", label: "About" },
            { id: "why", label: "Why Us" },
            { id: "pricing", label: "Services" },
          ].map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); navClick(link.id); }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className="nav-cta"
              href="#contact"
              onClick={(e) => { e.preventDefault(); navClick("contact"); }}
            >
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
              <span className="stat-num">1M</span>
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
        <FadeUp>
          <div className="gallery-more">
            <a className="btn-secondary gallery-more-link" href="/portfolio.html">
              See the Full Portfolio →
            </a>
          </div>
        </FadeUp>
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
                  <div className="about-feature-icon" aria-hidden="true">{f.icon}</div>
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
        <FadeUp><h2>Plans built for restaurants.</h2></FadeUp>
        <FadeUp>
          <p>From a single collaboration to full-service management — pick the plan that fits your restaurant.</p>
        </FadeUp>
        <div className="pricing-grid">
          {[
            {
              tag: "One-Time", title: "Standard Collaboration",
              contract: "No contract required", featured: false,
              items: [
                "1 post on our influencer IG & TikTok",
                "Carousel post or video reel",
                "Story posts included",
                "In-person photo & video shoot (~1hr)",
                "3+ hours of professional editing",
              ],
              cta: "Inquire",
            },
            {
              tag: "Monthly", title: "Standard Photo Package",
              contract: "Min. 3 month contract", featured: false,
              items: [
                "Influencer outreach & coordination",
                "2 posts on FB & IG per week",
                "Carousel photo posts + stories",
                "Ad marketing with targeting strategy",
                "2 in-person photo shoots/month (~3hrs)",
                "6+ hours of editing",
              ],
              cta: "Inquire",
            },
            {
              tag: "Most Popular", title: "Standard Media Package",
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
              cta: "Inquire",
            },
            {
              tag: "Premium", title: "Premium Media Package",
              contract: "Min. 3 month contract", featured: false,
              items: [
                "Influencer outreach & event planning",
                "3 posts on FB & IG per week",
                "Photos, reels, stories & graphic design",
                "Menu design, flyers & more",
                "Ad marketing with full strategy",
                "On-call shoots 4+ times/month (~15hrs)",
                "25+ hours of editing",
              ],
              cta: "Inquire",
            },
          ].map((plan, i) => (
            <FadeUp key={i} delay={i * 0.1}>
              <div className={`pricing-card ${plan.featured ? "featured" : ""}`}>
                <span className="pricing-tag">{plan.tag}</span>
                <div className="pricing-title">{plan.title}</div>
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

      {/* Website Design */}
      <section className="web-design" id="webdesign">
        <FadeUp>
          <div className="section-label" style={{ justifyContent: "center" }}>Website Design</div>
        </FadeUp>
        <FadeUp><h2>Your restaurant deserves a website that works as hard as you do.</h2></FadeUp>
        <FadeUp>
          <p>We build beautiful, mobile-first websites designed to turn visitors into diners.</p>
        </FadeUp>
        <div className="web-design-grid">
          {[
            {
              icon: "🎨", title: "Custom Design",
              desc: "Tailored to your brand — not a cookie-cutter template. Every site we build is unique to your restaurant's identity and vibe.",
            },
            {
              icon: "📱", title: "Mobile-First",
              desc: "Over 70% of your customers find you on their phones. Your site will look stunning on every screen size.",
            },
            {
              icon: "🔍", title: "SEO & Google",
              desc: "We optimize for local search so customers in your area find you first. Google Business integration included.",
            },
            {
              icon: "🍽️", title: "Menu & Ordering",
              desc: "Beautiful menu pages, reservation links, online ordering integration — everything your diners need in one place.",
            },
            {
              icon: "📸", title: "Photo Integration",
              desc: "Your food photography front and center. We showcase your dishes the way they deserve to be seen.",
            },
            {
              icon: "⚡", title: "Fast & Reliable",
              desc: "Lightning-fast load times, SSL security, and reliable hosting. We handle the tech so you don't have to.",
            },
          ].map((feat, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="web-design-card">
                <div className="web-design-icon" aria-hidden="true">{feat.icon}</div>
                <h4>{feat.title}</h4>
                <p>{feat.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Website packages. Kept in their own grid rather than merged into the
            marketing plans above: a one-off build is a different decision from
            a monthly retainer, and eight cards side by side compare nothing. */}
        <div className="web-plans">
          <FadeUp><h3>Website packages.</h3></FadeUp>
          <FadeUp>
            <p className="web-plans-lead">
              Built once, built properly — then kept current if you want us to.
            </p>
          </FadeUp>
          <div className="pricing-grid">
            {webPlans.map((plan, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className={`pricing-card ${plan.featured ? "featured" : ""}`}>
                  <span className="pricing-tag">{plan.tag}</span>
                  <div className="pricing-title">{plan.title}</div>
                  <div className="pricing-contract">{plan.contract}</div>
                  <ul className="pricing-list">
                    {plan.items.map((item, j) => <li key={j}>{item}</li>)}
                  </ul>
                  <button className="pricing-btn" onClick={() => scrollTo("contact")}>
                    Inquire
                  </button>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>

        <FadeUp>
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <button className="btn-primary" onClick={() => scrollTo("contact")}>
              Get a Quote →
            </button>
          </div>
        </FadeUp>
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
              <form className="contact-form" onSubmit={handleSubmit}>
                <label className="visually-hidden" htmlFor="contactName">Your name</label>
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Your name"
                  id="contactName"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={updateField("name")}
                  required
                />
                <label className="visually-hidden" htmlFor="contactEmail">Your email address</label>
                <input
                  type="email"
                  className="contact-input"
                  placeholder="Your email"
                  id="contactEmail"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField("email")}
                  required
                />
                <label className="visually-hidden" htmlFor="contactRestaurant">Restaurant name</label>
                <input
                  type="text"
                  className="contact-input"
                  placeholder="Restaurant name"
                  id="contactRestaurant"
                  name="restaurant"
                  autoComplete="organization"
                  value={form.restaurant}
                  onChange={updateField("restaurant")}
                  required
                />
                <label className="visually-hidden" htmlFor="contactMessage">
                  Tell us about your restaurant and goals
                </label>
                <textarea
                  className="contact-input contact-textarea"
                  placeholder="Tell us about your restaurant and goals..."
                  id="contactMessage"
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={updateField("message")}
                />
                <button className="cta-btn" type="submit">
                  Send Message →
                </button>
                {/* Notice at collection — keep in sync with /privacy.html */}
                <p className="form-note">
                  This opens a draft in your own email app; nothing reaches us until you
                  send it. We use what you send to reply and to quote the work, and we
                  never sell it. See our <a href="/privacy.html">Privacy Policy</a>.
                  Sending an inquiry does not create a contract &mdash; see our{" "}
                  <a href="/terms.html#inquiries">Terms of Service</a>.
                </p>
              </form>
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
            <a href="/portfolio.html">Portfolio</a>
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
          <div className="footer-col footer-legal">
            <h4>Legal</h4>
            <a href="/privacy.html">Privacy Policy</a>
            <a href="/terms.html">Terms of Service</a>
            <a href="/accessibility.html">Accessibility</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-disclaimer">
            Figures shown on this site describe our own aggregate experience and our own
            social media accounts. They are not typical or promised results — marketing
            outcomes depend on factors outside our control. Package details are
            illustrative and are not a quote; work is governed by a signed agreement.
            See our <a href="/terms.html#noresults">Terms of Service</a>.
          </p>
          <p>© 2026 Miso Marketing Group. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
