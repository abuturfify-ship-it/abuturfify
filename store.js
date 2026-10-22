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
  TURFS: 'turfify_turfs',
  BOOKINGS: 'turfify_bookings',
  SLOTS: 'turfify_slots'
};

// Initial Seed Data
const DEFAULT_TURFS = [
  {
    id: 'turf-1',
    owner_id: 'owner-1',
    name: 'The Arena Sports Hub',
    sport: 'Football',
    location: 'Indiranagar, Bangalore',
    price_per_hour: 1200,
    rating: 4.9,
    reviews_count: 142,
    dimensions: '7v7 FIFA Standard Turf',
    amenities: ['Floodlights', 'Dressing Room', 'Showers', 'Cafeteria', 'Parking', 'Bibs & Balls'],
    image: 'images/turf-arena.jpg',
    available_today: 12,
    total_slots_day: 16
  },
  {
    id: 'turf-2',
    owner_id: 'owner-1',
    name: 'Koramangala Kickoff Arena',
    sport: 'Box Cricket',
    location: 'Koramangala 5th Block, Bangalore',
    price_per_hour: 1500,
    rating: 4.8,
    reviews_count: 98,
    dimensions: '6v6 Enclosed Astro-Turf',
    amenities: ['Floodlights', 'Live Scoring Screen', 'Bowling Machine', 'Parking', 'Mineral Water'],
    image: 'images/turf-kickoff.jpg',
    available_today: 9,
    total_slots_day: 16
  },
  {
    id: 'turf-3',
    owner_id: 'owner-2',
    name: 'GameOn Multi-Sport Turf',
    sport: 'Badminton',
    location: 'HSR Layout Sector 2, Bangalore',
    price_per_hour: 800,
    rating: 4.9,
    reviews_count: 210,
    dimensions: '4 Synthetic BWF Approved Courts',
    amenities: ['Air Conditioned', 'Yonex Rackets on Rent', 'Locker Room', 'Pro Shop'],
    image: 'images/turf-gameon.jpg',
    available_today: 14,
    total_slots_day: 16
  }
];

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
    phone: '+91 98860 11223',
    business_name: 'Arena Sports Facilities Pvt Ltd',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  player: {
    id: 'player-1',
    role: 'player',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    favorite_sport: 'Football',
    matches_played: 18,
    loyalty_pts: 450,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  }
};

window.TurfifyStore = {
  init() {
    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.TURFS)) {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(DEFAULT_TURFS));
    }
    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
    }
    if (!localStorage.getItem(TURFIFY_STORAGE_KEYS.CURRENT_USER)) {
      // Default initial role is owner or player
      localStorage.setItem(TURFIFY_STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS.player));
    }
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
  },

  switchRole(role) {
    if (role === 'owner') {
      this.setCurrentUser(DEFAULT_USERS.owner);
    } else {
      this.setCurrentUser(DEFAULT_USERS.player);
    }
  },

  getTurfs() {
    try {
      return JSON.parse(localStorage.getItem(TURFIFY_STORAGE_KEYS.TURFS)) || DEFAULT_TURFS;
    } catch {
      return DEFAULT_TURFS;
    }
  },

  getOwnerTurfs(ownerId = 'owner-1') {
    const turfs = this.getTurfs();
    return turfs.filter(t => t.owner_id === ownerId);
  },

  addTurf(newTurf) {
    const turfs = this.getTurfs();
    const turf = {
      id: 'turf-' + Date.now(),
      owner_id: this.getCurrentUser().id || 'owner-1',
      rating: 5.0,
      reviews_count: 1,
      available_today: 16,
      total_slots_day: 16,
      image: newTurf.image || 'https://images.unsplash.com/photo-1529900245534-47fbf8c3f4be?w=800&auto=format&fit=crop&q=80',
      ...newTurf
    };
    turfs.unshift(turf);
    localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(turfs));
    return turf;
  },

  deleteTurf(turfId) {
    let turfs = this.getTurfs();
    turfs = turfs.filter(t => t.id !== turfId);
    localStorage.setItem(TURFIFY_STORAGE_KEYS.TURFS, JSON.stringify(turfs));
  },

  getBookings() {
    try {
      return JSON.parse(localStorage.getItem(TURFIFY_STORAGE_KEYS.BOOKINGS)) || DEFAULT_BOOKINGS;
    } catch {
      return DEFAULT_BOOKINGS;
    }
  },

  getPlayerBookings(playerId = 'player-1') {
    const bks = this.getBookings();
    return bks.filter(b => b.player_id === playerId);
  },

  getOwnerBookings(ownerId = 'owner-1') {
    const ownerTurfIds = this.getOwnerTurfs(ownerId).map(t => t.id);
    const bks = this.getBookings();
    return bks.filter(b => ownerTurfIds.includes(b.turf_id));
  },

  createBooking(bookingData) {
    const bks = this.getBookings();
    const newBooking = {
      id: 'bk-' + Math.floor(100 + Math.random() * 900),
      status: 'Confirmed',
      payment_status: bookingData.payment_status || 'Paid Online',
      booking_time: new Date().toLocaleString(),
      ...bookingData
    };
    bks.unshift(newBooking);
    localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(bks));
    return newBooking;
  },

  cancelBooking(bookingId) {
    const bks = this.getBookings();
    const idx = bks.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bks[idx].status = 'Cancelled';
      localStorage.setItem(TURFIFY_STORAGE_KEYS.BOOKINGS, JSON.stringify(bks));
    }
  }
};

// Initialize immediately
window.TurfifyStore.init();
