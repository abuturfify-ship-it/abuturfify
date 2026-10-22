const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();

// Explicit 16:9 Widescreen Layout (13.333 inches wide by 7.5 inches tall)
pptx.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pptx.layout = "WIDESCREEN_16_9";

pptx.author = "Turfify FinTech & Platform Engineering";
pptx.company = "Turfify Technologies Pvt. Ltd.";
pptx.title = "Marketplace Payouts, Settlement Cycles & Zero-Balance Cancellation Architecture";

// Canvas Geometry
const W = 13.333;
const H = 7.5;
const MX = 0.8;
const CW = 11.733;

// Curated Fintech Color Palette: Stripe Indigo, Emerald, Navy & Coral
const C = {
  NAVY_DARK: "0B0F19",
  NAVY_CARD: "111827",
  SLATE_BG: "F8FAFC",
  WHITE: "FFFFFF",
  TEXT_MAIN: "0F172A",
  TEXT_MUTED: "475569",
  BORDER: "E2E8F0",
  BORDER_DARK: "1E293B",

  INDIGO: "6366F1",
  INDIGO_DARK: "4F46E5",
  INDIGO_DEEP: "4338CA",
  INDIGO_BG: "EEF2FF",
  INDIGO_BORDER: "C7D2FE",

  VIOLET: "8B5CF6",
  VIOLET_DARK: "7C3AED",
  VIOLET_BG: "F5F3FF",
  VIOLET_BORDER: "DDD6FE",

  EMERALD: "059669",
  EMERALD_LIGHT: "10B981",
  EMERALD_BG: "ECFDF5",
  EMERALD_BORDER: "A7F3D0",

  BLUE: "2563EB",
  BLUE_LIGHT: "3B82F6",
  BLUE_BG: "EFF6FF",
  BLUE_BORDER: "BFDBFE",

  AMBER: "D97706",
  AMBER_LIGHT: "F59E0B",
  AMBER_BG: "FFFBEB",
  AMBER_BORDER: "FDE68A",

  RED: "DC2626",
  RED_LIGHT: "EF4444",
  RED_BG: "FEF2F2",
  RED_BORDER: "FECACA"
};

const TOTAL_SLIDES = 8;

