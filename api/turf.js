const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const dbPath = path.join(__dirname, '..', 'turfify_database.json');
  let db = { turfs: [] };
  try {
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    }
  } catch(e) {}

  if (req.method === 'GET') {
    return res.status(200).json(db.turfs || []);
  }

  if (req.method === 'DELETE') {
    const turfId = (req.query?.id || '').trim();
    if (!turfId) return res.status(400).json({ error: 'Missing turf id' });

    if (!Array.isArray(db.deleted_turfs)) db.deleted_turfs = [];
    if (!db.deleted_turfs.includes(turfId)) db.deleted_turfs.push(turfId);

    db.turfs = (db.turfs || []).filter(t => String(t.id) !== turfId);
    try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch(e) {}

    return res.status(200).json({ success: true, id: turfId });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) { body = {}; }
    }
    body = body || {};
    if (body.id) {
      if (!Array.isArray(db.turfs)) db.turfs = [];
      const idx = db.turfs.findIndex(t => String(t.id) === String(body.id));
      if (idx >= 0) db.turfs[idx] = { ...db.turfs[idx], ...body };
      else db.turfs.unshift(body);
      try { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8'); } catch(e) {}
      return res.status(200).json({ success: true, turf: body });
    }
    return res.status(400).json({ error: 'Invalid turf data' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

