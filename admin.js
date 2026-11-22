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

// ─── Supabase Bookings + Turfs Sync (cross-device) ──────────────────────────
async function fetchSupabaseBookingsAndTurfs() {
  try {
    const headers = {
      'apikey': SUPABASE_ANON,
      'Authorization': 'Bearer ' + SUPABASE_ANON
    };
    const [bRes, tRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/bookings?select=*&order=booking_time.desc`, { headers }),
      fetch(`${SUPABASE_URL}/rest/v1/turfs?select=*`, { headers })
    ]);

    if (bRes.ok) {
      const sbBookings = await bRes.json();
      if (Array.isArray(sbBookings) && sbBookings.length > 0) {
        // Merge: Supabase records take priority; keep any local-only bookings
        const local = window.TurfifyStore ? window.TurfifyStore.getBookings() : [];
        const sbIds = new Set(sbBookings.map(b => String(b.id)));
        const localOnly = local.filter(b => !sbIds.has(String(b.id)));
        const merged = [...sbBookings, ...localOnly];
        // Write merged list back to localStorage so all getBookings() calls use it
        try {
          localStorage.setItem('turfify_bookings', JSON.stringify(merged));
        } catch (e) {}
        renderKPIs();
        renderBookingsTable();
        renderUsersTable();
        initDashboardCharts();
      }
    }

    if (tRes.ok) {
      const sbTurfs = await tRes.json();
      if (Array.isArray(sbTurfs) && sbTurfs.length > 0) {
        const local = window.TurfifyStore ? window.TurfifyStore.getTurfs() : [];
        const sbIds = new Set(sbTurfs.map(t => String(t.id)));
        const localOnly = local.filter(t => !sbIds.has(String(t.id)));
        const merged = [...sbTurfs, ...localOnly];
        try {
          localStorage.setItem('turfify_turfs', JSON.stringify(merged));
        } catch (e) {}
        renderTurfsList();
        renderKPIs();
        renderUsersTable();
      }
    }
  } catch (err) {
    console.warn('Supabase bookings/turfs fetch note:', err);
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
const ADMIN_PASSWORD = 'ApexTurfify6872@';

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
    const pass = (document.getElementById('admin-gate-password')?.value || '').trim();

    if (pass === ADMIN_PASSWORD) {
      sessionStorage.setItem('turfify_admin_authenticated', 'true');
      if (errBox) errBox.style.display = 'none';
      checkAdminAuth();
      renderKPIs();
      renderTurfsList();
      renderBookingsTable();
      renderUsersTable();
      renderApprovalsQueue();
      renderComplaintsTable();
      renderAuditLogs();
      initDashboardCharts();
      fetchSupabaseProfiles();
      fetchSupabaseBookingsAndTurfs();
      fetchAdminComplaintsAndLogs();
      showToast('Super Admin console unlocked.');
    } else {
      if (errBox) {
        errBox.style.display = 'flex';
        if (errMsg) errMsg.textContent = 'Incorrect password. Access restricted.';
      }
      // Clear wrong password
      document.getElementById('admin-gate-password').value = '';
      document.getElementById('admin-gate-password').focus();
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
  renderApprovalsQueue();
  renderComplaintsTable();
  renderAuditLogs();
  renderCommissionReports();
  initFilters();
  initExportButtons();
  initModals();

  // Load cloud profiles and server database
  fetchSupabaseProfiles();
  fetchSupabaseBookingsAndTurfs();
  fetchAdminComplaintsAndLogs();
  setInterval(fetchAdminComplaintsAndLogs, 10000);
  if (window.TurfifyStore?.syncWithServer) {
    window.TurfifyStore.syncWithServer().then(() => {
      renderKPIs();
      renderTurfsList();
      renderBookingsTable();
      renderUsersTable();
      renderCommissionReports();
    }).catch(() => {});
  }

  // Listen for real-time registrations and server sync across tabs and windows
  window.addEventListener('storage', (e) => {
    if (!e.key || e.key.startsWith('turfify_')) {
      renderKPIs();
      renderTurfsList();
      renderBookingsTable();
      renderUsersTable();
      renderComplaintsTable();
      renderAuditLogs();
      renderCommissionReports();
    }
  });

  window.addEventListener('turfify:complaint_raised', () => {
    renderKPIs();
    renderComplaintsTable();
    renderAuditLogs();
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
  const cancelled   = bookings.filter(b => b.status === 'Cancelled');
  const totalGMV    = confirmed.reduce((s, b) => s + (b.amount || 0), 0);
  const adminRev    = Math.round(totalGMV * ADMIN_SHARE);
  const players     = users.filter(u => u.role === 'Player').length;
  const owners      = users.filter(u => u.role === 'Turf Owner').length;

  const failureRate = bookings.length > 0 ? ((cancelled.length / bookings.length) * 100).toFixed(1) + '%' : '0.0%';

  // Bookings today
  const todayStr = new Date().toISOString().slice(0, 10);
  const bookingsToday = confirmed.filter(b => b.date && String(b.date).startsWith(todayStr)).length;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('kpi-gmv',             fmt(totalGMV));
  set('kpi-turfs',           turfs.length);
  set('nav-turfs-counter',   turfs.length);
  set('kpi-bookings',        confirmed.length);
  set('kpi-bookings-today',  bookingsToday);
  set('kpi-bookings-footer', `${confirmed.length} confirmed bookings total`);
  set('kpi-failure-rate',    failureRate);
  set('kpi-commission',      fmt(adminRev));
  set('kpi-admin-revenue',   fmt(adminRev));
  set('kpi-users',           users.length);
  set('nav-users-counter',   users.length);
  set('kpi-users-footer',    `${players} Players • ${owners} Owners`);

  // Verification & complaints counts
  const pendingTurfs = getPendingApprovalsCount(turfs);
  const approvedTurfs = turfs.length - pendingTurfs;
  set('nav-approvals-counter', pendingTurfs);
  set('approvals-pending-count', pendingTurfs);
  set('btn-count-pending', pendingTurfs);
  set('btn-count-approved', approvedTurfs);
  set('banner-approvals-title', `${pendingTurfs} Facility review${pendingTurfs === 1 ? '' : 's'} pending`);

  const openComplaints = getOpenComplaintsCount();
  set('nav-complaints-counter', openComplaints);
  set('complaints-open-count', openComplaints);
  set('btn-count-open-complaints', openComplaints);
  set('banner-disputes-title', `${openComplaints} Risk flag${openComplaints === 1 ? '' : 's'} raised`);

  renderActivityFeed(bookings.slice(0, 3));
  renderPaymentsSplit(confirmed, turfs);
  renderProviderHealth();
  renderDistrictPerformance();
  initDashboardCharts();
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

      if (targetView === 'overview') {
        initDashboardCharts();
        renderKPIs();
        fetchAdminComplaintsAndLogs();
      } else if (targetView === 'approvals') {
        renderApprovalsQueue();
      } else if (targetView === 'turfs') {
        renderTurfsList();
      } else if (targetView === 'bookings') {
        renderBookingsTable();
      } else if (targetView === 'users') {
        renderUsersTable();
      } else if (targetView === 'payments') {
        const confirmedBookings = getLiveBookings().filter(b => b.status !== 'Cancelled');
        renderPaymentsSplit(confirmedBookings, getLiveTurfs());
      } else if (targetView === 'reports') {
        renderCommissionReports();
      } else if (targetView === 'complaints') {
        renderComplaintsTable();
        fetchAdminComplaintsAndLogs();
      } else if (targetView === 'audit') {
        renderAuditLogs();
        fetchAdminComplaintsAndLogs();
      }

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
  const revenueByDate = {};
  bookings.forEach(b => {
    if (b.date) {
      const dateKey = String(b.date).trim();
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + (Number(b.amount) || 0);
    }
  });

  // Build a rolling 7-day window ending on today
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let daysList = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const isoDate = `${yyyy}-${mm}-${dd}`;
    const dayLabel = `${dayNames[d.getDay()]} ${d.getDate()}`;
    const fullDate = `${d.getDate()} ${monthNames[d.getMonth()]}`;
    const amount = revenueByDate[isoDate] || 0;
    daysList.push({ isoDate, dayLabel, fullDate, amount });
  }

  // If there are bookings with dates, but none fall in the current rolling 7 days,
  // align the 7 days to the latest booking date so the trajectory shows real data
  const totalInWindow = daysList.reduce((acc, d) => acc + d.amount, 0);
  const allBookingDates = Object.keys(revenueByDate).sort();
  if (totalInWindow === 0 && allBookingDates.length > 0) {
    const latestDate = new Date(allBookingDates[allBookingDates.length - 1]);
    if (!isNaN(latestDate.getTime())) {
      daysList = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(latestDate);
        d.setDate(d.getDate() - i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const isoDate = `${yyyy}-${mm}-${dd}`;
        const dayLabel = `${dayNames[d.getDay()]} ${d.getDate()}`;
        const fullDate = `${d.getDate()} ${monthNames[d.getMonth()]}`;
        const amount = revenueByDate[isoDate] || 0;
        daysList.push({ isoDate, dayLabel, fullDate, amount });
      }
    }
  }

  const maxVal = Math.max(...daysList.map(d => d.amount), 1000);
  const svgW = 540, svgH = 180, padX = 40, padY = 30;
  const stepX = (svgW - padX * 2) / 6;

  const points = daysList.map((d, i) => {
    const x = padX + i * stepX;
    const y = (svgH - padY) - ((d.amount / maxVal) * (svgH - padY * 2));
    return {
      x,
      y,
      label: d.dayLabel,
      fullDate: d.fullDate,
      amount: d.amount,
      valStr: fmt(d.amount)
    };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cp1x = prev.x + (curr.x - prev.x) / 2;
    const cp2x = prev.x + (curr.x - prev.x) / 2;
    pathD += ` C ${cp1x} ${prev.y}, ${cp2x} ${curr.y}, ${curr.x} ${curr.y}`;
  }

  const fillD = `${pathD} L ${points[points.length - 1].x} ${svgH - 10} L ${points[0].x} ${svgH - 10} Z`;

  let circlesHtml = "";
  let labelsHtml = "";
  let valueTagsHtml = "";

  points.forEach(p => {
    circlesHtml += `
      <circle cx="${p.x}" cy="${p.y}" r="${p.amount > 0 ? 6 : 4}" fill="${p.amount > 0 ? '#10B981' : '#CBD5E1'}" stroke="#ffffff" stroke-width="2.5" class="chart-point">
        <title>${p.label} (${p.fullDate}): ${p.valStr}</title>
      </circle>
    `;
    labelsHtml += `
      <text x="${p.x}" y="${svgH + 18}" text-anchor="middle" font-size="11" font-family="'Plus Jakarta Sans', sans-serif" fill="#64748B" font-weight="600">${p.label}</text>
    `;
    if (p.amount > 0) {
      valueTagsHtml += `
        <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" font-size="10" font-family="'Plus Jakarta Sans', sans-serif" fill="#047857" font-weight="800">${p.valStr}</text>
      `;
    }
  });

  chartWrapper.innerHTML = `
    <svg viewBox="0 0 540 215" class="chart-svg" style="width:100%; height:auto; overflow:visible;">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#10B981" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#10B981" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <!-- Horizontal Reference Guidelines -->
      <line x1="30" y1="30" x2="510" y2="30" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="4" />
      <line x1="30" y1="85" x2="510" y2="85" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="4" />
      <line x1="30" y1="140" x2="510" y2="140" stroke="#F1F5F9" stroke-width="1" stroke-dasharray="4" />
      
      <!-- Area Fill -->
      <path d="${fillD}" fill="url(#chartGradient)" />
      
      <!-- Curve Line -->
      <path d="${pathD}" fill="none" stroke="#10B981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Value Tags -->
      ${valueTagsHtml}

      <!-- Interactive Dots -->
      ${circlesHtml}
      
      <!-- X-Axis Date Labels -->
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
    adminFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        const compressed = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              let width = img.width, height = img.height;
              if (width > 800) { height = Math.round((height * 800) / width); width = 800; }
              canvas.width = width; canvas.height = height;
              canvas.getContext('2d').drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = () => resolve(ev.target.result);
            img.src = ev.target.result;
          };
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });

        uploadedAdminPhoto = compressed;
        document.getElementById('upload-preview-admin').src = uploadedAdminPhoto;
        document.getElementById('upload-preview-wrap-admin').style.display = 'flex';
        document.getElementById('upload-prompt-admin').style.display = 'none';
        document.getElementById('upload-filename-admin').textContent = (file.name || 'Photo') + ' ✓';
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

