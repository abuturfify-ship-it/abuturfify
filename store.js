/**
 * Turfify Store & State Management (Pre-Supabase Local Engine)
 * Mirrors the exact Supabase Schema:
 * - profiles (auth & user roles: 'owner' | 'player')
 * - turfs (registered facilities)
 * - slots (time slots per turf per date)
 * - bookings (player reservations)
 */

const TURFIFY_SUPABASE_CONFIG = {
  URL: 'https://fksdanhjdhqbpijoolzf.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2RhbmhqZGhxYnBpam9vbHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDA3MDQsImV4cCI6MjEwODIxNjcwNH0.kXpr4ohoHuv-XFrSyqGjzXh3cYcFmn4dXmq_ZUsKTz0'
};

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

const DEFAULT_BOOKINGS = [];

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
    matches_played: 0,
    loyalty_pts: 0,
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
    matches_played: 0,
    loyalty_pts: 0,
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
    // One-time migration: purge legacy fake default turfs & bookings from localStorage cache
    const FAKE_IDS = ['turf-1', 'turf-2', 'turf-3'];
    try {
      const cached = JSON.parse(localStorage.getItem(TURFIFY_STORAGE_KEYS.TURFS));
      if (Array.isArray(cached) && cached.some(t => FAKE_IDS.includes(t.id))) {
        const cleaned = cached.filter(t => !FAKE_IDS.includes(t.id));
        localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(cleaned));
      }
      const cachedBks = JSON.parse(localStorage.getItem(TURFIFY_STORAGE_KEYS.BOOKINGS));
      if (Array.isArray(cachedBks)) {
        const cleanedBks = cachedBks.filter(b => !FAKE_IDS.includes(b.turf_id) && !['bk-101', 'bk-102', 'bk-103', 'bk-104'].includes(b.id));
        localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(cleanedBks));
      }
    } catch (e) {}

    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.TURFS)) {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify([]));
    }
    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify([]));
    }
    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.USERS)) {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS_LIST));
    }

    // Immediately trigger server sync across windows
    this.syncWithServer().catch(() => {});
  },


  async syncWithServer() {
    try {
      let serverData = { turfs: [], bookings: [] };

      // 1. Primary Cloud Sync: Query Supabase REST API directly
      try {
        const sbHeaders = {
          'apikey': TURFIFY_SUPABASE_CONFIG.ANON_KEY,
          'Authorization': 'Bearer ' + TURFIFY_SUPABASE_CONFIG.ANON_KEY
        };
        const [tRes, bRes] = await Promise.all([
          fetch(`${TURFIFY_SUPABASE_CONFIG.URL}/rest/v1/turfs?select=*`, { headers: sbHeaders }),
          fetch(`${TURFIFY_SUPABASE_CONFIG.URL}/rest/v1/bookings?select=*`, { headers: sbHeaders })
        ]);
        if (tRes.ok) {
          const tJson = await tRes.json();
          if (Array.isArray(tJson)) serverData.turfs = tJson;
        }
        if (bRes.ok) {
          const bJson = await bRes.json();
          if (Array.isArray(bJson)) serverData.bookings = bJson;
        }
      } catch (err) {
        console.warn('Supabase cloud fetch note:', err);
      }

      // 2. Secondary fallback to local API if cloud is empty
      if (!serverData.turfs.length && !serverData.bookings.length) {
        try {
          let res = await fetch('/api/data');
          if (!res.ok) res = await fetch('/turfify_database.json');
          if (res.ok) {
            const fallbackData = await res.json();
            serverData = { ...serverData, ...fallbackData };
          }
        } catch (e) {}
      }

      if (serverData.turfs.length > 0 || serverData.bookings.length > 0) {
        let changed = false;

        // 1. MERGE TURFS: Keep all locally created/updated turfs, add any missing server turfs
        if (Array.isArray(serverData.turfs)) {
          const localTurfs = this.getTurfs();
          let deletedTurfs = [];
          try {
            deletedTurfs = JSON.parse(localStorage.getItem('turfify_deleted_turfs') || '[]');
          } catch (e) {}

          if (Array.isArray(serverData.deleted_turfs)) {
            serverData.deleted_turfs.forEach(dt => {
              const str = String(dt);
              if (!deletedTurfs.includes(str)) deletedTurfs.push(str);
            });
            localStorage.setItem('turfify_deleted_turfs', JSON.stringify(deletedTurfs));
          }

          // Purge any deleted turfs from local list
          let mergedTurfs = localTurfs.filter(lt => !deletedTurfs.includes(String(lt.id)));
          if (mergedTurfs.length !== localTurfs.length) {
            changed = true;
          }

          serverData.turfs.forEach(st => {
            if (deletedTurfs.includes(String(st.id))) return;
            const idx = mergedTurfs.findIndex(lt => String(lt.id) === String(st.id));
            if (idx === -1) {
              mergedTurfs.push(st);
              changed = true;
            } else {
              mergedTurfs[idx] = { ...st, ...mergedTurfs[idx] };
            }
          });

          if (localTurfs.length === 0 || changed) {
            localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(mergedTurfs));
          }
        }

        // 2. MERGE BOOKINGS: Keep all locally created bookings, update/add server bookings
        if (Array.isArray(serverData.bookings) && serverData.bookings.length > 0) {
          const localBookings = this.getBookings();

          let cancelledList = [];
          try {
            cancelledList = JSON.parse(localStorage.getItem('turfify_cancelled_bookings') || '[]');
          } catch (e) {}

          // Load deleted bookings blacklist — these are NEVER shown again
          let deletedBookingsList = [];
          try {
            deletedBookingsList = JSON.parse(localStorage.getItem('turfify_deleted_bookings') || '[]');
          } catch (e) {}

          // Merge server-side deleted_booking_ids into local blacklist (cross-device consistency)
          if (Array.isArray(serverData.deleted_booking_ids)) {
            let changed_dl = false;
            serverData.deleted_booking_ids.forEach(sid => {
              const str = String(sid);
              if (!deletedBookingsList.includes(str)) {
                deletedBookingsList.push(str);
                changed_dl = true;
              }
            });
            if (changed_dl) {
              try {
                localStorage.setItem('turfify_deleted_bookings', JSON.stringify(deletedBookingsList));
              } catch (e) {}
            }
          }

          // Filter out any locally deleted bookings
          let mergedBookings = localBookings.filter(b => !deletedBookingsList.includes(String(b.id)));
          if (mergedBookings.length !== localBookings.length) {
            changed = true;
          }

          // Merge server-side cancelled_booking_ids into local blacklist (cross-device consistency)
          if (Array.isArray(serverData.cancelled_booking_ids)) {
            let changed_cl = false;
            serverData.cancelled_booking_ids.forEach(sid => {
              const str = String(sid);
              if (!cancelledList.includes(str)) {
                cancelledList.push(str);
                changed_cl = true;
              }
            });
            if (changed_cl) {
              try {
                localStorage.setItem('turfify_cancelled_bookings', JSON.stringify(cancelledList));
              } catch (e) {}
            }
          }

          serverData.bookings.forEach(sb => {
            // Skip bookings the user has permanently deleted — never re-add them
            if (deletedBookingsList.includes(String(sb.id))) return;

            const isCancelled = cancelledList.includes(String(sb.id));
            const idx = mergedBookings.findIndex(lb => String(lb.id) === String(sb.id));
            if (idx >= 0) {
              // NEVER allow a stale server 'Confirmed' record to overwrite a local 'Cancelled' record!
              const localIsCancelled = mergedBookings[idx].status === 'Cancelled' || isCancelled;
              if (localIsCancelled) {
                if (mergedBookings[idx].status !== 'Cancelled') {
                  mergedBookings[idx].status = 'Cancelled';
                  changed = true;
                }
              } else {
                if (JSON.stringify(mergedBookings[idx]) !== JSON.stringify(sb)) {
                  mergedBookings[idx] = { ...mergedBookings[idx], ...sb };
                  changed = true;
                }
              }
            } else {
              if (isCancelled) {
                mergedBookings.push({ ...sb, status: 'Cancelled' });
              } else {
                mergedBookings.push(sb);
              }
              changed = true;
            }
          });

          if (localBookings.length === 0 || changed) {
            // Never persist deleted bookings back to storage
            const finalBookings = mergedBookings.filter(b => !deletedBookingsList.includes(String(b.id)));
            localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(finalBookings));
          }
        }

        // 3. MERGE USERS: Keep all locally registered users, add any missing server users
        if (Array.isArray(serverData.users) && serverData.users.length > 0) {
          let deletedUsers = [];
          try {
            deletedUsers = JSON.parse(localStorage.getItem('turfify_deleted_users') || '[]');
          } catch (e) {}
          const isDel = (id, email) => {
            if (!id && !email) return false;
            return deletedUsers.some(d => (id && d.toLowerCase() === id.toLowerCase()) || (email && d.toLowerCase() === email.toLowerCase()));
          };

          const cleanServerUsers = serverData.users.filter(su => !isDel(su.id, su.email));
          const localUsers = this.getUsers().filter(lu => !isDel(lu.id, lu.email));
          const mergedUsers = [...localUsers];

          cleanServerUsers.forEach(su => {
            const exists = mergedUsers.some(lu => 
              (su.id && lu.id && su.id === lu.id) || 
              (su.email && lu.email && su.email.toLowerCase() === lu.email.toLowerCase())
            );
            if (!exists) {
              mergedUsers.push(su);
              changed = true;
            }
          });

          if (localUsers.length === 0 || changed) {
            localStorage.setItem(TURFIFY_STORAGE_KEYS.USERS, JSON.stringify(mergedUsers));
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
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
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
    if (!userId) return;
    let users = this.getUsers();
    const target = users.find(u => (u.id && u.id.toLowerCase() === userId.toLowerCase()) || (u.email && u.email.toLowerCase() === userId.toLowerCase()));
    const email = target?.email;

    // 1. Blacklist user so sync/synthesis never brings them back
    try {
      const deleted = JSON.parse(localStorage.getItem('turfify_deleted_users') || '[]');
      if (!deleted.some(d => d.toLowerCase() === userId.toLowerCase())) deleted.push(userId);
      if (email && !deleted.some(d => d.toLowerCase() === email.toLowerCase())) deleted.push(email);
      localStorage.setItem('turfify_deleted_users', JSON.stringify(deleted));
    } catch (e) {}

    // 2. Remove from local store
    users = users.filter(u =>
      (u.id && u.id.toLowerCase() !== userId.toLowerCase()) &&
      (!email || !u.email || u.email.toLowerCase() !== email.toLowerCase())
    );
    localStorage.setItem(TURFIFY_STORAGE_KEYS.USERS, JSON.stringify(users));

    // 3. Delete from backend server
    fetch(`/api/user?id=${encodeURIComponent(userId)}`, { method: 'DELETE' }).catch(() => {});

    try {
      window.dispatchEvent(new CustomEvent('turfify:users_updated', { detail: { id: userId, deleted: true } }));
      window.dispatchEvent(new CustomEvent('turfify:data_synced', { detail: { users } }));
    } catch (e) {}
  },

  switchRole(role) {
    const cur = this.getCurrentUser();
    if (!cur) return;
    cur.role = role;
    this.setCurrentUser(cur);
  },

  getTurfs() {
    try {
      return JSON.parse(localStorage.getItem(TURFIFY_STORAGE_KEYS.TURFS)) || [];
    } catch {
      return [];
    }
  },

  getOwnerTurfs(ownerId) {
    const cur = this.getCurrentUser();
    const turfs = this.getTurfs();
    const targetId = ownerId || cur?.id;
    const targetEmail = cur?.email ? cur.email.toLowerCase().trim() : null;
    const targetName = cur?.name ? cur.name.toLowerCase().trim() : null;
    const targetPhone = cur?.phone ? cur.phone.replace(/[^0-9]/g, '') : null;

    if (!targetId && !targetEmail && !targetName && !targetPhone) return [];

    const matched = turfs.filter(t => {
      // Direct ID match
      if (targetId && t.owner_id === targetId) return true;
      // Email match across windows & sessions
      if (targetEmail && t.owner_email && t.owner_email.toLowerCase().trim() === targetEmail) return true;
      // Phone match
      if (targetPhone && targetPhone.length >= 7 && t.owner_phone) {
        const cleanTurfPhone = t.owner_phone.replace(/[^0-9]/g, '');
        if (cleanTurfPhone.endsWith(targetPhone.slice(-10)) || targetPhone.endsWith(cleanTurfPhone.slice(-10))) return true;
      }
      // Name match fallback
      if (targetName && t.owner_name && t.owner_name.toLowerCase().trim() === targetName && targetName !== 'turf owner') return true;
      return false;
    });

    // ONLY in pure guest/unauthenticated demo mode (never for real signed-in users with email), show all turfs
    if (matched.length === 0 && !cur?.is_authenticated && !cur?.email && turfs.length > 0) {
      return turfs;
    }
    return matched;
  },

  addTurf(newTurf) {
    const turfs = this.getTurfs();
    const cur = this.getCurrentUser();
    const rawImages = Array.isArray(newTurf.images) && newTurf.images.length > 0
      ? newTurf.images
      : (newTurf.image ? [newTurf.image] : ['images/turf-arena.jpg']);
    const primaryImg = rawImages[0] || newTurf.image || 'images/turf-arena.jpg';

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
      image: primaryImg,
      images: rawImages,
      ...newTurf,
      image: primaryImg,
      images: rawImages
    };

    const existingIdx = turfs.findIndex(t => t.id === turf.id);
    if (existingIdx >= 0) {
      turfs[existingIdx] = { ...turfs[existingIdx], ...turf };
    } else {
      turfs.unshift(turf);
    }
    localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(turfs));

    // 1. Async push to Supabase Cloud
    const sbTurfPayload = {
      id: String(turf.id),
      owner_id: String(turf.owner_id || ''),
      owner_name: String(turf.owner_name || ''),
      owner_email: String(turf.owner_email || ''),
      owner_phone: String(turf.owner_phone || ''),
      name: String(turf.name || 'Untitled Turf'),
      sport: String(turf.sport || 'Football'),
      category: String(turf.category || ''),
      location: String(turf.location || ''),
      city: String(turf.city || 'Chennai'),
      price_per_hour: parseInt(turf.price_per_hour || 1200, 10),
      rating: parseFloat(turf.rating || 5.0),
      reviews_count: parseInt(turf.reviews_count || 1, 10),
      dimensions: String(turf.dimensions || ''),
      surface: String(turf.surface || ''),
      environment: String(turf.environment || 'outdoor'),
      image: String(primaryImg),
      images: rawImages,
      amenities: Array.isArray(turf.amenities) ? turf.amenities : [],
      operating_slots: Array.isArray(turf.operating_slots) ? turf.operating_slots : []
    };

    fetch(`${TURFIFY_SUPABASE_CONFIG.URL}/rest/v1/turfs`, {
      method: 'POST',
      headers: {
        'apikey': TURFIFY_SUPABASE_CONFIG.ANON_KEY,
        'Authorization': 'Bearer ' + TURFIFY_SUPABASE_CONFIG.ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(sbTurfPayload)
    }).catch(() => {});

    // 2. Legacy server fallback
    fetch('/api/turf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(turf)
    }).catch(() => {});

    return turf;
  },

  async deleteTurf(turfId) {
    if (!turfId) return;
    const strId = String(turfId);

    // 1. Blacklist turf so sync never restores it
    try {
      const deleted = JSON.parse(localStorage.getItem('turfify_deleted_turfs') || '[]');
      if (!deleted.includes(strId)) {
        deleted.push(strId);
        localStorage.setItem('turfify_deleted_turfs', JSON.stringify(deleted));
      }
    } catch (e) {}

    // 2. Remove from local store
    let turfs = this.getTurfs();
    turfs = turfs.filter(t => String(t.id) !== strId);
    localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(turfs));

    // 3. Delete from Supabase Cloud
    try {
      fetch(`${TURFIFY_SUPABASE_CONFIG.URL}/rest/v1/turfs?id=eq.${encodeURIComponent(strId)}`, {
        method: 'DELETE',
        headers: {
          'apikey': TURFIFY_SUPABASE_CONFIG.ANON_KEY,
          'Authorization': 'Bearer ' + TURFIFY_SUPABASE_CONFIG.ANON_KEY
        }
      }).catch(() => {});
    } catch (e) {}

    // 4. Delete from backend server
    try {
      await fetch(`/api/turf?id=${encodeURIComponent(strId)}`, { method: 'DELETE' });
    } catch (e) {}

    // 4. Notify open tabs
    try {
      window.dispatchEvent(new CustomEvent('turfify:turf_deleted', { detail: { id: strId } }));
      window.dispatchEvent(new CustomEvent('turfify:data_synced', { detail: { turfs } }));
    } catch (e) {}
    return true;
  },

  getBookings() {
    try {
      const bks = JSON.parse(localStorage.getItem(TURFIFY_STORAGE_KEYS.BOOKINGS)) || DEFAULT_BOOKINGS;
      let deletedList = [];
      try {
        deletedList = JSON.parse(localStorage.getItem('turfify_deleted_bookings') || '[]');
      } catch (e) {}
      if (Array.isArray(deletedList) && deletedList.length > 0) {
        return bks.filter(b => !deletedList.includes(String(b.id)));
      }
      return bks;
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

    const matched = bks.filter(b => {
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
      // ONLY in pure guest/unauthenticated mode, match guest-style player-xxx bookings
      if (!cur?.is_authenticated && !cur?.email && (b.player_id === 'player-1' || (b.player_id && b.player_id.startsWith('player-')))) return true;
      return false;
    });

    // ONLY for unauthenticated guest sessions with no email: show demo bookings
    if (matched.length === 0 && !cur?.is_authenticated && !cur?.email && bks.length > 0) {
      return bks;
    }
    return matched;
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

    const matched = bks.filter(b => {
      // 1. Direct turf ID match
      if (b.turf_id && ownerTurfIds.includes(b.turf_id)) return true;
      // 2. Direct turf name match
      if (b.turf_name && ownerTurfNames.includes(b.turf_name.toLowerCase().trim())) return true;
      // 3. Direct owner_id match on booking
      if (effectiveOwnerId && b.owner_id === effectiveOwnerId) return true;
      // 4. Direct owner_email match on booking
      if (ownerEmail && b.owner_email && b.owner_email.toLowerCase() === ownerEmail) return true;
      // 5. Direct owner_phone match on booking
      if (ownerPhone && ownerPhone.length >= 7 && b.owner_phone) {
        const cleanBPhone = b.owner_phone.replace(/[^0-9]/g, '');
        if (cleanBPhone.endsWith(ownerPhone.slice(-10)) || ownerPhone.endsWith(cleanBPhone.slice(-10))) return true;
      }
      // 6. Direct owner_name match on booking
      if (ownerName && b.owner_name && b.owner_name.toLowerCase() === ownerName && ownerName !== 'turf owner') return true;
      return false;
    });

    // ONLY for unauthenticated guest/demo sessions with no email: show demo bookings
    if (matched.length === 0 && !cur?.is_authenticated && !cur?.email && bks.length > 0) {
      return bks;
    }
    return matched;
  },

  createBooking(bookingData) {
    const bks = this.getBookings();
    const cur = this.getCurrentUser();

    // Look up turf to attach owner information directly onto the booking
    const turfs = this.getTurfs();
    const turf = turfs.find(t => 
      (bookingData.turf_id && String(t.id) === String(bookingData.turf_id)) || 
      (bookingData.turf_name && t.name && t.name.toLowerCase().trim() === bookingData.turf_name.toLowerCase().trim())
    );

    const newBooking = {
      id: 'bk-' + Math.floor(100 + Math.random() * 900),
      turf_id: bookingData.turf_id || turf?.id || 'turf-1',
      turf_name: bookingData.turf_name || turf?.name || 'Turf Arena',
      sport: bookingData.sport || turf?.sport || 'Football',
      player_id: bookingData.player_id || cur?.id || ('player-' + Date.now()),
      player_name: bookingData.player_name || cur?.name || 'Guest Player',
      player_email: bookingData.player_email || cur?.email || '',
      player_phone: bookingData.player_phone || cur?.phone || '',
      status: bookingData.status || 'Confirmed',
      payment_status: bookingData.payment_status || 'Paid Online',
      booking_time: new Date().toLocaleString(),
      ...bookingData,
      // Ensure owner attributes are reliably populated from turf
      owner_id: turf?.owner_id || bookingData.owner_id || '',
      owner_name: turf?.owner_name || bookingData.owner_name || '',
      owner_email: turf?.owner_email || bookingData.owner_email || '',
      owner_phone: turf?.owner_phone || bookingData.owner_phone || ''
    };
    bks.unshift(newBooking);
    localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(bks));

    // Also update current player match stats
    if (cur && (!cur.role || cur.role === 'player')) {
      const slotsCount = Array.isArray(bookingData.time_slots) ? bookingData.time_slots.length : 1;
      cur.matches_played = (cur.matches_played || 0) + 1;
      cur.loyalty_pts = (cur.loyalty_pts || 0) + (25 * slotsCount);
      this.setCurrentUser(cur);
      this.addUser(cur);
    }

    // Push to Supabase Cloud (cross-device sync)
    const sbBookingPayload = {
      id: String(newBooking.id),
      turf_id: String(newBooking.turf_id || ''),
      turf_name: String(newBooking.turf_name || ''),
      sport: String(newBooking.sport || ''),
      player_id: String(newBooking.player_id || ''),
      player_name: String(newBooking.player_name || ''),
      player_email: String(newBooking.player_email || ''),
      player_phone: String(newBooking.player_phone || ''),
      owner_id: String(newBooking.owner_id || ''),
      owner_name: String(newBooking.owner_name || ''),
      owner_email: String(newBooking.owner_email || ''),
      owner_phone: String(newBooking.owner_phone || ''),
      date: String(newBooking.date || new Date().toISOString().split('T')[0]),
      time_slot: String(newBooking.time_slot || (Array.isArray(newBooking.time_slots) ? newBooking.time_slots[0] : '6:00 PM - 7:00 PM')),
      time_slots: Array.isArray(newBooking.time_slots) ? newBooking.time_slots : (newBooking.time_slot ? [newBooking.time_slot] : []),
      field_name: String(newBooking.field_name || ''),
      amount: parseInt(newBooking.amount || 1200, 10),
      status: String(newBooking.status || 'Confirmed'),
      payment_status: String(newBooking.payment_status || 'Paid Online'),
      booking_time: String(newBooking.booking_time || new Date().toLocaleString())
    };

    fetch(`${TURFIFY_SUPABASE_CONFIG.URL}/rest/v1/bookings`, {
      method: 'POST',
      headers: {
        'apikey': TURFIFY_SUPABASE_CONFIG.ANON_KEY,
        'Authorization': 'Bearer ' + TURFIFY_SUPABASE_CONFIG.ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(sbBookingPayload)
    }).catch(() => {});

    // Try posting to backend if available
    fetch('/api/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking)
    }).catch(() => {});

    try {
      window.dispatchEvent(new CustomEvent('turfify:booking_created', { detail: newBooking }));
    } catch (e) {}

    return newBooking;
  },

  cancelBooking(bookingId) {
    if (!bookingId) return;
    const strId = String(bookingId);
    const bks = this.getBookings();
    const idx = bks.findIndex(b => String(b.id) === strId);

    // 1. Maintain persistent blacklist of cancelled bookings
    try {
      const cancelledList = JSON.parse(localStorage.getItem('turfify_cancelled_bookings') || '[]');
      if (!cancelledList.includes(strId)) {
        cancelledList.push(strId);
        localStorage.setItem('turfify_cancelled_bookings', JSON.stringify(cancelledList));
      }
    } catch (e) {}

    if (idx !== -1) {
      bks[idx].status = 'Cancelled';
      bks[idx].cancelled_at = new Date().toISOString();
      localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(bks));

      // Deduct stats from current user when they cancel
      const cur = this.getCurrentUser();
      if (cur && (!cur.role || cur.role === 'player')) {
        const cancelledBooking = bks[idx];
        const slotsCount = Array.isArray(cancelledBooking.time_slots) ? cancelledBooking.time_slots.length : 1;
        cur.matches_played = Math.max(0, (cur.matches_played || 0) - 1);
        cur.loyalty_pts = Math.max(0, (cur.loyalty_pts || 0) - (25 * slotsCount));
        this.setCurrentUser(cur);
        this.addUser(cur);
      }

      // Dispatch events so all open tabs/windows (owner dashboard, etc.) react immediately
      try {
        window.dispatchEvent(new CustomEvent('turfify:booking_cancelled', { detail: { id: strId } }));
        window.dispatchEvent(new CustomEvent('turfify:data_synced', { detail: { bookings: bks } }));
      } catch (e) {}

      // Push cancellation to server so it persists across reloads
      fetch('/api/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: strId })
      }).catch(() => {});

      // Push cancellation to Supabase Cloud (cross-device sync)
      fetch(`${TURFIFY_SUPABASE_CONFIG.URL}/rest/v1/bookings?id=eq.${encodeURIComponent(strId)}`, {
        method: 'PATCH',
        headers: {
          'apikey': TURFIFY_SUPABASE_CONFIG.ANON_KEY,
          'Authorization': 'Bearer ' + TURFIFY_SUPABASE_CONFIG.ANON_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Cancelled', cancelled_at: new Date().toISOString() })
      }).catch(() => {});
    }
  },

  deleteBooking(bookingId) {
    if (!bookingId) return;
    const strId = String(bookingId);

    // 1. Add to permanent deleted blacklist — syncWithServer() will never re-add this
    try {
      const deletedList = JSON.parse(localStorage.getItem('turfify_deleted_bookings') || '[]');
      if (!deletedList.includes(strId)) {
        deletedList.push(strId);
        localStorage.setItem('turfify_deleted_bookings', JSON.stringify(deletedList));
      }
    } catch (e) {}

    // 2. Also add to cancelled blacklist so server sync skips it entirely
    try {
      const cancelledList = JSON.parse(localStorage.getItem('turfify_cancelled_bookings') || '[]');
      if (!cancelledList.includes(strId)) {
        cancelledList.push(strId);
        localStorage.setItem('turfify_cancelled_bookings', JSON.stringify(cancelledList));
      }
    } catch (e) {}

    // 3. Remove from local bookings storage immediately
    const bks = this.getBookings().filter(b => String(b.id) !== strId);
    try {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(bks));
    } catch (e) {}

    // 4. Dispatch events so all open tabs/windows react immediately
    try {
      window.dispatchEvent(new CustomEvent('turfify:booking_deleted', { detail: { id: strId } }));
      window.dispatchEvent(new CustomEvent('turfify:booking_cancelled', { detail: { id: strId } }));
      window.dispatchEvent(new CustomEvent('turfify:data_synced', { detail: { bookings: bks } }));
    } catch (e) {}

    // 5. Notify server endpoint to delete from server JSON
    fetch('/api/delete-booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: strId })
    }).catch(() => {});
  }
};

// Initialize immediately
window.TurfifyStore.init();
