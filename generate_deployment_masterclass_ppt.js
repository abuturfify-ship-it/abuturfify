import pptxgenjs from "pptxgenjs";

const pptx = new pptxgenjs();

// Explicit 16:9 Widescreen Layout (13.333 inches wide by 7.5 inches tall)
pptx.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pptx.layout = "WIDESCREEN_16_9";

pptx.author = "Cloud DevOps & Architecture Practice";
pptx.company = "Enterprise Cloud Strategy Advisory";
pptx.title = "Cloud Web Deployment Masterclass: Vercel vs Alternative Platforms";

// Canvas Geometry
const W = 13.333;
const H = 7.5;
const MX = 0.8;
const CW = 11.733;

// Unified Modern Palette
const C = {
  NAVY: "0A0F1D",
  NAVY_CARD: "131D33",
  PAGE: "F8FAFC",
  WHITE: "FFFFFF",
  MAIN: "0F172A",
  MUTED: "475569",
  BORDER: "E2E8F0",
  CARD: "FFFFFF",

  // Brand Identifiers
  VERCEL: "111827",
  VERCEL_ACCENT: "0284C7",
  VERCEL_BG: "F1F5F9",

  CLOUDFLARE: "EA580C",
  CLOUDFLARE_BG: "FFF7ED",
  CLOUDFLARE_BORDER: "FED7AA",

  NETLIFY: "0D9488",
  NETLIFY_BG: "F0FDFA",
  NETLIFY_BORDER: "99F6E4",

  AWS: "D97706",
  AWS_BG: "FFFBEB",
  AWS_BORDER: "FDE68A",

  FIREBASE: "E11D48",
  FIREBASE_BG: "FFF1F2",
  FIREBASE_BORDER: "FECDD3",

  AZURE: "0284C7",
  AZURE_BG: "F0F9FF",
  AZURE_BORDER: "BAE6FD",

  GITHUB: "334155",
  GITHUB_BG: "F8FAFC",
  GITHUB_BORDER: "CBD5E1",

  DIGITALOCEAN: "2563EB",
  DIGITALOCEAN_BG: "EFF6FF",
  DIGITALOCEAN_BORDER: "BFDBFE",

  // Status & Utility Accents
  GREEN: "16A34A",
  GREEN_BG: "F0FDF4",
  GREEN_BORDER: "BBF7D0",

  RED: "DC2626",
  RED_BG: "FEF2F2",
  RED_BORDER: "FECACA",

  AMBER: "D97706",
  AMBER_BG: "FFFBEB",
  AMBER_BORDER: "FDE68A",

  BLUE: "2563EB",
  BLUE_BG: "EFF6FF",
  BLUE_BORDER: "BFDBFE"
};

const TOTAL_SLIDES = 20;

// Universal Slide Header
function addHeader(slide, title, category, accentColor = C.BLUE) {
  // Top thin accent bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: accentColor }
  });

  // Category Tag Box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 0.35, w: 2.8, h: 0.3,
    fill: { color: C.BLUE_BG },
    line: { color: C.BLUE_BORDER, width: 1 },
    rectRadius: 0.08
  });
  slide.addText(category.toUpperCase(), {
    x: MX, y: 0.35, w: 2.8, h: 0.3,
    fontSize: 8.5, bold: true, color: "1D4ED8",
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Slide Title
  slide.addText(title, {
    x: MX, y: 0.72, w: CW, h: 0.55,
    fontSize: 20, bold: true, color: C.NAVY,
    fontFace: "Segoe UI", valign: "middle"
  });
}

// Universal Slide Footer
function addFooter(slide, current) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: MX, y: 6.95, w: CW, h: 0.02,
    fill: { color: "E2E8F0" }
  });
  slide.addText("CONFIDENTIAL & PROPRIETARY | Cloud Web Deployment Architecture & DevOps Masterclass", {
    x: MX, y: 7.02, w: 8.5, h: 0.3,
    fontSize: 8.5, color: "94A3B8", fontFace: "Segoe UI", valign: "middle"
  });
  slide.addText(`Slide ${current} of ${TOTAL_SLIDES}`, {
    x: 10.533, y: 7.02, w: 2.0, h: 0.3,
    fontSize: 8.5, color: "94A3B8", align: "right", fontFace: "Segoe UI", valign: "middle"
  });
}

// =========================================================================
// SLIDE 1: Title Slide (Dark Premium Theme)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.NAVY };

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.8, w: CW, h: 5.9,
    fill: { color: C.NAVY_CARD },
    line: { color: "334155", width: 1.5 },
    rectRadius: 0.15
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.2, y: 1.15, w: 3.8, h: 0.35,
    fill: { color: "1E3A8A" },
    line: { color: "3B82F6", width: 1 },
    rectRadius: 0.08
  });
  slide.addText("CLOUD ARCHITECTURE & DEVOPS STRATEGY", {
    x: 1.2, y: 1.15, w: 3.8, h: 0.35,
    fontSize: 9, bold: true, color: "93C5FD",
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  slide.addText("Modern Web Deployment Masterclass:\nVercel vs. Alternative Platforms", {
    x: 1.2, y: 1.65, w: 10.9, h: 1.35,
    fontSize: 30, bold: true, color: C.WHITE, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  slide.addText("Comprehensive Evaluation: Architecture, Step-by-Step CI/CD Workflows, Pricing Economics, Deployment Difficulties & Decision Guide", {
    x: 1.2, y: 3.15, w: 10.9, h: 0.45,
    fontSize: 12.5, color: "94A3B8", fontFace: "Segoe UI"
  });

  // 8 Platform Badges (4 per row)
  const pCards = [
    { name: "Vercel", tag: "Next.js & Edge", color: "38BDF8", sub: "Gold Standard DX & Previews", x: 1.2, y: 3.9 },
    { name: "Cloudflare Pages", tag: "Zero-Egress Edge", color: "FB923C", sub: "Unlimited Bandwidth & 330+ PoPs", x: 4.0, y: 3.9 },
    { name: "Netlify", tag: "Jamstack Pioneer", color: "2DD4BF", sub: "Built-in Forms, Auth & Previews", x: 6.8, y: 3.9 },
    { name: "AWS Amplify", tag: "Hyperscale Cloud", color: "FBBF24", sub: "Direct AWS S3/Cognito/DynamoDB", x: 9.6, y: 3.9 },

    { name: "Firebase Hosting", tag: "Google Cloud Ecosystem", color: "FB7185", sub: "Instant CLI & Firestore Sync", x: 1.2, y: 5.15 },
    { name: "Azure Static Apps", tag: "Enterprise Microsoft", color: "60A5FA", sub: "Native GitHub Actions & C#/.NET", x: 4.0, y: 5.15 },
    { name: "GitHub Pages", tag: "100% Free Forever", color: "CBD5E1", sub: "Static Git Push & Zero Setup", x: 6.8, y: 5.15 },
    { name: "DigitalOcean", tag: "VPS & Flat Pricing", color: "818CF8", sub: "Full Root Linux, PM2 & 1TB Transfer", x: 9.6, y: 5.15 }
  ];

  pCards.forEach(p => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: p.y, w: 2.533, h: 1.05,
      fill: { color: "0A1020" },
      line: { color: p.color, width: 1.2 },
      rectRadius: 0.1
    });
    slide.addText(p.name, {
      x: p.x, y: p.y + 0.1, w: 2.533, h: 0.28,
      fontSize: 12.5, bold: true, color: C.WHITE, align: "center", fontFace: "Segoe UI"
    });
    slide.addText(p.tag, {
      x: p.x, y: p.y + 0.38, w: 2.533, h: 0.24,
      fontSize: 9, bold: true, color: p.color, align: "center", fontFace: "Segoe UI"
    });
    slide.addText(p.sub, {
      x: p.x + 0.1, y: p.y + 0.62, w: 2.333, h: 0.35,
      fontSize: 7.5, color: "94A3B8", align: "center", fontFace: "Segoe UI"
    });
  });

  slide.addText("Enterprise Edition | 2026 Architectural Evaluation", {
    x: 1.2, y: 6.35, w: 10.9, h: 0.3,
    fontSize: 9, color: "64748B", align: "center", fontFace: "Segoe UI"
  });
}

