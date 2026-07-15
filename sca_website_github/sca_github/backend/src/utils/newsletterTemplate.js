'use strict';

/**
 * Premium Newsletter HTML Template for SeeTusk Creative Agency (SCA).
 * Designed like a luxury editorial print magazine translated into a digital email.
 * 
 * Design Constraints for Cross-Client Rendering (Gmail, Outlook, Apple Mail):
 *   - Table-based layout with inline style attributes only.
 *   - Max-width 650px, width 100% responsive wrapper.
 *   - Elegant, web-safe serif/sans typography stacks.
 */

// Brand Palette (Editorial Dark)
const BG_MAIN = '#0B0B0B'; // Deep black
const BG_CARD = '#161618'; // Charcoal gray elevated card
const ACCENT = '#C5A880';  // Muted gold accent
const TEXT_LIGHT = '#F8F6F2'; // Warm off-white primary text
const TEXT_MUTED = '#8C8C90'; // Muted charcoal gray
const BORDER = '#222224'; // Brutalist grid line

// Font Stacks
const FONT_SERIF = "Georgia, Garamond, 'Times New Roman', serif";
const FONT_SANS = "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";
const FONT_MONO = "'Courier New', Courier, monospace";

/** Safe HTML escape helper */
function esc(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Horizontal divider line */
function divider() {
  return `<tr><td style="padding:0; border-top: 1px solid ${BORDER}; line-height:0; font-size:0;">&nbsp;</td></tr>`;
}

/** Section header / kicker */
function kicker(number, title) {
  return `
    <tr>
      <td style="padding: 40px 0 16px; font-family: ${FONT_MONO}; font-size: 11px; font-weight: bold; letter-spacing: 2px; color: ${ACCENT}; text-transform: uppercase;">
        ${esc(number)} // ${esc(title)}
      </td>
    </tr>`;
}

/**
 * Generates the premium newsletter HTML.
 * @param {object} data Optional custom data for the newsletter.
 */
function generateNewsletter(data = {}) {
  const issueNumber = data.issueNumber || '042';
  const issueDate = data.issueDate || 'JUNE 2026';
  
  // 1. Hero
  const heroHeadline = data.heroHeadline || 'THE SHAPING OF PERCEPTION.';
  const heroManifesto = data.heroManifesto || 'SeeTusk does not merely deliver creative work. We shape the digital interfaces, creator campaigns, and strategic narratives that define modern Indian brand culture. Every surface is an active agent of influence.';
  const heroImageUrl = data.heroImageUrl || 'https://seetusk.agency/images/g-editorial-v2.jpg';
  const heroImageCaption = data.heroImageCaption || 'STUDIO STUDY 08 / REDEFINING ATTENTION IN HIGH-NOISE MARKETS';

  // 2. Editor's Letter
  const editorTitle = data.editorTitle || 'Attention is rented. Trust is owned.';
  const editorBody = data.editorBody || `In an environment where every consumer is bombarded by a thousand digital signals a minute, the traditional marketing playbook is dead. You cannot buy attention; you can only earn it by building things that are intrinsically interesting. 
  
  At SeeTusk, we believe that the websites, the campaigns, and the brand systems we build are not static pieces of infrastructure. They are living, breathing artifacts that communicate who you are. This week, we explore the rise of brutalist minimalism in D2C platforms, and how Indian brands can leverage tactile, luxury aesthetics to build long-term premium positioning.`;
  const editorSignature = data.editorSignature || 'Sarthak / Founder, SeeTusk';

  // 3. Featured Perspective
  const perspectiveTitle = data.perspectiveTitle || 'THE DEATH OF THE CONVENTIONAL SURFACING';
  const perspectiveBody = data.perspectiveBody || `For years, SaaS and e-commerce companies hid behind clean, rounded-corner templates that felt safe, predictable, and ultimately forgettable. The homogenization of the web has created a visual drought. 
  
  We are seeing a massive cultural shift back toward editorial layout structures: sharp borders, generous white space, dynamic typographical hierarchy, and structural grids. It is what we call 'brutalist precision'—a design philosophy that values clarity and honesty over cheap visual tricks. When every other brand looks the same, distinctiveness is your greatest competitive advantage.`;
  const perspectiveQuote = data.perspectiveQuote || 'Design is not the decoration of a surface. It is the architectural blueprint of how information behaves.';

  // 4. Selected Works
  const works = data.works || [
    {
      title: 'AMBAR COFFEE // THE BRAND SYSTEM',
      challenge: 'Translating premium specialty coffee into a tactile digital experience.',
      outcome: '180% increase in direct-to-consumer online subscriptions within 60 days of relaunch.',
      imageUrl: 'https://seetusk.agency/images/ambar-coffee.png'
    },
    {
      title: 'FEVISTIK // CREATIVE CAMPAIGN',
      challenge: 'Re-anchoring a legacy brand into the lifestyle of young Indian creators.',
      outcome: '12M+ organic views, positioning a utility product as a modern creative tool.',
      imageUrl: 'https://seetusk.agency/images/g-fevistik.png'
    }
  ];

  // 5. Behind the Process
  const processHeadline = data.processHeadline || 'FROM RAW CONCEPT TO LIVE ARTIFACT.';
  const processBody = data.processBody || 'We document our design iterations not for self-indulgence, but to trace the evolution of thought. Below is a snapshot of our latest typography grids and layout prototypes for the SeeTusk visual system, balancing technical constraint with cinematic aesthetics.';
  const processImageUrl = data.processImageUrl || 'https://seetusk.agency/images/g-process.jpg';

  // 6. Creative Signals
  const signals = data.signals || [
    {
      type: 'DESIGN',
      title: 'THE RETURN OF PRINT ETHOS',
      desc: 'Why web platforms are adopting book-inspired serif typography and rigid layouts to command a premium feel.'
    },
    {
      type: 'AI',
      title: 'KINETIC GENERATIVE SURFACES',
      desc: 'Using machine intelligence to generate real-time ambient backgrounds that respond to user mouse physics.'
    },
    {
      type: 'BRANDING',
      title: 'SILENT LUXURY IN INDIAN FMCG',
      desc: 'A breakdown of how new-age home care brands are ditching loud colors for understated monochromatic packaging.'
    }
  ];

  // 7. Large Quote
  const quoteText = data.quoteText || 'CRAFT IS THE ONLY SUSTAINABLE COMPETITIVE ADVANTAGE.';

  // 8. Studio Updates
  const updates = data.updates || [
    {
      label: 'AWARDS',
      text: 'SeeTusk recognized by CSS Design Awards and Awwwards for our work on the Cycada interactive showcase.'
    },
    {
      label: 'EXPERIMENTS',
      text: 'Launched SCA-Mono: our in-house experimental monospace layout tool for rapid typography testing.'
    },
    {
      label: 'COMMUNITY',
      text: 'Hosting the Pune Creative Roundtable this July, focusing on the future of design engineering in India.'
    }
  ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SeeTusk Signals - Issue #${esc(issueNumber)}</title>
</head>
<body style="margin:0; padding:0; background-color:${BG_MAIN}; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_MAIN}; margin:0; padding:0; width:100%;">
    <tr>
      <td align="center" style="padding: 24px 12px 60px;">
        <!-- Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:650px; width:100%; border-collapse:collapse; margin:0 auto; background-color:${BG_MAIN};">
          
          <!-- Header -->
          <tr>
            <td style="padding: 0 0 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left" style="font-family: ${FONT_SANS}; font-size: 15px; font-weight: 900; letter-spacing: 2px; color: ${TEXT_LIGHT}; text-transform: uppercase; vertical-align: middle;">
                    SEETUSK
                  </td>
                  <td align="right" style="font-family: ${FONT_MONO}; font-size: 11px; font-weight: bold; letter-spacing: 1px; color: ${ACCENT}; text-transform: uppercase; vertical-align: middle;">
                    ISSUE ${esc(issueNumber)} // ${esc(issueDate)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          ${divider()}

          <!-- Hero Headline -->
          <tr>
            <td style="padding: 48px 0 24px;">
              <h1 style="margin:0; font-family: ${FONT_SERIF}; font-size: 46px; line-height: 1.1; font-weight: normal; letter-spacing: -2px; color: ${TEXT_LIGHT};">
                ${esc(heroHeadline)}
              </h1>
            </td>
          </tr>

          <!-- Hero Manifesto -->
          <tr>
            <td style="padding: 0 0 32px; font-family: ${FONT_SANS}; font-size: 15px; line-height: 1.6; color: ${TEXT_MUTED}; text-align: left;">
              ${esc(heroManifesto)}
            </td>
          </tr>

          <!-- Hero Visual -->
          <tr>
            <td style="padding: 0 0 16px;">
              <img src="${esc(heroImageUrl)}" alt="Cinematic Hero" width="650" style="width:100%; max-width:650px; display:block; height:auto; border: 1px solid ${BORDER};">
            </td>
          </tr>
          
          <!-- Hero Caption -->
          <tr>
            <td style="padding: 0 0 40px; font-family: ${FONT_MONO}; font-size: 10px; color: ${TEXT_MUTED}; letter-spacing: 1px; text-transform: uppercase;">
              ${esc(heroImageCaption)}
            </td>
          </tr>

          ${divider()}

          <!-- 01: Editor's Letter -->
          ${kicker('01', "EDITOR'S LETTER")}
          <tr>
            <td style="padding: 8px 0 20px;">
              <h2 style="margin:0; font-family: ${FONT_SERIF}; font-size: 26px; line-height: 1.25; font-weight: normal; color: ${TEXT_LIGHT};">
                ${esc(editorTitle)}
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 32px; font-family: ${FONT_SANS}; font-size: 15px; line-height: 1.65; color: ${TEXT_MUTED};">
              ${editorBody.split('\n\n').map(p => `<p style="margin:0 0 16px;">${esc(p.trim())}</p>`).join('')}
              <p style="margin: 24px 0 0; font-family: ${FONT_MONO}; font-size: 12px; font-weight: bold; color: ${ACCENT};">
                ${esc(editorSignature)}
              </p>
            </td>
          </tr>

          ${divider()}

          <!-- 02: Featured Perspective -->
          ${kicker('02', 'PERSPECTIVE')}
          <tr>
            <td style="padding: 8px 0 24px;">
              <h2 style="margin:0; font-family: ${FONT_SERIF}; font-size: 32px; line-height: 1.15; font-weight: normal; color: ${TEXT_LIGHT};">
                ${esc(perspectiveTitle)}
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 24px; font-family: ${FONT_SANS}; font-size: 15px; line-height: 1.65; color: ${TEXT_MUTED};">
              ${perspectiveBody.split('\n\n').map(p => `<p style="margin:0 0 16px;">${esc(p.trim())}</p>`).join('')}
            </td>
          </tr>
          <!-- Pull Quote -->
          <tr>
            <td style="padding: 16px 24px; margin: 16px 0; border-left: 2px solid ${ACCENT}; font-family: ${FONT_SERIF}; font-size: 19px; line-height: 1.5; color: ${TEXT_LIGHT}; font-style: italic;">
              "${esc(perspectiveQuote)}"
            </td>
          </tr>
          <tr><td style="padding: 24px 0 0;">&nbsp;</td></tr>

          ${divider()}

          <!-- 03: Selected Works -->
          ${kicker('03', 'SELECTED WORKS')}
          <tr>
            <td style="padding: 8px 0 40px;">
              <!-- Works List -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${works.map((work, idx) => `
                  <!-- Project Item -->
                  <tr>
                    <td style="padding: 0 0 12px;">
                      <img src="${esc(work.imageUrl)}" alt="${esc(work.title)}" width="650" style="width:100%; max-width:650px; display:block; height:auto; border: 1px solid ${BORDER};">
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0 12px; font-family: ${FONT_SANS}; font-size: 16px; font-weight: bold; color: ${TEXT_LIGHT}; letter-spacing: 1px;">
                      ${esc(work.title)}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0 0 24px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                        <tr>
                          <td width="30%" style="padding: 6px 12px 6px 0; font-family: ${FONT_MONO}; font-size: 11px; color: ${ACCENT}; text-transform: uppercase; font-weight: bold; vertical-align: top; border-bottom: 1px solid ${BORDER};">
                            Challenge:
                          </td>
                          <td style="padding: 6px 0; font-family: ${FONT_SANS}; font-size: 13px; color: ${TEXT_MUTED}; vertical-align: top; border-bottom: 1px solid ${BORDER};">
                            ${esc(work.challenge)}
                          </td>
                        </tr>
                        <tr>
                          <td width="30%" style="padding: 6px 12px 6px 0; font-family: ${FONT_MONO}; font-size: 11px; color: ${ACCENT}; text-transform: uppercase; font-weight: bold; vertical-align: top;">
                            Outcome:
                          </td>
                          <td style="padding: 6px 0; font-family: ${FONT_SANS}; font-size: 13px; color: ${TEXT_LIGHT}; vertical-align: top;">
                            ${esc(work.outcome)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ${idx < works.length - 1 ? `<tr><td style="padding: 20px 0;">&nbsp;</td></tr>` : ''}
                `).join('')}
              </table>
            </td>
          </tr>

          ${divider()}

          <!-- 04: Behind the Process -->
          ${kicker('04', 'BEHIND THE PROCESS')}
          <tr>
            <td style="padding: 8px 0 16px;">
              <h2 style="margin:0; font-family: ${FONT_SERIF}; font-size: 24px; line-height: 1.25; font-weight: normal; color: ${TEXT_LIGHT};">
                ${esc(processHeadline)}
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 24px; font-family: ${FONT_SANS}; font-size: 14px; line-height: 1.6; color: ${TEXT_MUTED};">
              ${esc(processBody)}
            </td>
          </tr>
          <tr>
            <td style="padding: 0 0 40px;">
              <img src="${esc(processImageUrl)}" alt="Process Archive" width="650" style="width:100%; max-width:650px; display:block; height:auto; border: 1px solid ${BORDER};">
            </td>
          </tr>

          ${divider()}

          <!-- 05: Creative Signals -->
          ${kicker('05', 'CREATIVE SIGNALS')}
          <tr>
            <td style="padding: 8px 0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${signals.map((sig, idx) => `
                  <tr>
                    <td style="padding: 18px; background-color: ${BG_CARD}; border: 1px solid ${BORDER};">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="font-family: ${FONT_MONO}; font-size: 10px; font-weight: bold; letter-spacing: 2px; color: ${ACCENT}; text-transform: uppercase;">
                            ${esc(sig.type)}
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 6px 0 8px; font-family: ${FONT_SERIF}; font-size: 18px; color: ${TEXT_LIGHT};">
                            ${esc(sig.title)}
                          </td>
                        </tr>
                        <tr>
                          <td style="font-family: ${FONT_SANS}; font-size: 13px; line-height: 1.5; color: ${TEXT_MUTED};">
                            ${esc(sig.desc)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  ${idx < signals.length - 1 ? `<tr><td style="padding: 8px 0; line-height:0; font-size:0;">&nbsp;</td></tr>` : ''}
                `).join('')}
              </table>
            </td>
          </tr>

          <!-- Typographic Quote Block -->
          <tr>
            <td style="padding: 56px 24px; background-color: ${BG_CARD}; border: 1px solid ${BORDER}; text-align: center;">
              <h2 style="margin:0; font-family: ${FONT_SERIF}; font-size: 28px; line-height: 1.3; font-weight: normal; color: ${TEXT_LIGHT}; letter-spacing: -1px;">
                "${esc(quoteText)}"
              </h2>
            </td>
          </tr>
          <tr><td style="padding: 24px 0 0;">&nbsp;</td></tr>

          ${divider()}

          <!-- 06: Studio Updates -->
          ${kicker('06', 'STUDIO DISPATCHES')}
          <tr>
            <td style="padding: 8px 0 48px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${updates.map((update, idx) => `
                  <tr>
                    <td valign="top" width="22%" style="padding: 8px 12px 8px 0; font-family: ${FONT_MONO}; font-size: 11px; font-weight: bold; color: ${ACCENT}; letter-spacing: 1px; vertical-align: top; border-bottom: 1px solid ${BORDER};">
                      ${esc(update.label)}
                    </td>
                    <td valign="top" style="padding: 8px 0; font-family: ${FONT_SANS}; font-size: 13px; line-height: 1.5; color: ${TEXT_MUTED}; vertical-align: top; border-bottom: 1px solid ${BORDER};">
                      ${esc(update.text)}
                    </td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>

          ${divider()}

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 48px 0 24px; font-family: ${FONT_SERIF}; font-size: 20px; line-height: 1.4; color: ${TEXT_LIGHT}; text-align: center; font-style: italic;">
              "Make them look. Make them care. Make them remember."
            </td>
          </tr>
          
          <tr>
            <td align="center" style="padding: 0 0 24px; text-align: center;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td style="font-family: ${FONT_MONO}; font-size: 11px; letter-spacing: 1px; color: ${TEXT_MUTED}; text-transform: uppercase;">
                    <a href="https://seetusk.agency" target="_blank" style="color: ${TEXT_MUTED}; text-decoration: none;">WEBSITE</a>
                    &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                    <a href="https://linkedin.com/company/seetusk" target="_blank" style="color: ${TEXT_MUTED}; text-decoration: none;">LINKEDIN</a>
                    &nbsp;&nbsp;&middot;&nbsp;&nbsp;
                    <a href="https://instagram.com/seetusk" target="_blank" style="color: ${TEXT_MUTED}; text-decoration: none;">INSTAGRAM</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <tr>
            <td align="center" style="font-family: ${FONT_MONO}; font-size: 10px; color: ${TEXT_MUTED}; text-align: center; letter-spacing: 1px; text-transform: uppercase; line-height: 1.5;">
              SEETUSK CREATIVE AGENCY / PUNE, IND<br>
              BUILT IN-HOUSE / &copy; 2026 ALL RIGHTS RESERVED
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = {
  generateNewsletter
};
