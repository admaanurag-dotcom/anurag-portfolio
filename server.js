const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'anuragreddyadma@gmail.com';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from project root
app.use(express.static(__dirname));

// Simple in-memory rate limiting to prevent spam (max 5 requests per minute per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown-ip';
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - userData.startTime > RATE_LIMIT_WINDOW_MS) {
    userData.count = 1;
    userData.startTime = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);

  if (userData.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait a minute before submitting again.'
    });
  }

  next();
}

// Helper: Setup Nodemailer Transporter
function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });
}

// POST /api/contact endpoint
app.post('/api/contact', rateLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Backend Input Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid name (at least 2 characters).'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a subject (at least 3 characters).'
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message (at least 10 characters).'
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    const submissionTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    const transporter = createTransporter();

    // If SMTP credentials are not configured yet, log warning and guide developer
    if (!transporter) {
      console.warn('⚠️ [SMTP WARNING] SMTP_USER or SMTP_PASS is missing in .env');
      return res.status(500).json({
        success: false,
        error: 'Email service is not yet configured. Please configure SMTP credentials in .env.'
      });
    }

    // HTML Email Template
    const htmlEmail = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff; color: #1e293b;">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 28px 24px; color: #ffffff;">
          <h2 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 700;">New Portfolio Message</h2>
          <p style="margin: 0; opacity: 0.9; font-size: 14px;">Received via Anurag Reddy Adma's Portfolio Website</p>
        </div>
        
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; width: 140px; font-weight: 600; color: #64748b; font-size: 14px;">Sender Name:</td>
              <td style="padding: 8px 0; font-size: 15px; color: #0f172a; font-weight: 600;">${escapeHtml(trimmedName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Sender Email:</td>
              <td style="padding: 8px 0; font-size: 15px;"><a href="mailto:${escapeHtml(trimmedEmail)}" style="color: #6366f1; text-decoration: none; font-weight: 500;">${escapeHtml(trimmedEmail)}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Subject:</td>
              <td style="padding: 8px 0; font-size: 15px; color: #0f172a;">${escapeHtml(trimmedSubject)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Submitted At:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #475569;">${submissionTime} (IST)</td>
            </tr>
          </table>

          <div style="background-color: #f8fafc; border-left: 4px solid #6366f1; padding: 18px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Message Content:</p>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${escapeHtml(trimmedMessage)}</p>
          </div>

          <div style="text-align: center; padding-top: 12px;">
            <a href="mailto:${escapeHtml(trimmedEmail)}?subject=Re: ${encodeURIComponent(trimmedSubject)}" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply directly to ${escapeHtml(trimmedName)}</a>
          </div>
        </div>

        <div style="background-color: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          This message was sent from your portfolio contact form. Reply-To header is set to ${escapeHtml(trimmedEmail)}.
        </div>
      </div>
    `;

    // Plain text fallback
    const textEmail = `
New Portfolio Message Received!
===============================

Sender: ${trimmedName} (${trimmedEmail})
Subject: ${trimmedSubject}
Date: ${submissionTime} (IST)

Message:
--------
${trimmedMessage}

---------------------------------------------------
Reply directly by replying to this email.
`;

    // Mail options with Reply-To set to visitor
    const mailOptions = {
      from: `"Portfolio Contact Form" <${process.env.SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      replyTo: `"${trimmedName}" <${trimmedEmail}>`,
      subject: `[Portfolio Inquiry] ${trimmedSubject} - from ${trimmedName}`,
      text: textEmail,
      html: htmlEmail
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ [EMAIL SENT] Message from ${trimmedName} (${trimmedEmail}) delivered to ${RECIPIENT_EMAIL}`);

    return res.status(200).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully to Anurag.'
    });

  } catch (error) {
    console.error('❌ [EMAIL ERROR]:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message due to a server error. Please try again later or email directly.'
    });
  }
});

// Helper: Escape HTML in email templates
function escapeHtml(string) {
  const matchHtmlRegExp = /["'&<>]/;
  if (!string) return '';
  const str = '' + string;
  const match = matchHtmlRegExp.exec(str);
  if (!match) return str;

  let escape;
  let html = '';
  let index = 0;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio server is running on http://localhost:${PORT}`);
});