// =========================================================================
// SLIDE 2: Context: Why Look Beyond Vercel?
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "The Reality Check: Why Engineering Teams Look Beyond Vercel", "Strategic Context");

  const drivers = [
    {
      num: "01",
      title: "Commercial Licensing & Hobby Traps",
      accent: C.RED,
      bg: C.RED_BG,
      boxBorder: C.RED_BORDER,
      points: [
        "Strict Terms of Service: Vercel's Hobby plan is explicitly non-commercial. Any client, commercial booking, or monetized app breaches ToS.",
        "Forced Plan Migration: Moving to Pro immediately incurs $20/month per user, regardless of project scale.",
        "Team Seat Multiplier: Every developer, QA engineer, or manager added multiplies base costs ($20 x N seats)."
      ]
    },
    {
      num: "02",
      title: "Bandwidth & Egress Bill Shock",
      accent: C.AMBER,
      bg: C.AMBER_BG,
      boxBorder: C.AMBER_BORDER,
      points: [
        "Punitive Overage Invoicing: Bandwidth above allowance is billed at steep rates ($55 per 100 GB).",
        "Viral Traffic Penalty: A single viral marketing push, scrapers, or bot DDoS can generate an unexpected 4-figure invoice.",
        "No Hard Spending Caps: Historically, accounts could not set strict hard kill-switches, creating high financial anxiety."
      ]
    },
    {
      num: "03",
      title: "Serverless Execution & Backend Limits",
      accent: C.BLUE,
      bg: C.BLUE_BG,
      boxBorder: C.BLUE_BORDER,
      points: [
        "Hard Execution Timeouts: 10s default execution limit on Hobby (50s-60s on Pro). Fails on PDF generation or batch operations.",
        "No Persistent Connections: Cannot host long-lived WebSockets or background cron workers natively.",
        "Cold Start Headaches: Node.js serverless functions introduce 300ms–2000ms latency on un-warmed routes."
      ]
    }
  ];

  drivers.forEach((d, idx) => {
    const x = MX + idx * (3.75 + 0.24);
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.45, w: 3.75, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.45, w: 3.75, h: 0.9,
      fill: { color: d.bg },
      line: { color: d.boxBorder, width: 1 },
      rectRadius: 0.12
    });

    slide.addText(d.num, {
      x: x + 0.25, y: 1.55, w: 0.6, h: 0.65,
      fontSize: 20, bold: true, color: d.accent, fontFace: "Segoe UI"
    });
    slide.addText(d.title, {
      x: x + 0.9, y: 1.55, w: 2.6, h: 0.65,
      fontSize: 12, bold: true, color: C.MAIN, fontFace: "Segoe UI", valign: "middle"
    });

    d.points.forEach((pt, pIdx) => {
      const py = 2.55 + pIdx * 1.35;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x + 0.2, y: py, w: 3.35, h: 1.25,
        fill: { color: C.PAGE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });
      slide.addText(pt, {
        x: x + 0.35, y: py + 0.1, w: 3.05, h: 1.05,
        fontSize: 9, color: C.MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
      });
    });
  });

  addFooter(slide, 2);
}

// =========================================================================
// SLIDE 3: Modern Deployment Taxonomy
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Deployment Architecture Taxonomy: The 4 Core Models", "Architectural Foundations");

  const models = [
    {
      title: "1. Global Edge CDN",
      color: C.CLOUDFLARE,
      sub: "Cloudflare Pages, GitHub Pages",
      desc: "Static assets replicated to hundreds of edge PoPs worldwide. Microsecond response times with zero origin server load.",
      pros: "Zero bandwidth costs, extreme speed, immune to server crashes.",
      cons: "No native Node server runtime; dynamic code requires edge isolates or separate APIs."
    },
    {
      title: "2. Serverless Jamstack",
      color: C.VERCEL_ACCENT,
      sub: "Vercel, Netlify",
      desc: "Static frontend combined with auto-scaling ephemeral serverless functions triggered per HTTP request.",
      pros: "Zero DevOps maintenance, instant preview branches, automated git CI/CD.",
      cons: "Cold start delays, execution timeouts (10s–60s), bandwidth overage risk."
    },
    {
      title: "3. Managed Cloud Ecosystems",
      color: C.AWS,
      sub: "AWS Amplify, Firebase, Azure SWA",
      desc: "Direct integration into cloud hyperscalers (AWS, Google, Microsoft) bundling hosting, auth, and database SDKs.",
      pros: "Tight enterprise security, deep cloud services integration, global compliance.",
      cons: "Complex console UX, steep learning curve, subtle cloud billing traps."
    },
    {
      title: "4. Dedicated Cloud VPS",
      color: C.DIGITALOCEAN,
      sub: "DigitalOcean Droplet (Linux + Nginx)",
      desc: "Single dedicated or shared virtual private server running Linux, PM2, Node.js, and reverse proxy.",
      pros: "100% control, flat predictable bills ($4-$6/mo), persistent WebSockets & DB.",
      cons: "Requires Linux sysadmin, manual SSL renewal, manual security patching."
    }
  ];

  models.forEach((m, idx) => {
    const x = MX + idx * (2.8 + 0.177);
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.45, w: 2.8, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.45, w: 2.8, h: 0.9,
      fill: { color: m.color },
      line: { color: m.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(m.title, {
      x: x + 0.15, y: 1.55, w: 2.5, h: 0.4,
      fontSize: 12, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });
    slide.addText(m.sub, {
      x: x + 0.15, y: 1.95, w: 2.5, h: 0.3,
      fontSize: 8.5, color: "E2E8F0", fontFace: "Segoe UI"
    });

    const sections = [
      { label: "ARCHITECTURE CONCEPT", text: m.desc, color: C.MAIN },
      { label: "PRIMARY STRENGTHS", text: m.pros, color: C.GREEN },
      { label: "ARCHITECTURAL TRADE-OFFS", text: m.cons, color: C.RED }
    ];

    sections.forEach((sec, sIdx) => {
      const sy = 2.5 + sIdx * 1.4;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: x + 0.15, y: sy, w: 2.5, h: 1.3,
        fill: { color: C.PAGE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });
      slide.addText([
        { text: sec.label + "\n", options: { bold: true, fontSize: 8, color: sec.color } },
        { text: sec.text, options: { bold: false, fontSize: 8.5, color: C.MUTED } }
      ], {
        x: x + 0.25, y: sy + 0.08, w: 2.3, h: 1.14,
        fontFace: "Segoe UI", lineSpacingMultiple: 1.15
      });
    });
  });

  addFooter(slide, 3);
}

