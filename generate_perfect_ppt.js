import pptxgenjs from "pptxgenjs";

const pptx = new pptxgenjs();
pptx.layout = "LAYOUT_16x9"; // 13.333 x 7.5 inches
pptx.author = "Cloud Architecture Advisory";
pptx.company = "Enterprise Technology Consulting";
pptx.title = "Cloud Database Strategy & Anti-Hacking Security Review";

// --- GLOBAL COLOR PALETTE ---
const C = {
  NAVY_DARK: "0A0F1D",      // Title slide background
  NAVY_CARD: "131D33",      // Dark theme cards
  PAGE_BG: "F8FAFC",        // Light background for slides
  WHITE: "FFFFFF",
  TEXT_MAIN: "0F172A",      // Deep slate for main text
  TEXT_MUTED: "475569",     // Subtitles & descriptions
  BORDER: "E2E8F0",         // Subtle gray border
  CARD_BG: "FFFFFF",        // Clean white card surfaces
  
  // Brand colors
  SUPABASE: "059669",       // Emerald Green
  SUPABASE_BG: "ECFDF5",
  MONGO: "16A34A",          // Forest Green
  MONGO_BG: "F0FDF4",
  AZURE: "0284C7",          // Azure Blue
  AZURE_BG: "F0F9FF",
  AWS: "D97706",            // AWS Amber
  AWS_BG: "FFFBEB",
  
  // Accents
  RED: "DC2626",
  RED_BG: "FEF2F2",
  RED_BORDER: "FECACA",
  BLUE: "2563EB",
  BLUE_BG: "EFF6FF",
  BLUE_BORDER: "BFDBFE"
};

const TOTAL_SLIDES = 10;

// Universal Slide Header
function createHeader(slide, title, category) {
  // Top thin accent bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.333, h: 0.08,
    fill: { color: C.BLUE }
  });

  // Category Tag Pill
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.35, w: 2.5, h: 0.3,
    fill: { color: C.BLUE_BG },
    line: { color: C.BLUE_BORDER, width: 1 },
    rectRadius: 0.08
  });
  slide.addText(category.toUpperCase(), {
    x: 0.8, y: 0.35, w: 2.5, h: 0.3,
    fontSize: 9, bold: true, color: "1D4ED8",
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Slide Title (Clean single text block, fixed height)
  slide.addText(title, {
    x: 0.8, y: 0.72, w: 11.733, h: 0.55,
    fontSize: 21, bold: true, color: C.NAVY_DARK,
    fontFace: "Segoe UI", valign: "middle"
  });
}

// Universal Slide Footer
function createFooter(slide, current) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 6.95, w: 11.733, h: 0.02,
    fill: { color: "E2E8F0" }
  });
  slide.addText("CONFIDENTIAL & PROPRIETARY | Enterprise Cloud Database Architecture & Security", {
    x: 0.8, y: 7.02, w: 9.0, h: 0.3,
    fontSize: 8.5, color: "94A3B8", fontFace: "Segoe UI", valign: "middle"
  });
  slide.addText(`Slide ${current} of ${TOTAL_SLIDES}`, {
    x: 10.533, y: 7.02, w: 2.0, h: 0.3,
    fontSize: 8.5, color: "94A3B8", align: "right", fontFace: "Segoe UI", valign: "middle"
  });
}

