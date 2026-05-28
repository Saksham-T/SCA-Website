import React from 'react';

export default function About() {
  return (
    <>
      <header className="phero">
        <div className="shell">
          <div className="phero-label">About / the studio</div>
          <h1>A small studio<br />with a <span className="accent">loud point of view.</span></h1>
          <div className="phero-sub">
            <span className="num">↳ 001</span>
            <p>SeeTusk was founded in late 2025 in Pune. We started as two people making content for a D2C client who needed it shipped weekly. Today we’re a team of 14, working on retainer with brands across India, renting distribution for a few dozen more, and building products of our own.</p>
          </div>
        </div>
      </header>

      <section style={{ borderTop: '1px solid var(--line)' }}>
        <div className="media-strip">
          <div className="plate">
            <span className="tag">Studio · Bavdhan</span>
            <span className="corner">A.001</span>
            <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&amp;q=80" alt="Studio interior" />
          </div>
          <div className="plate">
            <span className="corner">A.002</span>
            <img src="/images/a-banner-02.png" alt="Creative at work in the studio" />
          </div>
          <div className="plate">
            <span className="tag">Crit night</span>
            <span className="corner">A.003</span>
            <img src="/images/a-banner-03.png" alt="Team gathered around the studio table" />
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="stats sr" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat">
              <div className="n"><span className="accent">14</span></div>
              <div className="lbl">Team · Pune + remote</div>
            </div>
            <div className="stat">
              <div className="n">2025</div>
              <div className="lbl">Founded · Bavdhan</div>
            </div>
            <div className="stat">
              <div className="n">10</div>
              <div className="lbl">Active retainers</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 01 / The story</div>
            <div>
              <div className="section-label">How we got here</div>
              <h2 className="section-title">We didn’t plan to be an agency. We planned to fix one brand.</h2>
            </div>
          </div>

          <div className="two-col sr">
            <div>
              <p className="pull">We write every post, ship every campaign, and read every reply. <span className="accent">That’s the advantage.</span></p>
            </div>
            <div style={{ color: '#dcdcdc', fontSize: '16px', lineHeight: '1.7' }}>
              <p style={{ marginBottom: '18px' }}>
                SCA was founded by <strong style={{ color: '#fff' }}>Sarthak Thakur</strong> and <strong style={{ color: '#fff' }}>Saksham Thakur</strong> after leaving a Bombay shop that promised startups the moon and delivered PowerPoints.
              </p>
              <p style={{ marginBottom: '18px' }}>
                The first coffee brand we partnered with in Pune needed consistent, weekly high-aesthetic content. We stepped in, built a direct content loop, and it converted. They shared results with three founders, those friends told nine more, and by month six we were fully booked.
              </p>
              <p>
                Today, the team remains small by design: a core pod of 14 creatives and engineers working from Pune and remote. We keep it focused because our unfair advantage is that the senior strategists you meet are the exact people designing your campaigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 02 / Team</div>
            <div>
              <div className="section-label">The humans on the work</div>
              <h2 className="section-title">A small team. No account managers.</h2>
            </div>
          </div>

          <div className="team-grid sr-stag">
            <div className="team-card">
              <div className="avatar">
                <img src="/images/team-sarthak.png" alt="Sarthak Thakur" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h4>Sarthak Thakur</h4>
              <div className="role">Founder</div>
            </div>
            <div className="team-card">
              <div className="avatar">
                <img src="/images/team-saksham.png" alt="Saksham Thakur" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h4>Saksham Thakur</h4>
              <div className="role">Co-founder</div>
            </div>
            <div className="team-card">
              <div className="avatar">
                <img src="/images/team-melbin.png" alt="Melbin Alexander" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h4>Melbin Alexander</h4>
              <div className="role">Co-founder</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head sr">
            <div className="section-num">§ 03 / Principles</div>
            <div>
              <div className="section-label">How we decide</div>
              <h2 className="section-title">The non-negotiables we argue about in every weekly.</h2>
            </div>
          </div>

          <div className="manifesto-grid">
            <div></div>
            <div className="manifesto-list sr-stag">
              <div className="manifesto-item">
                <span className="n">A.</span>
                <div>
                  <h3>Taste over volume.</h3>
                  <p>We’d rather ship three great things than twelve mediocre ones. Agencies that bill by output die slow deaths.</p>
                </div>
              </div>
              <div className="manifesto-item">
                <span className="n">B.</span>
                <div>
                  <h3>Write it down.</h3>
                  <p>Strategy you can’t write is strategy you don’t have. Every engagement produces a doc someone on the client side can defend in a meeting.</p>
                </div>
              </div>
              <div className="manifesto-item">
                <span className="n">C.</span>
                <div>
                  <h3>Ship weekly.</h3>
                  <p>Anything that can’t be reviewed once a week compounds into a mess by month three. Public roadmap. No black boxes.</p>
                </div>
              </div>
              <div className="manifesto-item">
                <span className="n">D.</span>
                <div>
                  <h3>No bullshit metrics.</h3>
                  <p>If it doesn’t show up in revenue, pipeline, or brand search. it’s not a KPI. It’s a screenshot.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
