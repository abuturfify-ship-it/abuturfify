import pptxgenjs from "pptxgenjs";

const pptx = new pptxgenjs();

// Explicit 16:9 Widescreen Layout (13.333 inches wide by 7.5 inches tall)
pptx.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pptx.layout = "WIDESCREEN_16_9";

pptx.author = "Turfify Fintech & Platform Engineering";
pptx.company = "Turfify Technologies Pvt. Ltd.";
pptx.title = "Payment Gateway, Automated Splits & Financial Settlement Masterclass";

// Canvas Geometry
const W = 13.333;
const H = 7.5;
const MX = 0.8;
const CW = 11.733;

// Stripe Fintech Signature Palette: Electric Indigo, Deep Violet, Royal Blue & Slate
const C = {
  NAVY_DARK: "0B0F19",       // Deep Slate Obsidian (Stripe dark canvas)
  NAVY_CARD: "111827",       // Deep Indigo-Gray card
  SLATE_BG: "F8FAFC",        // Clean Slate background
  WHITE: "FFFFFF",
  TEXT_MAIN: "0F172A",       // Slate 900
  TEXT_MUTED: "475569",      // Slate 600
  BORDER: "E2E8F0",          // Subtle border
  BORDER_DARK: "1E293B",
  CARD_BG: "FFFFFF",

  // Stripe Fintech Accents: Indigo & Violet
  INDIGO: "6366F1",          // Electric Indigo 500
  INDIGO_DARK: "4F46E5",     // Indigo 600 (Primary Brand)
  INDIGO_DEEP: "4338CA",     // Indigo 700
  INDIGO_BG: "EEF2FF",       // Indigo 50
  INDIGO_BORDER: "C7D2FE",   // Indigo 200

  VIOLET: "8B5CF6",          // Violet 500
  VIOLET_DARK: "7C3AED",     // Violet 600
  VIOLET_BG: "F5F3FF",       // Violet 50
  VIOLET_BORDER: "DDD6FE",   // Violet 200

  // Complementary Tech Accents
  BLUE: "2563EB",            // Royal Blue 600
  BLUE_LIGHT: "3B82F6",
  BLUE_BG: "EFF6FF",
  BLUE_BORDER: "BFDBFE",

  CYAN: "0891B2",            // Cyan 600
  CYAN_LIGHT: "06B6D4",
  CYAN_BG: "ECFEFF",
  CYAN_BORDER: "A5F3FC",

  EMERALD: "059669",         // Emerald for Net Settled / Success
  EMERALD_LIGHT: "10B981",
  EMERALD_BG: "ECFDF5",
  EMERALD_BORDER: "A7F3D0",

  AMBER: "D97706",
  AMBER_LIGHT: "F59E0B",
  AMBER_BG: "FFFBEB",
  AMBER_BORDER: "FDE68A",

  RED: "DC2626",
  RED_LIGHT: "EF4444",
  RED_BG: "FEF2F2",
  RED_BORDER: "FECACA"
};

const TOTAL_SLIDES = 12;