// =========================================================================
// SLIDE 1: Title Slide (Executive Dark Navy)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.NAVY_DARK };

  // Inner Frame
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.8, w: 11.733, h: 5.9,
    fill: { color: C.NAVY_CARD },
    line: { color: "334155", width: 1.5 },
    rectRadius: 0.15
  });

  // Badge
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.2, y: 1.2, w: 3.4, h: 0.35,
    fill: { color: "1E3A8A" },
    line: { color: "3B82F6", width: 1 },
    rectRadius: 0.08
  });
  slide.addText("EXECUTIVE STRATEGY & SECURITY REVIEW", {
    x: 1.2, y: 1.2, w: 3.4, h: 0.35,
    fontSize: 9.5, bold: true, color: "93C5FD",
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Main Heading
  slide.addText("Cloud Database Evaluation:\nArchitecture, Security & Pricing", {
    x: 1.2, y: 1.7, w: 10.9, h: 1.4,
    fontSize: 32, bold: true, color: C.WHITE, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  // Subtitle
  slide.addText("A Comparative Assessment of Supabase, MongoDB Atlas, Microsoft Azure & AWS for Client Decision Makers", {
    x: 1.2, y: 3.25, w: 10.9, h: 0.5,
    fontSize: 13, color: "94A3B8", fontFace: "Segoe UI"
  });

  // 4 Bottom Cards
  const pCards = [
    { name: "Supabase", tag: "PostgreSQL BaaS", color: "3ECF8E", sub: "Built-in Auth, Storage & RLS", x: 1.2 },
    { name: "MongoDB Atlas", tag: "Document NoSQL", color: "00ED64", sub: "Flexible JSON & Multi-Cloud", x: 4.0 },
    { name: "Microsoft Azure", tag: "Enterprise SQL", color: "38BDF8", sub: "Active Directory & Power BI", x: 6.8 },
    { name: "Amazon AWS", tag: "Cloud Infrastructure", color: "FBBF24", sub: "Isolated VPC & DynamoDB", x: 9.6 }
  ];

  pCards.forEach(p => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: 4.1, w: 2.533, h: 1.5,
      fill: { color: "0A1020" },
      line: { color: p.color, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addText(p.name, {
      x: p.x, y: 4.25, w: 2.533, h: 0.35,
      fontSize: 14, bold: true, color: C.WHITE, align: "center", fontFace: "Segoe UI"
    });
    slide.addText(p.tag, {
      x: p.x, y: 4.6, w: 2.533, h: 0.28,
      fontSize: 10, bold: true, color: p.color, align: "center", fontFace: "Segoe UI"
    });
    slide.addText(p.sub, {
      x: p.x + 0.15, y: 4.95, w: 2.233, h: 0.5,
      fontSize: 8.5, color: "94A3B8", align: "center", fontFace: "Segoe UI"
    });
  });

  slide.addText("2026 Strategic Advisory Edition | Ready for Client Presentation", {
    x: 1.2, y: 6.1, w: 10.9, h: 0.3,
    fontSize: 9.5, color: "64748B", align: "center", fontFace: "Segoe UI"
  });
}

// =========================================================================
// SLIDE 2: Platform Overview (4 Clean Equal Columns)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE_BG };
  createHeader(slide, "Understanding the 4 Database Platforms at a Glance", "Platform Overview");

  const cards = [
    {
      name: "1. Supabase",
      role: "The All-in-One Rocket",
      color: C.SUPABASE,
      x: 0.8,
      items: [
        { label: "TECHNOLOGY", val: "100% Real PostgreSQL engine" },
        { label: "BUILT-IN TOOLS", val: "User Logins, Storage & instant APIs" },
        { label: "TIME SAVINGS", val: "Cuts backend build time by 40%" },
        { label: "LOCK-IN RISK", val: "Zero; standard SQL export anytime" }
      ]
    },
    {
      name: "2. MongoDB Atlas",
      role: "The Flexible Filing Cabinet",
      color: C.MONGO,
      x: 3.8,
      items: [
        { label: "TECHNOLOGY", val: "Document NoSQL (flexible JSON)" },
        { label: "BUILT-IN TOOLS", val: "Full-text search & 3-node cluster" },
        { label: "DATA AGILITY", val: "Change product attributes easily" },
        { label: "DEPLOYMENT", val: "Runs on AWS, Azure, and Google" }
      ]
    },
    {
      name: "3. Microsoft Azure",
      role: "The Corporate Suite",
      color: C.AZURE,
      x: 6.8,
      items: [
        { label: "TECHNOLOGY", val: "Azure SQL & PostgreSQL Flexible" },
        { label: "BUILT-IN TOOLS", val: "Power BI, Excel & Office 365 sync" },
        { label: "ENTRY COST", val: "Cheapest entry tier ($5/mo Basic)" },
        { label: "COMPLIANCE", val: "Active Directory single sign-on" }
      ]
    },
    {
      name: "4. Amazon AWS",
      role: "The Industrial Powerhouse",
      color: C.AWS,
      x: 9.8,
      items: [
        { label: "TECHNOLOGY", val: "Amazon RDS & DynamoDB (NoSQL)" },
        { label: "BUILT-IN TOOLS", val: "Multi-Zone auto failover & VPC" },
        { label: "FREE CAPACITY", val: "DynamoDB: 25 GB free forever" },
        { label: "SCALE LIMIT", val: "Handles millions of transactions/sec" }
      ]
    }
  ];

  cards.forEach(c => {
    // Card Container
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 2.733, h: 5.3,
      fill: { color: C.CARD_BG },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.12
    });

    // Top Header
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 2.733, h: 0.85,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.name, {
      x: c.x + 0.15, y: 1.55, w: 2.433, h: 0.35,
      fontSize: 13, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });
    slide.addText(c.role, {
      x: c.x + 0.15, y: 1.9, w: 2.433, h: 0.28,
      fontSize: 9.5, color: "E2E8F0", fontFace: "Segoe UI"
    });

    // 4 Content Blocks
    c.items.forEach((item, idx) => {
      const boxY = 2.45 + (idx * 1.02);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: c.x + 0.15, y: boxY, w: 2.433, h: 0.9,
        fill: { color: C.PAGE_BG },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: item.label + "\n", options: { bold: true, fontSize: 8, color: c.color } },
        { text: item.val, options: { bold: false, fontSize: 8.5, color: C.TEXT_MAIN } }
      ], {
        x: c.x + 0.25, y: boxY + 0.08, w: 2.233, h: 0.74,
        fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.15
      });
    });
  });

  createFooter(slide, 2);
}