// =========================================================================
// SLIDE 4: Platform 1 — Vercel Deep Dive: Architecture, Pros & Cons
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform 1: Vercel — Architecture, Advantages & Disadvantages", "Platform Deep Dive (1/8)");

  // Left Card: Architecture & Pros
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.VERCEL },
    line: { color: C.VERCEL, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("VERCEL ARCHITECTURE & KEY ADVANTAGES", {
    x: MX + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Creators of Next.js | Serverless Frontend & Edge Optimization", {
    x: MX + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "94A3B8", fontFace: "Segoe UI"
  });

  const vPros = [
    { title: "FIRST-PARTY NEXT.JS SYNERGY", text: "Zero configuration for React Server Components (RSC), Incremental Static Regeneration (ISR), Image Optimization, and Edge Middleware." },
    { title: "BEST-IN-CLASS DEVELOPER EXPERIENCE (DX)", text: "Instant Git preview deployments for every branch and pull request, with in-browser visual feedback and team commenting." },
    { title: "GLOBAL EDGE NETWORK & AUTOMATIC DNS", text: "Smart routing between static CDN edge nodes and nearest AWS Lambda regions with automatic SSL certificate issuance." },
    { title: "INTEGRATED OBSERVABILITY", text: "Built-in Real User Monitoring (RUM), Core Web Vitals diagnostics, and real-time serverless execution logs." }
  ];

  vPros.forEach((p, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: p.title + "\n", options: { bold: true, fontSize: 8.5, color: C.VERCEL_ACCENT } },
      { text: p.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: MX + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Right Card: Disadvantages & Commercial Limitations
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.RED },
    line: { color: C.RED, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("LIMITATIONS & ARCHITECTURAL DISADVANTAGES", {
    x: 6.8 + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("License Enforcements, Steep Team Pricing & Execution Boundaries", {
    x: 6.8 + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "FECACA", fontFace: "Segoe UI"
  });

  const vCons = [
    { title: "STRICT COMMERCIAL TERMS ON FREE TIER", text: "Vercel Hobby plan explicitly forbids commercial sites, client projects, and monetized applications. Violators risk automated account suspension." },
    { title: "AGGRESSIVE SEAT-BASED PRICING", text: "Upgrading to Pro costs $20/month per user. Adding 5 team members costs $100/mo before accounting for any serverless compute consumption." },
    { title: "PUNITIVE BANDWIDTH OVERAGES", text: "Bandwidth overage costs $55 per 100 GB. Viral spikes or scraping crawlers can create massive unbudgeted monthly invoices." },
    { title: "VENDOR LOCK-IN & COLD STARTS", text: "Advanced Next.js features (ISR, Middleware) are tightly coupled to Vercel's proprietary infrastructure and painful to self-host." }
  ];

  vCons.forEach((c, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: c.title + "\n", options: { bold: true, fontSize: 8.5, color: C.RED } },
      { text: c.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: 6.8 + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 4);
}

// =========================================================================
// SLIDE 5: Vercel — Deployment Workflow & Real-World Failures
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Vercel: Deployment Workflow & Real-World Failures", "Deployment Mechanics (1/8)");

  // Left Column: Step-by-Step How We Deploy
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("HOW WE DEPLOY TO VERCEL (CI/CD PIPELINE)", {
    x: MX + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.NAVY, fontFace: "Segoe UI"
  });

  const vSteps = [
    { step: "1. CLI Installation & Login", detail: "npm i -g vercel\nvercel login (authenticates via GitHub or email magic link)" },
    { step: "2. Project Linking & Environment Setup", detail: "vercel link (binds local repository to Vercel project ID & team)\nPull environment variables: vercel env pull .env.local" },
    { step: "3. Configuration (vercel.json)", detail: "Define rewrite rules, caching headers and maxDuration:\n{ \"cleanUrls\": true, \"rewrites\": [{ \"source\": \"/api/(.*)\", \"destination\": \"/api/$1\" }] }" },
    { step: "4. Production Deployment & Git Trigger", detail: "Manual push: vercel --prod\nAutomated Git: git push origin main generates live production URL." }
  ];

  vSteps.forEach((s, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: s.step + "\n", options: { bold: true, fontSize: 8.5, color: C.BLUE } },
      { text: s.detail, options: { bold: false, fontSize: 7.8, color: C.MAIN, fontFace: "Consolas" } }
    ], {
      x: MX + 0.35, y: y + 0.06, w: 5.033, h: 0.88,
      valign: "middle", lineSpacingMultiple: 1.15
    });
  });

  // Right Column: Difficulties Faced in Deployment
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("REAL-WORLD DEPLOYMENT DIFFICULTIES & PITFALLS", {
    x: 6.8 + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.RED, fontFace: "Segoe UI"
  });

  const vDiffs = [
    { title: "FUNCTION TIMEOUT ERRORS (504 GATEWAY TIMEOUT)", issue: "Serverless functions fail abruptly if an API call or database query exceeds 10s on Hobby (or 50s on Pro). Turfify slot generation or report exports get aborted mid-flight." },
    { title: "EDGE VS. NODE RUNTIME DISCREPANCIES", text: "Vercel Edge Functions execute on V8 isolates, breaking packages relying on Node.js built-ins (crypto, fs, buffer). Builds succeed locally but fail in production." },
    { title: "STALE BUILD CACHE & HYDRATION MISMATCHES", text: "Aggressive incremental cache invalidation occasionally serves stale bundle assets to users, leading to React hydration errors and broken client-side routing." },
    { title: "ENVIRONMENT VARIABLE BRANCH DESYNCHRONIZATION", text: "Production, Preview, and Development env variables must be configured separately in dashboard; missing a variable causes silent API failures in preview URLs." }
  ];

  vDiffs.forEach((d, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: d.title + "\n", options: { bold: true, fontSize: 8.5, color: C.RED } },
      { text: d.issue || d.text, options: { bold: false, fontSize: 8, color: C.MAIN } }
    ], {
      x: 6.8 + 0.35, y: y + 0.06, w: 5.033, h: 0.9,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 5);
}

// =========================================================================
// SLIDE 6: Platform 2 — Cloudflare Pages Deep Dive
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform 2: Cloudflare Pages — Architecture, Advantages & Disadvantages", "Platform Deep Dive (2/8)", C.CLOUDFLARE);

  // Left Card: Pros
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.CLOUDFLARE },
    line: { color: C.CLOUDFLARE, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("CLOUDFLARE PAGES ARCHITECTURE & STRENGTHS", {
    x: MX + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Global Anycast Edge Network | 330+ Data Centers | 0ms Cold Starts", {
    x: MX + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "FFF7ED", fontFace: "Segoe UI"
  });

  const cfPros = [
    { title: "UNLIMITED FREE BANDWIDTH (ZERO BILL SHOCK)", text: "Cloudflare charges $0 for bandwidth on both Free and Paid tiers. Absolutely immune to egress surcharges, traffic spikes, or DDoS scraper penalties." },
    { title: "INDUSTRY-LEADING GLOBAL LATENCY", text: "Runs directly in 330+ cities worldwide on Cloudflare's Anycast edge. 95% of the world's population is within 50ms of a PoP." },
    { title: "NATIVE EDGE ECOSYSTEM (D1, KV, R2, QUEUES)", text: "Seamless integration with Cloudflare D1 (Serverless SQL), KV (Key-Value), Vectorize, and R2 (S3-compatible storage with zero egress fees)." },
    { title: "COMMERCIAL USE ALLOWED ON FREE TIER", text: "Unlike Vercel Hobby, Cloudflare Pages Free permits commercial production workloads, client apps, and revenue-generating startups." }
  ];

  cfPros.forEach((p, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: p.title + "\n", options: { bold: true, fontSize: 8.5, color: C.CLOUDFLARE } },
      { text: p.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: MX + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Right Card: Cons
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: "C2410C" },
    line: { color: "C2410C", width: 1 },
    rectRadius: 0.12
  });
  slide.addText("LIMITATIONS & RUNTIME BOUNDARIES", {
    x: 6.8 + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("V8 Isolate Constraints, Native Binary Limits & SSR Adapter Overhead", {
    x: 6.8 + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "FED7AA", fontFace: "Segoe UI"
  });

  const cfCons = [
    { title: "NOT A FULL NODE.JS ENVIRONMENT", text: "Workers run on lightweight V8 isolates. Packages using native C++ binaries, raw file system access, or heavy Node APIs fail without polyfills." },
    { title: "NEXT.JS SSR ADAPTER COMPLEXITY", text: "Deploying full SSR Next.js requires @cloudflare/next-on-pages adapter, which can lag behind the latest Next.js canary features." },
    { title: "500 BUILDS / MONTH LIMIT ON FREE TIER", text: "While bandwidth is infinite, build triggers are limited to 500/mo. Large teams with active CI/CD pipelines need the $5/mo plan." },
    { title: "STEEPER LEARNING CURVE FOR EDGE APIS", text: "Wrangler CLI, Bindings, and Request/Response Web standards require more manual configuration than Vercel's zero-config approach." }
  ];

  cfCons.forEach((c, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.CLOUDFLARE_BG },
      line: { color: C.CLOUDFLARE_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: c.title + "\n", options: { bold: true, fontSize: 8.5, color: "C2410C" } },
      { text: c.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: 6.8 + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 6);
}

// =========================================================================
// SLIDE 7: Cloudflare Pages — Deployment Workflow & Failures
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Cloudflare Pages: Deployment Workflow & Real-World Failures", "Deployment Mechanics (2/8)", C.CLOUDFLARE);

  // Left Column: How We Deploy
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("HOW WE DEPLOY TO CLOUDFLARE PAGES", {
    x: MX + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.NAVY, fontFace: "Segoe UI"
  });

  const cfSteps = [
    { step: "1. CLI Setup via Wrangler", detail: "npm install -g wrangler\nwrangler login (authenticates browser OAuth with Cloudflare)" },
    { step: "2. Configuration (wrangler.toml)", detail: "name = \"turfify-app\"\npages_build_output_dir = \"dist\"\ncompatibility_flags = [\"nodejs_compat\"]\ncompatibility_date = \"2026-01-01\"" },
    { step: "3. Direct Asset Deployment", detail: "npm run build\nnpx wrangler pages deploy dist --project-name=turfify" },
    { step: "4. Git-Integrated Automatic CI/CD", detail: "Link GitHub repository in Cloudflare Dashboard.\nEvery push to main deploys instantly across 330+ Edge PoPs with 0ms propagation." }
  ];

  cfSteps.forEach((s, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: s.step + "\n", options: { bold: true, fontSize: 8.5, color: C.CLOUDFLARE } },
      { text: s.detail, options: { bold: false, fontSize: 8, color: C.MAIN, fontFace: "Consolas" } }
    ], {
      x: MX + 0.35, y: y + 0.06, w: 5.033, h: 0.9,
      lineSpacingMultiple: 1.15
    });
  });

  // Right Column: Difficulties Faced
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("REAL-WORLD DEPLOYMENT DIFFICULTIES & PITFALLS", {
    x: 6.8 + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.RED, fontFace: "Segoe UI"
  });

  const cfDiffs = [
    { title: "NODE COMPATIBILITY FLAG OMISSIONS", issue: "Failing to set nodejs_compat in wrangler.toml results in fatal \"Cannot resolve module 'node:crypto' or 'buffer'\" crashes at edge execution time." },
    { title: "CLIENT-SIDE SPA ROUTING 404S", issue: "Single Page Apps (React/Vue) return Cloudflare 404 on page refresh unless an explicit _routes.json or index.html fallback rewrite is configured." },
    { title: "CRYPTIC EDGE BUILD LOGS", issue: "When edge worker functions fail during compilation, Cloudflare build logs often output minified webpack stack traces with unhelpful line numbers." },
    { title: "ENVIRONMENT BINDING SYNTAX CONFUSION", issue: "Variables in Cloudflare Pages must be accessed via context.env or process.env depending on whether Vite, Next, or vanilla Workers are used." }
  ];

  cfDiffs.forEach((d, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: d.title + "\n", options: { bold: true, fontSize: 8.5, color: C.RED } },
      { text: d.issue, options: { bold: false, fontSize: 8, color: C.MAIN } }
    ], {
      x: 6.8 + 0.35, y: y + 0.06, w: 5.033, h: 0.9,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 7);
}

