const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbPath = path.join(__dirname, '..', 'turfify_database.json');
  let db = { users: [] };
  try {
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch(e) {}

  if (req.method === 'DELETE') {
    const userId = (req.query?.id || '').trim();
    if (!userId) return res.status(400).json({ error: 'Missing user id' });

    const uLower = userId.toLowerCase();
    db.users = (db.users || []).filter(u => u.id !== userId && (u.email || '').toLowerCase() !== uLower);
    if (db.pending_otps && db.pending_otps[uLower]) {
      delete db.pending_otps[uLower];
    }
    try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch(e) {}

    return res.status(200).json({ success: true, id: userId });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) { body = {}; }
    }
    body = body || {};
    if (body.id) {
      if (!Array.isArray(db.users)) db.users = [];
      const idx = db.users.findIndex(u => u.id === body.id || (u.email && body.email && u.email.toLowerCase() === body.email.toLowerCase()));
      if (idx >= 0) db.users[idx] = { ...db.users[idx], ...body };
      else db.users.unshift(body);
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch(e) {}
      return res.status(200).json({ success: true, user: body });
    }
    return res.status(400).json({ error: 'Invalid user data' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

