import React, { useState } from 'react';

export default function Contact() {
  const [need, setNeed] = useState('');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [btnText, setBtnText] = useState('Send brief ↗');
  const [btnDisabled, setBtnDisabled] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get('name') as string;
    const company = data.get('company') as string;
    const email = data.get('email') as string;
    const phone = (data.get('phone') as string) || '—';
    const brief = data.get('brief') as string;

    if (!name || !company || !email || !brief) {
      alert('Please fill in name, company, email and the situation.');
      return;
    }

    const selectedNeed = need || '—';
    const selectedBudget = budget || '—';
    const selectedTimeline = timeline || '—';

    const subject = `New brief — ${company} (${selectedNeed})`;
    const body =
      `Hi SCA,\n\n` +
      `- Need: ${selectedNeed}\n` +
      `- Budget: ${selectedBudget}\n` +
      `- Timeline: ${selectedTimeline}\n\n` +
      `- Name: ${name}\n` +
      `- Company: ${company}\n` +
      `- Email: ${email}\n` +
      `- Phone: ${phone}\n\n` +
      `- The situation:\n${brief}\n\n` +
      `Sent via seetusk.agency`;

    const url = 'mailto:contact@seetusk.com'
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);

    window.location.href = url;

    setBtnText('Opening your mail app…');
    setBtnDisabled(true);

    setTimeout(() => {
      setBtnText('Email didn’t open? contact@seetusk.com');
    }, 2500);
  };

  return (
    <>
      <header className="phero">
        <div className="shell">
          <div className="phero-label">Contact / start a project</div>
          <h1>Tell us where<br />you’re <span className="accent">stuck.</span></h1>
          <div className="phero-sub">
            <span className="num">↳ 001</span>
            <p>One 45-minute call. A sharp read of your situation. An honest answer on whether we can help. We reply within 24 hours on business days. and if we can’t take you on, we’ll tell you who can.</p>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="shell" style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div className="section-label" style={{ marginBottom: '8px' }}>§ 01 / Brief</div>
          <h2 style={{ fontSize: '24px', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '32px' }}>A few questions. Two minutes.</h2>

          <form onSubmit={handleSubmit}>
            {/* 01 · Need selection */}
            <div style={{ marginBottom: '32px' }}>
              <label className="mono caps" style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
                01 · What do you need?
              </label>
              <div className="choice-grid">
                <button 
                  type="button" 
                  onClick={() => setNeed('content')} 
                  className={`choice ${need === 'content' ? 'active' : ''}`}
                >
                  <span>Content &amp; brand</span>
                  <span className="c-num">01</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setNeed('influencer')} 
                  className={`choice ${need === 'influencer' ? 'active' : ''}`}
                >
                  <span>Influencer</span>
                  <span className="c-num">02</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setNeed('web')} 
                  className={`choice ${need === 'web' ? 'active' : ''}`}
                >
                  <span>Web &amp; tech</span>
                  <span className="c-num">03</span>
                </button>
              </div>
            </div>

            {/* 02 · Budget selection */}
            <div style={{ marginBottom: '32px' }}>
              <label className="mono caps" style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
                02 · Monthly budget
              </label>
              <div className="choice-grid">
                <button 
                  type="button" 
                  onClick={() => setBudget('under-2L')} 
                  className={`choice ${budget === 'under-2L' ? 'active' : ''}`}
                >
                  <span>Under ₹2L</span>
                  <span className="c-num">A</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setBudget('2-5L')} 
                  className={`choice ${budget === '2-5L' ? 'active' : ''}`}
                >
                  <span>₹2L–5L</span>
                  <span className="c-num">B</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setBudget('5L+')} 
                  className={`choice ${budget === '5L+' ? 'active' : ''}`}
                >
                  <span>₹5L +</span>
                  <span className="c-num">C</span>
                </button>
              </div>
            </div>

            {/* 03 · Timeline selection */}
            <div style={{ marginBottom: '32px' }}>
              <label className="mono caps" style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '12px' }}>
                03 · Timeline
              </label>
              <div className="choice-grid">
                <button 
                  type="button" 
                  onClick={() => setTimeline('asap')} 
                  className={`choice ${timeline === 'asap' ? 'active' : ''}`}
                >
                  <span>ASAP</span>
                  <span className="c-num">A</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setTimeline('1-2mo')} 
                  className={`choice ${timeline === '1-2mo' ? 'active' : ''}`}
                >
                  <span>1–2 months</span>
                  <span className="c-num">B</span>
                </button>
                <button 
                  type="button" 
                  onClick={() => setTimeline('3mo')} 
                  className={`choice ${timeline === '3mo' ? 'active' : ''}`}
                >
                  <span>3 months</span>
                  <span className="c-num">C</span>
                </button>
              </div>
            </div>

            {/* Fields grid */}
            <div className="form-grid">
              <div className="form-field">
                <label>04 · Your name</label>
                <input type="text" name="name" placeholder="Full name" required />
              </div>
              <div className="form-field">
                <label>05 · Company</label>
                <input type="text" name="company" placeholder="Brand or company" required />
              </div>
              <div className="form-field">
                <label>06 · Email</label>
                <input type="email" name="email" placeholder="you@company.com" required />
              </div>
              <div className="form-field">
                <label>07 · Phone (optional)</label>
                <input type="tel" name="phone" placeholder="+91 ..." />
              </div>
              <div className="form-field full">
                <label>08 · What’s the situation?</label>
                <textarea name="brief" placeholder="Two or three sentences about your brand, where you’re stuck, and what success looks like." required></textarea>
              </div>
            </div>

            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <p className="mono caps" style={{ fontSize: '11px', color: 'var(--muted)' }}>All briefs reviewed by the core team · reply within 24h</p>
              <button type="submit" disabled={btnDisabled} className="btn accent">{btnText}</button>
            </div>
          </form>
        </div>
      </section>

      {/* Roster & locations info */}
      <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 02 / Reach us</div>
            <div>
              <div className="section-label">Or just email us</div>
              <h2 className="section-title">Not into forms? Fair.</h2>
            </div>
          </div>

          <div className="verticals sr-stag">
            <a href="mailto:contact@seetusk.com" className="vert">
              <div>
                <div className="vert-num">Email · General</div>
                <h3 className="vert-title" style={{ fontSize: '28px' }}>contact@<br />seetusk.com</h3>
                <p className="vert-body">For new business, press, partnerships. Read by a founder.</p>
              </div>
              <div className="vert-meta">
                <span>Reply in 24h</span>
                <span className="arrow">↗</span>
              </div>
            </a>
            <a href="mailto:hr@seetusk.com" className="vert">
              <div>
                <div className="vert-num">Email · Careers</div>
                <h3 className="vert-title" style={{ fontSize: '28px' }}>hr@<br />seetusk.com</h3>
                <p className="vert-body">Want to build a career with SeeTusk? Send us a note and your portfolio.</p>
              </div>
              <div className="vert-meta">
                <span>Reply in 48h</span>
                <span className="arrow">↗</span>
              </div>
            </a>
            <a href="https://maps.app.goo.gl/atGgF3p6QzsDyai26" target="_blank" rel="noopener noreferrer" className="vert">
              <div>
                <div className="vert-num">Studio</div>
                <h3 className="vert-title" style={{ fontSize: '28px' }}>Bavdhan<br />Pune 411021</h3>
                <p className="vert-body">By appointment only. We don’t do walk-ins. we do tea and a whiteboard.</p>
              </div>
              <div className="vert-meta">
                <span>Mon–Sat · 10–6</span>
                <span className="arrow">↗</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