// Reusable Header
function addHeader(slide, title, category, num) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.INDIGO_DARK }
  });

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

  slide.addText(title, {
    x: MX, y: 0.72, w: CW - 1.6, h: 0.55,
    fontSize: 19, bold: true, color: C.NAVY_DARK,
    fontFace: "Segoe UI", valign: "middle"
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: W - MX - 1.3, y: 0.45, w: 1.3, h: 0.32,
    fill: { color: "F1F5F9" },
    line: { color: C.BORDER, width: 1 },
    rectRadius: 0.06
  });
  slide.addText(`SLIDE ${num} / ${TOTAL_SLIDES}`, {
    x: W - MX - 1.3, y: 0.45, w: 1.3, h: 0.32,
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
  slide.addText("Turfify Platform Architecture — Marketplace Payouts, Settlement Cycles & Zero-Balance Cancellations", {
    x: MX, y: H - 0.45, w: 8.0, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI", valign: "middle"
  });
  slide.addText("Confidential • FinTech & Marketplace Architecture", {
    x: W - MX - 3.5, y: H - 0.45, w: 3.5, h: 0.35,
    fontSize: 8, color: C.TEXT_MUTED, align: "right", fontFace: "Segoe UI", valign: "middle"
  });
}

// Reusable Card Function
function addCard(slide, x, y, w, h, title, accentColor = C.INDIGO_DARK, bg = C.WHITE, border = C.BORDER, titleSize = 12) {
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h,
    fill: { color: bg },
    line: { color: border, width: 1 },
    rectRadius: 0.08
  });
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: x + 0.08, y, w: w - 0.16, h: 0.05,
    fill: { color: accentColor }
  });
  if (title) {
    slide.addText(title, {
      x: x + 0.2, y: y + 0.14, w: w - 0.4, h: 0.32,
      fontSize: titleSize, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
  }
}

// ==============================================================================
// SLIDE 1: COVER SLIDE (STRIPE FINTECH DARK OBSIDIAN)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.NAVY_DARK };

  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.1,
    fill: { color: C.EMERALD_LIGHT }
  });

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.1, w: 4.4, h: 0.38,
    fill: { color: "064E3B" },
    line: { color: C.EMERALD_LIGHT, width: 1.5 },
    rectRadius: 0.08
  });
  s.addText("TURFIFY FINTECH & MARKETPLACE INFRASTRUCTURE", {
    x: MX, y: 1.1, w: 4.4, h: 0.38,
    fontSize: 9, bold: true, color: C.EMERALD_BORDER,
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  s.addText("Marketplace Payouts, Settlement Cycles\n& Zero-Balance Cancellation Architecture", {
    x: MX, y: 1.65, w: CW, h: 1.8,
    fontSize: 32, bold: true, color: C.WHITE,
    fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  s.addText("How Razorpay Handles Friday Vendor Payouts, Saturday ₹0-Balance Cancellations, Automated Route Splits (90/10) & Escrow Protection Rails", {
    x: MX, y: 3.55, w: CW - 1.0, h: 0.7,
    fontSize: 13, color: "94A3B8", fontFace: "Segoe UI", lineSpacingMultiple: 1.25
  });

  // 4 Pill Badges
  const badges = [
    { title: "Marketplace Route Splits", val: "90% Owner / 10% Platform", col: C.EMERALD_LIGHT },
    { title: "Statutory Tax Deductions", val: "Section 194-O TDS (1%)", col: C.INDIGO },
    { title: "Zero-Balance Resolution", val: "Auto Negative Balance Offset", col: C.AMBER_LIGHT },
    { title: "Zero-Cost Workaround", val: "Turfify In-App Wallet Credits", col: C.VIOLET }
  ];

  const bw = (CW - 0.6) / 4;
  badges.forEach((b, i) => {
    const bx = MX + i * (bw + 0.2);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: bx, y: 4.6, w: bw, h: 1.65,
      fill: { color: C.NAVY_CARD },
      line: { color: C.BORDER_DARK, width: 1 },
      rectRadius: 0.08
    });
    s.addShape(pptx.shapes.RECTANGLE, {
      x: bx + 0.15, y: 4.75, w: 0.4, h: 0.05,
      fill: { color: b.col }
    });
    s.addText(b.title.toUpperCase(), {
      x: bx + 0.15, y: 4.9, w: bw - 0.3, h: 0.25,
      fontSize: 8.5, bold: true, color: "94A3B8", fontFace: "Segoe UI"
    });
    s.addText(b.val, {
      x: bx + 0.15, y: 5.25, w: bw - 0.3, h: 0.85,
      fontSize: 12.5, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 2: THE OPERATIONAL DILEMMA & CORE PARADOX
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Core Dilemma: Booking on Wednesday, Cancelling on Saturday", "Operational Scenario", 2);

  // Big Callout Box explaining the client's scenario verbatim
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.4, w: CW, h: 1.25,
    fill: { color: C.INDIGO_BG },
    line: { color: C.INDIGO_BORDER, width: 1.5 },
    rectRadius: 0.08
  });
  s.addText("📌 THE EXACT CLIENT SCENARIO ANALYZED:", {
    x: MX + 0.3, y: 1.52, w: CW - 0.6, h: 0.25,
    fontSize: 9, bold: true, color: C.INDIGO_DARK, fontFace: "Segoe UI"
  });
  s.addText("“A customer pays ₹1,500 on Wednesday for a Saturday evening turf booking. On Friday morning, Razorpay automatically sweeps and settles the money into the turf owner’s bank account. On Saturday morning, the Razorpay gateway balance is ₹0.00. The customer now clicks Cancel. How does the system issue a refund when Razorpay has zero money?”", {
    x: MX + 0.3, y: 1.8, w: CW - 0.6, h: 0.75,
    fontSize: 11.5, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  // 3 Multi-Layered Solutions Cards
  const layers = [
    {
      title: "LAYER 1: GATEWAY MECHANICS",
      name: "Razorpay Negative Balance Auto-Offset",
      color: C.INDIGO_DARK,
      bg: C.INDIGO_BG,
      points: [
        "Razorpay permits refunds even when gateway balance is ₹0.00.",
        "Your account goes into negative balance (e.g., -₹1,500.00).",
        "Upcoming customer bookings over the weekend automatically replenish the deficit with zero manual intervention.",
        "Zero interest penalties and zero administrative friction."
      ]
    },
    {
      title: "LAYER 2: BUSINESS POLICY",
      name: "Platform Cancellation Matrix Protection",
      color: C.RED,
      bg: C.RED_BG,
      points: [
        "Inventory was blocked for 3 days (Wed to Sat) exclusively for this user.",
        "Under venue policy, cancellations within 6 hours are strictly non-refundable (0%).",
        "The turf owner keeps their 85% payout to cover empty pitch damages.",
        "Commercially, the client is fully protected from cash refunds on match day."
      ]
    },
    {
      title: "LAYER 3: FINANCIAL EFFICIENCY",
      name: "Turfify In-App Wallet Credits",
      color: C.EMERALD,
      bg: C.EMERALD_BG,
      points: [
        "Offer 100% refund value as instant Turfify Wallet Credits.",
        "₹0 cash leaves Razorpay or the turf owner’s bank account.",
        "Zero payment gateway processing fees are burned.",
        "100% of customer spending remains locked in your sports ecosystem."
      ]
    }
  ];

  const cardW = (CW - 0.4) / 3;
  layers.forEach((l, i) => {
    const lx = MX + i * (cardW + 0.2);
    addCard(s, lx, 2.85, cardW, 3.85, "", l.color, C.WHITE);

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: lx + 0.2, y: 3.0, w: cardW - 0.4, h: 0.3,
      fill: { color: l.bg },
      line: { color: l.color, width: 1 },
      rectRadius: 0.05
    });
    s.addText(l.title, {
      x: lx + 0.2, y: 3.0, w: cardW - 0.4, h: 0.3,
      fontSize: 8.5, bold: true, color: l.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    s.addText(l.name, {
      x: lx + 0.2, y: 3.45, w: cardW - 0.4, h: 0.5,
      fontSize: 12, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    l.points.forEach((pt, pi) => {
      s.addText(`•  ${pt}`, {
        x: lx + 0.2, y: 4.1 + pi * 0.62, w: cardW - 0.4, h: 0.55,
        fontSize: 9.2, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
      });
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 3: THE END-TO-END PAYOUT FLOW (WEDNESDAY TO FRIDAY)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Complete Payout Flow: From UPI Authorization to Bank Credit", "Marketplace Settlement", 3);

  // 4 Phase Cards
  const phases = [
    {
      day: "DAY 0: WEDNESDAY 14:00",
      step: "Phase 1: Player Checkout",
      badge: "payment.captured",
      color: C.EMERALD,
      desc: "Player books Saturday slot for ₹1,500 via UPI Intent (GPay/PhonePe). Razorpay captures the payment and fires an idempotent webhook to the backend."
    },
    {
      day: "DAY 0: WEDNESDAY 14:02",
      step: "Phase 2: Route Split & TDS",
      badge: "Automated 90/10 Split",
      color: C.INDIGO_DARK,
      desc: "Razorpay Route automatically splits the money inside the gateway: ₹150 (10%) to Turfify platform balance, ₹15 (1%) TDS Section 194-O, and ₹1,335 (90%) to owner."
    },
    {
      day: "DAY 1-2: THU / FRI 04:00 AM",
      step: "Phase 3: Automated Bank Sweep",
      badge: "Settlement T+1 / T+2",
      color: C.BLUE,
      desc: "Under standard T+1 settlement, Razorpay sweeps accumulated vendor funds via automated nodal NEFT/IMPS directly into the turf owner's private bank account."
    },
    {
      day: "DAY 3: SATURDAY MORNING",
      step: "Phase 4: Zero-Balance State",
      badge: "Balance = ₹0.00",
      color: C.AMBER,
      desc: "Owner's bank account reflects ₹1,335 cash. The Razorpay merchant account balance drops to ₹0.00 awaiting new weekend bookings."
    }
  ];

  const pw = (CW - 0.6) / 4;
  phases.forEach((p, i) => {
    const px = MX + i * (pw + 0.2);
    addCard(s, px, 1.45, pw, 3.2, "", p.color, C.WHITE);

    s.addText(p.day, {
      x: px + 0.15, y: 1.6, w: pw - 0.3, h: 0.25,
      fontSize: 8, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(p.step, {
      x: px + 0.15, y: 1.88, w: pw - 0.3, h: 0.35,
      fontSize: 11, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: px + 0.15, y: 2.3, w: pw - 0.3, h: 0.26,
      fill: { color: "F1F5F9" },
      line: { color: p.color, width: 1 },
      rectRadius: 0.04
    });
    s.addText(p.badge, {
      x: px + 0.15, y: 2.3, w: pw - 0.3, h: 0.26,
      fontSize: 8, bold: true, color: p.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    s.addText(p.desc, {
      x: px + 0.15, y: 2.7, w: pw - 0.3, h: 1.8,
      fontSize: 9, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Financial Breakdown Card
  addCard(s, MX, 4.85, CW, 1.85, "Financial Reconciliation of ₹1,500 Booking", C.INDIGO_DARK, C.WHITE);

  const splits = [
    { title: "GROSS BOOKING VALUE", val: "₹1,500.00", sub: "100% Paid by Player via UPI", col: C.NAVY_DARK },
    { title: "TURFIFY TAKE-RATE (10%)", val: "₹150.00", sub: "Platform Commission Kept in Escrow", col: C.EMERALD },
    { title: "STATUTORY TDS (SEC 194-O)", val: "₹15.00", sub: "1% E-Filing on Gov Portal (Form 16A)", col: C.AMBER },
    { title: "NET TURF OWNER PAYOUT", val: "₹1,335.00", sub: "Settled Friday 04:00 AM into HDFC/ICICI", col: C.INDIGO_DARK }
  ];

  const sw = (CW - 0.6) / 4;
  splits.forEach((sp, i) => {
    const sx = MX + 0.2 + i * (sw + 0.05);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: sx, y: 5.3, w: sw - 0.15, h: 1.25,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(sp.title, {
      x: sx + 0.1, y: 5.4, w: sw - 0.35, h: 0.2,
      fontSize: 7.5, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(sp.val, {
      x: sx + 0.1, y: 5.65, w: sw - 0.35, h: 0.4,
      fontSize: 16, bold: true, color: sp.col, fontFace: "Segoe UI"
    });
    s.addText(sp.sub, {
      x: sx + 0.1, y: 6.1, w: sw - 0.35, h: 0.35,
      fontSize: 8, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 4: HOW RAZORPAY HANDLES ZERO BALANCE
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Zero Balance in Razorpay: How Negative Balance Auto-Offset Works", "Gateway Mechanics", 4);

  // 3 Resolution Rails
  const rails = [
    {
      rail: "RAIL A: AUTO-RECOVERY",
      name: "Negative Merchant Balance",
      color: C.INDIGO_DARK,
      bg: C.INDIGO_BG,
      tag: "Default Gateway Behavior",
      desc: "When refund API is executed with ₹0 balance, Razorpay advances the refund and marks your merchant balance as -₹1,500.00.",
      impact: "Upcoming bookings on Saturday afternoon automatically replenish this deficit. Zero manual intervention or penalty."
    },
    {
      rail: "RAIL B: QUEUED STATE",
      name: "Queued / Pending Refund",
      color: C.AMBER,
      bg: C.AMBER_BG,
      tag: "Tolerance Limit Reached",
      desc: "If the account negative balance limit is reached, Razorpay holds the refund in a queued queue.",
      impact: "The very instant another player pays for any slot, Razorpay intercepts the incoming cash to execute the queued refund."
    },
    {
      rail: "RAIL C: MANUAL TOP-UP",
      name: "Instant Dashboard Pre-Funding",
      color: C.EMERALD,
      bg: C.EMERALD_BG,
      tag: "Immediate Merchant Reload",
      desc: "If no weekend bookings are expected, you can add funds manually in seconds via NetBanking, UPI, or NEFT.",
      impact: "Navigate to Razorpay Dashboard → Balance → Add Funds. Balance reflects instantly to satisfy pending payouts."
    }
  ];

  const rw = (CW - 0.4) / 3;
  rails.forEach((r, i) => {
    const rx = MX + i * (rw + 0.2);
    addCard(s, rx, 1.45, rw, 3.2, "", r.color, C.WHITE);

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: rx + 0.15, y: 1.6, w: rw - 0.3, h: 0.26,
      fill: { color: r.bg },
      line: { color: r.color, width: 1 },
      rectRadius: 0.04
    });
    s.addText(r.rail, {
      x: rx + 0.15, y: 1.6, w: rw - 0.3, h: 0.26,
      fontSize: 8, bold: true, color: r.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    s.addText(r.name, {
      x: rx + 0.15, y: 1.95, w: rw - 0.3, h: 0.35,
      fontSize: 12, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    s.addText(r.desc, {
      x: rx + 0.15, y: 2.38, w: rw - 0.3, h: 0.85,
      fontSize: 9.2, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: rx + 0.15, y: 3.35, w: rw - 0.3, h: 1.15,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.05
    });
    s.addText("BUSINESS IMPACT:", {
      x: rx + 0.25, y: 3.42, w: rw - 0.5, h: 0.2,
      fontSize: 7.5, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(r.impact, {
      x: rx + 0.25, y: 3.65, w: rw - 0.5, h: 0.75,
      fontSize: 8.5, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  // Flowchart of Self-Healing
  addCard(s, MX, 4.85, CW, 1.85, "The Negative Balance Self-Healing Flowchart", C.INDIGO_DARK, C.WHITE);

  const steps = [
    { num: "1", time: "SATURDAY 10:00", title: "Refund Approved", val: "Balance drops to -₹1,500.00", col: C.RED },
    { num: "2", time: "SATURDAY 13:00", title: "New Player Pays", val: "Slot booked (+₹1,500.00)", col: C.EMERALD },
    { num: "3", time: "SATURDAY 13:01", title: "Auto-Reconciliation", val: "Gateway balance back to ₹0.00", col: C.INDIGO_DARK },
    { num: "4", time: "SUNDAY 04:00 AM", title: "Settlement Resumes", val: "Profits swept to bank normally", col: C.BLUE }
  ];

  const stw = (CW - 0.6) / 4;
  steps.forEach((st, i) => {
    const stx = MX + 0.2 + i * (stw + 0.05);
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: stx, y: 5.3, w: stw - 0.15, h: 1.25,
      fill: { color: "F8FAFC" },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.06
    });
    s.addText(`STEP ${st.num} • ${st.time}`, {
      x: stx + 0.1, y: 5.4, w: stw - 0.35, h: 0.2,
      fontSize: 7.5, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(st.title, {
      x: stx + 0.1, y: 5.65, w: stw - 0.35, h: 0.3,
      fontSize: 11, bold: true, color: st.col, fontFace: "Segoe UI"
    });
    s.addText(st.val, {
      x: stx + 0.1, y: 6.0, w: stw - 0.35, h: 0.45,
      fontSize: 8.5, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 5: THE MASTER 4-TIER CANCELLATION MATRIX
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Master Cancellation Policy: Fair Multi-Tier Matrix", "Operational Policy", 5);

  const tiers = [
    {
      timeframe: "Tier 1: > 24 Hours Before Kickoff",
      status: "Advance Notice (e.g. Thursday)",
      refund: "90% Bank Refund OR 100% Turfify Wallet Credits",
      deduction: "10% Platform & Gateway Fee Retained",
      owner: "₹0 Payout (Slot freed for re-booking by other players)",
      color: C.INDIGO_DARK,
      bg: C.INDIGO_BG
    },
    {
      timeframe: "Tier 2: 6 to 24 Hours Before Kickoff",
      status: "Short Notice (e.g. Friday Evening)",
      refund: "50% Bank Refund OR 60% Turfify Wallet Credits",
      deduction: "50% Booking Forfeited Penalty",
      owner: "Owner receives 40% of slot value as liquidated compensation",
      color: C.VIOLET_DARK,
      bg: C.VIOLET_BG
    },
    {
      timeframe: "Tier 3: < 6 Hours Before Kickoff (Same-Day)",
      status: "Last-Minute / Match Day (e.g. Saturday)",
      refund: "0% Refund (Strictly Non-Refundable)",
      deduction: "100% Booking Value Forfeited by Player",
      owner: "Owner keeps 85% payout; Turfify retains 15%",
      color: C.RED,
      bg: C.RED_BG
    },
    {
      timeframe: "Tier 4: Force Majeure / Unplayable Turf",
      status: "Rainout, Floodlight Failure, Venue Fault",
      refund: "100% Immediate Full Refund + ₹100 Bonus Credit",
      deduction: "0% Player Penalty",
      owner: "₹0 Payout + Penalty flag on owner ranking",
      color: C.BLUE,
      bg: C.BLUE_BG
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
      fill: { color: t.color }
    });

    s.addText(t.timeframe, {
      x: MX + 0.3, y: ty + 0.1, w: 4.0, h: 0.28,
      fontSize: 11, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(`Context: ${t.status}`, {
      x: MX + 0.3, y: ty + 0.42, w: 4.0, h: 0.22,
      fontSize: 8.5, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(`Deduction: ${t.deduction}`, {
      x: MX + 0.3, y: ty + 0.68, w: 4.0, h: 0.25,
      fontSize: 8, color: t.color, bold: true, fontFace: "Segoe UI"
    });

    // Player Refund Box
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 4.5, y: ty + 0.15, w: 3.4, h: 0.82,
      fill: { color: C.WHITE },
      line: { color: C.BORDER, width: 0.8 },
      rectRadius: 0.05
    });
    s.addText("PLAYER REFUND OUTCOME", {
      x: MX + 4.6, y: ty + 0.2, w: 3.2, h: 0.2,
      fontSize: 7.5, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(t.refund, {
      x: MX + 4.6, y: ty + 0.42, w: 3.2, h: 0.5,
      fontSize: 9.5, bold: true, color: t.color, fontFace: "Segoe UI"
    });

    // Owner Compensation Box
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 8.1, y: ty + 0.15, w: 3.4, h: 0.82,
      fill: { color: C.WHITE },
      line: { color: C.BORDER, width: 0.8 },
      rectRadius: 0.05
    });
    s.addText("TURF OWNER COMPENSATION", {
      x: MX + 8.2, y: ty + 0.2, w: 3.2, h: 0.2,
      fontSize: 7.5, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
    s.addText(t.owner, {
      x: MX + 8.2, y: ty + 0.42, w: 3.2, h: 0.5,
      fontSize: 8.5, color: C.TEXT_MAIN, fontFace: "Segoe UI"
    });
  });

  s.addText("CRITICAL COMMERCIAL PRINCIPLE: Cancelling on Saturday for a Saturday match falls under Tier 3 (< 6 Hours). It is strictly non-refundable, legally protecting the turf owner from last-minute vacancy and zero-balance deficits!", {
    x: MX, y: 6.6, w: CW, h: 0.35,
    fontSize: 8.5, bold: true, color: C.RED, fontFace: "Segoe UI", align: "center"
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 6: THE WALLET CREDIT SUPER-SOLUTION (ZERO CASH OUTFLOW)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "The Master Workaround: Turfify In-App Wallet Credits", "Liquidity Optimization", 6);

  const benefits = [
    {
      title: "1. Zero Cash Outflow",
      val: "₹0 Leaves the Bank",
      color: C.EMERALD,
      bg: C.EMERALD_BG,
      desc: "No money exits your Razorpay merchant balance or your private bank account. Your operating liquidity stays 100% intact."
    },
    {
      title: "2. Zero Gateway Fees",
      val: "₹0 Fees Lost",
      color: C.INDIGO_DARK,
      bg: C.INDIGO_BG,
      desc: "Traditional bank refunds forfeit the initial 2% gateway processing fee. Wallet credits carry zero gateway interchange charges."
    },
    {
      title: "3. 100% Capital Retention",
      val: "100% Locked Inside App",
      color: C.VIOLET_DARK,
      bg: C.VIOLET_BG,
      desc: "Player receives instant rebooking credits and reschedules their match next week, boosting lifetime customer value (LTV)."
    }
  ];

  const bw = (CW - 0.4) / 3;
  benefits.forEach((b, i) => {
    const bx = MX + i * (bw + 0.2);
    addCard(s, bx, 1.45, bw, 2.5, "", b.color, C.WHITE);

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: bx + 0.15, y: 1.6, w: bw - 0.3, h: 0.26,
      fill: { color: b.bg },
      line: { color: b.color, width: 1 },
      rectRadius: 0.04
    });
    s.addText(b.title.toUpperCase(), {
      x: bx + 0.15, y: 1.6, w: bw - 0.3, h: 0.26,
      fontSize: 8, bold: true, color: b.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    s.addText(b.val, {
      x: bx + 0.15, y: 1.95, w: bw - 0.3, h: 0.35,
      fontSize: 13, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    s.addText(b.desc, {
      x: bx + 0.15, y: 2.38, w: bw - 0.3, h: 1.4,
      fontSize: 9.5, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });
  });

  // Side-by-Side Comparison Table
  addCard(s, MX, 4.15, CW, 2.65, "Side-by-Side Evaluation: Bank Refund vs Instant UPI vs Turfify Wallet", C.INDIGO_DARK, C.WHITE);

  const headers = ["EVALUATION METRIC", "ORIGINAL BANK SOURCE", "INSTANT UPI (RAZORPAYX)", "TURFIFY WALLET (WINNER)"];
  const rows = [
    ["Speed to Player", "5 to 7 Business Days", "Under 60 Seconds", "Instant (0 Seconds)"],
    ["Gateway API Cost", "Gateway retains ~2% fee", "Extra ₹4–₹6 payout fee", "₹0.00 (Zero Fee)"],
    ["Cash Impact on Merchant", "Cash leaves gateway", "Cash exits bank instantly", "ZERO Outflow (100% Stays in Bank)"],
    ["Customer Experience", "Player anxious, calls support", "Player satisfied", "Delighted, immediate rebooking"]
  ];

  const colWidths = [2.6, 2.9, 2.9, 2.933];
  let tableY = 4.65;

  headers.forEach((h, ci) => {
    let colX = MX + 0.2;
    for (let k = 0; k < ci; k++) colX += colWidths[k];
    s.addShape(pptx.shapes.RECTANGLE, {
      x: colX, y: tableY, w: colWidths[ci], h: 0.3,
      fill: { color: ci === 3 ? C.EMERALD : C.NAVY_DARK }
    });
    s.addText(h, {
      x: colX + 0.05, y: tableY, w: colWidths[ci] - 0.1, h: 0.3,
      fontSize: 8, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });
  });

  rows.forEach((row, ri) => {
    const rowY = tableY + 0.32 + ri * 0.38;
    row.forEach((cell, ci) => {
      let colX = MX + 0.2;
      for (let k = 0; k < ci; k++) colX += colWidths[k];
      const isWinner = ci === 3;
      s.addShape(pptx.shapes.RECTANGLE, {
        x: colX, y: rowY, w: colWidths[ci], h: 0.36,
        fill: { color: isWinner ? "ECFDF5" : (ri % 2 === 0 ? "F8FAFC" : C.WHITE) },
        line: { color: C.BORDER, width: 0.5 }
      });
      s.addText(cell, {
        x: colX + 0.08, y: rowY, w: colWidths[ci] - 0.16, h: 0.36,
        fontSize: 8.2, bold: isWinner || ci === 0,
        color: isWinner ? C.EMERALD : (ci === 0 ? C.NAVY_DARK : C.TEXT_MUTED),
        align: ci === 0 ? "left" : "center", valign: "middle", fontFace: "Segoe UI"
      });
    });
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 7: ESCROW HOLD SETTLEMENT ARCHITECTURE (ON_HOLD: 1)
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Permanent Architectural Safeguard: Escrow Hold Protocol", "FinTech Architecture", 7);

  // Explanation Card
  addCard(s, MX, 1.45, 5.7, 5.35, "How Escrow Hold Eliminates Deficits Permanently", C.INDIGO_DARK, C.WHITE);

  const points = [
    {
      title: "1. The Concept of 'Hold Settlement'",
      desc: "Instead of releasing payouts immediately on Thursday/Friday, configure Razorpay Route to hold vendor transfers in escrow until match kickoff."
    },
    {
      title: "2. Setting `on_hold: 1` During Booking",
      desc: "When the player pays on Wednesday, funds are committed to the turf owner's account but flagged as `on_hold: 1` with `on_hold_until: match_time`."
    },
    {
      title: "3. Effortless Cancellation Reversal",
      desc: "If the customer cancels, Razorpay reverses the transfer directly from the held escrow balance. Zero funds ever exit the owner's bank account!"
    },
    {
      title: "4. Automatic Match-Day Release",
      desc: "Once Saturday match finishes with no disputes, the gateway automatically unfreezes the hold and settles the money into the owner's bank Sunday morning."
    }
  ];

  points.forEach((p, pi) => {
    const py = 1.95 + pi * 1.15;
    s.addText(p.title, {
      x: MX + 0.25, y: py, w: 5.2, h: 0.28,
      fontSize: 10.5, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });
    s.addText(p.desc, {
      x: MX + 0.25, y: py + 0.28, w: 5.2, h: 0.75,
      fontSize: 9, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Code Card
  addCard(s, MX + 5.9, 1.45, 5.833, 5.35, "Production Code Implementation", C.EMERALD, C.NAVY_CARD, C.BORDER_DARK);

  const codeText = `// 1. WEDNESDAY CHECKOUT: Create Route Order with Escrow Hold
const order = await razorpay.orders.create({
  amount: 150000, // ₹1,500 in paise
  currency: "INR",
  transfers: [{
    account: "acc_turf_owner_482",
    amount: 133500, // ₹1,335 Net Owner Share
    currency: "INR",
    on_hold: 1, // FREEZES payout in escrow!
    on_hold_until: 1726329600 // Saturday match kickoff
  }]
});

// 2. SATURDAY CANCELLATION: Reverse Held Transfer Instantly
await razorpay.transfers.reverse(transfer_id, {
  amount: 133500 // Reverses held funds with zero bank clawback
});

// 3. REFUND EXECUTION: Issue Idempotent Player Refund
await razorpay.payments.refund(payment_id, {
  amount: refundAmountPaise,
  reverse_all: 1
});`;

  s.addShape(pptx.shapes.RECTANGLE, {
    x: MX + 6.1, y: 1.95, w: 5.433, h: 4.65,
    fill: { color: "0B0F19" },
    line: { color: "1E293B", width: 1 }
  });

  s.addText(codeText, {
    x: MX + 6.2, y: 2.05, w: 5.233, h: 4.45,
    fontSize: 9, color: "E2E8F0", fontFace: "Consolas", lineSpacingMultiple: 1.2
  });

  addFooter(s);
}

// ==============================================================================
// SLIDE 8: EXECUTIVE CLIENT SUMMARY & MESSAGE SCRIPT
// ==============================================================================
{
  const s = pptx.addSlide();
  s.background = { color: C.SLATE_BG };
  addHeader(s, "Executive Summary: 4-Point Defense & Client Message Script", "Client Deliverable", 8);

  // 4 Defense Points
  const defs = [
    {
      num: "1",
      title: "Razorpay Auto-Offsets Negative Balances",
      desc: "If your balance is ₹0, Razorpay processes the refund into negative (-₹1,500) and automatically reconciles it from upcoming weekend bookings. Zero penalties, no manual bank transfers.",
      color: C.INDIGO_DARK
    },
    {
      num: "2",
      title: "Saturday Same-Day Cancellations Are Non-Refundable",
      desc: "A player who blocks prime Saturday inventory for 3 days is legally blocked from same-day cash refunds under Tier 3 venue policy. The owner keeps their 85% payout to cover empty pitch damages.",
      color: C.RED
    },
    {
      num: "3",
      title: "Route Automatically Reverses Linked Splits",
      desc: "Razorpay Route's `reverse_all: 1` parameter pulls back the owner's share programmatically. The platform never pays refunds out-of-pocket for funds already routed.",
      color: C.AMBER
    },
    {
      num: "4",
      title: "Wallet Credits Keep 100% Cash in Your Bank",
      desc: "Offering 100% refunds in Turfify Wallet Credits costs ₹0 in gateway fees and zero cash leaves your bank. Delighted players immediately reschedule their games.",
      color: C.EMERALD
    }
  ];

  const dw = (CW - 0.6) / 2;
  defs.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const dx = MX + col * (dw + 0.6);
    const dy = 1.45 + row * 1.7;

    addCard(s, dx, dy, dw, 1.55, "", d.color, C.WHITE);

    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: dx + 0.15, y: dy + 0.15, w: 0.35, h: 0.35,
      fill: { color: d.color },
      rectRadius: 0.05
    });
    s.addText(d.num, {
      x: dx + 0.15, y: dy + 0.15, w: 0.35, h: 0.35,
      fontSize: 11, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    s.addText(d.title, {
      x: dx + 0.6, y: dy + 0.18, w: dw - 0.75, h: 0.3,
      fontSize: 11, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    s.addText(d.desc, {
      x: dx + 0.15, y: dy + 0.58, w: dw - 0.3, h: 0.88,
      fontSize: 9.2, color: C.TEXT_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Message Script Box
  addCard(s, MX, 5.0, CW, 1.75, "Exact Client Message Script (Copy & Send via WhatsApp / Email)", C.EMERALD, C.WHITE);

  const scriptText = "“If a customer cancels on Saturday when your Razorpay balance is ₹0 because funds already settled to your bank on Friday, you are completely protected on three fronts: First, under venue policy, same-day cancellations are strictly non-refundable or offered as instant Turfify Wallet Credits (costing ₹0 out of pocket). Second, if an eligible refund is authorized, Razorpay natively covers it using a negative balance and automatically deducts it from upcoming weekend bookings. Third, using our Escrow Hold setting, payouts are held until match kickoff, guaranteeing zero cash deficits ever occur.”";

  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX + 0.2, y: 5.45, w: CW - 0.4, h: 1.15,
    fill: { color: "ECFDF5" },
    line: { color: C.EMERALD_BORDER, width: 1 },
    rectRadius: 0.06
  });

  s.addText(scriptText, {
    x: MX + 0.35, y: 5.52, w: CW - 0.7, h: 1.0,
    fontSize: 9.8, bold: true, color: "065F46", fontFace: "Segoe UI", lineSpacingMultiple: 1.25
  });

  addFooter(s);
}

// Write to File
const outPath = "c:\\Users\\shame\\abu\\Turfify_Payout_Settlement_And_Cancellation_Masterclass.pptx";
pptx.writeFile({ fileName: outPath }).then(() => {
  console.log("=================================================================");
  console.log(`✅ SUCCESS: Masterclass PowerPoint Generated at:\n${outPath}`);
  console.log("=================================================================");
}).catch(err => {
  console.error("Failed to generate PPTX:", err);
  process.exit(1);
});