// =========================================================================
// SLIDE 8: Platform 3 — Netlify Deep Dive
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform 3: Netlify — Architecture, Advantages & Disadvantages", "Platform Deep Dive (3/8)", C.NETLIFY);

  // Left Card: Pros
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.NETLIFY },
    line: { color: C.NETLIFY, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("NETLIFY ARCHITECTURE & KEY ADVANTAGES", {
    x: MX + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Pioneers of Jamstack | High-Productivity Frontend & Workflow Suite", {
    x: MX + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "CCFBF1", fontFace: "Segoe UI"
  });

  const netPros = [
    { title: "BUILT-IN SERVERLESS FORMS & NOTIFICATIONS", text: "Capture form submissions directly by adding netlify attribute in HTML. Eliminates the need to write backend contact/booking form endpoints." },
    { title: "INTEGRATED USER IDENTITY & AUTHENTICATION", text: "Netlify Identity offers pre-built JWT authentication, role-based access control, and user management out of the box." },
    { title: "SPLIT TESTING & BRANCH PREVIEWS", text: "Perform traffic splitting and A/B tests directly on the edge between Git branches without running external client scripts." },
    { title: "RICH PLUGIN ECOSYSTEM", text: "Over 100+ community build plugins for sitemap generation, image compression, lighthouse audits, and security header injection." }
  ];

  netPros.forEach((p, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: p.title + "\n", options: { bold: true, fontSize: 8.5, color: C.NETLIFY } },
      { text: p.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: MX + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Right Card: Cons
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: "0F766E" },
    line: { color: "0F766E", width: 1 },
    rectRadius: 0.12
  });
  slide.addText("LIMITATIONS & COMMERCIAL DRAWBACKS", {
    x: 6.8 + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Seat Tax, Bandwidth Traps & Slower Build Pipeline Speeds", {
    x: 6.8 + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "99F6E4", fontFace: "Segoe UI"
  });

  const netCons = [
    { title: "STEEP TEAM SEAT FEES ($19/MEMBER/MO)", text: "Similar to Vercel, adding collaborators incurs a $19/seat monthly charge, quickly multiplying small business SaaS operational overhead." },
    { title: "EXTREME BANDWIDTH OVERAGE RATES ($55/100GB)", text: "Exceeding the 100 GB free threshold automatically charges $55 per additional 100 GB block, creating substantial bill risk." },
    { title: "SLOW CONCURRENT BUILD PIPELINES", text: "Free and Starter tiers run on shared build workers with 1 concurrent build slot. Queues back up during frequent git pushes." },
    { title: "SERVERLESS FUNCTION RUNTIME TIMEOUTS", text: "Netlify serverless functions default to a 10s execution limit (max 26s upon request). Incompatible with heavy background processing." }
  ];

  netCons.forEach((c, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.NETLIFY_BG },
      line: { color: C.NETLIFY_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: c.title + "\n", options: { bold: true, fontSize: 8.5, color: "0F766E" } },
      { text: c.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: 6.8 + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 8);
}

// =========================================================================
// SLIDE 9: Netlify — Deployment Workflow & Failures
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Netlify: Deployment Workflow & Real-World Failures", "Deployment Mechanics (3/8)", C.NETLIFY);

  // Left Column: How We Deploy
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("HOW WE DEPLOY TO NETLIFY", {
    x: MX + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.NAVY, fontFace: "Segoe UI"
  });

  const netSteps = [
    { step: "1. CLI Installation & Auth", detail: "npm install -g netlify-cli\nnetlify login (browser OAuth authentication)" },
    { step: "2. Configuration (netlify.toml)", detail: "[build] command = \"npm run build\" | publish = \"dist\"\n[[redirects]] from = \"/*\" to = \"/index.html\" status = 200" },
    { step: "3. Direct Production Deploy", detail: "npm run build\nnetlify deploy --prod --dir=dist" },
    { step: "4. Git Continuous Deployment", detail: "Link GitHub repository in Netlify console. Webhooks automatically trigger staging preview branches and production deploys on git push." }
  ];

  netSteps.forEach((s, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: s.step + "\n", options: { bold: true, fontSize: 8.5, color: C.NETLIFY } },
      { text: s.detail, options: { bold: false, fontSize: 7.8, color: C.MAIN, fontFace: "Consolas" } }
    ], {
      x: MX + 0.35, y: y + 0.06, w: 5.033, h: 0.88,
      valign: "middle", lineSpacingMultiple: 1.15
    });
  });

  // Right Column: Difficulties Faced
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("REAL-WORLD DEPLOYMENT DIFFICULTIES & PITFALLS", {
    x: 6.8 + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.RED, fontFace: "Segoe UI"
  });

  const netDiffs = [
    { title: "BUILD MINUTE EXHAUSTION LOCKOUT", issue: "Free tier offers only 300 build minutes/month. Heavy npm dependencies or frequent commits can deplete this in under 2 weeks, freezing all site updates." },
    { title: "REDIRECT REDUNDANCY & CACHE CONFUSION", issue: "Conflicting rules between _redirects text files and netlify.toml cause silent 301 redirection loops or failed client-side deep links." },
    { title: "FUNCTION COLD START DELAYS", issue: "Netlify Functions run on AWS Lambda. Rarely accessed endpoints suffer from 800ms–2000ms latency spikes during cold starts." },
    { title: "DEPLOYMENT SIZE & ZIP LIMITS", issue: "Serverless function bundles are restricted to 50MB zipped / 250MB uncompressed, causing build crashes when including PDF engines or Puppeteer." }
  ];

  netDiffs.forEach((d, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: d.title + "\n", options: { bold: true, fontSize: 8.5, color: C.RED } },
      { text: d.issue, options: { bold: false, fontSize: 8, color: C.MAIN } }
    ], {
      x: 6.8 + 0.35, y: y + 0.06, w: 5.033, h: 0.9,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 9);
}

// =========================================================================
// SLIDE 10: Platform 4 — AWS Amplify Deep Dive
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform 4: AWS Amplify — Architecture, Advantages & Disadvantages", "Platform Deep Dive (4/8)", C.AWS);

  // Left Card: Pros
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.AWS },
    line: { color: C.AWS, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("AWS AMPLIFY ARCHITECTURE & ENTERPRISE STRENGTHS", {
    x: MX + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Full AWS Ecosystem Integration | CloudFront CDN | Enterprise Scale", {
    x: MX + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "FEF3C7", fontFace: "Segoe UI"
  });

  const awsPros = [
    { title: "NATIVE AWS INFRASTRUCTURE BINDING", text: "Directly provisions and links S3 buckets, CloudFront distributions, Cognito user pools, DynamoDB tables, and AppSync GraphQL APIs." },
    { title: "GLOBAL CLOUDFRONT CDN DISTRIBUTION", text: "Backbone runs on Amazon's enterprise CloudFront CDN with 450+ Points of Presence and AWS Shield Standard DDoS protection." },
    { title: "ENTERPRISE COMPLIANCE & GOVERNANCE", text: "Satisfies strict regulatory audits (HIPAA, SOC 2, PCI-DSS, ISO 27001) natively without third-party vendor certification hurdles." },
    { title: "FEATURE BRANCH DEPLOYMENTS & PR PREVIEWS", text: "Full git-connected preview pipelines with custom subdomain branching (e.g., staging.turfify.com, dev.turfify.com)." }
  ];

  awsPros.forEach((p, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: p.title + "\n", options: { bold: true, fontSize: 8.5, color: C.AWS } },
      { text: p.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: MX + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Right Card: Cons
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: "B45309" },
    line: { color: "B45309", width: 1 },
    rectRadius: 0.12
  });
  slide.addText("LIMITATIONS & OPERATIONAL OVERHEAD", {
    x: 6.8 + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("12-Month Expiration Cliff, Complex IAM & CloudFormation Rollbacks", {
    x: 6.8 + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "FDE68A", fontFace: "Segoe UI"
  });

  const awsCons = [
    { title: "FREE TIER EXPIRES AFTER 12 MONTHS", text: "Amplify's free tier is strictly limited to the first 12 months after AWS account creation. Year 2 transitions to unyielding metered billing." },
    { title: "COMPLEX AWS CONSOLE & PERMISSIONS UX", text: "Managing IAM roles, policies, CloudWatch logs, and billing alarms requires deep AWS expertise compared to modern PaaS tools." },
    { title: "CRYPTIC CLOUDFORMATION ROLLBACK LOOPS", text: "Under the hood, Amplify uses CloudFormation. When a deployment fails, the stack rollback can stall builds for 30–45 minutes." },
    { title: "SLOW BUILD TIMES RELATIVE TO VERCEL", text: "Provisioning dynamic build containers on AWS CodeBuild often takes 4 to 8 minutes per deployment even for small code changes." }
  ];

  awsCons.forEach((c, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.AWS_BG },
      line: { color: C.AWS_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: c.title + "\n", options: { bold: true, fontSize: 8.5, color: "B45309" } },
      { text: c.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: 6.8 + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 10);
}

// =========================================================================
// SLIDE 11: AWS Amplify — Deployment Workflow & Failures
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "AWS Amplify: Deployment Workflow & Real-World Failures", "Deployment Mechanics (4/8)", C.AWS);

  // Left Column: How We Deploy
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("HOW WE DEPLOY TO AWS AMPLIFY", {
    x: MX + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.NAVY, fontFace: "Segoe UI"
  });

  const awsSteps = [
    { step: "1. CLI Setup & IAM Configuration", detail: "npm install -g @aws-amplify/cli\namplify configure (configures AWS Access Key & Secret)" },
    { step: "2. Initialize Amplify Project", detail: "amplify init (specifies project name and cloud environment)" },
    { step: "3. Build Specification (amplify.yml)", detail: "frontend: phases: { build: { commands: ['npm run build'] } }\nartifacts: { baseDirectory: dist, files: ['**/*'] }" },
    { step: "4. Cloud Push & Hosting Publication", detail: "amplify add hosting\namplify publish (uploads to S3, invalidates CloudFront)" }
  ];

  awsSteps.forEach((s, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: s.step + "\n", options: { bold: true, fontSize: 8.5, color: C.AWS } },
      { text: s.detail, options: { bold: false, fontSize: 7.8, color: C.MAIN, fontFace: "Consolas" } }
    ], {
      x: MX + 0.35, y: y + 0.06, w: 5.033, h: 0.88,
      valign: "middle", lineSpacingMultiple: 1.15
    });
  });

  // Right Column: Difficulties Faced
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("REAL-WORLD DEPLOYMENT DIFFICULTIES & PITFALLS", {
    x: 6.8 + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.RED, fontFace: "Segoe UI"
  });

  const awsDiffs = [
    { title: "IAM ROLE & POLICY REJECTION", issue: "Deployments frequently abort due to missing granular IAM permissions for S3 PutObject or CloudFront CreateInvalidation in the service role." },
    { title: "SSR MONOREPO BUILD CACHING BUGS", issue: "Next.js SSR deployments on Amplify Gen 2 often fail when detecting package.json in monorepo workspaces, requiring manual amplify.yml overrides." },
    { title: "CLOUDFRONT CACHE INVALIDATION DELAYS", issue: "While the build may report 'Success', edge CloudFront nodes take 2 to 5 minutes to fully propagate new HTML/CSS assets globally." },
    { title: "ORPHANED CLOUDFORMATION RESOURCES", issue: "Failed deletions or manual edits in the AWS Console leave backend resources in UPDATE_ROLLBACK_FAILED states, blocking subsequent deployments." }
  ];

  awsDiffs.forEach((d, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: d.title + "\n", options: { bold: true, fontSize: 8.5, color: C.RED } },
      { text: d.issue, options: { bold: false, fontSize: 8, color: C.MAIN } }
    ], {
      x: 6.8 + 0.35, y: y + 0.06, w: 5.033, h: 0.9,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 11);
}

