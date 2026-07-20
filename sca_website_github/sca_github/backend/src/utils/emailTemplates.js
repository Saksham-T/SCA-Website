'use strict';

/**
 * HTML email templates (HR notification, candidate acknowledgement, inquiry).
 *
 * Design constraints for cross-client rendering (Gmail, Outlook, Apple Mail):
 *   - table-based layout, ONLY inline style="" attributes (no <style> block),
 *   - centered card, max-width ~600px, width:100% so it adapts on mobile.
 *
 * All dynamic values are HTML-escaped here as a final XSS safeguard — inputs
 * come from a public form and email clients are an untrusted render surface.
 */

const config = require('../config');
const { generateNewsletter } = require('./newsletterTemplate');

// --- Brand palette (Midnight Modern - Website Aligned) ---
const PRIMARY = '#2E54EA'; // Electric Blue
const ACCENT = '#8597F1'; // Periwinkle / Links
const TEXT = '#F7F8FA'; // Cool white text
const MUTED = '#CDCFD6'; // Cool off-white/grey
const HAIR = '#2A2A30'; // Dark border lines
const BG_MAIN = '#0E0E11'; // Pure black/near-black page background
const BG_CARD = '#151519'; // Elevated dark card
const BG_ROW = '#1B1B22'; // Row label background
const company = config.mail.companyName;

// Resolve absolute logo URL using companyWebsite, fallback to seetusk.agency
const baseUrl = (config.mail.companyWebsite || 'https://seetusk.agency').replace(/\/$/, '');
const logoUrl = 'https://seetusk.agency/images/sca-logo-full.webp';

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

/** Turn a raw key like "expected_ctc" into a label "Expected CTC". */
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

/** Render an optional URL as a safe link, or a muted placeholder. */
function link(url) {
  if (!url || !String(url).trim()) return `<span style="color:#6C7284;">—</span>`;
  const safe = esc(url);
  return `<a href="${safe}" target="_blank" style="color:${ACCENT};text-decoration:none;word-break:break-all;">${safe}</a>`;
}

/** A muted em-dash for empty optional values. */
function orDash(value) {
  return value && String(value).trim() ? esc(value) : `<span style="color:#6C7284;">—</span>`;
}

/** A two-column (label / value) table row. */
function row(label, valueHtml) {
  return `
    <tr>
      <td style="padding:12px 16px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:${MUTED};background-color:${BG_ROW};border-bottom:1px solid ${HAIR};width:42%;vertical-align:top;">${esc(
        label
      )}</td>
      <td style="padding:12px 16px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:${TEXT};border-bottom:1px solid ${HAIR};vertical-align:top;">${valueHtml}</td>
    </tr>`;
}

/** A full-width section heading row inside a card. */
function sectionTitle(title) {
  return `<tr><td colspan="2" style="padding:18px 16px 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:${ACCENT};">${esc(
    title
  )}</td></tr>`;
}

/** A free-text block row (e.g. cover letter / brief). */
function noteRow(label, text) {
  const body = text && String(text).trim() ? esc(text) : `<em style="color:#6C7284;">Not provided</em>`;
  return `<tr><td colspan="2" style="padding:8px 16px 16px;font-family:Arial,Helvetica,sans-serif;">
      <div style="font-size:13px;font-weight:bold;color:${MUTED};margin-bottom:8px;">${esc(label)}</div>
      <div style="font-size:14px;line-height:1.6;color:${TEXT};white-space:pre-wrap;background-color:${BG_ROW};border-left:3px solid ${ACCENT};border-radius:4px;padding:12px 14px;">${body}</div>
    </td></tr>`;
}

/**
 * Table-based responsive shell. `title`/`subtitle` render under the header bar;
 * `bodyTable` is the inner content (already a <table> or rows wrapped below).
 */
function shell({ title, subtitle, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${BG_MAIN};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_MAIN};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:${BG_CARD};border-radius:10px;overflow:hidden;border:1px solid ${HAIR};border-top:6px solid ${PRIMARY};">
          <tr>
            <td style="padding:24px 28px 16px;font-family:Arial,Helvetica,sans-serif;border-bottom:1px solid ${HAIR};">
              <a href="${esc(baseUrl)}" target="_blank" style="text-decoration:none;">
                <img src="${logoUrl}" alt="${esc(company)}" height="28" style="display:block;height:28px;border:0;color:${TEXT};font-weight:bold;font-size:18px;">
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 4px;font-family:Arial,Helvetica,sans-serif;">
              <div style="font-size:20px;font-weight:bold;color:${TEXT};">${esc(title)}</div>
              ${subtitle ? `<div style="font-size:13px;color:${MUTED};margin-top:4px;">${subtitle}</div>` : ''}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 8px;">${bodyHtml}</td>
          </tr>
          <tr>
            <td style="padding:16px 28px 24px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#6C7284;text-align:center;border-top:1px solid ${HAIR};">
              This is an automated message from the ${esc(company)} Careers Portal.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Wrap label/value + section rows into a bordered card table. */
function card(rowsHtml) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${HAIR};border-radius:8px;border-collapse:separate;overflow:hidden;">${rowsHtml}</table>`;
}