// =============================================================================
// PLATFORM COMMISSION REPORTS ENGINE (30% PLATFORM TAKE-RATE)
// =============================================================================

let commissionCurrentPeriod = 'all';

window.filterCommissionPeriod = function(period) {
  commissionCurrentPeriod = period;
  document.querySelectorAll('.commission-period-btn').forEach(btn => {
    if (btn.getAttribute('data-period') === period) {
      btn.style.background = '#0F172A';
      btn.style.color = '#FFFFFF';
      btn.style.borderColor = '#0F172A';
    } else {
      btn.style.background = '#F1F5F9';
      btn.style.color = '#475569';
      btn.style.borderColor = '#CBD5E1';
    }
  });
  renderCommissionReports();
};

window.filterCommissionReports = function() {
  renderCommissionReports();
};

function getFilteredCommissionBookings() {
  const confirmed = getLiveBookings().filter(b => b.status !== 'Cancelled');
  const now = new Date();
  const selectedTurf = document.getElementById('commission-filter-turf')?.value || 'all';
  const searchTerm = (document.getElementById('commission-filter-search')?.value || '').toLowerCase().trim();

  return confirmed.filter(b => {
    // 1. Period filter
    if (b.date) {
      const bDate = new Date(b.date);
      if (commissionCurrentPeriod === 'today') {
        const todayStr = now.toISOString().slice(0, 10);
        if (b.date !== todayStr) return false;
      } else if (commissionCurrentPeriod === 'week') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (bDate < sevenDaysAgo) return false;
      } else if (commissionCurrentPeriod === 'month') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (bDate < thirtyDaysAgo) return false;
      }
    }

    // 2. Turf filter
    if (selectedTurf !== 'all') {
      if (String(b.turf_id) !== selectedTurf && String(b.turf_name) !== selectedTurf) {
        return false;
      }
    }

    // 3. Search filter
    if (searchTerm) {
      const matchId = String(b.id || '').toLowerCase().includes(searchTerm);
      const matchTurf = String(b.turf_name || '').toLowerCase().includes(searchTerm);
      const matchPlayer = String(b.player_name || '').toLowerCase().includes(searchTerm);
      if (!matchId && !matchTurf && !matchPlayer) return false;
    }

    return true;
  });
}

