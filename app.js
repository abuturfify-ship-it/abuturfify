/**
 * TURFIFY — INTERACTIVE JAVASCRIPT
 * Matching 1:1 design interactions: search filtering, sport tabs, modals, and toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Header scroll and active state
  // --------------------------------------------------------------------------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 20px -2px rgba(15, 23, 42, 0.06)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  // --------------------------------------------------------------------------
  // 2. Toast system
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary-green);">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // --------------------------------------------------------------------------
  // 3. Modals Management
  // --------------------------------------------------------------------------
  const modalBooking = document.getElementById('modal-booking');
  const modalOwner = document.getElementById('modal-owner');
  const modalAuth = document.getElementById('modal-auth');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Close handlers
  document.getElementById('btn-close-booking')?.addEventListener('click', () => closeModal(modalBooking));
  document.getElementById('btn-close-owner')?.addEventListener('click', () => closeModal(modalOwner));
  document.getElementById('btn-close-auth')?.addEventListener('click', () => closeModal(modalAuth));

  [modalBooking, modalOwner, modalAuth].forEach(m => {
    m?.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m);
    });
  });

  // Owner registration triggers — redirect to login page
  [
    document.getElementById('btn-hero-owner'),
    document.getElementById('btn-owner-orange-cta'),
    document.querySelector('a[href="#owner-box"]')
  ].forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'auth.html?role=owner';
    });
  });

  document.getElementById('owner-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const ownerName = document.getElementById('owner-contact-name')?.value?.trim() || 'Venue Owner';
    const facilityName = document.getElementById('owner-facility-name')?.value?.trim() || 'New Sports Hub';
    const location = document.getElementById('owner-facility-loc')?.value?.trim() || 'Bengaluru';
    const phone = document.getElementById('owner-facility-phone')?.value?.trim() || '—';
    const ownerId = 'owner-' + Date.now();

    if (window.TurfifyStore) {
      // 1. Add owner user account
      window.TurfifyStore.addUser({
        id: ownerId,
        name: ownerName,
        phone: phone,
        role: 'owner',
        business_name: facilityName,
        status: 'Active',
        created_at: new Date().toISOString()
      });

      // 2. Add facility turf
      window.TurfifyStore.addTurf({
        owner_id: ownerId,
        owner_name: ownerName,
        owner_phone: phone,
        name: facilityName,
        sport: 'Football',
        location: location,
        price_per_hour: 1200
      });
    }

    closeModal(modalOwner);
    showToast(`🎉 "${facilityName}" & owner profile registered! Now live in Admin Console.`);
    document.getElementById('owner-form')?.reset();
  });

  // Update Navbar Auth display if user is logged in
  function updateNavbarAuth() {
    const curUser = window.TurfifyStore ? window.TurfifyStore.getCurrentUser() : null;
    const centerDashLink = document.querySelector('a[href="dashboard.html"]') || document.getElementById('nav-dashboard-link');

    if (curUser && curUser.name && curUser.is_authenticated) {
      const isOwner = (curUser.role || '').toLowerCase() === 'owner';
      const targetDashboard = isOwner ? 'owner-dashboard.html' : 'player-dashboard.html';

      // Update center Dashboard link
      if (centerDashLink) {
        centerDashLink.href = targetDashboard;
        centerDashLink.textContent = isOwner ? 'Owner Dashboard' : 'Player Dashboard';
      }

      // Replace Login & Register with User Profile button & Logout
      const btnLogin = document.getElementById('btn-open-login');
      const btnReg = document.getElementById('btn-open-register');
      if (btnLogin) {
        btnLogin.textContent = `👤 ${curUser.name}`;
        btnLogin.title = `Go to Dashboard (${curUser.role})`;
        btnLogin.onclick = (e) => {
          e.preventDefault();
          window.location.href = targetDashboard;
        };
      }
      if (btnReg) {
        btnReg.textContent = 'Logout';
        btnReg.style.background = '#64748B';
        btnReg.onclick = (e) => {
          e.preventDefault();
          localStorage.removeItem('turfify_current_user');
          window.location.reload();
        };
      }
    } else {
      // Unauthenticated visitor guard on Dashboard link
      if (centerDashLink) {
        centerDashLink.onclick = (e) => {
          e.preventDefault();
          window.location.href = 'auth.html?mode=signin&redirect=dashboard';
        };
      }
    }
  }

  updateNavbarAuth();

  // Auth triggers - Redirect to Supabase Auth Page
  document.getElementById('btn-open-login')?.addEventListener('click', () => {
    window.location.href = 'auth.html?mode=signin';
  });

  document.getElementById('btn-open-register')?.addEventListener('click', () => {
    window.location.href = 'auth.html?mode=signup';
  });

  document.getElementById('btn-bottom-cta')?.addEventListener('click', () => {
    window.location.href = 'auth.html?mode=signup';
  });

  document.getElementById('auth-submit-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedRole = document.querySelector('input[name="auth-role"]:checked')?.value || 'player';
    if (window.TurfifyStore) {
      window.TurfifyStore.switchRole(selectedRole);
    }
    closeModal(modalAuth);
    const targetPage = selectedRole === 'owner' ? 'owner-dashboard.html' : 'player-dashboard.html';
    const roleName = selectedRole === 'owner' ? 'Turf Owner Partner Console' : 'Player Hub';
    showToast(`Logged in successfully! Loading ${roleName}...`);
    setTimeout(() => {
      window.location.href = targetPage;
    }, 700);
  });

  // Theme toggle (Daylight / Dark Mode)
  const savedTheme = localStorage.getItem('turfify_theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('turfify_theme', isDark ? 'dark' : 'light');
    showToast(isDark ? '🌙 Switched to Dark Theme.' : '☀️ Switched to Daylight Theme.');
  });

  // Contact Us Form Handler
  document.getElementById('contact-us-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value || 'Guest';
    const phone = document.getElementById('contact-phone')?.value || '';
    const email = document.getElementById('contact-email')?.value || '';
    showToast(`🎉 Thank you ${name}! Your message has been received. Our Tamil Nadu team will contact you at ${phone || email} shortly.`);
    document.getElementById('contact-us-form')?.reset();
  });

  // --------------------------------------------------------------------------
  // 4. Dynamic Turfs Rendering & Booking
  // --------------------------------------------------------------------------
  let activeTurfId = 'turf-1';
  let activeTurfName = 'The Arena Sports Hub';
  let activeTurfRate = 1200;
  let activeTurfSport = 'Football';

  function renderMarketplaceTurfs() {
    const container = document.getElementById('turfs-container');
    if (!container || !window.TurfifyStore) return;

    const turfs = window.TurfifyStore.getTurfs();

    if (!turfs || turfs.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:64px 24px;">
          <div style="font-size:3rem;margin-bottom:16px;">🏟️</div>
          <h3 style="color:#e8eaf6;font-size:1.4rem;margin-bottom:8px;">No Turfs Listed Yet</h3>
          <p style="color:#9fa8da;margin-bottom:24px;">Be the first to register your turf and start earning!</p>
          <button onclick="document.getElementById('btn-hero-owner').click()" style="background:linear-gradient(135deg,#7c4dff,#ff6d00);color:#fff;border:none;padding:12px 28px;border-radius:10px;font-size:1rem;cursor:pointer;">
            List Your Turf 🚀
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = turfs.map(t => {
      const sportLower = (t.sport || 'football').toLowerCase();
      let sportKey = 'football';
      if (sportLower.includes('cricket')) sportKey = 'cricket';
      else if (sportLower.includes('badminton')) sportKey = 'badminton';

      const locKey = (t.location || 'chennai').toLowerCase();
      const amenities = Array.isArray(t.amenities) ? t.amenities : [];

      return `
        <div class="turf-listing-card" data-sport="${sportKey}" data-location="${locKey}" data-name="${t.name}" data-rate="${t.price_per_hour}">
          <div class="turf-media">
            <img src="${t.image || 'images/turf-arena.jpg'}" alt="${t.name}">
            <div class="rating-pill-green">★ ${t.rating || 4.9}</div>
          </div>
          <div class="turf-details-body">
            <h3 class="turf-card-title">${t.name}</h3>
            <div class="turf-card-loc">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${t.location || 'Chennai, Tamil Nadu'}</span>
            </div>
            ${amenities.length ? `
              <div class="amenities-badges-row">
                ${amenities.map(a => `<span class="amenity-chip">✓ ${a}</span>`).join('')}
              </div>
            ` : ''}
            <div class="turf-card-actions-row">
              <div class="price-line">₹${t.price_per_hour} <span class="price-unit">/hr</span></div>
              <div class="action-btns-group">
                <button class="btn-card-book" data-turfid="${t.id}" data-turf="${t.name}" data-rate="${t.price_per_hour}" data-loc="${t.location || 'Chennai, Tamil Nadu'}" data-sport="${t.sport || 'Football'}">Book Now</button>
                <button class="btn-card-heart" aria-label="Favorite">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    bindTurfCardEvents();
  }

  function bindTurfCardEvents() {
    document.querySelectorAll('.btn-card-book').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.turfid || 'turf-1';
        const name = btn.dataset.turf || 'The Arena Sports Hub';
        const rate = btn.dataset.rate || '1200';
        const loc = btn.dataset.loc || 'Chennai, Tamil Nadu';
        const sport = btn.dataset.sport || 'Football';

        // Check if user is logged in
        const curUser = window.TurfifyStore ? window.TurfifyStore.getCurrentUser() : null;
        const isAuthenticated = !!(curUser && curUser.is_authenticated === true);

        if (!isAuthenticated) {
          // Save pending booking so player can resume immediately after signing in
          sessionStorage.setItem('turfify_pending_booking', JSON.stringify({
            id, name, rate, loc, sport
          }));
          window.location.href = `auth.html?mode=signin&redirect=booking&turf=${encodeURIComponent(name)}&turfId=${encodeURIComponent(id)}`;
          return;
        }

        activeTurfId = id;
        activeTurfName = name;
        activeTurfRate = parseInt(rate, 10);
        activeTurfSport = sport;

        document.getElementById('booking-modal-title').textContent = `Book Slot — ${name}`;
        document.getElementById('booking-modal-sub').textContent = loc;
        document.getElementById('modal-base-rate').textContent = `₹${rate}`;
        document.getElementById('modal-total-rate').textContent = `₹${rate}`;

        // Set today's date as default if not already set
        const dateInput = document.getElementById('booking-date');
        if (!dateInput.value) {
          dateInput.value = new Date().toISOString().split('T')[0];
        }

        // Prefill player contact details from authenticated user
        const nameInput = document.getElementById('booking-player-name');
        const phoneInput = document.getElementById('booking-player-phone');
        if (nameInput) {
          nameInput.value = (curUser && curUser.name && curUser.name !== 'Player Guest') ? curUser.name : (nameInput.value || '');
        }
        if (phoneInput) {
          phoneInput.value = (curUser && curUser.phone && curUser.phone !== '—') ? curUser.phone : (phoneInput.value || '');
        }

        openModal(modalBooking);
        // Refresh slot colours based on actual bookings
        refreshSlotAvailability();
      });
    });

    document.querySelectorAll('.btn-card-heart').forEach(heart => {
      heart.addEventListener('click', (e) => {
        e.stopPropagation();
        heart.classList.toggle('active');
        if (heart.classList.contains('active')) {
          showToast('Saved to your favorites! ❤️');
        } else {
          showToast('Removed from favorites.');
        }
      });
    });
  }

  // Resume booking if returning after successful login
  function checkPendingBooking() {
    const urlParams = new URLSearchParams(window.location.search);
    const shouldOpen = urlParams.get('openBooking') === 'true';
    const pendingJson = sessionStorage.getItem('turfify_pending_booking');

    const curUser = window.TurfifyStore ? window.TurfifyStore.getCurrentUser() : null;
    const isAuthenticated = !!(curUser && curUser.is_authenticated === true);

    if (isAuthenticated && (shouldOpen || pendingJson)) {
      try {
        const pending = pendingJson ? JSON.parse(pendingJson) : null;
        if (pending && pending.name) {
          sessionStorage.removeItem('turfify_pending_booking');
          activeTurfId = pending.id || 'turf-1';
          activeTurfName = pending.name;
          activeTurfRate = parseInt(pending.rate || '1200', 10);
          activeTurfSport = pending.sport || 'Football';

          const titleEl = document.getElementById('booking-modal-title');
          const subEl = document.getElementById('booking-modal-sub');
          const baseEl = document.getElementById('modal-base-rate');
          const totalEl = document.getElementById('modal-total-rate');
          if (titleEl) titleEl.textContent = `Book Slot — ${pending.name}`;
          if (subEl) subEl.textContent = pending.loc || 'Chennai, Tamil Nadu';
          if (baseEl) baseEl.textContent = `₹${pending.rate || '1200'}`;
          if (totalEl) totalEl.textContent = `₹${pending.rate || '1200'}`;

          const dateInput = document.getElementById('booking-date');
          if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().split('T')[0];
          }
          const nameInput = document.getElementById('booking-player-name');
          const phoneInput = document.getElementById('booking-player-phone');
          if (nameInput) nameInput.value = curUser.name || '';
          if (phoneInput) phoneInput.value = (curUser.phone && curUser.phone !== '—') ? curUser.phone : '';

          openModal(modalBooking);
          refreshSlotAvailability();
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {}
    }
  }

  // Initial render of all turfs from store
  renderMarketplaceTurfs();
  checkPendingBooking();

  // Live sync: re-render marketplace when turf list changes (deletion, new registration, etc.)
  // Poll server every 3 seconds to detect cross-tab deletions
  setInterval(() => {
    if (window.TurfifyStore) {
      window.TurfifyStore.syncWithServer().then(() => {
        renderMarketplaceTurfs();
      }).catch(() => {});
    }
  }, 3000);

  // Also re-render immediately on turf-deleted or data-synced events (same tab)
  window.addEventListener('turfify:turf_deleted', () => renderMarketplaceTurfs());
  window.addEventListener('turfify:data_synced', () => renderMarketplaceTurfs());
  // Re-render when localStorage changes in another tab
  window.addEventListener('storage', (e) => {
    if (e.key === 'turfify_turfs') renderMarketplaceTurfs();
  });

  // --------------------------------------------------------------------------
  // Slot Availability: Mark booked slots as red/disabled for all users
  // --------------------------------------------------------------------------
  function refreshSlotAvailability() {
    if (!window.TurfifyStore) return;

    const date = document.getElementById('booking-date')?.value || new Date().toISOString().split('T')[0];
    const allBookings = window.TurfifyStore.getBookings();

    // Get time slots booked for this turf on this date (only confirmed, not cancelled)
    const bookedSlots = allBookings
      .filter(b =>
        b.turf_id === activeTurfId &&
        b.date === date &&
        b.status !== 'Cancelled'
      )
      .map(b => b.time_slot ? b.time_slot.trim() : '');

    document.querySelectorAll('.slot-btn').forEach(btn => {
      const slotLabel = btn.dataset.slot ? btn.dataset.slot.trim() : '';

      // Reset state first
      btn.classList.remove('booked', 'selected');
      btn.disabled = false;

      if (slotLabel && bookedSlots.includes(slotLabel)) {
        // Mark as booked — red & disabled
        btn.classList.add('booked');
        btn.disabled = true;
      } else if (slotLabel) {
        // Re-bind click for available slots
        btn.onclick = () => {
          document.querySelectorAll('.slot-btn').forEach(s => s.classList.remove('selected'));
          btn.classList.add('selected');
        };
      }
    });
  }

  // Refresh slots when date changes
  document.getElementById('booking-date')?.addEventListener('change', refreshSlotAvailability);

  document.getElementById('btn-confirm-slot')?.addEventListener('click', () => {
    const selectedBtn = document.querySelector('.slot-btn.selected');
    if (!selectedBtn) {
      showToast('⚠️ Please select an available slot first.');
      return;
    }
    const slot = selectedBtn.dataset.slot;
    const date = document.getElementById('booking-date').value || new Date().toISOString().split('T')[0];
    
    const curUser = (window.TurfifyStore && window.TurfifyStore.getCurrentUser()) || {};
    const inputName = document.getElementById('booking-player-name')?.value.trim();
    const inputPhone = document.getElementById('booking-player-phone')?.value.trim();
    const finalPlayerName = inputName || curUser.name || 'Player Guest';
    const finalPlayerPhone = inputPhone || curUser.phone || '+91 98765 43210';

    if (window.TurfifyStore) {
      if (!curUser.is_authenticated) {
        curUser.name = finalPlayerName;
        curUser.phone = finalPlayerPhone;
        window.TurfifyStore.setCurrentUser(curUser);
      }

      window.TurfifyStore.createBooking({
        turf_id: activeTurfId,
        turf_name: activeTurfName,
        sport: activeTurfSport,
        player_id: curUser.id || ('player-' + Date.now()),
        player_name: finalPlayerName,
        player_phone: finalPlayerPhone,
        player_email: curUser.email || '',
        date: date,
        time_slot: slot,
        amount: activeTurfRate,
        status: 'Confirmed',
        payment_status: 'Paid Online'
      });
    }

    closeModal(modalBooking);
    showToast(`Slot reserved at ${activeTurfName} for ${date} (${slot}) under ${finalPlayerName}! View in Dashboard.`);
  });

  // --------------------------------------------------------------------------
  // 5. Search & Sport Filters
  // --------------------------------------------------------------------------
  function filterVenues(sport, location) {
    const cards = document.querySelectorAll('.turf-listing-card');
    let matches = 0;

    // City-to-area mapping: "chennai" dropdown also matches Pallavaram, Tambaram, etc.
    const CITY_AREA_MAP = {
      chennai: ['pallavaram', 'tambaram', 'velachery', 'anna nagar', 'adyar', 'porur', 'perambur', 'sholinganallur', 'chrompet', 'chromepet', 'guduvanchery', 't.nagar', 'tnagar', 'chennai', 'west mambalam', 'mylapore', 'nungambakkam', 'kilpauk', 'kodambakkam'],
      coimbatore: ['coimbatore', 'rs puram', 'gandhipuram', 'saibaba colony', 'peelamedu'],
      madurai: ['madurai', 'anna nagar madurai', 'koodal nagar'],
      trichy: ['trichy', 'tiruchirappalli', 'srirangam', 'ariyamangalam'],
      salem: ['salem', 'junction main road'],
      tirunelveli: ['tirunelveli', 'palayamkottai'],
      vellore: ['vellore', 'katpadi'],
      erode: ['erode', 'perundurai']
    };

    cards.forEach(card => {
      const cSport = (card.dataset.sport || '').toLowerCase();
      const cLoc = (card.dataset.location || '').toLowerCase();

      const matchSport = (sport === 'all' || !sport || cSport.includes(sport.toLowerCase()));

      let matchLoc;
      if (location === 'all' || !location) {
        matchLoc = true;
      } else {
        const areas = CITY_AREA_MAP[location.toLowerCase()] || [location.toLowerCase()];
        matchLoc = areas.some(area => cLoc.includes(area));
      }

      if (matchSport && matchLoc) {
        card.style.display = 'flex';
        matches++;
      } else {
        card.style.display = 'none';
      }
    });

    if (matches === 0) {
      showToast('No exact match found. Displaying all premier venues.');
      cards.forEach(c => c.style.display = 'flex');
    } else {
      showToast(`Showing ${matches} verified venues matching your selection.`);
    }
  }

  document.getElementById('search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const loc = document.getElementById('select-location').value;
    const sport = document.getElementById('select-sport').value;
    filterVenues(sport, loc);
    document.getElementById('popular-turfs')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.querySelectorAll('.sport-pill-card').forEach(pill => {
    pill.addEventListener('click', () => {
      const sport = pill.dataset.sport;
      document.getElementById('select-sport').value = sport;
      filterVenues(sport, 'all');
      document.getElementById('popular-turfs')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Carousel arrow feedback
  document.getElementById('btn-next-turfs')?.addEventListener('click', () => {
    showToast('Browsing more verified turfs in Tamil Nadu.');
  });
});
