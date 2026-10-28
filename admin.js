/* ==========================================================================
   TURFIFY ADMIN PANEL — INTERACTIVE SCRIPT
   Fully Dynamic: reads from TurfifyStore (localStorage)
   Revenue Split: Owner 70% | Admin Platform 30%
   ========================================================================== */

const OWNER_SHARE = 0.70;
const ADMIN_SHARE = 0.30;

// ─── Helpers ────────────────────────────────────────────────────────────────
function fmt(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

function getSportIcon(sport) {
  switch ((sport || '').toLowerCase()) {
    case 'football':  return '⚽';
    case 'cricket':   return '🏏';
    case 'badminton': return '🏸';
    case 'tennis':    return '🎾';
    default:          return '🏟️';
  }
}

function getAvatarColor(name) {
  const colors = [
    'linear-gradient(135deg, #10B981, #06B6D4)',
    'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    'linear-gradient(135deg, #F59E0B, #EA580C)',
    'linear-gradient(135deg, #EC4899, #8B5CF6)',
    'linear-gradient(135deg, #14B8A6, #0D9488)'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

// ─── Supabase Client & Profiles Sync ──────────────────────────────────────────
const SUPABASE_URL  = 'https://fksdanhjdhqbpijoolzf.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrc2RhbmhqZGhxYnBpam9vbHpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NDA3MDQsImV4cCI6MjEwODIxNjcwNH0.kXpr4ohoHuv-XFrSyqGjzXh3cYcFmn4dXmq_ZUsKTz0';
let sbAdmin = null;
let cachedSupabaseProfiles = [];

try {
  if (window.supabase) {
    sbAdmin = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
} catch (e) {
  console.warn('Supabase initialization note:', e);
}

async function fetchSupabaseProfiles() {
  if (!sbAdmin) return;
  try {
    const { data, error } = await sbAdmin.from('profiles').select('*').order('created_at', { ascending: false });
    if (!error && Array.isArray(data)) {
      cachedSupabaseProfiles = data;
      renderKPIs();
      renderUsersTable();
    }
  } catch (err) {
    console.warn('Could not fetch Supabase profiles in Admin:', err);
  }
}

// ─── TurfifyStore accessors ──────────────────────────────────────────────────
function getLiveBookings() {
  return window.TurfifyStore ? window.TurfifyStore.getBookings() : [];
}

function getLiveTurfs() {
  return window.TurfifyStore ? window.TurfifyStore.getTurfs() : [];
}

function getLiveUsers() {
  const bookings = getLiveBookings();
  const turfs = getLiveTurfs();
  const storeUsers = window.TurfifyStore ? window.TurfifyStore.getUsers() : [];

  let deletedUsers = [];
  try {
    deletedUsers = JSON.parse(localStorage.getItem('turfify_deleted_users') || '[]');
  } catch (e) {}
  const isDeleted = (id, email) => {
    if (!id && !email) return false;
    return deletedUsers.some(d =>
      (id && d.toLowerCase() === id.toLowerCase()) ||
      (email && d.toLowerCase() === email.toLowerCase())
    );
  };

  const userMap = {};

  // 1. Ingest registered users from TurfifyStore
  storeUsers.forEach(u => {
    if (isDeleted(u.id, u.email)) return;
    const key = (u.id || u.email || Math.random().toString()).toLowerCase();
    const isOwner = (u.role || '').toLowerCase() === 'owner' || (u.role || '').toLowerCase() === 'turf owner';
    userMap[key] = {
      id: u.id || key,
      name: u.name || u.full_name || (isOwner ? 'Turf Owner' : 'Player'),
      phone: u.phone || '—',
      email: u.email || '—',
      role: isOwner ? 'Turf Owner' : 'Player',
      bookings: 0,
      spent: 0,
      turfsManaged: 0,
      totalRevenue: 0,
      joined: u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
      status: u.status || 'Active'
    };
  });

  // 2. Merge with Supabase Profiles (if online)
  cachedSupabaseProfiles.forEach(p => {
    if (isDeleted(p.id, p.email)) return;
    const key = (p.id || p.email || '').toLowerCase();
    if (!key) return;
    const isOwner = (p.role || '').toLowerCase() === 'owner' || (p.role || '').toLowerCase() === 'turf owner';
    if (!userMap[key]) {
      userMap[key] = {
        id: p.id,
        name: p.full_name || p.name || (isOwner ? 'Turf Owner' : 'Player'),
        phone: p.phone || '—',
        email: p.email || '—',
        role: isOwner ? 'Turf Owner' : 'Player',
        bookings: 0,
        spent: 0,
        turfsManaged: 0,
        totalRevenue: 0,
        joined: p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently',
        status: 'Active'
      };
    } else {
      if (p.full_name) userMap[key].name = p.full_name;
      if (p.phone && userMap[key].phone === '—') userMap[key].phone = p.phone;
      if (p.email && userMap[key].email === '—') userMap[key].email = p.email;
    }
  });

  // 3. Connect Turfs to Owners (skip deleted owners)
  turfs.forEach(t => {
    if (!t.owner_id || isDeleted(t.owner_id, t.owner_email)) return;
    const matchKey = Object.keys(userMap).find(k => k === t.owner_id.toLowerCase() || (userMap[k].id && userMap[k].id.toLowerCase() === t.owner_id.toLowerCase()));
    if (matchKey) {
      userMap[matchKey].turfsManaged++;
      if (t.owner_name && (!userMap[matchKey].name || userMap[matchKey].name === 'Turf Owner')) {
        userMap[matchKey].name = t.owner_name;
      }
      if (t.owner_phone && userMap[matchKey].phone === '—') {
        userMap[matchKey].phone = t.owner_phone;
      }
      if (t.owner_email && userMap[matchKey].email === '—') {
        userMap[matchKey].email = t.owner_email;
      }
    } else {
      const oid = t.owner_id.toLowerCase();
      userMap[oid] = {
        id: t.owner_id,
        name: t.owner_name || ('Owner (' + t.owner_id + ')'),
        phone: t.owner_phone || '—',
        email: t.owner_email || '—',
        role: 'Turf Owner',
        turfsManaged: 1,
        totalRevenue: 0,
        bookings: 0,
        spent: 0,
        joined: 'Venue Partner',
        status: 'Active'
      };
    }
  });

  // 4. Connect Bookings to Players and calculate revenue for Owners
  bookings.forEach(b => {
    if (b.player_id && !isDeleted(b.player_id, b.player_email)) {
      const matchKey = Object.keys(userMap).find(k => k === b.player_id.toLowerCase() || (userMap[k].id && userMap[k].id.toLowerCase() === b.player_id.toLowerCase()));
      if (matchKey) {
        if (b.status !== 'Cancelled') {
          userMap[matchKey].bookings++;
          userMap[matchKey].spent += (b.amount || 0);
        }
      } else {
        const pid = b.player_id.toLowerCase();
        userMap[pid] = {
          id: b.player_id,
          name: b.player_name || 'Player',
          phone: b.player_phone || '—',
          email: '—',
          role: 'Player',
          bookings: b.status !== 'Cancelled' ? 1 : 0,
          spent: b.status !== 'Cancelled' ? (b.amount || 0) : 0,
          turfsManaged: 0,
          totalRevenue: 0,
          joined: b.date || 'Recently',
          status: 'Active'
        };
      }
    }

    // Owner side revenue split
    const turf = turfs.find(t => t.id === b.turf_id);
    if (turf && turf.owner_id && !isDeleted(turf.owner_id, turf.owner_email)) {
      const ownerKey = Object.keys(userMap).find(k => k === turf.owner_id.toLowerCase() || (userMap[k].id && userMap[k].id.toLowerCase() === turf.owner_id.toLowerCase()));
      if (ownerKey && b.status !== 'Cancelled') {
        userMap[ownerKey].totalRevenue += (b.amount || 0);
      }
    }
  });

  return Object.values(userMap).filter(u => !isDeleted(u.id, u.email));
}

// ─── Admin Authentication Gate ──────────────────────────────────────────────
const ADMIN_ALLOWED_USERS = ['admin', 'admin@turfify.com', 'superadmin'];

function checkAdminAuth() {
  const isAuth = sessionStorage.getItem('turfify_admin_authenticated') === 'true';
  const gate = document.getElementById('admin-auth-gate');
  if (gate) {
    gate.style.display = isAuth ? 'none' : 'flex';
  }
  return isAuth;
}

function initAdminAuthGate() {
  checkAdminAuth();

  const form = document.getElementById('admin-gate-form');
  const errBox = document.getElementById('admin-gate-error');
  const errMsg = document.getElementById('admin-gate-error-msg');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = (document.getElementById('admin-gate-username')?.value || '').trim().toLowerCase();
    const pass = (document.getElementById('admin-gate-password')?.value || '').trim();

    const isValidUser = ADMIN_ALLOWED_USERS.includes(username) || username.includes('admin');
    const isValidPass = (pass === 'admin123' || pass === 'admin' || pass === 'turfify2026');

    if (isValidUser && isValidPass) {
      sessionStorage.setItem('turfify_admin_authenticated', 'true');
      if (errBox) errBox.style.display = 'none';
      checkAdminAuth();
      showToast('Super Admin console unlocked.');
    } else {
      if (errBox) {
        errBox.style.display = 'flex';
        if (errMsg) errMsg.textContent = 'Invalid administrator credentials. Access restricted.';
      }
    }
  });

  document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
    sessionStorage.removeItem('turfify_admin_authenticated');
    window.location.href = 'index.html';
  });
}

// Application Controller
document.addEventListener('DOMContentLoaded', () => {
  initAdminAuthGate();
  initNavigation();
  renderKPIs();
  initDashboardCharts();
  renderTurfsList();
  renderBookingsTable();
  renderUsersTable();
  initFilters();
  initExportButtons();
  initModals();

  // Load cloud profiles and server database
  fetchSupabaseProfiles();
  if (window.TurfifyStore?.syncWithServer) {
    window.TurfifyStore.syncWithServer().then(() => {
      renderKPIs();
      renderTurfsList();
      renderBookingsTable();
      renderUsersTable();
    }).catch(() => {});
  }

  // Listen for real-time registrations and server sync across tabs and windows
  window.addEventListener('storage', (e) => {
    if (!e.key || e.key.startsWith('turfify_')) {
      renderKPIs();
      renderTurfsList();
      renderBookingsTable();
      renderUsersTable();
    }
  });

  window.addEventListener('turfify:data_synced', () => {
    renderKPIs();
    renderTurfsList();
    renderBookingsTable();
    renderUsersTable();
  });

  window.addEventListener('turfify:users_updated', () => {
    renderKPIs();
    renderUsersTable();
  });

  window.addEventListener('turfify:booking_created', () => {
    renderKPIs();
    renderTurfsList();
    renderBookingsTable();
    renderUsersTable();
  });

  window.addEventListener('turfify:booking_cancelled', () => {
    renderKPIs();
    renderTurfsList();
    renderBookingsTable();
    renderUsersTable();
  });
});

// ─── KPI Stats ───────────────────────────────────────────────────────────────
function renderKPIs() {
  const bookings = getLiveBookings();
  const turfs    = getLiveTurfs();
  const users    = getLiveUsers();

  const confirmed   = bookings.filter(b => b.status !== 'Cancelled');
  const totalGMV    = confirmed.reduce((s, b) => s + (b.amount || 0), 0);
  const adminRev    = Math.round(totalGMV * ADMIN_SHARE);
  const players     = users.filter(u => u.role === 'Player').length;
  const owners      = users.filter(u => u.role === 'Turf Owner').length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('kpi-gmv',           fmt(totalGMV));
  set('kpi-turfs',         turfs.length);
  set('nav-turfs-counter', turfs.length);
  set('kpi-bookings',      confirmed.length);
  set('kpi-users',         users.length);
  set('nav-users-counter', users.length);
  set('kpi-users-footer',  `${players} Players • ${owners} Owners`);
  set('kpi-admin-revenue', fmt(adminRev));

  renderActivityFeed(bookings.slice(0, 3));
  renderPaymentsSplit(confirmed, turfs);
}

// ─── Activity Feed ───────────────────────────────────────────────────────────
function renderActivityFeed(bookings) {
  const el = document.getElementById('activity-feed');
  if (!el) return;
  if (!bookings.length) {
    el.innerHTML = `<div style="text-align:center;padding:32px;color:#94A3B8;">No recent activity yet.</div>`;
    return;
  }
  el.innerHTML = bookings.map((b, i) => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;${i < bookings.length-1 ? 'border-bottom:1px solid var(--slate-50);' : ''}">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:1.2rem;">${getSportIcon(b.sport)}</span>
        <div>
          <div style="font-weight:700;color:var(--navy-900);">${b.player_name || 'Player'} booked ${b.turf_name || 'a Turf'}</div>
          <div style="font-size:0.76rem;color:var(--slate-400);">${b.date || ''} ${b.time_slot || ''} &bull; ${b.payment_status || ''}</div>
        </div>
      </div>
      <span class="status-pill ${b.status === 'Confirmed' ? 'confirmed' : b.status === 'Cancelled' ? 'cancelled' : 'walkin'}">${fmt(b.amount || 0)}</span>
    </div>
  `).join('');
}

// ─── Payments / Revenue Split ─────────────────────────────────────────────
function renderPaymentsSplit(confirmed, turfs) {
  const el = document.getElementById('payments-split-body');
  const summEl = document.getElementById('owner-payout-summary');

  const totalGMV = confirmed.reduce((sum, b) => sum + (b.amount || 0), 0);
  const ownerPayoutTotal = Math.round(totalGMV * OWNER_SHARE);
  const platformFeeTotal = Math.round(totalGMV * ADMIN_SHARE);

  // Dynamic Gateway breakdowns
  let upiAmt = 0, cardAmt = 0, cashAmt = 0;
  confirmed.forEach(b => {
    const status = (b.payment_status || '').toLowerCase();
    if (status.includes('upi') || status.includes('online')) {
      upiAmt += (b.amount || 0);
    } else if (status.includes('card')) {
      cardAmt += (b.amount || 0);
    } else {
      cashAmt += (b.amount || 0);
    }
  });

  const upiPct = totalGMV > 0 ? Math.round((upiAmt / totalGMV) * 100) : 0;
  const cardPct = totalGMV > 0 ? Math.round((cardAmt / totalGMV) * 100) : 0;
  const cashPct = totalGMV > 0 ? Math.max(0, 100 - upiPct - cardPct) : 0;

  const set = (id, val) => { const elem = document.getElementById(id); if (elem) elem.textContent = val; };
  set('payouts-gross-val', fmt(totalGMV));
  set('payouts-owner-val', fmt(ownerPayoutTotal));
  set('payouts-platform-val', fmt(platformFeeTotal));
  set('payouts-upi-val', fmt(upiAmt));
  set('payouts-upi-share', `${upiPct}% Share`);
  set('payouts-card-val', fmt(cardAmt));
  set('payouts-card-share', `${cardPct}% Share`);
  set('payouts-cash-val', fmt(cashAmt));
  set('payouts-cash-share', `${cashPct}% Share`);

  if (el) {
    if (!confirmed.length) {
      el.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:#94A3B8;">No payments or payouts recorded yet. Real bookings will automatically appear here.</td></tr>`;
    } else {
      // Per-booking rows
      el.innerHTML = confirmed.map(b => {
        const ownerAmt = Math.round((b.amount || 0) * OWNER_SHARE);
        const adminAmt = Math.round((b.amount || 0) * ADMIN_SHARE);
        const turf     = turfs.find(t => t.id === b.turf_id);
        const ownerName = turf?.owner_name || 'Owner';
        return `
          <tr>
            <td><span style="font-family:monospace;font-weight:700;color:#2563EB;">${b.id}</span></td>
            <td><div style="font-weight:600;">${b.player_name || '—'}</div><div style="font-size:0.74rem;color:#64748B;">${b.turf_name || '—'}</div></td>
            <td style="font-size:0.8rem;color:#64748B;">${b.date || '—'}<br><small>${b.time_slot || ''}</small></td>
            <td style="font-weight:700;">${fmt(b.amount || 0)}</td>
            <td><div style="font-weight:700;color:#10B981;">${fmt(ownerAmt)}</div><div style="font-size:0.72rem;color:#64748B;">${ownerName} (70%)</div></td>
            <td><div style="font-weight:700;color:#3B82F6;">${fmt(adminAmt)}</div><div style="font-size:0.72rem;color:#64748B;">Platform (30%)</div></td>
            <td><span class="status-pill confirmed">Paid</span></td>
          </tr>`;
      }).join('');
    }
  }

  // Owner payout summary
  if (summEl) {
    if (!confirmed.length) {
      summEl.innerHTML = `<div style="text-align:center;padding:24px;color:#94A3B8;">No owner payouts pending. Real bookings will automatically appear here.</div>`;
    } else {
      const ownerTotals = {};
      confirmed.forEach(b => {
        const turf = turfs.find(t => t.id === b.turf_id);
        const oid  = turf?.owner_id || b.turf_id;
        const oname = turf?.owner_name || 'Owner';
        if (!ownerTotals[oid]) ownerTotals[oid] = { name: oname, total: 0, count: 0 };
        ownerTotals[oid].total += (b.amount || 0);
        ownerTotals[oid].count++;
      });
      const entries = Object.values(ownerTotals);
      summEl.innerHTML = entries.length ? entries.map(o => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--slate-50);">
          <div>
            <div style="font-weight:700;color:var(--navy-900);">${o.name}</div>
            <div style="font-size:0.76rem;color:var(--slate-400);">${o.count} booking(s) &bull; GMV: ${fmt(o.total)}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:800;color:#10B981;font-size:1.05rem;">${fmt(Math.round(o.total * OWNER_SHARE))}</div>
            <div style="font-size:0.72rem;color:#64748B;">Owner Payout (70%)</div>
          </div>
        </div>
      `).join('') : `<div style="text-align:center;padding:24px;color:#94A3B8;">No owner payouts pending. Real bookings will automatically appear here.</div>`;
    }
  }
}

// Navigation Handling
function initNavigation() {
  const navButtons = document.querySelectorAll(".nav-link-btn[data-view]");
  const viewSections = document.querySelectorAll(".view-section");

  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetView = btn.getAttribute("data-view");

      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      viewSections.forEach(section => {
        section.classList.remove("active");
        if (section.id === `view-${targetView}`) {
          section.classList.add("active");
        }
      });

      // Close mobile drawer if open
      document.querySelector(".sidebar")?.classList.remove("mobile-open");
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.querySelector(".mobile-menu-trigger");
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      document.querySelector(".sidebar")?.classList.toggle("mobile-open");
    });
  }
}

// ─── Chart (dynamic from real bookings) ────────────────────────────────────
function initDashboardCharts() {
  const chartWrapper = document.getElementById('revenue-curve-svg');
  if (!chartWrapper) return;

  const bookings = getLiveBookings().filter(b => b.status !== 'Cancelled');
  const byDate = {};
  bookings.forEach(b => { const d = b.date || 'N/A'; byDate[d] = (byDate[d] || 0) + (b.amount || 0); });
  const dates = Object.keys(byDate).sort().slice(-7);
  const vals  = dates.map(d => byDate[d]);
  const maxVal = Math.max(...vals, 1);

  if (!dates.length) {
    chartWrapper.innerHTML = `<div style="padding:40px;text-align:center;color:#94A3B8;">No booking data yet for chart.</div>`;
    return;
  }

  const svgW = 540, svgH = 200, padX = 30, padY = 20;
  const stepX = (svgW - padX * 2) / Math.max(dates.length - 1, 1);
  const points = dates.map((d, i) => ({
    x: padX + i * stepX,
    y: svgH - padY - ((vals[i] / maxVal) * (svgH - padY * 2)),
    label: d.slice(5),
    val: fmt(vals[i])
  }));

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    pathD += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const fillD = `${pathD} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

  let circlesHtml = "";
  let labelsHtml = "";

  points.forEach(p => {
    circlesHtml += `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="#10B981" stroke="#ffffff" stroke-width="2.5" class="chart-point">
        <title>${p.label}: ${p.val}</title>
      </circle>
    `;
    labelsHtml += `
      <text x="${p.x}" y="220" text-anchor="middle" font-size="11" font-family="'Plus Jakarta Sans', sans-serif" fill="#64748B" font-weight="600">${p.label}</text>
    `;
  });

  chartWrapper.innerHTML = `
    <svg viewBox="0 0 540 230" class="chart-svg">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#10B981" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <!-- Gridlines -->
      <line x1="20" y1="50" x2="520" y2="50" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="4" />
      <line x1="20" y1="100" x2="520" y2="100" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="4" />
      <line x1="20" y1="150" x2="520" y2="150" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="4" />
      
      <!-- Area Fill -->
      <path d="${fillD}" fill="url(#chartGradient)" />
      
      <!-- Curve Line -->
      <path d="${pathD}" fill="none" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" />
      
      <!-- Interactive Dots -->
      ${circlesHtml}
      
      <!-- X-Axis Labels -->
      ${labelsHtml}
    </svg>
  `;
}

// Render Turfs Grid
function renderTurfsList(filterSport = 'all', searchQuery = '') {
  const container = document.getElementById('turfs-grid-container');
  if (!container) return;

  let turfs = getLiveTurfs();

  if (filterSport !== 'all') {
    turfs = turfs.filter(t => (t.sport || '').toLowerCase() === filterSport.toLowerCase());
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    turfs = turfs.filter(t => (t.name || '').toLowerCase().includes(q) || (t.location || '').toLowerCase().includes(q));
  }

  if (!turfs.length) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#94A3B8;">No turfs registered yet.</div>`;
    return;
  }

  container.innerHTML = turfs.map(t => `
    <div class="turf-admin-card" id="card-${t.id}">
      <div class="turf-card-header-img" style="background-image:url('${t.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80'}')">
        <div class="turf-card-overlay">
          <span class="turf-sport-badge">${getSportIcon(t.sport)} ${t.sport || 'Sport'}</span>
          <span class="status-pill active">active</span>
        </div>
      </div>
      <div class="turf-card-content">
        <h3 class="turf-card-title">${t.name}</h3>
        <p class="turf-card-location">📍 ${t.location || '—'}</p>
        <div class="turf-metric-bar">
          <div><div class="turf-metric-unit">Rate/hr</div><div class="turf-metric-num">${fmt(t.price_per_hour || 0)}</div></div>
          <div><div class="turf-metric-unit">Rating</div><div class="turf-metric-num">⭐ ${t.rating || 'New'}</div></div>
          <div><div class="turf-metric-unit">Reviews</div><div class="turf-metric-num">${t.reviews_count || 0}</div></div>
        </div>
        <div style="font-size:0.78rem;color:#64748B;margin-bottom:8px;">Owner ID: <strong>${t.owner_id || '—'}</strong></div>
        ${Array.isArray(t.amenities) && t.amenities.length ? `
          <div style="display:flex;gap:4px;flex-wrap:wrap;margin:4px 0 10px 0;">
            ${t.amenities.map(a => `<span style="background:#ECFDF5;color:#047857;font-size:0.68rem;font-weight:700;padding:2px 7px;border-radius:4px;border:1px solid #A7F3D0;">✓ ${a}</span>`).join('')}
          </div>
        ` : ''}
        <div class="turf-card-actions">
          <button class="table-action-btn delete" onclick="adminDeleteTurf('${t.id}')">🗑️ Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Bookings Table
function renderBookingsTable(filterStatus = 'all', searchQuery = '') {
  const tbody = document.getElementById('bookings-table-body');
  if (!tbody) return;

  let bookings = getLiveBookings();

  if (filterStatus !== 'all') {
    bookings = bookings.filter(b => (b.status || '').toLowerCase() === filterStatus.toLowerCase());
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    bookings = bookings.filter(b =>
      (b.player_name || '').toLowerCase().includes(q) ||
      (b.turf_name || '').toLowerCase().includes(q) ||
      (b.id || '').toLowerCase().includes(q)
    );
  }

  if (!bookings.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:#94A3B8;">No bookings found.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    const ownerAmt = Math.round((b.amount || 0) * OWNER_SHARE);
    const adminAmt = Math.round((b.amount || 0) * ADMIN_SHARE);
    return `
      <tr id="row-${b.id}">
        <td><span style="font-family:monospace;font-weight:700;color:#2563EB;">${b.id}</span></td>
        <td>
          <div class="user-info-cell">
            <div class="cell-avatar" style="background:${getAvatarColor(b.player_name || '')}">${(b.player_name || 'PL').substring(0,2).toUpperCase()}</div>
            <div>
              <div class="user-name-cell">${b.player_name || '—'}</div>
              <div class="user-email-cell">${b.player_phone || '—'}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight:600;color:#0F172A;">${b.turf_name || '—'}</div>
          <div style="font-size:0.76rem;color:#64748B;">${b.date || ''} &bull; ${b.time_slot || ''}</div>
        </td>
        <td><span class="status-pill ${b.status === 'Confirmed' ? 'confirmed' : b.status === 'Cancelled' ? 'cancelled' : 'walkin'}">${b.status || '—'}</span></td>
        <td>
          <div style="font-weight:700;color:#0F172A;">${fmt(b.amount || 0)}</div>
          <div style="font-size:0.72rem;color:#10B981;">Owner: ${fmt(ownerAmt)} (70%)</div>
          <div style="font-size:0.72rem;color:#3B82F6;">Admin: ${fmt(adminAmt)} (30%)</div>
        </td>
        <td style="font-size:0.8rem;color:#64748B;">${b.payment_status || '—'}</td>
        <td>
          ${b.status !== 'Cancelled' ? `<button class="table-action-btn delete" onclick="adminCancelBooking('${b.id}')">Cancel</button>` : '<span style="color:#94A3B8;font-size:0.8rem;">Cancelled</span>'}
        </td>
      </tr>`;
  }).join('');
}

// Render Users Table
function renderUsersTable(filterRole = 'all', searchQuery = '') {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;

  let users = getLiveUsers();

  if (filterRole !== 'all') {
    users = users.filter(u => u.role.toLowerCase().includes(filterRole.toLowerCase()));
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    users = users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.phone || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:36px;color:#94A3B8;">No accounts match the current filter. New registrations will automatically appear here.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr id="user-row-${u.id}">
      <td>
        <div class="user-info-cell">
          <div class="cell-avatar" style="background:${getAvatarColor(u.name)}">${(u.name || 'US').substring(0,2).toUpperCase()}</div>
          <div>
            <div class="user-name-cell">${u.name || '—'}</div>
            <div class="user-email-cell">${u.phone || '—'}</div>
          </div>
        </div>
      </td>
      <td><span style="font-size:0.82rem;font-weight:600;color:#475569;">${u.email || '—'}</span></td>
      <td>
        <span class="status-pill ${u.role === 'Turf Owner' ? 'active' : 'walkin'}">${u.role === 'Turf Owner' ? '🏟️ Turf Owner' : '⚽ Player'}</span>
      </td>
      <td>
        <div style="font-weight:700;">
          ${u.role === 'Turf Owner'
            ? `${fmt(Math.round((u.totalRevenue || 0) * OWNER_SHARE))} <span style="font-size:0.72rem;color:#94A3B8;">(70% payout)</span>`
            : `${u.bookings || 0} slots booked`}
        </div>
        <div style="font-size:0.74rem;color:#64748B;">
          ${u.role === 'Turf Owner'
            ? `${u.turfsManaged || 0} Turf(s) &bull; GMV: ${fmt(u.totalRevenue || 0)}`
            : `Total spent: ${fmt(u.spent || 0)}`}
        </div>
      </td>
      <td><span class="status-pill active">${u.status || 'Active'}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:0.76rem;color:#64748B;">${u.joined || '—'}</span>
          <button class="table-action-btn delete" onclick="adminDeleteUser('${u.id}')" title="Remove account">🗑️ Remove</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Filter Initializations
function initFilters() {
  // Turf filters
  const turfSportSelect = document.getElementById("filter-turf-sport");
  const turfSearchInput = document.getElementById("search-turfs-input");

  if (turfSportSelect && turfSearchInput) {
    const updateTurfs = () => renderTurfsList(turfSportSelect.value, turfSearchInput.value);
    turfSportSelect.addEventListener("change", updateTurfs);
    turfSearchInput.addEventListener("input", updateTurfs);
  }

  // Booking filters
  const bookingStatusSelect = document.getElementById("filter-booking-status");
  const bookingSearchInput = document.getElementById("search-bookings-input");

  if (bookingStatusSelect && bookingSearchInput) {
    const updateBookings = () => renderBookingsTable(bookingStatusSelect.value, bookingSearchInput.value);
    bookingStatusSelect.addEventListener("change", updateBookings);
    bookingSearchInput.addEventListener("input", updateBookings);
  }

  // User filters
  const userRoleSelect = document.getElementById("filter-user-role");
  const userSearchInput = document.getElementById("search-users-input");

  if (userRoleSelect && userSearchInput) {
    const updateUsers = () => renderUsersTable(userRoleSelect.value, userSearchInput.value);
    userRoleSelect.addEventListener("change", updateUsers);
    userSearchInput.addEventListener("input", updateUsers);
  }
}

// Actions
window.adminDeleteTurf = function(turfId) {
  if (confirm('Remove this turf from the marketplace?')) {
    if (window.TurfifyStore) window.TurfifyStore.deleteTurf(turfId);
    renderTurfsList();
    renderKPIs();
    showToast('Turf removed from marketplace.');
  }
};

window.adminCancelBooking = function(bookingId) {
  if (confirm(`Cancel booking ${bookingId}?`)) {
    if (window.TurfifyStore) window.TurfifyStore.cancelBooking(bookingId);
    renderBookingsTable();
    renderKPIs();
    showToast(`Booking ${bookingId} cancelled.`);
  }
};

window.adminDeleteUser = async function(userId) {
  if (confirm(`Remove this user account (${userId}) from Turfify?`)) {
    // 1. Add to blacklist in localStorage so synthesis never revives it
    try {
      const deleted = JSON.parse(localStorage.getItem('turfify_deleted_users') || '[]');
      if (!deleted.some(d => d.toLowerCase() === userId.toLowerCase())) {
        deleted.push(userId);
      }
      localStorage.setItem('turfify_deleted_users', JSON.stringify(deleted));
    } catch (e) {}

    // 2. Remove from TurfifyStore & server
    if (window.TurfifyStore) {
      window.TurfifyStore.deleteUser(userId);
    } else {
      fetch(`/api/user?id=${encodeURIComponent(userId)}`, { method: 'DELETE' }).catch(() => {});
    }

    // 3. Delete from Supabase profiles if client is initialized
    if (sbAdmin) {
      try {
        await sbAdmin.from('profiles').delete().eq('id', userId);
      } catch (err) {
        console.warn('Supabase delete profile note:', err);
      }
    }

    // 4. Clean cached profiles & re-render immediately
    cachedSupabaseProfiles = cachedSupabaseProfiles.filter(p => p.id !== userId && p.email !== userId);
    renderUsersTable();
    renderKPIs();
    showToast('Account removed from database.');
  }
};

// Modal handlers for Onboarding Turf and Users
function initModals() {
  // Turf Modal
  const turfModal = document.getElementById('add-turf-modal');
  const closeTurfModal = () => turfModal?.classList.remove('active');
  document.getElementById('btn-close-turf-modal')?.addEventListener('click', closeTurfModal);
  document.getElementById('btn-cancel-turf-modal')?.addEventListener('click', closeTurfModal);

  // Gallery file upload for Admin
  let uploadedAdminPhoto = '';
  const adminFileInput = document.getElementById('form-turf-file');
  if (adminFileInput) {
    adminFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          uploadedAdminPhoto = ev.target.result;
          document.getElementById('upload-preview-admin').src = uploadedAdminPhoto;
          document.getElementById('upload-preview-wrap-admin').style.display = 'flex';
          document.getElementById('upload-prompt-admin').style.display = 'none';
          document.getElementById('upload-filename-admin').textContent = (file.name || 'Photo') + ' ✓';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Amenity chips toggle for Admin
  document.querySelectorAll('#amenities-selector-admin .amenity-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
    });
  });

  document.getElementById('btn-save-turf')?.addEventListener('click', () => {
    const name = document.getElementById('form-turf-name')?.value?.trim();
    const sport = document.getElementById('form-turf-sport')?.value;
    const price = parseInt(document.getElementById('form-turf-price')?.value, 10);
    const location = document.getElementById('form-turf-location')?.value?.trim();
    const ownerName = document.getElementById('form-turf-owner')?.value?.trim() || 'Venue Owner';
    const urlInput = document.getElementById('form-turf-url')?.value?.trim();
    const finalImage = uploadedAdminPhoto || urlInput || 'images/turf-arena.jpg';

    // Collect clicked amenities only
    const selectedAmenities = Array.from(document.querySelectorAll('#amenities-selector-admin .amenity-toggle-btn.selected'))
      .map(btn => btn.dataset.amenity);

    if (!name || !price || !location) {
      alert('Please fill in the turf name, hourly rate, and location.');
      return;
    }

    if (window.TurfifyStore) {
      window.TurfifyStore.addTurf({
        name,
        sport,
        price_per_hour: price,
        location,
        owner_name: ownerName,
        image: finalImage,
        amenities: selectedAmenities
      });
    }

    closeTurfModal();
    renderTurfsList();
    renderKPIs();
    showToast(`Turf "${name}" added to marketplace.`);
    if (document.getElementById('form-turf-name')) document.getElementById('form-turf-name').value = '';
    if (document.getElementById('form-turf-price')) document.getElementById('form-turf-price').value = '';
    if (document.getElementById('form-turf-location')) document.getElementById('form-turf-location').value = '';
    if (document.getElementById('form-turf-owner')) document.getElementById('form-turf-owner').value = '';
    if (document.getElementById('form-turf-url')) document.getElementById('form-turf-url').value = '';
    uploadedAdminPhoto = '';
    if (document.getElementById('upload-preview-wrap-admin')) document.getElementById('upload-preview-wrap-admin').style.display = 'none';
    if (document.getElementById('upload-prompt-admin')) document.getElementById('upload-prompt-admin').style.display = 'block';
    document.querySelectorAll('#amenities-selector-admin .amenity-toggle-btn').forEach(b => b.classList.remove('selected'));
  });

  // User Modal
  const userModal = document.getElementById('add-user-modal');
  const closeUserModal = () => userModal?.classList.remove('active');
  document.getElementById('btn-close-user-modal')?.addEventListener('click', closeUserModal);
  document.getElementById('btn-cancel-user-modal')?.addEventListener('click', closeUserModal);

  document.getElementById('btn-save-user')?.addEventListener('click', () => {
    const name = document.getElementById('form-user-name')?.value?.trim();
    const role = document.getElementById('form-user-role')?.value;
    const phone = document.getElementById('form-user-phone')?.value?.trim();
    const email = document.getElementById('form-user-email')?.value?.trim();
    const business = document.getElementById('form-user-business')?.value?.trim();

    if (!name) {
      alert('Please enter user full name.');
      return;
    }

    const isOwner = role === 'Turf Owner';
    const newUser = {
      id: (isOwner ? 'owner-' : 'player-') + Date.now(),
      name,
      role: isOwner ? 'owner' : 'player',
      phone: phone || '—',
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      business_name: business || '',
      status: 'Active',
      created_at: new Date().toISOString()
    };

    if (window.TurfifyStore) {
      window.TurfifyStore.addUser(newUser);
    }

    closeUserModal();
    renderUsersTable();
    renderKPIs();
    showToast(`Account for ${name} (${role}) registered!`);
    if (document.getElementById('form-user-name')) document.getElementById('form-user-name').value = '';
    if (document.getElementById('form-user-phone')) document.getElementById('form-user-phone').value = '';
    if (document.getElementById('form-user-email')) document.getElementById('form-user-email').value = '';
    if (document.getElementById('form-user-business')) document.getElementById('form-user-business').value = '';
  });
}

// Export Functionality
function initExportButtons() {
  document.getElementById('btn-export-bookings-csv')?.addEventListener('click', () => {
    const bookings = getLiveBookings();
    let csv = 'BookingID,Player,Phone,Turf,Date,Slot,Amount,OwnerShare(70%),AdminShare(30%),Status\n';
    bookings.forEach(b => {
      const ownerAmt = Math.round((b.amount || 0) * OWNER_SHARE);
      const adminAmt = Math.round((b.amount || 0) * ADMIN_SHARE);
      csv += `"${b.id}","${b.player_name || ''}","${b.player_phone || ''}","${b.turf_name || ''}","${b.date || ''}","${b.time_slot || ''}","${b.amount || 0}","${ownerAmt}","${adminAmt}","${b.status || ''}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Turfify_Bookings_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported with 70/30 revenue split data.');
  });
}



function showToast(message, isError = false) {
  const shelf = document.getElementById("toast-shelf") || createToastShelf();
  const toast = document.createElement("div");
  toast.className = "toast-msg";
  if (isError) toast.style.borderLeftColor = "#F43F5E";
  toast.innerHTML = `<span>${isError ? '⚠️' : '✅'}</span> <span>${message}</span>`;
  shelf.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function createToastShelf() {
  const shelf = document.createElement("div");
  shelf.id = "toast-shelf";
  shelf.className = "toast-shelf";
  document.body.appendChild(shelf);
  return shelf;
}