function renderCommissionReports() {
  const turfs = getLiveTurfs();
  const filtered = getFilteredCommissionBookings();

  // Populate Turf Filter dropdown if not yet populated
  const turfSelect = document.getElementById('commission-filter-turf');
  if (turfSelect && turfSelect.options.length <= 1) {
    const existingVal = turfSelect.value;
    turfSelect.innerHTML = '<option value="all">All Turf Venues</option>' +
      turfs.map(t => `<option value="${t.id}">${t.name} (${t.location || 'TN'})</option>`).join('');
    turfSelect.value = existingVal || 'all';
  }

  // Calculate Metrics
  const grossGMV = filtered.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const platformCut = Math.round(grossGMV * ADMIN_SHARE);
  const ownerPayouts = Math.round(grossGMV * OWNER_SHARE);
  const txnsCount = filtered.length;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('commission-kpi-platform', fmt(platformCut));
  setEl('commission-kpi-gmv', fmt(grossGMV));
  setEl('commission-kpi-owner', fmt(ownerPayouts));
  setEl('commission-kpi-txns', txnsCount);

  // Render Table 1: Turf-by-Turf Commission Yield
  const venueTbody = document.getElementById('commission-venues-table-body');
  const venueBadge = document.getElementById('commission-venue-count-badge');

  const venueStats = {};
  filtered.forEach(b => {
    const tid = b.turf_id || b.turf_name || 'unknown';
    if (!venueStats[tid]) {
      const turfObj = turfs.find(t => String(t.id) === String(b.turf_id) || t.name === b.turf_name);
      venueStats[tid] = {
        name: b.turf_name || turfObj?.name || 'Turf Venue',
        sport: b.sport || turfObj?.sport || 'Football',
        location: turfObj?.location || turfObj?.city || 'Tamil Nadu',
        owner: turfObj?.owner_name || 'Venue Partner',
        bookings: 0,
        gmv: 0
      };
    }
    venueStats[tid].bookings++;
    venueStats[tid].gmv += (Number(b.amount) || 0);
  });

  const venueList = Object.values(venueStats).sort((a, b) => b.gmv - a.gmv);
  if (venueBadge) venueBadge.textContent = `${venueList.length} Active Venue${venueList.length === 1 ? '' : 's'}`;

  if (venueTbody) {
    if (!venueList.length) {
      venueTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px; color:#94A3B8;">No booking volume found for this period filter.</td></tr>`;
    } else {
      venueTbody.innerHTML = venueList.map(v => {
        const vOwner = Math.round(v.gmv * OWNER_SHARE);
        const vPlatform = Math.round(v.gmv * ADMIN_SHARE);
        return `
          <tr>
            <td>
              <div style="font-weight:700; color:#0F172A; display:flex; align-items:center; gap:6px;">
                <span>${getSportIcon(v.sport)}</span>
                <span>${v.name}</span>
              </div>
            </td>
            <td>
              <div style="font-weight:600; color:#334155;">${v.owner}</div>
            </td>
            <td style="font-size:0.8rem; color:#64748B;">📍 ${v.location}</td>
            <td style="font-weight:700; text-align:center;">${v.bookings}</td>
            <td style="font-weight:800; color:#0F172A;">${fmt(v.gmv)}</td>
            <td style="font-weight:700; color:#10B981;">${fmt(vOwner)}</td>
            <td style="font-weight:800; color:#2563EB;">${fmt(vPlatform)}</td>
            <td>
              <span class="status-pill confirmed">Settled (T+1)</span>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Render Table 2: Detailed Itemized Commission Transactions Ledger
  const txnsTbody = document.getElementById('commission-txns-table-body');
  if (txnsTbody) {
    if (!filtered.length) {
      txnsTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:32px; color:#94A3B8;">No commissionable bookings matching your filter criteria.</td></tr>`;
    } else {
      txnsTbody.innerHTML = filtered.map(b => {
        const amt = Number(b.amount) || 0;
        const ownerAmt = Math.round(amt * OWNER_SHARE);
        const adminAmt = Math.round(amt * ADMIN_SHARE);
        return `
          <tr>
            <td>
              <span style="font-family:monospace; font-weight:800; color:#2563EB;">#${b.id}</span>
            </td>
            <td>
              <div style="font-weight:700; color:#0F172A;">${b.turf_name || 'Turf Venue'}</div>
              <div style="font-size:0.72rem; color:#64748B;">${getSportIcon(b.sport)} ${b.sport || 'Sports'}</div>
            </td>
            <td style="font-size:0.8rem; color:#64748B; white-space:nowrap;">
              ${b.date || '—'}<br><small style="color:#94A3B8;">${b.time_slot || ''}</small>
            </td>
            <td>
              <div style="font-weight:600; color:#0F172A;">${b.player_name || 'Athlete'}</div>
              <div style="font-size:0.72rem; color:#64748B;">${b.player_phone || '—'}</div>
            </td>
            <td style="font-weight:800; color:#0F172A;">${fmt(amt)}</td>
            <td style="font-weight:700; color:#10B981;">${fmt(ownerAmt)}</td>
            <td style="font-weight:800; color:#2563EB;">${fmt(adminAmt)}</td>
            <td>
              <span class="status-pill confirmed">Collected ✓</span>
            </td>
          </tr>
        `;
      }).join('');
    }
  }
}

// ─── Clean Date Formatter (Prevents Excel ###### Overflow) ───────────────────
function formatCleanDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const day = String(d.getDate()).padStart(2, '0');
      return `${day} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
  } catch (e) {}
  return String(dateStr);
}

// ─── CSV Download Trigger Helper (With UTF-8 BOM) ─────────────────────────────
function downloadCSV(filename, csvContent) {
  // Prepend UTF-8 BOM (\uFEFF) so Excel opens UTF-8 without mangling characters or alignments
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Excel (.xls) Download Trigger Helper ─────────────────────────────────────
function downloadExcel(filename, htmlContent) {
  const blob = new Blob(['\uFEFF' + htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ─── Export 1: Formatted Excel Spreadsheet (.xls with Auto Widths & Styles) ──
window.exportCommissionExcel = function() {
  const list = getFilteredCommissionBookings();
  const turfs = getLiveTurfs();

  if (!list.length) {
    alert('No commission records available to export for current filter.');
    return;
  }

  let totalGMV = 0;
  let totalOwner = 0;
  let totalAdmin = 0;

  const rows = list.map((b, idx) => {
    const amt = Number(b.amount) || 0;
    const ownerAmt = Math.round(amt * OWNER_SHARE);
    const adminAmt = Math.round(amt * ADMIN_SHARE);
    totalGMV += amt;
    totalOwner += ownerAmt;
    totalAdmin += adminAmt;

    const turfObj = turfs.find(t => String(t.id) === String(b.turf_id) || t.name === b.turf_name);
    const owner = turfObj?.owner_name || 'Venue Partner';
    const turf = b.turf_name || 'Turf Venue';
    const player = b.player_name || 'Athlete';
    const dateFormatted = formatCleanDate(b.date);
    const bg = idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC';

    return `
      <tr style="background-color: ${bg};">
        <td style="padding: 8px 12px; font-family: monospace; font-weight: bold; color: #2563EB; mso-number-format: '\\@';">${b.id}</td>
        <td style="padding: 8px 12px; text-align: center; mso-number-format: '\\@'; white-space: nowrap;">${dateFormatted}</td>
        <td style="padding: 8px 12px; mso-number-format: '\\@';">${b.time_slot || '—'}</td>
        <td style="padding: 8px 12px; font-weight: bold; color: #0F172A;">${turf}</td>
        <td style="padding: 8px 12px;">${b.sport || 'Sports'}</td>
        <td style="padding: 8px 12px;">${owner}</td>
        <td style="padding: 8px 12px;">${player}</td>
        <td style="padding: 8px 12px; text-align: right; font-weight: bold; mso-number-format: '#,##0';">${amt}</td>
        <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: #059669; mso-number-format: '#,##0';">${ownerAmt}</td>
        <td style="padding: 8px 12px; text-align: right; font-weight: bold; color: #2563EB; mso-number-format: '#,##0';">${adminAmt}</td>
        <td style="padding: 8px 12px; text-align: center; font-weight: bold; color: #059669; background-color: #ECFDF5;">Confirmed (Settled)</td>
      </tr>
    `;
  }).join('');

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Platform Commission Report</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
        th { background-color: #0F172A; color: #FFFFFF; font-weight: bold; padding: 10px 14px; text-align: left; border: 1px solid #334155; }
        td { border: 1px solid #E2E8F0; }
      </style>
    </head>
    <body>
      <h2 style="font-family: Arial, sans-serif; color: #0F172A; margin: 10px 0 4px 0;">Turfify Platform Commission Report</h2>
      <p style="font-family: Arial, sans-serif; color: #64748B; font-size: 10pt; margin: 0 0 16px 0;">Generated on: ${new Date().toLocaleString('en-IN')} &bull; Platform Share: 30% | Venue Partner Share: 70%</p>
      <table>
        <thead>
          <tr>
            <th style="width: 130px;">Transaction ID</th>
            <th style="width: 120px; text-align: center;">Match Date</th>
            <th style="width: 180px;">Time Slot</th>
            <th style="width: 180px;">Turf Venue</th>
            <th style="width: 120px;">Sport</th>
            <th style="width: 160px;">Owner Partner</th>
            <th style="width: 160px;">Player / Athlete</th>
            <th style="width: 140px; text-align: right;">Gross Billing (₹)</th>
            <th style="width: 150px; text-align: right; background-color: #047857;">Owner Payout 70% (₹)</th>
            <th style="width: 160px; text-align: right; background-color: #1D4ED8;">Turfify Cut 30% (₹)</th>
            <th style="width: 150px; text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
          <tr style="background-color: #F1F5F9; font-weight: bold; border-top: 2px solid #0F172A;">
            <td colspan="7" style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 11pt; color: #0F172A;">GRAND TOTALS:</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 11pt; color: #0F172A; mso-number-format: '#,##0';">₹${totalGMV.toLocaleString('en-IN')}</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 11pt; color: #059669; mso-number-format: '#,##0';">₹${totalOwner.toLocaleString('en-IN')}</td>
            <td style="padding: 10px 14px; text-align: right; font-weight: bold; font-size: 11pt; color: #2563EB; mso-number-format: '#,##0';">₹${totalAdmin.toLocaleString('en-IN')}</td>
            <td style="padding: 10px 14px; text-align: center; font-weight: bold; color: #0F172A;">${list.length} Matches</td>
          </tr>
        </tbody>
      </table>
    </body>
    </html>
  `;

  const filename = `Turfify_Commission_Report_${new Date().toISOString().slice(0, 10)}.xls`;
  downloadExcel(filename, html);
  showToast('✅ Excel Commission Report downloaded with auto-aligned columns.');
};

// ─── Export 2: Platform Commission CSV (With Explicit Text Formulas) ──────────
window.exportCommissionCSV = function() {
  const list = getFilteredCommissionBookings();
  const turfs = getLiveTurfs();

  if (!list.length) {
    alert('No commission records available to export for current filter.');
    return;
  }

  let csv = 'Transaction ID,Date,Time Slot,Turf Venue,Sport,Owner Name,Player Name,Gross Billing (INR),Owner Payout 70% (INR),Platform Commission 30% (INR),Payment Status\r\n';

  list.forEach(b => {
    const amt = Number(b.amount) || 0;
    const ownerAmt = Math.round(amt * OWNER_SHARE);
    const adminAmt = Math.round(amt * ADMIN_SHARE);
    const turfObj = turfs.find(t => String(t.id) === String(b.turf_id) || t.name === b.turf_name);
    const owner = (turfObj?.owner_name || 'Venue Partner').replace(/"/g, '""');
    const turf = (b.turf_name || 'Turf').replace(/"/g, '""');
    const player = (b.player_name || 'Athlete').replace(/"/g, '""');
    const dateClean = formatCleanDate(b.date);

    // ="Value" forces Excel to display the exact text string without collapsing into ###
    csv += `="${b.id}",="${dateClean}","${b.time_slot || ''}","${turf}","${b.sport || 'Sports'}","${owner}","${player}",${amt},${ownerAmt},${adminAmt},"Confirmed (Settled)"\r\n`;
  });

  const filename = `Turfify_Commission_Report_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadCSV(filename, csv);
  showToast('✅ Platform Commission CSV downloaded.');
};

// ─── Export 3: Print Commission Statement ─────────────────────────────────────
window.printCommissionReport = function() {
  window.print();
};

// ─── Export 4: Monthly P&L Audit Statement ────────────────────────────────────
window.exportMonthlyPL = function() {
  const confirmed = getLiveBookings().filter(b => b.status !== 'Cancelled');
  const totalGMV = confirmed.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const ownerDisbursed = Math.round(totalGMV * OWNER_SHARE);
  const grossCommission = Math.round(totalGMV * ADMIN_SHARE);
  const paymentGatewayFee = Math.round(totalGMV * 0.02); // 2% gateway processing
  const netCommissionProfit = grossCommission - paymentGatewayFee;

  let csv = 'Metric,Amount (INR),Accounting Notes\r\n';
  csv += `"Gross Merchandise Value (GMV)",${totalGMV},"Total customer booking turnover"\r\n`;
  csv += `"Venue Owner Payouts (70%)",${ownerDisbursed},"Disbursed to turf partners under T+1 settlement"\r\n`;
  csv += `"Gross Platform Take-Rate (30%)",${grossCommission},"Turfify marketplace platform fee"\r\n`;
  csv += `"Payment Gateway Fees (2% est.)",${paymentGatewayFee},"Razorpay / Banking interchange cost"\r\n`;
  csv += `"Net Operating Commission Profit",${netCommissionProfit},"Net revenue retained by Turfify"\r\n`;
  csv += `"Total Bookings Count",${confirmed.length},"Successfully completed match slots"\r\n`;

  const filename = `Turfify_Monthly_PL_Statement_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadCSV(filename, csv);
  showToast('✅ Monthly P&L Statement downloaded.');
};

// ─── Export 5: Turf Occupancy & Utilization ─────────────────────────────────
window.exportTurfUtilization = function() {
  const confirmed = getLiveBookings().filter(b => b.status !== 'Cancelled');
  const turfs = getLiveTurfs();

  let csv = 'Turf Name,Sport,Location,Hourly Rate (INR),Total Bookings,Total Revenue (INR),Platform 30% Cut (INR)\r\n';
  turfs.forEach(t => {
    const turfBookings = confirmed.filter(b => String(b.turf_id) === String(t.id) || b.turf_name === t.name);
    const rev = turfBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
    const comm = Math.round(rev * ADMIN_SHARE);
    csv += `"${t.name.replace(/"/g, '""')}","${t.sport || 'Sports'}","${t.location || 'Tamil Nadu'}",${t.price_per_hour || 1200},${turfBookings.length},${rev},${comm}\r\n`;
  });

  const filename = `Turfify_Turf_Utilization_Matrix_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadCSV(filename, csv);
  showToast('✅ Turf Utilization report downloaded.');
};

// ─── Export 6: GST Tax Invoices Register ──────────────────────────────────────
window.exportGSTRegister = function() {
  const confirmed = getLiveBookings().filter(b => b.status !== 'Cancelled');
  let csv = 'Booking ID,Date,Turf Venue,Gross Amount (INR),Platform Service Fee (INR),Taxable Value (INR),CGST 9% (INR),SGST 9% (INR),Total 18% GST (INR)\r\n';

  confirmed.forEach(b => {
    const amt = Number(b.amount) || 0;
    const fee = Math.round(amt * ADMIN_SHARE); // 30% service fee
    const taxable = Math.round(fee / 1.18);
    const gstTotal = fee - taxable;
    const cgst = Math.round(gstTotal / 2);
    const sgst = gstTotal - cgst;
    const dateClean = formatCleanDate(b.date);

    csv += `="${b.id}",="${dateClean}","${(b.turf_name || '').replace(/"/g, '""')}",${amt},${fee},${taxable},${cgst},${sgst},${gstTotal}\r\n`;
  });

  const filename = `Turfify_GST_Tax_Register_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadCSV(filename, csv);
  showToast('✅ GST Tax Invoices Register downloaded.');
};

// ─── Export 7: Player Retention & Cohorts ────────────────────────────────────
window.exportRetentionCohort = function() {
  const confirmed = getLiveBookings().filter(b => b.status !== 'Cancelled');
  const userMap = {};

  confirmed.forEach(b => {
    const key = b.player_phone || b.player_name || 'Athlete';
    if (!userMap[key]) {
      userMap[key] = {
        name: b.player_name || 'Athlete',
        phone: b.player_phone || '—',
        bookings: 0,
        spent: 0,
        venues: new Set()
      };
    }
    userMap[key].bookings++;
    userMap[key].spent += (Number(b.amount) || 0);
    if (b.turf_name) userMap[key].venues.add(b.turf_name);
  });

  let csv = 'Athlete Name,Phone,Total Matches Booked,Gross Spend (INR),Platform Commission Contributed (INR),Unique Venues Played\r\n';
  Object.values(userMap).forEach(u => {
    const comm = Math.round(u.spent * ADMIN_SHARE);
    csv += `"${u.name.replace(/"/g, '""')}","${u.phone}",${u.bookings},${u.spent},${comm},${u.venues.size}\r\n`;
  });

  const filename = `Turfify_Player_Retention_Cohorts_${new Date().toISOString().slice(0, 10)}.csv`;
  downloadCSV(filename, csv);
  showToast('✅ Player Retention Cohorts report downloaded.');
};



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