// =========================================================================
// SLIDE 12: Platform 5 — Firebase Hosting Deep Dive
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform 5: Firebase Hosting — Architecture, Advantages & Disadvantages", "Platform Deep Dive (5/8)", C.FIREBASE);

  // Left Card: Pros
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.FIREBASE },
    line: { color: C.FIREBASE, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("FIREBASE HOSTING ARCHITECTURE & STRENGTHS", {
    x: MX + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Google Cloud Global CDN | Integrated Firestore & Mobile SDKs", {
    x: MX + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "FFE4E6", fontFace: "Segoe UI"
  });

  const fbPros = [
    { title: "DEEP GOOGLE CLOUD ECOSYSTEM SYNERGY", text: "Native binding with Firestore real-time database, Firebase Authentication, Cloud Storage, and Google Analytics in one unified client SDK." },
    { title: "INSTANT ATOMIC DEPLOYMENTS & ROLLBACKS", text: "Asset uploading is hash-based and atomic. 1-click instantaneous rollback to any previous deployment version with zero downtime." },
    { title: "FREE AUTOMATED MULTI-DOMAIN SSL", text: "One-click custom domain verification with automated zero-touch Let's Encrypt SSL certificate issuance and renewal." },
    { title: "MICROSERVICE ROUTING (CLOUD RUN / FUNCTIONS)", text: "Direct rewrite rules route specific API endpoints to Google Cloud Run containers or serverless Cloud Functions under the same domain." }
  ];

  fbPros.forEach((p, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: p.title + "\n", options: { bold: true, fontSize: 8.5, color: C.FIREBASE } },
      { text: p.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: MX + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Right Card: Cons
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: "BE123C" },
    line: { color: "BE123C", width: 1 },
    rectRadius: 0.12
  });
  slide.addText("LIMITATIONS & OPERATIONAL BOUNDARIES", {
    x: 6.8 + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Tiny 360 MB/day Free Bandwidth, Mandatory Credit Card for APIs", {
    x: 6.8 + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "FECDD3", fontFace: "Segoe UI"
  });

  const fbCons = [
    { title: "STRICT 360 MB / DAY BANDWIDTH CAP (SPARK)", text: "Free Spark plan restricts bandwidth to 360 MB per day (approx 10 GB/mo). Exceeding this instantly returns HTTP 509 Bandwidth Limit Exceeded." },
    { title: "CREDIT CARD REQUIRED FOR SERVERLESS (BLAZE)", text: "Deploying Node.js Cloud Functions or external API calls requires upgrading to the Blaze pay-as-you-go plan with a verified credit card." },
    { title: "NO NATIVE GIT PREVIEW DEPLOYMENTS", text: "Unlike Vercel or Netlify, Firebase does not generate automated PR preview URLs out-of-the-box without setting up GitHub Actions workflows." },
    { title: "PROPRIETARY GOOGLE CLOUD SDK DEPENDENCY", text: "Heavy architectural lock-in to proprietary Firestore queries and Firebase rules, making migration away painful." }
  ];

  fbCons.forEach((c, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.FIREBASE_BG },
      line: { color: C.FIREBASE_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: c.title + "\n", options: { bold: true, fontSize: 8.5, color: "BE123C" } },
      { text: c.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: 6.8 + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 12);
}

// =========================================================================
// SLIDE 13: Firebase Hosting — Deployment Workflow & Failures
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Firebase Hosting: Deployment Workflow & Real-World Failures", "Deployment Mechanics (5/8)", C.FIREBASE);

  // Left Column: How We Deploy
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("HOW WE DEPLOY TO FIREBASE HOSTING", {
    x: MX + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.NAVY, fontFace: "Segoe UI"
  });

  const fbSteps = [
    { step: "1. CLI Setup & Google Login", detail: "npm install -g firebase-tools\nfirebase login (authenticates via Google account in browser)" },
    { step: "2. Initialization (firebase init hosting)", detail: "Selects Google Cloud project, public directory (dist), and configures SPA single-page app rewrite rule." },
    { step: "3. Configuration (firebase.json)", detail: "{ \"hosting\": { \"public\": \"dist\", \"rewrites\": [{ \"source\": \"**\", \"destination\": \"/index.html\" }] } }" },
    { step: "4. Deployment Execution", detail: "npm run build\nfirebase deploy --only hosting (published with version hash)" }
  ];

  fbSteps.forEach((s, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: s.step + "\n", options: { bold: true, fontSize: 8.5, color: C.FIREBASE } },
      { text: s.detail, options: { bold: false, fontSize: 7.8, color: C.MAIN, fontFace: "Consolas" } }
    ], {
      x: MX + 0.35, y: y + 0.06, w: 5.033, h: 0.88,
      valign: "middle", lineSpacingMultiple: 1.15
    });
  });

  // Right Column: Difficulties Faced
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("REAL-WORLD DEPLOYMENT DIFFICULTIES & PITFALLS", {
    x: 6.8 + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.RED, fontFace: "Segoe UI"
  });

  const fbDiffs = [
    { title: "UNNOTICED DAILY QUOTA CHOKE (HTTP 509)", issue: "The 360 MB/day limit can be exhausted in hours if loading uncompressed turf images or demo videos, taking the application offline until midnight UTC." },
    { title: "PROJECT ALIAS OVERWRITING HAZARDS", issue: ".firebaserc tracks project IDs. Accidental deployment without checking firebase use prod can push experimental test builds into live production." },
    { title: "MULTI-SITE ROUTING CONFUSION", issue: "Hosting multiple websites under one project requires complex target mapping in firebase.json (targets: [{ name: 'admin', apply: [...] }])." },
    { title: "CORS BLOCKS ON FUNCTION REWRITES", issue: "Rewriting API endpoints to Cloud Functions on separate domains frequently triggers strict browser CORS preflight failures without custom middleware." }
  ];

  fbDiffs.forEach((d, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: d.title + "\n", options: { bold: true, fontSize: 8.5, color: C.RED } },
      { text: d.issue, options: { bold: false, fontSize: 8, color: C.MAIN } }
    ], {
      x: 6.8 + 0.35, y: y + 0.06, w: 5.033, h: 0.9,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 13);
}

