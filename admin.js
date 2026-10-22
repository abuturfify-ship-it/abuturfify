/* ==========================================================================
   TURFIFY ADMIN PANEL — INTERACTIVE SCRIPT
   Data Management, Section Switcher, SVG Charts, Live Filters, Modals & Toast
   ========================================================================== */

// Sample Data Store
const AdminStore = {
  stats: {
    revenue: 428500,
    activeTurfs: 48,
    totalBookings: 1248,
    activeUsers: 892,
    settledPayouts: 385000,
    pendingPayouts: 43500
  },

  turfs: [
    {
      id: "TRF-001",
      name: "Greenfield Arena 5v5",
      location: "Anna Nagar, Chennai",
      sport: "Football",
      price: 1200,
      rating: 4.9,
      status: "active",
      bookingsCount: 312,
      owner: "Vikram Rathore",
      img: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "TRF-002",
      name: "Striker's Bay Box Cricket",
      location: "Koramangala, Bangalore",
      sport: "Cricket",
      price: 1500,
      rating: 4.8,
      status: "active",
      bookingsCount: 284,
      owner: "Pooja Hegde",
      img: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "TRF-003",
      name: "Velocity Badminton Hub",
      location: "Indiranagar, Bangalore",
      sport: "Badminton",
      price: 800,
      rating: 4.7,
      status: "active",
      bookingsCount: 198,
      owner: "Karthik Nair",
      img: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "TRF-004",
      name: "Champions Turf Nungambakkam",
      location: "Nungambakkam, Chennai",
      sport: "Football",
      price: 1400,
      rating: 4.9,
      status: "active",
      bookingsCount: 245,
      owner: "Suresh Raman",
      img: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "TRF-005",
      name: "Apex Tennis & Pickleball Court",
      location: "Adyar, Chennai",
      sport: "Tennis",
      price: 1100,
      rating: 4.6,
      status: "inactive",
      bookingsCount: 92,
      owner: "Ananya Roy",
      img: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "TRF-006",
      name: "Thunderbolt Multi-sport Dome",
      location: "Whitefield, Bangalore",
      sport: "Multi-sport",
      price: 1600,
      rating: 4.9,
      status: "active",
      bookingsCount: 117,
      owner: "Arjun Reddy",
      img: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80"
    }
  ],

  bookings: [
    {
      id: "BK-9021",
      customer: "Rahul Sharma",
      email: "rahul.s@gmail.com",
      turf: "Greenfield Arena 5v5",
      slot: "Today, 07:00 PM - 08:00 PM",
      sport: "Football",
      amount: 1200,
      status: "confirmed",
      gateway: "Razorpay UPI",
      date: "2026-10-15"
    },
    {
      id: "BK-9020",
      customer: "Aditi Rao",
      email: "aditi.rao@outlook.com",
      turf: "Striker's Bay Box Cricket",
      slot: "Today, 08:00 PM - 09:30 PM",
      sport: "Cricket",
      amount: 2250,
      status: "confirmed",
      gateway: "Razorpay Card",
      date: "2026-10-15"
    },
    {
      id: "BK-9019",
      customer: "Naveen Kumar",
      email: "naveen.k@gmail.com",
      turf: "Velocity Badminton Hub",
      slot: "Today, 06:00 PM - 07:00 PM",
      sport: "Badminton",
      amount: 800,
      status: "walkin",
      gateway: "Cash at Desk",
      date: "2026-10-15"
    },
    {
      id: "BK-9018",
      customer: "Dinesh Karthik",
      email: "dk.chennai@gmail.com",
      turf: "Champions Turf Nungambakkam",
      slot: "Tomorrow, 06:00 AM - 07:00 AM",
      sport: "Football",
      amount: 1400,
      status: "confirmed",
      gateway: "Razorpay Netbanking",
      date: "2026-10-16"
    },
    {
      id: "BK-9017",
      customer: "Meera Krishnan",
      email: "meera.k@gmail.com",
      turf: "Apex Tennis & Pickleball Court",
      slot: "Oct 14, 05:00 PM - 06:00 PM",
      sport: "Tennis",
      amount: 1100,
      status: "cancelled",
      gateway: "Razorpay UPI",
      date: "2026-10-14"
    },
    {
      id: "BK-9016",
      customer: "Harish Varma",
      email: "harish.v@live.com",
      turf: "Thunderbolt Multi-sport Dome",
      slot: "Oct 14, 08:00 PM - 10:00 PM",
      sport: "Multi-sport",
      amount: 3200,
      status: "confirmed",
      gateway: "Razorpay UPI",
      date: "2026-10-14"
    }
  ],

  users: [
    {
      id: "USR-101",
      name: "Rahul Sharma",
      email: "rahul.s@gmail.com",
      role: "Player",
      phone: "+91 98765 43210",
      totalBookings: 14,
      totalSpent: 16800,
      status: "active",
      joined: "Jan 2026"
    },
    {
      id: "USR-102",
      name: "Vikram Rathore",
      email: "vikram@greenfieldarena.com",
      role: "Turf Owner",
      phone: "+91 98451 23456",
      turfsManaged: 2,
      totalRevenue: 342000,
      status: "active",
      joined: "Nov 2025"
    },
    {
      id: "USR-103",
      name: "Aditi Rao",
      email: "aditi.rao@outlook.com",
      role: "Player",
      phone: "+91 99001 88223",
      totalBookings: 9,
      totalSpent: 12400,
      status: "active",
      joined: "Mar 2026"
    },
    {
      id: "USR-104",
      name: "Pooja Hegde",
      email: "pooja@strikersbay.com",
      role: "Turf Owner",
      phone: "+91 97400 55112",
      turfsManaged: 1,
      totalRevenue: 284000,
      status: "active",
      joined: "Dec 2025"
    },
    {
      id: "USR-105",
      name: "Karthik Nair",
      email: "karthik@velocityhub.in",
      role: "Turf Owner",
      phone: "+91 96112 33445",
      turfsManaged: 1,
      totalRevenue: 158400,
      status: "active",
      joined: "Feb 2026"
    },
    {
      id: "USR-106",
      name: "Siddharth Verma",
      email: "sid.verma@gmail.com",
      role: "Player",
      phone: "+91 91234 56789",
      totalBookings: 3,
      totalSpent: 3600,
      status: "inactive",
      joined: "Aug 2026"
    }
  ]
};

