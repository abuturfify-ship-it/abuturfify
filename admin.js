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

  // Build players from booking records
  const playerMap = {};
  bookings.forEach(b => {
    if (!b.player_id) return;
    if (!playerMap[b.player_id]) {
      playerMap[b.player_id] = {
        id: b.player_id,
        name: b.player_name || 'Player',
        phone: b.player_phone || '—',
        email: '—',
        role: 'Player',
        bookings: 0,
        spent: 0,
        joined: b.date || '—'
      };
    }
    if (b.status !== 'Cancelled') {
      playerMap[b.player_id].bookings++;
      playerMap[b.player_id].spent += (b.amount || 0);
    }
  });

  // Build owners from turfs
  const ownerMap = {};
  turfs.forEach(t => {
    if (!t.owner_id) return;
    if (!ownerMap[t.owner_id]) {
      ownerMap[t.owner_id] = {
        id: t.owner_id,
        name: t.owner_name || 'Owner (' + t.owner_id + ')',
        phone: t.owner_phone || '—',
        email: t.owner_email || '—',
        role: 'Turf Owner',
        turfsManaged: 0,
        totalRevenue: 0,
        joined: '—'
      };
    }
    ownerMap[t.owner_id].turfsManaged++;
  });

  // Add booking revenue to owners
  bookings.forEach(b => {
    const turf = turfs.find(t => t.id === b.turf_id);
    if (!turf || !turf.owner_id || !ownerMap[turf.owner_id]) return;
    if (b.status !== 'Cancelled') {
      ownerMap[turf.owner_id].totalRevenue += (b.amount || 0);
      if (ownerMap[turf.owner_id].joined === '—') {
        ownerMap[turf.owner_id].joined = b.date || '—';
      }
    }
  });

  return [...Object.values(playerMap), ...Object.values(ownerMap)];
}

// Application Controller
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  renderKPIs();
  initDashboardCharts();
  renderTurfsList();
  renderBookingsTable();
  renderUsersTable();
  initFilters();
  initExportButtons();
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
  set('kpi-bookings',      confirmed.length);
  set('kpi-users',         users.length);
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
  if (!el) return;

  if (!confirmed.length) {
    el.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:32px;color:#94A3B8;">No confirmed bookings yet.</td></tr>`;
    return;
  }

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

  // Owner payout summary
  const ownerTotals = {};
  confirmed.forEach(b => {
    const turf = turfs.find(t => t.id === b.turf_id);
    const oid  = turf?.owner_id || b.turf_id;
    const oname = turf?.owner_name || 'Owner';
    if (!ownerTotals[oid]) ownerTotals[oid] = { name: oname, total: 0, count: 0 };
    ownerTotals[oid].total += (b.amount || 0);
    ownerTotals[oid].count++;
  });

  const summEl = document.getElementById('owner-payout-summary');
  if (summEl) {
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
    `).join('') : `<div style="text-align:center;padding:20px;color:#94A3B8;">No payouts yet.</div>`;
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
    users = users.filter(u => (u.name || '').toLowerCase().includes(q) || (u.phone || '').toLowerCase().includes(q));
  }

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:32px;color:#94A3B8;">No registrations yet. Users appear here once they sign up and book a slot.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(u => `
    <tr>
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
        <span class="status-pill ${u.role === 'Turf Owner' ? 'active' : 'walkin'}">${u.role}</span>
      </td>
      <td>
        <div style="font-weight:700;">
          ${u.role === 'Turf Owner'
            ? `${fmt(Math.round((u.totalRevenue || 0) * OWNER_SHARE))} <span style="font-size:0.72rem;color:#94A3B8;">(70% share)</span>`
            : `${u.bookings || 0} slots`}
        </div>
        <div style="font-size:0.74rem;color:#64748B;">
          ${u.role === 'Turf Owner'
            ? `${u.turfsManaged || 0} Turf(s) &bull; GMV: ${fmt(u.totalRevenue || 0)}`
            : `Total spent: ${fmt(u.spent || 0)}`}
        </div>
      </td>
      <td><span class="status-pill active">active</span></td>
      <td style="font-size:0.78rem;color:#64748B;">${u.joined || '—'}</td>
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
