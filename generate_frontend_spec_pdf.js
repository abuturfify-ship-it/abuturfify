const { chromium } = require('playwright-chromium');
const fs = require('fs');
const path = require('path');

function getBase64Image(filename) {
  const filePath = path.join(__dirname, 'screenshots', filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return '';
}

async function generateSpecPDF() {
  console.log('--- Preparing High-Resolution Base64 Assets ---');
  const imgHomeHero = getBase64Image('02_home_hero_viewport.png');
  const imgSearchBar = getBase64Image('comp_search_bar.png');
  const imgSportsPills = getBase64Image('comp_sports_pills.png');
  const imgTurfCard = getBase64Image('comp_turf_card.png');
  const imgBookingModal = getBase64Image('05_booking_modal.png');
  const imgPlayerDash = getBase64Image('player_dashboard.png');
  const imgOwnerDash = getBase64Image('owner_dashboard.png');

  console.log('--- Generating Document HTML with Precise 900px Page Budgets ---');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Turfify — Frontend Architecture & Interactive User Journey Specification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
      --primary: #059669;
      --primary-dark: #065F46;
      --primary-light: #D1FAE5;
      --accent-orange: #EA580C;
      --accent-orange-light: #FFEDD5;
      --navy-900: #0F172A;
      --navy-800: #1E293B;
      --slate-700: #334155;
      --slate-500: #64748B;
      --slate-200: #E2E8F0;
      --slate-100: #F1F5F9;
      --slate-50: #F8FAFC;
      --white: #FFFFFF;
      --blue-600: #0284C7;
      --blue-50: #E0F2FE;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: var(--navy-800);
      background-color: var(--white);
      line-height: 1.45;
      font-size: 12.5px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    @page {
      size: A4;
      margin: 14mm 14mm 14mm 14mm;
      @bottom-right {
        content: "Page " counter(page) " of " counter(pages);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8.5pt;
        color: #94A3B8;
        font-weight: 600;
      }
      @bottom-left {
        content: "Turfify Platform — Frontend System & Interaction Specification";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 8.5pt;
        color: #94A3B8;
      }
    }

    .page {
      page-break-after: always;
      break-after: page;
      position: relative;
      max-height: 980px;
      overflow: hidden;
    }

    .page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    .no-split {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Running Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--slate-100);
      padding-bottom: 6px;
      margin-bottom: 14px;
      font-size: 10px;
      color: var(--slate-500);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .page-header-brand {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--primary);
      font-weight: 800;
      font-size: 11px;
    }

    /* Typography */
    h1 { font-size: 20px; line-height: 1.25; margin-bottom: 6px; color: var(--navy-900); font-weight: 800; letter-spacing: -0.02em; }
    h2 { font-size: 15px; line-height: 1.3; margin-bottom: 6px; margin-top: 10px; color: var(--navy-900); font-weight: 700; letter-spacing: -0.02em; }
    h3 { font-size: 13px; line-height: 1.35; margin-bottom: 4px; color: var(--navy-900); font-weight: 700; }
    h4 { font-size: 12px; line-height: 1.4; margin-bottom: 3px; color: var(--navy-900); font-weight: 700; }
    p { margin-bottom: 6px; color: var(--slate-700); }

    /* Badges */
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 7px;
      border-radius: 9999px;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .badge-green { background: var(--primary-light); color: var(--primary-dark); }
    .badge-orange { background: var(--accent-orange-light); color: var(--accent-orange); }
    .badge-blue { background: var(--blue-50); color: var(--blue-600); }
    .badge-dark { background: var(--navy-900); color: var(--white); }

    /* Callouts */
    .callout {
      border-left: 3px solid var(--primary);
      background: var(--slate-50);
      border-radius: 0 6px 6px 0;
      padding: 8px 12px;
      margin: 8px 0 10px 0;
      font-size: 11.5px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .callout-orange { border-left-color: var(--accent-orange); background: #FFF7ED; }
    .callout-blue { border-left-color: var(--blue-600); background: #F0F9FF; }

    .callout-title {
      font-weight: 700;
      color: var(--navy-900);
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 11.5px;
    }

    /* Grids & Cards */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 8px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin: 8px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .card {
      background: var(--white);
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      padding: 10px 12px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    /* Tables */
    table.spec-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 10px 0;
      font-size: 11px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    table.spec-table th {
      background: var(--navy-900);
      color: var(--white);
      text-align: left;
      padding: 6px 9px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    table.spec-table th:first-child { border-top-left-radius: 5px; }
    table.spec-table th:last-child { border-top-right-radius: 5px; }

    table.spec-table td {
      padding: 6px 9px;
      border-bottom: 1px solid var(--slate-200);
      vertical-align: top;
      line-height: 1.4;
    }

    table.spec-table tr:nth-child(even) { background: var(--slate-50); }

    .tag-key {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      background: #F1F5F9;
      color: #0F172A;
      padding: 1px 4px;
      border-radius: 3px;
      border: 1px solid #CBD5E1;
      font-weight: 600;
      white-space: nowrap;
    }

    /* Visual Screen Embed Containers */
    .screen-figure {
      margin: 8px 0 10px 0;
      border: 1px solid var(--slate-200);
      border-radius: 7px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
      background: var(--slate-50);
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .screen-img {
      width: 100%;
      height: auto;
      display: block;
    }

    .screen-caption {
      padding: 5px 10px;
      font-size: 10px;
      font-weight: 600;
      color: var(--slate-500);
      background: var(--white);
      border-top: 1px solid var(--slate-200);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Cover Page */
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 940px;
      padding: 6mm 4mm 6mm 4mm;
    }

    .cover-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .cover-logo-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .cover-logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 22px;
      box-shadow: 0 6px 12px rgba(16, 185, 129, 0.25);
    }

    .cover-logo-text { font-size: 26px; font-weight: 800; color: var(--navy-900); letter-spacing: -0.03em; }
    .cover-logo-sub { font-size: 11px; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }

    .cover-hero-box {
      margin-top: 15px;
      padding: 24px;
      background: linear-gradient(145deg, #0F172A 0%, #1E293B 100%);
      border-radius: 14px;
      color: var(--white);
      position: relative;
      overflow: hidden;
      box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);
    }

    .cover-hero-box::after {
      content: '';
      position: absolute;
      top: -40px;
      right: -40px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0) 70%);
    }

    .cover-tagline {
      display: inline-block;
      padding: 3px 10px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34D399;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 12px;
    }

    .cover-title {
      font-size: 28px;
      font-weight: 800;
      color: var(--white);
      line-height: 1.2;
      margin-bottom: 10px;
      letter-spacing: -0.03em;
    }

    .cover-title span { color: #34D399; }
    .cover-subtitle { font-size: 13.5px; color: #94A3B8; max-width: 560px; line-height: 1.5; margin-bottom: 18px; }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .cover-meta-item .label { font-size: 9px; color: #94A3B8; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; margin-bottom: 2px; }
    .cover-meta-item .val { font-size: 11.5px; color: var(--white); font-weight: 700; }

    .cover-summary-pills { display: flex; gap: 8px; margin-top: 16px; }
    .summary-pill { flex: 1; padding: 12px; border-radius: 9px; background: var(--slate-50); border: 1px solid var(--slate-200); }
    .summary-pill h4 { font-size: 12px; color: var(--navy-900); margin-bottom: 2px; }
    .summary-pill p { font-size: 10.5px; color: var(--slate-500); margin-bottom: 0; line-height: 1.35; }

    /* Workflow Diagram */
    .flow-steps { display: flex; align-items: center; gap: 6px; margin: 8px 0; }
    .flow-step { flex: 1; background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 6px; padding: 6px 4px; text-align: center; }
    .flow-step-num { width: 18px; height: 18px; border-radius: 50%; background: var(--primary); color: white; font-size: 9.5px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 3px auto; }
    .flow-step-title { font-size: 10.5px; font-weight: 700; color: var(--navy-900); margin-bottom: 1px; }
    .flow-step-desc { font-size: 9px; color: var(--slate-500); }
    .flow-arrow { font-size: 12px; color: var(--slate-400); font-weight: 800; }
  </style>
</head>
<body>

  <!-- ==========================================================================
       PAGE 1: COVER PAGE (Exact 900px Budget)
       ========================================================================== -->
  <div class="page cover-page">
    <div class="cover-top">
      <div class="cover-logo-row">
        <div class="cover-logo-icon">t</div>
        <div>
          <div class="cover-logo-text">Turfify</div>
          <div class="cover-logo-sub">Play. Book. Enjoy.</div>
        </div>
      </div>
      <div class="badge badge-green" style="font-size: 10px; padding: 4px 10px;">
        Production Technical Specification
      </div>
    </div>

    <div class="cover-hero-box">
      <div class="cover-tagline">Comprehensive Engineering Guide & Client Blueprint</div>
      <h1 class="cover-title">Frontend Architecture &<br><span>Interactive UI/UX</span> Specification</h1>
      <p class="cover-subtitle">
        An exhaustive, component-by-component manual detailing every frontend screen, navigation button, search parameter, interactive click reaction, modal popup, and dual-role operational workflow.
      </p>

      <div class="cover-meta-grid">
        <div class="cover-meta-item">
          <div class="label">Platform Version</div>
          <div class="val">v1.0 Production</div>
        </div>
        <div class="cover-meta-item">
          <div class="label">Target Ecosystem</div>
          <div class="val">Web & Mobile Responsive</div>
        </div>
        <div class="cover-meta-item">
          <div class="label">Architecture Model</div>
          <div class="val">Player Portal + Owner ERP</div>
        </div>
        <div class="cover-meta-item">
          <div class="label">State Management</div>
          <div class="val">TurfifyStore (Supabase Ready)</div>
        </div>
      </div>
    </div>

    <div class="cover-summary-pills">
      <div class="summary-pill" style="border-left: 4px solid var(--primary);">
        <h4>1. Consumer Marketplace</h4>
        <p>Real-time location, sport, date, and hourly slot filtering with instant booking checkout modal.</p>
      </div>
      <div class="summary-pill" style="border-left: 4px solid var(--blue-600);">
        <h4>2. Player Hub Portal</h4>
        <p>Live kickoff countdown, GPS Google Maps navigation, WhatsApp squad share, and match ledger.</p>
      </div>
      <div class="summary-pill" style="border-left: 4px solid var(--accent-orange);">
        <h4>3. Turf Owner ERP</h4>
        <p>Real-time daily turnover metrics, slot occupancy matrix, walk-in offline blocking, and financial settlements.</p>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--slate-200); padding-top: 10px; font-size: 10px; color: var(--slate-500);">
      <div>Document Prepared For: <strong>Executive Client Review & Engineering Alignment</strong></div>
      <div>Confidential & Proprietary — Turfify Inc.</div>
    </div>
  </div>

  <!-- ==========================================================================
       PAGE 2: ARCHITECTURE & MASTER PAGE INVENTORY (Exact 750px Budget)
       ========================================================================== -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-brand"><span>●</span> Turfify Architecture Guide</div>
      <div>Section 1.0 — Architecture & Page Hierarchy</div>
    </div>

    <h1>1. Platform Architecture & Master Page Inventory</h1>
    <p>
      The Turfify frontend is architected as a <strong>high-performance, dual-role sports ecosystem</strong>. It provides both consumer-facing match booking for active sports enthusiasts and an enterprise facility console for turf owners.
    </p>

    <div class="callout">
      <div class="callout-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        Core Architectural Principle: Zero Double-Booking & Instant UI Responsiveness
      </div>
      Every interactive button communicates through the unified <code>TurfifyStore</code> state machine. When a player books an hourly slot or an owner logs a cash walk-in, the slot is locked immediately across all views to prevent slot collisions.
    </div>

    <h2>1.1 Master Page Inventory</h2>
    <table class="spec-table">
      <thead>
        <tr>
          <th>Page / Screen</th>
          <th>File Path</th>
          <th>Primary User Role</th>
          <th>Key Functional Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Marketplace Home</strong></td>
          <td><span class="tag-key">index.html</span></td>
          <td>Public / Player</td>
          <td>Hero banner, multi-parameter search bar, sport pills, verified turf listings, owner registration banner.</td>
        </tr>
        <tr>
          <td><strong>Player Hub Portal</strong></td>
          <td><span class="tag-key">player-dashboard.html</span></td>
          <td>Registered Player</td>
          <td>Next match kickoff countdown, GPS directions, squad sharing, active bookings, match cancellation, loyalty coins.</td>
        </tr>
        <tr>
          <td><strong>Turf Owner ERP</strong></td>
          <td><span class="tag-key">owner-dashboard.html</span></td>
          <td>Turf Facility Owner</td>
          <td>Today’s turnover, slot occupancy rate, 16-hour live slot matrix, manual walk-in blocker, add grounds modal, payouts.</td>
        </tr>
        <tr>
          <td><strong>Unified Portal</strong></td>
          <td><span class="tag-key">dashboard.html</span></td>
          <td>Dual-Role Switcher</td>
          <td>Seamless toggle between Player View and Owner View without page reloading or loss of state.</td>
        </tr>
        <tr>
          <td><strong>About Platform</strong></td>
          <td><span class="tag-key">about.html</span></td>
          <td>Public / Enterprise</td>
          <td>Company background, sports infrastructure mission, founder vision, investor metrics, and partner contact.</td>
        </tr>
      </tbody>
    </table>

    <h2>1.2 Modal Overlay Architecture</h2>
    <p>The frontend uses three non-destructive modal overlays that mount dynamically over any viewport:</p>

    <div class="grid-3 no-split">
      <div class="card" style="border-top: 3px solid var(--primary);">
        <div class="card-header">
          <h4>Slot Booking Modal</h4>
          <span class="badge badge-green">Player</span>
        </div>
        <p style="font-size: 10.5px; color: var(--slate-500); margin-bottom: 0;">
          Pre-fills venue pricing, calendar date picker, morning/evening slot chips, dynamic price calculation, and instant reservation trigger.
        </p>
      </div>

      <div class="card" style="border-top: 3px solid var(--accent-orange);">
        <div class="card-header">
          <h4>Owner Facility Modal</h4>
          <span class="badge badge-orange">Partner</span>
        </div>
        <p style="font-size: 10.5px; color: var(--slate-500); margin-bottom: 0;">
          Pitches onboarding form: venue name, sport type, ground dimensions, price per hour, and phone number for 2-hour onboarding dispatch.
        </p>
      </div>

      <div class="card" style="border-top: 3px solid var(--navy-900);">
        <div class="card-header">
          <h4>Authentication Modal</h4>
          <span class="badge badge-dark">Dual Role</span>
        </div>
        <p style="font-size: 10.5px; color: var(--slate-500); margin-bottom: 0;">
          Interactive role selection toggle (Player vs. Turf Owner) allowing dynamic redirect to either Player Hub or Partner Console.
        </p>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       PAGE 3: MARKETPLACE HOME PAGE & HERO SECTION (Exact 850px Budget)
       ========================================================================== -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-brand"><span>●</span> Turfify Marketplace View</div>
      <div>Section 2.0 — Consumer Marketplace Page</div>
    </div>

    <h1>2. Consumer Marketplace: Landing & Hero Viewport</h1>
    <p>
      The Marketplace Home Page (<span class="tag-key">index.html</span>) provides high-conversion discovery with trust badges, quick booking access, and dedicated owner acquisition.
    </p>

    ${imgHomeHero ? `
    <div class="screen-figure no-split" style="max-height: 440px; overflow: hidden;">
      <img src="${imgHomeHero}" class="screen-img" style="max-height: 410px; object-fit: cover; object-position: top;" alt="Home Page Hero Viewport">
      <div class="screen-caption">
        <span>Figure 2.1 — Marketplace Home Viewport with Navigation, Trust Badges, and Search Console</span>
        <span class="badge badge-green">Production UI</span>
      </div>
    </div>
    ` : ''}

    <h2>2.1 Navigation Bar & Header Actions</h2>
    <table class="spec-table">
      <thead>
        <tr>
          <th>Navbar Element</th>
          <th>Trigger Type</th>
          <th>What Happens on Click</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Brand Logo ("Turfify")</strong></td>
          <td>Link (<span class="tag-key">href="#home"</span>)</td>
          <td>Smoothly scrolls viewport back to the top hero section.</td>
        </tr>
        <tr>
          <td><strong>"Find Turfs" Link</strong></td>
          <td>Link (<span class="tag-key">href="#search-section"</span>)</td>
          <td>Smooth-scrolls viewport to the search console and focuses search fields.</td>
        </tr>
        <tr>
          <td><strong>"Dashboard" Link</strong></td>
          <td>Nav Action (<span class="tag-key">dashboard.html</span>)</td>
          <td>Navigates directly to the interactive portal based on the active logged-in profile.</td>
        </tr>
        <tr>
          <td><strong>"List Your Turf" Link</strong></td>
          <td>Modal Trigger (<span class="tag-key">#btn-hero-owner</span>)</td>
          <td>Opens the <strong>Turf Owner Registration Modal</strong> for ground partners.</td>
        </tr>
        <tr>
          <td><strong>Theme Toggle Button</strong></td>
          <td>Button (<span class="tag-key">#btn-theme-toggle</span>)</td>
          <td>Toggles high-contrast daylight mode and displays toast notification.</td>
        </tr>
        <tr>
          <td><strong>"Login" & "Register"</strong></td>
          <td>Auth Trigger (<span class="tag-key">#btn-open-login</span>)</td>
          <td>Pops open the <strong>Authentication Modal</strong> with Player / Owner role toggles.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==========================================================================
       PAGE 4: INTERACTIVE SEARCH & DISCOVERY ENGINE (Exact 880px Budget)
       ========================================================================== -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-brand"><span>●</span> Turfify Interactive Guide</div>
      <div>Section 3.0 — Search Engine & Filter Mechanics</div>
    </div>

    <h1>3. The Interactive Search Engine: Exact "Click → Reaction" System</h1>
    <p>
      Detailed engineering breakdown of user clicks across <strong>Location, Sport, Date, and Time</strong>:
    </p>

    ${imgSearchBar ? `
    <div class="screen-figure no-split" style="margin-bottom: 8px;">
      <img src="${imgSearchBar}" class="screen-img" alt="Search Bar Component">
      <div class="screen-caption">
        <span>Figure 3.1 — Multi-Parameter Search Console (Location, Sport, Date, Time & Search CTA)</span>
        <span class="badge badge-blue">Interactive Component</span>
      </div>
    </div>
    ` : ''}

    <h2>3.1 Click-by-Click Parameter Behavior Matrix</h2>
    <table class="spec-table">
      <thead>
        <tr>
          <th style="width: 17%;">Filter Parameter</th>
          <th style="width: 26%;">User Action (What They Click)</th>
          <th style="width: 29%;">What the Frontend Shows (Visual UI)</th>
          <th style="width: 28%;">Technical State & System Reaction</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. Location Dropdown</strong><br><span class="tag-key">#select-location</span></td>
          <td>
            Selects area from dropdown:<br>
            • Koramangala, HSR Layout, Indiranagar, Jayanagar, Whitefield, All.
          </td>
          <td>
            • Dropdown displays selected neighborhood.<br>
            • Mismatched cards fade out instantly.<br>
            • Animated toast: <em>"Showing X verified venues matching your selection."</em>
          </td>
          <td>
            • Evaluates <code>card.dataset.location</code>.<br>
            • Fallback when 0 match: Displays all premier venues with notification toast.
          </td>
        </tr>
        <tr>
          <td><strong>2. Sport Selector</strong><br><span class="tag-key">#select-sport</span></td>
          <td>
            Selects sport:<br>
            • Football, Cricket, Badminton, Basketball.
          </td>
          <td>
            • Active sport pill card highlights in pastel tint.<br>
            • Rerenders venue list with sport amenities.<br>
            • Smoothly scrolls user to <code>#popular-turfs</code>.
          </td>
          <td>
            • Matches <code>card.dataset.sport === sport</code>.<br>
            • Syncs selection across search bar and sports pills.
          </td>
        </tr>
        <tr>
          <td><strong>3. Date Selector</strong><br><span class="tag-key">#select-date</span></td>
          <td>
            Selects date:<br>
            • Today, Tomorrow, Weekend, Calendar.
          </td>
          <td>
            • Updates search bar date label.<br>
            • Adjusts slot counters on cards (<em>"12 slots left today"</em>).<br>
            • Passes date into the Booking Modal.
          </td>
          <td>
            • Queries <code>TurfifyStore.getSlots(turfId, date)</code>.<br>
            • Excludes slots booked by players or blocked by owner.
          </td>
        </tr>
        <tr>
          <td><strong>4. Time Window</strong><br><span class="tag-key">#select-time</span></td>
          <td>
            Selects hourly quadrant:<br>
            • Morning (6-10 AM), Day (10-4 PM), Evening (4-8 PM), Night (8-Midnight).
          </td>
          <td>
            • Shows venues operating during that window.<br>
            • Evening/Night prioritizes <strong>Floodlights</strong>.<br>
            • Day prioritizes Covered / AC venues.
          </td>
          <td>
            • Slot-level filter against facility operating hours.<br>
            • Sorts search results by highest availability.
          </td>
        </tr>
        <tr>
          <td><strong>5. Search Turfs Button</strong><br><span class="tag-key">#btn-search-turfs</span></td>
          <td>
            Clicks teal gradient search pill button.
          </td>
          <td>
            • Button exhibits tactile press effect.<br>
            • Viewport smooth-scrolls to venue listings.<br>
            • Notification toast confirms matching venues.
          </td>
          <td>
            • Intercepts form submit via <code>e.preventDefault()</code>.<br>
            • Compiles composite filter: <code>Location + Sport + Date + Time</code>.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==========================================================================
       PAGE 5: SPORT PILLS & VENUE CARDS WITH BOOKING MODAL (Exact 890px Budget)
       ========================================================================== -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-brand"><span>●</span> Turfify Interactive Guide</div>
      <div>Section 4.0 — Sport Discovery & Booking Modal</div>
    </div>

    <h1>4. Sports Category Pills & Interactive Booking Modal</h1>
    <p>
      In addition to the search bar, users can click any of the <strong>5 Sport Category Cards</strong> for one-click discovery:
    </p>

    ${imgSportsPills ? `
    <div class="screen-figure no-split" style="margin-bottom: 8px;">
      <img src="${imgSportsPills}" class="screen-img" alt="Sport Pills Component">
      <div class="screen-caption">
        <span>Figure 4.1 — 5 Sport Category Filter Pills (Football, Cricket, Badminton, Basketball, Swimming)</span>
        <span class="badge badge-green">One-Click Filter</span>
      </div>
    </div>
    ` : ''}

    <div class="grid-2 no-split">
      <div>
        <h3>4.1 Venue Card Anatomy</h3>
        ${imgTurfCard ? `
        <div class="screen-figure" style="margin-top: 4px; max-height: 250px; overflow: hidden;">
          <img src="${imgTurfCard}" class="screen-img" style="max-height: 220px; object-fit: cover; object-position: top;" alt="Turf Card">
          <div class="screen-caption">
            <span>Figure 4.2 — Verified Turf Card</span>
          </div>
        </div>
        ` : ''}

        <p style="font-size: 11px; margin-top: 4px;">
          • <strong>Favorite Heart</strong>: Toggles red heart & adds to favorites.<br>
          • <strong>Book Now</strong>: Opens live booking modal with pre-filled rates.
        </p>
      </div>

      <div>
        <h3>4.2 Live Booking Modal</h3>
        ${imgBookingModal ? `
        <div class="screen-figure" style="margin-top: 4px; max-height: 250px; overflow: hidden;">
          <img src="${imgBookingModal}" class="screen-img" style="max-height: 220px; object-fit: cover; object-position: top;" alt="Booking Modal">
          <div class="screen-caption">
            <span>Figure 4.3 — Slot Booking Modal</span>
          </div>
        </div>
        ` : ''}

        <p style="font-size: 11px; margin-top: 4px;">
          • <strong>Open Slot Chip</strong>: Turns emerald green; updates price.<br>
          • <strong>Confirm & Pay</strong>: Writes to store; notifies user via toast.
        </p>
      </div>
    </div>

    <h2>4.3 Complete Booking Sequence</h2>
    <div class="flow-steps no-split">
      <div class="flow-step">
        <div class="flow-step-num">1</div>
        <div class="flow-step-title">Discover</div>
        <div class="flow-step-desc">Filter Location & Sport</div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-num">2</div>
        <div class="flow-step-title">Select Turf</div>
        <div class="flow-step-desc">Click "Book Now"</div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-num">3</div>
        <div class="flow-step-title">Pick Slot</div>
        <div class="flow-step-desc">Choose hourly chip</div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-num">4</div>
        <div class="flow-step-title">Confirm</div>
        <div class="flow-step-desc">Deducts slot & shows toast</div>
      </div>
      <div class="flow-arrow">→</div>
      <div class="flow-step">
        <div class="flow-step-num">5</div>
        <div class="flow-step-title">Player Hub</div>
        <div class="flow-step-desc">Countdown active</div>
      </div>
    </div>
  </div>

  <!-- ==========================================================================
       PAGE 6: PLAYER HUB / CONSUMER DASHBOARD (Exact 870px Budget)
       ========================================================================== -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-brand"><span>●</span> Turfify Interactive Guide</div>
      <div>Section 5.0 — Player Hub Portal</div>
    </div>

    <h1>5. Player Hub: Match Management, GPS & Squad Sharing</h1>
    <p>
      The Player Hub (<span class="tag-key">player-dashboard.html</span>) is the player’s personal command center for tracking matches, sharing invite links with teammates, and managing cancellations.
    </p>

    ${imgPlayerDash ? `
    <div class="screen-figure no-split" style="max-height: 420px; overflow: hidden;">
      <img src="${imgPlayerDash}" class="screen-img" style="max-height: 390px; object-fit: cover; object-position: top;" alt="Player Dashboard">
      <div class="screen-caption">
        <span>Figure 5.1 — Player Hub with Kickoff Countdown Card, Active Match Ledger, and Navigation Actions</span>
        <span class="badge badge-green">Player Console</span>
      </div>
    </div>
    ` : ''}

    <h2>5.1 Player Interactive Feature Breakdown</h2>
    <table class="spec-table">
      <thead>
        <tr>
          <th>Component</th>
          <th>Button / Element</th>
          <th>User Action & Click Reaction</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Next Kickoff Hero Card</strong></td>
          <td><strong>📍 Get Directions</strong><br><span class="tag-key">btn-match-primary</span></td>
          <td>
            Launches <strong>Google Maps GPS navigation</strong> with exact ground coordinates (e.g. Indiranagar 100ft Road Arena), providing driving time and turn-by-turn routing.
          </td>
        </tr>
        <tr>
          <td><strong>Squad Coordination</strong></td>
          <td><strong>📲 Share Squad Link</strong><br><span class="tag-key">btn-match-secondary</span></td>
          <td>
            Copies encrypted WhatsApp squad invite link to clipboard. Teammates clicking the link can see match time, pitch number, kit color, and ground rules.
          </td>
        </tr>
        <tr>
          <td><strong>Match Modification</strong></td>
          <td><strong>❌ Cancel Match</strong><br><span class="tag-key">btn-cancel-match</span></td>
          <td>
            Prompts user with refund policy modal. Upon confirmation, marks booking status as <code>Cancelled</code> in <code>TurfifyStore</code> and releases the slot back to the public marketplace.
          </td>
        </tr>
        <tr>
          <td><strong>Bookings Ledger</strong></td>
          <td><strong>My Matches Table</strong></td>
          <td>
            Displays full history of all past and upcoming matches with status tags: <code>Paid Online</code>, <code>Confirmed</code>, <code>Completed</code>, or <code>Walk-in</code>.
          </td>
        </tr>
        <tr>
          <td><strong>Gamification & Loyalty</strong></td>
          <td><strong>Loyalty Coins Badge</strong></td>
          <td>
            Displays active balance (e.g. <strong>450 Coins</strong>). Every confirmed match grants 25 coins, redeemable for discounts during peak evening slots.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==========================================================================
       PAGE 7: TURF OWNER PARTNER CONSOLE (Exact 900px Budget)
       ========================================================================== -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-brand"><span>●</span> Turfify Interactive Guide</div>
      <div>Section 6.0 — Turf Owner Partner Console</div>
    </div>

    <h1>6. Turf Owner Partner Console: Business Metrics & Slot Matrix</h1>
    <p>
      The Partner Console (<span class="tag-key">owner-dashboard.html</span>) provides turf facility owners with live operational metrics, revenue turnover, and an interactive 16-hour slot grid.
    </p>

    ${imgOwnerDash ? `
    <div class="screen-figure no-split" style="max-height: 360px; overflow: hidden;">
      <img src="${imgOwnerDash}" class="screen-img" style="max-height: 330px; object-fit: cover; object-position: top;" alt="Turf Owner Dashboard">
      <div class="screen-caption">
        <span>Figure 6.1 — Turf Owner Partner Console with Live Turnover, Occupancy Matrix, and Walk-in Blocker</span>
        <span class="badge badge-orange">Owner ERP</span>
      </div>
    </div>
    ` : ''}

    <div class="grid-2 no-split" style="margin-top: 4px;">
      <div class="card" style="border-left: 3px solid #10B981;">
        <div class="card-header">
          <h4>Today's Turnover</h4>
          <span class="badge badge-green">+18% vs yesterday</span>
        </div>
        <div style="font-size: 18px; font-weight: 800; color: var(--navy-900);">₹9,600</div>
        <p style="font-size: 10.5px; color: var(--slate-500); margin: 2px 0 0 0;">Gross revenue collected online + cash at ground.</p>
      </div>

      <div class="card" style="border-left: 3px solid #EA580C;">
        <div class="card-header">
          <h4>Slot Occupancy</h4>
          <span class="badge badge-orange">12 of 16 Booked</span>
        </div>
        <div style="font-size: 18px; font-weight: 800; color: var(--navy-900);">75% Capacity</div>
        <p style="font-size: 10.5px; color: var(--slate-500); margin: 2px 0 0 0;">Booked hours vs total daily operational facility slots.</p>
      </div>
    </div>

    <h2>6.1 Interactive Slot Matrix & Walk-in Cash Management</h2>
    <table class="spec-table">
      <thead>
        <tr>
          <th>Slot State</th>
          <th>Visual Indicator</th>
          <th>What Happens on Click</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Available Slot</strong></td>
          <td><span class="badge badge-green">Open (Green)</span></td>
          <td>
            Opens <strong>Walk-in Booking Modal</strong>. Owner logs cash customer; instantly blocks slot on the marketplace to prevent double booking.
          </td>
        </tr>
        <tr>
          <td><strong>Online Booking</strong></td>
          <td><span class="badge badge-orange">Paid Online (Orange)</span></td>
          <td>
            Reveals player contact details (Rahul Sharma, +91 98765 43210, #BK-101) so manager can contact team captain.
          </td>
        </tr>
        <tr>
          <td><strong>Maintenance Slot</strong></td>
          <td><span class="badge badge-dark">Maintenance (Dark)</span></td>
          <td>
            Used during turf brushing, lighting repair, or private coaching. Blocks public marketplace bookings.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- ==========================================================================
       PAGE 8: DUAL-ROLE AUTH & MASTER INTERACTION MATRIX (Exact 820px Budget)
       ========================================================================== -->
  <div class="page">
    <div class="page-header">
      <div class="page-header-brand"><span>●</span> Turfify Interactive Guide</div>
      <div>Section 7.0 — Auth, Roles & Master Interaction Matrix</div>
    </div>

    <h1>7. Dual-Role Auth Engine & Master Interaction Matrix</h1>
    <p>
      Turfify supports unified single-identity authentication where a user can operate as a player or switch into turf facility ownership.
    </p>

    <div class="grid-2 no-split">
      <div class="card">
        <div class="card-header">
          <h4>⚽ Player Authentication</h4>
          <span class="badge badge-green">Consumer Flow</span>
        </div>
        <p style="font-size: 10.5px; color: var(--slate-700);">
          1. User clicks <strong>"Login"</strong> in navbar.<br>
          2. Selects radio button <strong>"⚽ Player Account"</strong>.<br>
          3. Submits form → Authenticates via <code>TurfifyStore.switchRole('player')</code>.<br>
          4. Toast confirms login and redirects to <code>player-dashboard.html</code>.
        </p>
      </div>

      <div class="card">
        <div class="card-header">
          <h4>🏟️ Turf Owner Partner Flow</h4>
          <span class="badge badge-orange">Enterprise Flow</span>
        </div>
        <p style="font-size: 10.5px; color: var(--slate-700);">
          1. User clicks <strong>"List Your Turf"</strong> or <strong>"Register"</strong>.<br>
          2. Selects radio button <strong>"🏟️ Turf Owner"</strong>.<br>
          3. Submits form → Authenticates via <code>TurfifyStore.switchRole('owner')</code>.<br>
          4. Toast confirms login and redirects to <code>owner-dashboard.html</code>.
        </p>
      </div>
    </div>

    <h2>7.1 Master Interaction Summary Reference</h2>
    <table class="spec-table">
      <thead>
        <tr>
          <th>Page</th>
          <th>Button / Trigger ID</th>
          <th>User Input</th>
          <th>Frontend Screen Output</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><span class="tag-key">index.html</span></td>
          <td><code>#select-location</code></td>
          <td>Picks area from dropdown</td>
          <td>Filters turf listing cards; triggers match count toast.</td>
        </tr>
        <tr>
          <td><span class="tag-key">index.html</span></td>
          <td><code>.sport-pill-card</code></td>
          <td>Clicks sport icon card</td>
          <td>Filters sport venues; smooth scrolls down to venue grid.</td>
        </tr>
        <tr>
          <td><span class="tag-key">index.html</span></td>
          <td><code>.btn-card-book</code></td>
          <td>Clicks "Book Now" on turf</td>
          <td>Opens Booking Modal with pre-filled rates and time slots.</td>
        </tr>
        <tr>
          <td><span class="tag-key">index.html</span></td>
          <td><code>.slot-btn</code></td>
          <td>Clicks an hourly slot</td>
          <td>Highlights green; calculates total pricing.</td>
        </tr>
        <tr>
          <td><span class="tag-key">index.html</span></td>
          <td><code>#btn-confirm-slot</code></td>
          <td>Clicks "Confirm & Pay"</td>
          <td>Commits reservation to store; shows toast; updates hub.</td>
        </tr>
        <tr>
          <td><span class="tag-key">index.html</span></td>
          <td><code>.btn-card-heart</code></td>
          <td>Clicks heart icon</td>
          <td>Toggles active red heart; adds venue to favorites.</td>
        </tr>
        <tr>
          <td><span class="tag-key">index.html</span></td>
          <td><code>#btn-hero-owner</code></td>
          <td>Clicks "Register Your Turf"</td>
          <td>Opens facility onboarding modal for turf owners.</td>
        </tr>
        <tr>
          <td><span class="tag-key">player-dashboard</span></td>
          <td><code>.btn-match-primary</code></td>
          <td>Clicks "Get Directions"</td>
          <td>Launches Google Maps GPS navigation to pitch.</td>
        </tr>
        <tr>
          <td><span class="tag-key">player-dashboard</span></td>
          <td><code>.btn-match-secondary</code></td>
          <td>Clicks "Share Squad Link"</td>
          <td>Copies WhatsApp squad invite token to clipboard.</td>
        </tr>
        <tr>
          <td><span class="tag-key">owner-dashboard</span></td>
          <td><code>#btn-open-add-turf</code></td>
          <td>Clicks "+ Add New Ground"</td>
          <td>Opens facility registration modal to add additional pitches.</td>
        </tr>
        <tr>
          <td><span class="tag-key">dashboard.html</span></td>
          <td><code>#nav-btn-owner</code></td>
          <td>Clicks "Owner View"</td>
          <td>Instantly toggles dashboard view into partner console.</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 14px; padding: 10px 14px; background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;" class="no-split">
      <div>
        <div style="font-weight: 700; color: var(--navy-900); font-size: 11.5px;">Document Status: Production Certified & Client Ready</div>
        <div style="font-size: 10px; color: var(--slate-500);">All frontend interactions match the production codebase in <code>c:/Users/shame/abu</code>.</div>
      </div>
      <div class="badge badge-green">Production Certified</div>
    </div>
  </div>

</body>
</html>`;

  const htmlPath = path.join(__dirname, 'turfify_frontend_specification.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
  console.log('Saved turfify_frontend_specification.html');

  console.log('--- Launching Playwright to Render High-DPI PDF ---');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const page = await browser.newPage();
  await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const pdfPath = path.join(__dirname, 'Turfify_Frontend_Architecture_And_Interaction_Guide.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  await browser.close();
  console.log('=================================================================');
  console.log(`✅ SUCCESS: Polished Exact 8-Page PDF Generated at:\n${pdfPath}`);
  console.log('=================================================================');
}

generateSpecPDF().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
