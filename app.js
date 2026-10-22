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

  // Owner registration triggers
  [
    document.getElementById('btn-hero-owner'),
    document.getElementById('btn-owner-orange-cta'),
    document.querySelector('a[href="#owner-box"]')
  ].forEach(btn => {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modalOwner);
    });
  });

  document.getElementById('owner-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal(modalOwner);
    showToast('Facility submitted! Our verification team will reach out within 2 hours.');
  });

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

  // Theme toggle
  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    showToast('Switched to Daylight mode.');
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
    if (!turfs || turfs.length === 0) return;

    container.innerHTML = turfs.map(t => {
      const sportLower = (t.sport || 'football').toLowerCase();
      let sportKey = 'football';
      if (sportLower.includes('cricket')) sportKey = 'cricket';
      else if (sportLower.includes('badminton')) sportKey = 'badminton';

      const locKey = (t.location || 'bangalore').toLowerCase();
      const amenities = t.amenities && t.amenities.length ? t.amenities.slice(0, 3) : ['Indoor', 'Parking', 'Washroom'];

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
              <span>${t.location || 'Bangalore'}</span>
            </div>
            <div class="amenities-badges-row">
              ${amenities.map(a => `<span class="amenity-chip">✓ ${a}</span>`).join('')}
            </div>
            <div class="turf-card-actions-row">
              <div class="price-line">₹${t.price_per_hour} <span class="price-unit">/hr</span></div>
              <div class="action-btns-group">
                <button class="btn-card-book" data-turfid="${t.id}" data-turf="${t.name}" data-rate="${t.price_per_hour}" data-loc="${t.location || 'Bangalore'}" data-sport="${t.sport || 'Football'}">Book Now</button>
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
        const loc = btn.dataset.loc || 'Bangalore';
        const sport = btn.dataset.sport || 'Football';

        activeTurfId = id;
        activeTurfName = name;
        activeTurfRate = parseInt(rate, 10);
        activeTurfSport = sport;

        document.getElementById('booking-modal-title').textContent = `Book Slot — ${name}`;
        document.getElementById('booking-modal-sub').textContent = `${loc}, Bangalore`;
        document.getElementById('modal-base-rate').textContent = `₹${rate}`;
        document.getElementById('modal-total-rate').textContent = `₹${rate}`;

        openModal(modalBooking);
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

  // Initial render of all turfs from store
  renderMarketplaceTurfs();

  document.querySelectorAll('.slot-btn:not(.booked)').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.slot-btn').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });

  document.getElementById('btn-confirm-slot')?.addEventListener('click', () => {
    const slot = document.querySelector('.slot-btn.selected')?.dataset.slot || '06:00 - 07:00 PM';
    const date = document.getElementById('booking-date').value || new Date().toISOString().split('T')[0];
    
    if (window.TurfifyStore) {
      const curUser = window.TurfifyStore.getCurrentUser() || {};
      window.TurfifyStore.createBooking({
        turf_id: activeTurfId,
        turf_name: activeTurfName,
        sport: activeTurfSport,
        player_id: curUser.id || 'player-' + Date.now(),
        player_name: curUser.name || 'Player Guest',
        player_phone: curUser.phone || '+91 98765 43210',
        date: date,
        time_slot: slot,
        amount: activeTurfRate,
        status: 'Confirmed',
        payment_status: 'Paid Online'
      });
    }

    closeModal(modalBooking);
    showToast(`Slot reserved at ${activeTurfName} for ${date} (${slot})! View in Dashboard.`);
  });

  // --------------------------------------------------------------------------
  // 5. Search & Sport Filters
  // --------------------------------------------------------------------------
  function filterVenues(sport, location) {
    const cards = document.querySelectorAll('.turf-listing-card');
    let matches = 0;
    cards.forEach(card => {
      const cSport = (card.dataset.sport || '').toLowerCase();
      const cLoc = (card.dataset.location || '').toLowerCase();

      const matchSport = (sport === 'all' || !sport || cSport.includes(sport.toLowerCase()));
      const matchLoc = (location === 'all' || !location || cLoc.includes(location.toLowerCase()));

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
    showToast('Browsing more verified turfs in Bangalore.');
  });
});
