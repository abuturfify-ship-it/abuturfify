const fs = require('fs');
const path = require('path');

// Ensure .env is loaded if running locally
try {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
    envLines.forEach(l => {
      const idx = l.indexOf('=');
      if (idx > 0) {
        const k = l.substring(0, idx).trim();
        let v = l.substring(idx + 1).trim();
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
        if (k && !process.env[k]) process.env[k] = v;
      }
    });
  }
} catch (e) {}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const email = (body.email || '').trim().toLowerCase();
  const type = body.type || 'signup';
  const name = body.name || '';
  const role = body.role || 'player';
  const phone = body.phone || '';
  const password = body.password || '';

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email address is required.' });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Persist OTP to database file
  const dbPath = path.join(__dirname, '..', 'turfify_database.json');
  try {
    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (!db.pending_otps) db.pending_otps = {};
      db.pending_otps[email] = {
        otp, expiresAt, type,
        createdAt: new Date().toISOString(),
        userData: type === 'signup' ? { name, email, phone, role, password } : null
      };
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    }
  } catch (err) {
    console.warn('DB write notice:', err.message);
  }

  const isSignup = type === 'signup';
  const isCancellation = type === 'cancellation';
  const turfName = body.turf_name || body.turfName || 'Sports Arena';
  const slotInfo = body.time_slot || body.timeSlot || '';
  const dateInfo = body.date || '';

  let emailSubject = `${otp} is your Turfify verification code`;
  if (isCancellation) {
    emailSubject = `${otp} is your Turfify cancellation confirmation code`;
  }

  let emailHeading = 'Two-Step Sign In Verification';
  let emailIntro = `We received a sign-in request for <strong style="color:#F8FAFC;">${email}</strong>. Enter the 6-digit code below to complete sign-in:`;
  if (isSignup) {
    emailHeading = 'Verify Your Email Address';
    emailIntro = `Hi <strong style="color:#F8FAFC;">${name || 'Athlete'}</strong>, welcome to Turfify! Enter the 6-digit code below to verify your email:`;
  } else if (isCancellation) {
    emailHeading = 'Confirm Booking Cancellation';
    emailIntro = `We received a request to cancel your booking at <strong style="color:#F8FAFC;">${turfName}</strong>${dateInfo ? ` on <strong style="color:#F8FAFC;">${dateInfo}</strong>` : ''}${slotInfo ? ` (${slotInfo})` : ''}. Enter the 6-digit verification code below to authorize cancellation:`;
  }

  const emailText = `Your Turfify verification code is: ${otp}\n\nThis code expires in 10 minutes. Please enter this code to complete your verification.\n\nIf you did not request this code, you can safely ignore this email.`;

  const emailHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:540px;margin:0 auto;background:#0B1329;border:1.5px solid ${isCancellation ? '#EF4444' : '#10B981'};border-radius:14px;overflow:hidden;color:#F8FAFC;">
      <div style="background:linear-gradient(135deg,${isCancellation ? '#7F1D1D,#991B1B' : '#064E3B,#065F46'});padding:22px 28px;border-bottom:1px solid rgba(255,255,255,0.1);">
        <h1 style="margin:0;font-size:22px;font-weight:800;color:#fff;">Turfify Sports</h1>
      </div>
      <div style="padding:26px 28px;">
        <h2 style="margin:0 0 12px;font-size:18px;color:#fff;">
          ${emailHeading}
        </h2>
        <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#94A3B8;">
          ${emailIntro}
        </p>
        <div style="text-align:center;margin:24px 0;">
          <div style="display:inline-block;background:${isCancellation ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)'};border:2px dashed ${isCancellation ? '#EF4444' : '#10B981'};border-radius:10px;padding:16px 36px;">
            <span style="font-size:34px;font-weight:800;letter-spacing:8px;color:${isCancellation ? '#EF4444' : '#10B981'};font-family:monospace;">${otp}</span>
          </div>
          <p style="margin:10px 0 0;font-size:12px;color:#64748B;">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
        <div style="background:rgba(255,255,255,0.04);border-left:3px solid ${isCancellation ? '#EF4444' : '#10B981'};padding:10px 14px;border-radius:6px;">
          <p style="margin:0;font-size:12px;color:#94A3B8;">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      </div>
      <div style="background:rgba(0,0,0,0.3);padding:14px 28px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#64748B;text-align:center;">
        Turfify Sports Platform • Tamil Nadu, India • Automated Verification System
      </div>
    </div>
  `;

  let emailSent = false;
  let emailError = null;

  // ── PRIMARY: Gmail SMTP via Nodemailer ──
  let gmailUser = process.env.GMAIL_USER;
  let gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
      fs.readFileSync(envPath, 'utf8').split('\n').forEach(l => {
        const idx = l.indexOf('=');
        if (idx > 0) {
          const k = l.substring(0, idx).trim();
          let v = l.substring(idx + 1).trim();
          if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
          if (k === 'GMAIL_USER') gmailUser = v;
          if (k === 'GMAIL_APP_PASSWORD') gmailAppPassword = v;
        }
      });
    }
  } catch (e) {}

  if (gmailUser && gmailAppPassword && gmailAppPassword !== 'your_16_char_app_password_here') {
    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailAppPassword }
      });
      await transporter.sendMail({
        from: `"Turfify" <${gmailUser}>`,
        to: email,
        subject: emailSubject,
        text: emailText,
        html: emailHtml
      });
      emailSent = true;
    } catch (err) {
      emailError = err.message;
      console.warn('Gmail SMTP error:', err.message);
    }
  }

  // ── FALLBACK: Resend API (only works for verified emails) ──
  if (!emailSent) {
    const DEFAULT_RESEND_KEY = Buffer.from('cmVfOUtRc1JiYkdfZDE3MUQ4RW1Qa1BlUW9BQ2Y2bWpVazFr', 'base64').toString('utf8');
    const resendKey = process.env.RESEND_API_KEY || DEFAULT_RESEND_KEY;
    try {
      const https = require('https');
      const payload = JSON.stringify({
        from: 'Turfify Security <onboarding@resend.dev>',
        to: [email],
        subject: emailSubject,
        html: emailHtml
      });
      await new Promise((resolve) => {
        const rReq = https.request('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        }, (rRes) => {
          let rBody = '';
          rRes.on('data', c => rBody += c);
          rRes.on('end', () => {
            if (rRes.statusCode >= 200 && rRes.statusCode < 300) emailSent = true;
            else emailError = rBody;
            resolve();
          });
        });
        rReq.on('error', (e) => { emailError = e.message; resolve(); });
        rReq.write(payload);
        rReq.end();
      });
    } catch (e) {
      emailError = e.message;
    }
  }

  if (!emailSent) {
    return res.status(500).json({
      error: 'Failed to deliver OTP to your email address: ' + (emailError || 'Email service error')
    });
  }

  return res.status(200).json({
    success: true,
    emailSent: true,
    message: `Verification code sent to ${email}`
  });
};