// Application Controller
document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initDashboardCharts();
  renderTurfsList();
  renderBookingsTable();
  renderUsersTable();
  initModalHandlers();
  initFilters();
  initExportButtons();
});

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

// Chart Initializations
function initDashboardCharts() {
  const chartWrapper = document.getElementById("revenue-curve-svg");
  if (!chartWrapper) return;

  const points = [
    { x: 30, y: 160, label: "Mon", val: "₹38k" },
    { x: 110, y: 140, label: "Tue", val: "₹45k" },
    { x: 190, y: 110, label: "Wed", val: "₹56k" },
    { x: 270, y: 125, label: "Thu", val: "₹51k" },
    { x: 350, y: 70, label: "Fri", val: "₹72k" },
    { x: 430, y: 35, label: "Sat", val: "₹89k" },
    { x: 510, y: 45, label: "Sun", val: "₹84k" }
  ];

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

// Render Turfs in Grid
function renderTurfsList(filterSport = "all", searchQuery = "") {
  const container = document.getElementById("turfs-grid-container");
  if (!container) return;

  let filtered = AdminStore.turfs;

  if (filterSport !== "all") {
    filtered = filtered.filter(t => t.sport.toLowerCase() === filterSport.toLowerCase());
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t => t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: #94A3B8;">No turfs found matching criteria.</div>`;
    return;
  }

  container.innerHTML = filtered.map(t => `
    <div class="turf-admin-card" id="card-${t.id}">
      <div class="turf-card-header-img" style="background-image: url('${t.img}')">
        <div class="turf-card-overlay">
          <span class="turf-sport-badge">
            ${getSportIcon(t.sport)} ${t.sport}
          </span>
          <span class="status-pill ${t.status}">${t.status}</span>
        </div>
      </div>
      <div class="turf-card-content">
        <h3 class="turf-card-title">${t.name}</h3>
        <p class="turf-card-location">📍 ${t.location}</p>
        
        <div class="turf-metric-bar">
          <div>
            <div class="turf-metric-unit">Hourly Rate</div>
            <div class="turf-metric-num">₹${t.price}</div>
          </div>
          <div>
            <div class="turf-metric-unit">Rating</div>
            <div class="turf-metric-num">⭐ ${t.rating}</div>
          </div>
          <div>
            <div class="turf-metric-unit">Bookings</div>
            <div class="turf-metric-num">${t.bookingsCount}</div>
          </div>
        </div>

        <div style="font-size: 0.78rem; color: #64748B; margin-bottom: 8px;">
          Managed by: <strong style="color: #0F172A;">${t.owner}</strong>
        </div>

        <div class="turf-card-actions">
          <button class="table-action-btn" onclick="toggleTurfStatus('${t.id}')">
            ${t.status === 'active' ? '⏸️ Deactivate' : '▶️ Activate'}
          </button>
          <div style="display: flex; gap: 6px;">
            <button class="table-action-btn" onclick="editTurfPrompt('${t.id}')">✏️ Edit</button>
            <button class="table-action-btn delete" onclick="deleteTurf('${t.id}')">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

// Render Bookings Table
function renderBookingsTable(filterStatus = "all", searchQuery = "") {
  const tbody = document.getElementById("bookings-table-body");
  if (!tbody) return;

  let filtered = AdminStore.bookings;

  if (filterStatus !== "all") {
    filtered = filtered.filter(b => b.status === filterStatus);
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(b => 
      b.customer.toLowerCase().includes(q) || 
      b.turf.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 32px; color: #94A3B8;">No booking records match this query.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(b => `
    <tr id="row-${b.id}">
      <td>
        <span style="font-family: monospace; font-weight: 700; color: #2563EB;">${b.id}</span>
      </td>
      <td>
        <div class="user-info-cell">
          <div class="cell-avatar" style="background: ${getAvatarColor(b.customer)}">
            ${b.customer.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div class="user-name-cell">${b.customer}</div>
            <div class="user-email-cell">${b.email}</div>
          </div>
        </div>
      </td>
      <td>
        <div style="font-weight: 600; color: #0F172A;">${b.turf}</div>
        <div style="font-size: 0.76rem; color: #64748B;">${b.slot}</div>
      </td>
      <td>
        <span class="status-pill ${b.status}">${b.status}</span>
      </td>
      <td>
        <div style="font-weight: 700; color: #0F172A;">₹${b.amount}</div>
        <div style="font-size: 0.74rem; color: #64748B;">${b.gateway}</div>
      </td>
      <td style="font-size: 0.8rem; color: #64748B;">
        ${b.date}
      </td>
      <td>
        <div style="display: flex; gap: 6px;">
          ${b.status !== 'confirmed' ? `<button class="table-action-btn" onclick="updateBookingStatus('${b.id}', 'confirmed')">Confirm</button>` : ''}
          ${b.status !== 'cancelled' ? `<button class="table-action-btn delete" onclick="updateBookingStatus('${b.id}', 'cancelled')">Cancel</button>` : ''}
        </div>
      </td>
    </tr>
  `).join("");
}

// Render Users Table
function renderUsersTable(filterRole = "all", searchQuery = "") {
  const tbody = document.getElementById("users-table-body");
  if (!tbody) return;

  let filtered = AdminStore.users;

  if (filterRole !== "all") {
    filtered = filtered.filter(u => u.role.toLowerCase().includes(filterRole.toLowerCase()));
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }

  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td>
        <div class="user-info-cell">
          <div class="cell-avatar" style="background: ${getAvatarColor(u.name)}">
            ${u.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div class="user-name-cell">${u.name}</div>
            <div class="user-email-cell">${u.phone}</div>
          </div>
        </div>
      </td>
      <td>
        <span style="font-size: 0.82rem; font-weight: 600; color: #475569;">${u.email}</span>
      </td>
      <td>
        <span class="status-pill ${u.role === 'Turf Owner' ? 'active' : 'walkin'}">
          ${u.role}
        </span>
      </td>
      <td>
        <div style="font-weight: 700;">
          ${u.role === 'Turf Owner' ? `₹${u.totalRevenue.toLocaleString()}` : `${u.totalBookings} slots`}
        </div>
        <div style="font-size: 0.74rem; color: #64748B;">
          ${u.role === 'Turf Owner' ? `${u.turfsManaged} Turf(s)` : `Spent ₹${u.totalSpent.toLocaleString()}`}
        </div>
      </td>
      <td>
        <span class="status-pill ${u.status}">${u.status}</span>
      </td>
      <td>
        <button class="table-action-btn" onclick="toggleUserStatus('${u.id}')">
          ${u.status === 'active' ? 'Suspend' : 'Reinstate'}
        </button>
      </td>
    </tr>
  `).join("");
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

// Modal Handlers
function initModalHandlers() {
  const modalBackdrop = document.getElementById("add-turf-modal");
  const openModalBtn = document.getElementById("btn-open-add-turf");
  const closeModalBtn = document.getElementById("btn-close-turf-modal");
  const cancelModalBtn = document.getElementById("btn-cancel-turf-modal");
  const saveTurfBtn = document.getElementById("btn-save-turf");

  if (openModalBtn && modalBackdrop) {
    openModalBtn.addEventListener("click", () => {
      modalBackdrop.classList.add("active");
    });
  }

  const closeModal = () => modalBackdrop?.classList.remove("active");

  closeModalBtn?.addEventListener("click", closeModal);
  cancelModalBtn?.addEventListener("click", closeModal);

  saveTurfBtn?.addEventListener("click", () => {
    const name = document.getElementById("form-turf-name")?.value;
    const location = document.getElementById("form-turf-location")?.value;
    const sport = document.getElementById("form-turf-sport")?.value;
    const price = document.getElementById("form-turf-price")?.value;
    const owner = document.getElementById("form-turf-owner")?.value;

    if (!name || !location || !price) {
      showToast("Please fill in all required turf fields.", true);
      return;
    }

    const newTurf = {
      id: `TRF-00${AdminStore.turfs.length + 1}`,
      name,
      location,
      sport: sport || "Football",
      price: parseInt(price) || 1200,
      rating: 5.0,
      status: "active",
      bookingsCount: 0,
      owner: owner || "Turf Partner",
      img: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80"
    };

    AdminStore.turfs.unshift(newTurf);
    renderTurfsList();
    closeModal();
    showToast(`Turf "${name}" added successfully!`);
  });
}

// Actions
window.toggleTurfStatus = function(turfId) {
  const turf = AdminStore.turfs.find(t => t.id === turfId);
  if (turf) {
    turf.status = turf.status === "active" ? "inactive" : "active";
    renderTurfsList();
    showToast(`Turf status changed to ${turf.status}.`);
  }
};

window.deleteTurf = function(turfId) {
  if (confirm("Are you sure you want to remove this turf from the marketplace?")) {
    AdminStore.turfs = AdminStore.turfs.filter(t => t.id !== turfId);
    renderTurfsList();
    showToast("Turf deleted successfully.");
  }
};

window.editTurfPrompt = function(turfId) {
  const turf = AdminStore.turfs.find(t => t.id === turfId);
  if (!turf) return;
  const newPrice = prompt(`Update hourly rate for ${turf.name} (Current: ₹${turf.price}):`, turf.price);
  if (newPrice && !isNaN(newPrice)) {
    turf.price = parseInt(newPrice);
    renderTurfsList();
    showToast(`Hourly rate updated to ₹${turf.price}.`);
  }
};

window.updateBookingStatus = function(bookingId, status) {
  const booking = AdminStore.bookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = status;
    renderBookingsTable();
    showToast(`Booking ${bookingId} marked as ${status}.`);
  }
};

window.toggleUserStatus = function(userId) {
  const user = AdminStore.users.find(u => u.id === userId);
  if (user) {
    user.status = user.status === "active" ? "suspended" : "active";
    renderUsersTable();
    showToast(`User ${user.name} is now ${user.status}.`);
  }
};

// Export Functionality
function initExportButtons() {
  const exportCsvBtn = document.getElementById("btn-export-bookings-csv");
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", () => {
      let csv = "BookingID,Customer,Turf,Slot,Amount,Status,Gateway,Date\n";
      AdminStore.bookings.forEach(b => {
        csv += `"${b.id}","${b.customer}","${b.turf}","${b.slot}","${b.amount}","${b.status}","${b.gateway}","${b.date}"\n`;
      });
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Turfify_Bookings_Export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Bookings export downloaded as CSV.");
    });
  }
}

// Helpers
function getSportIcon(sport) {
  switch (sport.toLowerCase()) {
    case "football": return "⚽";
    case "cricket": return "🏏";
    case "badminton": return "🏸";
    case "tennis": return "🎾";
    default: return "🏟️";
  }
}

function getAvatarColor(name) {
  const colors = [
    "linear-gradient(135deg, #10B981, #06B6D4)",
    "linear-gradient(135deg, #3B82F6, #8B5CF6)",
    "linear-gradient(135deg, #F59E0B, #EA580C)",
    "linear-gradient(135deg, #EC4899, #8B5CF6)",
    "linear-gradient(135deg, #14B8A6, #0D9488)"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
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
