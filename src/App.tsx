import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Outlet,
} from "react-router-dom";
import "./App.css";
import PortfolioPage from "./pages/PortfolioPage";

// Define interfaces directly in App.tsx or import if used elsewhere
interface FormData {
  name: string;
  email: string;
  service: string;
  message: string;
}

// Helper component to manage scroll restoration and animations
const ScrollManager: React.FC = () => {
  const location = useLocation();
  const aboutSectionRef = useRef<HTMLElement>(null);
  const contactSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const sectionsToObserve = [
      { ref: aboutSectionRef, selector: ".about-section" },
      { ref: contactSectionRef, selector: ".contact-section" },
      { ref: null, selector: ".homepage-hero-banner" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            if (entry.target.matches(".homepage-hero-banner")) {
              const heroTextElements = entry.target.querySelectorAll(
                ".hero h1, .hero p, .hero .cta-button"
              );
              heroTextElements.forEach((el) => {
                el.classList.remove("visible");
                void (el as HTMLElement).offsetWidth;
                el.classList.add("visible");
              });
            }
          } else {
            // entry.target.classList.remove('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const observedElements: Element[] = [];

    sectionsToObserve.forEach((sectionInfo) => {
      const sectionEl = document.querySelector(sectionInfo.selector);
      if (sectionEl) {
        observer.observe(sectionEl);
        observedElements.push(sectionEl);
        if (sectionInfo.ref) {
          // @ts-expect-error: Assigning to current for refs managed here
          sectionInfo.ref.current = sectionEl;
        }
      }
    });

    // General filter-tabs observer (if any exist outside portfolio page)
    const filterTabsEl = document.querySelector(".filter-tabs");
    if (filterTabsEl && !filterTabsEl.closest(".portfolio-page-container")) {
      observer.observe(filterTabsEl);
      observedElements.push(filterTabsEl);
    }

    return () => {
      observedElements.forEach((el) => observer.unobserve(el));
    };
  }, [location.pathname]);

  return null;
};

// Renamed MainLayout to HomePageContent
const HomePageContent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  const aboutSectionRef = useRef<HTMLElement>(null); // Refs are now for sections within HomePageContent
  const contactSectionRef = useRef<HTMLElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    alert("Thank you for your message!");
    setFormData({ name: "", email: "", service: "", message: "" });
  };

  return (
    <>
      <section className="homepage-hero-banner">
        <div className="hero-content-wrapper">
          <section className="hero">
            <h1>Capturing Food's True Essence</h1>
            <p>
              Award-winning food photography for restaurants, brands, and
              publications.
            </p>
            <a href="#contact" className="cta-button">
              Get In Touch
            </a>
          </section>
        </div>
      </section>

      <section className="about-section" ref={aboutSectionRef} id="about">
        <h2>About Miso</h2>
        <div className="about-content">
          <p className="about-text">
            Miso is a passionate food photographer dedicated to bringing out the
            vibrant colors, textures, and artistry of culinary creations. With
            years of experience, Miso has collaborated with renowned chefs,
            restaurants, and food brands to create mouth-watering visuals that
            tell a story.
          </p>
          <div className="stats">
            <div className="stat">
              <h3>10+</h3>
              <p>Years of Experience</p>
            </div>
            <div className="stat">
              <h3>200+</h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat">
              <h3>50+</h3>
              <p>Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" ref={contactSectionRef} id="contact">
        <h2>Get In Touch</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <select
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            <option value="restaurant">Restaurant Photography</option>
            <option value="editorial">Editorial/Magazine</option>
            <option value="branding">Product/Brand Photography</option>
            <option value="social">Social Media Content</option>
            <option value="other">Other</option>
          </select>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </section>
      {/* Footer is now in GlobalLayout */}
    </>
  );
};

// New GlobalLayout component
const GlobalLayout: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false);
  const location = useLocation(); // To close menu on navigation

  useEffect(() => {
    setMenuActive(false); // Close menu when location changes
  }, [location.pathname]);

  return (
    <div className="app">
      <ScrollManager />
      <header className="site-header">
        <nav className="nav">
          <Link to="/" className="logo">
            Miso
          </Link>
          <div className={`nav-links ${menuActive ? "active" : ""}`}>
            {/* Updated to scroll to section if on home page, else navigate for About/Contact might need more robust logic or direct links */}
            <a href="/#about" onClick={() => setMenuActive(false)}>
              About
            </a>
            <Link to="/portfolio" onClick={() => setMenuActive(false)}>
              Portfolio
            </Link>
            <a href="/#contact" onClick={() => setMenuActive(false)}>
              Contact
            </a>
          </div>
          <button
            className={`menu-toggle ${menuActive ? "active" : ""}`}
            onClick={() => setMenuActive(!menuActive)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
        {/* Hero section is part of HomePageContent now, only on the main page */}
        {/* If a different hero is needed for other pages, it would go in those page components */}
      </header>

      <main>
        <Outlet />{" "}
        {/* This is where the routed page component will be rendered */}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Miso Photography</h4>
            <p>Capturing culinary artistry.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="/#about">About</a>
            <br />
            <Link to="/portfolio">Portfolio</Link>
            <br />
            <a href="/#contact">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#">Instagram</a>
              <a href="#">Facebook</a>
              <a href="#">Pinterest</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Miso Photography. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      {/* ScrollManager is now part of GlobalLayout */}
      <Routes>
        <Route element={<GlobalLayout />}>
          {" "}
          {/* GlobalLayout wraps the routes */}
          <Route path="/" element={<HomePageContent />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          {/* Add other routes here that should use the GlobalLayout */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
