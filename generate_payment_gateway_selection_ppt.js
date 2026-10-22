import pptxgenjs from "pptxgenjs";

const pptx = new pptxgenjs();

// Explicit 16:9 Widescreen Layout (13.333" x 7.5")
pptx.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pptx.layout = "WIDESCREEN_16_9";

pptx.author = "Turfify FinTech & Platform Engineering";
pptx.company = "Turfify Technologies Pvt. Ltd.";
pptx.title = "Payment Gateway Selection: Why Razorpay is the #1 Best Choice for Turfify";

// Canvas Geometry
const W = 13.333;
const H = 7.5;
const MX = 0.8;
const CW = 11.733;

// Stripe / Razorpay Fintech Palette
const C = {
  NAVY_DARK: "0B0F19",       // Deep Slate Obsidian canvas
  NAVY_CARD: "111827",       // Card dark container
  SLATE_BG: "F8FAFC",        // Clean Slate background
  WHITE: "FFFFFF",
  TEXT_MAIN: "0F172A",       // Slate 900
  TEXT_MUTED: "475569",      // Slate 600
  BORDER: "E2E8F0",
  BORDER_DARK: "1E293B",

  // Razorpay Royal Blue & Indigo
  RAZORPAY_BLUE: "0C2340",
  BLUE: "2563EB",            // Royal Blue 600
  BLUE_LIGHT: "3B82F6",
  BLUE_BG: "EFF6FF",
  BLUE_BORDER: "BFDBFE",

  INDIGO: "6366F1",
  INDIGO_DARK: "4F46E5",
  INDIGO_BG: "EEF2FF",
  INDIGO_BORDER: "C7D2FE",

  EMERALD: "059669",
  EMERALD_LIGHT: "10B981",
  EMERALD_BG: "ECFDF5",
  EMERALD_BORDER: "A7F3D0",

  AMBER: "D97706",
  AMBER_BG: "FFFBEB",
  AMBER_BORDER: "FDE68A",

  RED: "DC2626",
  RED_BG: "FEF2F2",
  RED_BORDER: "FECACA"
};

const TOTAL_SLIDES = 8;

// Universal Slide Header
function addHeader(slide, title, category, num) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.BLUE }
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 0.35, w: 3.2, h: 0.3,
    fill: { color: C.BLUE_BG },
    line: { color: C.BLUE_BORDER, width: 1 },
    rectRadius: 0.06
  });
  slide.addText(category.toUpperCase(), {
    x: MX, y: 0.35, w: 3.2, h: 0.3,
    fontSize: 8.5, bold: true, color: C.BLUE,
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

// Universal Slide Footer
function addFooter(slide) {
  slide.addShape(pptx.shapes.LINE, {
    x: MX, y: H - 0.5, w: CW, h: 0,
    line: { color: C.BORDER, width: 1 }
  });
  slide.addText("Turfify — Payment Gateway Comparative Benchmark: Why Razorpay Wins", {
    x: MX, y: H - 0.45, w: 8.5, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI", valign: "middle"
  });
  slide.addText("Confidential • FinTech Platform Architecture", {
    x: W - MX - 3.2, y: H - 0.45, w: 3.2, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, align: "right", fontFace: "Segoe UI", valign: "middle"
  });
}

// Card Helper
function addCard(slide, x, y, w, h, title, accentColor = C.BLUE, bg = C.WHITE, border = C.BORDER, titleSize = 12.5) {
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
// SLIDE 1: COVER SLIDE (DARK FINTECH LUXURY)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.NAVY_DARK };

  // Top Royal Blue accent bar
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.1,
    fill: { color: C.BLUE }
  });

  // Top pill badge
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.1, w: 4.2, h: 0.38,
    fill: { color: "1E293B" },
    line: { color: C.BLUE_LIGHT, width: 1.5 },
    rectRadius: 0.08
  });
  s.addText("TURFIFY FINTECH DECISION MATRIX • MODULE 05", {
    x: MX, y: 1.1, w: 4.2, h: 0.38,
    fontSize: 8.5, bold: true, color: "#93C5FD",
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Title
  s.addText("Payment Gateway Selection:\nWhy Razorpay is #1 for Turfify", {
    x: MX, y: 1.7, w: CW, h: 1.8,
    fontSize: 34, bold: true, color: C.WHITE,
    fontFace: "Segoe UI", lineSpacingMultiple: 1.1
  });

  // Subtitle
  s.addText("Evaluating Razorpay vs. Cashfree, PhonePe, Stripe India & Paytm:\nMarketplace Splits (10%/90%), UPI Success Rates, 60-Sec Instant Refunds & Production Blueprint", {
    x: MX, y: 3.7, w: CW, h: 0.85,
    fontSize: 14, color: "94A3B8", fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  // 4 Feature Cards at the bottom
  const metrics = [
    { title: "THE OUTRIGHT WINNER", val: "Razorpay 🥇", sub: "Marketplace standard in India", col: C.EMERALD },
    { title: "MARKETPLACE SPLIT", val: "Razorpay Route", sub: "Automated 10% fee & 90% payout", col: C.BLUE },
    { title: "UPI DOMINANCE", val: "98% Success Rate", sub: "Native GPay, PhonePe, Paytm", col: C.INDIGO },
    { title: "INSTANT REFUNDS", val: "60-Second UPI", sub: "RazorpayX payout rail", col: C.AMBER }
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
      fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });
    s.addText(m.sub, {
      x: cx + 0.2, y: 5.9, w: cardW - 0.4, h: 0.4,
      fontSize: 9, color: "64748B", fontFace: "Segoe UI"
    });
  });

  s.addText("Turfify Platform Architecture Series • Specialized Addendum: Strategic Payment Gateway Selection", {
    x: MX, y: 6.9, w: CW, h: 0.3,
    fontSize: 9, color: "64748B", fontFace: "Segoe UI"
  });
}

