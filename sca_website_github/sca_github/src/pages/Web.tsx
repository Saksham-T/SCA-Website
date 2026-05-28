import React from 'react';
import { Link } from 'react-router-dom';

export default function Web() {
  return (
    <>
      <header className="phero">
        <div className="shell">
          <div className="phero-label">Vertical 03 / Build</div>
          <h1>
            Websites, landers,<br />
            and <span className="accent">tools that pay.</span>
          </h1>
          <div className="phero-sub">
            <span className="num">↳ 003</span>
            <p>We build websites and lightweight digital products for brands. and productised SaaS tools we sell directly. Shipped by a small team that writes the copy, designs the thing, and deploys the code.</p>
          </div>
        </div>
      </header>

      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="media-strip">
          <div className="plate">
            <span className="tag">Code</span>
            <span className="corner">W.001</span>
            <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&amp;q=80" alt="Code on screen" />
          </div>
          <div className="plate">
            <span className="tag">UI</span>
            <span className="corner">W.002</span>
            <img src="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200&amp;q=80" alt="Design mockup" />
          </div>
          <div className="plate">
            <span className="tag">Ship</span>
            <span className="corner">W.003</span>
            <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&amp;q=80" alt="Team coding" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 01 / Services</div>
            <div>
              <div className="section-label">Three ways we build</div>
              <h2 className="section-title">Sites, products, tools. No wireframe-to-Webflow assembly line.</h2>
            </div>
          </div>

          <div className="verticals sr-stag">
            <Link to="/contact" className="vert">
              <div>
                <div className="vert-num">Service 01</div>
                <h3 className="vert-title">Brand websites</h3>
                <p className="vert-body">Custom-designed, custom-built marketing sites. Typography-first, fast, owned by you. Next.js or Webflow depending on needs.</p>
              </div>
              <div className="vert-meta">
                <span>Project · From ₹4L</span>
                <span className="arrow">→</span>
              </div>
            </Link>
            <Link to="/contact" className="vert">
              <div>
                <div className="vert-num">Service 02</div>
                <h3 className="vert-title">Conversion landers</h3>
                <p className="vert-body">High-intent pages for launches and paid traffic. Copy, design, build, ship. AB-tested against real traffic.</p>
              </div>
              <div className="vert-meta">
                <span>Per page · From ₹2.5L</span>
                <span className="arrow">→</span>
              </div>
            </Link>
            <Link to="/contact" className="vert">
              <div>
                <div className="vert-num">Service 03</div>
                <h3 className="vert-title">Digital products</h3>
                <p className="vert-body">Internal tools, member portals, light SaaS. We scope, design, build and hand over. or run it for you on retainer.</p>
              </div>
              <div className="vert-meta">
                <span>Scoped · From ₹8L</span>
                <span className="arrow">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 02 / Stack</div>
            <div>
              <div className="section-label">What we build with</div>
              <h2 className="section-title">A deliberately small stack. Boring where it should be. Sharp where it counts.</h2>
            </div>
          </div>

          <div className="two-col sr">
            <div>
              <ul className="bullet-list">
                <li>
                  <span className="bl-n">→</span>
                  <div>
                    <h4>Next.js · React · TypeScript</h4>
                    <p>For custom builds, productised tools, and anything with state.</p>
                  </div>
                </li>
                <li>
                  <span className="bl-n">→</span>
                  <div>
                    <h4>Webflow + Framer</h4>
                    <p>When marketing control matters more than custom engineering.</p>
                  </div>
                </li>
                <li>
                  <span className="bl-n">→</span>
                  <div>
                    <h4>Shopify + Hydrogen</h4>
                    <p>For D2C builds that need headless flexibility without reinventing commerce.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <ul className="bullet-list">
                <li>
                  <span className="bl-n">→</span>
                  <div>
                    <h4>Sanity · Payload · Notion CMS</h4>
                    <p>Content models the marketing team can actually use.</p>
                  </div>
                </li>
                <li>
                  <span className="bl-n">→</span>
                  <div>
                    <h4>Vercel · Cloudflare · AWS</h4>
                    <p>We ship fast, we keep it cheap, and we don’t babysit infrastructure.</p>
                  </div>
                </li>
                <li>
                  <span className="bl-n">→</span>
                  <div>
                    <h4>PostHog · GA4 · Segment</h4>
                    <p>Analytics wired from day one. You ship with measurement, not after.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 03 / In-house products</div>
            <div>
              <div className="section-label">What we’re building for ourselves</div>
              <h2 className="section-title">Tools we wanted for our own work. Now productised.</h2>
              <p className="section-sub">Recurring revenue. Independent of our team’s hours. Part of the long game. and a reason our best engineers stay.</p>
            </div>
          </div>

          <div className="verticals sr-stag">
            <a href="https://brandscope.in" target="_blank" rel="noopener noreferrer" className="vert">
              <div>
                <div className="vert-num">SCA/01 · Live</div>
                <h3 className="vert-title">Brandscope</h3>
                <p className="vert-body">Brand audit SaaS. Scan any D2C brand’s site + social + paid layer. Free tier + ₹990/mo pro.</p>
              </div>
              <div className="vert-meta">
                <span>Beta · brandscope.in</span>
                <span className="arrow">↗</span>
              </div>
            </a>
            <div className="vert">
              <div>
                <div className="vert-num">SCA/02 · Live</div>
                <h3 className="vert-title">Roster</h3>
                <p className="vert-body">The internal creator CRM we use for influencer campaigns. Now opening up to other agencies. private beta Q3 2026.</p>
              </div>
              <div className="vert-meta">
                <span>Invite only</span>
                <span className="arrow">↗</span>
              </div>
            </div>
            <div className="vert">
              <div>
                <div className="vert-num">SCA/03 · Soon</div>
                <h3 className="vert-title">Calendar</h3>
                <p className="vert-body">Content calendar + approval workflow built for Indian marketing teams. WhatsApp-first. Launching Aug 2026.</p>
              </div>
              <div className="vert-meta">
                <span>Waitlist open</span>
                <span className="arrow">↗</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
