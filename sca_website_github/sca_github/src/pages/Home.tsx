import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StackedLogos from '../components/StackedLogos';

const logoGroups = [
  [
    <img src="/images/logos/hindustan-unilever.png" alt="Hindustan Unilever" key="g1-1" />,
    <img src="/images/logos/car-and-bike.png" alt="car&amp;bike" key="g1-2" />,
    <img src="/images/logos/clover-co.png" alt="Clover &amp; Co." key="g1-3" />,
    <img src="/images/logos/pune-river-revival.png" alt="Pune River Revival" key="g1-4" />
  ],
  [
    <img src="/images/logos/force-motors.png" alt="Force Motors" key="g2-1" />,
    <span className="cc-text" key="g2-2">The Comedy Clubhouse</span>,
    <img src="/images/logos/bamboo-india.png" alt="Bamboo India" key="g2-3" />,
    <img src="/images/logos/kundan-spaces.png" alt="Kundan Spaces" key="g2-4" />
  ],
  [
    <img src="/images/logos/nift.png" alt="NIFT" key="g3-1" />,
    <img src="/images/logos/wtf.png" alt="WTF" key="g3-2" />,
    <img src="/images/logos/visda-organix.png" alt="Visda Organix" key="g3-3" />,
    <img src="/images/logos/coffee-cup.png" alt="Coffee Cup" key="g3-4" />
  ],
  [
    <img src="/images/logos/myfitness.png" alt="MyFitness" key="g4-1" />,
    <img src="/images/logos/firvt.png" alt="FIRVT" key="g4-2" />,
    <img src="/images/logos/jeevitnadi.png" alt="Jeevitnadi" key="g4-3" />,
    <img src="/images/logos/tridrashya.png" alt="Tridrashya" key="g4-4" />
  ]
];