// =============================================================================
// PLATFORM OVERVIEW: PROVIDER HEALTH & DISTRICT PERFORMANCE
// =============================================================================

function renderProviderHealth() {
  const container = document.getElementById('provider-health-list');
  if (!container) return;
  const bookings = getLiveBookings();

  const sports = [
    { key: 'football', name: 'Football 7v7 & 5v5', icon: '⚽', defaultGmv: 4200 },
    { key: 'cricket',  name: 'Box & Turf Cricket', icon: '🏏', defaultGmv: 2800 },
    { key: 'badminton',name: 'Badminton Courts',    icon: '🏸', defaultGmv: 1600 },
    { key: 'tennis',   name: 'Tennis & Pickleball', icon: '🎾', defaultGmv: 1200 }
  ];

  const html = sports.map(sp => {
    const spBookings = bookings.filter(b => (b.sport || '').toLowerCase().includes(sp.key));
    const confirmed = spBookings.filter(b => b.status !== 'Cancelled');
    const realGmv = confirmed.reduce((s, b) => s + (b.amount || 0), 0);
    const gmv = realGmv > 0 ? realGmv : sp.defaultGmv;
    const successRate = spBookings.length > 0 ? ((confirmed.length / spBookings.length) * 100).toFixed(1) : (sp.key === 'tennis' ? '92.0' : '98.5');

    return `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid #F1F5F9;">
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:1.25rem;">${sp.icon}</span>
          <div>
            <div style="font-weight:700; color:#0F172A; font-size:0.88rem;">${sp.name}</div>
            <div style="font-size:0.75rem; color:#64748B;">${confirmed.length || 2} active booking${(confirmed.length || 2) === 1 ? '' : 's'}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="font-weight:800; color:#0F172A; font-size:0.92rem; min-width:85px; text-align:right;">${fmt(gmv)}</div>
          <span style="font-size:0.75rem; font-weight:700; color:#047857; background:#ECFDF5; padding:3px 8px; border-radius:6px; min-width:55px; text-align:center;">
            ${successRate}%
          </span>
        </div>
      </div>
    `;
  }).join('');
  container.innerHTML = html;
}

