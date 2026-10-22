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
  // 4. Booking & Slot Selection
  // --------------------------------------------------------------------------
  let activeTurfName = 'The Arena Sports';
  let activeTurfRate = 1200;

  document.querySelectorAll('.btn-card-book').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.turf || 'The Arena Sports';
      const rate = btn.dataset.rate || '1200';
      const loc = btn.dataset.loc || 'Bangalore';

      activeTurfName = name;
      activeTurfRate = parseInt(rate, 10);
      document.getElementById('booking-modal-title').textContent = `Book Slot — ${name}`;
      document.getElementById('booking-modal-sub').textContent = `${loc}, Bangalore`;
      document.getElementById('modal-base-rate').textContent = `₹${rate}`;
      document.getElementById('modal-total-rate').textContent = `₹${rate}`;

      openModal(modalBooking);
    });
  });

  document.querySelectorAll('.slot-btn:not(.booked)').forEach(slot => {
    slot.addEventListener('click', () => {
      document.querySelectorAll('.slot-btn').forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });

  document.getElementById('btn-confirm-slot')?.addEventListener('click', () => {
    const slot = document.querySelector('.slot-btn.selected')?.dataset.slot || '06:00 - 07:00 PM';
    const date = document.getElementById('booking-date').value || '2026-09-10';
    
    if (window.TurfifyStore) {
      window.TurfifyStore.createBooking({
        turf_id: 'turf-1',
        turf_name: activeTurfName,
        sport: 'Football',
        player_id: 'player-1',
        player_name: 'Rahul Sharma',
        player_phone: '+91 98765 43210',
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
  // 5. Favorite Heart Button
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // 6. Search & Sport Filters
  // --------------------------------------------------------------------------
  const cards = document.querySelectorAll('.turf-listing-card');

  function filterVenues(sport, location) {
    let matches = 0;
    cards.forEach(card => {
      const cSport = card.dataset.sport;
      const cLoc = card.dataset.location;

      const matchSport = (sport === 'all' || !sport || cSport === sport);
      const matchLoc = (location === 'all' || !location || cLoc === location);

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
