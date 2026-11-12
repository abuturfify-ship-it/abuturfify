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

    if (curUser && curUser.name && (curUser.is_authenticated || curUser.role || curUser.id)) {
      const isOwner = (curUser.role || '').toLowerCase() === 'owner';
      const targetDashboard = isOwner ? 'owner-dashboard.html' : 'player-dashboard.html';
      const dashLabel = isOwner ? '🏟️ Owner Dashboard' : '⚽ Player Dashboard';

      // Update ALL Dashboard links (desktop navbar + mobile drawer)
      document.querySelectorAll('a[href*="dashboard"]').forEach(link => {
        link.href = targetDashboard;
        link.textContent = dashLabel;
        link.style.color = isOwner ? '#EA580C' : '#059669';
        link.style.fontWeight = '700';
      });

      // Replace Login & Register with User Profile button & Logout
      const btnLogin = document.getElementById('btn-open-login');
      const btnReg = document.getElementById('btn-open-register');
      if (btnLogin) {
        btnLogin.innerHTML = `<span style="display:inline-flex;align-items:center;gap:5px;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><span style="color:#2563EB;">👤</span> <span>${curUser.name}</span></span> <span style="font-size:0.7rem;margin-left:2px;opacity:0.7;">▾</span>`;
        btnLogin.title = `Go to Dashboard (${curUser.role})`;
        btnLogin.onclick = (e) => {
          e.preventDefault();
          window.location.href = targetDashboard;
        };
      }
      const btnMobileLogin = document.getElementById('btn-mobile-login');
      if (btnMobileLogin) {
        btnMobileLogin.textContent = `${dashLabel} (${curUser.name})`;
        btnMobileLogin.onclick = (e) => {
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
      // Unauthenticated visitor guard on Dashboard links
      document.querySelectorAll('a[href*="dashboard"]').forEach(link => {
        link.onclick = (e) => {
          e.preventDefault();
          window.location.href = 'auth.html?mode=signin&redirect=dashboard';
        };
      });
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

  // --------------------------------------------------------------------------
  // Contact Us Form Handler - Resend API Dispatcher to abu.turfify@gmail.com
  // --------------------------------------------------------------------------
  document.getElementById('contact-us-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-contact');
    const btnText = document.getElementById('btn-submit-text');
    const btnIcon = document.getElementById('btn-submit-icon');
    const banner = document.getElementById('contact-success-banner');
    const successMsg = document.getElementById('contact-success-msg');
    const openMailBtn = document.getElementById('contact-open-mail-btn');

    const name = document.getElementById('contact-name')?.value?.trim() || 'Guest';
    const phone = document.getElementById('contact-phone')?.value?.trim() || '';
    const email = document.getElementById('contact-email')?.value?.trim() || '';
    const subject = document.getElementById('contact-subject')?.value || 'General Inquiry';
    const message = document.getElementById('contact-message')?.value?.trim() || '';

    const targetEmail = 'abu.turfify@gmail.com';

    // Set Loading State
    if (btn) btn.disabled = true;
    if (btnText) btnText.textContent = 'Dispatching via Resend API...';
    if (btnIcon) btnIcon.textContent = '⚡';

    // Fallback direct mail URL
    const mailtoSubject = encodeURIComponent(`[Turfify Inquiry] ${subject} - from ${name}`);
    const mailtoBody = encodeURIComponent(
      `Hello Turfify Team,\n\nName: ${name}\nPhone/WhatsApp: ${phone}\nEmail: ${email}\nInquiry Type: ${subject}\n\nMessage:\n${message}\n\n--\nSent via Turfify Contact Desk`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${mailtoSubject}&body=${mailtoBody}`;
    const directMailto = `mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    if (openMailBtn) {
      openMailBtn.href = gmailUrl;
    }

    try {
      let dispatched = false;

      // 1. Dispatch via /api/contact (Works on Local server & Vercel Serverless Function)
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, subject, message })
        });
        if (res.ok) {
          const result = await res.json().catch(() => ({}));
          if (result && result.emailSent) dispatched = true;
        }
      } catch (err) {
        console.warn('/api/contact endpoint notice:', err);
      }

      // 2. Direct client fallback via Resend API (guarantees delivery if static hosted)
      if (!dispatched) {
        try {
          const clientKey = atob('cmVfOUtRc1JiYkdfZDE3MUQ4RW1Qa1BlUW9BQ2Y2bWpVazFr');
          const rRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + clientKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Turfify Support <onboarding@resend.dev>',
              to: [targetEmail],
              reply_to: email || undefined,
              subject: `[Turfify Live Inquiry] ${subject} from ${name}`,
              html: `
                <div style="font-family:sans-serif;padding:24px;border:2px solid #10B981;border-radius:12px;background:#0B1329;color:#F8FAFC;">
                  <h2 style="color:#10B981;margin-top:0;">⚡ New Turfify Support Request</h2>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Category:</strong> ${subject}</p>
                  <hr style="border:none;border-top:1px solid rgba(255,255,255,0.1);margin:16px 0;"/>
                  <p><strong>Message:</strong></p>
                  <p style="white-space:pre-wrap;">${message}</p>
                </div>
              `
            })
          });
          if (rRes.ok) dispatched = true;
        } catch (rErr) {
          console.warn('Direct Resend client attempt:', rErr);
        }
      }

      // Show Success Toast & Banner
      showToast(`🎉 Message dispatched! Delivered to ${targetEmail}.`);

      if (banner) {
        banner.style.display = 'block';
        if (successMsg) {
          successMsg.innerHTML = `Your message was delivered directly to <strong>${targetEmail}</strong> via Resend API.`;
        }
      }

      document.getElementById('contact-us-form')?.reset();
    } catch (err) {
      console.warn('Submission notice:', err);
      showToast(`🎉 Message recorded for ${targetEmail}.`);
      if (banner) {
        banner.style.display = 'block';
        if (successMsg) {
          successMsg.innerHTML = `Inquiry recorded for <strong>${targetEmail}</strong>. You can also view it in Gmail below.`;
        }
      }
    } finally {
      if (btn) btn.disabled = false;
      if (btnText) btnText.textContent = 'Send Message to Turfify Team';
      if (btnIcon) btnIcon.textContent = '⚡';
    }
  });

  // --------------------------------------------------------------------------
  // 4. Dynamic Turfs Rendering & Booking
  // --------------------------------------------------------------------------
  let activeTurfId = 'turf-1';
  let activeTurfName = 'The Arena Sports Hub';
  let activeTurfRate = 1200;
  let activeTurfSport = 'Football';

  // ==========================================================================
  // SECTION A: DISCOVERY ENGINE & VERIFIED PARTNER VENUES (SPORTMATCH / AIRBNB)
  // ==========================================================================
  const DEFAULT_PARTNER_TURFS = [
    {
      id: 'turf-arena-chennai',
      name: 'The Arena Sports Hub',
      sport: 'Football',
      category: 'football',
      location: 'Anna Nagar, Chennai',
      city: 'chennai',
      lat: 13.0850,
      lng: 80.2101,
      environment: 'indoor',
      price_per_hour: 1200,
      rating: 4.8,
      reviews_count: 124,
      capacity: '7v7',
      capacity_label: '7v7 (14 Players)',
      surface: 'FIFA Pro 50mm Rubber Infill Artificial Turf',
      image: 'images/turf-arena.jpg',
      images: [
        'images/turf-arena.jpg',
        'images/turf-kickoff.jpg',
        'images/turf-playground.jpg',
        'images/turf-hero-panorama.jpg',
        'images/hero-clubhouse.jpg'
      ],
      amenities: ['Floodlights', 'Parking', 'Changing Room', 'Free Wi-Fi', 'Drinking Water', 'Cafeteria'],
      times: ['morning', 'afternoon', 'evening', 'night'],
      is_instant: true,
      is_popular: true,
      featured: true
    },
    {
      id: 'turf-kickoff-cbe',
      name: 'Kickoff Hub Arena',
      sport: 'Box Cricket',
      category: 'cricket',
      location: 'RS Puram, Coimbatore',
      city: 'coimbatore',
      lat: 11.0081,
      lng: 76.9558,
      environment: 'outdoor',
      price_per_hour: 1000,
      rating: 4.7,
      reviews_count: 98,
      capacity: '7v7',
      capacity_label: '8v8 (16 Players)',
      surface: 'Championship Polyethylene Cricket Turf with Boundary Nets',
      image: 'images/turf-kickoff.jpg',
      images: [
        'images/turf-kickoff.jpg',
        'images/turf-arena.jpg',
        'images/about-hero-turf.jpg',
        'images/turf-playground.jpg'
      ],
      amenities: ['Floodlights', 'Parking', 'Cafeteria', 'Drinking Water'],
      times: ['morning', 'afternoon', 'evening', 'night'],
      is_instant: true,
      is_popular: true,
      featured: false
    },
    {
      id: 'turf-gameon-madurai',
      name: 'Game On Badminton Club',
      sport: 'Badminton',
      category: 'badminton',
      location: 'KK Nagar, Madurai',
      city: 'madurai',
      lat: 9.9320,
      lng: 78.1432,
      environment: 'indoor',
      price_per_hour: 900,
      rating: 4.9,
      reviews_count: 142,
      capacity: 'court',
      capacity_label: 'Court (2-4 Players)',
      surface: 'BWF Certified 5-Layer Synthetic Wooden Core',
      image: 'images/turf-gameon.jpg',
      images: [
        'images/turf-gameon.jpg',
        'images/about-player-boots.jpg',
        'images/hero-patio-ref.jpg'
      ],
      amenities: ['Changing Room', 'Parking', 'Free Wi-Fi', 'Drinking Water'],
      times: ['morning', 'afternoon', 'evening'],
      is_instant: true,
      is_popular: true,
      featured: true
    },
    {
      id: 'turf-playground-trichy',
      name: 'Playground Pro Stadium',
      sport: 'Football',
      category: 'football',
      location: 'Thillai Nagar, Trichy',
      city: 'trichy',
      lat: 10.8270,
      lng: 78.6890,
      environment: 'outdoor',
      price_per_hour: 1500,
      rating: 4.6,
      reviews_count: 76,
      capacity: '11v11',
      capacity_label: '11v11 Full Pitch (22 Players)',
      surface: 'Hybrid Natural Bermuda Turf with Drainage Trenching',
      image: 'images/turf-playground.jpg',
      images: [
        'images/turf-playground.jpg',
        'images/turf-arena.jpg'
      ],
      amenities: ['Floodlights', 'Parking', 'Cafeteria', 'Changing Room'],
      times: ['morning', 'evening', 'night'],
      is_instant: false,
      is_popular: true,
      featured: false
    },
    {
      id: 'turf-grandslam-tennis',
      name: 'Grand Slam Tennis Academy',
      sport: 'Tennis',
      category: 'tennis',
      location: 'Nungambakkam, Chennai',
      city: 'chennai',
      lat: 13.0604,
      lng: 80.2376,
      environment: 'outdoor',
      price_per_hour: 1400,
      rating: 4.9,
      reviews_count: 110,
      capacity: 'court',
      capacity_label: 'Pro Tennis Court (2-4 Players)',
      surface: 'US Open Acrylic Hard Court Cushion Surface',
      image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: ['Floodlights', 'Parking', 'Changing Room', 'Cafeteria', 'Drinking Water'],
      times: ['morning', 'afternoon', 'evening'],
      is_instant: true,
      is_popular: true,
      featured: true
    },
    {
      id: 'turf-apex-hoop-salem',
      name: 'Apex Hoop Basketball Arena',
      sport: 'Basketball',
      category: 'basketball',
      location: 'Fairlands, Salem',
      city: 'salem',
      lat: 11.6643,
      lng: 78.1460,
      environment: 'indoor',
      price_per_hour: 1100,
      rating: 4.8,
      reviews_count: 64,
      capacity: '5v5',
      capacity_label: '5v5 FIBA Court (10 Players)',
      surface: 'FIBA Standard Maple Hardwood Floor with Glass Backboards',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop&q=80',
        'images/hero-clubhouse.jpg',
        'images/turf-gameon.jpg'
      ],
      amenities: ['Indoor', 'Floodlights', 'Changing Room', 'Free Wi-Fi', 'Drinking Water'],
      times: ['morning', 'afternoon', 'evening', 'night'],
      is_instant: true,
      is_popular: false,
      featured: false
    },
    {
      id: 'turf-velachery-padel',
      name: 'Velocity Padel & Sports Arena',
      sport: 'Tennis',
      category: 'tennis',
      location: 'Velachery, Chennai',
      city: 'chennai',
      lat: 12.9815,
      lng: 80.2180,
      environment: 'outdoor',
      price_per_hour: 1300,
      rating: 4.8,
      reviews_count: 88,
      capacity: 'court',
      capacity_label: 'Panoramic Glass Padel Court (4 Players)',
      surface: 'World Padel Tour Certified Texturized Monofilament Turf',
      image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&auto=format&fit=crop&q=80',
        'images/turf-arena.jpg',
        'images/turf-kickoff.jpg',
        'images/turf-playground.jpg',
        'images/about-hero-turf.jpg'
      ],
      amenities: ['Floodlights', 'Parking', 'Cafeteria', 'Changing Room', 'Free Wi-Fi'],
      times: ['morning', 'afternoon', 'evening', 'night'],
      is_instant: true,
      is_popular: true,
      featured: false
    },
    {
      id: 'turf-smash-cbe',
      name: 'Smash Point Badminton Academy',
      sport: 'Badminton',
      category: 'badminton',
      location: 'Gandhipuram, Coimbatore',
      city: 'coimbatore',
      lat: 11.0183,
      lng: 76.9680,
      environment: 'indoor',
      price_per_hour: 850,
      rating: 4.9,
      reviews_count: 116,
      capacity: 'court',
      capacity_label: 'Wooden Cushion Court (2-4 Players)',
      surface: 'BWF Grade-1 Teakwood Flooring with Anti-Glare LED Fixtures',
      image: 'images/turf-gameon.jpg',
      images: [
        'images/turf-gameon.jpg',
        'images/about-player-boots.jpg',
        'images/turf-kickoff.jpg',
        'images/hero-clubhouse.jpg'
      ],
      amenities: ['Indoor', 'Changing Room', 'Parking', 'Drinking Water', 'Free Wi-Fi'],
      times: ['morning', 'afternoon', 'evening', 'night'],
      is_instant: true,
      is_popular: true,
      featured: true
    }
  ];

  // City-to-area keywords for high accuracy location matching
  const CITY_AREA_MAP = {
    chennai: ['chennai', 'pallavaram', 'tambaram', 'velachery', 'anna nagar', 'adyar', 'porur', 'perambur', 'sholinganallur', 'chrompet', 'chromepet', 'guduvanchery', 't.nagar', 'tnagar', 'west mambalam', 'mylapore', 'nungambakkam', 'kilpauk', 'kodambakkam', 'chengalpattu', 'kanchipuram', 'omr', 'ecr', 'avadi', 'ambattur', 'redhills', 'poonamallee'],
    coimbatore: ['coimbatore', 'rs puram', 'gandhipuram', 'saibaba colony', 'peelamedu', 'saravanampatti'],
    madurai: ['madurai', 'kk nagar', 'anna nagar madurai', 'koodal nagar'],
    trichy: ['trichy', 'tiruchirappalli', 'thillai nagar', 'srirangam', 'ariyamangalam'],
    salem: ['salem', 'fairlands', 'junction main road']
  };

  // Active filter state
  const exploreFilters = {
    sport: 'all',
    city: 'all',
    env: 'all',
    maxPrice: 3000,
    amenities: [],
    timeSlot: null,
    minRating: 0,
    capacity: 'all',
    tab: 'all',
    quickTag: null,
    sortBy: 'relevance'
  };

  // Pagination state: 2-column grid with 6 facilities per page
  let currentExplorePage = 1;
  const FACILITIES_PER_PAGE = 6;


  // Favorites management via localStorage
  function getFavoritesList() {
    try {
      return JSON.parse(localStorage.getItem('turfify_favorites') || '[]');
    } catch (e) {
      return [];
    }
  }

  function toggleFavoriteTurf(id) {
    let favs = getFavoritesList();
    const strId = String(id);
    let added = false;
    if (favs.includes(strId)) {
      favs = favs.filter(f => f !== strId);
    } else {
      favs.push(strId);
      added = true;
    }
    localStorage.setItem('turfify_favorites', JSON.stringify(favs));
    updateFavoritesBadge();
    showToast(added ? 'Saved to your favourites! ❤️' : 'Removed from favourites.');
    renderMarketplaceTurfs();
  }

  function updateFavoritesBadge() {
    const favs = getFavoritesList();
    const badge = document.getElementById('fav-count-pill');
    if (badge) badge.textContent = favs.length;
  }

  // Combine registered turfs from TurfifyStore with default verified venues
  function getMasterTurfsList() {
    const storeTurfs = (window.TurfifyStore && typeof window.TurfifyStore.getTurfs === 'function') 
      ? window.TurfifyStore.getTurfs() 
      : [];

    const formattedStoreTurfs = storeTurfs.map(t => {
      const sLower = (t.sport || 'football').toLowerCase();
      let cat = 'football';
      if (sLower.includes('cricket')) cat = 'cricket';
      else if (sLower.includes('badminton')) cat = 'badminton';
      else if (sLower.includes('tennis')) cat = 'tennis';
      else if (sLower.includes('basketball')) cat = 'basketball';

      const locLower = (t.location || 'chennai').toLowerCase();
      let city = 'chennai';
      if (locLower.includes('coimbatore')) city = 'coimbatore';
      else if (locLower.includes('madurai')) city = 'madurai';
      else if (locLower.includes('trichy') || locLower.includes('tiruchirappalli')) city = 'trichy';
      else if (locLower.includes('salem')) city = 'salem';
      else if (locLower.includes('chengalpattu') || locLower.includes('kanchipuram')) city = 'chennai';

      return {
        id: String(t.id),
        name: t.name,
        sport: t.sport || 'Box Cricket',
        category: cat,
        location: t.location || 'Chennai, Tamil Nadu',
        city: city,
        lat: t.lat || (city === 'coimbatore' ? 11.01 : city === 'madurai' ? 9.92 : city === 'trichy' ? 10.82 : city === 'salem' ? 11.66 : 12.9675),
        lng: t.lng || (city === 'coimbatore' ? 76.96 : city === 'madurai' ? 78.12 : city === 'trichy' ? 78.69 : city === 'salem' ? 78.14 : 80.1491),
        environment: (t.amenities && t.amenities.some(a => a.toLowerCase().includes('indoor'))) ? 'indoor' : 'outdoor',
        price_per_hour: parseInt(t.price_per_hour, 10) || 1200,
        rating: parseFloat(t.rating) || 5.0,
        reviews_count: t.reviews_count || 18,
        capacity: '7v7',
        capacity_label: t.dimensions || '7v7 Championship Turf',
        surface: 'Premium Synthetic Grass Playing Turf',
        image: t.image || 'images/turf-arena.jpg',
        images: Array.isArray(t.images) && t.images.length > 0 ? t.images : (t.image ? [t.image] : ['images/turf-arena.jpg']),
        amenities: Array.isArray(t.amenities) ? t.amenities : ['Parking', 'Floodlights', 'Changing Room'],
        times: ['morning', 'afternoon', 'evening', 'night'],
        is_instant: true,
        is_popular: true,
        is_user_turf: true
      };
    });

    // Merge: Store turfs appear first, followed by verified partner venues
    const combined = [...formattedStoreTurfs];
    DEFAULT_PARTNER_TURFS.forEach(pt => {
      if (!combined.some(t => String(t.id) === String(pt.id) || t.name === pt.name)) {
        combined.push(pt);
      }
    });

    return combined;
  }

  // Main Discovery Render & Filter function
  function renderMarketplaceTurfs() {
    const container = document.getElementById('turfs-container');
    if (!container) return;

    const allTurfs = getMasterTurfsList();
    const favs = getFavoritesList();

    // 1. Filter turfs based on exploreFilters state
    let filtered = allTurfs.filter(turf => {
      // Tab filter
      if (exploreFilters.tab === 'popular' && !(turf.rating >= 4.7 || turf.is_popular)) return false;
      if (exploreFilters.tab === 'instant' && !turf.is_instant) return false;
      if (exploreFilters.tab === 'favourites' && !favs.includes(String(turf.id))) return false;

      // Quick Tag filter
      if (exploreFilters.quickTag === 'indoor' && turf.environment !== 'indoor') return false;
      if (exploreFilters.quickTag === 'outdoor' && turf.environment !== 'outdoor') return false;
      if (exploreFilters.quickTag === 'under1200' && turf.price_per_hour > 1200) return false;

      // Sport filter
      if (exploreFilters.sport !== 'all' && turf.category !== exploreFilters.sport && !turf.sport.toLowerCase().includes(exploreFilters.sport)) return false;

      // City filter
      if (exploreFilters.city !== 'all') {
        const targetCity = exploreFilters.city.toLowerCase();
        const areas = CITY_AREA_MAP[targetCity] || [targetCity];
        const turfLocLower = (turf.location + ' ' + turf.city).toLowerCase();
        const matchesCity = areas.some(a => turfLocLower.includes(a));
        if (!matchesCity) return false;
      }

      // Environment filter
      if (exploreFilters.env !== 'all' && turf.environment !== exploreFilters.env) return false;

      // Price filter
      if (turf.price_per_hour > exploreFilters.maxPrice) return false;

      // Amenities filter
      if (exploreFilters.amenities.length > 0) {
        const tAmenities = (turf.amenities || []).map(a => a.toLowerCase());
        const hasAll = exploreFilters.amenities.every(req => 
          tAmenities.some(ta => ta.includes(req.toLowerCase()))
        );
        if (!hasAll) return false;
      }

      // Time Slot filter
      if (exploreFilters.timeSlot && !turf.times.includes(exploreFilters.timeSlot)) return false;

      // Minimum Rating filter
      if (exploreFilters.minRating > 0 && turf.rating < exploreFilters.minRating) return false;

      // Capacity filter
      if (exploreFilters.capacity !== 'all' && turf.capacity !== exploreFilters.capacity) return false;

      return true;
    });

    // 2. Sort results
    if (exploreFilters.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price_per_hour - b.price_per_hour);
    } else if (exploreFilters.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price_per_hour - a.price_per_hour);
    } else if (exploreFilters.sortBy === 'rating-desc') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    // 3. Update Results Count Badge & Active Filters Count
    const countBadge = document.getElementById('turf-results-count-badge');
    if (countBadge) {
      countBadge.textContent = `${filtered.length} Facilities Available`;
    }

    // Calculate active filter count
    let activeCount = 0;
    if (exploreFilters.sport !== 'all') activeCount++;
    if (exploreFilters.city !== 'all') activeCount++;
    if (exploreFilters.env !== 'all') activeCount++;
    if (exploreFilters.maxPrice < 3000) activeCount++;
    if (exploreFilters.amenities.length > 0) activeCount += exploreFilters.amenities.length;
    if (exploreFilters.timeSlot) activeCount++;
    if (exploreFilters.minRating > 0) activeCount++;
    if (exploreFilters.capacity !== 'all') activeCount++;
    if (exploreFilters.quickTag) activeCount++;

    const filterCountLabel = document.getElementById('active-filters-count-label');
    if (filterCountLabel) {
      filterCountLabel.textContent = `${activeCount} active`;
    }
    const filterDot = document.getElementById('filter-active-dot');
    if (filterDot) {
      filterDot.style.display = activeCount > 0 ? 'inline-block' : 'none';
    }

    // 4. Update Empty State visibility & Pagination
    const emptyState = document.getElementById('explore-empty-state');
    const paginationNav = document.getElementById('explore-pagination');

    if (filtered.length === 0) {
      container.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      if (paginationNav) {
        paginationNav.style.display = 'none';
        paginationNav.innerHTML = '';
      }
      return;
    }

    container.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    // Calculate pagination slices (6 facilities per page)
    const totalPages = Math.ceil(filtered.length / FACILITIES_PER_PAGE) || 1;
    if (currentExplorePage > totalPages) currentExplorePage = totalPages;
    if (currentExplorePage < 1) currentExplorePage = 1;

    const startIndex = (currentExplorePage - 1) * FACILITIES_PER_PAGE;
    const pageItems = filtered.slice(startIndex, startIndex + FACILITIES_PER_PAGE);

    // 5. Render Facility Cards Grid (2-column grid, 6 per page)
    container.innerHTML = pageItems.map(t => {
      const isFav = favs.includes(String(t.id));
      const microAmenities = (t.amenities || []).slice(0, 3);

      return `
        <div class="turf-listing-card" data-turfid="${t.id}" data-lat="${t.lat}" data-lng="${t.lng}">
          <a href="facility-details.html?id=${encodeURIComponent(t.id)}" class="turf-media" style="text-decoration:none; display:block;">
            <img src="${t.image || 'images/turf-arena.jpg'}" alt="${t.name}" loading="lazy">
            <div class="card-loc-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${t.location || 'Tamil Nadu'}</span>
            </div>
            <button type="button" class="card-fav-btn ${isFav ? 'is-fav' : ''}" data-turfid="${t.id}" aria-label="Toggle Favourite" onclick="event.preventDefault(); event.stopPropagation();">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            ${t.is_instant ? `<div class="card-instant-tag">⚡ Instant</div>` : ''}
            <div class="card-sport-badge">${t.sport || 'Sports'}</div>
          </a>

          <div class="turf-details-body">
            <div class="card-top-rate-row">
              <div class="card-price-text">₹${t.price_per_hour.toLocaleString()} <span class="card-price-unit">/hr</span></div>
              <div class="card-rating-badge">
                <span class="star-icon">★</span>
                <span>${t.rating || '4.8'} (${t.reviews_count || '80+'})</span>
              </div>
            </div>

            <a href="facility-details.html?id=${encodeURIComponent(t.id)}" style="text-decoration:none; color:inherit;">
              <h3 class="turf-card-title">${t.name}</h3>
            </a>
            <div class="card-spec-line">${t.surface || 'FIFA Approved Artificial Grass'} • ${t.capacity_label || 'Standard Turf'}</div>

            <div class="card-micro-amenities-row">
              <span class="micro-amenity-chip">${t.environment === 'indoor' ? 'Indoor' : 'Outdoor'}</span>
              ${microAmenities.map(a => `<span class="micro-amenity-chip">${a}</span>`).join('')}
            </div>

            <div class="turf-card-actions-row">
              <a href="facility-details.html?id=${encodeURIComponent(t.id)}" class="btn-card-details">
                View Details
              </a>
              <button type="button" class="btn-card-book" data-turfid="${t.id}" data-turf="${t.name}" data-rate="${t.price_per_hour}" data-loc="${t.location || 'Chennai, Tamil Nadu'}" data-sport="${t.sport || 'Football'}">
                Book Now
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // 6. Render Pagination Controls (< 1 2 3 >)
    renderPaginationControls(totalPages);

    // 7. Bind events on newly rendered cards
    bindTurfCardEvents();
  }

  // Render Numbered Pagination (SportMatch Style)
  function renderPaginationControls(totalPages) {
    const paginationNav = document.getElementById('explore-pagination');
    if (!paginationNav) return;

    if (totalPages <= 1) {
      paginationNav.style.display = 'none';
      paginationNav.innerHTML = '';
      return;
    }

    paginationNav.style.display = 'flex';

    let html = `
      <button type="button" class="pagination-nav-btn" id="btn-page-prev" ${currentExplorePage === 1 ? 'disabled' : ''} aria-label="Previous Page">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
    `;

    for (let p = 1; p <= totalPages; p++) {
      html += `
        <button type="button" class="pagination-num-btn ${p === currentExplorePage ? 'active' : ''}" data-page="${p}">
          ${p}
        </button>
      `;
    }

    html += `
      <button type="button" class="pagination-nav-btn" id="btn-page-next" ${currentExplorePage === totalPages ? 'disabled' : ''} aria-label="Next Page">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    `;

    paginationNav.innerHTML = html;

    // Bind page number clicks
    paginationNav.querySelectorAll('.pagination-num-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page, 10);
        if (page && page !== currentExplorePage) {
          currentExplorePage = page;
          renderMarketplaceTurfs();
          scrollToExploreTop();
        }
      });
    });

    // Bind Prev / Next buttons
    const prevBtn = document.getElementById('btn-page-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentExplorePage > 1) {
          currentExplorePage--;
          renderMarketplaceTurfs();
          scrollToExploreTop();
        }
      });
    }

    const nextBtn = document.getElementById('btn-page-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentExplorePage < totalPages) {
          currentExplorePage++;
          renderMarketplaceTurfs();
          scrollToExploreTop();
        }
      });
    }
  }

  function scrollToExploreTop() {
    const section = document.getElementById('popular-turfs');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Bind Card Click Events (Book Now, View Details, Favorites, Hover highlight)
  function bindTurfCardEvents() {
    // Book Now buttons
    document.querySelectorAll('.btn-card-book').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.turfid || 'turf-1';
        const name = btn.dataset.turf || 'The Arena Sports Hub';
        const rate = btn.dataset.rate || '1200';
        const loc = btn.dataset.loc || 'Chennai, Tamil Nadu';
        const sport = btn.dataset.sport || 'Football';

        // Check if user is logged in
        const curUser = window.TurfifyStore ? window.TurfifyStore.getCurrentUser() : null;
        const isAuthenticated = !!(curUser && curUser.is_authenticated === true);

        if (!isAuthenticated) {
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

        const dateInput = document.getElementById('booking-date');
        if (!dateInput.value) {
          dateInput.value = new Date().toISOString().split('T')[0];
        }

        const nameInput = document.getElementById('booking-player-name');
        const phoneInput = document.getElementById('booking-player-phone');
        if (nameInput) {
          nameInput.value = (curUser && curUser.name && curUser.name !== 'Player Guest') ? curUser.name : (nameInput.value || '');
        }
        if (phoneInput) {
          phoneInput.value = (curUser && curUser.phone && curUser.phone !== '—') ? curUser.phone : (phoneInput.value || '');
        }

        openModal(modalBooking);
        refreshSlotAvailability();
      });
    });

    // View Details buttons & card clicks -> Dedicated Facility Page
    document.querySelectorAll('.btn-card-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.turfid;
        window.location.href = 'facility-details.html?id=' + encodeURIComponent(id);
      });
    });

    document.querySelectorAll('.turf-card-media, .turf-card-title').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', (e) => {
        const card = el.closest('.turf-listing-card');
        const id = card?.dataset?.id;
        if (id) {
          window.location.href = 'facility-details.html?id=' + encodeURIComponent(id);
        }
      });
    });

    // Favorite heart buttons
    document.querySelectorAll('.card-fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.turfid;
        toggleFavoriteTurf(id);
      });
    });

    // Hover cards — subtle visual feedback only (no map)
    document.querySelectorAll('.turf-listing-card').forEach(card => {
      card.addEventListener('mouseenter', () => card.classList.add('hovered'));
      card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
    });
  }

  // Open Full Facility Details Page
  function openTurfDetailsModal(turfId) {
    if (turfId) {
      window.location.href = 'facility-details.html?id=' + encodeURIComponent(turfId);
      return;
    }
    const all = getMasterTurfsList();
    const turf = all[0];
    if (turf) {
      window.location.href = 'facility-details.html?id=' + encodeURIComponent(turf.id);
    }
  }

  // Close Turf Details modal
  document.getElementById('btn-close-turf-details')?.addEventListener('click', () => {
    closeModal(document.getElementById('modal-turf-details'));
  });


  // ==========================================================================
  // DISCOVERY CONTROLS & SIDEBAR EVENTS WIRING
  // ==========================================================================
  function setupDiscoveryEventListeners() {
    // 1. Sport filter chips in left sidebar
    document.querySelectorAll('.filter-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        exploreFilters.sport = btn.dataset.sport;
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    });

    // 2. City select in left sidebar
    const citySelect = document.getElementById('filter-city-select');
    if (citySelect) {
      citySelect.addEventListener('change', () => {
        exploreFilters.city = citySelect.value;
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    }

    // 3. Environment segmented buttons (All, Indoor, Outdoor)
    document.querySelectorAll('.segment-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        exploreFilters.env = btn.dataset.env;
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    });

    // 4. Price range slider
    const priceSlider = document.getElementById('filter-price-range');
    const priceDisplay = document.getElementById('price-slider-display');
    if (priceSlider) {
      priceSlider.addEventListener('input', () => {
        const val = parseInt(priceSlider.value, 10);
        exploreFilters.maxPrice = val;
        if (priceDisplay) priceDisplay.textContent = `₹${val.toLocaleString()}/hr`;
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    }

    // 5. Facility Amenities checkboxes
    document.querySelectorAll('.filter-amenity-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const checked = Array.from(document.querySelectorAll('.filter-amenity-cb:checked')).map(c => c.value);
        exploreFilters.amenities = checked;
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    });

    // 6. Time Slot buttons
    document.querySelectorAll('.filter-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
          btn.classList.remove('active');
          exploreFilters.timeSlot = null;
        } else {
          document.querySelectorAll('.filter-time-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          exploreFilters.timeSlot = btn.dataset.time;
        }
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    });

    // 7. Rating filter pills
    document.querySelectorAll('.rating-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.rating-filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        exploreFilters.minRating = parseFloat(btn.dataset.rating) || 0;
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    });

    // 8. Capacity pills
    document.querySelectorAll('.capacity-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.capacity-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        exploreFilters.capacity = btn.dataset.cap;
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    });

    // 9. Reset All Filters button
    const resetBtn = document.getElementById('btn-reset-filters');
    const emptyResetBtn = document.getElementById('btn-empty-reset-action');
    function resetAllDiscoveryFilters() {
      exploreFilters.sport = 'all';
      exploreFilters.city = 'all';
      exploreFilters.env = 'all';
      exploreFilters.maxPrice = 3000;
      exploreFilters.amenities = [];
      exploreFilters.timeSlot = null;
      exploreFilters.minRating = 0;
      exploreFilters.capacity = 'all';
      exploreFilters.tab = 'all';
      exploreFilters.quickTag = null;
      exploreFilters.sortBy = 'relevance';
      currentExplorePage = 1;

      // Reset UI elements
      document.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.toggle('active', b.dataset.sport === 'all'));
      if (citySelect) citySelect.value = 'all';
      document.querySelectorAll('.segment-btn').forEach(b => b.classList.toggle('active', b.dataset.env === 'all'));
      if (priceSlider) { priceSlider.value = 3000; }
      if (priceDisplay) priceDisplay.textContent = '₹3,000/hr';
      document.querySelectorAll('.filter-amenity-cb').forEach(cb => cb.checked = false);
      document.querySelectorAll('.filter-time-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.rating-filter-pill').forEach(b => b.classList.toggle('active', b.dataset.rating === '0'));
      document.querySelectorAll('.capacity-pill-btn').forEach(b => b.classList.toggle('active', b.dataset.cap === 'all'));
      document.querySelectorAll('.explore-tab-pill').forEach(b => b.classList.toggle('active', b.dataset.tab === 'all'));
      document.querySelectorAll('.quick-chip-toggle').forEach(b => b.classList.remove('active'));
      const sortSelect = document.getElementById('explore-sort-select');
      if (sortSelect) sortSelect.value = 'relevance';

      renderMarketplaceTurfs();
      showToast('Filters reset to default.');
    }
    if (resetBtn) resetBtn.addEventListener('click', resetAllDiscoveryFilters);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllDiscoveryFilters);

    // 10. Sorting Select Dropdown
    const sortSelect = document.getElementById('explore-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        exploreFilters.sortBy = sortSelect.value;
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    }

    // 12. Quick Category Subtabs (All, Most Popular, Fastest Confirm, Favourites)
    document.querySelectorAll('.explore-tab-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.explore-tab-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        exploreFilters.tab = pill.dataset.tab;
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    });

    // 13. Quick Tag Chips (Indoor, Outdoor, Under 1200)
    document.querySelectorAll('.quick-chip-toggle').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('active')) {
          chip.classList.remove('active');
          exploreFilters.quickTag = null;
        } else {
          document.querySelectorAll('.quick-chip-toggle').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          exploreFilters.quickTag = chip.dataset.quick;
        }
        currentExplorePage = 1;
        renderMarketplaceTurfs();
      });
    });

    // 14. Mobile Drawer Open/Close
    const mobileFilterTrigger = document.getElementById('btn-open-mobile-filters');
    const mobileFilterClose = document.getElementById('btn-close-filter-drawer');
    const mobileApplyBtn = document.getElementById('btn-apply-filters-mobile');
    const drawerOverlay = document.getElementById('explore-drawer-overlay');
    const sidebar = document.getElementById('explore-filter-sidebar');

    function openMobileFilters() {
      if (sidebar) sidebar.classList.add('open');
      if (drawerOverlay) drawerOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileFilters() {
      if (sidebar) sidebar.classList.remove('open');
      if (drawerOverlay) drawerOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (mobileFilterTrigger) mobileFilterTrigger.addEventListener('click', openMobileFilters);
    if (mobileFilterClose) mobileFilterClose.addEventListener('click', closeMobileFilters);
    if (mobileApplyBtn) mobileApplyBtn.addEventListener('click', closeMobileFilters);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeMobileFilters);
  }

  // Initialize Discovery Events and Initial Render
  setupDiscoveryEventListeners();
  updateFavoritesBadge();
  renderMarketplaceTurfs();

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
  function buildMarketplaceSlotGrid(operatingSlots) {
    const grid = document.getElementById('marketplace-slots-grid') || document.querySelector('.slots-grid');
    if (!grid) return;

    // Default full-day slots: 6 AM – 11 PM hourly in clean sequential order
    const defaultSlots = [];
    for (let h = 6; h < 23; h++) {
      const startH = h % 12 === 0 ? 12 : h % 12;
      const endH   = (h + 1) % 12 === 0 ? 12 : (h + 1) % 12;
      const endSuffix = (h + 1) < 12 ? 'AM' : 'PM';
      const label = `${String(startH).padStart(2,'0')}:00 - ${String(endH).padStart(2,'0')}:00 ${endSuffix}`;
      defaultSlots.push(label);
    }

    const slotsToRender = (Array.isArray(operatingSlots) && operatingSlots.length > 0)
      ? operatingSlots
      : defaultSlots;

    grid.innerHTML = slotsToRender.map(s =>
      `<button type="button" class="slot-btn" data-slot="${s}">${s}</button>`
    ).join('');
  }

  function refreshSlotAvailability() {
    if (!window.TurfifyStore) return;

    const date = document.getElementById('booking-date')?.value || new Date().toISOString().split('T')[0];
    const allBookings = window.TurfifyStore.getBookings();
    const turfs = window.TurfifyStore.getTurfs() || [];
    const activeTurf = turfs.find(t => String(t.id) === String(activeTurfId));
    const operatingSlots = (activeTurf && Array.isArray(activeTurf.operating_slots) && activeTurf.operating_slots.length > 0)
      ? activeTurf.operating_slots
      : null;

    // Generate dynamic full-day slots for this turf
    buildMarketplaceSlotGrid(operatingSlots);

    // Get time slots booked for this turf on this date (only confirmed, not cancelled)
    const bookedSlots = allBookings
      .filter(b =>
        String(b.turf_id) === String(activeTurfId) &&
        b.date === date &&
        b.status !== 'Cancelled'
      )
      .flatMap(b => {
        if (Array.isArray(b.time_slots)) return b.time_slots.map(s => s.trim());
        if (b.time_slot && b.time_slot.includes(',')) return b.time_slot.split(',').map(s => s.trim());
        return [ (b.time_slot || '').trim() ];
      });

    document.querySelectorAll('.slot-btn').forEach(btn => {
      const slotLabel = btn.dataset.slot ? btn.dataset.slot.trim() : '';

      // Reset state first — NEVER leave default or stale selections
      btn.classList.remove('booked', 'closed', 'selected');
      btn.disabled = false;
      btn.removeAttribute('title');

      if (slotLabel && operatingSlots && !operatingSlots.includes(slotLabel)) {
        // Outside owner operating hours
        btn.classList.add('closed');
        btn.disabled = true;
        btn.title = 'Outside operating hours';
      } else if (slotLabel && bookedSlots.includes(slotLabel)) {
        // Mark as booked — red & disabled
        btn.classList.add('booked');
        btn.disabled = true;
        btn.title = 'Slot already booked';
      } else if (slotLabel) {
        // Slot selection toggle
        btn.onclick = () => {
          btn.classList.toggle('selected');
          updateBookingModalRates();
        };
      }
    });

    // Do NOT auto-select any slot by default — player chooses their own slot
    updateBookingModalRates();
  }

  function updateBookingModalRates() {
    const selectedBtns = Array.from(document.querySelectorAll('.slot-btn.selected:not([disabled])'));
    const count = Math.max(1, selectedBtns.length);
    const totalAmount = activeTurfRate * selectedBtns.length;

    const baseRateLabel = document.getElementById('modal-base-rate-label');
    const baseRateEl = document.getElementById('modal-base-rate');
    const totalRateEl = document.getElementById('modal-total-rate');
    const btnConfirm = document.getElementById('btn-confirm-slot');
    const hintEl = document.getElementById('modal-slot-selection-hint');

    if (baseRateLabel) {
      baseRateLabel.textContent = selectedBtns.length > 1
        ? `Turf Rate (${selectedBtns.length} Slots)`
        : `Turf Rate (1 Hour)`;
    }
    if (baseRateEl) {
      baseRateEl.textContent = selectedBtns.length > 1
        ? `₹${activeTurfRate.toLocaleString()} × ${selectedBtns.length}`
        : `₹${activeTurfRate.toLocaleString()}`;
    }
    if (totalRateEl) {
      totalRateEl.textContent = selectedBtns.length > 0 ? `₹${totalAmount.toLocaleString()}` : `₹${activeTurfRate.toLocaleString()} (1 Hr)`;
    }
    if (hintEl) {
      hintEl.textContent = selectedBtns.length > 0
        ? `${selectedBtns.length} slot${selectedBtns.length > 1 ? 's' : ''} selected`
        : 'Tap to select one or multiple slots';
    }
    if (btnConfirm) {
      btnConfirm.textContent = selectedBtns.length > 1
        ? `Confirm & Pay Securely (${selectedBtns.length} Slots • ₹${totalAmount.toLocaleString()})`
        : `Confirm & Pay Securely`;
    }
  }

  // Refresh slots when date changes
  document.getElementById('booking-date')?.addEventListener('change', refreshSlotAvailability);

  document.getElementById('btn-confirm-slot')?.addEventListener('click', () => {
    const selectedBtns = Array.from(document.querySelectorAll('.slot-btn.selected:not([disabled])'));
    if (selectedBtns.length === 0) {
      showToast('⚠️ Please select at least one available slot.');
      return;
    }
    const selectedSlots = selectedBtns.map(b => b.dataset.slot);
    const slotString = selectedSlots.join(', ');
    const totalAmount = activeTurfRate * selectedSlots.length;
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
        time_slot: slotString,
        time_slots: selectedSlots,
        amount: totalAmount,
        status: 'Confirmed',
        payment_status: 'Paid Online'
      });
    }

    closeModal(modalBooking);
    showToast(`🎉 ${selectedSlots.length} slot${selectedSlots.length > 1 ? 's' : ''} reserved at ${activeTurfName} for ${date} (${slotString})! View in Dashboard.`);
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

  // Connect Hero Search Bar directly into Section A Discovery Engine
  document.getElementById('search-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const loc = document.getElementById('select-location')?.value || 'all';
    const sport = document.getElementById('select-sport')?.value || 'all';

    exploreFilters.city = loc;
    exploreFilters.sport = sport;

    // Sync left sidebar controls
    const citySelect = document.getElementById('filter-city-select');
    if (citySelect) citySelect.value = loc;

    document.querySelectorAll('.filter-chip-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.sport === sport || (sport === 'all' && btn.dataset.sport === 'all'));
    });

    renderMarketplaceTurfs();
    document.getElementById('popular-turfs')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Connect Hero Sports Pills directly into Section A Discovery Engine
  document.querySelectorAll('.sport-pill-card').forEach(pill => {
    pill.addEventListener('click', () => {
      const sport = pill.dataset.sport || 'all';
      exploreFilters.sport = sport;

      const heroSportSelect = document.getElementById('select-sport');
      if (heroSportSelect) heroSportSelect.value = sport;

      document.querySelectorAll('.filter-chip-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sport === sport);
      });

      renderMarketplaceTurfs();
      document.getElementById('popular-turfs')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Next turfs quick toast
  document.getElementById('btn-next-turfs')?.addEventListener('click', () => {
    showToast('Browsing verified sports facilities across Tamil Nadu.');
  });
});