// =========================================================================
// SLIDE 14: Platform 6 — Azure Static Web Apps Deep Dive
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform 6: Azure Static Web Apps — Architecture, Pros & Cons", "Platform Deep Dive (6/8)", C.AZURE);

  // Left Card: Pros
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.AZURE },
    line: { color: C.AZURE, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("AZURE STATIC WEB APPS ARCHITECTURE & STRENGTHS", {
    x: MX + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Microsoft Enterprise Cloud | Built-in Azure Functions & Auth Roles", {
    x: MX + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "E0F2FE", fontFace: "Segoe UI"
  });

  const azPros = [
    { title: "NATIVE GITHUB ACTIONS WORKFLOW GENERATION", text: "Creating an Azure Static Web App automatically commits a production-ready GitHub Actions YAML workflow directly into your repo." },
    { title: "UNIFIED SERVERLESS API (AZURE FUNCTIONS)", text: "Integrate managed serverless backends powered by Azure Functions in Node.js, Python, or C# .NET under the same domain without CORS." },
    { title: "GENEROUS FREE TIER FOR ENTERPRISE APPS", text: "Free plan includes 100 GB bandwidth / month, 3 custom domains, free SSL, and staging preview environments for every pull request." },
    { title: "BUILT-IN ENTERPRISE ROLE-BASED AUTH", text: "Pre-configured authentication with Microsoft Entra ID (Active Directory), GitHub, and Google with zero custom auth code." }
  ];

  azPros.forEach((p, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: p.title + "\n", options: { bold: true, fontSize: 8.5, color: C.AZURE } },
      { text: p.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: MX + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Right Card: Cons
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: "0369A1" },
    line: { color: "0369A1", width: 1 },
    rectRadius: 0.12
  });
  slide.addText("LIMITATIONS & ENTERPRISE FRICTION", {
    x: 6.8 + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Complex Azure Portal UI, Static Routing Quotas & Community Adoption", {
    x: 6.8 + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "BAE6FD", fontFace: "Segoe UI"
  });

  const azCons = [
    { title: "OVERWHELMING AZURE PORTAL COMPLEXITY", text: "Navigating subscriptions, resource groups, App Service plans, and RBAC permissions is intimidating for non-enterprise developers." },
    { title: "STAGING ENVIRONMENT CONSTRAINTS", text: "Free tier allows only 3 temporary staging preview environments simultaneously; additional PRs fail until old staging slots are cleared." },
    { title: "STRICT ROUTING CONFIGURATION RIGIDITY", text: "Routing rules must strictly comply with staticwebapp.config.json schema; any minor JSON formatting error disables all custom rewrites." },
    { title: "SMALLER INDIE & STARTUP COMMUNITY", text: "Most web development tutorials, open-source adapters, and starters prioritize Vercel/Netlify; finding community troubleshooting takes longer." }
  ];

  azCons.forEach((c, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.AZURE_BG },
      line: { color: C.AZURE_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: c.title + "\n", options: { bold: true, fontSize: 8.5, color: "0369A1" } },
      { text: c.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: 6.8 + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 14);
}

// =========================================================================
// SLIDE 15: Azure Static Web Apps — Deployment Workflow & Failures
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Azure Static Web Apps: Deployment Workflow & Real-World Failures", "Deployment Mechanics (6/8)", C.AZURE);

  // Left Column: How We Deploy
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("HOW WE DEPLOY TO AZURE STATIC WEB APPS", {
    x: MX + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.NAVY, fontFace: "Segoe UI"
  });

  const azSteps = [
    { step: "1. CLI Setup via Azure SWA CLI", detail: "npm install -g @azure/static-web-apps-cli\nswa login" },
    { step: "2. Configuration (staticwebapp.config.json)", detail: "Define SPA fallback routes and asset bypass:\n{ \"navigationFallback\": { \"rewrite\": \"/index.html\", \"exclude\": [\"/images/*\", \"/css/*\"] } }" },
    { step: "3. Direct Local & Remote Deployment", detail: "npm run build\nswa deploy ./dist --env production" },
    { step: "4. Automated GitHub Actions Workflow", detail: "Uses Azure/static-web-apps-deploy action with secret AZURE_STATIC_WEB_APPS_API_TOKEN. Builds on every push." }
  ];

  azSteps.forEach((s, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: s.step + "\n", options: { bold: true, fontSize: 8.5, color: C.AZURE } },
      { text: s.detail, options: { bold: false, fontSize: 7.8, color: C.MAIN, fontFace: "Consolas" } }
    ], {
      x: MX + 0.35, y: y + 0.06, w: 5.033, h: 0.88,
      valign: "middle", lineSpacingMultiple: 1.15
    });
  });

  // Right Column: Difficulties Faced
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addText("REAL-WORLD DEPLOYMENT DIFFICULTIES & PITFALLS", {
    x: 6.8 + 0.3, y: 1.65, w: 5.133, h: 0.35,
    fontSize: 12, bold: true, color: C.RED, fontFace: "Segoe UI"
  });

  const azDiffs = [
    { title: "DEPLOYMENT TOKEN INVALIDATION", issue: "Regenerating deployment credentials in the Azure Portal breaks the GitHub Actions repository secret, causing all subsequent CI/CD runs to throw HTTP 401 Unauthorized." },
    { title: "ROUTE FALLBACK EXCLUSION ERRORS", issue: "Failing to explicitly exclude static image/asset extensions in navigationFallback can cause missing images to serve index.html with HTTP 200 instead of 404." },
    { title: "API FOLDER LOCATION MISMATCH", issue: "If api_location in GitHub Actions does not precisely match the backend functions folder, the build fails without clear diagnostics." },
    { title: "ORPHANED STAGING SLOTS EXCEEDING QUOTA", issue: "Closing PRs without the automated GitHub Actions cleanup step leaves ghost preview environments active, hitting the 3-slot limit." }
  ];

  azDiffs.forEach((d, idx) => {
    const y = 2.15 + idx * 1.12;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 1.02,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: d.title + "\n", options: { bold: true, fontSize: 8.5, color: C.RED } },
      { text: d.issue, options: { bold: false, fontSize: 8, color: C.MAIN } }
    ], {
      x: 6.8 + 0.35, y: y + 0.06, w: 5.033, h: 0.9,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 15);
}

