const fs = require('fs');
const path = require('path');

const rootDbPath = path.join(__dirname, '..', 'turfify_database.json');
const tmpDbPath = path.join('/tmp', 'turfify_database.json');

function readDb() {
  let db = { turfs: [], bookings: [], users: [], complaints: [], logs: [] };
  // Check /tmp first if running in serverless environment
  if (fs.existsSync(tmpDbPath)) {
    try {
      return JSON.parse(fs.readFileSync(tmpDbPath, 'utf8'));
    } catch (e) {}
  }
  // Otherwise read from project root
  if (fs.existsSync(rootDbPath)) {
    try {
      return JSON.parse(fs.readFileSync(rootDbPath, 'utf8'));
    } catch (e) {}
  }
  return db;
}

function writeDb(db) {
  let written = false;
  // Try writing to root database
  try {
    fs.writeFileSync(rootDbPath, JSON.stringify(db, null, 2), 'utf8');
    written = true;
  } catch (err) {
    // If root is read-only (e.g. Vercel serverless), fallback to /tmp
    try {
      fs.writeFileSync(tmpDbPath, JSON.stringify(db, null, 2), 'utf8');
      written = true;
    } catch (tmpErr) {
      console.error('Error writing to database fallback:', tmpErr);
    }
  }
  return written;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = readDb();
  if (!Array.isArray(db.complaints)) db.complaints = [];
  if (!Array.isArray(db.logs)) db.logs = [];

  // GET: Fetch complaints and audit logs (Public / Authenticated)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      complaints: db.complaints,
      logs: db.logs.slice(0, 50)
    });
  }

  // POST: Athlete submitting a facility dispute / refund claim
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const ticketId = body.id || ('TC-' + Math.floor(100 + Math.random() * 900));
    const newComplaint = {
      id: ticketId,
      turf_name: body.turf_name || 'Sports Facility',
      location: body.location || 'Tamil Nadu',
      player_name: body.player_name || 'Athlete',
      player_phone: body.player_phone || '—',
      issue: body.issue || 'Facility grievance reported.',
      date: body.date || new Date().toISOString().slice(0, 10),
      time_slot: body.time_slot || '—',
      status: 'Open',
      booking_id: body.booking_id || '',
      amount: Number(body.amount) || 0,
      created_at: new Date().toISOString()
    };

    // Prepend to complaints
    db.complaints.unshift(newComplaint);

    // Append to audit logs
    db.logs.unshift({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      actor: newComplaint.player_name,
      action: 'Risk Flag Raised',
      details: `Player reported dispute #${ticketId} on ${newComplaint.turf_name}`
    });

    writeDb(db);

    return res.status(200).json({
      success: true,
      message: `Dispute #${ticketId} recorded on server.`,
      complaint: newComplaint
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
