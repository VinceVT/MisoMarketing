import { useState } from "react";
import FadeUp from "./FadeUp";

const emptyForm = { name: "", email: "", restaurant: "", message: "" };

/** The "Ready to fill more seats?" block, rendered at the foot of both views.
 *  Only one view is mounted at a time, so the #contact id is never duplicated.
 *  It owns its own form state: a visitor who types into it, switches view and
 *  comes back should find the fields empty rather than half-filled from before. */
export default function ContactSection() {
  const [form, setForm] = useState(emptyForm);

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
  );
}