// =========================================================================
// SLIDE 3: Visual Architecture Flow (Non-Coding Flowcharts)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE_BG };
  createHeader(slide, "Visual Architecture: How Client Apps Connect to Each Database", "Architecture Flow");

  const flows = [
    {
      title: "1. SUPABASE ARCHITECTURE (Direct & All-in-One Engine)",
      color: C.SUPABASE,
      step1T: "Web / Mobile App", step1S: "Client Interface",
      step2T: "Kong API Gateway", step2S: "Auth + Storage + REST API",
      step3T: "PostgreSQL Engine", step3S: "Row-Level Security (RLS)",
      benefit: "CORE BENEFIT: No separate backend servers needed. Client communicates directly with secured API.",
      y: 1.45
    },
    {
      title: "2. MONGODB ATLAS ARCHITECTURE (Multi-Cloud Auto-Replication)",
      color: C.MONGO,
      step1T: "Web / Mobile App", step1S: "Client Interface",
      step2T: "App Server API", step2S: "Node.js / Python / Java",
      step3T: "3-Node Replica Set", step3S: "Data auto-copied across 3 nodes",
      benefit: "CORE BENEFIT: 100% High Availability. If one physical server crashes, another takes over in 2 seconds.",
      y: 2.82
    },
    {
      title: "3. MICROSOFT AZURE ARCHITECTURE (Corporate Protected Network)",
      color: C.AZURE,
      step1T: "Enterprise Client", step1S: "Web / Office 365",
      step2T: "Azure Entra ID", step2S: "Firewall + Active Directory MFA",
      step3T: "Azure SQL Database", step3S: "Direct sync with Power BI & Excel",
      benefit: "CORE BENEFIT: Tied directly into corporate employee single sign-on logins and automated executive reporting.",
      y: 4.19
    },
    {
      title: "4. AMAZON AWS ARCHITECTURE (Enterprise Fortress & Extreme Scale)",
      color: C.AWS,
      step1T: "High-Traffic App", step1S: "Millions of Visitors",
      step2T: "VPC Gateway & IAM", step2S: "Private Subnet + Security Groups",
      step3T: "Amazon RDS / Dynamo", step3S: "SSD High IOPS Storage Cluster",
      benefit: "CORE BENEFIT: Maximum isolated network security. The database has no public IP and is invisible to the internet.",
      y: 5.56
    }
  ];

  flows.forEach(f => {
    // Flow row container
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: f.y, w: 11.733, h: 1.22,
      fill: { color: C.CARD_BG },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.1
    });

    // Left indicator bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0.8, y: f.y, w: 0.15, h: 1.22,
      fill: { color: f.color }
    });

    // Flow title
    slide.addText(f.title, {
      x: 1.1, y: f.y + 0.08, w: 10.5, h: 0.26,
      fontSize: 10.5, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    // Box 1
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: f.y + 0.38, w: 2.5, h: 0.5,
      fill: { color: C.BLUE_BG },
      line: { color: C.BLUE_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: f.step1T + "\n", options: { bold: true, fontSize: 9.5, color: "1E40AF" } },
      { text: f.step1S, options: { bold: false, fontSize: 8, color: "3B82F6" } }
    ], {
      x: 1.1, y: f.y + 0.4, w: 2.5, h: 0.46,
      align: "center", valign: "middle", fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });

    // Arrow 1
    slide.addText("➔", {
      x: 3.65, y: f.y + 0.38, w: 0.45, h: 0.5,
      fontSize: 16, bold: true, color: "94A3B8", align: "center", valign: "middle"
    });

    // Box 2
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 4.15, y: f.y + 0.38, w: 3.8, h: 0.5,
      fill: { color: C.PAGE_BG },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: f.step2T + "\n", options: { bold: true, fontSize: 9.5, color: C.TEXT_MAIN } },
      { text: f.step2S, options: { bold: false, fontSize: 8, color: C.TEXT_MUTED } }
    ], {
      x: 4.15, y: f.y + 0.4, w: 3.8, h: 0.46,
      align: "center", valign: "middle", fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });

    // Arrow 2
    slide.addText("➔", {
      x: 8.0, y: f.y + 0.38, w: 0.45, h: 0.5,
      fontSize: 16, bold: true, color: "94A3B8", align: "center", valign: "middle"
    });

    // Box 3
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 8.5, y: f.y + 0.38, w: 3.85, h: 0.5,
      fill: { color: "FEF3C7" },
      line: { color: "FCD34D", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: f.step3T + "\n", options: { bold: true, fontSize: 9.5, color: "92400E" } },
      { text: f.step3S, options: { bold: false, fontSize: 8, color: "B45309" } }
    ], {
      x: 8.5, y: f.y + 0.4, w: 3.85, h: 0.46,
      align: "center", valign: "middle", fontFace: "Segoe UI", lineSpacingMultiple: 1.1
    });

    // Bottom Benefit
    slide.addText(f.benefit, {
      x: 1.1, y: f.y + 0.94, w: 11.2, h: 0.22,
      fontSize: 8.5, bold: true, color: C.TEXT_MUTED, fontFace: "Segoe UI"
    });
  });

  createFooter(slide, 3);
}

