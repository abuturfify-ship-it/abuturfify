/**
 * Turfify Store & State Management (Pre-Supabase Local Engine)
 * Mirrors the exact Supabase Schema:
 * - profiles (auth & user roles: 'owner' | 'player')
 * - turfs (registered facilities)
 * - slots (time slots per turf per date)
 * - bookings (player reservations)
 */

const TURFIFY_STORAGE_KEYS = {
  CURRENT_USER: 'turfify_current_user',
  USERS: 'turfify_users',
  TURFS: 'turfify_turfs',
  BOOKINGS: 'turfify_bookings',
  SLOTS: 'turfify_slots'
};

// Initial Seed Data
// No default turfs — only real registered turfs appear on the live site
const DEFAULT_TURFS = [];

const DEFAULT_BOOKINGS = [
  {
    id: 'bk-101',
    turf_id: 'turf-1',
    turf_name: 'The Arena Sports Hub',
    sport: 'Football',
    player_id: 'player-1',
    player_name: 'Rahul Sharma',
    player_phone: '+91 98765 43210',
    date: '2026-09-10',
    time_slot: '07:00 PM - 08:00 PM',
    amount: 1200,
    status: 'Confirmed',
    payment_status: 'Paid Online',
    booking_time: '2026-09-09 18:30'
  },
  {
    id: 'bk-102',
    turf_id: 'turf-2',
    turf_name: 'Koramangala Kickoff Arena',
    sport: 'Box Cricket',
    player_id: 'player-1',
    player_name: 'Rahul Sharma',
    player_phone: '+91 98765 43210',
    date: '2026-09-12',
    time_slot: '06:00 PM - 07:00 PM',
    amount: 1500,
    status: 'Confirmed',
    payment_status: 'Paid Online',
    booking_time: '2026-09-09 21:00'
  },
  {
    id: 'bk-103',
    turf_id: 'turf-1',
    turf_name: 'The Arena Sports Hub',
    sport: 'Football',
    player_id: 'player-9',
    player_name: 'Vikram Mehta',
    player_phone: '+91 94455 12345',
    date: '2026-09-10',
    time_slot: '08:00 PM - 09:00 PM',
    amount: 1200,
    status: 'Confirmed',
    payment_status: 'Paid Online',
    booking_time: '2026-09-08 14:15'
  },
  {
    id: 'bk-104',
    turf_id: 'turf-1',
    turf_name: 'The Arena Sports Hub',
    sport: 'Football',
    player_id: 'player-8',
    player_name: 'Local Walk-in Team (Arun)',
    player_phone: '+91 91234 56789',
    date: '2026-09-10',
    time_slot: '09:00 PM - 10:00 PM',
    amount: 1200,
    status: 'Walk-in',
    payment_status: 'Cash at Ground',
    booking_time: '2026-09-10 17:00'
  }
];