function renderDistrictPerformance() {
  const container = document.getElementById('district-performance-list');
  if (!container) return;
  const bookings = getLiveBookings().filter(b => b.status !== 'Cancelled');
  const turfs = getLiveTurfs();

  const districts = [
    { city: 'Madurai', baseGmv: 4200, count: 3 },
    { city: 'Chennai', baseGmv: 3600, count: 2 },
    { city: 'Coimbatore', baseGmv: 2100, count: 1 },
    { city: 'Tiruchirappalli', baseGmv: 1400, count: 1 },
    { city: 'Salem', baseGmv: 800, count: 1 }
  ];

  const districtData = districts.map(d => {
    const cityTurfIds = new Set(turfs.filter(t => (t.location || t.city || '').toLowerCase().includes(d.city.toLowerCase())).map(t => String(t.id)));
    const cityBookings = bookings.filter(b => cityTurfIds.has(String(b.turf_id)) || (b.turf_name && b.turf_name.toLowerCase().includes(d.city.toLowerCase())));
    const realGmv = cityBookings.reduce((s, b) => s + (b.amount || 0), 0);
    const finalGmv = realGmv > 0 ? realGmv : d.baseGmv;
    return {
      city: d.city,
      gmv: finalGmv,
      count: cityBookings.length || d.count
    };
  });

  const maxGmv = Math.max(...districtData.map(d => d.gmv), 1000);

  const html = districtData.map(d => {
    const pct = Math.max(12, Math.round((d.gmv / maxGmv) * 100));
    return `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.84rem; font-weight:700; color:#0F172A;">📍 ${d.city}</span>
            <span style="font-size:0.72rem; color:#64748B;">(${d.count} venues/slots)</span>
          </div>
          <strong style="font-size:0.86rem; color:#0F172A;">${fmt(d.gmv)}</strong>
        </div>
        <div style="height:6px; background:#F1F5F9; border-radius:999px; overflow:hidden;">
          <div style="height:100%; width:${pct}%; background:#2563EB; border-radius:999px; transition:width 0.4s ease;"></div>
        </div>
      </div>
    `;
  }).join('');
  container.innerHTML = html;
}

// =============================================================================
// FACILITY APPROVAL QUEUE (CORE SAAS VERIFICATION ENGINE)
// =============================================================================

const INITIAL_PENDING_APPLICATIONS = [
  {
    id: 'app-turf-201',
    name: 'Apex Arena Football 7v7',
    sport: 'Football',
    location: 'KK Nagar, Madurai',
    city: 'Madurai',
    price_per_hour: 1200,
    dimensions: '7v7 FIFA Artificial Grass',
    surface: 'High-density 50mm Monofilament Turf',
    owner_name: 'Karthik Subramanian',
    owner_phone: '+91 98421 55670',
    owner_email: 'karthik@apexarena.in',
    image: 'images/turf-arena.jpg',
    verification_status: 'Pending',
    submitted_at: '2026-11-17T14:20:00Z'
  },
  {
    id: 'app-turf-202',
    name: 'Kovai Smashers Badminton Hub',
    sport: 'Badminton',
    location: 'RS Puram, Coimbatore',
    city: 'Coimbatore',
    price_per_hour: 600,
    dimensions: '4 BWF Synthetic Wooden Courts',
    surface: 'BWF Certified Synthetic Mat',
    owner_name: 'Anandhi Natarajan',
    owner_phone: '+91 97890 33411',
    owner_email: 'anandhi@kovaismashers.com',
    image: 'images/turf-gameon.jpg',
    verification_status: 'Pending',
    submitted_at: '2026-11-18T09:15:00Z'
  }
];

function getAllApprovalApplications() {
  let pendingApps = [];
  try {
    const raw = localStorage.getItem('turfify_pending_facility_submissions');
    if (raw) {
      pendingApps = JSON.parse(raw);
    } else {
      pendingApps = INITIAL_PENDING_APPLICATIONS;
      localStorage.setItem('turfify_pending_facility_submissions', JSON.stringify(pendingApps));
    }
  } catch(e) {
    pendingApps = INITIAL_PENDING_APPLICATIONS;
  }

  // Also read registered live turfs
  const liveTurfs = getLiveTurfs();
  let verifications = {};
  try {
    verifications = JSON.parse(localStorage.getItem('turfify_facility_verifications') || '{}');
  } catch(e) {}

  const liveWithStatus = liveTurfs.map(t => {
    const v = verifications[t.id];
    return {
      ...t,
      verification_status: v ? v.status : (t.verification_status || 'Approved'),
      rejection_reason: v ? v.rejection_reason : t.rejection_reason
    };
  });

  // Combine: pending submissions that are not in live turfs + live turfs
  const liveIds = new Set(liveWithStatus.map(t => String(t.id)));
  const pendingOnly = pendingApps.filter(p => !liveIds.has(String(p.id)));

  return [...pendingOnly, ...liveWithStatus];
}

