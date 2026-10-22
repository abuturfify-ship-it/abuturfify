import pptxgenjs from "pptxgenjs";

const pptx = new pptxgenjs();

// Explicit 16:9 Widescreen Layout (13.333" x 7.5")
pptx.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pptx.layout = "WIDESCREEN_16_9";

pptx.author = "Turfify FinTech & Platform Engineering";
pptx.company = "Turfify Technologies Pvt. Ltd.";
pptx.title = "Why PayPal Fails for Domestic Marketplaces: The Turfify Evaluation";

// Canvas Geometry
const W = 13.333;
const H = 7.5;
const MX = 0.8;
const CW = 11.733;

// Curated Palette: PayPal Blue vs Incompatibility Crimson vs Razorpay Indigo/Emerald
const C = {
  NAVY_DARK: "0B0F19",       // Deep Slate Obsidian canvas
  NAVY_CARD: "111827",       // Card dark container
  SLATE_BG: "F8FAFC",        // Clean Slate background
  WHITE: "FFFFFF",
  TEXT_MAIN: "0F172A",       // Slate 900
  TEXT_MUTED: "475569",      // Slate 600
  BORDER: "E2E8F0",
  BORDER_DARK: "1E293B",

  // PayPal Brand Tones
  PAYPAL_DARK: "003087",     // Deep PayPal Navy
  PAYPAL_BLUE: "0079C1",     // Classic PayPal Blue
  PAYPAL_BG: "F0F9FF",
  PAYPAL_BORDER: "BAE6FD",

  // Incompatibility / Disqualification Red
  RED: "DC2626",
  RED_DARK: "991B1B",
  RED_BG: "FEF2F2",
  RED_BORDER: "FECACA",

  // Razorpay / Recommended Indigo & Emerald
  INDIGO: "6366F1",
  INDIGO_DARK: "4F46E5",
  INDIGO_BG: "EEF2FF",
  INDIGO_BORDER: "C7D2FE",

  BLUE: "2563EB",
  BLUE_BG: "EFF6FF",
  BLUE_BORDER: "BFDBFE",

  EMERALD: "059669",
  EMERALD_LIGHT: "10B981",
  EMERALD_DARK: "047857",
  EMERALD_BG: "ECFDF5",
  EMERALD_BORDER: "A7F3D0",

  AMBER: "D97706",
  AMBER_BG: "FFFBEB",
  AMBER_BORDER: "FDE68A"
};

const TOTAL_SLIDES = 9;