// =========================================================================
// SLIDE 4: Security in the Hacker's Eye (Threat Landscape)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE_BG };
  createHeader(slide, "Data Security in the Hacker's Eye: How Cyberattacks Happen", "Cybersecurity Assessment");

  const threats = [
    {
      title: "1. SQL Injection & Data Tampering",
      how: "Attackers inject malicious query commands into input boxes or APIs to dump or delete full database tables.",
      danger: "DANGER LEVEL: CRITICAL | Exfiltration of user passwords, database drop, and massive compliance fines.",
      x: 0.8, y: 1.45
    },
    {
      title: "2. Port Scanning & Public Exposure",
      how: "Automated scanner bots probe public IPs on ports 5432 (Postgres), 3306 (MySQL), and 27017 (Mongo).",
      danger: "DANGER LEVEL: CRITICAL | Ransomware attackers lock unsecured servers with weak passwords in minutes.",
      x: 6.8, y: 1.45
    },
    {
      title: "3. Broken Authorization & Leaked Keys",
      how: "Hackers reverse-engineer mobile or web frontend JavaScript to extract hardcoded database API secrets.",
      danger: "DANGER LEVEL: HIGH | Rogue actors bypass the application UI and read sensitive customer data directly.",
      x: 0.8, y: 4.15
    },
    {
      title: "4. Network Man-in-the-Middle (Eavesdropping)",
      how: "Unencrypted network packets traveling between apps and cloud databases are intercepted on public WiFi.",
      danger: "DANGER LEVEL: HIGH | Passwords, credit cards, and confidential PII are stolen in transit.",
      x: 6.8, y: 4.15
    }
  ];

  threats.forEach(t => {
    // Outer Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x, y: t.y, w: 5.733, h: 2.55,
      fill: { color: C.CARD_BG },
      line: { color: C.RED_BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    // Red Header
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x, y: t.y, w: 5.733, h: 0.42,
      fill: { color: C.RED },
      line: { color: C.RED, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(t.title, {
      x: t.x + 0.2, y: t.y + 0.06, w: 5.333, h: 0.3,
      fontSize: 11, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });

    // Content Box (Attack Mechanism)
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x + 0.2, y: t.y + 0.55, w: 5.333, h: 1.1,
      fill: { color: C.PAGE_BG },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: "HOW HACKERS ATTACK:\n", options: { bold: true, fontSize: 8.5, color: C.RED } },
      { text: t.how, options: { bold: false, fontSize: 9, color: C.TEXT_MAIN } }
    ], {
      x: t.x + 0.3, y: t.y + 0.62, w: 5.133, h: 0.95,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.15
    });

    // Danger Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x + 0.2, y: t.y + 1.75, w: 5.333, h: 0.65,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText(t.danger, {
      x: t.x + 0.3, y: t.y + 1.78, w: 5.133, h: 0.58,
      fontSize: 8.5, bold: true, color: "991B1B", fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  createFooter(slide, 4);
}

// =========================================================================
// SLIDE 5: How Each Database Defends Against Hackers
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE_BG };
  createHeader(slide, "Anti-Hacking Defenses: How Each Platform Secures Client Data", "Cyber Defense");

  const defenses = [
    {
      name: "1. SUPABASE DEFENSE STACK",
      color: C.SUPABASE,
      x: 0.8, y: 1.45,
      features: [
        { title: "Row-Level Security (RLS)", desc: "Database engine prevents User A from querying User B's rows, even if API is breached." },
        { title: "JWT Token Signatures", desc: "Every database query requires a cryptographically signed JSON Web Token; no anonymous leaks." },
        { title: "Zero Direct Port Exposure", desc: "Raw port 5432 is shielded; all traffic routes through encrypted Kong HTTPS Gateway." },
        { title: "AES-256 Storage Encryption", desc: "Database files, WAL logs, and file storage buckets are encrypted at rest with AES-256." }
      ]
    },
    {
      name: "2. MONGODB ATLAS DEFENSE STACK",
      color: C.MONGO,
      x: 6.8, y: 1.45,
      features: [
        { title: "Client-Side Field Encryption (CSFLE)", desc: "PII and credit cards encrypted in app memory before network transit; admins cannot view plaintext." },
        { title: "Default IP Whitelisting", desc: "Cluster blocks 100% of external connection requests unless IP address is explicitly whitelisted." },
        { title: "Enforced TLS 1.3 Encryption", desc: "All connections must use modern TLS 1.3 ciphers; unencrypted connections dropped instantly." },
        { title: "Role-Based Access Control (RBAC)", desc: "Strict user permissions ensuring applications only access their authorized collections." }
      ]
    },
    {
      name: "3. MICROSOFT AZURE DEFENSE STACK",
      color: C.AZURE,
      x: 0.8, y: 4.15,
      features: [
        { title: "Defender for Cloud AI", desc: "Real-time AI behavioral monitoring flags anomalous login locations, query dumps, and SQL injections." },
        { title: "Entra ID (Active Directory)", desc: "Eliminates hardcoded DB passwords using company single-sign-on and Multi-Factor Auth (MFA)." },
        { title: "Always Encrypted Tech", desc: "Protects sensitive data at rest, in transit, and even inside server memory chips from virtualization hacks." },
        { title: "Azure Private Link", desc: "Keeps all database traffic exclusively inside Microsoft's private global fiber network." }
      ]
    },
    {
      name: "4. AMAZON AWS DEFENSE STACK",
      color: C.AWS,
      x: 6.8, y: 4.15,
      features: [
        { title: "VPC Subnet Isolation", desc: "Database has NO public IP address; sits in a private subnet reachable ONLY by verified app servers." },
        { title: "IAM Database Authentication", desc: "Short-lived temporary access tokens replace static passwords, completely eliminating password theft." },
        { title: "AWS KMS Hardware Modules", desc: "FIPS 140-2 Level 3 hardware security modules manage rotating encryption keys automatically." },
        { title: "GuardDuty & CloudTrail", desc: "Logs every single administrative access attempt and triggers automated lockdown on brute-force." }
      ]
    }
  ];

  defenses.forEach(d => {
    // Outer Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: d.x, y: d.y, w: 5.733, h: 2.55,
      fill: { color: C.CARD_BG },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.12
    });

    // Card Header
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: d.x, y: d.y, w: 5.733, h: 0.4,
      fill: { color: d.color },
      line: { color: d.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(d.name, {
      x: d.x + 0.2, y: d.y + 0.05, w: 5.333, h: 0.3,
      fontSize: 10.5, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });

    // 4 Features inside single text block (Guarantees zero overlap)
    const textRuns = [];
    d.features.forEach((feat, idx) => {
      textRuns.push({ text: `✔  ${feat.title}: `, options: { bold: true, fontSize: 8.5, color: C.TEXT_MAIN } });
      textRuns.push({ text: feat.desc + (idx < 3 ? "\n" : ""), options: { bold: false, fontSize: 8, color: C.TEXT_MUTED } });
    });

    slide.addText(textRuns, {
      x: d.x + 0.2, y: d.y + 0.48, w: 5.333, h: 1.95,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.18
    });
  });

  createFooter(slide, 5);
}

