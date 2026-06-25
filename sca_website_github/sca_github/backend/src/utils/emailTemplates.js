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

/** Render an optional URL as a link, or a muted "Not provided" placeholder. */
function link(url) {
  if (!url) return '<span style="color:#999;font-style:italic;">Not provided</span>';
  const safe = esc(url);
  return `<a href="${safe}" target="_blank" style="color:${brand};text-decoration:underline;">${safe}</a>`;
}

/** A two-column label/value table row. */
function row(label, value) {
  return `
    <tr>
      <td style="padding:8px 12px;font-weight:600;color:#555;width:190px;vertical-align:top;background:#f6f7fb;">${esc(label)}</td>
      <td style="padding:8px 12px;color:#222;vertical-align:top;">${value}</td>
    </tr>`;
}

/** Section heading used inside the HR email. */
function sectionTitle(title) {
  return `<h3 style="margin:28px 0 8px;color:${brand};font-size:15px;letter-spacing:.3px;text-transform:uppercase;">${esc(title)}</h3>`;
}

function shell(innerHtml) {
  return `
  <div style="background:#eef0f5;padding:24px 0;">
    <div style="font-family:'Segoe UI',Tahoma,Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid #e3e6ee;">
      <div style="background:${brand};padding:20px 28px;">
        <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:.5px;">${esc(company)} Careers</span>
      </div>
      <div style="padding:28px;">${innerHtml}</div>
      <div style="padding:16px 28px;border-top:1px solid #eee;font-size:11px;color:#999;text-align:center;">
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
  const additional =
    app.additionalFields && Object.keys(app.additionalFields).length
      ? sectionTitle('Additional Information') +
        '<table style="width:100%;border-collapse:collapse;border:1px solid #eee;">' +
        Object.entries(app.additionalFields)
          .map(([k, v]) => row(k, esc(v)))
          .join('') +
        '</table>'
      : '';

  const inner = `
    <p style="margin:0 0 4px;font-size:16px;color:#222;">New career application received</p>
    <p style="margin:0 0 8px;color:#666;font-size:13px;">
      Submission ID: <strong>${esc(app.submissionId)}</strong> &middot;
      ${esc(new Date(app.createdAt || Date.now()).toUTCString())}
    </p>

    ${sectionTitle('Personal Info')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
      ${row('Full Name', esc(app.fullName))}
      ${row('Email', `<a href="mailto:${esc(app.email)}" style="color:${brand};">${esc(app.email)}</a>`)}
      ${row('Phone', esc(app.phone))}
      ${row('Location', esc(app.location))}
      ${row('Country', esc(app.country))}
    </table>

    ${sectionTitle('Professional Details')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
      ${row('Position Applied For', esc(app.position))}
      ${row('Years of Experience', esc(app.yearsOfExperience))}
      ${row('LinkedIn', link(app.linkedin))}
      ${row('Portfolio', link(app.portfolio))}
    </table>

    ${sectionTitle('Application Details')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
      ${row('Willing to Relocate', esc(app.willingToRelocate))}
      ${row('Preferred Work Mode', esc(app.preferredWorkMode))}
      ${row('Joining Availability', esc(app.joiningAvailability))}
    </table>

    ${additional}

    ${sectionTitle('Cover Letter')}
    <div style="background:#f9fafc;border-left:4px solid ${brand};padding:14px 16px;border-radius:4px;white-space:pre-wrap;line-height:1.6;color:#333;font-size:14px;">${
      app.coverLetter ? esc(app.coverLetter) : '<em style="color:#999;">No cover letter provided.</em>'
    }</div>

    <p style="margin:24px 0 0;font-size:12px;color:#888;">The candidate's resume is attached to this email.</p>
  `;
  return shell(inner);
}

/**
 * Candidate acknowledgement email.
 * @param {object} app Plain application object (as stored).
 */
function candidateAcknowledgement(app) {
  const inner = `
    <p style="font-size:16px;color:#222;margin:0 0 16px;">Hi ${esc(app.fullName)},</p>
    <p style="font-size:14px;line-height:1.7;color:#444;margin:0 0 16px;">
      Thank you for applying for the <strong>${esc(app.position)}</strong> role at ${esc(company)}.
      We've successfully received your application and our team will review it carefully.
    </p>
    <div style="background:#f9fafc;border:1px solid #e6e9f2;border-radius:8px;padding:16px 18px;margin:0 0 18px;">
      <p style="margin:0 0 6px;font-size:13px;color:#666;">Your application reference</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:${brand};letter-spacing:.5px;">${esc(app.submissionId)}</p>
    </div>
    <p style="font-size:14px;line-height:1.7;color:#444;margin:0 0 16px;">
      If your profile matches what we're looking for, we'll reach out to you at
      <strong>${esc(app.email)}</strong> with the next steps. No further action is needed from your side right now.
    </p>
    <p style="font-size:14px;line-height:1.7;color:#444;margin:0 0 4px;">Warm regards,</p>
    <p style="font-size:14px;color:#222;margin:0;font-weight:600;">The ${esc(company)} Talent Team</p>
    <p style="margin:16px 0 0;">
      <a href="${esc(config.mail.companyWebsite)}" style="color:${brand};font-size:13px;">${esc(config.mail.companyWebsite)}</a>
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
    <p style="margin:0 0 4px;font-size:16px;color:#222;">New project inquiry received</p>
    <p style="margin:0 0 8px;color:#666;font-size:13px;">
      Received: <strong>${esc(new Date(inquiry.createdAt || Date.now()).toUTCString())}</strong>
    </p>

    ${sectionTitle('Contact Info')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
      ${row('Full Name', esc(inquiry.name))}
      ${row('Company', esc(inquiry.company))}
      ${row('Email', `<a href="mailto:${esc(inquiry.email)}" style="color:${brand};">${esc(inquiry.email)}</a>`)}
      ${row('Phone', inquiry.phone ? esc(inquiry.phone) : '<em style="color:#999;">Not provided</em>')}
    </table>

    ${sectionTitle('Project Parameters')}
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;">
      ${row('Need / Vertical', esc(inquiry.need))}
      ${row('Monthly Budget', esc(inquiry.budget))}
      ${row('Timeline', esc(inquiry.timeline))}
    </table>

    ${sectionTitle('Brief Description')}
    <div style="background:#f9fafc;border-left:4px solid ${brand};padding:14px 16px;border-radius:4px;white-space:pre-wrap;line-height:1.6;color:#333;font-size:14px;">${
      esc(inquiry.brief)
    }</div>
  `;
  return shell(inner);
}

module.exports = { hrNotification, candidateAcknowledgement, inquiryNotification, esc };
