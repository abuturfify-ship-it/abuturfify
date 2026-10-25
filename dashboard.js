/**
 * Turfify Dashboard Engine — Powers both Owner & Player roles
 * Seamlessly manages data via TurfifyStore (localStorage, Supabase-compatible)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navBtnPlayer = document.getElementById('nav-btn-player');
  const navBtnOwner = document.getElementById('nav-btn-owner');
  const playerView = document.getElementById('player-dashboard-view');
  const ownerView = document.getElementById('owner-dashboard-view');
  const userGreeting = document.getElementById('user-greeting');
  const userRoleBadge = document.getElementById('user-role-badge');
  const userSubtext = document.getElementById('user-subtext');
  const toastContainer = document.getElementById('toast-container');

  // Modal elements
  const modalAddTurf = document.getElementById('modal-add-turf');
  const btnCloseAddTurf = document.getElementById('btn-close-add-turf');
  const btnOpenAddTurf = document.getElementById('btn-open-add-turf');
  const formNewTurf = document.getElementById('form-new-turf');

  // Toast Helper
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = `<span>${msg}</span>`;
    toastContainer.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateY(10px)';
      setTimeout(() => t.remove(), 250);
    }, 3000);
  }

  // Set active role state
  function applyRole(role) {
    window.TurfifyStore.switchRole(role);
    const user = window.TurfifyStore.getCurrentUser();

    if (role === 'owner') {
      navBtnOwner.classList.add('active');
      navBtnPlayer.classList.remove('active');
      ownerView.style.display = 'block';
      playerView.style.display = 'none';

      userGreeting.textContent = `Welcome back, ${user.name}`;
      userRoleBadge.className = 'role-badge owner';
      userRoleBadge.innerHTML = '🏟️ Turf Owner Account';
      userSubtext.textContent = `Managing ${user.business_name || 'Ground Facilities'}. View slots and daily turnover.`;

      renderOwnerDashboard();
    } else {
      navBtnPlayer.classList.add('active');
      navBtnOwner.classList.remove('active');
      playerView.style.display = 'block';
      ownerView.style.display = 'none';

      userGreeting.textContent = `Welcome back, ${user.name}`;
      userRoleBadge.className = 'role-badge player';
      userRoleBadge.innerHTML = '⚽ Player Account';
      userSubtext.textContent = 'Manage your sports bookings, team passes, and upcoming kickoff times.';

      renderPlayerDashboard();
    }
  }

  // --------------------------------------------------------------------------
  // RENDER PLAYER DASHBOARD
  // --------------------------------------------------------------------------
  function renderPlayerDashboard() {
    const user = window.TurfifyStore.getCurrentUser();
    const bookings = window.TurfifyStore.getPlayerBookings(user.id);
    const turfs = window.TurfifyStore.getTurfs();

    // Stats
    document.getElementById('player-matches-count').textContent = (user.matches_played || 18);
    document.getElementById('player-loyalty').textContent = `${user.loyalty_pts || 450} pts`;
    document.getElementById('player-upcoming-count').textContent = bookings.filter(b => b.status === 'Confirmed').length;

    // First upcoming match for Hero Card
    const upcoming = bookings.find(b => b.status === 'Confirmed');
    if (upcoming) {
      document.getElementById('player-hero-turf').textContent = `${upcoming.turf_name} — Pitch (${upcoming.sport})`;
      document.getElementById('player-hero-time').textContent = `${upcoming.date}, ${upcoming.time_slot}`;
    }

    // Bookings table
    const tbody = document.getElementById('player-bookings-body');
    tbody.innerHTML = '';
    if (bookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--slate-400);">No bookings found yet. Explore grounds to book your first game!</td></tr>`;
    } else {
      bookings.forEach(b => {
        const tr = document.createElement('tr');
        const statusClass = b.status === 'Confirmed' ? 'confirmed' : (b.status === 'Cancelled' ? 'cancelled' : 'walkin');
        tr.innerHTML = `
          <td><strong>${b.turf_name}</strong><br><span style="font-size:0.75rem; color:var(--slate-500);">${b.sport}</span></td>
          <td>${b.date}<br><span style="font-size:0.75rem; color:var(--slate-500);">${b.time_slot}</span></td>
          <td><strong>₹${b.amount}</strong></td>
          <td><span style="font-size:0.8rem; color:var(--primary-green-dark); font-weight:600;">${b.payment_status}</span></td>
          <td><span class="status-pill ${statusClass}">${b.status}</span></td>
          <td>
            ${b.status === 'Confirmed' ? 
              `<button class="btn-mini-action" onclick="window.cancelPlayerBooking('${b.id}')" style="color:#DC2626;">Cancel</button>` : 
              `<a href="index.html#popular-turfs" class="btn-mini-action" style="text-decoration:none;">Rebook</a>`
            }
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Saved/Favorite Turfs
    const favList = document.getElementById('player-favorites-list');
    favList.innerHTML = '';
    turfs.slice(0, 3).forEach(t => {
      const item = document.createElement('div');
      item.className = 'owner-turf-item';
      item.innerHTML = `
        <img src="${t.image}" alt="${t.name}" class="owner-turf-img">
        <div class="owner-turf-info">
          <div class="owner-turf-title">${t.name}</div>
          <div class="owner-turf-meta">
            <span>⭐ ${t.rating}</span>
            <span>₹${t.price_per_hour}/hr</span>
          </div>
        </div>
        <a href="index.html#popular-turfs" class="btn-mini-action" style="background:var(--primary-green-light); color:var(--primary-green-dark); font-weight:700; text-decoration:none;">
          Book
        </a>
      `;
      favList.appendChild(item);
    });
  }

  // --------------------------------------------------------------------------
  // RENDER OWNER DASHBOARD
  // --------------------------------------------------------------------------
  function renderOwnerDashboard() {
    const user = window.TurfifyStore.getCurrentUser();
    const ownerTurfs = window.TurfifyStore.getOwnerTurfs(user.id);
    const ownerBookings = window.TurfifyStore.getOwnerBookings(user.id);

    document.getElementById('owner-turfs-count').textContent = `${ownerTurfs.length} Grounds`;

    // Today's Revenue Calculation
    const totalRev = ownerBookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.amount || 0), 0);
    document.getElementById('owner-today-rev').textContent = `₹${totalRev.toLocaleString()}`;

    // Occupancy
    const bookedCount = ownerBookings.filter(b => b.status !== 'Cancelled').length;
    document.getElementById('owner-occupancy').textContent = `${Math.min(100, Math.round((bookedCount / 16) * 100))}%`;

    // Owner Turfs List
    const turfsContainer = document.getElementById('owner-turfs-list');
    turfsContainer.innerHTML = '';
    if (ownerTurfs.length === 0) {
      turfsContainer.innerHTML = `<p style="color:var(--slate-400); font-size:0.85rem;">No turfs registered yet. Click '+ Add Turf' above.</p>`;
    } else {
      ownerTurfs.forEach(t => {
        const item = document.createElement('div');
        item.className = 'owner-turf-item';
        item.innerHTML = `
          <img src="${t.image}" alt="${t.name}" class="owner-turf-img">
          <div class="owner-turf-info">
            <div class="owner-turf-title">${t.name}</div>
            <div class="owner-turf-meta">
              <span>${t.sport}</span>
              <span>₹${t.price_per_hour}/hr</span>
              <span>⭐ ${t.rating}</span>
            </div>
          </div>
          <button class="btn-mini-action" onclick="window.deleteOwnerTurf('${t.id}')" title="Delete Ground">🗑️</button>
        `;
        turfsContainer.appendChild(item);
      });
    }

    // Owner Slots Matrix - dynamic from actual bookings
    const slotMatrix = document.getElementById('owner-slot-matrix');
    slotMatrix.innerHTML = '';
    const timeSlots = [
      '06:00 - 07:00 AM',
      '07:00 - 08:00 AM',
      '08:00 - 09:00 AM',
      '04:00 - 05:00 PM',
      '05:00 - 06:00 PM',
      '06:00 - 07:00 PM',
      '07:00 - 08:00 PM',
      '08:00 - 09:00 PM',
      '09:00 - 10:00 PM',
      '10:00 - 11:00 PM'
    ];

    const slots = timeSlots.map(timeLabel => {
      const booking = ownerBookings.find(b => {
        if (b.status === 'Cancelled') return false;
        const slotStr = (b.time_slot || '').trim();
        return slotStr === timeLabel || slotStr.startsWith(timeLabel.slice(0, 5));
      });

      if (booking) {
        return {
          time: timeLabel,
          status: booking.status === 'Walk-in' ? 'walkin' : 'booked',
          player: booking.player_name || 'Player',
          booking: booking
        };
      }
      return {
        time: timeLabel,
        status: 'available',
        player: null,
        booking: null
      };
    });

    slots.forEach(s => {
      const el = document.createElement('div');
      el.className = `slot-item ${s.status}`;
      el.innerHTML = `
        <div class="slot-time">${s.time}</div>
        <span class="slot-badge">${s.status}</span>
        ${s.player ? `<div style="font-size:0.68rem; font-weight:600; color:var(--slate-700); margin-top:4px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${s.player}">${s.player}</div>` : ''}
      `;
      el.addEventListener('click', () => {
        if (s.status === 'available') {
          const customerName = prompt(`Enter customer name for walk-in slot (${s.time}):`);
          if (customerName) {
            const primaryTurf = ownerTurfs[0] || { id: 'turf-1', name: 'The Arena Sports Hub' };
            window.TurfifyStore.createBooking({
              turf_id: primaryTurf.id,
              turf_name: primaryTurf.name,
              sport: primaryTurf.sport || 'Football',
              player_name: customerName,
              player_phone: '+91 Walk-in',
              date: new Date().toISOString().split('T')[0],
              time_slot: s.time,
              amount: primaryTurf.price_per_hour || 1200,
              status: 'Walk-in',
              payment_status: 'Cash at Counter'
            });
            showToast(`Walk-in booked for ${customerName}!`);
            renderOwnerDashboard();
          }
        } else if (s.status === 'walkin' && s.booking) {
          if (confirm(`Cancel walk-in reservation for ${s.player}?`)) {
            window.TurfifyStore.cancelBooking(s.booking.id);
            showToast('Walk-in booking cancelled.');
            renderOwnerDashboard();
          }
        } else if (s.booking) {
          alert(`Slot ${s.time} reserved online:\nPlayer: ${s.booking.player_name}\nPhone: ${s.booking.player_phone || 'Online reservation'}\nTurf: ${s.booking.turf_name}\nAmount: ₹${s.booking.amount}\nStatus: ${s.booking.payment_status}`);
        }
      });
      slotMatrix.appendChild(el);
    });

    // Owner Ledger Table
    const ledgerBody = document.getElementById('owner-ledger-body');
    ledgerBody.innerHTML = '';
    ownerBookings.forEach(b => {
      const tr = document.createElement('tr');
      const statusClass = b.status === 'Confirmed' ? 'confirmed' : (b.status === 'Cancelled' ? 'cancelled' : 'walkin');
      tr.innerHTML = `
        <td><code style="font-size:0.75rem;">${b.id}</code></td>
        <td><strong>${b.player_name}</strong><br><span style="font-size:0.75rem; color:var(--slate-500);">${b.player_phone}</span></td>
        <td>${b.turf_name}</td>
        <td>${b.date}<br><span style="font-size:0.75rem; color:var(--slate-500);">${b.time_slot}</span></td>
        <td><strong>₹${b.amount}</strong></td>
        <td><span style="font-size:0.8rem; color:var(--slate-600);">${b.payment_status}</span></td>
        <td><span class="status-pill ${statusClass}">${b.status}</span></td>
      `;
      ledgerBody.appendChild(tr);
    });
  }

  // Global actions for inline buttons
  window.cancelPlayerBooking = function(id) {
    if (confirm('Are you sure you want to cancel this slot reservation?')) {
      window.TurfifyStore.cancelBooking(id);
      showToast('Booking cancelled. Slot reopened for other players.');
      renderPlayerDashboard();
    }
  };

  window.deleteOwnerTurf = function(id) {
    if (confirm('Delete this turf from your portfolio?')) {
      window.TurfifyStore.deleteTurf(id);
      showToast('Ground removed.');
      renderOwnerDashboard();
    }
  };

  // Switch role listeners
  navBtnPlayer.addEventListener('click', () => applyRole('player'));
  navBtnOwner.addEventListener('click', () => applyRole('owner'));

  // Quick action modal
  btnOpenAddTurf?.addEventListener('click', () => {
    modalAddTurf.classList.add('active');
  });

  btnCloseAddTurf?.addEventListener('click', () => {
    modalAddTurf.classList.remove('active');
  });

  document.getElementById('btn-quick-action')?.addEventListener('click', () => {
    const user = window.TurfifyStore.getCurrentUser();
    if (user.role === 'owner') {
      modalAddTurf.classList.add('active');
    } else {
      window.location.href = 'index.html#popular-turfs';
    }
  });

  document.getElementById('btn-add-walkin')?.addEventListener('click', () => {
    const customer = prompt('Enter Walk-in Player Name & Sport:', 'Kiran (Football)');
    if (customer) {
      window.TurfifyStore.createBooking({
        turf_id: 'turf-1',
        turf_name: 'The Arena Sports Hub',
        sport: 'Football',
        player_id: 'walkin-' + Date.now(),
        player_name: customer,
        player_phone: '+91 99887 76655',
        date: new Date().toISOString().split('T')[0],
        time_slot: '10:00 PM - 11:00 PM',
        amount: 1200,
        status: 'Walk-in',
        payment_status: 'Cash at Counter'
      });
      showToast('Walk-in booking added to today\'s schedule!');
      renderOwnerDashboard();
    }
  });

  document.getElementById('btn-block-slot')?.addEventListener('click', () => {
    showToast('Slot 11:00 PM blocked for turf maintenance / grass trimming.');
  });

  // Handle new turf creation form
  formNewTurf?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-turf-name').value;
    const sport = document.getElementById('new-turf-sport').value;
    const rate = parseInt(document.getElementById('new-turf-rate').value, 10);
    const loc = document.getElementById('new-turf-loc').value;
    const img = document.getElementById('new-turf-img').value;

    window.TurfifyStore.addTurf({
      name,
      sport,
      price_per_hour: rate,
      location: loc,
      image: img,
      dimensions: 'Tournament Grade Arena',
      amenities: ['Floodlights', 'Changing Room', 'Parking', 'Equipment']
    });

    modalAddTurf.classList.remove('active');
    formNewTurf.reset();
    showToast(`Turf "${name}" successfully registered and live!`);
    renderOwnerDashboard();
  });

  // Initial Boot
  const curUser = window.TurfifyStore.getCurrentUser();
  applyRole(curUser.role || 'player');
});