// =========================================================================
// SLIDE 6: Master Security Checklist: What We Implement for Clients
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE_BG };
  createHeader(slide, "Anti-Hacking Checklist: Mandatory Security Controls We Implement", "Security Implementation");

  const cols = [
    {
      title: "1. NETWORK LEVEL DEFENSE",
      color: "1D4ED8",
      x: 0.8,
      items: [
        { label: "Strict IP Whitelisting", desc: "Block 100% of public internet; permit only client app server IP addresses." },
        { label: "Enforced TLS 1.3 / SSL", desc: "Mandate encrypted transit with modern ciphers; reject unencrypted connections." },
        { label: "Private VPC Peering", desc: "Route database traffic through dedicated private subnets with zero external exposure." }
      ]
    },
    {
      title: "2. DATA & QUERY LEVEL DEFENSE",
      color: "059669",
      x: 4.8,
      items: [
        { label: "Row-Level Security (RLS)", desc: "Enforce strict tenant data separation directly inside the database engine." },
        { label: "Parameterized Queries", desc: "Zero dynamic SQL concatenation; completely eliminate SQL injection vulnerability." },
        { label: "AES-256 Storage Encryption", desc: "Automate hardware-accelerated encryption for data at rest and all backups." }
      ]
    },
    {
      title: "3. ACCESS & IDENTITY DEFENSE",
      color: "D97706",
      x: 8.8,
      items: [
        { label: "Least Privilege Principle", desc: "Apps use restricted accounts; master passwords are never stored in source code." },
        { label: "Multi-Factor Auth (MFA)", desc: "Mandatory hardware key / authenticator MFA for all engineers accessing consoles." },
        { label: "Automated Daily Backups", desc: "Encrypted point-in-time recovery copies stored across separate geographic zones." }
      ]
    }
  ];

  cols.forEach(c => {
    // Column Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 3.733, h: 4.6,
      fill: { color: C.CARD_BG },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    // Column Header
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 3.733, h: 0.5,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.title, {
      x: c.x, y: 1.45, w: 3.733, h: 0.5,
      fontSize: 10, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    // 3 Items in Column
    c.items.forEach((item, idx) => {
      const itemY = 2.15 + (idx * 1.25);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: c.x + 0.2, y: itemY, w: 3.333, h: 1.1,
        fill: { color: C.PAGE_BG },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: "✔  " + item.label + "\n", options: { bold: true, fontSize: 9.5, color: C.TEXT_MAIN } },
        { text: item.desc, options: { bold: false, fontSize: 8.5, color: C.TEXT_MUTED } }
      ], {
        x: c.x + 0.35, y: itemY + 0.1, w: 3.033, h: 0.9,
        fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.18
      });
    });
  });

  // Guarantee Banner
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 6.2, w: 11.733, h: 0.55,
    fill: { color: C.BLUE_BG },
    line: { color: C.BLUE_BORDER, width: 1 },
    rectRadius: 0.08
  });
  slide.addText("CLIENT SECURITY GUARANTEE: With these 9 controls configured, database assets fully satisfy SOC 2, HIPAA, and GDPR standards.", {
    x: 0.8, y: 6.2, w: 11.733, h: 0.55,
    fontSize: 9.5, bold: true, color: "1E40AF", align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  createFooter(slide, 6);
}

// =========================================================================
// SLIDE 7: Side-by-Side Pricing, Storage & User Limits Table
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE_BG };
  createHeader(slide, "Side-by-Side Pricing, Storage & Active User Limits", "Cost & Capacity");

  const tableData = [
    [
      { text: "Platform", options: { bold: true, fill: "0F172A", color: C.WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Free Tier Quota", options: { bold: true, fill: "0F172A", color: C.WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Active Users (Free)", options: { bold: true, fill: "0F172A", color: C.WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Entry Paid Price", options: { bold: true, fill: "0F172A", color: C.WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Storage in Paid Plan", options: { bold: true, fill: "0F172A", color: C.WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Production / Scale Cost", options: { bold: true, fill: "0F172A", color: C.WHITE, fontSize: 9.5, fontFace: "Segoe UI" } }
    ],
    [
      { text: "Supabase", options: { bold: true, color: C.SUPABASE, fontFace: "Segoe UI" } },
      { text: "500 MB (Free Forever)\nNo credit card required", options: { fontFace: "Segoe UI" } },
      { text: "Up to 50,000 MAU\n(5 GB transfer included)", options: { fontFace: "Segoe UI" } },
      { text: "$25 / month\n(Pro Flat Plan)", options: { bold: true, fontFace: "Segoe UI" } },
      { text: "8 GB included\n(+$0.125/GB auto-expand)", options: { fontFace: "Segoe UI" } },
      { text: "$599 / mo (Team Tier)\n100k+ MAU, SOC2, SLA", options: { fontFace: "Segoe UI" } }
    ],
    [
      { text: "MongoDB Atlas", options: { bold: true, color: C.MONGO, fontFace: "Segoe UI" } },
      { text: "512 MB (M0 Sandbox)\nFree Forever", options: { fontFace: "Segoe UI" } },
      { text: "~15,000 MAU\n(500 connections)", options: { fontFace: "Segoe UI" } },
      { text: "$9 – $25 / month\n(M2 / M5 Shared)", options: { bold: true, fontFace: "Segoe UI" } },
      { text: "2 GB – 5 GB SSD\nAuto daily snapshots", options: { fontFace: "Segoe UI" } },
      { text: "$57 – $400+ / mo (Dedicated)\nUp to 4 TB NVMe SSD", options: { fontFace: "Segoe UI" } }
    ],
    [
      { text: "Microsoft Azure", options: { bold: true, color: C.AZURE, fontFace: "Segoe UI" } },
      { text: "32 GB Free (12 Months)\n100k vCore-sec free/mo", options: { fontFace: "Segoe UI" } },
      { text: "~25,000 MAU\n(Serverless autosuspend)", options: { fontFace: "Segoe UI" } },
      { text: "$4.99 / month\n(Basic Tier - 5 DTU)", options: { bold: true, fontFace: "Segoe UI" } },
      { text: "2 GB max (Basic)\n250 GB in Standard ($15/mo)", options: { fontFace: "Segoe UI" } },
      { text: "$75 – $250+ / mo (Standard/vCore)\nUp to 100 TB on Hyperscale", options: { fontFace: "Segoe UI" } }
    ],
    [
      { text: "Amazon AWS (RDS)", options: { bold: true, color: C.AWS, fontFace: "Segoe UI" } },
      { text: "20 GB Free (12 Mos)\n750 hrs db.t4g.micro", options: { fontFace: "Segoe UI" } },
      { text: "~20,000 MAU\n(~80 max connections)", options: { fontFace: "Segoe UI" } },
      { text: "$15 – $35 / month\n(db.t4g.small instance)", options: { bold: true, fontFace: "Segoe UI" } },
      { text: "20 GB – 100 GB SSD\n(+$0.115/GB storage)", options: { fontFace: "Segoe UI" } },
      { text: "$150 – $350+ / mo (Multi-AZ)\nHigh-availability dual server", options: { fontFace: "Segoe UI" } }
    ],
    [
      { text: "AWS DynamoDB", options: { bold: true, color: "B45309", fontFace: "Segoe UI" } },
      { text: "25 GB Free Forever\n200M requests/mo free", options: { fontFace: "Segoe UI" } },
      { text: "100,000+ MAU\n(Extreme throughput)", options: { fontFace: "Segoe UI" } },
      { text: "$0 – $5 / month\n(On-Demand Pay-per-use)", options: { bold: true, fontFace: "Segoe UI" } },
      { text: "25 GB included free\n(+$0.25/GB extra)", options: { fontFace: "Segoe UI" } },
      { text: "Pay-as-you-scale\n$1.25 per million writes", options: { fontFace: "Segoe UI" } }
    ]
  ];

  slide.addTable(tableData, {
    x: 0.8, y: 1.45, w: 11.733, h: 5.2,
    colW: [1.8, 2.1, 2.0, 1.8, 2.0, 2.033],
    fontSize: 9,
    valign: "middle",
    border: { pt: 1, color: "CBD5E1" },
    fill: { color: C.WHITE },
    rowH: [0.45, 0.92, 0.92, 0.92, 0.92, 0.95]
  });

  createFooter(slide, 7);
}

// =========================================================================
// SLIDE 8: Advantages & Disadvantages Matrix
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE_BG };
  createHeader(slide, "Advantages & Disadvantages of Each Platform", "Trade-Off Analysis");

  const cards = [
    {
      name: "1. Supabase",
      color: C.SUPABASE,
      pros: ["Zero setup; live in 2 mins", "Auth & File Storage included", "No credit card needed to start", "Real open-source Postgres"],
      cons: ["Free tier pauses after 7 days idle", "High data transfer incurs fees", "Less mature than 15-yr clouds"],
      x: 0.8, y: 1.45
    },
    {
      name: "2. MongoDB Atlas",
      color: C.MONGO,
      pros: ["Zero schema rigidity (JSON)", "Built-in full-text search", "Auto 3-node disaster backup", "Works across AWS, Azure, GCP"],
      cons: ["Dedicated servers start at $57/mo", "Inefficient for deep SQL JOINs", "High RAM consumption if unindexed"],
      x: 6.8, y: 1.45
    },
    {
      name: "3. Microsoft Azure",
      color: C.AZURE,
      pros: ["Cheapest entry plan ($5/mo Basic)", "Native Power BI & Office sync", "Active Directory enterprise auth", "Serverless pauses off-hours"],
      cons: ["Basic plan capped at 2 GB", "Complex portal navigation", "Steep price jump on high vCores"],
      x: 0.8, y: 4.15
    },
    {
      name: "4. Amazon AWS",
      color: C.AWS,
      pros: ["DynamoDB 25 GB free forever", "99.999% proven global uptime", "Infinite compute scalability", "VPC enterprise data fortress"],
      cons: ["Requires DevOps/Cloud engineers", "Risk of surprise bills (egress/IOPS)", "No built-in Auth or UI dashboard"],
      x: 6.8, y: 4.15
    }
  ];

  cards.forEach(c => {
    // Card Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: c.y, w: 5.733, h: 2.55,
      fill: { color: C.CARD_BG },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.12
    });

    // Card Header Bar
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: c.y, w: 5.733, h: 0.42,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.name, {
      x: c.x + 0.2, y: c.y + 0.06, w: 5.333, h: 0.3,
      fontSize: 11.5, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });

    // Left Pros
    const proRuns = [{ text: "✔  ADVANTAGES\n", options: { bold: true, fontSize: 9, color: "16A34A" } }];
    c.pros.forEach((p, idx) => {
      proRuns.push({ text: `• ${p}${idx < c.pros.length - 1 ? "\n" : ""}`, options: { bold: false, fontSize: 8.5, color: C.TEXT_MAIN } });
    });
    slide.addText(proRuns, {
      x: c.x + 0.2, y: c.y + 0.5, w: 2.6, h: 1.9,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.18
    });

    // Vertical Divider
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: c.x + 2.85, y: c.y + 0.55, w: 0.02, h: 1.8,
      fill: { color: "CBD5E1" }
    });

    // Right Cons
    const conRuns = [{ text: "✖  DISADVANTAGES\n", options: { bold: true, fontSize: 9, color: C.RED } }];
    c.cons.forEach((con, idx) => {
      conRuns.push({ text: `• ${con}${idx < c.cons.length - 1 ? "\n" : ""}`, options: { bold: false, fontSize: 8.5, color: C.TEXT_MUTED } });
    });
    slide.addText(conRuns, {
      x: c.x + 3.05, y: c.y + 0.5, w: 2.5, h: 1.9,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.18
    });
  });

  createFooter(slide, 8);
}

