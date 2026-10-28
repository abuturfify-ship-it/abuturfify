/**
 * Turfify Dashboard Engine — Powers both Owner & Player roles
 * Seamlessly manages data via TurfifyStore (localStorage, Supabase-compatible)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Authentication Guard: Ensure user is signed in
  const initialUser = window.TurfifyStore ? window.TurfifyStore.getCurrentUser() : null;
  if (!initialUser || !initialUser.is_authenticated) {
    window.location.replace('auth.html?mode=signin&redirect=dashboard');
    return;
  }

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
              `<button type="button" class="btn-mini-action" onclick="window.openDashBookingModal('${b.turf_id || ''}')" style="cursor:pointer;">Rebook</button>`
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
        <button type="button" class="btn-mini-action" onclick="window.openDashBookingModal('${t.id}')" style="background:var(--primary-green-light); color:var(--primary-green-dark); font-weight:700; cursor:pointer; border:1px solid #A7F3D0;">
          Book
        </button>
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
      window.openDashBookingModal();
    }
  });

  // Topbar and Panel Book Slot triggers
  document.getElementById('btn-topbar-book-turf')?.addEventListener('click', () => {
    window.openDashBookingModal();
  });

  document.getElementById('btn-dash-book-turf')?.addEventListener('click', () => {
    window.openDashBookingModal();
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

  // File upload handler for gallery photo in dashboard
  let uploadedImageDataDash = '';
  const fileInputDash = document.getElementById('new-turf-file-dash');
  if (fileInputDash) {
    fileInputDash.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          uploadedImageDataDash = ev.target.result;
          document.getElementById('upload-preview-dash').src = uploadedImageDataDash;
          document.getElementById('upload-preview-wrap-dash').style.display = 'flex';
          document.getElementById('upload-prompt-dash').style.display = 'none';
          document.getElementById('upload-filename-dash').textContent = (file.name || 'Photo') + ' ✓';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Amenity chips toggle in dashboard
  document.querySelectorAll('#amenities-selector-dash .amenity-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
    });
  });

  // Handle new turf creation form
  formNewTurf?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('new-turf-name').value.trim();
    const sport = document.getElementById('new-turf-sport').value;
    const rate = parseInt(document.getElementById('new-turf-rate').value, 10);
    const loc = document.getElementById('new-turf-loc').value.trim();
    const urlInput = document.getElementById('new-turf-url-dash')?.value?.trim();
    const finalImage = uploadedImageDataDash || urlInput || 'images/turf-arena.jpg';

    // Collect clicked amenities only
    const selectedAmenities = Array.from(document.querySelectorAll('#amenities-selector-dash .amenity-toggle-btn.selected'))
      .map(btn => btn.dataset.amenity);

    window.TurfifyStore.addTurf({
      name,
      sport,
      price_per_hour: rate,
      location: loc,
      image: finalImage,
      dimensions: 'Tournament Grade Arena',
      amenities: selectedAmenities
    });

    modalAddTurf.classList.remove('active');
    formNewTurf.reset();
    showToast(`Turf "${name}" successfully registered and live!`);
    renderOwnerDashboard();
  });

  // --------------------------------------------------------------------------
  // IN-DASHBOARD TURF BOOKING ENGINE
  // --------------------------------------------------------------------------
  const modalDashBooking = document.getElementById('modal-dash-booking');
  const btnCloseDashBooking = document.getElementById('btn-close-dash-booking');
  const turfSelect = document.getElementById('dash-booking-turf-select');
  const dateInput = document.getElementById('dash-booking-date');
  const nameInput = document.getElementById('dash-booking-player-name');
  const phoneInput = document.getElementById('dash-booking-player-phone');
  const btnConfirmDash = document.getElementById('btn-confirm-dash-booking');

  // Close modal handlers
  btnCloseDashBooking?.addEventListener('click', () => {
    modalDashBooking?.classList.remove('active');
  });

  modalDashBooking?.addEventListener('click', (e) => {
    if (e.target === modalDashBooking) {
      modalDashBooking.classList.remove('active');
    }
  });

  // Payment method pills
  let selectedPaymentMethod = 'UPI (Instant)';
  document.querySelectorAll('#dash-payment-methods .payment-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#dash-payment-methods .payment-pill-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedPaymentMethod = btn.dataset.method || 'UPI (Instant)';
    });
  });

  // Slot buttons selection
  document.querySelectorAll('#dash-booking-slots-grid .slot-btn').forEach(slotBtn => {
    slotBtn.addEventListener('click', () => {
      if (slotBtn.disabled || slotBtn.classList.contains('booked')) return;
      document.querySelectorAll('#dash-booking-slots-grid .slot-btn').forEach(s => s.classList.remove('selected'));
      slotBtn.classList.add('selected');
    });
  });

  // Function to refresh slot availability for selected turf & date
  function refreshDashSlotAvailability() {
    if (!turfSelect || !dateInput) return;
    const curTurfId = turfSelect.value;
    const curDate = dateInput.value;
    const allBookings = window.TurfifyStore.getBookings() || [];

    const bookedSlots = allBookings
      .filter(b => 
        String(b.turf_id) === String(curTurfId) &&
        b.date === curDate &&
        b.status !== 'Cancelled'
      )
      .map(b => (b.time_slot || '').trim());

    const slotButtons = document.querySelectorAll('#dash-booking-slots-grid .slot-btn');
    let hasSelected = false;

    slotButtons.forEach(btn => {
      const slotLabel = (btn.dataset.slot || '').trim();
      btn.classList.remove('booked');
      btn.disabled = false;

      if (slotLabel && bookedSlots.includes(slotLabel)) {
        btn.classList.add('booked');
        btn.disabled = true;
        btn.classList.remove('selected');
      } else if (!hasSelected && !btn.disabled) {
        if (btn.classList.contains('selected')) {
          hasSelected = true;
        }
      }
    });

    // If previously selected slot is now booked, select first available slot
    if (!document.querySelector('#dash-booking-slots-grid .slot-btn.selected:not([disabled])')) {
      const firstAvailable = document.querySelector('#dash-booking-slots-grid .slot-btn:not([disabled])');
      if (firstAvailable) {
        firstAvailable.classList.add('selected');
      }
    }
  }

  // Update preview card and pricing when turf is changed
  function updateSelectedTurfDetails() {
    const turfs = window.TurfifyStore.getTurfs() || [];
    const turf = turfs.find(t => String(t.id) === String(turfSelect.value)) || turfs[0];
    if (!turf) return;

    const imgEl = document.getElementById('dash-turf-preview-img');
    const nameEl = document.getElementById('dash-turf-preview-name');
    const metaEl = document.getElementById('dash-turf-preview-meta');
    const rateEl = document.getElementById('dash-turf-preview-rate');
    const baseRateEl = document.getElementById('dash-modal-base-rate');
    const totalRateEl = document.getElementById('dash-modal-total-rate');

    if (imgEl) imgEl.src = turf.image || 'images/turf-arena.jpg';
    if (nameEl) nameEl.textContent = turf.name;
    if (metaEl) metaEl.textContent = `${turf.sport} • ${turf.location}`;
    if (rateEl) rateEl.textContent = `₹${turf.price_per_hour}`;
    if (baseRateEl) baseRateEl.textContent = `₹${turf.price_per_hour}`;
    if (totalRateEl) totalRateEl.textContent = `₹${turf.price_per_hour}`;

    refreshDashSlotAvailability();
  }

  turfSelect?.addEventListener('change', updateSelectedTurfDetails);
  dateInput?.addEventListener('change', refreshDashSlotAvailability);

  // Global trigger to open in-dashboard booking modal
  window.openDashBookingModal = function(turfId) {
    const turfs = window.TurfifyStore.getTurfs() || [];
    if (!turfs.length) {
      showToast('No turfs available for booking yet.');
      return;
    }

    // Populate turf dropdown
    if (turfSelect) {
      turfSelect.innerHTML = '';
      turfs.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = `${t.name} (${t.sport} — ₹${t.price_per_hour}/hr — ${t.location})`;
        turfSelect.appendChild(opt);
      });

      if (turfId) {
        turfSelect.value = turfId;
      } else {
        turfSelect.value = turfs[0].id;
      }
    }

    // Set today's date (or tomorrow if past 10 PM)
    if (dateInput) {
      const now = new Date();
      if (now.getHours() >= 22) {
        now.setDate(now.getDate() + 1);
      }
      const yyyyMmDd = now.toISOString().split('T')[0];
      dateInput.value = yyyyMmDd;
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Pre-fill user contact info
    const cur = window.TurfifyStore.getCurrentUser();
    if (nameInput) nameInput.value = cur?.name || '';
    if (phoneInput) phoneInput.value = (cur?.phone && cur?.phone !== '—') ? cur.phone : '+91 ';

    updateSelectedTurfDetails();
    modalDashBooking?.classList.add('active');
  };

  // Confirm booking inside dashboard
  btnConfirmDash?.addEventListener('click', () => {
    const selectedSlotBtn = document.querySelector('#dash-booking-slots-grid .slot-btn.selected:not([disabled])');
    if (!selectedSlotBtn) {
      showToast('⚠️ Please select an available match slot.');
      return;
    }

    const turfs = window.TurfifyStore.getTurfs() || [];
    const turf = turfs.find(t => String(t.id) === String(turfSelect.value)) || turfs[0];
    const slot = selectedSlotBtn.dataset.slot;
    const date = dateInput.value || new Date().toISOString().split('T')[0];
    const playerName = nameInput.value.trim() || 'Player Guest';
    const playerPhone = phoneInput.value.trim() || '+91 98765 43210';
    const cur = window.TurfifyStore.getCurrentUser();

    // Create booking via store
    const newBooking = window.TurfifyStore.createBooking({
      turf_id: turf.id,
      turf_name: turf.name,
      sport: turf.sport,
      date: date,
      time_slot: slot,
      amount: turf.price_per_hour,
      player_id: cur?.id || ('player-' + Date.now()),
      player_name: playerName,
      player_phone: playerPhone,
      player_email: cur?.email || '',
      status: 'Confirmed',
      payment_status: 'Paid Online',
      payment_method: selectedPaymentMethod
    });

    // Close modal
    modalDashBooking?.classList.remove('active');

    // Show celebratory toast
    showToast(`🎉 Match booked at ${turf.name} for ${date} (${slot})! Check your upcoming games below.`);

    // Re-render dashboard
    renderPlayerDashboard();
  });

  // Initial Boot
  const curUser = window.TurfifyStore.getCurrentUser();
  applyRole(curUser.role || 'player');

  // Re-render on any data change (new bookings, cancellations, server sync, cross-tab storage)
  window.addEventListener('turfify:booking_created', () => { const u = window.TurfifyStore.getCurrentUser(); applyRole(u.role || 'player'); });
  window.addEventListener('turfify:booking_cancelled', () => { const u = window.TurfifyStore.getCurrentUser(); applyRole(u.role || 'player'); });
  window.addEventListener('turfify:data_synced', () => { const u = window.TurfifyStore.getCurrentUser(); applyRole(u.role || 'player'); });
  window.addEventListener('storage', () => { const u = window.TurfifyStore.getCurrentUser(); applyRole(u.role || 'player'); });
});