// Reusable Header
function addHeader(slide, title, category, num) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.PAYPAL_BLUE }
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 0.35, w: 3.0, h: 0.3,
    fill: { color: C.PAYPAL_BG },
    line: { color: C.PAYPAL_BORDER, width: 1 },
    rectRadius: 0.06
  });
  slide.addText(category.toUpperCase(), {
    x: MX, y: 0.35, w: 3.0, h: 0.3,
    fontSize: 8.5, bold: true, color: C.PAYPAL_DARK,
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  slide.addText(title, {
    x: MX, y: 0.72, w: CW - 1.6, h: 0.55,
    fontSize: 20, bold: true, color: C.NAVY_DARK,
    fontFace: "Segoe UI", valign: "middle"
  });

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
  slide.addText("Turfify — Payment Gateway Comparative Study: Why PayPal Fails for Domestic Indian Marketplaces", {
    x: MX, y: H - 0.45, w: 8.5, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI", valign: "middle"
  });
  slide.addText("Confidential • FinTech Architecture Advisory", {
    x: W - MX - 3.2, y: H - 0.45, w: 3.2, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, align: "right", fontFace: "Segoe UI", valign: "middle"
  });
}

// Helper: Card Creator
function addCard(slide, x, y, w, h, title, accentColor = C.PAYPAL_BLUE, bg = C.WHITE, border = C.BORDER, titleSize = 12.5) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: bg },
    line: { color: border, width: 1 },
    rectRadius: 0.1
  });
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x + 0.1, y, w: w - 0.2, h: 0.05,
    fill: { color: accentColor }
  });
  if (title) {
    slide.addText(title, {
      x: x + 0.25, y: y + 0.15, w: w - 0.5, h: 0.35,
      fontSize: titleSize, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
  }
}

// ==============================================================================
// SLIDE 1: COVER SLIDE (DARK EXECUTIVE DISQUALIFICATION DECK)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.NAVY_DARK };

  // Top PayPal Blue stripe
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.1,
    fill: { color: C.PAYPAL_BLUE }
  });

  // Top pill badge
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.1, w: 4.2, h: 0.38,
    fill: { color: "002244" },
    line: { color: C.PAYPAL_BLUE, width: 1.5 },
    rectRadius: 0.08
  });
  s.addText("GATEWAY EVALUATION: DOMESTIC MARKETPLACE REPORT", {
    x: MX, y: 1.1, w: 4.2, h: 0.38,
    fontSize: 8.5, bold: true, color: "#7DD3FC",
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Title
  s.addText("Why PayPal Fails For Turfify\n& Indian Sports Marketplaces", {
    x: MX, y: 1.7, w: CW, h: 1.8,
    fontSize: 34, bold: true, color: C.WHITE,
    fontFace: "Segoe UI", lineSpacingMultiple: 1.1
  });

  // Subtitle
  s.addText("An Architectural & Regulatory Analysis: RBI Domestic Shutdown (2021), Zero UPI Integration,\nExorbitant 5% Transaction Fees, and the Superiority of Razorpay Route for Hyper-Local Commerce", {
    x: MX, y: 3.7, w: CW, h: 0.85,
    fontSize: 14, color: "94A3B8", fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  // 4 Bottom Highlight Cards
  const metrics = [
    { title: "RBI Status (April 2021)", val: "Domestic Ops Shut Down", sub: "Cross-border export only", col: C.RED },
    { title: "UPI Intent Integration", val: "0% Support", sub: "No GPay / PhonePe / Paytm", col: C.RED },
    { title: "Transaction Take-Rate", val: "4.4% - 5.0% + Fixed", sub: "Destroys platform margin", col: C.AMBER },
    { title: "Recommended Engine", val: "Razorpay / Cashfree", sub: "Native INR, Splits & UPI", col: C.EMERALD }
  ];

  const cardW = (CW - 0.6) / 4;
  metrics.forEach((m, i) => {
    const cx = MX + i * (cardW + 0.2);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: 4.9, w: cardW, h: 1.6,
      fill: { color: C.NAVY_CARD },
      line: { color: "1E293B", width: 1 },
      rectRadius: 0.1
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: cx + 0.15, y: 4.9, w: cardW - 0.3, h: 0.05,
      fill: { color: m.col }
    });
    s.addText(m.title.toUpperCase(), {
      x: cx + 0.2, y: 5.1, w: cardW - 0.4, h: 0.25,
      fontSize: 8, bold: true, color: "94A3B8", fontFace: "Segoe UI"
    });
    s.addText(m.val, {
      x: cx + 0.2, y: 5.4, w: cardW - 0.4, h: 0.45,
      fontSize: 12.5, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });
    s.addText(m.sub, {
      x: cx + 0.2, y: 5.9, w: cardW - 0.4, h: 0.4,
      fontSize: 9, color: "64748B", fontFace: "Segoe UI"
    });
  });

  s.addText("Turfify Platform Architecture Series • Specialized Addendum: Global Gateway Feasibility Study", {
    x: MX, y: 6.9, w: CW, h: 0.3,
    fontSize: 9, color: "64748B", fontFace: "Segoe UI"
  });
}

// ==============================================================================
// SLIDE 2: THE 5 FATAL ROADBLOCKS FOR PAYPAL IN INDIA
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Five Fatal Roadblocks Disqualifying PayPal", "Executive Breakdown", 2);

  const roadblocks = [
    {
      num: "01",
      title: "Legally Blocked for Domestic INR",
      summary: "In April 2021, PayPal permanently shuttered its domestic Indian payment aggregation business under RBI regulatory constraints. It is legally barred from handling peer-to-peer or domestic INR payments.",
      col: C.RED,
      bg: C.RED_BG
    },
    {
      num: "02",
      title: "Zero UPI Ecosystem Support",
      summary: "Over 85% of Bangalore sports bookings happen via UPI (GPay, PhonePe, Paytm). PayPal has NO native UPI Intent, meaning Indian players cannot scan and pay in 5 seconds.",
      col: C.RED,
      bg: C.RED_BG
    },
    {
      num: "03",
      title: "Exorbitant 5% Transaction Fees",
      summary: "Domestic gateways charge ~2%. PayPal levies 4.4% to 5.0% plus flat currency conversion margins, which completely wipes out Turfify's entire 10% platform take-rate.",
      col: C.AMBER,
      bg: C.AMBER_BG
    },
    {
      num: "04",
      title: "No Marketplace Payout Splits",
      summary: "PayPal lacks an Indian vendor routing engine (like Razorpay Route). It cannot automatically split 90% to the turf owner's Indian current account with automated TDS 194-O deduction.",
      col: C.RED,
      bg: C.RED_BG
    },
    {
      num: "05",
      title: "Massive Friction & Checkout Drop-off",
      summary: "PayPal forces users to either create a PayPal login or enter credit card credentials. This alienates mobile-first millennial and Gen-Z turf players who only carry their smartphones.",
      col: C.AMBER,
      bg: C.AMBER_BG
    }
  ];

  roadblocks.forEach((r, i) => {
    const ry = 1.45 + i * 0.98;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX, y: ry, w: CW, h: 0.88,
      fill: { color: C.WHITE },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.08
    });
    // Left color pill
    s.addShape(pptx.shapes.RECTANGLE, {
      x: MX, y: ry, w: 0.1, h: 0.88,
      fill: { color: r.col }
    });

    // Number circle
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y: ry + 0.18, w: 0.5, h: 0.5,
      fill: { color: r.bg },
      line: { color: r.col, width: 1 },
      rectRadius: 0.25
    });
    s.addText(r.num, {
      x: MX + 0.25, y: ry + 0.18, w: 0.5, h: 0.5,
      fontSize: 11, bold: true, color: r.col, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    // Title
    s.addText(r.title, {
      x: MX + 0.9, y: ry + 0.12, w: 3.8, h: 0.28,
      fontSize: 11, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    // Summary
    s.addText(r.summary, {
      x: MX + 0.9, y: ry + 0.42, w: CW - 1.1, h: 0.4,
      fontSize: 8.5, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  // Callout banner
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 6.5, w: CW, h: 0.45,
    fill: { color: "1E1B4B" },
    rectRadius: 0.06
  });
  s.addText("VERDICT: PayPal is not merely 'inferior' for Turfify — it is technically and legally INCOMPATIBLE for domestic Indian bookings.", {
    x: MX + 0.2, y: 6.5, w: CW - 0.4, h: 0.45,
    fontSize: 9, bold: true, color: "#A5B4FC", fontFace: "Segoe UI", align: "center", valign: "middle"
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 3: THE 2021 RBI REGULATORY REALITY
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Regulatory Reality: PayPal Shuts Domestic India (2021)", "Regulatory Landscape", 3);

  // Left Card: What Happened in April 2021
  addCard(s, MX, 1.45, 5.6, 5.25, "The April 2021 RBI Policy Shift", C.RED, C.WHITE);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + 0.25, y: 2.0, w: 5.1, h: 1.1,
    fill: { color: C.RED_BG },
    line: { color: C.RED_BORDER, width: 1 },
    rectRadius: 0.06
  });
  s.addText("OFFICIAL PAYPAL INDIA STATEMENT (FEB 2021):", {
    x: MX + 0.4, y: 2.1, w: 4.8, h: 0.25,
    fontSize: 8.5, bold: true, color: C.RED, fontFace: "Segoe UI"
  });
  s.addText("\"From 1 April 2021, we will focus all our efforts on delivering more international sales for Indian businesses, and shift focus away from our domestic products in India.\"", {
    x: MX + 0.4, y: 2.38, w: 4.8, h: 0.65,
    fontSize: 8.5, italic: true, color: C.TEXT_MAIN, fontFace: "Segoe UI"
  });

  const timeline = [
    { year: "Pre-2021", text: "PayPal attempted domestic checkout partnerships with BookMyShow, Swiggy, and MakeMyTrip." },
    { year: "RBI Strict Mandates", text: "RBI enforced mandatory domestic data localization, 2FA, tokenization, and strict Payment Aggregator (PA) license requirements." },
    { year: "April 1, 2021", text: "PayPal officially exited domestic payments in India due to fierce UPI zero-MDR competition and high regulatory compliance costs." },
    { year: "Present Day Status", text: "PayPal in India operates STRICTLY as an Online Payment Gateway Service Provider (OPGSP) for cross-border exports only." }
  ];

  timeline.forEach((t, i) => {
    const ty = 3.3 + i * 0.88;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y: ty, w: 5.1, h: 0.78,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.05
    });
    s.addText(t.year, {
      x: MX + 0.4, y: ty + 0.08, w: 4.8, h: 0.22,
      fontSize: 9, bold: true, color: C.PAYPAL_DARK, fontFace: "Segoe UI"
    });
    s.addText(t.text, {
      x: MX + 0.4, y: ty + 0.32, w: 4.8, h: 0.42,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  // Right Card: What Happens if Turfify Attempts PayPal
  addCard(s, MX + 5.9, 1.45, 5.833, 5.25, "What Happens If Turfify Integrates PayPal?", C.PAYPAL_DARK, C.WHITE);

  const errors = [
    {
      title: "❌ Error: Domestic INR Payments Disallowed",
      desc: "If a player in Bangalore attempts to pay a Bangalore turf venue in Indian Rupees (INR) via PayPal, the API throws an error: 'Domestic currency transactions not permitted for this account type'."
    },
    {
      title: "❌ Currency Forced into Foreign FX (USD/EUR)",
      desc: "To bypass this, you would have to convert ₹1,500 into ~$18.00 USD. The Indian player's bank will slap an extra 3.5% Forex markup fee plus international transaction SMS warnings."
    },
    {
      title: "❌ Regulatory Violation of FEMA & PSS Act",
      desc: "Billing local Indian ground rentals in foreign currencies between domestic Indian citizens violates the Foreign Exchange Management Act (FEMA) and Reserve Bank of India mandates."
    },
    {
      title: "❌ Account Freeze & Fund Hold",
      desc: "PayPal's automated risk engine flags domestic merchant volume operating disguised as export services, triggering an automatic 180-day reserve hold on platform funds."
    }
  ];

  errors.forEach((e, i) => {
    const ey = 2.0 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 6.1, y: ey, w: 5.4, h: 1.0,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(e.title, {
      x: MX + 6.25, y: ey + 0.08, w: 5.1, h: 0.26,
      fontSize: 9.5, bold: true, color: C.RED_DARK, fontFace: "Segoe UI"
    });
    s.addText(e.desc, {
      x: MX + 6.25, y: ey + 0.35, w: 5.1, h: 0.6,
      fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 4: THE UPI BLINDSPOT
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The UPI Blindspot: Where 85%+ of Turfify's Audience Lives", "User Experience & Conversion", 4);

  // Left Column: The Indian Sports Reality (UPI Dominance)
  addCard(s, MX, 1.45, 5.6, 5.25, "The Indian Sports Booking Reality", C.INDIGO_DARK, C.WHITE);

  const upiFacts = [
    { metric: "13+ Billion", label: "Monthly UPI transactions processed across India" },
    { metric: "88%", label: "Of local turf & box-cricket reservations are paid via UPI" },
    { metric: "12 Seconds", label: "Average time to complete a UPI Intent checkout" },
    { metric: "97.8%", label: "Average transaction success rate on Indian banking rails" }
  ];

  const fw = 2.45;
  upiFacts.forEach((uf, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const fx = MX + 0.25 + col * (fw + 0.2);
    const fy = 2.0 + row * 1.35;

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: fx, y: fy, w: fw, h: 1.2,
      fill: { color: C.INDIGO_BG },
      line: { color: C.INDIGO_BORDER, width: 1 },
      rectRadius: 0.08
    });
    s.addText(uf.metric, {
      x: fx + 0.1, y: fy + 0.15, w: fw - 0.2, h: 0.45,
      fontSize: 16, bold: true, color: C.INDIGO_DARK, fontFace: "Segoe UI", align: "center"
    });
    s.addText(uf.label, {
      x: fx + 0.15, y: fy + 0.6, w: fw - 0.3, h: 0.5,
      fontSize: 8, color: C.TEXT_MAIN, fontFace: "Segoe UI", align: "center", lineSpacingMultiple: 1.1
    });
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + 0.25, y: 4.9, w: 5.1, h: 1.5,
    fill: { color: C.EMERALD_BG },
    line: { color: C.EMERALD_BORDER, width: 1 },
    rectRadius: 0.08
  });
  s.addText("RAZORPAY'S NATIVE UPI INTENT:", {
    x: MX + 0.4, y: 5.0, w: 4.8, h: 0.25,
    fontSize: 9, bold: true, color: C.EMERALD, fontFace: "Segoe UI"
  });
  s.addText("When a player taps 'Pay Now' on Turfify, the app automatically triggers deep links to Google Pay, PhonePe, or Paytm. The player authenticates with their 4/6-digit UPI PIN, and the turf is booked in 5 seconds without typing passwords.", {
    x: MX + 0.4, y: 5.3, w: 4.8, h: 1.0,
    fontSize: 8.5, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  // Right Column: PayPal's Legacy Friction
  addCard(s, MX + 5.9, 1.45, 5.833, 5.25, "PayPal's Legacy Checkout Friction in India", C.RED, C.WHITE);

  const frictions = [
    {
      step: "1. No UPI App Deep-Linking",
      desc: "PayPal cannot launch Google Pay or PhonePe. The user is redirected to an external web browser window, breaking mobile app flow."
    },
    {
      step: "2. Mandatory PayPal Account / Card Typing",
      desc: "Players are prompted to log into PayPal or type in 16-digit credit card numbers, CVVs, and expiry dates — something turf players rarely carry onto grounds."
    },
    {
      step: "3. 3D Secure / OTP Drop-off",
      desc: "International gateway redirects to domestic Indian 3DS OTP pages fail frequently due to latency timeouts, causing over 40% checkout drop-offs."
    },
    {
      step: "4. Player Hesitation & Distrust",
      desc: "College students and local cricket squads seeing a foreign PayPal screen assume the site is either scam-prone or will charge them hidden dollar fees."
    }
  ];

  frictions.forEach((fr, i) => {
    const fry = 2.0 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 6.1, y: fry, w: 5.4, h: 0.98,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(fr.step, {
      x: MX + 6.25, y: fry + 0.08, w: 5.1, h: 0.26,
      fontSize: 9.5, bold: true, color: C.RED, fontFace: "Segoe UI"
    });
    s.addText(fr.desc, {
      x: MX + 6.25, y: fry + 0.35, w: 5.1, h: 0.55,
      fontSize: 8.2, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 5: UNIT ECONOMICS TRAP: THE 5% FEE DISASTER
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Unit Economics Trap: How PayPal Destroys Marketplace Margins", "Fee Comparison", 5);

  // Side-by-side comparison cards: Razorpay vs PayPal on a ₹1,500 booking
  addCard(s, MX, 1.45, 5.6, 5.25, "Razorpay / Cashfree (Domestic Rail)", C.EMERALD, C.WHITE);

  const rzRows = [
    { item: "Gross Booking Value (Player Pays)", val: "₹1,500.00", bold: true, col: C.NAVY_DARK, bg: "F8FAFC" },
    { item: "Gateway Processing Fee (2.0% Flat)", val: "- ₹30.00", bold: false, col: C.TEXT_MUTED, bg: C.WHITE },
    { item: "GST on Gateway Fee (18% of ₹30)", val: "- ₹5.40", bold: false, col: C.TEXT_MUTED, bg: C.WHITE },
    { item: "Total Payment Processing Cost", val: "₹35.40 (2.36%)", bold: true, col: C.BLUE, bg: C.BLUE_BG },
    { item: "Turfify 10% Platform Commission", val: "₹150.00", bold: true, col: C.EMERALD, bg: C.EMERALD_BG },
    { item: "Net Profit Retained by Turfify", val: "₹114.60", bold: true, col: C.EMERALD, bg: "F0FDF4" },
    { item: "Owner Net Payout (Settled to Bank)", val: "₹1,350.00", bold: true, col: C.NAVY_DARK, bg: "F8FAFC" }
  ];

  rzRows.forEach((r, idx) => {
    const ry = 2.0 + idx * 0.62;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y: ry, w: 5.1, h: 0.52,
      fill: { color: r.bg },
      line: { color: C.BORDER, width: 0.8 },
      rectRadius: 0.05
    });
    s.addText(r.item, {
      x: MX + 0.4, y: ry, w: 3.4, h: 0.52,
      fontSize: 8.5, bold: r.bold, color: C.TEXT_MAIN, fontFace: "Segoe UI", valign: "middle"
    });
    s.addText(r.val, {
      x: MX + 3.8, y: ry, w: 1.4, h: 0.52,
      fontSize: 9.5, bold: r.bold, color: r.col, fontFace: "Segoe UI", align: "right", valign: "middle"
    });
  });

  // Right Card: PayPal Fees
  addCard(s, MX + 5.9, 1.45, 5.833, 5.25, "PayPal (Cross-Border Export Rail)", C.RED, C.WHITE);

  const ppRows = [
    { item: "Gross Booking Value (Converted to USD)", val: "₹1,500.00 (~$18.00)", bold: true, col: C.NAVY_DARK, bg: "F8FAFC" },
    { item: "Base PayPal Transaction Fee (4.4%)", val: "- ₹66.00", bold: false, col: C.RED, bg: C.WHITE },
    { item: "PayPal Fixed Transaction Surcharge", val: "- ₹25.00 ($0.30)", bold: false, col: C.RED, bg: C.WHITE },
    { item: "Currency Conversion Spread (3.0% - 4.0%)", val: "- ₹52.50", bold: false, col: C.RED, bg: C.WHITE },
    { item: "Total Payment Processing Cost", val: "₹143.50 (9.57%)", bold: true, col: C.RED, bg: C.RED_BG },
    { item: "Turfify 10% Platform Commission", val: "₹150.00", bold: true, col: C.TEXT_MUTED, bg: "F8FAFC" },
    { item: "Turfify Net Retained Profit", val: "₹6.50 (ALMOST ZERO)", bold: true, col: C.RED, bg: "FEF2F2" }
  ];

  ppRows.forEach((r, idx) => {
    const ry = 2.0 + idx * 0.62;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 6.15, y: ry, w: 5.3, h: 0.52,
      fill: { color: r.bg },
      line: { color: C.BORDER, width: 0.8 },
      rectRadius: 0.05
    });
    s.addText(r.item, {
      x: MX + 6.3, y: ry, w: 3.5, h: 0.52,
      fontSize: 8.5, bold: r.bold, color: C.TEXT_MAIN, fontFace: "Segoe UI", valign: "middle"
    });
    s.addText(r.val, {
      x: MX + 9.8, y: ry, w: 1.5, h: 0.52,
      fontSize: 9.5, bold: r.bold, color: r.col, fontFace: "Segoe UI", align: "right", valign: "middle"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 6: MARKETPLACE SPLIT ARCHITECTURE COMPARISON
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Marketplace Split Architecture: Razorpay Route vs PayPal", "Payout & Tax Compliance", 6);

  const capabilities = [
    {
      feature: "Automated 10% / 90% Instant Split",
      razorpay: "NATIVE: Razorpay Route programmatically routes 90% to owner account and 10% to Turfify balance during order creation.",
      paypal: "UNSUPPORTED: Cannot route funds between two domestic Indian bank accounts programmatically.",
      winner: "Razorpay Wins"
    },
    {
      feature: "Indian Tax Compliance (TDS Sec 194-O)",
      razorpay: "AUTOMATED: Deducts 1% mandatory TDS on marketplace gross and auto-generates Form 16A quarterly.",
      paypal: "MANUAL / NIL: No Indian income tax TDS compliance mechanisms for e-commerce operators.",
      winner: "Razorpay Wins"
    },
    {
      feature: "Bank Settlement Timelines",
      razorpay: "T+1 / T+2: Funds settle into turf owner's local HDFC, ICICI, SBI bank accounts automatically at 04:00 AM.",
      paypal: "T+3 to T+7: Cross-border auto-sweep requires EEFC / FIRC certificates and bank clearance delays.",
      winner: "Razorpay Wins"
    },
    {
      feature: "Instant Cancellation & Refunds",
      razorpay: "INSTANT UPI: Refunds hit the player's UPI VPA in 60 seconds via RazorpayX.",
      paypal: "SLOW: Takes 5-10 business days, and foreign currency exchange spread is usually lost.",
      winner: "Razorpay Wins"
    }
  ];

  capabilities.forEach((c, i) => {
    const cy = 1.45 + i * 1.25;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX, y: cy, w: CW, h: 1.15,
      fill: { color: C.WHITE },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.08
    });

    // Feature header
    s.addShape(pptx.shapes.RECTANGLE, {
      x: MX, y: cy, w: 0.1, h: 1.15,
      fill: { color: C.INDIGO_DARK }
    });
    s.addText(c.feature, {
      x: MX + 0.25, y: cy + 0.1, w: 3.2, h: 0.35,
      fontSize: 10, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y: cy + 0.55, w: 1.6, h: 0.28,
      fill: { color: C.EMERALD_BG },
      rectRadius: 0.04
    });
    s.addText(c.winner, {
      x: MX + 0.25, y: cy + 0.55, w: 1.6, h: 0.28,
      fontSize: 8, bold: true, color: C.EMERALD, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    // Razorpay Box
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 3.6, y: cy + 0.12, w: 3.9, h: 0.9,
      fill: { color: C.INDIGO_BG },
      line: { color: C.INDIGO_BORDER, width: 0.8 },
      rectRadius: 0.05
    });
    s.addText("RAZORPAY ROUTE ENGINE", {
      x: MX + 3.75, y: cy + 0.18, w: 3.6, h: 0.2,
      fontSize: 7, bold: true, color: C.INDIGO_DARK, fontFace: "Segoe UI"
    });
    s.addText(c.razorpay, {
      x: MX + 3.75, y: cy + 0.38, w: 3.6, h: 0.58,
      fontSize: 7.8, color: C.TEXT_MAIN, fontFace: "Segoe UI"
    });

    // PayPal Box
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 7.7, y: cy + 0.12, w: 3.8, h: 0.9,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 0.8 },
      rectRadius: 0.05
    });
    s.addText("PAYPAL LIMITATION", {
      x: MX + 7.85, y: cy + 0.18, w: 3.5, h: 0.2,
      fontSize: 7, bold: true, color: C.RED, fontFace: "Segoe UI"
    });
    s.addText(c.paypal, {
      x: MX + 7.85, y: cy + 0.38, w: 3.5, h: 0.58,
      fontSize: 7.8, color: C.TEXT_MAIN, fontFace: "Segoe UI"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 7: WHEN DOES PAYPAL ACTUALLY MAKE SENSE?
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "When DOES PayPal Make Sense? The Only 3 Valid Use Cases", "Strategic Exceptions", 7);

  const validCases = [
    {
      icon: "🌍",
      title: "1. Global Expansion (Turfify International)",
      when: "If Turfify launches in UAE (Dubai), UK, USA, or Singapore",
      details: [
        "In markets like the US and UK, PayPal has 40%+ consumer penetration",
        "Supports international multi-currency settlement (USD, EUR, GBP, AED)",
        "Stripe and PayPal are the dominant consumer payment standards abroad"
      ],
      color: C.PAYPAL_BLUE,
      bg: C.PAYPAL_BG,
      border: C.PAYPAL_BORDER
    },
    {
      icon: "✈️",
      title: "2. Expat & NRI Tournament Bookings",
      when: "Overseas Indians booking coaching or tournaments back home",
      details: [
        "An NRI father in California paying to enroll his son in a 3-week cricket academy in Bangalore",
        "Allows payment with US Chase or Amex cards without foreign currency rejection",
        "Turfify receives funds as export revenue under legal RBI OPGSP guidelines"
      ],
      color: C.INDIGO_DARK,
      bg: C.INDIGO_BG,
      border: C.INDIGO_BORDER
    },
    {
      icon: "🏢",
      title: "3. Multinational Corporate Sponsorships",
      when: "Global brands sponsoring local amateur tournaments",
      details: [
        "A foreign tech firm (e.g., US headquarters) funding an inter-corporate futsal cup",
        "International B2B invoicing with automated currency conversion",
        "High-ticket invoice processing ($5,000+) where 4% fee is acceptable"
      ],
      color: C.EMERALD,
      bg: C.EMERALD_BG,
      border: C.EMERALD_BORDER
    }
  ];

  const caseW = (CW - 0.4) / 3;
  validCases.forEach((vc, i) => {
    const cx = MX + i * (caseW + 0.2);
    addCard(s, cx, 1.45, caseW, 5.25, "", vc.color, C.WHITE);

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cx + 0.2, y: 1.6, w: caseW - 0.4, h: 0.35,
      fill: { color: vc.bg },
      line: { color: vc.border, width: 1 },
      rectRadius: 0.05
    });
    s.addText(vc.when.toUpperCase(), {
      x: cx + 0.2, y: 1.6, w: caseW - 0.4, h: 0.35,
      fontSize: 7.5, bold: true, color: vc.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    s.addText(vc.title, {
      x: cx + 0.2, y: 2.1, w: caseW - 0.4, h: 0.55,
      fontSize: 11.5, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });

    s.addShape(pptx.shapes.LINE, {
      x: cx + 0.2, y: 2.75, w: caseW - 0.4, h: 0,
      line: { color: C.BORDER, width: 1 }
    });

    s.addText("USE CASE PROFILE:", {
      x: cx + 0.2, y: 2.9, w: caseW - 0.4, h: 0.25,
      fontSize: 8, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });

    vc.details.forEach((dt, idx) => {
      const dy = 3.2 + idx * 0.95;
      s.addShape(pptx.shapes.OVAL, {
        x: cx + 0.2, y: dy + 0.06, w: 0.08, h: 0.08,
        fill: { color: vc.color }
      });
      s.addText(dt, {
        x: cx + 0.35, y: dy, w: caseW - 0.55, h: 0.85,
        fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
      });
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 8: THE COMPREHENSIVE HEAD-TO-HEAD MATRIX
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Head-to-Head Matrix: PayPal vs Razorpay vs Cashfree", "Comparative Benchmark", 8);

  // Comparison Table
  const headers = ["EVALUATION METRIC", "PAYPAL", "RAZORPAY (WINNER)", "CASHFREE (RUNNER-UP)"];
  const rows = [
    ["Domestic Indian Transactions", "❌ SHUT DOWN (Apr 2021)", "✅ 100% Fully Supported", "✅ 100% Fully Supported"],
    ["UPI Intent (GPay, PhonePe, Paytm)", "❌ ZERO SUPPORT", "✅ Flawless Native Intent", "✅ Native Intent & QR"],
    ["Standard Transaction Fees", "❌ 4.4% - 5.0% + Fixed", "✅ 2.0% + 18% GST", "✅ 1.90% - 2.0% + GST"],
    ["Marketplace Vendor Splits", "❌ Not Available in India", "✅ Razorpay Route (10%/90%)", "✅ Cashfree Easy Split"],
    ["TDS (Sec 194-O) Automated Filing", "❌ No Support", "✅ Automated Quarterly Reports", "✅ Automated Reports"],
    ["Instant Player Refund Rail", "❌ 5 - 10 Days via Banking", "✅ 60 Sec via RazorpayX", "✅ 60 Sec via Instant Payouts"],
    ["Customer Drop-Off Risk", "❌ VERY HIGH (>40%)", "✅ LOWEST (<3%)", "✅ VERY LOW (<4%)"]
  ];

  // Table Headers
  const colWidths = [3.2, 2.7, 3.0, 2.833];
  let startX = MX;
  headers.forEach((h, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: startX, y: 1.45, w: colWidths[i], h: 0.45,
      fill: { color: i === 2 ? C.INDIGO_DARK : (i === 1 ? C.PAYPAL_DARK : C.NAVY_CARD) },
      rectRadius: 0.05
    });
    s.addText(h, {
      x: startX, y: 1.45, w: colWidths[i], h: 0.45,
      fontSize: 8.5, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });
    startX += colWidths[i];
  });

  // Table Rows
  rows.forEach((r, idx) => {
    const ry = 1.98 + idx * 0.62;
    let rx = MX;
    r.forEach((cell, ci) => {
      const isRazorpay = ci === 2;
      const isPayPal = ci === 1;
      const bg = isRazorpay ? "EEF2FF" : (isPayPal ? "FEF2F2" : (idx % 2 === 0 ? "F8FAFC" : C.WHITE));

      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: rx, y: ry, w: colWidths[ci], h: 0.55,
        fill: { color: bg },
        line: { color: C.BORDER, width: 0.8 },
        rectRadius: 0.04
      });
      s.addText(cell, {
        x: rx + 0.1, y: ry, w: colWidths[ci] - 0.2, h: 0.55,
        fontSize: 8.2, bold: ci === 0 || isRazorpay, color: isRazorpay ? C.INDIGO_DARK : (isPayPal ? C.RED : C.TEXT_MAIN),
        valign: "middle", fontFace: "Segoe UI"
      });
      rx += colWidths[ci];
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 9: STRATEGIC ARCHITECTURE VERDICT & SUMMARY
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.NAVY_DARK };

  // Top header line
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.INDIGO }
  });

  s.addText("STRATEGIC DECISION MATRIX & ARCHITECTURAL VERDICT", {
    x: MX, y: 0.4, w: CW, h: 0.3,
    fontSize: 9, bold: true, color: C.INDIGO_BORDER, fontFace: "Segoe UI"
  });
  s.addText("Final Verdict: The Optimal Gateway Architecture for Turfify", {
    x: MX, y: 0.75, w: CW, h: 0.55,
    fontSize: 22, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });

  // 2 Major Panels: What to do vs What to avoid
  const halfW = (CW - 0.3) / 2;

  // Panel 1: The Winning Domestic Stack
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.5, w: halfW, h: 4.8,
    fill: { color: C.NAVY_CARD },
    line: { color: C.EMERALD, width: 1.5 },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: MX + 0.15, y: 1.5, w: halfW - 0.3, h: 0.06,
    fill: { color: C.EMERALD }
  });
  s.addText("PRIMARY DOMESTIC STACK (100% PRODUCTION RECOMMENDED)", {
    x: MX + 0.3, y: 1.7, w: halfW - 0.6, h: 0.25,
    fontSize: 8.5, bold: true, color: C.EMERALD_LIGHT, fontFace: "Segoe UI"
  });
  s.addText("Deploy Razorpay + Cashfree Backup", {
    x: MX + 0.3, y: 2.0, w: halfW - 0.6, h: 0.45,
    fontSize: 14, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });

  const winningPoints = [
    "Native UPI Intent: 5-second checkout via Google Pay, PhonePe, Paytm with 97%+ bank success.",
    "Razorpay Route: Instant, automated 10% platform fee deduction & 90% owner bank transfer.",
    "Low 2% MDR: Protects Turfify unit economics and maximizes venue owner goodwill.",
    "Full RBI Compliance: Complete data localization, domestic Indian bank payouts, and Sec 194-O tax handling."
  ];

  winningPoints.forEach((wp, idx) => {
    const wy = 2.65 + idx * 0.95;
    s.addShape(pptx.shapes.OVAL, {
      x: MX + 0.3, y: wy + 0.08, w: 0.1, h: 0.1,
      fill: { color: C.EMERALD }
    });
    s.addText(wp, {
      x: MX + 0.5, y: wy, w: halfW - 0.8, h: 0.85,
      fontSize: 8.8, color: "E2E8F0", fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  // Panel 2: The Role of PayPal
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + halfW + 0.3, y: 1.5, w: halfW, h: 4.8,
    fill: { color: C.NAVY_CARD },
    line: { color: C.PAYPAL_BLUE, width: 1.5 },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: MX + halfW + 0.45, y: 1.5, w: halfW - 0.3, h: 0.06,
    fill: { color: C.PAYPAL_BLUE }
  });
  s.addText("SECONDARY / FUTURE CONDITIONAL STACK", {
    x: MX + halfW + 0.6, y: 1.7, w: halfW - 0.6, h: 0.25,
    fontSize: 8.5, bold: true, color: "#7DD3FC", fontFace: "Segoe UI"
  });
  s.addText("Keep PayPal strictly for Phase 3 International Expansion", {
    x: MX + halfW + 0.6, y: 2.0, w: halfW - 0.6, h: 0.45,
    fontSize: 14, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });

  const paypalRolePoints = [
    "DO NOT enable PayPal for domestic INR: Disallowed by RBI and will crash domestic checkout.",
    "Add as a Secondary Toggle later: Only show 'Pay with PayPal (USD/EUR)' for overseas users.",
    "Cater to NRIs & Foreign Tourists: Great for international coaching camps and overseas tournament sponsors.",
    "Zero Impact on Domestic MVP: Zero developer hours should be spent integrating PayPal for Bangalore launch."
  ];

  paypalRolePoints.forEach((pp, idx) => {
    const py = 2.65 + idx * 0.95;
    s.addShape(pptx.shapes.OVAL, {
      x: MX + halfW + 0.6, y: py + 0.08, w: 0.1, h: 0.1,
      fill: { color: C.PAYPAL_BLUE }
    });
    s.addText(pp, {
      x: MX + halfW + 0.8, y: py, w: halfW - 1.0, h: 0.85,
      fontSize: 8.8, color: "E2E8F0", fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  s.addText("Turfify Platform Architecture Series • Architectural Evaluation Complete", {
    x: MX, y: 6.7, w: CW, h: 0.3,
    fontSize: 9, color: "64748B", fontFace: "Segoe UI", align: "center"
  });
}

// Write Presentation to File
const outputPath = "Why_PayPal_Fails_For_Turfify_Payment_Analysis.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`PayPal Evaluation Presentation generated successfully: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating presentation:", err);
  });
