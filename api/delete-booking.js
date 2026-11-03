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

  const bookingId = body.id || body.booking_id;
  if (!bookingId) {
    return res.status(400).json({ error: 'Missing booking id' });
  }

  const strId = String(bookingId);
  const dbPath = path.join(__dirname, '..', 'turfify_database.json');
  try {
    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (!Array.isArray(db.deleted_booking_ids)) db.deleted_booking_ids = [];
      if (!db.deleted_booking_ids.includes(strId)) {
        db.deleted_booking_ids.push(strId);
      }
      if (Array.isArray(db.bookings)) {
        db.bookings = db.bookings.filter(b => String(b.id) !== strId);
      }
      try {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
      } catch (writeErr) {
        // Ephemeral on Vercel lambda
      }
    }
  } catch (err) {
    console.warn('DB error in delete-booking:', err.message);
  }

  return res.status(200).json({
    success: true,
    deleted: true,
    id: strId
  });
};
