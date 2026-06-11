const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { name, email, phone, role, portfolio, resumeBase64, resumeFilename, linkedin, twitter, why } = req.body;

    // Basic Validation
    if (!name || !email || !phone || !role || !portfolio || !resumeBase64 || !resumeFilename || !why) {
      return res.status(400).json({ error: 'Missing required candidate fields' });
    }

    // SMTP Config Check
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpTo = process.env.SMTP_TO || 'hr@seetusk.com';
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      console.error('SMTP configuration missing in environment variables.');
      return res.status(500).json({
        error: 'Email service configuration error. Please contact administration.',
        details: 'SMTP_HOST, SMTP_PORT, SMTP_USER, or SMTP_PASS environment variables are not defined on Vercel.'
      });
    }

    // Transporter Creation
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports (like 587)
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Decode base64 PDF
    let attachments = [];
    if (resumeBase64 && resumeFilename) {
      // Strip base64 header if present
      const base64Data = resumeBase64.includes('base64,') 
        ? resumeBase64.split('base64,')[1] 
        : resumeBase64;
      
      attachments.push({
        filename: resumeFilename,
        content: Buffer.from(base64Data, 'base64'),
        contentType: 'application/pdf'
      });
    }

    // Construct clean and premium HTML email template
    const mailOptions = {
      from: `"SeeTusk Careers" <${smtpFrom}>`,
      to: smtpTo,
      replyTo: `"${name}" <${email}>`,
      subject: `[New Application] ${name} - ${role}`,
      text: `
New Job Application Received:

Candidate Name: ${name}
Role Applied: ${role}
Email: ${email}
Phone: ${phone}
Portfolio: ${portfolio}
LinkedIn: ${linkedin || 'Not Provided'}
Twitter/X: ${twitter || 'Not Provided'}

---
What is the best thing they have built or shipped?
${why}
      `,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fafafa; color: #222;">
          <h2 style="color: #2e54ea; border-bottom: 2px solid #2e54ea; padding-bottom: 10px; margin-top: 0;">New Candidate Application</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #666;">Candidate Name:</td>
              <td style="padding: 8px 0; font-size: 15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Role Applied:</td>
              <td style="padding: 8px 0; font-size: 15px; font-weight: 600; color: #2e54ea;">${role}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Email Address:</td>
              <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${email}" style="color: #2e54ea; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone Number:</td>
              <td style="padding: 8px 0; font-size: 15px;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Portfolio Link:</td>
              <td style="padding: 8px 0; font-size: 15px;"><a href="${portfolio}" target="_blank" style="color: #2e54ea; text-decoration: underline;">${portfolio}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">LinkedIn:</td>
              <td style="padding: 8px 0; font-size: 15px;">
                ${linkedin ? `<a href="${linkedin}" target="_blank" style="color: #2e54ea; text-decoration: underline;">${linkedin}</a>` : '<span style="color: #999; font-style: italic;">Not Provided</span>'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #666;">Twitter/X:</td>
              <td style="padding: 8px 0; font-size: 15px;">
                ${twitter ? `<a href="${twitter}" target="_blank" style="color: #2e54ea; text-decoration: underline;">${twitter}</a>` : '<span style="color: #999; font-style: italic;">Not Provided</span>'}
              </td>
            </tr>
          </table>

          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #2e54ea; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <h4 style="margin-top: 0; margin-bottom: 8px; color: #333;">What is the best thing you\'ve built or shipped?</h4>
            <p style="margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #444;">${why}</p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #888; text-align: center;">
            This application was submitted via SeeTusk Careers Portal. Resume PDF is attached to this email.
          </div>
        </div>
      `,
      attachments: attachments
    };

    // Send the mail
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: 'Application submitted successfully' });

  } catch (error) {
    console.error('SMTP Error:', error);
    return res.status(500).json({ error: 'Failed to send candidate email', details: error.message });
  }
};