// =========================================================================
// SLIDE 16: Platform 7 — GitHub Pages Deep Dive, Workflow & Difficulties
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform 7: GitHub Pages — Pure Static Hosting, Workflow & Pitfalls", "Platform Deep Dive (7/8)", C.GITHUB);

  // Left Card: Architecture & How We Deploy
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.GITHUB },
    line: { color: C.GITHUB, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("GITHUB PAGES: 100% FREE STATIC HOSTING & WORKFLOW", {
    x: MX + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 12.5, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Direct Git Integration | Zero Operational Cost Forever | Custom Domains", {
    x: MX + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "CBD5E1", fontFace: "Segoe UI"
  });

  const ghSteps = [
    { title: "STEP 1: REPOSITORY CONFIGURATION", text: "Enable GitHub Pages in Repo Settings > Pages. Source: Deploy from branch (main / docs folder) OR GitHub Actions." },
    { title: "STEP 2: DIRECT BRANCH DEPLOYMENT", text: "npm run build\nCommit build output to gh-pages branch: npx gh-pages -d dist\nDirectly served at https://<username>.github.io/<repo>" },
    { title: "STEP 3: GITHUB ACTIONS PIPELINE", text: "Use official actions/deploy-pages@v4 to automatically build and publish artifacts on every git push to main." },
    { title: "STEP 4: CUSTOM DOMAIN & HTTPS", text: "Add CNAME file containing turfify.com in repo root. GitHub automatically provisions and renews Let's Encrypt SSL certificate." }
  ];

  ghSteps.forEach((s, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: s.title + "\n", options: { bold: true, fontSize: 8.5, color: C.GITHUB } },
      { text: s.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: MX + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  // Right Card: Limitations & Difficulties
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.RED },
    line: { color: C.RED, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("REAL-WORLD DIFFICULTIES & HARD BOUNDARIES", {
    x: 6.8 + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Strictly Static Assets Only | SPA Routing Breakages | Public Repo Mandate", {
    x: 6.8 + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "FECACA", fontFace: "Segoe UI"
  });

  const ghDiffs = [
    { title: "THE NOTORIOUS SPA 404 ROUTING BUG", text: "React/Vue client routers fail when users refresh /book or /turfs. GitHub Pages looks for physical .html files. Requires a custom 404.html redirect hack or hash routing." },
    { title: "ZERO SERVERLESS / BACKEND CAPABILITY", text: "Strictly hosts static files. Cannot execute Node.js, Express, or SQL database connections. Dynamic features require external backend hosting." },
    { title: "PUBLIC REPO MANDATE ON FREE TIER", text: "GitHub Pages is only free for public repositories. Private repositories require a paid GitHub Pro ($4/mo) or Team account." },
    { title: "STRICT BANDWIDTH & SITE SIZE LIMITS", text: "Sites are restricted to 1 GB maximum disk size and a soft limit of 100 GB bandwidth / month; heavy sites face throttling." }
  ];

  ghDiffs.forEach((d, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: d.title + "\n", options: { bold: true, fontSize: 8.5, color: C.RED } },
      { text: d.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: 6.8 + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 16);
}

// =========================================================================
// SLIDE 17: Platform 8 — DigitalOcean VPS & App Platform Deep Dive
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform 8: DigitalOcean — VPS Control, Flat Pricing & Real-World Realities", "Platform Deep Dive (8/8)", C.DIGITALOCEAN);

  // Left Card: Architecture & How We Deploy
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: C.DIGITALOCEAN },
    line: { color: C.DIGITALOCEAN, width: 1 },
    rectRadius: 0.12
  });
  slide.addText("DIGITALOCEAN: VPS & MANAGED APP PLATFORM", {
    x: MX + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Full Root Access | Flat $4-$6/mo Pricing | 1 TB to 2 TB Bandwidth", {
    x: MX + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "DBEAFE", fontFace: "Segoe UI"
  });

  const doSteps = [
    { title: "DEPLOYMENT PATH A: MANAGED APP PLATFORM", text: "Link GitHub repo in DO App Platform. 3 static sites are 100% Free. Dynamic Node/Express apps cost flat $5/month with automated zero-touch CI/CD." },
    { title: "DEPLOYMENT PATH B: DROPLET VPS (FULL CONTROL)", text: "Provision $4 or $6/mo Ubuntu Droplet (1 vCPU, 1 GB RAM, 25 GB SSD, 1 TB transfer).\nSSH root access: ssh root@<droplet-ip>" },
    { title: "NODE PROCESS RUNTIME (PM2)", text: "Run app continuously in background:\npm install -g pm2\npm2 start server.js --name turfify-backend\npm2 startup && pm2 save" },
    { title: "NGINX REVERSE PROXY & CERTBOT SSL", text: "Configure Nginx to proxy port 80/443 to Node port 3000.\nRun certbot --nginx -d api.turfify.com for automated SSL certificate." }
  ];

  doSteps.forEach((s, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MX + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: s.title + "\n", options: { bold: true, fontSize: 8.5, color: C.DIGITALOCEAN } },
      { text: s.text, options: { bold: false, fontSize: 8, color: C.MAIN, fontFace: "Consolas" } }
    ], {
      x: MX + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      lineSpacingMultiple: 1.15
    });
  });

  // Right Card: Operational Difficulties
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 5.3,
    fill: { color: C.CARD },
    line: { color: C.BORDER, width: 1.2 },
    rectRadius: 0.12
  });
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.45, w: 5.733, h: 0.8,
    fill: { color: "1D4ED8" },
    line: { color: "1D4ED8", width: 1 },
    rectRadius: 0.12
  });
  slide.addText("DEVOPS RESPONSIBILITIES & OPERATIONAL PITFALLS", {
    x: 6.8 + 0.3, y: 1.55, w: 5.133, h: 0.35,
    fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
  });
  slide.addText("Sysadmin Overhead, Security Hardening & Zero Automatic Failover", {
    x: 6.8 + 0.3, y: 1.9, w: 5.133, h: 0.25,
    fontSize: 9, color: "BFDBFE", fontFace: "Segoe UI"
  });

  const doDiffs = [
    { title: "MANUAL LINUX ADMINISTRATION & MAINTENANCE", text: "You own the OS. Responsible for security patching (apt upgrade), UFW firewall configuration, fail2ban setup, and preventing memory leaks." },
    { title: "OUT-OF-MEMORY (OOM) CRASHES ON $4-$6 TIERS", text: "Running heavy npm install or building Next.js on a 1 GB RAM Droplet triggers Linux kernel OOM-killer, freezing the server unless a 2GB swap file is added." },
    { title: "ZERO AUTOMATIC HIGH AVAILABILITY / FAILOVER", text: "Unlike serverless platforms that self-heal across data centers, if your Droplet experiences hardware failure, your app stays down until manually rebooted." },
    { title: "MANUAL DATABASE BACKUP ROUTINES", text: "If hosting PostgreSQL or SQLite locally on the Droplet, engineers must script cron jobs to dump backups to S3/Cloudflare R2." }
  ];

  doDiffs.forEach((d, idx) => {
    const y = 2.4 + idx * 1.05;
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.8 + 0.25, y, w: 5.233, h: 0.95,
      fill: { color: C.DIGITALOCEAN_BG },
      line: { color: C.DIGITALOCEAN_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: d.title + "\n", options: { bold: true, fontSize: 8.5, color: "1D4ED8" } },
      { text: d.text, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
    ], {
      x: 6.8 + 0.4, y: y + 0.08, w: 4.933, h: 0.79,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 17);
}

// =========================================================================
// SLIDE 18: Master Pricing & Free Tier Comparison Matrix
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Master Pricing Economics: Free Tier Quotas & Overage Risks", "Economics & Pricing");

  const tableRows = [
    [
      { text: "Platform", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 9 } },
      { text: "Free Tier Quotas", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 9 } },
      { text: "Free Bandwidth", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 9 } },
      { text: "Commercial in Free?", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 9 } },
      { text: "Starting Paid Plan", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 9 } },
      { text: "Bandwidth Overage Fee", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 9 } },
      { text: "Team Seat Cost", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 9 } }
    ],
    [
      { text: "Vercel", options: { bold: true, color: C.MAIN } },
      { text: "100 GB-hrs compute, 6k build mins" },
      { text: "100 GB / month" },
      { text: "NO (Hobby strictly non-profit)", options: { color: C.RED, bold: true } },
      { text: "$20 / member / month" },
      { text: "$55 per 100 GB (High)", options: { color: C.RED } },
      { text: "$20 / user / mo" }
    ],
    [
      { text: "Cloudflare Pages", options: { bold: true, color: C.CLOUDFLARE } },
      { text: "500 builds/mo, 100k worker req/day" },
      { text: "UNLIMITED FREE", options: { color: C.GREEN, bold: true } },
      { text: "YES (Permitted)", options: { color: C.GREEN, bold: true } },
      { text: "$5 / month (Flat)", options: { color: C.GREEN, bold: true } },
      { text: "$0 (Infinite egress free)", options: { color: C.GREEN, bold: true } },
      { text: "Unlimited seats" }
    ],
    [
      { text: "Netlify", options: { bold: true, color: C.NETLIFY } },
      { text: "300 build mins/mo, 100 forms" },
      { text: "100 GB / month" },
      { text: "YES (With quota limits)" },
      { text: "$19 / member / month" },
      { text: "$55 per 100 GB (High)", options: { color: C.RED } },
      { text: "$19 / user / mo" }
    ],
    [
      { text: "AWS Amplify", options: { bold: true, color: C.AWS } },
      { text: "1,000 build mins (12-Mo Trial only)" },
      { text: "15 GB / month (12-Mo)" },
      { text: "YES" },
      { text: "Pay-as-you-go (~$0.15/GB)" },
      { text: "$0.15 per GB ($15/100GB)" },
      { text: "IAM based (Free)" }
    ],
    [
      { text: "Firebase Hosting", options: { bold: true, color: C.FIREBASE } },
      { text: "10 GB storage (Spark Plan)" },
      { text: "360 MB / day (~10 GB/mo)", options: { color: C.RED } },
      { text: "YES" },
      { text: "Blaze (Pay-as-you-go)" },
      { text: "$0.15 per GB transfer" },
      { text: "GCP IAM (Free)" }
    ],
    [
      { text: "Azure Static Apps", options: { bold: true, color: C.AZURE } },
      { text: "3 custom domains, 0.5 GB app" },
      { text: "100 GB / month" },
      { text: "YES" },
      { text: "$9 / app / month" },
      { text: "$0.20 per GB transfer" },
      { text: "Entra ID roles" }
    ],
    [
      { text: "GitHub Pages", options: { bold: true, color: C.GITHUB } },
      { text: "1 GB site size (Static only)" },
      { text: "100 GB soft limit" },
      { text: "YES (Public repos)" },
      { text: "Free ($4/mo GitHub Pro)" },
      { text: "Throttled (No charges)" },
      { text: "GitHub collab" }
    ],
    [
      { text: "DigitalOcean", options: { bold: true, color: C.DIGITALOCEAN } },
      { text: "3 Static sites free on App Platform" },
      { text: "1 TB to 2 TB on VPS", options: { color: C.GREEN, bold: true } },
      { text: "YES" },
      { text: "$4 - $6 / month (Flat VPS)", options: { color: C.GREEN, bold: true } },
      { text: "$0.01 per GB ($1/100GB)", options: { color: C.GREEN, bold: true } },
      { text: "Team access free" }
    ]
  ];

  slide.addTable(tableRows, {
    x: MX, y: 1.45, w: CW, h: 5.25,
    colW: [1.6, 2.3, 1.8, 1.8, 1.6, 1.5, 1.133],
    fill: { color: C.CARD },
    color: C.MAIN,
    fontSize: 8,
    fontFace: "Segoe UI",
    align: "center",
    valign: "middle",
    border: { type: "solid", pt: 1, color: "E2E8F0" },
    rowH: [0.45, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52]
  });

  addFooter(slide, 18);
}

