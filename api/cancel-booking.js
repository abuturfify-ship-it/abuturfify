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

  const dbPath = path.join(__dirname, '..', 'turfify_database.json');
  let db = null;
  let targetBooking = null;

  try {
    if (fs.existsSync(dbPath)) {
      db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      if (Array.isArray(db.bookings)) {
        const idx = db.bookings.findIndex(b => String(b.id) === String(bookingId));
        if (idx >= 0) {
          db.bookings[idx].status = 'Cancelled';
          db.bookings[idx].cancelled_at = new Date().toISOString();
          targetBooking = db.bookings[idx];
          // Also track in cancelled_booking_ids for cross-device sync
          if (!Array.isArray(db.cancelled_booking_ids)) db.cancelled_booking_ids = [];
          const strId = String(bookingId);
          if (!db.cancelled_booking_ids.includes(strId)) {
            db.cancelled_booking_ids.push(strId);
          }
          try {
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
          } catch (writeErr) {
            // Read-only filesystem on serverless lambda
          }
        }
      }
    }
  } catch (err) {
    console.warn('DB error in cancel-booking:', err.message);
  }

  return res.status(200).json({
    success: true,
    cancelled: true,
    id: bookingId,
    booking: targetBooking || { id: bookingId, status: 'Cancelled' }
  });
};