// =========================================================================
// SLIDE 9: Strategic Recommendations for Clients (What to Suggest & Why)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE_BG };
  createHeader(slide, "Strategic Recommendations for Clients (What to Suggest & Why)", "Client Advisory");

  const recommendations = [
    {
      scenario: "Web / Mobile Startup or MVP",
      pick: "SUPABASE",
      color: C.SUPABASE,
      bg: C.SUPABASE_BG,
      why: [
        "Cuts development time by 40%: User Auth, File Storage, and APIs are built-in.",
        "Costs $0 to build and test; smooth step to flat $25/mo when traffic grows.",
        "Standard PostgreSQL protects client from vendor lock-in."
      ],
      y: 1.45
    },
    {
      scenario: "E-Commerce, Store Catalogs & Media",
      pick: "MONGODB ATLAS",
      color: C.MONGO,
      bg: C.MONGO_BG,
      why: [
        "Product catalogs have changing attributes; JSON documents never require table restructuring.",
        "Built-in search engine eliminates need for costly external Elasticsearch.",
        "Automated 3-server replication ensures store checkout never goes offline."
      ],
      y: 2.82
    },
    {
      scenario: "Enterprise Corporate & .NET Stack",
      pick: "MICROSOFT AZURE",
      color: C.AZURE,
      bg: C.AZURE_BG,
      why: [
        "Direct connection to Microsoft Active Directory, C# .NET, and Power BI reports.",
        "Cheapest entry plan in the cloud ($4.99/mo Basic tier) for small business tools.",
        "Full corporate compliance (HIPAA, SOC 2, ISO) out of the box."
      ],
      y: 4.19
    },
    {
      scenario: "High-Scale Microservices & Heavy IoT",
      pick: "AMAZON AWS",
      color: C.AWS,
      bg: C.AWS_BG,
      why: [
        "Handles millions of simultaneous transactions with single-digit millisecond latency.",
        "DynamoDB provides 25 GB free forever with zero server maintenance.",
        "Global data center network with military-grade isolated VPC security."
      ],
      y: 5.56
    }
  ];

  recommendations.forEach(r => {
    // Row box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: r.y, w: 11.733, h: 1.22,
      fill: { color: r.bg },
      line: { color: r.color, width: 1.2 },
      rectRadius: 0.1
    });

    // Left Scenario Column
    slide.addText(r.scenario, {
      x: 1.05, y: r.y + 0.12, w: 3.2, h: 0.35,
      fontSize: 11, bold: true, color: C.NAVY_DARK, fontFace: "Segoe UI"
    });

    // Pick Pill
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.05, y: r.y + 0.52, w: 2.6, h: 0.45,
      fill: { color: r.color },
      line: { color: r.color, width: 1 },
      rectRadius: 0.08
    });
    slide.addText(`👉 SUGGEST: ${r.pick}`, {
      x: 1.05, y: r.y + 0.52, w: 2.6, h: 0.45,
      fontSize: 10, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    // Right Justification Bullets (Single Text Block)
    const whyRuns = [];
    r.why.forEach((w, idx) => {
      whyRuns.push({ text: `•  ${w}${idx < r.why.length - 1 ? "\n" : ""}`, options: { bold: false, fontSize: 8.8, color: C.TEXT_MAIN } });
    });

    slide.addText(whyRuns, {
      x: 3.9, y: r.y + 0.1, w: 8.4, h: 1.0,
      fontFace: "Segoe UI", valign: "middle", lineSpacingMultiple: 1.2
    });
  });

  createFooter(slide, 9);
}