// ==============================================================================
// SLIDE 2: THE 4 REASONS WHY RAZORPAY WINS
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Verdict: Why Razorpay is the Outright Winner", "Executive Decision", 2);

  const pillars = [
    {
      num: "01",
      icon: "🔀",
      title: "Razorpay Route",
      subtitle: "Built Specifically for Marketplaces",
      color: C.BLUE,
      bg: C.BLUE_BG,
      border: C.BLUE_BORDER,
      points: [
        "Most gateways only pay ONE bank account",
        "Route automatically splits each payment at checkout",
        "Instantly sends 10% to Turfify & 90% to the Turf Owner",
        "Automates Section 194-O TDS tax compliance"
      ]
    },
    {
      num: "02",
      icon: "📱",
      title: "UPI Dominance",
      subtitle: "98% Transaction Success Rate",
      color: C.INDIGO_DARK,
      bg: C.INDIGO_BG,
      border: C.INDIGO_BORDER,
      points: [
        "85%+ of sports bookings in India happen via UPI",
        "Opens Google Pay, PhonePe, or Paytm in 5 seconds",
        "No typing 16-digit card numbers or waiting for SMS",
        "Highest authorization success rate across Indian banks"
      ]
    },
    {
      num: "03",
      icon: "⚡",
      title: "RazorpayX Payouts",
      subtitle: "60-Second Instant Refunds",
      color: C.EMERALD,
      bg: C.EMERALD_BG,
      border: C.EMERALD_BORDER,
      points: [
        "Rainout or match cancelled? Player gets money in 60s",
        "Standard banking refunds make players wait 5 to 7 days",
        "Direct IMPS / UPI transfer straight to player's account",
        "Eliminates 90% of customer support complaints"
      ]
    },
    {
      num: "04",
      icon: "💻",
      title: "Developer First",
      subtitle: "Battle-Tested Node.js SDK & Webhooks",
      color: C.AMBER,
      bg: C.AMBER_BG,
      border: C.AMBER_BORDER,
      points: [
        "Clean JavaScript / Node.js library with zero bugs",
        "Tamper-proof HMAC SHA-256 webhook signatures",
        "Ready-made responsive checkout modal for mobile & web",
        "Used by Swiggy, Zomato, BookMyShow, and Playo"
      ]
    }
  ];

  const colW = (CW - 0.6) / 4;
  pillars.forEach((p, i) => {
    const px = MX + i * (colW + 0.2);
    addCard(s, px, 1.45, colW, 4.4, "", p.color, C.WHITE);

    // Pill header
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: px + 0.2, y: 1.6, w: 0.55, h: 0.3,
      fill: { color: p.color },
      rectRadius: 0.05
    });
    s.addText(p.num, {
      x: px + 0.2, y: 1.6, w: 0.55, h: 0.3,
      fontSize: 10, bold: true, color: C.WHITE, align: "center", valign: "middle"
    });
    s.addText(p.icon, {
      x: px + 0.85, y: 1.6, w: 0.5, h: 0.3,
      fontSize: 14, valign: "middle"
    });

    s.addText(p.title, {
      x: px + 0.2, y: 2.05, w: colW - 0.4, h: 0.35,
      fontSize: 12, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(p.subtitle, {
      x: px + 0.2, y: 2.4, w: colW - 0.4, h: 0.35,
      fontSize: 7.5, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });

    s.addShape(pptx.shapes.LINE, {
      x: px + 0.2, y: 2.8, w: colW - 0.4, h: 0,
      line: { color: C.BORDER, width: 1 }
    });

    p.points.forEach((pt, idx) => {
      const py = 2.95 + idx * 0.68;
      s.addShape(pptx.shapes.OVAL, {
        x: px + 0.2, y: py + 0.06, w: 0.08, h: 0.08,
        fill: { color: p.color }
      });
      s.addText(pt, {
        x: px + 0.35, y: py, w: colW - 0.55, h: 0.62,
        fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
      });
    });
  });

  // Callout banner
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 6.05, w: CW, h: 0.7,
    fill: { color: "1E1B4B" },
    rectRadius: 0.08
  });
  s.addText("INDUSTRY STANDARD: 95% of sports, fitness, and ticketing platforms in India run on Razorpay. It solves all three hard problems: multi-party splits, instant UPI, and quick refunds.", {
    x: MX + 0.3, y: 6.05, w: CW - 0.6, h: 0.7,
    fontSize: 9, bold: true, color: "#C7D2FE", fontFace: "Segoe UI", align: "center", valign: "middle"
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 3: DEEP DIVE 1: RAZORPAY ROUTE (MARKETPLACE SPLIT)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Deep Dive 1: Razorpay Route & The Marketplace Split Engine", "Marketplace Economics", 3);

  // Left Card: The Problem of Single-Account Gateways
  addCard(s, MX, 1.45, 5.6, 5.25, "Traditional Gateways: The Manual Payout Nightmare", C.RED, C.WHITE);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + 0.25, y: 2.0, w: 5.1, h: 1.1,
    fill: { color: C.RED_BG },
    line: { color: C.RED_BORDER, width: 1 },
    rectRadius: 0.06
  });
  s.addText("THE TRADITIONAL GATEWAY PROBLEM:", {
    x: MX + 0.4, y: 2.1, w: 4.8, h: 0.25,
    fontSize: 8.5, bold: true, color: C.RED, fontFace: "Segoe UI"
  });
  s.addText("Gateways like standard Stripe, PayU, or PhonePe deposit 100% of the player's payment into Turfify's bank account. This creates 3 catastrophic operational bottlenecks:", {
    x: MX + 0.4, y: 2.38, w: 4.8, h: 0.65,
    fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI"
  });

  const bottlenecks = [
    { title: "1. Massive Manual Labor", text: "You must manually calculate payouts for 50+ turf owners every night and initiate 50 separate NEFT/IMPS transfers." },
    { title: "2. Serious Tax & GST Complications", text: "If ₹1,500 enters your bank account directly, tax authorities may treat the whole ₹1,500 as your revenue, rather than just your ₹150 fee." },
    { title: "3. Cash Flow & Escrow Risk", text: "Holding venue owners' funds in a regular current account without RBI-approved nodal/escrow compliance is legally hazardous." }
  ];

  bottlenecks.forEach((b, i) => {
    const by = 3.3 + i * 0.95;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y: by, w: 5.1, h: 0.85,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.05
    });
    s.addText(b.title, {
      x: MX + 0.4, y: by + 0.08, w: 4.8, h: 0.22,
      fontSize: 9, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(b.text, {
      x: MX + 0.4, y: by + 0.32, w: 4.8, h: 0.48,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  // Right Card: The Solution: Razorpay Route
  addCard(s, MX + 5.9, 1.45, 5.833, 5.25, "The Solution: Razorpay Route Automated Transfers", C.BLUE, C.WHITE);

  const routeSteps = [
    {
      step: "1. Turf Owner Onboarding",
      desc: "Owners link their current business bank account via Razorpay Linked Account API. They receive a dedicated linked ID (`acc_H8s912df`)."
    },
    {
      step: "2. Single-Step Split at Order Creation",
      desc: "When the player pays ₹1,500, our server passes a `transfers` payload: ₹1,350 is assigned to the turf owner and ₹150 is credited to Turfify."
    },
    {
      step: "3. Escrow Hold Until Match Kickoff",
      desc: "Funds are held in RBI-compliant escrow until the match is completed. If a dispute or rainout happens, the money is cleanly reversed."
    },
    {
      step: "4. Automated TDS Section 194-O",
      desc: "Razorpay automatically deducts 1% TDS on the owner's gross sale and generates quarterly Form 16A statements, keeping Turfify 100% tax compliant."
    }
  ];

  routeSteps.forEach((rs, i) => {
    const rsy = 2.0 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 6.1, y: rsy, w: 5.4, h: 1.0,
      fill: { color: C.BLUE_BG },
      line: { color: C.BLUE_BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(rs.step, {
      x: MX + 6.25, y: rsy + 0.08, w: 5.1, h: 0.26,
      fontSize: 9.5, bold: true, color: C.BLUE, fontFace: "Segoe UI"
    });
    s.addText(rs.desc, {
      x: MX + 6.25, y: rsy + 0.35, w: 5.1, h: 0.6,
      fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 4: DEEP DIVE 2: UPI INTENT & INSTANT 5-SECOND CHECKOUT
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Deep Dive 2: UPI Intent & Frictionless Player Conversion", "User Experience", 4);

  // Left Card: The Power of UPI Intent
  addCard(s, MX, 1.45, 5.6, 5.25, "Why UPI Intent Converts 3x Higher Than Cards", C.INDIGO_DARK, C.WHITE);

  const stats = [
    { num: "85%+", label: "of all sports bookings in metro cities are completed via UPI apps" },
    { num: "98.2%", label: "authorization success rate on Razorpay's direct UPI gateway rail" },
    { num: "5 Sec", label: "average checkout time from slot selection to confirmed booking" },
    { num: "< 2%", label: "cart drop-off rate compared to 35%+ drop-off on card OTP screens" }
  ];

  const sw = 2.45;
  stats.forEach((st, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const sx = MX + 0.25 + col * (sw + 0.2);
    const sy = 2.0 + row * 1.35;

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: sx, y: sy, w: sw, h: 1.2,
      fill: { color: C.INDIGO_BG },
      line: { color: C.INDIGO_BORDER, width: 1 },
      rectRadius: 0.08
    });
    s.addText(st.num, {
      x: sx + 0.1, y: sy + 0.15, w: sw - 0.2, h: 0.45,
      fontSize: 16, bold: true, color: C.INDIGO_DARK, fontFace: "Segoe UI", align: "center"
    });
    s.addText(st.label, {
      x: sx + 0.15, y: sy + 0.6, w: sw - 0.3, h: 0.5,
      fontSize: 8, color: C.TEXT_MAIN, fontFace: "Segoe UI", align: "center", lineSpacingMultiple: 1.1
    });
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + 0.25, y: 4.9, w: 5.1, h: 1.5,
    fill: { color: "F0FDF4" },
    line: { color: C.EMERALD_BORDER, width: 1 },
    rectRadius: 0.08
  });
  s.addText("THE MOBILE-FIRST ADVANTAGE:", {
    x: MX + 0.4, y: 5.0, w: 4.8, h: 0.25,
    fontSize: 9, bold: true, color: C.EMERALD, fontFace: "Segoe UI"
  });
  s.addText("Young sports players booking turfs on Friday afternoon are on the go. They do not carry credit card numbers, CVVs, or NetBanking passwords. Razorpay automatically detects their installed UPI apps and launches the payment screen with a single tap.", {
    x: MX + 0.4, y: 5.3, w: 4.8, h: 1.0,
    fontSize: 8.5, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  // Right Card: Supported Payment Apps
  addCard(s, MX + 5.9, 1.45, 5.833, 5.25, "Complete Multi-Rail Coverage Across India", C.BLUE, C.WHITE);

  const rails = [
    { name: "Google Pay (GPay)", desc: "Direct UPI intent deep-link with biometric fingerprint confirmation." },
    { name: "PhonePe", desc: "India's largest UPI market share, frictionless 1-tap app launch." },
    { name: "Paytm & CRED", desc: "Popular for reward point cashbacks and high-value corporate bookings." },
    { name: "Debit & Credit Cards", desc: "Visa, Mastercard, RuPay with RBI tokenization and 3DS 2.0." },
    { name: "NetBanking", desc: "Supported across 50+ Indian banks (HDFC, ICICI, SBI, Axis, Kotak)." }
  ];

  rails.forEach((r, i) => {
    const ry = 2.0 + i * 0.92;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 6.1, y: ry, w: 5.4, h: 0.78,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.05
    });
    s.addText(r.name, {
      x: MX + 6.25, y: ry + 0.08, w: 5.1, h: 0.25,
      fontSize: 9.5, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(r.desc, {
      x: MX + 6.25, y: ry + 0.35, w: 5.1, h: 0.38,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 5: DEEP DIVE 3: 60-SECOND INSTANT REFUNDS (RAZORPAYX)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Deep Dive 3: 60-Second Instant Refunds via RazorpayX", "Customer Retention", 5);

  // Left Card: Traditional Refund Delay vs Instant
  addCard(s, MX, 1.45, 5.6, 5.25, "The Problem with Traditional 7-Day Refunds", C.RED, C.WHITE);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + 0.25, y: 2.0, w: 5.1, h: 1.1,
    fill: { color: C.RED_BG },
    line: { color: C.RED_BORDER, width: 1 },
    rectRadius: 0.06
  });
  s.addText("THE SATURDAY RAINOUT CRISIS:", {
    x: MX + 0.4, y: 2.1, w: 4.8, h: 0.25,
    fontSize: 8.5, bold: true, color: C.RED, fontFace: "Segoe UI"
  });
  s.addText("Heavy rain hits Bangalore at 4 PM, flooding 15 outdoor turfs. 30 matches are cancelled. Under traditional payment gateways, refunds take 5 to 7 business days to credit back to player cards.", {
    x: MX + 0.4, y: 2.38, w: 4.8, h: 0.65,
    fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI"
  });

  const painPoints = [
    { title: "Angry Customer Inquiries", text: "Players bombard your WhatsApp support with 'Where is my money?' and leave 1-star reviews on Google Play." },
    { title: "Loss of Weekend Rebooking", text: "Because the player's cash is stuck in bank clearing, they cannot book an indoor badminton court on Turfify for that same evening." },
    { title: "Bank Intermediary Fees", text: "Card networks often deduct convenience fees on refunds, leaving the player short-changed." }
  ];

  painPoints.forEach((pp, i) => {
    const ppy = 3.3 + i * 0.95;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y: ppy, w: 5.1, h: 0.85,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.05
    });
    s.addText(pp.title, {
      x: MX + 0.4, y: ppy + 0.08, w: 4.8, h: 0.22,
      fontSize: 9, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(pp.text, {
      x: MX + 0.4, y: ppy + 0.32, w: 4.8, h: 0.48,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  // Right Card: The RazorpayX Instant Payout Engine
  addCard(s, MX + 5.9, 1.45, 5.833, 5.25, "The RazorpayX Solution: 60-Second UPI Refunds", C.EMERALD, C.WHITE);

  const instantSteps = [
    {
      title: "1. Match Cancellation Trigger",
      desc: "Owner taps 'Rainout Cancellation' on owner dashboard or player cancels >24 hours ahead."
    },
    {
      title: "2. Server Invokes RazorpayX Payout API",
      desc: "Backend dispatches an instant payout instruction using the original payment's UPI VPA handle."
    },
    {
      title: "3. Direct IMPS / UPI Transfer (<60s)",
      desc: "Money hits the player's bank account in under 60 seconds, accompanied by an instant bank SMS."
    },
    {
      title: "4. Player Goodwill & Instant Rebooking",
      desc: "Instead of feeling frustrated, the player is delighted by the lightning-fast service and immediately books another date."
    }
  ];

  instantSteps.forEach((is, i) => {
    const isy = 2.0 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 6.1, y: isy, w: 5.4, h: 1.0,
      fill: { color: C.EMERALD_BG },
      line: { color: C.EMERALD_BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(is.title, {
      x: MX + 6.25, y: isy + 0.08, w: 5.1, h: 0.26,
      fontSize: 9.5, bold: true, color: C.EMERALD, fontFace: "Segoe UI"
    });
    s.addText(is.desc, {
      x: MX + 6.25, y: isy + 0.35, w: 5.1, h: 0.6,
      fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 6: THE FULL COMPARATIVE BENCHMARK MATRIX (USER REQUESTED TABLE)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Head-to-Head Comparison: Razorpay vs The Field", "Comparative Benchmark", 6);

  // Exact requested table
  const headers = ["GATEWAY", "BEST SUITED FOR", "MARKETPLACE SPLIT", "UPI SUCCESS", "CHARGES", "VERDICT"];
  const rows = [
    [
      "Razorpay 🥇",
      "Marketplaces & Startups",
      "Excellent (Route)",
      "~95% - 98%",
      "2% + 18% GST",
      "Best Overall Choice"
    ],
    [
      "Cashfree 🥈",
      "High-Volume Splits",
      "Excellent (Easy Split)",
      "~94% - 97%",
      "1.9% - 2% + GST",
      "Best Alternative"
    ],
    [
      "PhonePe PG 🥉",
      "Consumer UPI Apps",
      "Limited (Manual)",
      "~96%",
      "0% - 1.5% Promo",
      "Weak for Vendor Splits"
    ],
    [
      "Stripe India",
      "Global SaaS & Exports",
      "Best in World (Connect)",
      "Average (Card focus)",
      "2% - 3% + GST",
      "Not for Local Turfs"
    ],
    [
      "Paytm PG",
      "Offline QR & Retail",
      "Average",
      "~92% - 94%",
      "~1.99% + GST",
      "Complex Dashboard"
    ]
  ];

  const colWidths = [1.8, 2.2, 2.4, 1.6, 1.8, 1.933];
  let startX = MX;

  // Header Row
  headers.forEach((h, i) => {
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: startX, y: 1.45, w: colWidths[i], h: 0.45,
      fill: { color: i === 0 ? C.BLUE : C.NAVY_CARD },
      rectRadius: 0.05
    });
    s.addText(h, {
      x: startX, y: 1.45, w: colWidths[i], h: 0.45,
      fontSize: 8.5, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });
    startX += colWidths[i];
  });

  // Table Data Rows
  rows.forEach((r, idx) => {
    const ry = 1.98 + idx * 0.88;
    let rx = MX;
    const isRazorpay = idx === 0;
    const isCashfree = idx === 1;

    r.forEach((cell, ci) => {
      const bg = isRazorpay ? "EFF6FF" : (isCashfree ? "F0FDF4" : (idx % 2 === 0 ? "F8FAFC" : C.WHITE));
      const borderCol = isRazorpay ? C.BLUE_BORDER : C.BORDER;

      s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: rx, y: ry, w: colWidths[ci], h: 0.8,
        fill: { color: bg },
        line: { color: borderCol, width: isRazorpay ? 1.2 : 0.8 },
        rectRadius: 0.05
      });
      s.addText(cell, {
        x: rx + 0.1, y: ry, w: colWidths[ci] - 0.2, h: 0.8,
        fontSize: 8.2,
        bold: ci === 0 || ci === 5 || isRazorpay,
        color: isRazorpay ? C.BLUE : (ci === 0 ? C.NAVY_DARK : C.TEXT_MAIN),
        align: ci === 0 || ci === 5 ? "center" : "left",
        valign: "middle",
        fontFace: "Segoe UI"
      });
      rx += colWidths[ci];
    });
  });

  // Takeaway note
  s.addText("KEY TAKEAWAY: Only Razorpay and Cashfree provide automated marketplace split rails (10%/90%) in India. Razorpay wins on documentation, developer tools, and brand recognition.", {
    x: MX, y: 6.5, w: CW, h: 0.4,
    fontSize: 8.5, bold: true, color: C.BLUE, fontFace: "Segoe UI", align: "center"
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 7: WHY THE OTHER CONTENDERS FALL SHORT
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Competitor Breakdown: Why the Other 4 Fall Short", "Vendor Evaluation", 7);

  const competitors = [
    {
      name: "Cashfree Payments",
      badge: "RUNNER-UP (EXCELLENT BACKUP)",
      badgeCol: C.EMERALD,
      badgeBg: C.EMERALD_BG,
      accent: C.EMERALD,
      whyGood: "Outstanding instant payout APIs (Cashfree Payouts) and lower UPI transfer fees.",
      whyFails: "Developer ecosystem, documentation, and ready-to-use SDK widgets are slightly less polished than Razorpay. Best used as a secondary fallback rail."
    },
    {
      name: "PhonePe Payment Gateway",
      badge: "UNSUITABLE FOR MARKETPLACE",
      badgeCol: C.AMBER,
      badgeBg: C.AMBER_BG,
      accent: C.AMBER,
      whyGood: "Massive consumer brand recognition and rock-bottom promotional MDR rates.",
      whyFails: "Built for single direct merchants (e.g. e-commerce stores). Lacks programmatic multi-vendor split accounts and automated TDS withholding mechanisms."
    },
    {
      name: "Stripe India",
      badge: "GLOBAL SAAS ONLY",
      badgeCol: C.RED,
      badgeBg: C.RED_BG,
      accent: C.RED,
      whyGood: "Stripe Connect is the gold standard for global multi-currency marketplace splits.",
      whyFails: "Strict invite-only onboarding in India. Weak domestic UPI intent integration. Focuses on export software/SaaS, not Indian domestic venue booking."
    },
    {
      name: "Paytm Payment Gateway",
      badge: "COMPLEX & CLUNKY",
      badgeCol: C.RED,
      badgeBg: C.RED_BG,
      accent: C.RED,
      whyGood: "Extensive offline QR presence at retail mom-and-pop shops.",
      whyFails: "Clunky developer dashboard, slower merchant support response times, and past regulatory banking restrictions make it a risky choice for a new startup."
    }
  ];

  const colW = (CW - 0.2) / 2;
  competitors.forEach((c, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const cx = MX + col * (colW + 0.2);
    const cy = 1.45 + row * 2.55;

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: cy, w: colW, h: 2.4,
      fill: { color: C.WHITE },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.08
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: cx + 0.1, y: cy, w: colW - 0.2, h: 0.05,
      fill: { color: c.accent }
    });

    s.addText(c.name, {
      x: cx + 0.25, y: cy + 0.15, w: colW - 2.5, h: 0.35,
      fontSize: 12, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    // Badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: cx + colW - 2.2, y: cy + 0.15, w: 1.95, h: 0.3,
      fill: { color: c.badgeBg },
      rectRadius: 0.04
    });
    s.addText(c.badge, {
      x: cx + colW - 2.2, y: cy + 0.15, w: 1.95, h: 0.3,
      fontSize: 7, bold: true, color: c.badgeCol, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    // Strengths
    s.addText("STRENGTH:", {
      x: cx + 0.25, y: cy + 0.55, w: colW - 0.5, h: 0.2,
      fontSize: 7.5, bold: true, color: C.EMERALD, fontFace: "Segoe UI"
    });
    s.addText(c.whyGood, {
      x: cx + 0.25, y: cy + 0.75, w: colW - 0.5, h: 0.5,
      fontSize: 8, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });

    // Bottlenecks
    s.addText("LIMITATION FOR TURFIFY:", {
      x: cx + 0.25, y: cy + 1.35, w: colW - 0.5, h: 0.2,
      fontSize: 7.5, bold: true, color: C.RED, fontFace: "Segoe UI"
    });
    s.addText(c.whyFails, {
      x: cx + 0.25, y: cy + 1.55, w: colW - 0.5, h: 0.75,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 8: THE FINAL VERDICT & STRATEGY FOR TURFIFY
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.NAVY_DARK };

  // Top header line
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.BLUE }
  });

  s.addText("TURFIFY FINTECH PRODUCTION STRATEGY", {
    x: MX, y: 0.4, w: CW, h: 0.3,
    fontSize: 9, bold: true, color: "#93C5FD", fontFace: "Segoe UI"
  });
  s.addText("The Final Verdict & Production Blueprint", {
    x: MX, y: 0.75, w: CW, h: 0.55,
    fontSize: 22, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });

  // 2 Side-by-side Strategy Cards
  const halfW = (CW - 0.3) / 2;

  // Primary: Razorpay
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.5, w: halfW, h: 4.8,
    fill: { color: C.NAVY_CARD },
    line: { color: C.BLUE, width: 1.5 },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: MX + 0.15, y: 1.5, w: halfW - 0.3, h: 0.06,
    fill: { color: C.BLUE }
  });
  s.addText("PRIMARY SETUP (100% LAUNCH READY)", {
    x: MX + 0.3, y: 1.7, w: halfW - 0.6, h: 0.25,
    fontSize: 8.5, bold: true, color: "#93C5FD", fontFace: "Segoe UI"
  });
  s.addText("Go With Razorpay Standard + Route", {
    x: MX + 0.3, y: 2.0, w: halfW - 0.6, h: 0.45,
    fontSize: 14, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });

  const razorpayActionPoints = [
    "Checkout UI: Deploy Razorpay Standard Checkout modal supporting GPay, PhonePe, Paytm, and cards.",
    "Vendor Onboarding: Use Razorpay Route Linked Accounts API to register turf owners and route their 90% payout.",
    "Server Webhooks: Validate every booking using Razorpay's HMAC SHA-256 webhook signature checker.",
    "Refunds: Connect RazorpayX Payouts for 60-second instant UPI refunds on rainout cancellations."
  ];

  razorpayActionPoints.forEach((rp, idx) => {
    const rpy = 2.65 + idx * 0.95;
    s.addShape(pptx.shapes.OVAL, {
      x: MX + 0.3, y: rpy + 0.08, w: 0.1, h: 0.1,
      fill: { color: C.BLUE }
    });
    s.addText(rp, {
      x: MX + 0.5, y: rpy, w: halfW - 0.8, h: 0.85,
      fontSize: 8.8, color: "E2E8F0", fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  // Secondary: Cashfree
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + halfW + 0.3, y: 1.5, w: halfW, h: 4.8,
    fill: { color: C.NAVY_CARD },
    line: { color: C.EMERALD, width: 1.5 },
    rectRadius: 0.1
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: MX + halfW + 0.45, y: 1.5, w: halfW - 0.3, h: 0.06,
    fill: { color: C.EMERALD }
  });
  s.addText("SECONDARY / SCALE BACKUP", {
    x: MX + halfW + 0.6, y: 1.7, w: halfW - 0.6, h: 0.25,
    fontSize: 8.5, bold: true, color: C.EMERALD_LIGHT, fontFace: "Segoe UI"
  });
  s.addText("Keep Cashfree As A Backup Rail", {
    x: MX + halfW + 0.6, y: 2.0, w: halfW - 0.6, h: 0.45,
    fontSize: 14, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });

  const cashfreeActionPoints = [
    "Redundancy: If Razorpay's bank servers experience unexpected downtime, auto-failover to Cashfree.",
    "Cheaper Payout Volumes: Cashfree offers lower flat fees on high-volume IMPS bank transfers.",
    "Dual-Gateway Architecture: Integrate an API abstraction layer so swapping gateways takes zero frontend rewrites.",
    "Phase 2 Scale: Introduce Cashfree when Turfify crosses 10,000 monthly bookings for fee negotiation."
  ];

  cashfreeActionPoints.forEach((cp, idx) => {
    const cpy = 2.65 + idx * 0.95;
    s.addShape(pptx.shapes.OVAL, {
      x: MX + halfW + 0.6, y: cpy + 0.08, w: 0.1, h: 0.1,
      fill: { color: C.EMERALD }
    });
    s.addText(cp, {
      x: MX + halfW + 0.8, y: cpy, w: halfW - 1.0, h: 0.85,
      fontSize: 8.8, color: "E2E8F0", fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  s.addText("Turfify Platform Architecture Series • Payment Gateway Selection Blueprint Complete", {
    x: MX, y: 6.7, w: CW, h: 0.3,
    fontSize: 9, color: "64748B", fontFace: "Segoe UI", align: "center"
  });
}

// Write Presentation to File
const outputPath = "Payment_Gateway_Evaluation_Razorpay_Master.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`Payment Gateway Selection Presentation generated successfully: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating presentation:", err);
  });