export default function Home() {
  const [cycleText, setCycleText] = useState('TECH');
  const [cycleOpacity, setCycleOpacity] = useState(1);
  const [cycleTransform, setCycleTransform] = useState('translateY(0)');

  const words = ['TECH', 'D2C', 'F&B', 'REAL ESTATE', 'AMBITIOUS', 'EDTECH'];

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setCycleOpacity(0);
      setCycleTransform('translateY(10px)');
      
      setTimeout(() => {
        i = (i + 1) % words.length;
        setCycleText(words[i]);
        setCycleOpacity(1);
        setCycleTransform('translateY(0)');
      }, 220);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ——— HERO ——— */}
      <header className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="blob b1"></div>
          <div className="blob b2"></div>
          <div className="blob b3"></div>
          <div className="blob b4"></div>
          <div className="grain"></div>
        </div>
        <div className="shell">
          <div className="hero-meta">
            <span>SCA / 2026 · Pune → Mumbai · India</span>
            <span className="live">
              <span className="live-dot"></span> Now booking new retainers for Q3
            </span>
          </div>

          <h1 className="hero-h1" style={{ display: 'block', overflow: 'visible' }}>
            <span className="stamp-word" style={{ '--s': 0 } as React.CSSProperties}>OWN.</span>{' '}
            <span className="stamp-word" style={{ '--s': 1 } as React.CSSProperties}>BUILD.</span>{' '}
            <span className="stamp-word" style={{ '--s': 2 } as React.CSSProperties}>RENT</span><br />
            <span className="stamp-word accent" style={{ '--s': 3 } as React.CSSProperties}>DISTRIBUTION</span><br />
            <span className="stamp-word" style={{ '--s': 4 } as React.CSSProperties}>FOR</span>{' '}
            <span className="stamp-word" style={{ '--s': 5 } as React.CSSProperties}>
              <span 
                style={{ 
                  opacity: cycleOpacity, 
                  transform: cycleTransform, 
                  transition: 'opacity .4s ease, transform .4s ease',
                  display: 'inline-block'
                }} 
                className="cycle"
              >
                {cycleText}
              </span>
            </span>{' '}
            <span className="stamp-word" style={{ '--s': 6 } as React.CSSProperties}>BRANDS.</span>
          </h1>

          <div className="hero-sub">
            <span className="num">↳ 001</span>
            <p>
              SeeTusk Creative Agency is a brand-building and distribution company out of Pune.
              We’re not a digital marketing agency. We build the system that makes your brand
              impossible to ignore. through content, creators, and code.
            </p>
            <div className="cta-col">
              <Link to="/contact" className="btn">
                Start a project <span className="arr">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ——— STACKED LOGOS ——— */}
      <section style={{ borderBottom: '1px solid var(--line)', paddingBottom: '96px' }}>
        <div className="shell" style={{ padding: '48px 0 32px' }}>
          <div className="chip">
            <span className="dot"></span> Trusted by founders &amp; CMOs · 2024–2026
          </div>
        </div>
        <div className="shell">
          <div style={{ border: '1px solid var(--line)', background: 'var(--card)', overflow: 'hidden', position: 'relative' }}>
            <StackedLogos logoGroups={logoGroups} duration={24} stagger={0.6} logoWidth="25%" />
          </div>
        </div>
      </section>


      {/* ——— FILM STRIP ——— */}
      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="shell">
          <div style={{ padding: '64px 0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="section-label" style={{ marginBottom: '8px' }}>§ Studio film strip</div>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', textTransform: 'uppercase', letterSpacing: '-0.01em', maxWidth: '22ch', lineHeight: 1.05, fontWeight: 700 }}>
                A week inside the studio.
              </h2>
            </div>
            <span className="mono caps muted" style={{ fontSize: '11px' }}>PUNE / IND ↘ APR 2026</span>
          </div>
        </div>
        <div className="media-strip" style={{ fontFamily: '"EB Garamond"' }}>
          <div className="plate">
            <span className="tag">01 / Ship</span>
            <span className="corner">F.001</span>
            <img src="/images/ambar-coffee-clean.png" alt="Ambar, espresso pour, café campaign" />
          </div>
          <div className="plate">
            <span className="tag">02 / Studio</span>
            <span className="corner">F.002</span>
            <img src="/images/g-studio-bw.png" alt="Studio shoot, black and white" />
          </div>
          <div className="plate">
            <span className="tag">03 / OOH</span>
            <span className="corner">F.003</span>
            <img src="/images/g-fevistik-banner.png" alt="Fevistik, outdoor banner campaign" />
          </div>
        </div>
      </section>

      {/* ——— VERTICALS ——— */}
      <section className="section">
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 02 / Verticals</div>
            <div>
              <div className="section-label">What we do. three things, seriously</div>
              <h2 className="section-title">Three ways to move a brand. One system underneath.</h2>
              <p className="section-sub">
                Every engagement sits in one of three practices. They’re separate offers, but they plug into the same
                distribution engine we’ve built. our newsletter, our social reach, our community of Pune &amp; Mumbai founders.
              </p>
            </div>
          </div>

          <div className="verticals sr-stag">
            <Link to="/content" className="vert">
              <div>
                <div className="vert-num">01 / Own</div>
                <h3 className="vert-title">Content &amp; Brand Infrastructure</h3>
                <p className="vert-body">
                  The outsourced creative department. We own your voice, your visuals, and
                  your distribution calendar. monthly retainer, built to compound.
                </p>
              </div>
              <div className="vert-meta">
                <span>Retainer · From ₹1.8L/mo</span>
                <span className="arrow">→</span>
              </div>
            </Link>

            <Link to="/influencer" className="vert">
              <div>
                <div className="vert-num">02 / Rent</div>
                <h3 className="vert-title">Influencer &amp; Distribution</h3>
                <p className="vert-body">
                  Not a marketplace. A managed service. We source, brief, ship and report
                  on creator campaigns. and take accountability for the outcome.
                </p>
              </div>
              <div className="vert-meta">
                <span>Per campaign · From ₹3L</span>
                <span className="arrow">→</span>
              </div>
            </Link>

            <Link to="/web" className="vert">
              <div>
                <div className="vert-num">03 / Build</div>
                <h3 className="vert-title">Web &amp; Tech</h3>
                <p className="vert-body">
                  Websites, landing pages, and lightweight digital products. Plus the productised
                  tools we’re building. brand audits, analytics, content calendars.
                </p>
              </div>
              <div className="vert-meta">
                <span>Project + SaaS · From ₹2.5L</span>
                <span className="arrow">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ——— MANIFESTO ——— */}
      <section className="manifesto">
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 03 / Manifesto</div>
            <div>
              <div className="section-label">What we believe</div>
              <h2 className="section-title">Most brands aren’t broken. They’re invisible.</h2>
            </div>
          </div>

          <div className="manifesto-grid">
            <div></div>
            <div className="manifesto-list sr-stag">
              <div className="manifesto-item">
                <span className="n">01</span>
                <div>
                  <h3>Distribution is the product.</h3>
                  <p>Your logo is not your brand. Your post is not your marketing. A <strong>system that reliably gets the right message in front of the right person</strong>. that’s the work. Everything else is vanity.</p>
                </div>
              </div>
              <div className="manifesto-item">
                <span className="n">02</span>
                <div>
                  <h3>Growth is a system, not a gamble.</h3>
                  <p>Spray-and-pray isn’t a strategy. Luck isn’t a KPI. We build inputs you can <strong>predict, measure, and scale</strong>. not just campaigns you can hope for.</p>
                </div>
              </div>
              <div className="manifesto-item">
                <span className="n">03</span>
                <div>
                  <h3>We work like a startup, not an agency.</h3>
                  <p>Small teams. Short meetings. Ship weekly. We don’t bill you for status decks and intern hours. We bill you for <strong>leverage, taste, and outcomes</strong>.</p>
                </div>
              </div>
              <div className="manifesto-item">
                <span className="n">04</span>
                <div>
                  <h3>We say no a lot.</h3>
                  <p>We don’t do logos-as-a-service. We don’t do cheap and quick. We don’t take on brands that can’t tell us what they stand for. <strong>One thousand no’s for every yes.</strong></p>
                </div>
              </div>
              <div className="manifesto-item">
                <span className="n">05</span>
                <div>
                  <h3>We build in public.</h3>
                  <p>Our newsletter, our teardowns, our frameworks. they’re all open. Our audience is our proof of work. If you want to know how we think, <strong>read what we publish</strong>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— PROCESS ——— */}
      <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 04 / Process</div>
            <div>
              <div className="section-label">How we work. four weeks to first shipment</div>
              <h2 className="section-title">No discovery theatre. No fifty-slide decks. We ship.</h2>
            </div>
          </div>

          <div className="process-cards sr-stag">
            <div className="proc-card">
              <span className="proc-n">01</span>
              <h4>Diagnose</h4>
              <p>One 45-minute call. Sharp questions, honest answer.</p>
              <span className="proc-dur">Week 0</span>
            </div>
            <div className="proc-card">
              <span className="proc-n">02</span>
              <h4>Brief &amp; plan</h4>
              <p>A written brief you can argue with. 90-day plan, signed off.</p>
              <span className="proc-dur">Week 1</span>
            </div>
            <div className="proc-card">
              <span className="proc-n">03</span>
              <h4>Build &amp; ship</h4>
              <p>Weekly deliverables. Assets go live. Campaigns go out.</p>
              <span className="proc-dur">Weeks 2–4</span>
            </div>
            <div className="proc-card">
              <span className="proc-n">04</span>
              <h4>Compound</h4>
              <p>Compound retainers tied to business outcomes. not impressions.</p>
              <span className="proc-dur">Month 2+</span>
            </div>
          </div>
        </div>
      </section>

      {/* ——— STUDIO IMAGERY GALLERY ——— */}
      <section className="section--sm" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="shell">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="section-label">§ 05 / Visual register</div>
              <h2 style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', textTransform: 'uppercase', letterSpacing: '-0.01em', maxWidth: '22ch', lineHeight: 1.05, fontWeight: 700 }}>
                A taste of how we shoot.
              </h2>
            </div>
            <span className="mono caps muted" style={{ fontSize: '11px' }}>Selected stills · 2025–2026</span>
          </div>
          <div className="ig-gallery sr-stag">
            <div className="plate ig-tile"><span className="tag">BTS</span><span className="corner">001</span><img src="/images/g-camera-operator.jpeg" alt="Cinema camera operator on set" /></div>
            <div className="plate ig-tile"><span className="tag">Product</span><span className="corner">002</span><img src="/images/g-product-setup.jpeg" alt="Product photography lighting setup" /></div>
            <div className="plate ig-tile"><span className="tag">Product</span><span className="corner">003</span><img src="/images/cycada-product.png" alt="Cycada. product hero" /></div>
            <div className="plate ig-tile"><span className="tag">Studio</span><span className="corner">004</span><img src="/images/g-white-studio.jpeg" alt="White studio, umbrella lighting" /></div>
            <div className="plate ig-tile"><span className="tag">Interior</span><span className="corner">005</span><img src="/images/web-laptop.png" alt="Web build. dark site mockup" /></div>
            <div className="plate ig-tile"><span className="tag">Production</span><span className="corner">006</span><img src="/images/g-interview-set.jpeg" alt="Interview set, two-camera setup" /></div>
            <div className="plate ig-tile"><span className="tag">Packaging</span><span className="corner">007</span><img src="/images/g-rosatum-wine.png" alt="Rosatum. Chenin Blanc bottle" /></div>
            <div className="plate ig-tile"><span className="tag">Design</span><span className="corner">008</span><img src="/images/g-desktop.jpg" alt="2nd Chance branding on Adobe Illustrator" /></div>
            <div className="plate ig-tile"><span className="tag">OOH</span><span className="corner">009</span><img src="/images/g-bengaluru-billboard.png" alt="Bengaluru OOH billboard" /></div>
            <div className="plate ig-tile"><span className="tag">Campaign</span><span className="corner">010</span><img src="/images/g-surf-excel.png" alt="Surf Excel campaign still" /></div>
            <div className="plate ig-tile"><span className="tag">Lifestyle</span><span className="corner">011</span><img src="/images/g-ambar-coffee.png" alt="Ambar. coffee cup shot" /></div>
            <div className="plate ig-tile"><span className="tag">OOH</span><span className="corner">012</span><img src="/images/g-fevistik.png" alt="Fevistik. outdoor campaign" /></div>
            <div className="plate ig-tile"><span className="tag">Brand</span><span className="corner">013</span><img src="/images/g-devknight-stationery.png" alt="DevKnight. stationery system" /></div>
            <div className="plate ig-tile"><span className="tag">Packaging</span><span className="corner">014</span><img src="/images/g-fevicryl.png" alt="Fevicryl. Tie &amp; Dye kit packaging" /></div>
            <div className="plate ig-tile"><span className="tag">Production</span><span className="corner">015</span><img src="/images/g-director-set.png" alt="Director's chair, film set" /></div>
            <div className="plate ig-tile"><span className="tag">Studio</span><span className="corner">016</span><img src="/images/g-studio-redlight.jpeg" alt="Studio under red light" /></div>
            <div className="plate ig-tile"><span className="tag">Launch</span><span className="corner">017</span><img src="/images/g-firvt-launch.jpeg" alt="FIRVT launch event" /></div>
            <div className="plate ig-tile"><span className="tag">Studio</span><span className="corner">018</span><img src="/images/g-studio-pune.jpeg" alt="SCA studio, Pune" /></div>
          </div>
        </div>
      </section>

      {/* ——— CTA ——— */}
      <section className="cta-block">
        <div className="shell">
          <div className="sr">
            <div className="section-label" style={{ marginBottom: '24px' }}>§ 06 / Next move</div>
            <h2 className="cta-h">
              GROWTH IS A <span className="accent">SYSTEM.</span><br />
              NOT A <span className="accent">GAMBLE.</span>
            </h2>
            <div className="cta-row">
              <div className="num">↳ 006</div>
              <p>Tell us where you’re stuck. One 45-minute call, a sharp read of your situation, and an honest answer on whether we can help. No pitch deck. No follow-up nurture sequence.</p>
              <Link to="/contact" className="btn accent">Start a project <span className="arr">↗</span></Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