// =========================================================================
// SLIDE 10: Executive Summary & 60-Second Client Pitch
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE_BG };
  createHeader(slide, "Executive Summary: The 60-Second Client Pitch", "Executive Pitch");

  // Callout Banner
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.45, w: 11.733, h: 1.5,
    fill: { color: C.BLUE_BG },
    line: { color: C.BLUE, width: 2 },
    rectRadius: 0.12
  });

  slide.addText([
    { text: "THE WINNING RECOMMENDATION FOR 80% OF NEW CLIENT PROJECTS:\n", options: { bold: true, fontSize: 10.5, color: "1D4ED8" } },
    { text: "\"Start with SUPABASE: It delivers the fastest time-to-market, costs $0 to build, and offers a predictable flat $25/month price with zero vendor lock-in.\"", options: { bold: true, fontSize: 13.5, color: C.NAVY_DARK, italic: true } }
  ], {
    x: 1.1, y: 1.6, w: 11.133, h: 1.2,
    fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.2
  });

  // 3 Pillar Highlights
  const pillars = [
    {
      title: "1. Massive Cost Savings",
      color: C.SUPABASE,
      desc: "Free Tier provides 50,000 active users and 500 MB storage at $0. Moving to production is only $25/mo without surprise usage spikes.",
      x: 0.8
    },
    {
      title: "2. Fast Delivery Velocity",
      color: C.BLUE,
      desc: "Authentication, storage buckets, and instant REST APIs come pre-built. Clients save 3 to 6 weeks of custom backend engineering.",
      x: 4.8
    },
    {
      title: "3. 100% Future-Proof",
      color: C.AWS,
      desc: "Powered by pure standard PostgreSQL. If the client expands into an enterprise later, their data moves to AWS or Azure with 1 click.",
      x: 8.8
    }
  ];

  pillars.forEach(p => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: 3.2, w: 3.733, h: 2.7,
      fill: { color: C.CARD_BG },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x + 0.2, y: 3.4, w: 3.333, h: 0.42,
      fill: { color: p.color },
      line: { color: p.color, width: 1 },
      rectRadius: 0.08
    });
    slide.addText(p.title, {
      x: p.x + 0.2, y: 3.4, w: 3.333, h: 0.42,
      fontSize: 11, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addText(p.desc, {
      x: p.x + 0.25, y: 4.0, w: 3.233, h: 1.7,
      fontSize: 9.5, color: C.TEXT_MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });
  });

  // Next Steps bar
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 6.15, w: 11.733, h: 0.65,
    fill: { color: C.NAVY_DARK },
    line: { color: C.NAVY_DARK, width: 1 },
    rectRadius: 0.1
  });
  slide.addText("ACTIONABLE NEXT STEP: Deploy a 7-day Proof of Concept (POC) on Supabase Free Tier at zero cost to validate client requirements.", {
    x: 1.0, y: 6.15, w: 11.333, h: 0.65,
    fontSize: 10, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  createFooter(slide, 10);
}

// Generate Presentation
const fileName = "Cloud_Database_Master_Presentation.pptx";
pptx.writeFile({ fileName: fileName })
  .then(() => {
    console.log(`Presentation generated with flawless alignment: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating presentation:", err);
  });