/**
 * HR notification email.
 * @param {object} app Plain application object (as stored).
 */
function hrNotification(app) {
  const additionalRows = toEntries(app.additionalFields)
    .map(([k, val]) => row(humanizeKey(k), orDash(val)))
    .join('');

  const rows = [
    sectionTitle('Personal Info'),
    row('Full Name', `<strong>${orDash(app.fullName)}</strong>`),
    row('Email', app.email ? `<a href="mailto:${esc(app.email)}" style="color:${ACCENT};text-decoration:none;">${esc(app.email)}</a>` : orDash(app.email)),
    row('Phone', orDash(app.phone)),
    row('Location', orDash(app.location)),
    row('Country', orDash(app.country)),

    sectionTitle('Professional Details'),
    row('Position Applied For', orDash(app.position)),
    row('Years of Experience', orDash(app.yearsOfExperience)),
    row('LinkedIn', link(app.linkedin)),
    row('Portfolio', link(app.portfolio)),

    sectionTitle('Application Details'),
    row('Willing to Relocate', orDash(app.willingToRelocate)),
    row('Preferred Work Mode', orDash(app.preferredWorkMode)),
    row('Joining Availability', orDash(app.joiningAvailability)),

    additionalRows ? sectionTitle('Additional Information') + additionalRows : '',

    noteRow('Cover Letter', app.coverLetter),
    `<tr><td colspan="2" style="padding:0 16px 16px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};">📎 The candidate's resume is attached to this email.</td></tr>`,
  ].join('');

  const subtitle = `Submission ID: <strong style="color:${PRIMARY};">${esc(app.submissionId)}</strong> &middot; ${esc(
    new Date(app.createdAt || Date.now()).toUTCString()
  )}`;

  return shell({ title: 'New Job Application', subtitle, bodyHtml: card(rows) });
}

/**
 * Candidate acknowledgement email.
 * @param {object} app Plain application object (as stored).
 */
function candidateAcknowledgement(app) {
  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="font-family:Arial,Helvetica,sans-serif;">
      <p style="font-size:16px;color:${TEXT};margin:0 0 16px;">Hi ${esc(app.fullName)},</p>
      <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 16px;">
        Thank you for applying for the <strong style="color:${TEXT};">${esc(app.position)}</strong> role at ${esc(company)}.
        We've successfully received your application and our team will review it carefully.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_ROW};border:1px solid ${HAIR};border-radius:8px;margin:0 0 18px;">
        <tr><td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;">
          <div style="font-size:13px;color:${MUTED};margin-bottom:6px;">Your application reference</div>
          <div style="font-size:18px;font-weight:bold;color:${PRIMARY};letter-spacing:.5px;">${esc(app.submissionId)}</div>
        </td></tr>
      </table>
      <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 16px;">
        If your profile matches what we're looking for, we'll reach out to you at
        <strong style="color:${TEXT};">${esc(app.email)}</strong> with the next steps. No further action is needed right now.
      </p>
      <p style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 4px;">Warm regards,</p>
      <p style="font-size:14px;color:${TEXT};margin:0;font-weight:bold;">The ${esc(company)} Talent Team</p>
      <p style="margin:16px 0 0;"><a href="${esc(config.mail.companyWebsite)}" style="color:${ACCENT};font-size:13px;text-decoration:none;">${esc(
        config.mail.companyWebsite
      )}</a></p>
    </td></tr></table>`;

  return shell({ title: `Application received`, subtitle: '', bodyHtml });
}

/**
 * Branded notification email for new project inquiries.
 * @param {object} inquiry Plain inquiry object.
 */
function inquiryNotification(inquiry) {
  const rows = [
    sectionTitle('Contact Info'),
    row('Full Name', orDash(inquiry.name)),
    row('Company', orDash(inquiry.company)),
    row('Email', inquiry.email ? `<a href="mailto:${esc(inquiry.email)}" style="color:${ACCENT};text-decoration:none;">${esc(inquiry.email)}</a>` : orDash(inquiry.email)),
    row('Phone', orDash(inquiry.phone)),

    sectionTitle('Project Parameters'),
    row('Need / Vertical', orDash(inquiry.need)),
    row('Monthly Budget', orDash(inquiry.budget)),
    row('Timeline', orDash(inquiry.timeline)),

    noteRow('Brief Description', inquiry.brief),
  ].join('');

  const subtitle = `Received ${esc(new Date(inquiry.createdAt || Date.now()).toUTCString())}`;
  return shell({ title: 'New Project Inquiry', subtitle, bodyHtml: card(rows) });
}

module.exports = { hrNotification, candidateAcknowledgement, inquiryNotification, generateNewsletter, esc };