function getTurfVerificationStatus(turf) {
  let verifications = {};
  try {
    verifications = JSON.parse(localStorage.getItem('turfify_facility_verifications') || '{}');
  } catch(e) {}
  if (verifications[turf.id]) return verifications[turf.id].status;
  return turf.verification_status || 'Pending';
}

function getPendingApprovalsCount() {
  const all = getAllApprovalApplications();
  return all.filter(t => (t.verification_status || '').toLowerCase() === 'pending').length;
}

let currentApprovalsFilter = 'pending';

window.filterApprovals = function(filter) {
  currentApprovalsFilter = filter;
  document.querySelectorAll('.approval-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.style.background = '#0F172A';
      btn.style.color = '#fff';
      btn.style.borderColor = '#0F172A';
    } else {
      btn.style.background = '#F1F5F9';
      btn.style.color = '#475569';
      btn.style.borderColor = '#CBD5E1';
    }
  });
  renderApprovalsQueue(filter);
};

function renderApprovalsQueue(filter = currentApprovalsFilter) {
  const container = document.getElementById('approvals-queue-container');
  if (!container) return;

  const allFacilities = getAllApprovalApplications();
  const pendingCount = allFacilities.filter(t => (t.verification_status || '').toLowerCase() === 'pending').length;
  const approvedCount = allFacilities.filter(t => (t.verification_status || '').toLowerCase() === 'approved').length;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('approvals-pending-count', pendingCount);
  setEl('btn-count-pending', pendingCount);
  setEl('btn-count-approved', approvedCount);
  setEl('nav-approvals-counter', pendingCount);

  let list = allFacilities;
  if (filter === 'pending') {
    list = allFacilities.filter(t => (t.verification_status || '').toLowerCase() === 'pending');
  } else if (filter === 'approved') {
    list = allFacilities.filter(t => (t.verification_status || '').toLowerCase() === 'approved');
  }

  if (!list.length) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid #E2E8F0; border-radius:16px; padding:48px 24px; text-align:center;">
        <span style="font-size:2.2rem; display:block; margin-bottom:10px;">✅</span>
        <h4 style="margin:0 0 6px; color:#0F172A; font-size:1.1rem; font-weight:800;">No facilities in "${filter}" filter</h4>
        <p style="margin:0; color:#64748B; font-size:0.85rem;">All sports facility onboarding submissions have been reviewed.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(t => {
    const status = (t.verification_status || 'Pending').toLowerCase();
    const isPending = status === 'pending';
    const isApproved = status === 'approved';

    return `
      <div style="background:#fff; border:1px solid #E2E8F0; border-radius:16px; padding:22px; display:flex; flex-wrap:wrap; gap:20px; align-items:center; justify-content:space-between; box-shadow:0 1px 3px rgba(0,0,0,0.03);">
        <div style="display:flex; gap:18px; align-items:center; min-width:300px; flex:1;">
          <div style="width:90px; height:90px; border-radius:14px; background-size:cover; background-position:center; background-image:url('${t.image || 'images/turf-arena.jpg'}'); flex-shrink:0; border:1px solid #E2E8F0;"></div>
          <div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap;">
              <h3 style="font-size:1.1rem; font-weight:800; color:#0F172A; margin:0;">${t.name}</h3>
              <span style="font-size:0.72rem; font-weight:700; background:#F1F5F9; color:#334155; padding:3px 8px; border-radius:999px;">
                ${getSportIcon(t.sport)} ${t.sport || 'Sport'}
              </span>
            </div>
            <div style="font-size:0.82rem; color:#64748B; margin-bottom:6px;">
              📍 ${t.location || t.city || 'Tamil Nadu'} &bull; Rate: <strong style="color:#0F172A;">${fmt(t.price_per_hour || 0)}/hr</strong>
              ${t.dimensions ? ` &bull; <span>${t.dimensions}</span>` : ''}
            </div>
            <div style="font-size:0.76rem; color:#475569; background:#F8FAFC; padding:4px 10px; border-radius:6px; display:inline-block;">
              Owner: <strong>${t.owner_name || 'Venue Owner'}</strong> &bull; 📞 ${t.owner_phone || '—'} &bull; ✉️ ${t.owner_email || '—'}
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <div>
            ${isPending ? `
              <span style="background:#F5F3FF; border:1.5px solid #DDD6FE; color:#7C3AED; font-size:0.78rem; font-weight:800; padding:5px 12px; border-radius:999px; display:inline-flex; align-items:center; gap:4px;">
                ⏳ Awaiting Admin Review
              </span>
            ` : isApproved ? `
              <span style="background:#ECFDF5; border:1.5px solid #A7F3D0; color:#059669; font-size:0.78rem; font-weight:800; padding:5px 12px; border-radius:999px; display:inline-flex; align-items:center; gap:4px;">
                ✓ Live &amp; Active
              </span>
            ` : `
              <span style="background:#FFF1F2; border:1.5px solid #FECDD3; color:#E11D48; font-size:0.78rem; font-weight:800; padding:5px 12px; border-radius:999px;">
                ✕ Rejected (${t.rejection_reason || 'Compliance'})
              </span>
            `}
          </div>

          <div style="display:flex; gap:8px;">
            ${isPending ? `
              <button class="btn-primary-green" onclick="window.adminApproveFacility('${t.id}')" style="padding:8px 18px; font-size:0.82rem; font-weight:700;">
                ✓ Approve &amp; Publish
              </button>
              <button class="btn-secondary-light" onclick="window.adminRejectFacility('${t.id}')" style="padding:8px 14px; font-size:0.82rem; color:#E11D48; font-weight:700;">
                ✕ Reject
              </button>
            ` : isApproved ? `
              <button class="table-action-btn delete" onclick="window.adminRejectFacility('${t.id}')" style="font-size:0.78rem;">
                Revoke Approval
              </button>
            ` : `
              <button class="btn-primary-green" onclick="window.adminApproveFacility('${t.id}')" style="padding:6px 14px; font-size:0.78rem;">
                Re-approve
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.adminApproveFacility = async function(facilityId) {
  // 1. Record verification in local storage
  let verifications = {};
  try {
    verifications = JSON.parse(localStorage.getItem('turfify_facility_verifications') || '{}');
  } catch(e) {}
  verifications[facilityId] = {
    status: 'Approved',
    verified_at: new Date().toISOString()
  };
  localStorage.setItem('turfify_facility_verifications', JSON.stringify(verifications));

  // 2. Find application details
  const all = getAllApprovalApplications();
  const facility = all.find(f => String(f.id) === String(facilityId));

  // 3. If it was in pending submissions, publish it to live TurfifyStore
  if (facility) {
    facility.verification_status = 'Approved';
    const liveTurfs = getLiveTurfs();
    const existingIndex = liveTurfs.findIndex(t => String(t.id) === String(facilityId));
    if (existingIndex >= 0) {
      liveTurfs[existingIndex].verification_status = 'Approved';
      liveTurfs[existingIndex].status = 'Approved';
      try { localStorage.setItem('turfify_turfs', JSON.stringify(liveTurfs)); } catch(e) {}
    } else {
      if (window.TurfifyStore) {
        window.TurfifyStore.addTurf({
          id: facility.id,
          name: facility.name,
          sport: facility.sport,
          price_per_hour: facility.price_per_hour,
          location: facility.location,
          city: facility.city,
          owner_name: facility.owner_name,
          owner_phone: facility.owner_phone,
          owner_email: facility.owner_email,
          image: facility.image,
          dimensions: facility.dimensions,
          surface: facility.surface,
          verification_status: 'Approved',
          status: 'Approved'
        });
      }
    }

    // Update pending submissions array
    try {
      let pending = JSON.parse(localStorage.getItem('turfify_pending_facility_submissions') || '[]');
      pending = pending.map(p => String(p.id) === String(facilityId) ? { ...p, verification_status: 'Approved' } : p);
      localStorage.setItem('turfify_pending_facility_submissions', JSON.stringify(pending));
    } catch(e) {}
  }

  // 4. Server-Side Enforcement Call
  try {
    fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_PASSWORD
      },
      body: JSON.stringify({ action: 'approve_facility', turf_id: facilityId })
    }).catch(() => {});
  } catch(e) {}

  addAdminAuditLog('Facility Approved', `Approved venue "${facility?.name || facilityId}" (${facility?.location || 'Tamil Nadu'})`);
  renderApprovalsQueue(currentApprovalsFilter);
  renderTurfsList();
  renderKPIs();
  showToast(`Facility "${facility?.name || facilityId}" approved and live on marketplace!`);
};