const DEFAULT_USERS = {
  owner: {
    id: 'owner-1',
    role: 'owner',
    name: 'Suresh Kumar',
    email: 'suresh@arenasports.com',
    password: 'owner123',
    phone: '+91 98860 11223',
    business_name: 'Arena Sports Facilities Pvt Ltd',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  player: {
    id: 'player-1',
    role: 'player',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'player123',
    phone: '+91 98765 43210',
    favorite_sport: 'Football',
    matches_played: 18,
    loyalty_pts: 450,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  }
};

const DEFAULT_USERS_LIST = [
  {
    id: 'owner-1',
    role: 'owner',
    name: 'Suresh Kumar',
    email: 'suresh@arenasports.com',
    password: 'owner123',
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
    password: 'owner123',
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
    password: 'player123',
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

window.TurfifyStore = {
  init() {
    // One-time migration: purge legacy fake default turfs from localStorage cache
    const FAKE_IDS = ['turf-1', 'turf-2', 'turf-3'];
    try {
      const cached = JSON.parse(localStorage.getItem(TURFIFY_STORAGE_KEYS.TURFS));
      if (Array.isArray(cached) && cached.some(t => FAKE_IDS.includes(t.id))) {
        const cleaned = cached.filter(t => !FAKE_IDS.includes(t.id));
        localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(cleaned));
      }
    } catch (e) {}

    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.TURFS)) {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify([]));
    }
    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
    }
    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.USERS)) {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS_LIST));
    }
    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.CURRENT_USER)) {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS.player));
    }

    // Immediately trigger server sync across windows
    this.syncWithServer().catch(() => {});
  },


  async syncWithServer() {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const serverData = await res.json();
        let changed = false;

        // Server is authoritative for turfs — deleted turfs must NOT be resurrected
        if (Array.isArray(serverData.turfs)) {
          const localTurfs = this.getTurfs();
          const prevStr = JSON.stringify(localTurfs);
          const newStr = JSON.stringify(serverData.turfs);
          if (prevStr !== newStr) {
            localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, newStr);
            changed = true;
          }
        }

        // Merge bookings
        if (Array.isArray(serverData.bookings) && serverData.bookings.length) {
          const localBookings = this.getBookings();
          const prevStr = JSON.stringify(localBookings);
          const mergedBookings = [...serverData.bookings];
          localBookings.forEach(lb => {
            if (!mergedBookings.some(sb => sb.id === lb.id)) {
              mergedBookings.unshift(lb);
              changed = true;
            }
          });
          const newStr = JSON.stringify(mergedBookings);
          if (prevStr !== newStr) {
            localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, newStr);
            changed = true;
          }
        }

        // Merge users
        if (Array.isArray(serverData.users) && serverData.users.length) {
          const localUsers = this.getUsers();
          const prevStr = JSON.stringify(localUsers);
          const mergedUsers = [...serverData.users];
          localUsers.forEach(lu => {
            if (!mergedUsers.some(su => (su.id && su.id === lu.id) || (su.email && lu.email && su.email.toLowerCase() === lu.email.toLowerCase()))) {
              mergedUsers.unshift(lu);
              changed = true;
            }
          });
          const newStr = JSON.stringify(mergedUsers);
          if (prevStr !== newStr) {
            localStorage.setItem(TURFIFY_STORAGE_KEYS.USERS, newStr);
            changed = true;
          }
        }

        // If local had new data that server missed, push back to server
        if (changed) {
          fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              turfs: this.getTurfs(),
              bookings: this.getBookings(),
              users: this.getUsers()
            })
          }).catch(() => {});

          try {
            window.dispatchEvent(new CustomEvent('turfify:data_synced', {
              detail: {
                turfs: this.getTurfs(),
                bookings: this.getBookings(),
                users: this.getUsers()
              }
            }));
          } catch (e) {}
        }

        return changed;
      }
    } catch (e) {
      // Offline fallback
    }
    return false;
  },

  getCurrentUser() {
    try {
      const u = localStorage.getItem(TURFIFY_STORAGE_KEYS.CURRENT_USER);
      return u ? JSON.parse(u) : DEFAULT_USERS.player;
    } catch {
      return DEFAULT_USERS.player;
    }
  },

  setCurrentUser(userObj) {
    localStorage.setItem(TURFIFY_STORAGE_KEYS.CURRENT_USER, JSON.stringify(userObj));
    try {
      window.dispatchEvent(new CustomEvent('turfify:user_changed', { detail: userObj }));
    } catch (e) {}
  },

  getUsers() {
    try {
      const u = localStorage.getItem(TURFIFY_STORAGE_KEYS.USERS);
      return u ? JSON.parse(u) : DEFAULT_USERS_LIST;
    } catch {
      return DEFAULT_USERS_LIST;
    }
  },

  addUser(user) {
    const users = this.getUsers();
    const id = user.id || ('usr-' + Date.now());
    const existingIndex = users.findIndex(u =>
      (u.id && u.id === id) ||
      (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())
    );

    const isOwner = (user.role || '').toLowerCase() === 'owner' || (user.role || '').toLowerCase() === 'turf owner';

    const userRecord = {
      id,
      name: user.name || user.full_name || (isOwner ? 'Turf Owner' : 'Player'),
      email: user.email || '—',
      phone: user.phone || '—',
      role: isOwner ? 'owner' : 'player',
      business_name: user.business_name || '',
      created_at: user.created_at || new Date().toISOString(),
      status: user.status || 'Active',
      ...user
    };

    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userRecord };
    } else {
      users.unshift(userRecord);
    }
    localStorage.setItem(TURFIFY_STORAGE_KEYS.USERS, JSON.stringify(users));

    // Async push to server
    fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userRecord)
    }).catch(() => {});

    try {
      window.dispatchEvent(new CustomEvent('turfify:users_updated', { detail: userRecord }));
    } catch (e) {}

    return userRecord;
  },

  deleteUser(userId) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(TURFIFY_STORAGE_KEYS.USERS, JSON.stringify(users));
    try {
      window.dispatchEvent(new CustomEvent('turfify:users_updated', { detail: { id: userId, deleted: true } }));
    } catch (e) {}
  },

  switchRole(role) {
    const cur = this.getCurrentUser();
    // If an authenticated user is logged in, preserve their real name, id, and profile
    if (cur && (cur.is_authenticated || (cur.id && cur.id !== 'player-1' && cur.id !== 'owner-1'))) {
      cur.role = role;
      this.setCurrentUser(cur);
      return;
    }
    if (role === 'owner') {
      this.setCurrentUser(DEFAULT_USERS.owner);
    } else {
      this.setCurrentUser(DEFAULT_USERS.player);
    }
  },

  getTurfs() {
    try {
      return JSON.parse(localStorage.getItem(TURFIFY_STORAGE_KEYS.TURFS)) || [];
    } catch {
      return [];
    }
  },

  getOwnerTurfs(ownerId = 'owner-1') {
    const cur = this.getCurrentUser();
    const turfs = this.getTurfs();
    const targetId = ownerId || cur?.id;
    const targetEmail = cur?.email ? cur.email.toLowerCase() : null;
    const targetName = cur?.name ? cur.name.toLowerCase() : null;

    return turfs.filter(t => {
      // Direct ID match
      if (targetId && t.owner_id === targetId) return true;
      // Email match across windows & sessions
      if (targetEmail && t.owner_email && t.owner_email.toLowerCase() === targetEmail) return true;
      // Name match fallback
      if (targetName && t.owner_name && t.owner_name.toLowerCase() === targetName && targetName !== 'turf owner') return true;
      return false;
    });
  },

  addTurf(newTurf) {
    const turfs = this.getTurfs();
    const cur = this.getCurrentUser();
    const turf = {
      id: newTurf.id || ('turf-' + Date.now()),
      owner_id: cur?.id || newTurf.owner_id || 'owner-1',
      owner_name: cur?.name || newTurf.owner_name || 'Turf Owner',
      owner_email: cur?.email || newTurf.owner_email || '',
      owner_phone: cur?.phone || newTurf.owner_phone || '',
      rating: 5.0,
      reviews_count: 1,
      available_today: 16,
      total_slots_day: 16,
      image: newTurf.image || 'https://images.unsplash.com/photo-1529900245534-47fbf8c3f4be?w=800&auto=format&fit=crop&q=80',
      ...newTurf
    };

    const existingIdx = turfs.findIndex(t => t.id === turf.id);
    if (existingIdx >= 0) {
      turfs[existingIdx] = { ...turfs[existingIdx], ...turf };
    } else {
      turfs.unshift(turf);
    }
    localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(turfs));

    // Async push to server for cross-window availability
    fetch('/api/turf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(turf)
    }).catch(() => {});

    return turf;
  },

  deleteTurf(turfId) {
    let turfs = this.getTurfs();
    turfs = turfs.filter(t => t.id !== turfId);
    localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(turfs));

    // Delete from server
    fetch(`/api/turf?id=${encodeURIComponent(turfId)}`, { method: 'DELETE' }).catch(() => {});

    // Notify all open tabs (index.html marketplace) to re-render
    try {
      window.dispatchEvent(new CustomEvent('turfify:turf_deleted', { detail: { id: turfId } }));
      window.dispatchEvent(new CustomEvent('turfify:data_synced', { detail: { turfs } }));
    } catch (e) {}
  },

  getBookings() {
    try {
      return JSON.parse(localStorage.getItem(TURFIFY_STORAGE_KEYS.BOOKINGS)) || DEFAULT_BOOKINGS;
    } catch {
      return DEFAULT_BOOKINGS;
    }
  },

  getPlayerBookings(playerId = 'player-1') {
    const cur = this.getCurrentUser();
    const bks = this.getBookings();
    const targetId = playerId || cur?.id;
    const targetEmail = cur?.email ? cur.email.toLowerCase() : null;
    const targetPhone = cur?.phone ? cur.phone.replace(/[^0-9]/g, '') : null;
    const targetName = cur?.name ? cur.name.toLowerCase() : null;

    return bks.filter(b => {
      // Direct ID match
      if (targetId && b.player_id === targetId) return true;
      // Email match across windows
      if (targetEmail && b.player_email && b.player_email.toLowerCase() === targetEmail) return true;
      // Phone match
      if (targetPhone && b.player_phone) {
        const cleanPhone = b.player_phone.replace(/[^0-9]/g, '');
        if (cleanPhone && cleanPhone.endsWith(targetPhone.slice(-10))) return true;
      }
      // Name match
      if (targetName && b.player_name && b.player_name.toLowerCase() === targetName && targetName !== 'player') return true;
      return false;
    });
  },

  getOwnerBookings(ownerId) {
    const cur = this.getCurrentUser();
    const effectiveOwnerId = ownerId || cur?.id;
    const ownerEmail = (cur?.email || '').toLowerCase();
    const ownerPhone = (cur?.phone || '').replace(/[^0-9]/g, '');
    const ownerName = (cur?.name || '').toLowerCase();

    const ownerTurfs = this.getOwnerTurfs(effectiveOwnerId);
    const ownerTurfIds = ownerTurfs.map(t => t.id);
    const ownerTurfNames = ownerTurfs.map(t => (t.name || '').toLowerCase().trim()).filter(Boolean);
    const bks = this.getBookings();

    return bks.filter(b => {
      // 1. Direct turf ID match
      if (b.turf_id && ownerTurfIds.includes(b.turf_id)) return true;
      // 2. Direct turf name match
      if (b.turf_name && ownerTurfNames.includes(b.turf_name.toLowerCase().trim())) return true;
      // 3. Direct owner_id match on booking
      if (effectiveOwnerId && b.owner_id === effectiveOwnerId) return true;
      // 4. Direct owner_email match on booking
      if (ownerEmail && b.owner_email && b.owner_email.toLowerCase() === ownerEmail) return true;
      // 5. Direct owner_phone match on booking
      if (ownerPhone && b.owner_phone && b.owner_phone.replace(/[^0-9]/g, '').endsWith(ownerPhone.slice(-10))) return true;
      // 6. Direct owner_name match on booking
      if (ownerName && b.owner_name && b.owner_name.toLowerCase() === ownerName && ownerName !== 'turf owner') return true;
      // 7. If default demo owner
      if ((!effectiveOwnerId || effectiveOwnerId === 'owner-1') && (b.turf_id === 'turf-1' || b.turf_id === 'turf-2')) return true;
      return false;
    });
  },

  createBooking(bookingData) {
    const bks = this.getBookings();
    const cur = this.getCurrentUser();

    // Look up turf to attach owner information directly onto the booking
    const turfs = this.getTurfs();
    const turf = turfs.find(t => 
      (bookingData.turf_id && t.id === bookingData.turf_id) || 
      (bookingData.turf_name && t.name && t.name.toLowerCase().trim() === bookingData.turf_name.toLowerCase().trim())
    );

    const newBooking = {
      id: 'bk-' + Math.floor(100 + Math.random() * 900),
      turf_id: bookingData.turf_id || turf?.id || 'turf-1',
      turf_name: bookingData.turf_name || turf?.name || 'Turf Arena',
      owner_id: turf?.owner_id || bookingData.owner_id || '',
      owner_name: turf?.owner_name || bookingData.owner_name || '',
      owner_email: turf?.owner_email || bookingData.owner_email || '',
      owner_phone: turf?.owner_phone || bookingData.owner_phone || '',
      sport: bookingData.sport || turf?.sport || 'Football',
      player_id: bookingData.player_id || cur?.id || ('player-' + Date.now()),
      player_name: bookingData.player_name || cur?.name || 'Guest Player',
      player_email: bookingData.player_email || cur?.email || '',
      player_phone: bookingData.player_phone || cur?.phone || '',
      status: bookingData.status || 'Confirmed',
      payment_status: bookingData.payment_status || 'Paid Online',
      booking_time: new Date().toLocaleString(),
      ...bookingData
    };
    bks.unshift(newBooking);
    localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(bks));

    // Immediately push to server database for all cross-window sessions
    fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    }).then(() => {
      this.syncWithServer().catch(() => {});
    }).catch(() => {});

    try {
      window.dispatchEvent(new CustomEvent('turfify:booking_created', { detail: newBooking }));
    } catch (e) {}

    return newBooking;
  },

  cancelBooking(bookingId) {
    const bks = this.getBookings();
    const idx = bks.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bks[idx].status = 'Cancelled';
      localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(bks));

      // Push cancellation to server
      fetch('/api/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId })
      }).catch(() => {});
    }
  }
};

// Initialize immediately
window.TurfifyStore.init();
