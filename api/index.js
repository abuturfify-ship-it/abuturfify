const fs = require('fs');
const path = require('path');

const DB_SEED_FILE = path.join(__dirname, '..', 'turfify_database.json');
const DB_TMP_FILE = path.join('/tmp', 'turfify_database.json');

function getDatabase() {
  try {
    if (fs.existsSync(DB_TMP_FILE)) {
      return JSON.parse(fs.readFileSync(DB_TMP_FILE, 'utf-8'));
    }
  } catch (e) {}

  try {
    if (fs.existsSync(DB_SEED_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_SEED_FILE, 'utf-8'));
      try { fs.writeFileSync(DB_TMP_FILE, JSON.stringify(data, null, 2), 'utf-8'); } catch (e) {}
      return data;
    }
  } catch (e) {}

  return { turfs: [], bookings: [], users: [] };
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(DB_TMP_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // Read-only fallback gracefully ignored
  }
}

async function getRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (req.body && typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch (e) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 'no-cache'
  });
  res.end(JSON.stringify(data));
}

module.exports = async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  try {
    const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    const db = getDatabase();

    // 1. GET /api/data
    if ((pathname === '/api/data' || pathname === '/api') && req.method === 'GET') {
      return sendResponse(res, 200, db);
    }

    // 2. POST /api/sync
    if (pathname === '/api/sync' && req.method === 'POST') {
      const clientData = await getRequestBody(req);
      if (Array.isArray(clientData.users)) {
        clientData.users.forEach(u => {
          const idx = db.users.findIndex(x => (x.id && x.id === u.id) || (x.email && u.email && x.email.toLowerCase() === u.email.toLowerCase()));
          if (idx >= 0) db.users[idx] = { ...db.users[idx], ...u };
          else db.users.unshift(u);
        });
      }
      if (Array.isArray(clientData.turfs)) {
        clientData.turfs.forEach(t => {
          const idx = db.turfs.findIndex(x => x.id === t.id);
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
      return sendResponse(res, 200, { success: true, count: { turfs: db.turfs.length, bookings: db.bookings.length, users: db.users.length } });
    }

    // 3. POST /api/turf
    if (pathname === '/api/turf' && req.method === 'POST') {
      const turf = await getRequestBody(req);
      if (turf && turf.id) {
        const idx = db.turfs.findIndex(t => t.id === turf.id);
        if (idx >= 0) db.turfs[idx] = { ...db.turfs[idx], ...turf };
        else db.turfs.unshift(turf);
        saveDatabase(db);
        return sendResponse(res, 200, { success: true, turf });
      }
      return sendResponse(res, 400, { error: 'Invalid turf data' });
    }

    // 4. DELETE /api/turf
    if (pathname === '/api/turf' && req.method === 'DELETE') {
      const turfId = url.searchParams.get('id');
      if (turfId) {
        db.turfs = db.turfs.filter(t => t.id !== turfId);
        saveDatabase(db);
        return sendResponse(res, 200, { success: true, id: turfId });
      }
      return sendResponse(res, 400, { error: 'Missing turf id' });
    }

    // 5. POST /api/booking
    if (pathname === '/api/booking' && req.method === 'POST') {
      const booking = await getRequestBody(req);
      if (booking && booking.id) {
        const idx = db.bookings.findIndex(b => b.id === booking.id);
        if (idx >= 0) db.bookings[idx] = { ...db.bookings[idx], ...booking };
        else db.bookings.unshift(booking);
        saveDatabase(db);
        return sendResponse(res, 200, { success: true, booking });
      }
      return sendResponse(res, 400, { error: 'Invalid booking data' });
    }

    // 6. POST /api/cancel-booking
    if (pathname === '/api/cancel-booking' && req.method === 'POST') {
      const body = await getRequestBody(req);
      const bookingId = body.id || body.booking_id;
      if (bookingId) {
        const idx = db.bookings.findIndex(b => b.id === bookingId);
        if (idx >= 0) {
          db.bookings[idx].status = 'Cancelled';
          db.bookings[idx].cancelled_at = new Date().toISOString();
          saveDatabase(db);
          return sendResponse(res, 200, { success: true, booking: db.bookings[idx] });
        }
        return sendResponse(res, 404, { error: 'Booking not found' });
      }
      return sendResponse(res, 400, { error: 'Missing booking id' });
    }

    // 7. POST /api/user
    if (pathname === '/api/user' && req.method === 'POST') {
      const user = await getRequestBody(req);
      if (user && user.id) {
        const idx = db.users.findIndex(u => u.id === user.id);
        if (idx >= 0) db.users[idx] = { ...db.users[idx], ...user };
        else db.users.unshift(user);
        saveDatabase(db);
        return sendResponse(res, 200, { success: true, user });
      }
      return sendResponse(res, 400, { error: 'Invalid user data' });
    }

    // 8. GET /api/user-data
    if (pathname === '/api/user-data' && req.method === 'GET') {
      const email = (url.searchParams.get('email') || '').toLowerCase();
      const id = url.searchParams.get('id');
      const user = db.users.find(u => (id && u.id === id) || (email && u.email && u.email.toLowerCase() === email));
      const userTurfs = db.turfs.filter(t => (id && t.owner_id === id) || (email && t.owner_email && t.owner_email.toLowerCase() === email));
      const userBookings = db.bookings.filter(b => (id && b.player_id === id) || (email && b.player_email && b.player_email.toLowerCase() === email));
      return sendResponse(res, 200, { user: user || null, turfs: userTurfs, bookings: userBookings });
    }

    // Fallback for unknown api endpoint
    return sendResponse(res, 404, { error: 'Not found', path: pathname });
  } catch (err) {
    console.error('API Error:', err);
    return sendResponse(res, 500, { error: 'Internal server error', message: err.message });
  }
};
