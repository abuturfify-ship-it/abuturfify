const fs = require('fs');
const path = require('path');

const rootDbPath = path.join(__dirname, '..', 'turfify_database.json');
const tmpDbPath = path.join('/tmp', 'turfify_database.json');

function readDb() {
  let db = { turfs: [], bookings: [], users: [], complaints: [], logs: [], cancelled_booking_ids: [] };
  // On Vercel serverless where root is read-only, check /tmp if it was updated
  if (process.env.VERCEL && fs.existsSync(tmpDbPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(tmpDbPath, 'utf8'));
      if (Array.isArray(parsed.complaints)) return parsed;
    } catch (e) {}
  }
  // Standard: read project root database
  if (fs.existsSync(rootDbPath)) {
    try {
      return JSON.parse(fs.readFileSync(rootDbPath, 'utf8'));
    } catch (e) {}
  }
  return db;
}

function writeDb(db) {
  try {
    fs.writeFileSync(rootDbPath, JSON.stringify(db, null, 2), 'utf8');
    return true;
  } catch (err) {
    // If root is read-only (e.g. Vercel serverless), fallback to /tmp
    try {
      fs.writeFileSync(tmpDbPath, JSON.stringify(db, null, 2), 'utf8');
      return true;
    } catch (tmpErr) {
      console.error('Error writing to database fallback in complaint API:', tmpErr);
    }
  }
  return false;
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
  if (!Array.isArray(db.bookings)) db.bookings = [];
  if (!Array.isArray(db.cancelled_booking_ids)) db.cancelled_booking_ids = [];

  // GET: Fetch complaints and audit logs (Public / Authenticated)
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      complaints: db.complaints,
      logs: db.logs.slice(0, 50)
    });
  }

  // POST: Create, Resolve, or Refund Complaints
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const action = body.action || '';
    const ticketId = String(body.id || body.ticket_id || '').trim().replace('#', '');

    // 1. Resolve Complaint from Admin
    if (action === 'resolve' && ticketId) {
      const complaint = db.complaints.find(c => String(c.id).replace('#', '') === ticketId);
      if (complaint) {
        complaint.status = body.status || 'Resolved';
        complaint.resolved_at = new Date().toISOString();
        db.logs.unshift({
          id: 'log-' + Date.now(),
          timestamp: new Date().toISOString(),
          actor: 'Super Admin',
          action: 'Complaint Resolved',
          details: `Resolved dispute #${complaint.id} for ${complaint.turf_name}`
        });
        writeDb(db);
        return res.status(200).json({ success: true, complaint });
      }
      return res.status(404).json({ error: 'Complaint ticket not found' });
    }

    // 2. Refund Complaint from Admin
    if (action === 'refund') {
      const bookingId = String(body.booking_id || '').trim();
      let complaint = null;
      if (ticketId) {
        complaint = db.complaints.find(c => String(c.id).replace('#', '') === ticketId);
      }
      if (!complaint && bookingId) {
        complaint = db.complaints.find(c => String(c.booking_id) === bookingId);
      }
      if (complaint) {
        complaint.status = body.status || 'Resolved (Refunded)';
        complaint.resolved_at = new Date().toISOString();
      }

      if (bookingId) {
        const b = db.bookings.find(x => String(x.id) === bookingId);
        if (b) {
          b.payment_status = 'Refunded';
          b.status = 'Cancelled';
          b.refunded_at = new Date().toISOString();
        }
        if (!db.cancelled_booking_ids.includes(bookingId)) {
          db.cancelled_booking_ids.push(bookingId);
        }
      }

      db.logs.unshift({
        id: 'log-' + Date.now(),
        timestamp: new Date().toISOString(),
        actor: 'Super Admin',
        action: 'Refund Authorized',
        details: `Authorized instant refund of ₹${body.amount || 0} for booking #${bookingId || ticketId}`
      });
      writeDb(db);
      return res.status(200).json({ success: true, complaint, booking_id: bookingId });
    }

    // 3. New dispute ticket submitted by player
    const newId = ticketId || ('TC-' + Math.floor(100 + Math.random() * 900));
    const newComplaint = {
      id: newId,
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
      details: `Player reported dispute #${newId} on ${newComplaint.turf_name}`
    });

    writeDb(db);

    return res.status(200).json({
      success: true,
      message: `Dispute #${newId} recorded on server.`,
      complaint: newComplaint
    });
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};
