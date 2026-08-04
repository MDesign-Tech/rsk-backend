const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

const verifyTransporter = async () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      'Gmail SMTP credentials are not configured. ' +
      'Please set GMAIL_USER and GMAIL_APP_PASSWORD in your environment variables.'
    );
  }

  const transporter = createTransporter();

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    const errorMessage = error.message || 'Unknown SMTP error';

    if (error.code === 'EAUTH') {
      throw new Error(
        `Gmail SMTP authentication failed (EAUTH). ` +
        `The GMAIL_USER or GMAIL_APP_PASSWORD credentials are invalid. ` +
        `Please verify your Gmail account credentials and app password. ` +
        `Original error: ${errorMessage}`
      );
    }

    throw new Error(`SMTP connection verification failed: ${errorMessage}`);
  }
};

const getSocialMediaIcons = (socialMedia) => {
  if (!socialMedia) return '';
  const icons = [];
  const platforms = [
    { key: 'facebook', label: 'Facebook', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
    { key: 'instagram', label: 'Instagram', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="5" fill="currentColor"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>' },
    { key: 'whatsapp', label: 'WhatsApp', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>' },
    { key: 'x', label: 'X / Twitter', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { key: 'linkedin', label: 'LinkedIn', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
    { key: 'youtube', label: 'YouTube', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>' },
    { key: 'tiktok', label: 'TikTok', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>' },
    { key: 'snapchat', label: 'Snapchat', svg: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-3.19 0-5.88 1.55-7.41 3.9L0 4v8l5.17-.01C5.57 11.55 8.35 10 12 10s6.43 1.55 6.83 4.01L24 4V3l-6.79 3.13C18.18 1.55 15.39 0 12 0zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/></svg>' },
  ];

  for (const platform of platforms) {
    const link = socialMedia[platform.key];
    if (link && link.href) {
      icons.push(`<a href="${link.href}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background-color:#f0f4f8;margin:0 4px;text-decoration:none;" aria-label="${platform.label}">${platform.svg}</a>`);
    }
  }

  return icons.join('');
};

const getFooterHtml = (companyInfo) => {
  const companyName = 'RSK Associates';
  const companyAddress = companyInfo.companyAddress || 'KIMIRONKO, KG 11 Ave, Kigali';
  const companyPhone = companyInfo.companyPhone || '+250 788 492 529';
  const companyEmail = companyInfo.companyEmail || 'info@rsk-associates.com';

  return `
    <div class="footer">
      <div class="footer-contact">
        <p><strong>${companyName}</strong></p>
        <p>${companyPhone} | ${companyEmail}</p>
        <p>${companyAddress}</p>
      </div>
      <div class="footer-copy">
        <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
      </div>
    </div>
  `;
};

const sendOTPEmail = async (to, otp, clientName, companyInfo = {}) => {
  const transporter = createTransporter();

  const name = clientName === "me" ? 'companyName' : clientName;
  const companyName = companyInfo.companyName || 'RSK Associates';
  const companyLogo = companyInfo.companyLogo || 'https://rsk-dev.vercel.app/rsk-logo.svg';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - ${companyName}</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .logo-section { padding: 30px 30px 10px 30px; text-align: center; background-color: #ffffff; }
        .logo-section img { max-height: 80px; width: auto; }
        .content { padding: 20px 30px 40px 30px; }
        .greeting { font-size: 18px; color: #1a365d; margin: 0 0 20px 0; font-weight: normal; }
        .message { font-size: 15px; color: #333333; line-height: 1.6; margin: 0 0 20px 0; }
        .otp-box { background-color: #f0f4f8; border: 2px dashed #1a365d; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #1a365d; letter-spacing: 8px; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 13px; color: #666666; border-top: 1px solid #e0e0e0; }
        .footer-social { margin-bottom: 15px; }
        .footer-social a { display: inline-flex; }
        .footer-contact { margin-bottom: 10px; line-height: 1.8; }
        .footer-contact p { margin: 4px 0; }
        .footer-copy { font-size: 12px; color: #999999; border-top: 1px solid #e0e0e0; padding-top: 10px; margin-top: 10px; }
        @media only screen and (max-width: 600px) {
          .container { max-width: 100%; border-radius: 0; }
          .content { padding: 20px 15px 30px 15px; }
          .logo-section { padding: 20px 15px 10px 15px; }
          .footer { padding: 20px 15px; }
          .otp-code { font-size: 24px; letter-spacing: 4px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="${companyLogo}" alt="${companyName} Logo" onerror="this.style.display='none';" />
        </div>
        <div class="content">
          <p class="greeting">Hello ${name}.</p>
          <p class="message">You requested to reset your password. Use the following One-Time Password (OTP) to verify your email address:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p class="message">If you did not request this password reset, please ignore this email.</p>
        </div>
        ${getFooterHtml(companyInfo)}
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: `Password Reset`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    if (error.code === 'EAUTH') {
      throw new Error(
        `Gmail SMTP authentication failed. The GMAIL_USER or GMAIL_APP_PASSWORD ` +
        `credentials are invalid or revoked. Please update your environment variables. ` +
        `Original error: ${error.message}`
      );
    }
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

const sendReplyEmail = async (to, subject, message, clientName, companyInfo = {}) => {
  const transporter = createTransporter();

  const name = clientName === "me" ? 'companyName' : clientName;
  const companyName = companyInfo.companyName || 'RSK Associates';
  const companyLogo = companyInfo.companyLogo || 'https://rsk-dev.vercel.app/rsk-logo.svg';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .logo-section { padding: 30px 30px 10px 30px; text-align: center; background-color: #ffffff; }
        .logo-section img { max-height: 80px; width: auto; }
        .content { padding: 20px 30px 40px 30px; }
        .greeting { font-size: 18px; color: #1a365d; margin: 0 0 20px 0; font-weight: normal; }
        .message { font-size: 15px; color: #333333; line-height: 1.6; margin: 0 0 20px 0; }
        .reply-section { background-color: #f0f4f8; border-left: 4px solid #1a365d; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .reply-content { font-size: 15px; color: #333333; line-height: 1.6; }
        .reply-content img { max-width: 100%; height: auto; }
        .reply-content table { max-width: 100%; }
        .signature { font-size: 15px; color: #333333; line-height: 1.6; margin-top: 20px; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 13px; color: #666666; border-top: 1px solid #e0e0e0; }
        .footer-social { margin-bottom: 15px; }
        .footer-social a { display: inline-flex; }
        .footer-contact { margin-bottom: 10px; line-height: 1.8; }
        .footer-contact p { margin: 4px 0; }
        .footer-copy { font-size: 12px; color: #999999; border-top: 1px solid #e0e0e0; padding-top: 10px; margin-top: 10px; }
        @media only screen and (max-width: 600px) {
          .container { max-width: 100%; border-radius: 0; }
          .content { padding: 20px 15px 30px 15px; }
          .logo-section { padding: 20px 15px 10px 15px; }
          .footer { padding: 20px 15px; }
          .reply-section { padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="${companyLogo}" alt="${companyName} Logo" onerror="this.style.display='none';" />
        </div>
        <div class="content">
          <p class="greeting">Hello ${name}.</p>
          <p class="message">Thank you for reaching out to ${companyName}. Here is our response to your inquiry:</p>
          <div class="reply-section">
            <div class="reply-content">${message}</div>
          </div>
          <p class="signature">Best regards,<br><strong>${companyName} Team</strong></p>
        </div>
        ${getFooterHtml(companyInfo)}
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

    await transporter.sendMail(mailOptions);
};

const sendContactNotificationEmail = async (clientName, clientEmail, message, companyInfo = {}) => {
  const transporter = createTransporter();

  const companyName = 'RSK Associates';
  const companyEmail = companyInfo.companyEmail || 'rskassociatesltd@gmail.com';
  const companyLogo = companyInfo.companyLogo || 'https://rsk-dev.vercel.app/rsk-logo.svg';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message - ${companyName}</title>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .logo-section { padding: 30px 30px 10px 30px; text-align: center; background-color: #ffffff; }
        .logo-section img { max-height: 80px; width: auto; }
        .content { padding: 20px 30px 40px 30px; }
        .greeting { font-size: 18px; color: #1a365d; margin: 0 0 20px 0; font-weight: normal; }
        .message { font-size: 15px; color: #333333; line-height: 1.6; margin: 0 0 20px 0; }
        .message-box { background-color: #f0f4f8; border-left: 4px solid #1a365d; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .message-content { font-size: 15px; color: #333333; line-height: 1.6; }
        .sender-info { font-size: 14px; color: #666666; margin-top: 10px; }
        .sender-info strong { color: #1a365d; }
        .footer { background-color: #f8f9fa; padding: 30px; text-align: center; font-size: 13px; color: #666666; border-top: 1px solid #e0e0e0; }
        .footer-social { margin-bottom: 15px; }
        .footer-social a { display: inline-flex; }
        .footer-contact { margin-bottom: 10px; line-height: 1.8; }
        .footer-contact p { margin: 4px 0; }
        .footer-copy { font-size: 12px; color: #999999; border-top: 1px solid #e0e0e0; padding-top: 10px; margin-top: 10px; }
        @media only screen and (max-width: 600px) {
          .container { max-width: 100%; border-radius: 0; }
          .content { padding: 20px 15px 30px 15px; }
          .logo-section { padding: 20px 15px 10px 15px; }
          .footer { padding: 20px 15px; }
          .message-box { padding: 15px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-section">
          <img src="${companyLogo}" alt="${companyName} Logo" onerror="this.style.display='none';" />
        </div>
        <div class="content">
          <p class="greeting">Hello ${companyName} Team,</p>
          <p class="message">You have received a new contact message from your website. Here are the details:</p>
          <div class="message-box">
            <div class="message-content">${message.replace(/\n/g, '<br>')}</div>
            <div class="sender-info">
              <strong>From:</strong> ${clientName} <${clientEmail}>
            </div>
          </div>
          <p class="message">Click reply to respond directly to <strong>${clientName}</strong> at <a href="mailto:${clientEmail}">${clientEmail}</a>.</p>
        </div>
        ${getFooterHtml(companyInfo)}
      </div>
    </body>
    </html>
  `;

  const adminEmail = process.env.ADMIN_EMAIL || companyEmail || 'rskassociatesltd@gmail.com';

  const mailOptions = {
    from: `"${clientName}" <${process.env.GMAIL_USER}>`,
    to: adminEmail,
    replyTo: clientEmail,
    subject: `New Contact Message from ${clientName} - ${companyName}`,
    html: htmlContent,
  };

    await transporter.sendMail(mailOptions);
};

module.exports = {
  createTransporter,
  verifyTransporter,
  sendOTPEmail,
  sendReplyEmail,
  sendContactNotificationEmail,
};
