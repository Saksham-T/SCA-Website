import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = data.get('email') as string;
    if (!email) return;
    const url = 'mailto:contact@seetusk.com'
      + '?subject=' + encodeURIComponent('Newsletter signup')
      + '&body=' + encodeURIComponent(`Please add me to the SCA newsletter.\n\nEmail: ${email}`);
    window.location.href = url;
    
    const btn = e.currentTarget.querySelector('button');
    if (btn) {
      btn.textContent = 'Check mail ↗';
      btn.disabled = true;
    }
  };

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-news">
          <div>
            <h4>Read what we ship.</h4>
            <p>Our weekly newsletter. Frameworks, teardowns, behind-the-scenes from the studio. Read by founders &amp; CMOs. No fluff.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit}>
            <input type="email" name="email" placeholder="you@company.com" required />
            <button type="submit">Subscribe ↗</button>
          </form>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <img className="footer-brand-mark" src="/images/sca-logo-mark.png" alt="SCA mark" />
            <p>SeeTusk Creative Agency. We build, rent and own distribution for ambitious Indian brands. Headquartered in Pune. Working across India.</p>
          </div>
          <div>
            <h5>Verticals</h5>
            <Link to="/content">Content &amp; Brand</Link>
            <Link to="/influencer">Influencer</Link>
            <Link to="/web">Web &amp; Tech</Link>
          </div>
          <div>
            <h5>Studio</h5>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <a href="mailto:hr@seetusk.com">Careers</a>
          </div>
          <div>
            <h5>Elsewhere</h5>
            <a href="mailto:contact@seetusk.com">contact@seetusk.com ↗</a>
            <a href="mailto:hr@seetusk.com">hr@seetusk.com ↗</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SeeTusk Creative Agency · Pune, IND</span>
          <span>seetusk.agency · Built in-house</span>
        </div>
      </div>
    </footer>
  );
}