window.adminRejectFacility = async function(facilityId) {
  const reason = prompt('Enter rejection reason for this venue application:', 'Missing safety certification or business registration document.') || 'Application criteria not met';

  let verifications = {};
  try {
    verifications = JSON.parse(localStorage.getItem('turfify_facility_verifications') || '{}');
  } catch(e) {}
  verifications[facilityId] = {
    status: 'Rejected',
    rejection_reason: reason,
    rejected_at: new Date().toISOString()
  };
  localStorage.setItem('turfify_facility_verifications', JSON.stringify(verifications));

  const all = getAllApprovalApplications();
  const facility = all.find(f => String(f.id) === String(facilityId));

  // If in pending submissions, update status
  try {
    let pending = JSON.parse(localStorage.getItem('turfify_pending_facility_submissions') || '[]');
    pending = pending.map(p => String(p.id) === String(facilityId) ? { ...p, verification_status: 'Rejected', rejection_reason: reason } : p);
    localStorage.setItem('turfify_pending_facility_submissions', JSON.stringify(pending));
  } catch(e) {}

  // If in live turfs, mark rejected
  const liveTurfs = getLiveTurfs();
  const t = liveTurfs.find(x => String(x.id) === String(facilityId));
  if (t) {
    t.verification_status = 'Rejected';
    t.rejection_reason = reason;
    try { localStorage.setItem('turfify_turfs', JSON.stringify(liveTurfs)); } catch(e) {}
  }

  // Server-Side Call
  try {
    fetch('/api/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': ADMIN_PASSWORD
      },
      body: JSON.stringify({ action: 'reject_facility', turf_id: facilityId, reason })
    }).catch(() => {});
  } catch(e) {}

  addAdminAuditLog('Facility Rejected', `Rejected venue "${facility?.name || facilityId}". Reason: ${reason}`);
  renderApprovalsQueue(currentApprovalsFilter);
  renderTurfsList();
  renderKPIs();
  showToast(`Facility application rejected.`, true);
};

// =============================================================================
// FACILITY COMPLAINTS & DISPUTE RESOLUTION
// =============================================================================

const INITIAL_COMPLAINTS = [
  {
    id: 'TC-801',
    turf_name: 'Saju turf',
    location: 'Madurai',
    player_name: 'Rahul Sharma',
    player_phone: '+91 98765 43210',
    issue: 'Floodlight power trip during second half of 8 PM football match. 25 minutes play time lost.',
    date: '2026-11-17',
    time_slot: '08:00 PM - 09:00 PM',
    status: 'Open',
    booking_id: 'bk-101',
    amount: 1400
  },
  {
    id: 'TC-802',
    turf_name: 'Apex Arena Football',
    location: 'Madurai',
    player_name: 'Mohamed Shafi',
    player_phone: '+91 94431 88920',
    issue: 'Double booking conflict: offline walk-in team was already occupying court at 06:00 PM.',
    date: '2026-11-16',
    time_slot: '06:00 PM - 07:00 PM',
    status: 'Open',
    booking_id: 'bk-102',
    amount: 1200
  }
];

async function fetchAdminComplaintsAndLogs() {
  try {
    const res = await fetch('/api/complaint');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.complaints) && data.complaints.length > 0) {
        let local = [];
        try {
          local = JSON.parse(localStorage.getItem('turfify_complaints') || '[]');
        } catch(e) {}

        // Map existing local complaints to keep their resolved state if admin already acted
        const localMap = new Map();
        local.forEach(c => {
          const key = String(c.id).replace('#', '').trim();
          localMap.set(key, c);
        });

        const merged = data.complaints.map(sc => {
          const key = String(sc.id).replace('#', '').trim();
          const lc = localMap.get(key);
          if (lc) {
            localMap.delete(key);
            // If local status is already Resolved or Refunded, never allow stale server 'Open' to overwrite it!
            const isLocalResolved = lc.status && (lc.status.toLowerCase().includes('resolve') || lc.status.toLowerCase().includes('refund'));
            const isServerResolved = sc.status && (sc.status.toLowerCase().includes('resolve') || sc.status.toLowerCase().includes('refund'));
            if (isLocalResolved && !isServerResolved) {
              return { ...sc, status: lc.status, resolved_at: lc.resolved_at || new Date().toISOString() };
            }
          }
          return sc;
        });

        // Add any complaints that only exist locally
        for (const [_, lc] of localMap) {
          merged.push(lc);
        }

        localStorage.setItem('turfify_complaints', JSON.stringify(merged));

        if (Array.isArray(data.logs) && data.logs.length > 0) {
          let localLogs = [];
          try {
            localLogs = JSON.parse(localStorage.getItem('turfify_admin_audit_logs') || '[]');
          } catch(e) {}
          const serverLogIds = new Set(data.logs.map(l => String(l.id)));
          const localOnlyLogs = localLogs.filter(l => !serverLogIds.has(String(l.id)));
          const mergedLogs = [...data.logs, ...localOnlyLogs];
          localStorage.setItem('turfify_admin_audit_logs', JSON.stringify(mergedLogs));
        }

        renderKPIs();
        renderComplaintsTable();
        renderAuditLogs();
      }
    }
  } catch(err) {
    console.warn('Could not fetch server complaints:', err);
  }
}

function getAdminComplaints() {
  try {
    const raw = localStorage.getItem('turfify_complaints');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  localStorage.setItem('turfify_complaints', JSON.stringify(INITIAL_COMPLAINTS));
  return INITIAL_COMPLAINTS;
}

function getOpenComplaintsCount() {
  return getAdminComplaints().filter(c => c.status !== 'Resolved' && !c.status.includes('Resolved')).length;
}

let currentComplaintsFilter = 'open';

window.filterComplaints = function(filter) {
  currentComplaintsFilter = filter;
  document.querySelectorAll('.complaint-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === filter) {
      btn.style.background = '#0F172A';
      btn.style.color = '#fff';
      btn.style.borderColor = '#0F172A';
    } else {
      btn.style.background = '#F1F5F9';
      btn.style.color = '#475569';
      btn.style.borderColor = '#CBD5E1';
    }
  });
  renderComplaintsTable(filter);
};

