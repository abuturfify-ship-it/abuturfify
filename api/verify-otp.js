
const fs = require('fs');
const path = require('path');

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

  if (!email || !inputOtp) {
    return res.status(400).json({ error: 'Email and OTP code are required.' });
  }

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
    console.warn('DB read error in verify-otp:', err.message);
  }

  // If serverless disk didn't persist, or if matched in DB:
  if (stored) {
    if (Date.now() > stored.expiresAt) {
      delete db.pending_otps[email];
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch (e) { }
      return res.status(400).json({ error: 'Verification code has expired. Please request a new code.' });
    }

    if (stored.otp !== inputOtp) {
      return res.status(400).json({ error: 'Invalid verification code. Please check and try again.' });
    }

    // OTP matches!
    let newUser = null;
    if (type === 'signup' && stored.userData) {
      const u = stored.userData;
      newUser = {
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
        db.users[existingIdx] = { ...db.users[existingIdx], ...newUser };
      } else {
        db.users.unshift(newUser);
      }

      // Remove from deleted_emails blacklist — fresh account allowed
      if (Array.isArray(db.deleted_emails)) {
        db.deleted_emails = db.deleted_emails.filter(b => b.toLowerCase() !== email && b.toLowerCase() !== (newUser.id || '').toLowerCase());
      }
    }

    delete db.pending_otps[email];
    try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch (e) { }

    return res.status(200).json({
      success: true,
      verified: true,
      user: newUser,
      message: type === 'signup' ? 'Email verified successfully!' : 'Login verification approved!'
    });
  }

  return res.status(400).json({
    error: 'No pending verification found or the code has expired. Please request a new code.'
  });
};

