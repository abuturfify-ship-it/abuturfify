const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  body = body || {};

  const email = (body.email || '').trim().toLowerCase();
  const inputOtp = (body.otp || '').toString().trim();
  const type = body.type || 'signup';
  const otpToken = body.otpToken || '';
  const passedUserData = body.userData || null;

  if (!email || !inputOtp) {
    return res.status(400).json({ error: 'Email and OTP code are required.' });
  }

  const OTP_SECRET = process.env.OTP_SECRET || process.env.GMAIL_APP_PASSWORD || 'turfify_otp_secret_key_2026';
  let isVerified = false;

  // 1. Primary: Stateless Cryptographic HMAC verification (works 100% in Serverless)
  if (otpToken && typeof otpToken === 'string' && otpToken.includes('.')) {
    const [expStr, tokenHash] = otpToken.split('.');
    const exp = parseInt(expStr, 10);
    if (!isNaN(exp)) {
      if (Date.now() > exp) {
        return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
      }
      const expectedHash = crypto.createHmac('sha256', OTP_SECRET)
        .update(`${email}:${inputOtp}:${exp}:${type}`)
        .digest('hex');

      if (expectedHash === tokenHash) {
        isVerified = true;
      } else {
        return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
      }
    }
  }

  // 2. Secondary: Fallback to turfify_database.json (for local server or persistent disks)
  const dbPath = path.join(__dirname, '..', 'turfify_database.json');
  let db = null;
  let stored = null;

  try {
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (db.pending_otps && db.pending_otps[email]) {
        stored = db.pending_otps[email];
      }
    }
  } catch (err) {
    console.warn('DB read notice:', err.message);
  }

  if (!isVerified && stored) {
    if (Date.now() > stored.expiresAt) {
      delete db.pending_otps[email];
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch (e) {}
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (stored.otp === inputOtp) {
      isVerified = true;
    } else {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }
  }

  if (isVerified) {
    let newUser = null;
    const u = stored?.userData || passedUserData;

    if (type === 'signup' && u) {
      newUser = {
        id: 'usr-' + Date.now(),
        name: u.name,
        full_name: u.name,
        email: u.email || email,
        phone: u.phone || '—',
        role: u.role === 'owner' ? 'owner' : 'player',
        password: u.password,
        status: 'Active',
        email_verified: true,
        is_authenticated: true,
        created_at: new Date().toISOString()
      };

      if (db) {
        if (!Array.isArray(db.users)) db.users = [];
        const existingIdx = db.users.findIndex(x => x.email && x.email.toLowerCase() === email);
        if (existingIdx >= 0) {
          db.users[existingIdx] = { ...db.users[existingIdx], ...newUser };
        } else {
          db.users.unshift(newUser);
        }

        if (Array.isArray(db.deleted_emails)) {
          db.deleted_emails = db.deleted_emails.filter(b => b.toLowerCase() !== email && b.toLowerCase() !== (newUser.id || '').toLowerCase());
        }
      }
    }

    if (db && db.pending_otps && db.pending_otps[email]) {
      delete db.pending_otps[email];
    }
    if (db) {
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch (e) {}
    }

    return res.status(200).json({
      success: true,
      verified: true,
      user: newUser,
      message: type === 'signup' ? 'Email verified successfully!' : (type === 'cancellation' ? 'Cancellation authorized successfully!' : 'Login verification approved!')
    });
  }

  return res.status(400).json({
    error: 'No pending verification found or the code has expired. Please request a new code.'
  });
};
