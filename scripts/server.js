const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');

// Load .env variables
try {
  const envPath = path.join(ROOT_DIR, '.env');
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

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(ROOT_DIR, 'turfify_database.json');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const DEFAULT_TURFS = [];
const DEFAULT_BOOKINGS = [];
const DEFAULT_USERS_LIST = [
  {
    id: 'owner-1',
    role: 'owner',
    name: 'Suresh Kumar',
    email: 'suresh@arenasports.com',
    phone: '+91 98860 11223',
    business_name: 'Arena Sports Facilities Pvt Ltd',
    created_at: '2026-08-15T10:00:00Z',
    status: 'Active'
  },
  {
    id: 'owner-2',
    role: 'owner',
    name: 'Vikramaditya Roy',
    email: 'vikram@gameonturf.com',
    phone: '+91 98450 67890',
    business_name: 'GameOn Sports LLP',
    created_at: '2026-08-20T11:30:00Z',
    status: 'Active'
  },
  {
    id: 'player-1',
    role: 'player',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    favorite_sport: 'Football',
    matches_played: 18,
    loyalty_pts: 450,
    created_at: '2026-08-25T14:20:00Z',
    status: 'Active'
  },
  {
    id: 'player-9',
    role: 'player',
    name: 'Vikram Mehta',
    email: 'vikram.m@example.com',
    phone: '+91 94455 12345',
    created_at: '2026-09-01T09:15:00Z',
    status: 'Active'
  }
];

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Error reading turfify_database.json:', e);
  }
  const initial = {
    turfs: DEFAULT_TURFS,
    bookings: DEFAULT_BOOKINGS,
    users: DEFAULT_USERS_LIST
  };
  saveDatabase(initial);
  return initial;
}

