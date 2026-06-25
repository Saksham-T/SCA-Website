'use strict';

/**
 * HTML email templates for HR notification and candidate acknowledgement.
 * All dynamic values are HTML-escaped here as a final XSS safeguard — even
 * though inputs are sanitized upstream, email clients are an untrusted render
 * surface and we never want stored values to execute.
 */

const config = require('../config');

/** Escape a value for safe interpolation into HTML. */
function esc(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const brand = config.mail.brandColor;
const company = config.mail.companyName;

// Dark/premium palette. `accent` is a brightened brand tone that reads well on
// a near-black surface; email clients don't support CSS vars so values are
// inlined throughout.
const PAGE_BG = '#08080b';
const CARD_BG = '#121218';
const PANEL_BG = '#1a1a22';
const TEXT = '#e8e8ee';
const MUTED = '#8a8a9a';
const HAIR = '#2a2a34';
const ACCENT = '#6c8cff';

/** Render an optional URL as a link, or a muted "Not provided" placeholder. */
function link(url) {
  if (!url) return `<span style="color:${MUTED};font-style:italic;">Not provided</span>`;
  const safe = esc(url);
  return `<a href="${safe}" target="_blank" style="color:${ACCENT};text-decoration:none;border-bottom:1px solid rgba(108,140,255,.4);">${safe}</a>`;
}

/** A two-column label/value table row. */
function row(label, value) {
  return `
    <tr>
      <td style="padding:11px 14px;font-weight:600;color:${MUTED};width:190px;vertical-align:top;background:${PANEL_BG};border-bottom:1px solid ${HAIR};font-size:13px;">${esc(label)}</td>
      <td style="padding:11px 14px;color:${TEXT};vertical-align:top;border-bottom:1px solid ${HAIR};font-size:14px;">${value}</td>
    </tr>`;
}

/** Turn a raw field key like "expected_ctc" into a label "Expected CTC". */
function humanizeKey(key) {
  return String(key)
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Normalise additionalFields (Map or plain object) to [key, value] pairs. */
function toEntries(fields) {
  if (!fields) return [];
  if (fields instanceof Map) return Array.from(fields.entries());
  return Object.entries(fields);
}

/** Section heading used inside the HR email. */
function sectionTitle(title) {
  return `<h3 style="margin:30px 0 10px;color:${ACCENT};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">${esc(title)}</h3>`;
}

function shell(innerHtml) {
  return `
  <div style="background:${PAGE_BG};padding:32px 0;">
    <div style="font-family:'Segoe UI',Tahoma,Arial,sans-serif;max-width:640px;margin:0 auto;background:${CARD_BG};border-radius:14px;overflow:hidden;border:1px solid ${HAIR};box-shadow:0 0 0 1px rgba(108,140,255,.08),0 20px 60px rgba(0,0,0,.5);">
      <div style="background:linear-gradient(135deg,#1a1f3a 0%,#0d0d14 100%);padding:24px 28px;border-bottom:1px solid ${HAIR};">
        <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:.5px;">${esc(company)}</span>
        <span style="color:${ACCENT};font-size:18px;font-weight:700;letter-spacing:.5px;"> Careers</span>
      </div>
      <div style="padding:28px;">${innerHtml}</div>
      <div style="padding:18px 28px;border-top:1px solid ${HAIR};font-size:11px;color:${MUTED};text-align:center;letter-spacing:.3px;">
        This is an automated message from the ${esc(company)} Careers Portal.
      </div>
    </div>
  </div>`;
}

/**
 * HR notification email.
 * @param {object} app Plain application object (as stored).
 */
function hrNotification(app) {
  const additionalEntries = toEntries(app.additionalFields);
  const additional = additionalEntries.length
    ? sectionTitle('Additional Information') +
      `<table style="width:100%;border-collapse:collapse;border:1px solid ${HAIR};border-radius:8px;overflow:hidden;">` +
      additionalEntries.map(([k, val]) => row(humanizeKey(k), esc(val))).join('') +
      '</table>'
    : '';

  const inner = `
    <p style="margin:0 0 4px;font-size:17px;color:${TEXT};font-weight:600;">New career application received</p>
    <p style="margin:0 0 8px;color:${MUTED};font-size:13px;">
      Submission ID: <strong style="color:${ACCENT};">${esc(app.submissionId)}</strong> &middot;
      ${esc(new Date(app.createdAt || Date.now()).toUTCString())}
    </p>

    ${sectionTitle('Personal Info')}
    <table style="width:100%;border-collapse:collapse;border:1px solid ${HAIR};border-radius:8px;overflow:hidden;">
      ${row('Full Name', esc(app.fullName))}
      ${row('Email', `<a href="mailto:${esc(app.email)}" style="color:${ACCENT};text-decoration:none;">${esc(app.email)}</a>`)}
      ${row('Phone', esc(app.phone))}
      ${row('Location', esc(app.location))}
      ${row('Country', esc(app.country))}
    </table>

    ${sectionTitle('Professional Details')}
    <table style="width:100%;border-collapse:collapse;border:1px solid ${HAIR};border-radius:8px;overflow:hidden;">
      ${row('Position Applied For', esc(app.position))}
      ${row('Years of Experience', esc(app.yearsOfExperience))}
      ${row('LinkedIn', link(app.linkedin))}
      ${row('Portfolio', link(app.portfolio))}
    </table>

    ${sectionTitle('Application Details')}
    <table style="width:100%;border-collapse:collapse;border:1px solid ${HAIR};border-radius:8px;overflow:hidden;">
      ${row('Willing to Relocate', esc(app.willingToRelocate))}
      ${row('Preferred Work Mode', esc(app.preferredWorkMode))}
      ${row('Joining Availability', esc(app.joiningAvailability))}
    </table>

    ${additional}

    ${sectionTitle('Cover Letter')}
    <div style="background:${PANEL_BG};border-left:3px solid ${ACCENT};padding:14px 16px;border-radius:6px;white-space:pre-wrap;line-height:1.6;color:${TEXT};font-size:14px;">${
      app.coverLetter ? esc(app.coverLetter) : `<em style="color:${MUTED};">No cover letter provided.</em>`
    }</div>

    <p style="margin:24px 0 0;font-size:12px;color:${MUTED};">📎 The candidate's resume is attached to this email.</p>
  `;
  return shell(inner);
}

/**
 * Candidate acknowledgement email.
 * @param {object} app Plain application object (as stored).
 */
function candidateAcknowledgement(app) {
  const inner = `
    <p style="font-size:16px;color:${TEXT};margin:0 0 16px;">Hi ${esc(app.fullName)},</p>
    <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 16px;">
      Thank you for applying for the <strong style="color:${TEXT};">${esc(app.position)}</strong> role at ${esc(company)}.
      We've successfully received your application and our team will review it carefully.
    </p>
    <div style="background:${PANEL_BG};border:1px solid ${HAIR};border-radius:8px;padding:16px 18px;margin:0 0 18px;">
      <p style="margin:0 0 6px;font-size:13px;color:${MUTED};">Your application reference</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:${ACCENT};letter-spacing:.5px;">${esc(app.submissionId)}</p>
    </div>
    <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 16px;">
      If your profile matches what we're looking for, we'll reach out to you at
      <strong style="color:${TEXT};">${esc(app.email)}</strong> with the next steps. No further action is needed from your side right now.
    </p>
    <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 4px;">Warm regards,</p>
    <p style="font-size:14px;color:${TEXT};margin:0;font-weight:600;">The ${esc(company)} Talent Team</p>
    <p style="margin:16px 0 0;">
      <a href="${esc(config.mail.companyWebsite)}" style="color:${ACCENT};font-size:13px;text-decoration:none;">${esc(config.mail.companyWebsite)}</a>
    </p>
  `;
  return shell(inner);
}

/**
 * Branded notification email for new project inquiries.
 * @param {object} inquiry Plain inquiry object.
 */
function inquiryNotification(inquiry) {
  const inner = `
    <p style="margin:0 0 4px;font-size:17px;color:${TEXT};font-weight:600;">New project inquiry received</p>
    <p style="margin:0 0 8px;color:${MUTED};font-size:13px;">
      Received: <strong style="color:${TEXT};">${esc(new Date(inquiry.createdAt || Date.now()).toUTCString())}</strong>
    </p>

    ${sectionTitle('Contact Info')}
    <table style="width:100%;border-collapse:collapse;border:1px solid ${HAIR};border-radius:8px;overflow:hidden;">
      ${row('Full Name', esc(inquiry.name))}
      ${row('Company', esc(inquiry.company))}
      ${row('Email', `<a href="mailto:${esc(inquiry.email)}" style="color:${ACCENT};text-decoration:none;">${esc(inquiry.email)}</a>`)}
      ${row('Phone', inquiry.phone ? esc(inquiry.phone) : `<em style="color:${MUTED};">Not provided</em>`)}
    </table>

    ${sectionTitle('Project Parameters')}
    <table style="width:100%;border-collapse:collapse;border:1px solid ${HAIR};border-radius:8px;overflow:hidden;">
      ${row('Need / Vertical', esc(inquiry.need))}
      ${row('Monthly Budget', esc(inquiry.budget))}
      ${row('Timeline', esc(inquiry.timeline))}
    </table>

    ${sectionTitle('Brief Description')}
    <div style="background:${PANEL_BG};border-left:3px solid ${ACCENT};padding:14px 16px;border-radius:6px;white-space:pre-wrap;line-height:1.6;color:${TEXT};font-size:14px;">${
      esc(inquiry.brief)
    }</div>
  `;
  return shell(inner);
}

module.exports = { hrNotification, candidateAcknowledgement, inquiryNotification, esc };