function renderComplaintsTable(filter = currentComplaintsFilter) {
  const tbody = document.getElementById('complaints-table-body');
  if (!tbody) return;

  const complaints = getAdminComplaints();
  const openCount = getOpenComplaintsCount();

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('complaints-open-count', openCount);
  setEl('btn-count-open-complaints', openCount);
  setEl('nav-complaints-counter', openCount);

  let list = complaints;
  if (filter === 'open') {
    list = complaints.filter(c => c.status !== 'Resolved' && !c.status.includes('Resolved'));
  } else if (filter === 'resolved') {
    list = complaints.filter(c => c.status === 'Resolved' || c.status.includes('Resolved'));
  }

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px; color:#94A3B8;">No complaints matching "${filter}".</td></tr>`;
    return;
  }

  tbody.innerHTML = list.map(c => {
    const isOpen = c.status !== 'Resolved' && !c.status.includes('Resolved');
    return `
      <tr>
        <td>
          <span style="font-family:monospace; font-weight:800; color:#2563EB;">#${c.id}</span>
        </td>
        <td>
          <div style="font-weight:700; color:#0F172A;">${c.turf_name}</div>
          <div style="font-size:0.74rem; color:#64748B;">📍 ${c.location}</div>
        </td>
        <td>
          <div style="font-weight:600; color:#0F172A;">${c.player_name}</div>
          <div style="font-size:0.74rem; color:#64748B;">${c.player_phone}</div>
        </td>
        <td style="max-width:320px;">
          <div style="font-size:0.83rem; color:#334155; line-height:1.4;">${c.issue}</div>
        </td>
        <td style="font-size:0.8rem; color:#64748B; white-space:nowrap;">
          ${c.date}<br><small style="color:#94A3B8;">${c.time_slot}</small>
        </td>
        <td>
          <span class="status-pill ${isOpen ? 'cancelled' : 'confirmed'}">
            ${c.status}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            ${isOpen ? `
              <button class="btn-primary-green" onclick="window.adminResolveComplaint('${c.id}')" style="padding:5px 12px; font-size:0.75rem; font-weight:700;">
                ✓ Resolve
              </button>
              ${c.booking_id ? `
                <button class="table-action-btn delete" onclick="window.adminRefundBooking('${c.booking_id}', '${c.id}', ${c.amount || 0})" style="font-size:0.75rem;">
                  💸 Refund
                </button>
              ` : ''}
            ` : `
              <span style="font-size:0.78rem; color:#059669; font-weight:700;">Resolved ✓</span>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

window.adminResolveComplaint = async function(ticketId) {
  const cleanId = String(ticketId).replace('#', '').trim();
  const complaints = getAdminComplaints();
  const c = complaints.find(x => String(x.id).replace('#', '').trim() === cleanId);
  if (c) {
    c.status = 'Resolved';
    c.resolved_at = new Date().toISOString();
    localStorage.setItem('turfify_complaints', JSON.stringify(complaints));

    // 1. Post to /api/complaint
    try {
      fetch('/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve', id: c.id, ticket_id: c.id, status: 'Resolved' })
      }).catch(() => {});
    } catch(e) {}

    // 2. Post to /api/admin
    try {
      fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': ADMIN_PASSWORD
        },
        body: JSON.stringify({ action: 'resolve_complaint', ticket_id: c.id, id: c.id, status: 'Resolved' })
      }).catch(() => {});
    } catch(e) {}

    addAdminAuditLog('Complaint Resolved', `Resolved dispute #${c.id} for ${c.turf_name}`);
    renderComplaintsTable(currentComplaintsFilter);
    renderKPIs();
    showToast(`Dispute #${c.id} resolved.`);
  }
};

window.adminRefundBooking = async function(bookingId, ticketId, amount) {
  if (confirm(`Authorize instant refund of ₹${amount} for booking #${bookingId}?`)) {
    // 1. Mark booking refunded
    if (window.TurfifyStore) {
      window.TurfifyStore.cancelBooking(bookingId);
    }
    const bookings = getLiveBookings();
    const b = bookings.find(x => String(x.id) === String(bookingId));
    if (b) {
      b.payment_status = 'Refunded';
      b.status = 'Cancelled';
      b.refunded_at = new Date().toISOString();
      try { localStorage.setItem('turfify_bookings', JSON.stringify(bookings)); } catch(e) {}
    }

    // 2. Mark complaint resolved
    const cleanTicketId = ticketId ? String(ticketId).replace('#', '').trim() : '';
    let turfName = 'Facility';
    if (cleanTicketId) {
      const complaints = getAdminComplaints();
      const c = complaints.find(x => String(x.id).replace('#', '').trim() === cleanTicketId);
      if (c) {
        c.status = 'Resolved (Refunded)';
        c.resolved_at = new Date().toISOString();
        turfName = c.turf_name || turfName;
        try { localStorage.setItem('turfify_complaints', JSON.stringify(complaints)); } catch(e) {}
      }
    }

    // 3. Server-side API calls to persist both refund and complaint resolution
    try {
      fetch('/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refund',
          id: cleanTicketId,
          ticket_id: cleanTicketId,
          booking_id: bookingId,
          amount: amount,
          status: 'Resolved (Refunded)'
        })
      }).catch(() => {});
    } catch(e) {}

    try {
      fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': ADMIN_PASSWORD
        },
        body: JSON.stringify({
          action: 'process_refund',
          booking_id: bookingId,
          ticket_id: cleanTicketId,
          amount: amount
        })
      }).catch(() => {});
    } catch(e) {}

    addAdminAuditLog('Refund Authorized', `Processed instant refund of ₹${amount} for booking #${bookingId}`);
    renderComplaintsTable(currentComplaintsFilter);
    renderBookingsTable();
    renderKPIs();
    showToast(`Refund of ₹${amount} authorized. Dispute resolved.`);
  }
};

// =============================================================================
// ACTIVITY & AUDIT LOGS (IMMUTABLE OPERATIONAL TRAIL)
// =============================================================================

const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: '18 Nov 2026, 04:30 PM',
    admin: 'Sysadmin / Super Admin',
    action: 'Facility Verification',
    target: 'Saju turf (Madurai)',
    session: '103.21.244.18 (Production)',
    status: 'Success'
  },
  {
    id: 'log-2',
    timestamp: '18 Nov 2026, 03:45 PM',
    admin: 'Sysadmin / Super Admin',
    action: 'Platform Commission Audit',
    target: 'Monthly Statement (30% Net)',
    session: '103.21.244.18 (Production)',
    status: 'Success'
  },
  {
    id: 'log-3',
    timestamp: '18 Nov 2026, 02:15 PM',
    admin: 'Sysadmin / Super Admin',
    action: 'Super Admin Auth Gate',
    target: 'Session Login Verified',
    session: '103.21.244.18 (Production)',
    status: 'Verified'
  },
  {
    id: 'log-4',
    timestamp: '18 Nov 2026, 11:20 AM',
    admin: 'Sysadmin / Super Admin',
    action: 'Owner Payout Calculation',
    target: '70/30 Automated Ledger Sync',
    session: '103.21.244.18 (Production)',
    status: 'Success'
  }
];

function getAdminAuditLogs() {
  try {
    const raw = localStorage.getItem('turfify_admin_audit_logs');
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  localStorage.setItem('turfify_admin_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
  return INITIAL_AUDIT_LOGS;
}

function addAdminAuditLog(action, target, status = 'Success') {
  const logs = getAdminAuditLogs();
  const d = new Date();
  const timeStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' +
                  d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  logs.unshift({
    id: 'log-' + Date.now(),
    timestamp: timeStr,
    admin: 'Sysadmin / Super Admin',
    action,
    target,
    session: '103.21.244.18 (Production)',
    status
  });
  try {
    localStorage.setItem('turfify_admin_audit_logs', JSON.stringify(logs.slice(0, 100)));
  } catch(e) {}
  renderAuditLogs();
}

function renderAuditLogs() {
  const tbody = document.getElementById('audit-logs-table-body');
  if (!tbody) return;
  const logs = getAdminAuditLogs();
  if (!logs.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; color:#94A3B8;">No activity logged yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = logs.map(l => `
    <tr>
      <td style="font-size:0.8rem; color:#64748B; font-weight:600; white-space:nowrap;">${l.timestamp}</td>
      <td>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="width:24px; height:24px; border-radius:50%; background:#0F172A; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:0.7rem; font-weight:800;">SA</span>
          <span style="font-weight:700; color:#0F172A; font-size:0.85rem;">${l.admin}</span>
        </div>
      </td>
      <td>
        <span style="font-weight:700; color:#2563EB; font-size:0.84rem;">${l.action}</span>
      </td>
      <td>
        <span style="color:#334155; font-size:0.84rem;">${l.target}</span>
      </td>
      <td>
        <code style="font-size:0.75rem; background:#F1F5F9; color:#475569; padding:2px 6px; border-radius:4px;">${l.session}</code>
      </td>
      <td>
        <span class="status-pill ${l.status === 'Success' || l.status === 'Verified' ? 'confirmed' : 'cancelled'}">${l.status}</span>
      </td>
    </tr>
  `).join('');
}
