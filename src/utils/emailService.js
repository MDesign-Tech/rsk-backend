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

const sendOTPEmail = async (to, otp, companyInfo = {}) => {
  const transporter = createTransporter();

  const companyName = companyInfo.companyName || 'RSK Associates';
  const companyAddress = companyInfo.companyAddress || 'KIMIRONKO, KG 11 Ave, Kigali';
  const companyPhone = companyInfo.companyPhone || '+250 788 492 529';

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
        .header { background-color: #1a365d; padding: 30px; text-align: center; }
        .header img { max-height: 60px; }
        .content { padding: 40px 30px; }
        .otp-box { background-color: #f0f4f8; border: 2px dashed #1a365d; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #1a365d; letter-spacing: 8px; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
        .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://rsk-associates.com/logo.png" alt="${companyName} Logo" onerror="this.style.display='none'; this.parentElement.innerHTML+='<div style=\\'color:#ffffff;font-size:20px;font-weight:bold;\\'>${companyName}</div>';" />
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>You requested to reset your password. Use the following One-Time Password (OTP) to verify your email address:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <div class="warning">
            <strong>Security Notice:</strong> If you did not request this password reset, please ignore this email or contact our support team immediately.
          </div>
          <p>For security reasons, do not share this OTP with anyone.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          <p>${companyAddress} | ${companyPhone}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: `Verify Your Email - ${companyName} Password Reset`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

const sendReplyEmail = async (to, subject, message, companyInfo = {}) => {
  const transporter = createTransporter();

  const companyName = companyInfo.companyName || 'RSK Associates';
  const companyAddress = companyInfo.companyAddress || 'KIMIRONKO, KG 11 Ave, Kigali';
  const companyPhone = companyInfo.companyPhone || '+250 788 492 529';

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
        .header { background-color: #1a365d; padding: 30px; text-align: center; }
        .header img { max-height: 60px; }
        .content { padding: 40px 30px; }
        .reply-box { background-color: #f0f4f8; border-left: 4px solid #1a365d; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .footer { background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #666666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://rsk-associates.com/logo.png" alt="${companyName} Logo" onerror="this.style.display='none'; this.parentElement.innerHTML+='<div style=\\'color:#ffffff;font-size:20px;font-weight:bold;\\'>${companyName}</div>';" />
        </div>
        <div class="content">
          <h2>${subject}</h2>
          <p>Dear Valued Client,</p>
          <p>Thank you for reaching out to ${companyName}. We have reviewed your message and here is our response:</p>
          <div class="reply-box">
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p>If you have any further questions or need additional assistance, please do not hesitate to contact us.</p>
          <p>Best regards,<br><strong>${companyName} Team</strong></p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
          <p>${companyAddress} | ${companyPhone}</p>
        </div>
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

module.exports = {
  sendOTPEmail,
  sendReplyEmail,
};