// =========================================================================
// SLIDE 19: Comprehensive Deployment Failures & Pitfalls Matrix
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Operational Risk Matrix: Common Deployment Failures & Pitfalls", "Failure Modes & Risks");

  const riskRows = [
    [
      { text: "Platform", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 8.5 } },
      { text: "Cold Start Latency", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 8.5 } },
      { text: "Execution Timeout", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 8.5 } },
      { text: "Environment Variable Leaks", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 8.5 } },
      { text: "Bill Shock Risk", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 8.5 } },
      { text: "Primary Failure Mode in Deployments", options: { bold: true, fill: { color: C.NAVY }, color: C.WHITE, fontSize: 8.5 } }
    ],
    [
      { text: "Vercel", options: { bold: true } },
      { text: "Medium (300-1500ms Node)" },
      { text: "10s (Hobby) / 50s (Pro)", options: { color: C.RED, bold: true } },
      { text: "Low (Branch-scoped keys)" },
      { text: "CRITICAL ($55/100GB)", options: { color: C.RED, bold: true } },
      { text: "504 Gateway Timeout on heavy serverless functions / image opt." }
    ],
    [
      { text: "Cloudflare Pages", options: { bold: true, color: C.CLOUDFLARE } },
      { text: "0ms (Instant V8 isolate)", options: { color: C.GREEN, bold: true } },
      { text: "30s CPU runtime limit" },
      { text: "Low (Encrypted bindings)" },
      { text: "ZERO (No egress charges)", options: { color: C.GREEN, bold: true } },
      { text: "Module not found: crypto / buffer due to missing nodejs_compat flag." }
    ],
    [
      { text: "Netlify", options: { bold: true, color: C.NETLIFY } },
      { text: "Medium (500-1800ms Lambda)" },
      { text: "10s default limit", options: { color: C.RED } },
      { text: "Low (Context env vars)" },
      { text: "CRITICAL ($55/100GB)", options: { color: C.RED, bold: true } },
      { text: "Build minute exhaustion (300 mins) freezing team deployments." }
    ],
    [
      { text: "AWS Amplify", options: { bold: true, color: C.AWS } },
      { text: "High (1000-2500ms Lambda)" },
      { text: "Up to 15 mins (Lambda)" },
      { text: "Medium (IAM policy misconfig)" },
      { text: "HIGH (After 12 months)", options: { color: C.AMBER, bold: true } },
      { text: "CloudFormation UPDATE_ROLLBACK_FAILED deadlock stalls builds." }
    ],
    [
      { text: "Firebase Hosting", options: { bold: true, color: C.FIREBASE } },
      { text: "Medium (Cloud Functions)" },
      { text: "60s (Cloud Functions)" },
      { text: "Low (GCP Secret Manager)" },
      { text: "MEDIUM (Blaze pay-go)" },
      { text: "HTTP 509 Bandwidth Exceeded taking website offline mid-day." }
    ],
    [
      { text: "Azure Static Apps", options: { bold: true, color: C.AZURE } },
      { text: "Medium (Azure Functions)" },
      { text: "5 mins (Azure Functions)" },
      { text: "Low (KeyVault / App Settings)" },
      { text: "LOW ($9/mo predictable)" },
      { text: "Deployment token desync breaking GitHub Actions CI/CD workflows." }
    ],
    [
      { text: "GitHub Pages", options: { bold: true, color: C.GITHUB } },
      { text: "None (Pure static edge)" },
      { text: "N/A (No backend compute)" },
      { text: "HIGH (Public repo leak risk)", options: { color: C.RED, bold: true } },
      { text: "ZERO (100% Free)" },
      { text: "SPA 404 error on page refresh when user hits deep URLs." }
    ],
    [
      { text: "DigitalOcean VPS", options: { bold: true, color: C.DIGITALOCEAN } },
      { text: "0ms (Always-on PM2 Node)", options: { color: C.GREEN, bold: true } },
      { text: "Infinite (Persistent process)", options: { color: C.GREEN, bold: true } },
      { text: "Medium (Local .env file)" },
      { text: "ZERO (Flat $4-$6/mo fixed)", options: { color: C.GREEN, bold: true } },
      { text: "Out-of-Memory (OOM) killer crashing Node during npm build." }
    ]
  ];

  slide.addTable(riskRows, {
    x: MX, y: 1.45, w: CW, h: 5.25,
    colW: [1.6, 1.8, 1.6, 1.8, 1.7, 3.233],
    fill: { color: C.CARD },
    color: C.MAIN,
    fontSize: 8,
    fontFace: "Segoe UI",
    align: "center",
    valign: "middle",
    border: { type: "solid", pt: 1, color: "E2E8F0" },
    rowH: [0.45, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52, 0.52]
  });

  addFooter(slide, 19);
}

// =========================================================================
// SLIDE 20: Strategic Decision Framework & Production Recommendation
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Strategic Decision Framework & Production Blueprint for Turfify", "Architecture Blueprint");

  // Top Recommendation Banner
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 1.45, w: CW, h: 1.25,
    fill: { color: C.BLUE_BG },
    line: { color: C.BLUE, width: 2 },
    rectRadius: 0.12
  });
  slide.addText("THE PRODUCTION RECOMMENDATION: HYBRID CLOUD DECOUPLING", {
    x: MX + 0.3, y: 1.55, w: 11.133, h: 0.35,
    fontSize: 12, bold: true, color: C.BLUE, fontFace: "Segoe UI"
  });
  slide.addText("Decouple Static Edge Delivery from Dynamic API/DB Execution. Deploying both to Vercel invites timeout errors, high seat costs, and sudden bandwidth shock. A decoupled architecture achieves 99.99% uptime with near-zero operational costs.", {
    x: MX + 0.3, y: 1.9, w: 11.133, h: 0.65,
    fontSize: 9.5, color: C.NAVY, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
  });

  // 3 Concrete Scenario Cards
  const scenarios = [
    {
      title: "SCENARIO A: ZERO BUDGET / MVP",
      rec: "Cloudflare Pages + Supabase / D1",
      cost: "Total Cost: $0.00 / month forever",
      color: C.CLOUDFLARE,
      bg: C.CLOUDFLARE_BG,
      points: [
        "Frontend: Cloudflare Pages (unlimited bandwidth, 0ms latency, free SSL).",
        "Backend/DB: Cloudflare D1 or Supabase Free Tier (PostgreSQL + Auth).",
        "Verdict: Perfect for startups launching Turfify without credit card lock."
      ]
    },
    {
      title: "SCENARIO B: PRODUCTION FULLSTACK",
      rec: "Cloudflare Pages + DigitalOcean ($4-$6)",
      cost: "Total Cost: $4 - $6 / month flat",
      color: C.DIGITALOCEAN,
      bg: C.DIGITALOCEAN_BG,
      points: [
        "Frontend: Cloudflare Pages handles high traffic, images, and marketing with 0 bill risk.",
        "Backend: DigitalOcean Droplet runs Express API, PM2, persistent booking queues & SQLite/Postgres.",
        "Verdict: Uncapped WebSockets, 1 TB bandwidth, and 100% predictable spending."
      ]
    },
    {
      title: "SCENARIO C: ENTERPRISE NEXT.JS",
      rec: "Vercel Pro OR Azure Static Apps",
      cost: "Total Cost: $20/seat/mo or $9/app/mo",
      color: C.AZURE,
      bg: C.AZURE_BG,
      points: [
        "Vercel Pro: Unmatched Next.js React Server Components & preview review workflows.",
        "Azure Static Apps: Enterprise SOC 2/HIPAA compliance & Entra ID SSO.",
        "Verdict: Pick when corporate compliance and developer velocity outweigh budget limits."
      ]
    }
  ];

  scenarios.forEach((sc, idx) => {
    const x = MX + idx * (3.75 + 0.24);
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.9, w: 3.75, h: 3.85,
      fill: { color: C.CARD },
      line: { color: sc.color, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.9, w: 3.75, h: 0.75,
      fill: { color: sc.color },
      line: { color: sc.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(sc.title, {
      x: x + 0.2, y: 2.95, w: 3.35, h: 0.35,
      fontSize: 10.5, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });
    slide.addText(sc.cost, {
      x: x + 0.2, y: 3.3, w: 3.35, h: 0.25,
      fontSize: 8.5, bold: true, color: "FEF08A", fontFace: "Segoe UI"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.2, y: 3.8, w: 3.35, h: 0.45,
      fill: { color: sc.bg },
      line: { color: sc.color, width: 1 },
      rectRadius: 0.08
    });
    slide.addText(sc.rec, {
      x: x + 0.2, y: 3.8, w: 3.35, h: 0.45,
      fontSize: 9.5, bold: true, color: sc.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    const ptRuns = [];
    sc.points.forEach(pt => {
      ptRuns.push({ text: `• ${pt}\n\n`, options: { bold: false, fontSize: 8.5, color: C.MAIN } });
    });
    slide.addText(ptRuns, {
      x: x + 0.25, y: 4.4, w: 3.25, h: 2.2,
      fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 20);
}

// Generate Presentation
const fileName = "Web_Deployment_Platforms_Masterclass.pptx";
pptx.writeFile({ fileName })
  .then(() => {
    console.log(`Successfully generated ${TOTAL_SLIDES}-slide presentation: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating presentation:", err);
  });
