import pptxgenjs from "pptxgenjs";

const pptx = new pptxgenjs();

// 16:9 Widescreen Layout (13.333" x 7.5")
pptx.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pptx.layout = "WIDESCREEN_16_9";

pptx.author = "Turfify Sports Engineering";
pptx.company = "Turfify Tech Inc.";
pptx.title = "Turfify Dual-Role Architecture & Database Systems Blueprint";

// Geometry
const W = 13.333;
const H = 7.5;
const MX = 0.8;
const CW = 11.733;

// Turfify Brand Color Palette
const C = {
  NAVY_DARK: "0B132B",
  NAVY_CARD: "131D33",
  SLATE_BG: "F8FAFC",
  WHITE: "FFFFFF",
  TEXT_MAIN: "0F172A",
  TEXT_MUTED: "475569",
  BORDER: "E2E8F0",
  CARD_BG: "FFFFFF",

  // Brand Accents
  GREEN: "10B981",
  GREEN_DARK: "059669",
  GREEN_BG: "ECFDF5",
  GREEN_BORDER: "A7F3D0",

  ORANGE: "EA580C",
  ORANGE_DARK: "C2410C",
  ORANGE_BG: "FFF7ED",
  ORANGE_BORDER: "FFEDD5",

  BLUE: "2563EB",
  BLUE_BG: "EFF6FF",
  BLUE_BORDER: "BFDBFE",

  TEAL: "0D9488",
  TEAL_BG: "F0FDFA",
  TEAL_BORDER: "99F6E4",

  RED: "DC2626",
  RED_BG: "FEF2F2"
};

const TOTAL_SLIDES = 10;

// Reusable Header
function addHeader(slide, title, category, num) {
  // Top brand gradient line
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.GREEN }
  });

  // Category Tag Box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 0.35, w: 2.6, h: 0.3,
    fill: { color: C.GREEN_BG },
    line: { color: C.GREEN_BORDER, width: 1 },
    rectRadius: 0.06
  });
  slide.addText(category.toUpperCase(), {
    x: MX, y: 0.35, w: 2.6, h: 0.3,
    fontSize: 9, bold: true, color: C.GREEN_DARK,
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Slide Title
  slide.addText(title, {
    x: MX, y: 0.72, w: CW - 1.5, h: 0.55,
    fontSize: 20, bold: true, color: C.NAVY_DARK,
    fontFace: "Segoe UI", valign: "middle"
  });

  // Slide Number Pill
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: W - MX - 1.2, y: 0.45, w: 1.2, h: 0.32,
    fill: { color: "F1F5F9" },
    line: { color: C.BORDER, width: 1 },
    rectRadius: 0.06
  });
  slide.addText(`SLIDE ${num} / ${TOTAL_SLIDES}`, {
    x: W - MX - 1.2, y: 0.45, w: 1.2, h: 0.32,
    fontSize: 8.5, bold: true, color: C.TEXT_MUTED,
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });
}

// Reusable Footer
function addFooter(slide) {
  slide.addShape(pptx.shapes.LINE, {
    x: MX, y: H - 0.5, w: CW, h: 0,
    line: { color: C.BORDER, width: 1 }
  });
  slide.addText("Turfify — Dual-Role Platform Architecture & Database Integration Blueprint", {
    x: MX, y: H - 0.45, w: 8.0, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI", valign: "middle"
  });
  slide.addText("Confidential • Sports Marketplace Engineering", {
    x: W - MX - 3.5, y: H - 0.45, w: 3.5, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, align: "right", fontFace: "Segoe UI", valign: "middle"
  });
}