function saveDatabase(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing turfify_database.json:', e);
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', err => reject(err));
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/')) {
    const db = loadDatabase();

    if (pathname === '/api/data' && req.method === 'GET') {
      return sendJson(res, 200, db);
    }

    if (pathname === '/api/contact' && req.method === 'POST') {
      const data = await readBody(req);
      const { name, email, phone, subject, message } = data;
      const DEFAULT_KEY = Buffer.from('cmVfOUtRc1JiYkdfZDE3MUQ4RW1Qa1BlUW9BQ2Y2bWpVazFr', 'base64').toString('utf8');
      const resendApiKey = process.env.RESEND_API_KEY || DEFAULT_KEY;
      const targetEmail = process.env.TURFIFY_TARGET_EMAIL || 'abu.turfify@gmail.com';

      const inquiry = {
        id: 'inq-' + Date.now(),
        name: name || 'Guest',
        email: email || '',
        phone: phone || '',
        subject: subject || 'General Inquiry',
        message: message || '',
        target_email: targetEmail,
        received_at: new Date().toISOString()
      };

      if (!Array.isArray(db.inquiries)) db.inquiries = [];
      db.inquiries.unshift(inquiry);
      saveDatabase(db);

      let emailSent = false;
      let emailDetail = null;

      // Dispatch directly via Resend API
      try {
        const https = require('https');
        const resendPayload = JSON.stringify({
          from: 'Turfify Support <onboarding@resend.dev>',
          to: [targetEmail],
          reply_to: email || undefined,
          subject: `[Turfify Inquiry] ${subject || 'New Contact'} from ${name || 'User'}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 2px solid #10B981; border-radius: 14px; background: #0B1329; color: #F8FAFC;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px;">
                <h2 style="color: #10B981; margin: 0; font-size: 22px;">⚡ New Turfify Support Inquiry</h2>
              </div>
              <p style="color: #94A3B8; font-size: 14px; margin-top: 0;">An inquiry was submitted via the Turfify Contact Us page.</p>
              
              <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10B981;">
                <p style="margin: 6px 0;"><strong>👤 Name:</strong> ${name || 'N/A'}</p>
                <p style="margin: 6px 0;"><strong>✉️ Customer Email:</strong> <a href="mailto:${email}" style="color: #38BDF8; text-decoration: none;">${email || 'N/A'}</a></p>
                <p style="margin: 6px 0;"><strong>📞 Phone / WhatsApp:</strong> <a href="tel:${phone}" style="color: #38BDF8; text-decoration: none;">${phone || 'N/A'}</a></p>
                <p style="margin: 6px 0;"><strong>📌 Category:</strong> ${subject || 'General'}</p>
              </div>

              <div style="background: rgba(16, 185, 129, 0.08); padding: 18px; border-radius: 10px; margin: 20px 0; border: 1px solid rgba(16, 185, 129, 0.2);">
                <h4 style="margin: 0 0 8px; color: #34D399; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Customer Message:</h4>
                <p style="margin: 0; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #E2E8F0;">${message || 'No message provided'}</p>
              </div>

              <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 24px 0;" />
              <p style="font-size: 12px; color: #64748B; margin: 0;">Turfify Sports Infrastructure Platform • Secured via Resend API • Delivered to: ${targetEmail}</p>
            </div>
          `
        });

        await new Promise((resolve) => {
          const rReq = https.request('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(resendPayload)
            }
          }, (rRes) => {
            let rBody = '';
            rRes.on('data', chunk => rBody += chunk);
            rRes.on('end', () => {
              try {
                emailDetail = JSON.parse(rBody);
                if (rRes.statusCode >= 200 && rRes.statusCode < 300) {
                  emailSent = true;
                }
              } catch(e) {
                emailDetail = rBody;
              }
              resolve();
            });
          });

          rReq.on('error', (err) => {
            console.error('Resend API request error:', err);
            resolve();
          });

          rReq.write(resendPayload);
          rReq.end();
        });
      } catch (e) {
        console.error('Email dispatch error:', e);
      }

      return sendJson(res, 200, {
        success: true,
        emailSent,
        inquiryId: inquiry.id,
        targetEmail,
        detail: emailDetail,
        message: emailSent
          ? `Inquiry successfully sent to ${targetEmail}!`
          : `Inquiry registered for ${targetEmail}.`
      });
    }

    if (pathname === '/api/send-otp' && req.method === 'POST') {
      const data = await readBody(req);
      const email = (data.email || '').trim().toLowerCase();
      const type = data.type || 'signup';
      const name = data.name || '';
      const phone = data.phone || '';
      const role = data.role || 'player';
      const password = data.password || '';

      if (!email || !email.includes('@')) {
        return sendJson(res, 400, { error: 'A valid email address is required.' });
      }

      // Block deleted accounts from getting OTP for login
      if (type === 'login') {
        const delBl = Array.isArray(db.deleted_emails) ? db.deleted_emails : [];
        if (delBl.some(b => b.toLowerCase() === email)) {
          return sendJson(res, 403, { error: 'This account has been deleted. Please create a new account.' });
        }
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Generate stateless HMAC signature for serverless/multi-process resilience
      const OTP_SECRET = process.env.OTP_SECRET || process.env.GMAIL_APP_PASSWORD || 'turfify_otp_secret_key_2026';
      const tokenHash = crypto.createHmac('sha256', OTP_SECRET)
        .update(`${email}:${otp}:${expiresAt}:${type}`)
        .digest('hex');
      const otpToken = `${expiresAt}.${tokenHash}`;

      if (!db.pending_otps) db.pending_otps = {};
      db.pending_otps[email] = {
        otp,
        expiresAt,
        type,
        createdAt: new Date().toISOString(),
        userData: type === 'signup' ? { name, email, phone, role, password } : null
      };
      saveDatabase(db);

      const isSignup = type === 'signup';
      const isCancellation = type === 'cancellation';
      const turfName = data.turf_name || data.turfName || 'Sports Arena';
      const slotInfo = data.time_slot || data.timeSlot || '';
      const dateInfo = data.date || '';

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

      const emailText = `Your Turfify verification code is: ${otp}\n\nThis code expires in 10 minutes. Please enter this code to authorize this action.\n\nIf you did not request this code, you can safely ignore this email.`;

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
              <p style="margin:0;font-size:12px;color:#94A3B8;">If you did not request to cancel this booking, please contact support immediately.</p>
            </div>
          </div>
          <div style="background:rgba(0,0,0,0.3);padding:14px 28px;border-top:1px solid rgba(255,255,255,0.06);font-size:11px;color:#64748B;text-align:center;">
            Turfify Sports Platform • Tamil Nadu, India • Automated Verification System
          </div>
        </div>
      `;

      let emailSent = false;
      let emailDetail = null;

      // ── PRIMARY: Gmail SMTP via Nodemailer ──
      // Always read fresh credentials from .env
      let gmailUser = process.env.GMAIL_USER;
      let gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
      try {
        const envPath = path.join(ROOT_DIR, '.env');
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
          emailDetail = { provider: 'gmail', to: email };
        } catch (gmailErr) {
          console.warn('Gmail SMTP error:', gmailErr.message);
          emailDetail = gmailErr.message;
        }
      }

      // ── FALLBACK: Resend API ──
      if (!emailSent) {
        try {
          const https = require('https');
          const DEFAULT_KEY = Buffer.from('cmVfOUtRc1JiYkdfZDE3MUQ4RW1Qa1BlUW9BQ2Y2bWpVazFr', 'base64').toString('utf8');
          const resendApiKey = process.env.RESEND_API_KEY || DEFAULT_KEY;
          const resendPayload = JSON.stringify({
            from: 'Turfify Security <onboarding@resend.dev>',
            to: [email],
            subject: emailSubject,
            html: emailHtml
          });
          await new Promise((resolve) => {
            const rReq = https.request('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(resendPayload)
              }
            }, (rRes) => {
              let rBody = '';
              rRes.on('data', chunk => rBody += chunk);
              rRes.on('end', () => {
                if (rRes.statusCode >= 200 && rRes.statusCode < 300) {
                  emailSent = true;
                  emailDetail = { provider: 'resend' };
                } else {
                  emailDetail = rBody;
                }
                resolve();
              });
            });
            rReq.on('error', (err) => { emailDetail = err.message; resolve(); });
            rReq.write(resendPayload);
            rReq.end();
          });
        } catch (e) {
          emailDetail = e.message;
        }
      }

      if (!emailSent) {
        const isSandboxRestriction = (typeof emailDetail === 'string' && (
          emailDetail.includes('only send testing emails') ||
          emailDetail.includes('resend.com/domains') ||
          emailDetail.includes('validation_error')
        ));
        if (isSandboxRestriction) {
          return sendJson(res, 200, {
            success: true,
            emailSent: false,
            testMode: true,
            devOtp: otp,
            otpToken,
            message: `Testing sandbox mode: Use code ${otp} to verify (or configure GMAIL_USER & GMAIL_APP_PASSWORD to send live emails).`
          });
        }

        return sendJson(res, 500, {
          error: 'Failed to deliver OTP to your email address: ' + (typeof emailDetail === 'string' ? emailDetail : 'Email service error')
        });
      }

      return sendJson(res, 200, {
        success: true,
        emailSent: true,
        otpToken,
        message: `Verification code sent to ${email}!`
      });
    }

    if (pathname === '/api/verify-otp' && req.method === 'POST') {
      const data = await readBody(req);
      const email = (data.email || '').trim().toLowerCase();
      const inputOtp = (data.otp || '').toString().trim();
      const type = data.type || 'signup';

      if (!email || !inputOtp) {
        return sendJson(res, 400, { error: 'Email and OTP code are required.' });
      }

      // Block deleted accounts from LOGGING IN (but allow re-signup with same email)
      if (type === 'login') {
        const bl = Array.isArray(db.deleted_emails) ? db.deleted_emails : [];
        if (bl.some(b => b.toLowerCase() === email)) {
          return sendJson(res, 403, { error: 'This account has been deleted. Please create a new account.' });
        }
      }

      let isVerified = false;
      const OTP_SECRET = process.env.OTP_SECRET || process.env.GMAIL_APP_PASSWORD || 'turfify_otp_secret_key_2026';
      if (data.otpToken && typeof data.otpToken === 'string' && data.otpToken.includes('.')) {
        const [expStr, tokenHash] = data.otpToken.split('.');
        const exp = parseInt(expStr, 10);
        if (!isNaN(exp)) {
          if (Date.now() > exp) {
            return sendJson(res, 400, { error: 'Verification code has expired. Please request a new code.' });
          }
          const expectedHash = crypto.createHmac('sha256', OTP_SECRET)
            .update(`${email}:${inputOtp}:${exp}:${type}`)
            .digest('hex');
          if (expectedHash === tokenHash) {
            isVerified = true;
          } else {
            return sendJson(res, 400, { error: 'Incorrect OTP. Please enter the valid 6-digit code.' });
          }
        }
      }

      const stored = db.pending_otps ? db.pending_otps[email] : null;

      if (!isVerified) {
        if (!stored) {
          return sendJson(res, 400, { error: 'No pending OTP verification found or the code has expired. Please request a new code.' });
        }

        if (Date.now() > stored.expiresAt) {
          delete db.pending_otps[email];
          saveDatabase(db);
          return sendJson(res, 400, { error: 'Verification code has expired. Please request a new code.' });
        }

        if (stored.otp !== inputOtp) {
          return sendJson(res, 400, { error: 'Incorrect OTP. Please enter the valid 6-digit code.' });
        }
        isVerified = true;
      }

      // Valid OTP!
      let user = null;
      const u = stored?.userData || data.userData;
      if (type === 'signup' && u) {
        user = {
          id: 'usr-' + Date.now(),
          name: u.name,
          full_name: u.name,
          email: u.email,
          phone: u.phone || '—',
          role: u.role === 'owner' ? 'owner' : 'player',
          password: u.password,
          status: 'Active',
          email_verified: true,
          is_authenticated: true,
          created_at: new Date().toISOString()
        };

        if (!Array.isArray(db.users)) db.users = [];
        const existingIdx = db.users.findIndex(x => x.email && x.email.toLowerCase() === email);
        if (existingIdx >= 0) {
          db.users[existingIdx] = { ...db.users[existingIdx], ...user };
        } else {
          db.users.unshift(user);
        }

        // Remove from deleted_emails blacklist — fresh account allowed
        if (Array.isArray(db.deleted_emails)) {
          db.deleted_emails = db.deleted_emails.filter(b => b.toLowerCase() !== email && b.toLowerCase() !== (user.id || '').toLowerCase());
        }
      } else if (type === 'login') {
        user = db.users.find(u => u.email && u.email.toLowerCase() === email);
        if (user) {
          user.is_authenticated = true;
          user.last_login = new Date().toISOString();
        }
      }

      delete db.pending_otps[email];
      saveDatabase(db);

      return sendJson(res, 200, {
        success: true,
        verified: true,
        user,
        message: type === 'signup' ? 'Email verified and account activated!' : 'Login verification successful!'
      });
    }

    if (pathname === '/api/sync' && req.method === 'POST') {
      const clientData = await readBody(req);
      const blacklist = Array.isArray(db.deleted_emails) ? db.deleted_emails.map(x => x.toLowerCase()) : [];
      const isBlacklisted = (u) => blacklist.some(b =>
        (u.email && u.email.toLowerCase() === b) || (u.id && u.id.toLowerCase() === b)
      );
      if (Array.isArray(clientData.users)) {
        clientData.users.filter(u => !isBlacklisted(u)).forEach(u => {
          const idx = db.users.findIndex(x => (x.id && x.id === u.id) || (x.email && u.email && x.email.toLowerCase() === u.email.toLowerCase()));
          if (idx >= 0) db.users[idx] = { ...db.users[idx], ...u };
          else db.users.unshift(u);
        });
      }
      if (Array.isArray(clientData.turfs)) {
        const deletedTurfs = Array.isArray(db.deleted_turfs) ? db.deleted_turfs : [];
        clientData.turfs.filter(t => !deletedTurfs.includes(String(t.id))).forEach(t => {
          const idx = db.turfs.findIndex(x => String(x.id) === String(t.id));
          if (idx >= 0) db.turfs[idx] = { ...db.turfs[idx], ...t };
          else db.turfs.unshift(t);
        });
      }
      if (Array.isArray(clientData.bookings)) {
        clientData.bookings.forEach(b => {
          const idx = db.bookings.findIndex(x => x.id === b.id);
          if (idx >= 0) db.bookings[idx] = { ...db.bookings[idx], ...b };
          else db.bookings.unshift(b);
        });
      }
      saveDatabase(db);
      return sendJson(res, 200, { success: true, count: { turfs: db.turfs.length, bookings: db.bookings.length, users: db.users.length } });
    }

    if (pathname === '/api/turf' && req.method === 'POST') {
      const turf = await readBody(req);
      if (turf && turf.id) {
        if (Array.isArray(db.deleted_turfs)) {
          db.deleted_turfs = db.deleted_turfs.filter(id => id !== String(turf.id));
        }
        const idx = db.turfs.findIndex(t => String(t.id) === String(turf.id));
        if (idx >= 0) db.turfs[idx] = { ...db.turfs[idx], ...turf };
        else db.turfs.unshift(turf);
        saveDatabase(db);
        return sendJson(res, 200, { success: true, turf });
      }
      return sendJson(res, 400, { error: 'Invalid turf data' });
    }

    if (pathname === '/api/turf' && req.method === 'DELETE') {
      const turfId = parsedUrl.searchParams.get('id');
      if (turfId) {
        if (!Array.isArray(db.deleted_turfs)) db.deleted_turfs = [];
        if (!db.deleted_turfs.includes(String(turfId))) db.deleted_turfs.push(String(turfId));
        db.turfs = db.turfs.filter(t => String(t.id) !== String(turfId));
        saveDatabase(db);
        return sendJson(res, 200, { success: true, id: turfId });
      }
      return sendJson(res, 400, { error: 'Missing turf id' });
    }

    if (pathname === '/api/booking' && req.method === 'POST') {
      const booking = await readBody(req);
      if (booking && booking.id) {
        const idx = db.bookings.findIndex(b => b.id === booking.id);
        if (idx >= 0) db.bookings[idx] = { ...db.bookings[idx], ...booking };
        else db.bookings.unshift(booking);
        saveDatabase(db);
        return sendJson(res, 200, { success: true, booking });
      }
      return sendJson(res, 400, { error: 'Invalid booking data' });
    }

    if (pathname === '/api/cancel-booking' && req.method === 'POST') {
      const body = await readBody(req);
      const bookingId = body.id || body.booking_id;
      if (bookingId) {
        const idx = db.bookings.findIndex(b => b.id === bookingId);
        if (idx >= 0) {
          db.bookings[idx].status = 'Cancelled';
          db.bookings[idx].cancelled_at = new Date().toISOString();
          saveDatabase(db);
          return sendJson(res, 200, { success: true, booking: db.bookings[idx] });
        }
        return sendJson(res, 404, { error: 'Booking not found' });
      }
      return sendJson(res, 400, { error: 'Missing booking id' });
    }

    if (pathname === '/api/delete-booking' && req.method === 'POST') {
      const body = await readBody(req);
      const bookingId = body.id || body.booking_id;
      if (bookingId) {
        const strId = String(bookingId);
        if (!Array.isArray(db.deleted_booking_ids)) db.deleted_booking_ids = [];
        if (!db.deleted_booking_ids.includes(strId)) {
          db.deleted_booking_ids.push(strId);
        }
        db.bookings = db.bookings.filter(b => String(b.id) !== strId);
        saveDatabase(db);
        return sendJson(res, 200, { success: true, id: strId });
      }
      return sendJson(res, 400, { error: 'Missing booking id' });
    }

    if (pathname === '/api/user' && req.method === 'POST') {
      const user = await readBody(req);
      if (user && user.id) {
        const idx = db.users.findIndex(u => u.id === user.id);
        if (idx >= 0) db.users[idx] = { ...db.users[idx], ...user };
        else db.users.unshift(user);
        saveDatabase(db);
        return sendJson(res, 200, { success: true, user });
      }
      return sendJson(res, 400, { error: 'Invalid user data' });
    }

    if (pathname === '/api/user' && req.method === 'DELETE') {
      const userId = (parsedUrl.searchParams.get('id') || '').trim();
      if (userId) {
        const uLower = userId.toLowerCase();
        // Find target user to get both id and email
        const target = db.users.find(u => u.id === userId || (u.email && u.email.toLowerCase() === uLower));
        const targetEmail = target?.email ? target.email.toLowerCase() : (uLower.includes('@') ? uLower : null);
        const targetId = target?.id || (uLower.includes('@') ? null : userId);

        // Remove from users array
        db.users = db.users.filter(u =>
          (targetId ? u.id !== targetId : true) &&
          (targetEmail ? (u.email || '').toLowerCase() !== targetEmail : true)
        );

        // Add to deleted_emails blacklist
        if (!Array.isArray(db.deleted_emails)) db.deleted_emails = [];
        if (targetEmail && !db.deleted_emails.includes(targetEmail)) db.deleted_emails.push(targetEmail);
        if (targetId && !db.deleted_emails.includes(targetId)) db.deleted_emails.push(targetId);

        // Clear any pending OTPs
        if (db.pending_otps) {
          if (targetEmail && db.pending_otps[targetEmail]) delete db.pending_otps[targetEmail];
          if (targetId && db.pending_otps[targetId]) delete db.pending_otps[targetId];
        }
        saveDatabase(db);
        return sendJson(res, 200, { success: true, id: userId });
      }
      return sendJson(res, 400, { error: 'Missing user id' });
    }

    // Dedicated delete-account endpoint (called by dashboards)
    if (pathname === '/api/delete-account' && req.method === 'POST') {
      const data = await readBody(req);
      const id = (data.id || '').trim();
      const email = (data.email || '').trim().toLowerCase();
      if (!id && !email) return sendJson(res, 400, { error: 'Missing id or email' });

      const target = db.users.find(u =>
        (id && u.id === id) || (email && u.email && u.email.toLowerCase() === email)
      );
      const finalEmail = email || (target?.email ? target.email.toLowerCase() : null);
      const finalId = id || target?.id;

      // Remove from users
      db.users = db.users.filter(u =>
        (finalId ? u.id !== finalId : true) &&
        (finalEmail ? (u.email || '').toLowerCase() !== finalEmail : true)
      );

      // Blacklist
      if (!Array.isArray(db.deleted_emails)) db.deleted_emails = [];
      if (finalEmail && !db.deleted_emails.includes(finalEmail)) db.deleted_emails.push(finalEmail);
      if (finalId && !db.deleted_emails.includes(finalId)) db.deleted_emails.push(finalId);

      // Clear OTPs
      if (db.pending_otps) {
        if (finalEmail && db.pending_otps[finalEmail]) delete db.pending_otps[finalEmail];
        if (finalId && db.pending_otps[finalId]) delete db.pending_otps[finalId];
      }

      // Also delete and blacklist any turfs owned by this owner
      const ownerTurfsToDelete = (db.turfs || []).filter(t =>
        (finalId && t.owner_id === finalId) ||
        (finalEmail && t.owner_email && t.owner_email.toLowerCase() === finalEmail)
      );
      if (ownerTurfsToDelete.length > 0) {
        if (!Array.isArray(db.deleted_turfs)) db.deleted_turfs = [];
        ownerTurfsToDelete.forEach(t => {
          if (!db.deleted_turfs.includes(t.id)) db.deleted_turfs.push(t.id);
        });
        db.turfs = db.turfs.filter(t => !ownerTurfsToDelete.some(ot => ot.id === t.id));
      }

      saveDatabase(db);
      return sendJson(res, 200, { success: true, deleted: true });
    }

    if (pathname === '/api/user-data' && req.method === 'GET') {
      const email = (parsedUrl.searchParams.get('email') || '').toLowerCase();
      const id = parsedUrl.searchParams.get('id');
      const user = db.users.find(u => (id && u.id === id) || (email && u.email && u.email.toLowerCase() === email));
      const userTurfs = db.turfs.filter(t => 
        (id && t.owner_id === id) || 
        (email && t.owner_email && t.owner_email.toLowerCase() === email) ||
        (user && user.name && t.owner_name && t.owner_name.toLowerCase() === user.name.toLowerCase())
      );
      const userBookings = db.bookings.filter(b => 
        (id && b.player_id === id) || 
        (email && b.player_email && b.player_email.toLowerCase() === email) ||
        (user && user.phone && b.player_phone && b.player_phone.replace(/\s+/g, '') === user.phone.replace(/\s+/g, ''))
      );
      return sendJson(res, 200, { user: user || null, turfs: userTurfs, bookings: userBookings });
    }

    return sendJson(res, 404, { error: 'Unknown API endpoint' });
  }

  let reqPath = decodeURI(pathname);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  let filePath = path.join(ROOT_DIR, reqPath);

  if (!path.extname(filePath)) {
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      filePath = htmlPath;
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

const server = http.createServer(handleRequest);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Turfify local dev server running at http://localhost:${PORT}/`);
  });
}

module.exports = handleRequest;
