const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.join(__dirname, '..');
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

    if (pathname === '/api/sync' && req.method === 'POST') {
      const clientData = await readBody(req);
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
      return sendJson(res, 200, { success: true, count: { turfs: db.turfs.length, bookings: db.bookings.length, users: db.users.length } });
    }

    if (pathname === '/api/turf' && req.method === 'POST') {
      const turf = await readBody(req);
      if (turf && turf.id) {
        const idx = db.turfs.findIndex(t => t.id === turf.id);
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
        db.turfs = db.turfs.filter(t => t.id !== turfId);
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
      const userId = parsedUrl.searchParams.get('id');
      if (userId) {
        db.users = db.users.filter(u => u.id !== userId);
        saveDatabase(db);
        return sendJson(res, 200, { success: true, id: userId });
      }
      return sendJson(res, 400, { error: 'Missing user id' });
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