// Helper: Card Creator
function addCard(slide, x, y, w, h, title, accentColor = C.GREEN, bg = C.WHITE, border = C.BORDER) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: bg },
    line: { color: border, width: 1 },
    rectRadius: 0.1
  });
  // Top accent strip
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x + 0.1, y, w: w - 0.2, h: 0.05,
    fill: { color: accentColor }
  });
  if (title) {
    slide.addText(title, {
      x: x + 0.25, y: y + 0.15, w: w - 0.5, h: 0.35,
      fontSize: 13, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
  }
}

// ==============================================================================
// SLIDE 1: COVER SLIDE (DARK PREMIUM)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.NAVY_DARK };

  // Decorative glows
  s.addShape(pptx.shapes.OVAL, {
    x: W - 4.5, y: -1.0, w: 5.5, h: 5.5,
    fill: { color: "132247" },
    line: { color: "1D3557", width: 1 }
  });

  // Platform Badge
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.6, w: 3.2, h: 0.4,
    fill: { color: "064E3B" },
    line: { color: C.GREEN, width: 1.5 },
    rectRadius: 0.08
  });
  s.addText("TURFIFY ARCHITECTURE BLUEPRINT", {
    x: MX, y: 1.6, w: 3.2, h: 0.4,
    fontSize: 10, bold: true, color: "34D399",
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Main Title
  s.addText("Dual-Role Marketplace\nArchitecture & Database Systems", {
    x: MX, y: 2.2, w: 9.5, h: 1.6,
    fontSize: 34, bold: true, color: C.WHITE,
    fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  // Subtitle
  s.addText("Engineering a complete separation of concerns between Turf Owners (B2B Management)\nand Players (B2C Match Discovery) with real-time PostgreSQL synchronization.", {
    x: MX, y: 3.95, w: 9.0, h: 0.85,
    fontSize: 13, color: "94A3B8", fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  // Feature Pillars
  const pillars = [
    { label: "B2B CONSOLE", desc: "Dynamic Slot Engine & Ledger", color: C.ORANGE },
    { label: "B2C PLAYER HUB", desc: "Instant Booking & Digital Passes", color: C.GREEN },
    { label: "DATABASE ENGINE", desc: "Supabase Postgres + RLS Security", color: C.BLUE }
  ];

  pillars.forEach((p, i) => {
    const px = MX + i * 3.8;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: px, y: 5.2, w: 3.5, h: 1.1,
      fill: { color: C.NAVY_CARD },
      line: { color: "233554", width: 1 },
      rectRadius: 0.08
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: px + 0.15, y: 5.2, w: 0.08, h: 1.1,
      fill: { color: p.color }
    });
    s.addText(p.label, {
      x: px + 0.35, y: 5.35, w: 3.0, h: 0.25,
      fontSize: 10, bold: true, color: p.color, fontFace: "Segoe UI"
    });
    s.addText(p.desc, {
      x: px + 0.35, y: 5.65, w: 3.0, h: 0.45,
      fontSize: 11, color: "E2E8F0", fontFace: "Segoe UI"
    });
  });
}

// ==============================================================================
// SLIDE 2: THE DUAL-ROLE PARADIGM & SYSTEM PHILOSOPHY
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Dual-Role Paradigm: Two Separate Worlds in One Platform", "System Foundations", 2);

  // Left Column: Turf Owner
  addCard(s, MX, 1.5, 5.7, 5.1, "🏟️ The Turf Owner Experience (B2B Partner)", C.ORANGE, C.WHITE);
  s.addText([
    { text: "Primary Persona: ", options: { bold: true, color: C.NAVY_DARK } },
    { text: "Ground Manager / Turf Facility Entrepreneur\n\n", options: { color: C.TEXT_MUTED } },
    { text: "Core Business Goal:\n", options: { bold: true, color: C.NAVY_DARK } },
    { text: "Maximize slot occupancy rate, reduce ground idle time, record walk-in cash players, and reconcile weekly direct bank settlements.\n\n", options: { color: C.TEXT_MUTED } },
    { text: "Key Interaction Flow:\n", options: { bold: true, color: C.NAVY_DARK } },
    { text: "• Checks 16-hour live timetable grid (6 AM - 11 PM)\n", options: { color: C.TEXT_MUTED } },
    { text: "• Blocks slots for maintenance, heavy rains, or coaching camps\n", options: { color: C.TEXT_MUTED } },
    { text: "• Logs instant offline walk-ins without creating double-booking errors\n", options: { color: C.TEXT_MUTED } },
    { text: "• Tracks daily turnover and gross payout amounts", options: { color: C.TEXT_MUTED } }
  ], {
    x: MX + 0.3, y: 2.1, w: 5.1, h: 4.2,
    fontSize: 10.5, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  // Right Column: Player
  addCard(s, MX + 6.0, 1.5, 5.7, 5.1, "⚽ The Player Experience (B2C Consumer)", C.GREEN, C.WHITE);
  s.addText([
    { text: "Primary Persona: ", options: { bold: true, color: C.NAVY_DARK } },
    { text: "Recreational Football, Cricket & Badminton Athletes\n\n", options: { color: C.TEXT_MUTED } },
    { text: "Core Consumer Goal:\n", options: { bold: true, color: C.NAVY_DARK } },
    { text: "Find nearby high-quality turfs, secure the preferred game time slot with friends, split match costs, and arrive hassle-free.\n\n", options: { color: C.TEXT_MUTED } },
    { text: "Key Interaction Flow:\n", options: { bold: true, color: C.NAVY_DARK } },
    { text: "• Filters grounds by sport, location, price, and customer rating\n", options: { color: C.TEXT_MUTED } },
    { text: "• Books available green slot with instant online digital advance payment\n", options: { color: C.TEXT_MUTED } },
    { text: "• Shares squad invite link via WhatsApp with pitch details & directions\n", options: { color: C.TEXT_MUTED } },
    { text: "• Displays digital QR ground pass at reception for instant entry", options: { color: C.TEXT_MUTED } }
  ], {
    x: MX + 6.3, y: 2.1, w: 5.1, h: 4.2,
    fontSize: 10.5, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 3: TURF OWNER DASHBOARD DEEP DIVE
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Turf Owner Console: Operations, Slots & Revenue Management", "Owner Architecture", 3);

  // 4 Modular Cards representing the 4 components of owner dashboard
  const cards = [
    {
      title: "1. Business Metrics & KPIs",
      color: C.ORANGE,
      items: [
        "Today's Turnover (₹9,600 live tracking)",
        "Ground Occupancy Rate (75% of day slots filled)",
        "Active Grounds status (Pitches A & B operational)",
        "Player Footfall Counter (42 Online + Walk-in players)"
      ]
    },
    {
      title: "2. Live Slot Matrix Grid",
      color: C.GREEN,
      items: [
        "Interactive 1-hour blocks from morning till night",
        "Color-coded state machine: Available, Booked, Walk-in",
        "Instant toggle: 1-click conversion from available to walk-in",
        "Admin override: Lock slots for ground maintenance"
      ]
    },
    {
      title: "3. Ground Portfolio Management",
      color: C.BLUE,
      items: [
        "Facility registration: Sport category, pitch dimensions",
        "Dynamic rate control: Peak night rates vs off-peak rates",
        "Amenities declaration: Floodlights, bibs, shower, parking",
        "High-definition court photography gallery"
      ]
    },
    {
      title: "4. Customer Ledger & Settlement",
      color: C.TEAL,
      items: [
        "Complete historical booking ledger with contact phones",
        "Payment channel breakdown (UPI/Card vs Cash Counter)",
        "Weekly automated bank payout calculations",
        "Platform fee deduction audit & tax invoices"
      ]
    }
  ];

  cards.forEach((c, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const cx = MX + col * 5.95;
    const cy = 1.45 + row * 2.65;

    addCard(s, cx, cy, 5.75, 2.45, c.title, c.color);
    
    const textArr = c.items.map(it => ({ text: `• ${it}\n`, options: { color: C.TEXT_MUTED } }));
    s.addText(textArr, {
      x: cx + 0.3, y: cy + 0.55, w: 5.15, h: 1.7,
      fontSize: 10, fontFace: "Segoe UI", lineSpacingMultiple: 1.25
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 4: PLAYER / CUSTOMER DASHBOARD DEEP DIVE
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Player Portal: Gamification, Match Countdown & Booking History", "Player Experience", 4);

  // Left Feature Card: Hero Kickoff Card
  addCard(s, MX, 1.45, 6.2, 5.15, "⚽ The Hero Match Countdown Card", C.GREEN);
  s.addText([
    { text: "Central Anchor of the Player Experience\n\n", options: { bold: true, color: C.NAVY_DARK } },
    { text: "When a player logs in, the very first visual is their imminent game:\n", options: { color: C.TEXT_MUTED } },
    { text: "• Dynamic Countdown Badge: ", options: { bold: true, color: C.NAVY_DARK } },
    { text: "'Next Kickoff in 4 Hours'\n", options: { color: C.GREEN_DARK } },
    { text: "• Venue & Pitch Identifier: ", options: { bold: true, color: C.NAVY_DARK } },
    { text: "The Arena Sports Hub — Pitch A (7v7 Football)\n", options: { color: C.TEXT_MUTED } },
    { text: "• Geolocation Link: ", options: { bold: true, color: C.NAVY_DARK } },
    { text: "1-Tap Google Maps navigation button directly to the ground\n", options: { color: C.TEXT_MUTED } },
    { text: "• Squad WhatsApp Share: ", options: { bold: true, color: C.NAVY_DARK } },
    { text: "Copies match invite code & kickoff time for team group chat\n", options: { color: C.TEXT_MUTED } },
    { text: "• Digital QR Access Pass: ", options: { bold: true, color: C.NAVY_DARK } },
    { text: "Eliminates counter arguments; verified instant check-in", options: { color: C.TEXT_MUTED } }
  ], {
    x: MX + 0.3, y: 2.05, w: 5.6, h: 4.3,
    fontSize: 10, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  // Right Top: Gamification & Stats
  addCard(s, MX + 6.5, 1.45, 5.2, 2.45, "🏆 Player Stats & Loyalty Points", C.BLUE);
  s.addText([
    { text: "• Matches Played: ", options: { bold: true } },
    { text: "18 matches (Ranked top 5% active in Bangalore)\n", options: { color: C.TEXT_MUTED } },
    { text: "• Turfify Coins: ", options: { bold: true } },
    { text: "450 pts earned (Redeemable for ₹200 off next match)\n", options: { color: C.TEXT_MUTED } },
    { text: "• Preferred Sport Tag: ", options: { bold: true } },
    { text: "Curates recommendations for FIFA-certified astroturfs", options: { color: C.TEXT_MUTED } }
  ], {
    x: MX + 6.8, y: 2.0, w: 4.6, h: 1.7,
    fontSize: 9.5, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  // Right Bottom: Booking History & Rebook
  addCard(s, MX + 6.5, 4.15, 5.2, 2.45, "📋 Booked Slots & 1-Click Rebooking", C.TEAL);
  s.addText([
    { text: "• Real-Time Reservation Ledger: ", options: { bold: true } },
    { text: "Tracks confirmed, upcoming, and completed slots\n", options: { color: C.TEXT_MUTED } },
    { text: "• Self-Service Cancellation: ", options: { bold: true } },
    { text: "1-Click cancellation compliant with refund cut-off rules\n", options: { color: C.TEXT_MUTED } },
    { text: "• Saved Venues Quick-Rebook: ", options: { bold: true } },
    { text: "Book favorite regular turfs without searching again", options: { color: C.TEXT_MUTED } }
  ], {
    x: MX + 6.8, y: 4.7, w: 4.6, h: 1.7,
    fontSize: 9.5, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 5: SIDE-BY-SIDE FEATURE COMPARISON MATRIX
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Architectural Comparison: Turf Owner vs Player Experience", "Comparative Analysis", 5);

  const tableData = [
    [
      { text: "Dimension", options: { bold: true, fill: { color: C.NAVY_DARK }, color: C.WHITE } },
      { text: "🏟️ Turf Owner Console", options: { bold: true, fill: { color: C.ORANGE }, color: C.WHITE } },
      { text: "⚽ Player / Gamer Portal", options: { bold: true, fill: { color: C.GREEN_DARK }, color: C.WHITE } }
    ],
    [
      { text: "Core Purpose", options: { bold: true, color: C.NAVY_DARK } },
      { text: "Maximize slot revenue, manage grounds & operations", options: { color: C.TEXT_MUTED } },
      { text: "Discover venues, book match slots, rally friends", options: { color: C.TEXT_MUTED } }
    ],
    [
      { text: "Primary Screen", options: { bold: true, color: C.NAVY_DARK } },
      { text: "16-Hour Dynamic Timetable Matrix & Gross Turnover", options: { color: C.TEXT_MUTED } },
      { text: "Hero Kickoff Countdown Card & Venue Map Link", options: { color: C.TEXT_MUTED } }
    ],
    [
      { text: "Slot Control", options: { bold: true, color: C.NAVY_DARK } },
      { text: "Mark offline walk-ins, block slots for maintenance", options: { color: C.TEXT_MUTED } },
      { text: "Select green slots, pay advance deposit online", options: { color: C.TEXT_MUTED } }
    ],
    [
      { text: "Financial Data", options: { bold: true, color: C.NAVY_DARK } },
      { text: "Daily revenue, weekly bank payouts, platform commission", options: { color: C.TEXT_MUTED } },
      { text: "Slot receipts, loyalty coins, match pass downloads", options: { color: C.TEXT_MUTED } }
    ],
    [
      { text: "Catalog Action", options: { bold: true, color: C.NAVY_DARK } },
      { text: "Register new grounds, set hourly rates & peak pricing", options: { color: C.TEXT_MUTED } },
      { text: "Filter by location, sport, rating, and amenities", options: { color: C.TEXT_MUTED } }
    ],
    [
      { text: "Access Security", options: { bold: true, color: C.NAVY_DARK } },
      { text: "Restricted to verified turf owners via RLS policies", options: { color: C.TEXT_MUTED } },
      { text: "Open consumer authentication with personal privacy", options: { color: C.TEXT_MUTED } }
    ]
  ];

  s.addTable(tableData, {
    x: MX, y: 1.5, w: CW, h: 5.0,
    fontSize: 9.5, fontFace: "Segoe UI",
    border: { pt: 1, color: C.BORDER },
    fill: { color: C.WHITE },
    valign: "middle"
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 6: DATABASE SCHEMA & ROW-LEVEL SECURITY (SUPABASE)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Relational Database Schema & Role Segregation (PostgreSQL)", "Database Architecture", 6);

  // 4 Entity Box Representations
  const entities = [
    {
      table: "1. profiles (auth.users)",
      desc: "User identity & dual roles",
      fields: ["id (UUID, Primary Key)", "role ('owner' | 'player')", "full_name, phone_number", "business_name (if owner)"],
      color: C.BLUE
    },
    {
      table: "2. turfs (Facilities)",
      desc: "Ground catalogs per owner",
      fields: ["id, owner_id (FK profiles.id)", "name, sport_type, location", "price_per_hour (Peak/Off-peak)", "amenities (Array), image_urls"],
      color: C.ORANGE
    },
    {
      table: "3. slots (Hourly Matrix)",
      desc: "Live schedule per ground",
      fields: ["id, turf_id (FK turfs.id)", "slot_date, start_time, end_time", "status ('available', 'booked', 'blocked')", "is_walkin (Boolean)"],
      color: C.GREEN
    },
    {
      table: "4. bookings (Reservations)",
      desc: "Player transactional ledger",
      fields: ["id, slot_id, turf_id, player_id", "total_amount, platform_fee", "payment_status ('paid', 'counter')", "entry_pass_code, created_at"],
      color: C.TEAL
    }
  ];

  entities.forEach((e, idx) => {
    const ex = MX + idx * 2.95;
    addCard(s, ex, 1.45, 2.85, 3.4, e.table, e.color);
    s.addText(e.desc, {
      x: ex + 0.15, y: 1.95, w: 2.55, h: 0.3,
      fontSize: 8.5, italic: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });

    const fieldTxt = e.fields.map(f => ({ text: `• ${f}\n`, options: { color: C.NAVY_DARK } }));
    s.addText(fieldTxt, {
      x: ex + 0.15, y: 2.3, w: 2.55, h: 2.3,
      fontSize: 8.5, fontFace: "Consolas", lineSpacingMultiple: 1.2
    });
  });

  // Bottom RLS Banner
  addCard(s, MX, 5.05, CW, 1.65, "🛡️ PostgreSQL Row Level Security (RLS) Policy Architecture", C.RED, "FEF2F2", "FECACA");
  s.addText([
    { text: "Strict Multi-Tenant Isolation: ", options: { bold: true, color: C.RED } },
    { text: "Owners must NEVER see another facility's revenue or customer phone directory.\n", options: { color: C.NAVY_DARK } },
    { text: "• Owner Policy: ", options: { bold: true } },
    { text: "CREATE POLICY 'owner_manage_own' ON turfs FOR ALL USING (auth.uid() = owner_id);\n", options: { fontFace: "Consolas" } },
    { text: "• Player Policy: ", options: { bold: true } },
    { text: "CREATE POLICY 'player_read_turfs' ON turfs FOR SELECT USING (true); -- Public ground discovery\n", options: { fontFace: "Consolas" } },
    { text: "• Booking Policy: ", options: { bold: true } },
    { text: "CREATE POLICY 'player_own_bookings' ON bookings FOR ALL USING (auth.uid() = player_id);", options: { fontFace: "Consolas" } }
  ], {
    x: MX + 0.3, y: 5.5, w: CW - 0.6, h: 1.05,
    fontSize: 9, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 7: END-TO-END SYSTEM ARCHITECTURE DIAGRAM
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "System Architecture: Front-End, Auth Gatekeeper & Backend", "System Topology", 7);

  // 3-Tier Layer Architecture Diagram
  const layers = [
    {
      title: "TIER 1: PRESENTATION & CLIENT HUBS (DECOUPLED FRONTENDS)",
      y: 1.45, h: 1.55,
      color: C.GREEN,
      blocks: [
        { label: "Turfify Public Portal\n(index.html)\nPublic Discovery & Booking", w: 3.5, color: C.GREEN_DARK },
        { label: "Player / Gamer Hub\n(player-dashboard.html)\nPasses, Squad Link, Stats", w: 3.5, color: C.BLUE },
        { label: "Turf Owner Console\n(owner-dashboard.html)\nLive Slots, Walk-ins, Ledger", w: 3.5, color: C.ORANGE }
      ]
    },
    {
      title: "TIER 2: AUTHENTICATION GATEWAY & ROLE ROUTING",
      y: 3.25, h: 1.45,
      color: C.BLUE,
      blocks: [
        { label: "Supabase Auth Gateway\n(Phone OTP / Social OAuth)\nSession Cookie & Refresh Token", w: 4.5, color: C.BLUE },
        { label: "JWT Token Engine & Role Claims Guard\nclaims.role == 'owner' ➔ /owner-dashboard.html\nclaims.role == 'player' ➔ /player-dashboard.html", w: 6.2, color: C.TEAL }
      ]
    },
    {
      title: "TIER 3: PERSISTENCE, ROW-LEVEL SECURITY & PUB/SUB REALTIME",
      y: 4.95, h: 1.7,
      color: C.NAVY_DARK,
      blocks: [
        { label: "PostgreSQL Database Engine\nRLS multi-tenant data isolation\nprofiles | turfs | slots | bookings", w: 3.6, color: C.NAVY_DARK },
        { label: "Realtime WebSocket Engine\nInstant slot status broadcast\n(Available ➔ Walk-in ➔ Booked)", w: 3.6, color: C.ORANGE },
        { label: "Storage & Settlement Engine\nTurf photos, entry passes QR\nAutomated bank payouts pipeline", w: 3.6, color: C.GREEN_DARK }
      ]
    }
  ];

  layers.forEach(l => {
    slideSection(s, l);
  });

  function slideSection(slide, l) {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX, y: l.y, w: CW, h: l.h,
      fill: { color: C.WHITE },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.08
    });
    // Label tag
    slide.addText(l.title, {
      x: MX + 0.25, y: l.y + 0.1, w: 8.0, h: 0.25,
      fontSize: 8.5, bold: true, color: l.color, fontFace: "Segoe UI"
    });

    let curX = MX + 0.3;
    l.blocks.forEach(b => {
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: curX, y: l.y + 0.42, w: b.w, h: l.h - 0.58,
        fill: { color: C.SLATE_BG },
        line: { color: C.BORDER, width: 1 },
        rectRadius: 0.06
      });
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: curX + 0.1, y: l.y + 0.42, w: b.w - 0.2, h: 0.04,
        fill: { color: b.color }
      });
      slide.addText(b.label, {
        x: curX + 0.1, y: l.y + 0.48, w: b.w - 0.2, h: l.h - 0.68,
        fontSize: 9, bold: true, color: C.NAVY_DARK, align: "center", valign: "middle", fontFace: "Segoe UI"
      });
      curX += b.w + 0.45;
    });
  }

  addFooter(s);
}

// ==============================================================================
// SLIDE 8: REALTIME SLOT SYNCHRONIZATION LIFECYCLE
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Zero Conflict Engine: Real-Time Synchronization Lifecycle", "Data Flow Lifecycle", 8);

  const steps = [
    {
      num: "01",
      title: "Discovery & Selection",
      actor: "PLAYER DEVICE",
      desc: "Player browses turf catalog and selects Friday 7:00 PM slot for ₹1,200 at Arena Hub.",
      state: "Slot Status: Available 🟢",
      action: "Initiates checkout intent",
      color: C.GREEN
    },
    {
      num: "02",
      title: "Optimistic DB Lock",
      actor: "DATABASE GATEKEEPER",
      desc: "PostgreSQL applies a temporary 5-minute row lock to prevent other players from grabbing the same slot.",
      state: "Slot Status: Holding 🟡",
      action: "UPI / Card gateway open",
      color: C.BLUE
    },
    {
      num: "03",
      title: "Webhook & Commit",
      actor: "PAYMENT WEBHOOK",
      desc: "Payment succeeds. Webhook commits transaction into bookings table, updates slot to 'booked', issues Pass QR.",
      state: "Slot Status: Booked 🔴",
      action: "Revenue ledger credited",
      color: C.RED
    },
    {
      num: "04",
      title: "Realtime WebSocket Push",
      actor: "TURF OWNER CONSOLE",
      desc: "Supabase Realtime sends WebSocket event. Owner's screen and other players' views turn slot RED without page reload!",
      state: "Broadcast: postgres_changes",
      action: "Zero double-booking error",
      color: C.ORANGE
    }
  ];

  steps.forEach((st, idx) => {
    const sx = MX + idx * 2.98;
    addCard(s, sx, 1.45, 2.8, 5.15, `${st.num}. ${st.title}`, st.color);

    // Actor Pill
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: sx + 0.2, y: 1.95, w: 2.4, h: 0.28,
      fill: { color: C.SLATE_BG },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.04
    });
    s.addText(st.actor, {
      x: sx + 0.2, y: 1.95, w: 2.4, h: 0.28,
      fontSize: 7.5, bold: true, color: st.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    // State Badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: sx + 0.2, y: 2.35, w: 2.4, h: 0.38,
      fill: { color: "F1F5F9" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.05
    });
    s.addText(st.state, {
      x: sx + 0.2, y: 2.35, w: 2.4, h: 0.38,
      fontSize: 8.5, bold: true, color: C.NAVY_DARK, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    // Description
    s.addText(st.desc, {
      x: sx + 0.2, y: 2.9, w: 2.4, h: 1.9,
      fontSize: 9.5, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });

    // Action footer inside card
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: sx + 0.2, y: 5.85, w: 2.4, h: 0.45,
      fill: { color: st.color },
      rectRadius: 0.05
    });
    s.addText(`✔ ${st.action}`, {
      x: sx + 0.2, y: 5.85, w: 2.4, h: 0.45,
      fontSize: 8, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 9: STEP-BY-STEP SUPABASE INTEGRATION ROADMAP
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Implementation Playbook: Connecting Turfify to Supabase", "Integration Playbook", 9);

  const phases = [
    {
      phase: "Phase 1: Project & Database Provisioning",
      items: [
        "Create Supabase project (Free Tier or Shared Postgres prefix)",
        "Run migration script for tables: profiles, turfs, slots, bookings",
        "Enable Row Level Security (RLS) on all tables with strict tenant isolation"
      ],
      color: C.BLUE
    },
    {
      phase: "Phase 2: Authentication & Role Router",
      items: [
        "Include @supabase/supabase-js CDN script in index.html and dashboards",
        "Configure custom user metadata: user_metadata: { role: 'owner' | 'player' }",
        "Direct auth callback redirect to player-dashboard.html or owner-dashboard.html"
      ],
      color: C.GREEN
    },
    {
      phase: "Phase 3: Store Engine Adapter Swap",
      items: [
        "Replace store.js localStorage CRUD functions with Supabase query builder",
        "turfs: supabase.from('turfs').select('*').eq('owner_id', user.id)",
        "bookings: supabase.from('bookings').insert([bookingData])"
      ],
      color: C.ORANGE
    },
    {
      phase: "Phase 4: Realtime Subscription Listening",
      items: [
        "Subscribe to slot changes: supabase.channel('public:slots').on('postgres_changes', ...)",
        "Automatically re-color slot matrix when offline walk-in is created by owner",
        "Live revenue counter increment when players pay online"
      ],
      color: C.TEAL
    }
  ];

  phases.forEach((p, idx) => {
    const py = 1.45 + idx * 1.32;
    addCard(s, MX, py, CW, 1.2, p.phase, p.color);
    const txt = p.items.map(it => ({ text: `• ${it}    `, options: { color: C.TEXT_MUTED } }));
    s.addText(txt, {
      x: MX + 0.3, y: py + 0.45, w: CW - 0.6, h: 0.65,
      fontSize: 9, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 10: EXECUTIVE CONCLUSION & STRATEGIC VALUE
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.NAVY_DARK };

  // Top header for dark slide
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.GREEN }
  });
  s.addText("STRATEGIC OUTCOMES & PLATFORM VALUE", {
    x: MX, y: 0.6, w: CW, h: 0.3,
    fontSize: 10, bold: true, color: "34D399", fontFace: "Segoe UI"
  });
  s.addText("Why Strict Dual-Role Separation Drives Turfify Growth", {
    x: MX, y: 0.95, w: CW, h: 0.6,
    fontSize: 22, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });

  const values = [
    {
      title: "1. For Turf Owners: Peace of Mind",
      desc: "Eliminates counter friction and phone chaos. Owners gain an automated revenue ledger, preventing walk-in double booking and ensuring guaranteed weekly bank payouts.",
      color: C.ORANGE
    },
    {
      title: "2. For Players: Zero Hassle Kickoffs",
      desc: "Gamified match tracking, clear countdowns, instant digital entry passes, and WhatsApp team coordination turn match night into a frictionless sports experience.",
      color: C.GREEN
    },
    {
      title: "3. For Engineering: Bulletproof Architecture",
      desc: "Decoupled portals with PostgreSQL Row-Level Security guarantee that consumer accounts and business consoles never compromise data confidentiality or scalability.",
      color: C.BLUE
    }
  ];

  values.forEach((v, idx) => {
    const vy = 1.9 + idx * 1.65;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX, y: vy, w: CW, h: 1.45,
      fill: { color: C.NAVY_CARD },
      line: { color: "233554", width: 1 },
      rectRadius: 0.08
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: MX + 0.15, y: vy, w: 0.08, h: 1.45,
      fill: { color: v.color }
    });
    s.addText(v.title, {
      x: MX + 0.45, y: vy + 0.2, w: CW - 1.0, h: 0.3,
      fontSize: 13, bold: true, color: v.color, fontFace: "Segoe UI"
    });
    s.addText(v.desc, {
      x: MX + 0.45, y: vy + 0.55, w: CW - 1.0, h: 0.75,
      fontSize: 10.5, color: "CBD5E1", fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });
  });

  // Footer for dark slide
  s.addShape(pptx.shapes.LINE, {
    x: MX, y: H - 0.5, w: CW, h: 0,
    line: { color: "233554", width: 1 }
  });
  s.addText("Turfify — Next Generation Sports Marketplace Architecture • 2026", {
    x: MX, y: H - 0.45, w: CW, h: 0.35,
    fontSize: 8.5, color: "64748B", fontFace: "Segoe UI", valign: "middle"
  });
}

// Write Presentation
const fileName = "Turfify_Dual_Role_Architecture_Master.pptx";
pptx.writeFile({ fileName })
  .then(() => {
    console.log(`Presentation successfully generated: ${fileName}`);
  })
  .catch((err) => {
    console.error("Error generating presentation:", err);
  });