// Reusable Header in Stripe Indigo Theme
function addHeader(slide, title, category, num) {
  // Top electric indigo accent bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.INDIGO_DARK }
  });

  // Category Tag Box (Indigo Tint)
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 0.35, w: 2.8, h: 0.3,
    fill: { color: C.INDIGO_BG },
    line: { color: C.INDIGO_BORDER, width: 1 },
    rectRadius: 0.06
  });
  slide.addText(category.toUpperCase(), {
    x: MX, y: 0.35, w: 2.8, h: 0.3,
    fontSize: 8.5, bold: true, color: C.INDIGO_DARK,
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Slide Title
  slide.addText(title, {
    x: MX, y: 0.72, w: CW - 1.6, h: 0.55,
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
  slide.addText("Turfify — Financial Engineering, Payment Gateway & Settlement Masterclass", {
    x: MX, y: H - 0.45, w: 8.0, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI", valign: "middle"
  });
  slide.addText("Confidential • FinTech & Marketplace Architecture", {
    x: W - MX - 3.5, y: H - 0.45, w: 3.5, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, align: "right", fontFace: "Segoe UI", valign: "middle"
  });
}

// Helper: Card Creator
function addCard(slide, x, y, w, h, title, accentColor = C.INDIGO_DARK, bg = C.WHITE, border = C.BORDER, titleSize = 12.5) {
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
      fontSize: titleSize, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
  }
}

// ==============================================================================
// SLIDE 1: COVER SLIDE (STRIPE FINTECH DARK)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.NAVY_DARK };

  // Top Indigo gradient line
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.1,
    fill: { color: C.INDIGO }
  });

  // Top pill badge
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.1, w: 3.6, h: 0.38,
    fill: { color: "1E1B4B" }, // Deep Indigo night
    line: { color: C.INDIGO, width: 1.5 },
    rectRadius: 0.08
  });
  s.addText("TURFIFY FINTECH & TRANSACTIONAL ARCHITECTURE", {
    x: MX, y: 1.1, w: 3.6, h: 0.38,
    fontSize: 9, bold: true, color: C.INDIGO_BORDER,
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Main Title
  s.addText("Payment Gateway, Automated Splits\n& Financial Settlement Masterclass", {
    x: MX, y: 1.7, w: CW, h: 1.8,
    fontSize: 34, bold: true, color: C.WHITE,
    fontFace: "Segoe UI", lineSpacingMultiple: 1.1
  });

  // Subtitle
  s.addText("End-to-End Razorpay/UPI Integration, Marketplace Escrow Splits (10% / 90%),\nIdempotent Webhooks, Zero-Overbooking Concurrency & Optimal Cancellation Strategies", {
    x: MX, y: 3.7, w: CW, h: 0.85,
    fontSize: 14, color: "94A3B8", fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  // 4 Feature Cards at the bottom in Stripe Indigo Theme
  const metrics = [
    { title: "UPI & Gateway Rails", val: "Razorpay / UPI / Stripe", sub: "3D-Secure 2.0 & Instant Flow", col: C.INDIGO },
    { title: "Platform Take-Rate", val: "10% Turfify / 90% Owner", sub: "Automated Split Routing", col: C.VIOLET },
    { title: "Concurrency Guard", val: "10-Min Soft Lock TTL", sub: "Zero double-booking guarantee", col: C.BLUE },
    { title: "Cancellation Model", val: "Tiered Dynamic Policy", sub: "Fair dispute & refund matrix", col: C.CYAN }
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
      fontSize: 8.5, bold: true, color: "94A3B8", fontFace: "Segoe UI"
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

  // Footer branding
  s.addText("Turfify Platform Architecture Series • Module 04: Financial Engineering & Payout Settlement", {
    x: MX, y: 6.9, w: CW, h: 0.3,
    fontSize: 9, color: "64748B", fontFace: "Segoe UI"
  });
}

// ==============================================================================
// SLIDE 2: THE 4 FINANCIAL PILLARS OF TURFIFY
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Four Financial Pillars of Marketplace Integrity", "Financial Blueprint", 2);

  const colW = (CW - 0.6) / 4;
  const pillars = [
    {
      icon: "💳",
      title: "1. Checkout Flow",
      accent: C.INDIGO_DARK,
      bg: C.INDIGO_BG,
      border: C.INDIGO_BORDER,
      points: [
        "Server-side Order creation",
        "UPI Intent & Deep-linking",
        "Tokenized Cards & NetBanking",
        "3D Secure 2.0 authentication"
      ],
      desc: "Fast, friction-free checkout converting players in under 30 seconds."
    },
    {
      icon: "🔀",
      title: "2. Split Economics",
      accent: C.VIOLET_DARK,
      bg: C.VIOLET_BG,
      border: C.VIOLET_BORDER,
      points: [
        "Automated 10% platform fee",
        "90% Turf Owner net payout",
        "T+1/T+2 Escrow batch payout",
        "TDS (Sec 194-O) compliance"
      ],
      desc: "Zero manual intervention: splits are calculated & routed at transaction time."
    },
    {
      icon: "⏱️",
      title: "3. Concurrency Lock",
      accent: C.BLUE,
      bg: C.BLUE_BG,
      border: C.BLUE_BORDER,
      points: [
        "Atomic slot reservation",
        "10-min Soft-Lock countdown",
        "TTL expiration engine",
        "Zero duplicate bookings"
      ],
      desc: "Prevents race conditions when multiple players select the same prime-time slot."
    },
    {
      icon: "⚖️",
      title: "4. Policy & Refunds",
      accent: C.CYAN,
      bg: C.CYAN_BG,
      border: C.CYAN_BORDER,
      points: [
        "Time-tiered dynamic policy",
        "Fair loss mitigation for turfs",
        "Instant Turfify wallet credit",
        "Rainout/Force Majeure rules"
      ],
      desc: "Balanced cancellation rules protecting player trust and venue operational cash flow."
    }
  ];

  pillars.forEach((p, i) => {
    const x = MX + i * (colW + 0.2);
    addCard(s, x, 1.45, colW, 4.4, `${p.icon}  ${p.title}`, p.accent, C.WHITE, C.BORDER, 11);

    // Summary description box
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.2, y: 1.95, w: colW - 0.4, h: 0.75,
      fill: { color: p.bg },
      line: { color: p.border, width: 1 },
      rectRadius: 0.06
    });
    s.addText(p.desc, {
      x: x + 0.25, y: 1.98, w: colW - 0.5, h: 0.68,
      fontSize: 8.5, color: C.TEXT_MAIN, fontFace: "Segoe UI", valign: "middle"
    });

    // Bullet points
    p.points.forEach((pt, idx) => {
      const by = 2.9 + idx * 0.55;
      s.addShape(pptx.shapes.OVAL, {
        x: x + 0.25, y: by + 0.08, w: 0.12, h: 0.12,
        fill: { color: p.accent }
      });
      s.addText(pt, {
        x: x + 0.45, y: by, w: colW - 0.7, h: 0.45,
        fontSize: 9.5, bold: true, color: C.TEXT_MAIN, fontFace: "Segoe UI"
      });
    });
  });

  // Callout banner at the bottom (Indigo Night)
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 6.05, w: CW, h: 0.7,
    fill: { color: "1E1B4B" },
    line: { color: C.INDIGO, width: 1 },
    rectRadius: 0.08
  });
  s.addText("PLATFORM PRINCIPLE: Money must never exist in an indeterminate state. Every transaction is tied to an explicit idempotency key, order state machine, and double-entry ledger entry.", {
    x: MX + 0.3, y: 6.05, w: CW - 0.6, h: 0.7,
    fontSize: 9.5, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle", align: "center"
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 3: PAYMENT INTENT & END-TO-END CHECKOUT LIFECYCLE
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Payment Flow: Razorpay / UPI Intent Lifecycle", "Checkout Protocol", 3);

  const steps = [
    {
      num: "01",
      title: "Initiate Checkout",
      actor: "Client App -> Backend",
      color: C.INDIGO_DARK,
      items: [
        "Player clicks 'Pay Now' for 7-8 PM slot",
        "API calls `/api/checkout/create-order`",
        "Backend verifies slot is AVAILABLE",
        "Database sets slot state: `PENDING_PAYMENT` (Starts 10m TTL)"
      ]
    },
    {
      num: "02",
      title: "Order Generation",
      actor: "Backend -> Razorpay API",
      color: C.VIOLET_DARK,
      items: [
        "Server invokes `razorpay.orders.create()`",
        "Amount: ₹150,000 (paise = ₹1,500)",
        "Passes metadata: `turf_id`, `slot_id`, `player_id`",
        "Returns secure `order_id` (e.g. `order_K9v8f12`)"
      ]
    },
    {
      num: "03",
      title: "Player Payment",
      actor: "Player Device -> Gateway",
      color: C.BLUE,
      items: [
        "Client opens Razorpay Checkout modal",
        "Options: GPay, PhonePe, Paytm, Cards, NetBanking",
        "User completes UPI PIN / OTP authentication",
        "Bank authorizes and debits player account"
      ]
    },
    {
      num: "04",
      title: "Verification & Release",
      actor: "Razorpay -> Turfify Backend",
      color: C.CYAN,
      items: [
        "Razorpay dispatches signed Webhook",
        "Backend validates HMAC-SHA256 signature",
        "Slot confirmed `BOOKED`, Booking status `CONFIRMED`",
        "Instant WhatsApp & SMS confirmation dispatched"
      ]
    }
  ];

  const stepW = (CW - 0.6) / 4;
  steps.forEach((st, i) => {
    const sx = MX + i * (stepW + 0.2);
    addCard(s, sx, 1.45, stepW, 4.3, "", st.color, C.WHITE);

    // Step Number Badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: sx + 0.2, y: 1.6, w: 0.55, h: 0.3,
      fill: { color: st.color },
      rectRadius: 0.05
    });
    s.addText(st.num, {
      x: sx + 0.2, y: 1.6, w: 0.55, h: 0.3,
      fontSize: 10, bold: true, color: C.WHITE, align: "center", valign: "middle"
    });

    s.addText(st.actor, {
      x: sx + 0.85, y: 1.6, w: stepW - 1.0, h: 0.3,
      fontSize: 7.5, color: C.TEXT_MUTED, fontFace: "Segoe UI", valign: "middle"
    });

    s.addText(st.title, {
      x: sx + 0.2, y: 2.05, w: stepW - 0.4, h: 0.4,
      fontSize: 12, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    s.addShape(pptx.shapes.LINE, {
      x: sx + 0.2, y: 2.5, w: stepW - 0.4, h: 0,
      line: { color: C.BORDER, width: 1 }
    });

    st.items.forEach((item, idx) => {
      const iy = 2.65 + idx * 0.68;
      s.addShape(pptx.shapes.OVAL, {
        x: sx + 0.2, y: iy + 0.06, w: 0.08, h: 0.08,
        fill: { color: st.color }
      });
      s.addText(item, {
        x: sx + 0.35, y: iy, w: stepW - 0.55, h: 0.62,
        fontSize: 8.5, color: C.TEXT_MAIN, fontFace: "Segoe UI"
      });
    });
  });

  // Architectural Warning Banner (Indigo / Violet Night alert)
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 5.95, w: CW, h: 0.85,
    fill: { color: "311042" }, // Deep purple night
    line: { color: C.VIOLET_DARK, width: 1.2 },
    rectRadius: 0.08
  });
  s.addText("CRITICAL FINTECH RULE: NEVER trust client-side onSuccess callbacks to finalize bookings!", {
    x: MX + 0.3, y: 6.0, w: CW - 0.6, h: 0.35,
    fontSize: 10, bold: true, color: "#F472B6", fontFace: "Segoe UI"
  });
  s.addText("If a user closes the browser tab immediately after UPI PIN entry, the frontend callback terminates prematurely. The server-to-server Razorpay Webhook is the SOLE authoritative source of truth for booking confirmation.", {
    x: MX + 0.3, y: 6.35, w: CW - 0.6, h: 0.4,
    fontSize: 8.5, color: "#E2E8F0", fontFace: "Segoe UI"
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 4: MARKETPLACE SPLIT ECONOMICS (10% VS 90%)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Marketplace Split Economics & Automated Payouts", "Financial Architecture", 4);

  // Left Column: Breakdown Example Card in Indigo Palette
  addCard(s, MX, 1.45, 5.3, 5.25, "Example: ₹1,500 Weekend Evening Booking", C.INDIGO_DARK, C.WHITE);

  const txRows = [
    { label: "Gross Booking Value (Player Pays)", val: "₹1,500.00", bold: true, col: C.NAVY_DARK, bg: "F8FAFC" },
    { label: "Payment Gateway Processing Fee (2% + 18% GST)", val: "- ₹35.40", bold: false, col: C.RED, bg: C.WHITE },
    { label: "Net Settled Amount in Escrow", val: "₹1,464.60", bold: true, col: C.BLUE, bg: C.BLUE_BG },
    { label: "Turfify Platform Commission (10% of Gross)", val: "₹150.00", bold: true, col: C.INDIGO_DARK, bg: C.INDIGO_BG },
    { label: "GST on Platform Commission (18% on ₹150)", val: "- ₹27.00", bold: false, col: C.TEXT_MUTED, bg: C.WHITE },
    { label: "Turfify Net Retained Revenue", val: "₹123.00", bold: true, col: C.INDIGO_DARK, bg: "E0E7FF" },
    { label: "TDS Deducted under Sec 194-O (1%)", val: "- ₹15.00", bold: false, col: C.TEXT_MUTED, bg: C.WHITE },
    { label: "Final Turf Owner Payout (Settled to Bank)", val: "₹1,299.60", bold: true, col: C.NAVY_DARK, bg: C.VIOLET_BG }
  ];

  txRows.forEach((r, idx) => {
    const ry = 1.95 + idx * 0.55;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.2, y: ry, w: 4.9, h: 0.48,
      fill: { color: r.bg },
      line: { color: C.BORDER, width: 0.8 },
      rectRadius: 0.05
    });
    s.addText(r.label, {
      x: MX + 0.35, y: ry, w: 3.2, h: 0.48,
      fontSize: 8.5, bold: r.bold, color: C.TEXT_MAIN, fontFace: "Segoe UI", valign: "middle"
    });
    s.addText(r.val, {
      x: MX + 3.6, y: ry, w: 1.4, h: 0.48,
      fontSize: 9.5, bold: r.bold, color: r.col, fontFace: "Segoe UI", align: "right", valign: "middle"
    });
  });

  // Right Column: Automated Routing Engine Mechanics (Violet Card)
  addCard(s, MX + 5.6, 1.45, 6.133, 5.25, "Automated Payout Mechanics (Razorpay Route / Stripe Connect)", C.VIOLET_DARK, C.WHITE);

  const mechanics = [
    {
      title: "1. Linked Accounts Onboarding",
      desc: "Every Turf Owner completes automated KYC and links their business bank account. Razorpay assigns a dedicated `acc_xxxx` identifier."
    },
    {
      title: "2. Instant Programmatic Transfers",
      desc: "During `/orders` creation, transfers payload is supplied: 90% is routed to owner's linked account and 10% is held in Turfify primary balance."
    },
    {
      title: "3. Settlement Timelines (T+1 vs T+2)",
      desc: "Funds are held in escrow until slot match time completes. If no dispute or rainout occurs, batch payout triggers automatically at 04:00 AM daily."
    },
    {
      title: "4. Regulatory Tax Compliance (Sec 194-O)",
      desc: "Under Indian tax law, e-commerce marketplaces must deduct 1% TDS on gross sales before paying operators. Turfify auto-generates Form 16A quarterly."
    }
  ];

  mechanics.forEach((m, idx) => {
    const my = 2.0 + idx * 1.12;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 5.8, y: my, w: 5.733, h: 0.98,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(m.title, {
      x: MX + 6.0, y: my + 0.08, w: 5.3, h: 0.28,
      fontSize: 10, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(m.desc, {
      x: MX + 6.0, y: my + 0.36, w: 5.3, h: 0.55,
      fontSize: 8.5, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 5: CONCURRENCY, ABANDONED CHECKOUTS & 10-MIN SOFT LOCK TTL
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Concurrency Control: The 10-Minute Soft-Lock Engine", "Transaction Integrity", 5);

  // Left Card: The Race Condition Problem
  addCard(s, MX, 1.45, 5.6, 5.25, "The Problem: Prime-Time Concurrency Race", C.RED, C.WHITE);

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + 0.25, y: 2.0, w: 5.1, h: 1.15,
    fill: { color: C.RED_BG },
    line: { color: C.RED_BORDER, width: 1 },
    rectRadius: 0.06
  });
  s.addText("SCENARIO: Friday 8:00 PM Slot", {
    x: MX + 0.4, y: 2.1, w: 4.8, h: 0.25,
    fontSize: 9, bold: true, color: C.RED, fontFace: "Segoe UI"
  });
  s.addText("Player A and Player B both click 'Book' at 07:59:01 PM. If both pay without slot-locking, the owner gets ₹3,000 for one turf, resulting in ground fights, refund penalties, and brand damage.", {
    x: MX + 0.4, y: 2.38, w: 4.8, h: 0.7,
    fontSize: 8.5, color: C.TEXT_MAIN, fontFace: "Segoe UI"
  });

  const failureTypes = [
    { title: "Drop-off 1: User Abandons Modal", text: "Player closes browser or changes mind. Slot must NOT remain frozen forever." },
    { title: "Drop-off 2: Bank OTP Timeout", text: "Bank server delays SMS OTP past 300s window. Payment gateway marks order failed." },
    { title: "Drop-off 3: Insufficient Funds / Decline", text: "Card declines or UPI limit exceeded. Slot should release immediately." }
  ];

  failureTypes.forEach((f, i) => {
    const fy = 3.35 + i * 1.0;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y: fy, w: 5.1, h: 0.88,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(f.title, {
      x: MX + 0.4, y: fy + 0.08, w: 4.8, h: 0.25,
      fontSize: 9.5, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(f.text, {
      x: MX + 0.4, y: fy + 0.35, w: 4.8, h: 0.45,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  // Right Card: The 10-Minute TTL Solution in Stripe Indigo Theme
  addCard(s, MX + 5.9, 1.45, 5.833, 5.25, "The Solution: Redis / Postgres Row-Lock + TTL", C.INDIGO_DARK, C.WHITE);

  const solutions = [
    {
      step: "Atomic Slot Reservation",
      code: "UPDATE slots SET status = 'LOCKED', locked_until = NOW() + INTERVAL '10 min', locked_by = player_id WHERE id = slot_id AND status = 'AVAILABLE';",
      note: "Only ONE transaction can claim the row. Player B instantly gets 'Slot temporarily held by another player'."
    },
    {
      step: "Client Visual Countdown (9:59 ... 0:00)",
      code: "Timer warning: 'Complete payment within 10:00 to guarantee your turf reservation.'",
      note: "Drives checkout urgency and prevents artificial hoarding."
    },
    {
      step: "Automated Garbage Collector Cron (TTL Releaser)",
      code: "cron.schedule('*/1 * * * *', async () => {\n  UPDATE slots SET status = 'AVAILABLE', locked_by = NULL WHERE status = 'LOCKED' AND locked_until < NOW();\n});",
      note: "Runs every 60s. Unlocks abandoned slots back to the public pool with zero admin overhead."
    }
  ];

  solutions.forEach((sol, i) => {
    const sy = 2.0 + i * 1.5;
    s.addText(sol.step, {
      x: MX + 6.1, y: sy, w: 5.4, h: 0.28,
      fontSize: 10, bold: true, color: C.INDIGO_DARK, fontFace: "Segoe UI"
    });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 6.1, y: sy + 0.3, w: 5.4, h: 0.62,
      fill: { color: C.NAVY_DARK },
      rectRadius: 0.05
    });
    s.addText(sol.code, {
      x: MX + 6.2, y: sy + 0.32, w: 5.2, h: 0.58,
      fontSize: 7.5, color: C.INDIGO_BORDER, fontFace: "Consolas"
    });

    s.addText(sol.note, {
      x: MX + 6.1, y: sy + 0.96, w: 5.4, h: 0.38,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 6: WEBHOOK SECURITY & IDEMPOTENCY ENGINE
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Webhook Security: HMAC Signatures & Idempotency", "Backend Security", 6);

  // Left Card: Webhook Verification Flow in Indigo Theme
  addCard(s, MX, 1.45, 5.6, 5.25, "Cryptographic Signature Verification", C.INDIGO_DARK, C.WHITE);

  s.addText("How Turfify verifies incoming webhooks genuinely originate from Razorpay:", {
    x: MX + 0.25, y: 1.95, w: 5.1, h: 0.4,
    fontSize: 8.5, color: C.TEXT_MUTED, fontFace: "Segoe UI"
  });

  const verifyCode = `const crypto = require('crypto');

app.post('/api/webhooks/razorpay', (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.rawBody; // MUST use unparsed buffer

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).send('Invalid signature attempt');
  }

  // Safe to process event
  handlePaymentSuccess(req.body);
  return res.status(200).json({ status: 'ok' });
});`;

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + 0.25, y: 2.4, w: 5.1, h: 3.3,
    fill: { color: C.NAVY_DARK },
    rectRadius: 0.06
  });
  s.addText(verifyCode, {
    x: MX + 0.35, y: 2.45, w: 4.9, h: 3.2,
    fontSize: 7.2, color: "E2E8F0", fontFace: "Consolas"
  });

  s.addText("Key: Signature mismatch immediately rejects spoofed attacks or replay injections.", {
    x: MX + 0.25, y: 5.85, w: 5.1, h: 0.5,
    fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
  });

  // Right Card: Idempotency Engine in Violet Theme
  addCard(s, MX + 5.9, 1.45, 5.833, 5.25, "Idempotency: Preventing Double-Credits & Double-Booking", C.VIOLET_DARK, C.WHITE);

  const idempotencyPoints = [
    {
      title: "Why Webhooks Retry",
      text: "Payment gateways guarantee at-least-once delivery. If our API response takes >5000ms due to database load, Razorpay automatically retries the same webhook 5 times."
    },
    {
      title: "The Disaster Without Idempotency",
      text: "A duplicate webhook triggers a second booking confirmation email, duplicate owner payouts, or corrupted financial ledger statements."
    },
    {
      title: "The Solution: Unique Event Idempotency Key",
      text: "We record `idempotency_key = event_id + order_id` in a Redis cache with a 24-hour TTL before executing business logic."
    },
    {
      title: "Dead Letter Queue (DLQ) & Fallback",
      text: "If our database crashes mid-webhook, the payload routes to an Amazon SQS / BullMQ DLQ for automated retry with exponential backoff."
    }
  ];

  idempotencyPoints.forEach((ip, i) => {
    const iy = 1.95 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 6.1, y: iy, w: 5.4, h: 1.0,
      fill: { color: C.VIOLET_BG },
      line: { color: C.VIOLET_BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(ip.title, {
      x: MX + 6.25, y: iy + 0.08, w: 5.1, h: 0.26,
      fontSize: 9.5, bold: true, color: C.VIOLET_DARK, fontFace: "Segoe UI"
    });
    s.addText(ip.text, {
      x: MX + 6.25, y: iy + 0.35, w: 5.1, h: 0.6,
      fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 7: CANCELLATION POLICY EVALUATION
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Strategic Dilemma: Full Refund vs Cancellation Deductions", "Policy Strategy", 7);

  const strategies = [
    {
      name: "Policy Model A",
      title: "100% Full Refund Anytime",
      verdict: "BAD FOR BUSINESS",
      verdictColor: C.RED,
      verdictBg: C.RED_BG,
      accent: C.RED,
      pros: ["Maximum player trust on first booking", "Zero customer support ticket friction"],
      cons: [
        "Players book 3 turfs on Friday and cancel 2 at the last hour",
        "Turf Owners face massive revenue loss with vacant grounds",
        "Turf owners will abandon Turfify to return to cash/phone"
      ]
    },
    {
      name: "Policy Model B",
      title: "Strict Zero-Refund Policy",
      verdict: "POOR USER RETENTION",
      verdictColor: C.AMBER,
      verdictBg: C.AMBER_BG,
      accent: C.AMBER,
      pros: ["Guarantees 100% owner earnings", "Zero refund transaction overhead"],
      cons: [
        "Players hesitate to book advance slots (>48 hours)",
        "High payment gateway chargeback disputes & bad Google reviews",
        "Competitors with flexible rescheduling will steal users"
      ]
    },
    {
      name: "Policy Model C",
      title: "Dynamic Time-Tiered Policy",
      verdict: "OPTIMAL RECOMMENDED",
      verdictColor: C.INDIGO_DARK,
      verdictBg: C.INDIGO_BG,
      accent: C.INDIGO_DARK,
      pros: [
        "Balances player flexibility with owner financial protection",
        "Scales deduction as match kickoff approaches (<6h = no refund)",
        "Offers 100% refund in 'Turfify Wallet Credits' to prevent cash outflow"
      ],
      cons: ["Requires automated time-delta calculation engine in backend"]
    }
  ];

  const stratW = (CW - 0.4) / 3;
  strategies.forEach((st, i) => {
    const sx = MX + i * (stratW + 0.2);
    addCard(s, sx, 1.45, stratW, 5.25, "", st.accent, C.WHITE);

    // Verdict Tag
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: sx + 0.2, y: 1.6, w: stratW - 0.4, h: 0.35,
      fill: { color: st.verdictBg },
      line: { color: st.verdictColor, width: 1 },
      rectRadius: 0.05
    });
    s.addText(st.verdict, {
      x: sx + 0.2, y: 1.6, w: stratW - 0.4, h: 0.35,
      fontSize: 9, bold: true, color: st.verdictColor, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    s.addText(st.name, {
      x: sx + 0.2, y: 2.05, w: stratW - 0.4, h: 0.25,
      fontSize: 8.5, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(st.title, {
      x: sx + 0.2, y: 2.3, w: stratW - 0.4, h: 0.4,
      fontSize: 13, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    s.addShape(pptx.shapes.LINE, {
      x: sx + 0.2, y: 2.8, w: stratW - 0.4, h: 0,
      line: { color: C.BORDER, width: 1 }
    });

    // Pros
    s.addText("PROS:", {
      x: sx + 0.2, y: 2.9, w: stratW - 0.4, h: 0.25,
      fontSize: 8, bold: true, color: C.INDIGO_DARK, fontFace: "Segoe UI"
    });
    st.pros.forEach((p, pi) => {
      const py = 3.15 + pi * 0.48;
      s.addText(`+  ${p}`, {
        x: sx + 0.2, y: py, w: stratW - 0.4, h: 0.45,
        fontSize: 7.8, color: C.TEXT_MAIN, fontFace: "Segoe UI"
      });
    });

    // Cons
    const conStartY = 3.2 + st.pros.length * 0.48;
    s.addText("CONS / RISKS:", {
      x: sx + 0.2, y: conStartY, w: stratW - 0.4, h: 0.25,
      fontSize: 8, bold: true, color: C.RED, fontFace: "Segoe UI"
    });
    st.cons.forEach((c, ci) => {
      const cy = conStartY + 0.25 + ci * 0.52;
      s.addText(`-  ${c}`, {
        x: sx + 0.2, y: cy, w: stratW - 0.4, h: 0.5,
        fontSize: 7.8, color: C.TEXT_MAIN, fontFace: "Segoe UI"
      });
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 8: TURFIFY RECOMMENDED DYNAMIC CANCELLATION MATRIX
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Master Cancellation Policy: Fair Multi-Tier Matrix", "Operational Policy", 8);

  const tiers = [
    {
      timeframe: "Tier 1: > 24 Hours Before Kickoff",
      status: "Generous Advance Notice",
      refundPct: "90% Bank Refund OR 100% Turfify Credits",
      deduction: "10% Platform Gateway & Processing Fee",
      ownerComp: "₹0 (Slot easily re-booked by other players)",
      bg: "EEF2FF", // Indigo tint
      accent: C.INDIGO_DARK
    },
    {
      timeframe: "Tier 2: 6 to 24 Hours Before Kickoff",
      status: "Short Notice Cancellation",
      refundPct: "50% Bank Refund OR 60% Turfify Credits",
      deduction: "50% Total Deduction",
      ownerComp: "Owner receives 40% of slot value as compensation",
      bg: "F5F3FF", // Violet tint
      accent: C.VIOLET_DARK
    },
    {
      timeframe: "Tier 3: < 6 Hours Before Kickoff",
      status: "Last-Minute No-Show / Cancellation",
      refundPct: "0% Refund (Strict Non-Refundable)",
      deduction: "100% Booking Forfeited",
      ownerComp: "Owner receives 85% payout; Turfify keeps 15%",
      bg: "FEF2F2",
      accent: C.RED
    },
    {
      timeframe: "Tier 4: Ground Unplayable / Rainout / Owner Fault",
      status: "Force Majeure / Venue Cancellation",
      refundPct: "100% Immediate Full Refund + ₹100 Bonus Credit",
      deduction: "0% Player Penalty",
      ownerComp: "₹0 payout + Owner receives warning / penalty on rating",
      bg: "EFF6FF",
      accent: C.BLUE
    }
  ];

  tiers.forEach((t, i) => {
    const ty = 1.45 + i * 1.25;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX, y: ty, w: CW, h: 1.12,
      fill: { color: t.bg },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.08
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: MX, y: ty, w: 0.12, h: 1.12,
      fill: { color: t.accent }
    });

    s.addText(t.timeframe, {
      x: MX + 0.3, y: ty + 0.1, w: 3.8, h: 0.28,
      fontSize: 10.5, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(`Context: ${t.status}`, {
      x: MX + 0.3, y: ty + 0.4, w: 3.8, h: 0.22,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });

    // Refund box
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 4.2, y: ty + 0.15, w: 3.6, h: 0.82,
      fill: { color: C.WHITE },
      line: { color: C.BORDER, width: 0.8 },
      rectRadius: 0.05
    });
    s.addText("PLAYER REFUND OUTCOME", {
      x: MX + 4.3, y: ty + 0.2, w: 3.4, h: 0.2,
      fontSize: 7, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(t.refundPct, {
      x: MX + 4.3, y: ty + 0.42, w: 3.4, h: 0.5,
      fontSize: 9.5, bold: true, color: t.accent, fontFace: "Segoe UI"
    });

    // Compensation breakdown
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 8.0, y: ty + 0.15, w: 3.5, h: 0.82,
      fill: { color: C.WHITE },
      line: { color: C.BORDER, width: 0.8 },
      rectRadius: 0.05
    });
    s.addText("TURF OWNER COMPENSATION", {
      x: MX + 8.1, y: ty + 0.2, w: 3.3, h: 0.2,
      fontSize: 7, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(t.ownerComp, {
      x: MX + 8.1, y: ty + 0.42, w: 3.3, h: 0.5,
      fontSize: 8.5, color: C.TEXT_MAIN, fontFace: "Segoe UI"
    });
  });

  // Summary note in Indigo
  s.addText("WIN-WIN INCENTIVE: Giving 100% refund as 'Turfify Wallet Credits' prevents payment gateway fee leakage while locking the capital inside our sports ecosystem!", {
    x: MX, y: 6.6, w: CW, h: 0.35,
    fontSize: 8.5, bold: true, color: C.INDIGO_DARK, fontFace: "Segoe UI", align: "center"
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 9: REFUND RAILS: ORIGINAL SOURCE VS INSTANT UPI VS WALLET CREDITS
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Refund Execution Rails: Speed, Gateway Fees & Economics", "Refund Execution", 9);

  const rails = [
    {
      name: "Rail 1: Original Source (Bank / Card)",
      speed: "5 to 7 Business Days",
      fee: "Gateway retains 2% processing fee",
      experience: "Player waits days, calls customer support repeatedly",
      cashFlow: "Cash exits Turfify escrow account back to banking rail",
      code: "await razorpay.payments.refund(payment_id, { amount: refundPaise });",
      color: C.BLUE,
      bg: C.BLUE_BG
    },
    {
      name: "Rail 2: Instant UPI Payout (Razorpay X)",
      speed: "Under 60 Seconds (Instant IMPS)",
      fee: "Additional ₹4 - ₹6 payout API fee paid by platform",
      experience: "Player sees immediate credit notification on phone",
      cashFlow: "Cash exits platform immediately",
      code: "await razorpayX.payouts.create({ fund_account_id, mode: 'UPI' });",
      color: C.VIOLET_DARK,
      bg: C.VIOLET_BG
    },
    {
      name: "Rail 3: Turfify Wallet Credits (Recommended)",
      speed: "Immediate (0 Seconds)",
      fee: "₹0 Gateway Fees (Zero transaction cost)",
      experience: "Player can immediately rebook another turf or date",
      cashFlow: "Zero cash outflow! 100% of capital remains in platform bank",
      code: "await db.wallets.increment({ user_id, balance: fullBookingAmount });",
      color: C.INDIGO_DARK,
      bg: C.INDIGO_BG
    }
  ];

  const railW = (CW - 0.4) / 3;
  rails.forEach((r, i) => {
    const rx = MX + i * (railW + 0.2);
    addCard(s, rx, 1.45, railW, 5.25, "", r.color, C.WHITE);

    // Speed Pill
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: rx + 0.2, y: 1.6, w: railW - 0.4, h: 0.35,
      fill: { color: r.bg },
      line: { color: r.color, width: 1 },
      rectRadius: 0.05
    });
    s.addText(`SPEED: ${r.speed}`, {
      x: rx + 0.2, y: 1.6, w: railW - 0.4, h: 0.35,
      fontSize: 8.5, bold: true, color: r.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    s.addText(r.name, {
      x: rx + 0.2, y: 2.1, w: railW - 0.4, h: 0.45,
      fontSize: 11, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    s.addShape(pptx.shapes.LINE, {
      x: rx + 0.2, y: 2.65, w: railW - 0.4, h: 0,
      line: { color: C.BORDER, width: 1 }
    });

    const items = [
      { label: "TRANSACTION COST", val: r.fee },
      { label: "USER EXPERIENCE", val: r.experience },
      { label: "PLATFORM LIQUIDITY", val: r.cashFlow }
    ];

    items.forEach((it, idx) => {
      const iy = 2.8 + idx * 0.9;
      s.addText(it.label, {
        x: rx + 0.2, y: iy, w: railW - 0.4, h: 0.22,
        fontSize: 7.5, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
      });
      s.addText(it.val, {
        x: rx + 0.2, y: iy + 0.22, w: railW - 0.4, h: 0.55,
        fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI"
      });
    });

    // Snippet
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: rx + 0.15, y: 5.5, w: railW - 0.3, h: 0.95,
      fill: { color: C.NAVY_DARK },
      rectRadius: 0.05
    });
    s.addText(r.code, {
      x: rx + 0.2, y: 5.55, w: railW - 0.4, h: 0.85,
      fontSize: 7, color: C.INDIGO_BORDER, fontFace: "Consolas"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 10: INVOICING, GST BREAKDOWN & TAX COMPLIANCE
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Automated Invoicing & Two-Tier GST Architecture", "Tax & Invoicing", 10);

  // Left Card: Two-Tier Invoice Structure in Indigo
  addCard(s, MX, 1.45, 5.6, 5.25, "The Dual-Invoice Legal Structure", C.INDIGO_DARK, C.WHITE);

  s.addText("Under Indian GST marketplace rules, an aggregator cannot invoice the entire venue rental under its own GSTIN unless registered as principal. Turfify implements a clean split-invoice model:", {
    x: MX + 0.25, y: 1.95, w: 5.1, h: 0.65,
    fontSize: 8.5, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  const invoiceCards = [
    {
      title: "Invoice 1: Turfify Platform Convenience Fee",
      emitter: "Turfify Technologies Pvt Ltd -> Player",
      gst: "18% GST (SAC Code: 998314 - E-commerce facilitation)",
      amount: "Example: ₹150 Platform Fee + ₹27 GST = ₹177",
      color: C.INDIGO_DARK
    },
    {
      title: "Invoice 2: Sports Facility Ground Rental",
      emitter: "Turf Owner Business -> Player",
      gst: "Subject to Owner's GST registration status (Exempt if <₹40L turnover)",
      amount: "Example: ₹1,350 Ground Rental",
      color: C.VIOLET_DARK
    }
  ];

  invoiceCards.forEach((inv, i) => {
    const iy = 2.8 + i * 1.5;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y: iy, w: 5.1, h: 1.35,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: MX + 0.25, y: iy, w: 0.1, h: 1.35,
      fill: { color: inv.color }
    });
    s.addText(inv.title, {
      x: MX + 0.45, y: iy + 0.1, w: 4.8, h: 0.25,
      fontSize: 9.5, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(`Issuer: ${inv.emitter}`, {
      x: MX + 0.45, y: iy + 0.38, w: 4.8, h: 0.22,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(`Tax Treatment: ${inv.gst}`, {
      x: MX + 0.45, y: iy + 0.62, w: 4.8, h: 0.25,
      fontSize: 8, color: C.TEXT_MAIN, fontFace: "Segoe UI"
    });
    s.addText(inv.amount, {
      x: MX + 0.45, y: iy + 0.92, w: 4.8, h: 0.3,
      fontSize: 9, bold: true, color: inv.color, fontFace: "Segoe UI"
    });
  });

  // Right Card: Automated PDF Generation in Violet Theme
  addCard(s, MX + 5.9, 1.45, 5.833, 5.25, "Automated PDF Invoicing & Accounting Flow", C.VIOLET_DARK, C.WHITE);

  const steps = [
    { step: "1. GSTIN Capture", desc: "Corporate players enter company GSTIN at checkout for B2B input tax credit (ITC)." },
    { step: "2. Headless PDF Generation", desc: "Worker generates tamper-evident PDF with QR code, digital signature, and unique serial invoice number (`TFY-26-XXXX`)." },
    { step: "3. WhatsApp & Email Dispatch", desc: "Instant download link sent via WhatsApp Business API within 10 seconds of payment." },
    { step: "4. Monthly GSTR-1 & GSTR-8 Filing", desc: "Export automated JSON reports for chartered accountants detailing TCS (Tax Collected at Source) under GST law." }
  ];

  steps.forEach((st, i) => {
    const sy = 2.0 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 6.1, y: sy, w: 5.4, h: 0.98,
      fill: { color: C.VIOLET_BG },
      line: { color: C.VIOLET_BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(st.step, {
      x: MX + 6.25, y: sy + 0.08, w: 5.1, h: 0.26,
      fontSize: 9.5, bold: true, color: C.VIOLET_DARK, fontFace: "Segoe UI"
    });
    s.addText(st.desc, {
      x: MX + 6.25, y: sy + 0.35, w: 5.1, h: 0.55,
      fontSize: 8.2, color: C.TEXT_MAIN, fontFace: "Segoe UI"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 11: FRAUD DEFENSE, CHARGEBACK MITIGATION & DISPUTE VAULT
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Fraud Detection, Chargeback Defense & Escrow Protection", "Risk Management", 11);

  const fraudThreats = [
    {
      title: "Friendly Fraud (Disputed Show)",
      threat: "Player plays 60-min match, then calls bank claiming 'unauthorized credit card transaction'.",
      defense: "Geotagged Turf Check-in & Owner QR verification logs stored in Dispute Evidence Vault."
    },
    {
      title: "Card Testing & Bot Hoarding",
      threat: "Malicious scrapers lock all Friday 7-9 PM slots using dummy checkout cards to sabotage rival turfs.",
      defense: "Cloudflare Turnstile captcha + IP velocity limit: Max 2 pending reservations per account."
    },
    {
      title: "Rogue Venue Operator Cancellations",
      threat: "Turf owner takes online booking, then accepts cash on ground and cancels online booking.",
      defense: "Penalties deducted from owner's pending payout escrow + automated venue suspension."
    },
    {
      title: "Payment Gateway Chargeback Fee",
      threat: "Banks levy ₹500 + GST fine on every lost chargeback dispute.",
      defense: "Automated Evidence Dossier sent to Razorpay within 24 hours containing IP, phone, and match logs."
    }
  ];

  const colW = (CW - 0.2) / 2;
  fraudThreats.forEach((ft, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const fx = MX + col * (colW + 0.2);
    const fy = 1.45 + row * 2.6;

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: fx, y: fy, w: colW, h: 2.45,
      fill: { color: C.WHITE },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.08
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: fx + 0.1, y: fy, w: colW - 0.2, h: 0.05,
      fill: { color: col === 0 ? C.RED : C.INDIGO_DARK }
    });

    s.addText(ft.title, {
      x: fx + 0.25, y: fy + 0.15, w: colW - 0.5, h: 0.32,
      fontSize: 12, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    // Threat box
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: fx + 0.25, y: fy + 0.55, w: colW - 0.5, h: 0.75,
      fill: { color: C.RED_BG },
      rectRadius: 0.05
    });
    s.addText("THREAT VULNERABILITY:", {
      x: fx + 0.35, y: fy + 0.6, w: colW - 0.7, h: 0.2,
      fontSize: 7.5, bold: true, color: C.RED, fontFace: "Segoe UI"
    });
    s.addText(ft.threat, {
      x: fx + 0.35, y: fy + 0.82, w: colW - 0.7, h: 0.45,
      fontSize: 8, color: C.TEXT_MAIN, fontFace: "Segoe UI"
    });

    // Defense box in Indigo tint
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: fx + 0.25, y: fy + 1.4, w: colW - 0.5, h: 0.9,
      fill: { color: C.INDIGO_BG },
      rectRadius: 0.05
    });
    s.addText("TURFIFY ARCHITECTURAL DEFENSE:", {
      x: fx + 0.35, y: fy + 1.45, w: colW - 0.7, h: 0.2,
      fontSize: 7.5, bold: true, color: C.INDIGO_DARK, fontFace: "Segoe UI"
    });
    s.addText(ft.defense, {
      x: fx + 0.35, y: fy + 1.68, w: colW - 0.7, h: 0.55,
      fontSize: 8, color: C.TEXT_MAIN, fontFace: "Segoe UI"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 12: COMPLETE ARCHITECTURAL RECAP & IMPLEMENTATION ROADMAP
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.NAVY_DARK };

  // Top header line
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.INDIGO }
  });

  s.addText("FINANCIAL ENGINEERING SUMMARY & DEPLOYMENT ROADMAP", {
    x: MX, y: 0.4, w: CW, h: 0.3,
    fontSize: 9, bold: true, color: C.INDIGO_BORDER, fontFace: "Segoe UI"
  });
  s.addText("Turfify Financial Infrastructure: Production Milestones", {
    x: MX, y: 0.75, w: CW, h: 0.55,
    fontSize: 22, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });

  const phases = [
    {
      phase: "Phase 1: Foundation (MVP)",
      timeline: "Sprint 1 - 2",
      accent: C.BLUE,
      deliverables: [
        "Razorpay standard UPI & card checkout modal",
        "HMAC SHA-256 webhook signature validator",
        "Redis 10-minute soft-lock TTL countdown",
        "Basic dual invoice PDF generation"
      ]
    },
    {
      phase: "Phase 2: Automated Marketplace Split",
      timeline: "Sprint 3 - 4",
      accent: C.INDIGO,
      deliverables: [
        "Razorpay Route linked accounts for turf owners",
        "Automated 10% take-rate deduction & 90% payout",
        "Dynamic Tiered Cancellation Policy engine",
        "Instant Turfify Wallet credits refund system"
      ]
    },
    {
      phase: "Phase 3: Scale, Risk & Optimization",
      timeline: "Sprint 5 - 6",
      accent: C.VIOLET,
      deliverables: [
        "Automated TDS 194-O quarterly filing exports",
        "Dispute Evidence Vault & chargeback automations",
        "Dynamic surge pricing & prime-time deposit holds",
        "Micro-insurance add-on (rainout / injury protection)"
      ]
    }
  ];

  const pw = (CW - 0.4) / 3;
  phases.forEach((p, i) => {
    const px = MX + i * (pw + 0.2);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: px, y: 1.5, w: pw, h: 4.8,
      fill: { color: C.NAVY_CARD },
      line: { color: "1E293B", width: 1 },
      rectRadius: 0.1
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: px + 0.15, y: 1.5, w: pw - 0.3, h: 0.05,
      fill: { color: p.accent }
    });

    s.addText(p.timeline.toUpperCase(), {
      x: px + 0.25, y: 1.7, w: pw - 0.5, h: 0.25,
      fontSize: 8.5, bold: true, color: p.accent, fontFace: "Segoe UI"
    });
    s.addText(p.phase, {
      x: px + 0.25, y: 2.0, w: pw - 0.5, h: 0.45,
      fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });

    s.addShape(pptx.shapes.LINE, {
      x: px + 0.25, y: 2.55, w: pw - 0.5, h: 0,
      line: { color: "1E293B", width: 1 }
    });

    s.addText("KEY DELIVERABLES:", {
      x: px + 0.25, y: 2.7, w: pw - 0.5, h: 0.25,
      fontSize: 8, bold: true, color: "94A3B8", fontFace: "Segoe UI"
    });

    p.deliverables.forEach((d, idx) => {
      const dy = 3.0 + idx * 0.75;
      s.addShape(pptx.shapes.OVAL, {
        x: px + 0.25, y: dy + 0.08, w: 0.1, h: 0.1,
        fill: { color: p.accent }
      });
      s.addText(d, {
        x: px + 0.45, y: dy, w: pw - 0.75, h: 0.7,
        fontSize: 9, color: "E2E8F0", fontFace: "Segoe UI", lineSpacingMultiple: 1.1
      });
    });
  });

  s.addText("Turfify Financial Infrastructure Blueprint • Designed for High-Throughput Sports Venue Operations", {
    x: MX, y: 6.7, w: CW, h: 0.3,
    fontSize: 9, color: "64748B", fontFace: "Segoe UI", align: "center"
  });
}

// Write Presentation to File
const outputPath = "Turfify_Payment_Gateway_Settlement_Master.pptx";
pptx.writeFile({ fileName: outputPath })
  .then(fileName => {
    console.log(`Presentation generated successfully: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating presentation:", err);
  });
