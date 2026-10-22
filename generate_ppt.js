import pptxgenjs from "pptxgenjs";

const pptx = new pptxgenjs();
pptx.layout = "LAYOUT_16x9"; // 13.333 x 7.5 inches
pptx.author = "Cloud Architecture & Cybersecurity Advisory";
pptx.company = "Enterprise Consulting";
pptx.title = "Cloud Database Evaluation: Architecture, Security & Pricing";

// Strict Layout Dimensions
const SLIDE_W = 13.333;
const SLIDE_H = 7.5;
const MARGIN_X = 0.8;
const CONTENT_W = 11.733;

// Theme Colors
const COLOR_NAVY = "0F172A";       // Slate 900
const COLOR_DARK_BLUE = "1E293B";  // Slate 800
const COLOR_BLUE = "2563EB";       // Blue 600
const COLOR_BG_LIGHT = "F8FAFC";   // Slate 50
const COLOR_BORDER = "CBD5E1";     // Slate 300
const COLOR_TEXT = "0F172A";
const COLOR_MUTED = "475569";      // Slate 600
const COLOR_WHITE = "FFFFFF";
const COLOR_RED = "DC2626";        // Red 600
const COLOR_GREEN = "16A34A";      // Green 600
const COLOR_AMBER = "D97706";      // Amber 600

// Brand Platform Colors
const BRAND_SUPABASE = "059669";   // Emerald
const BRAND_MONGO = "15803D";      // Green
const BRAND_AZURE = "0284C7";      // Sky/Azure
const BRAND_AWS = "D97706";        // Orange/Amber

const TOTAL_SLIDES = 10;

// Universal Slide Header
function addHeader(slide, title, category) {
  // Top Accent Bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: SLIDE_W, h: 0.08,
    fill: { color: COLOR_BLUE }
  });

  // Category Tag Box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN_X, y: 0.35, w: 2.6, h: 0.28,
    fill: { color: "EFF6FF" },
    line: { color: "BFDBFE", width: 1 },
    rectRadius: 0.08
  });
  slide.addText(category.toUpperCase(), {
    x: MARGIN_X, y: 0.35, w: 2.6, h: 0.28,
    fontSize: 9, bold: true, color: "1D4ED8", align: "center", valign: "middle"
  });

  // Main Slide Title
  slide.addText(title, {
    x: MARGIN_X, y: 0.68, w: CONTENT_W, h: 0.5,
    fontSize: 20, bold: true, color: COLOR_NAVY, fontFace: "Segoe UI", valign: "middle"
  });
}

// Universal Slide Footer
function addFooter(slide, current) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: MARGIN_X, y: 6.95, w: CONTENT_W, h: 0.02,
    fill: { color: "E2E8F0" }
  });
  slide.addText("CONFIDENTIAL | Enterprise Cloud Database Architecture, Security & Pricing Evaluation", {
    x: MARGIN_X, y: 7.02, w: 8.5, h: 0.3,
    fontSize: 8.5, color: "94A3B8", fontFace: "Segoe UI", valign: "middle"
  });
  slide.addText(`Slide ${current} of ${TOTAL_SLIDES}`, {
    x: 10.53, y: 7.02, w: 2.0, h: 0.3,
    fontSize: 8.5, color: "94A3B8", align: "right", fontFace: "Segoe UI", valign: "middle"
  });
}

// =========================================================================
// SLIDE 1: Title Slide (Dark Theme)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: COLOR_NAVY };

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 0.9, w: 11.733, h: 5.7,
    fill: { color: COLOR_DARK_BLUE },
    line: { color: "334155", width: 1.5 },
    rectRadius: 0.2
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 1.2, y: 1.3, w: 3.5, h: 0.35,
    fill: { color: "1E3A8A" },
    line: { color: "3B82F6", width: 1 },
    rectRadius: 0.1
  });
  slide.addText("EXECUTIVE STRATEGY & SECURITY DECK", {
    x: 1.2, y: 1.3, w: 3.5, h: 0.35,
    fontSize: 10, bold: true, color: "93C5FD", align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  slide.addText("Cloud Database Evaluation:\nArchitecture, Anti-Hacking Security & Pricing", {
    x: 1.2, y: 1.8, w: 10.9, h: 1.4,
    fontSize: 30, bold: true, color: COLOR_WHITE, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  slide.addText("A Complete Business & Cyber-Defense Assessment of Supabase, MongoDB Atlas, Microsoft Azure, and Amazon AWS for Leadership & Client Advisory", {
    x: 1.2, y: 3.35, w: 10.9, h: 0.6,
    fontSize: 13, color: "94A3B8", fontFace: "Segoe UI"
  });

  // 4 Platform Cards
  const pCards = [
    { name: "Supabase", tag: "Postgres BaaS", color: "3ECF8E", desc: "Built-in Auth, Storage & RLS", x: 1.2 },
    { name: "MongoDB Atlas", tag: "Document NoSQL", color: "00ED64", desc: "Client-Side Field Encryption", x: 4.0 },
    { name: "Microsoft Azure", tag: "Enterprise SQL", color: "38BDF8", desc: "Active Directory & Threat Def.", x: 6.8 },
    { name: "Amazon AWS", tag: "Cloud Infrastructure", color: "FBBF24", desc: "Isolated VPC & KMS Encryption", x: 9.6 }
  ];

  pCards.forEach(p => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: 4.2, w: 2.53, h: 1.4,
      fill: { color: "0B1329" },
      line: { color: p.color, width: 1.5 },
      rectRadius: 0.12
    });
    slide.addText(p.name, {
      x: p.x, y: 4.35, w: 2.53, h: 0.35,
      fontSize: 14, bold: true, color: COLOR_WHITE, align: "center", fontFace: "Segoe UI"
    });
    slide.addText(p.tag, {
      x: p.x, y: 4.7, w: 2.53, h: 0.25,
      fontSize: 10, bold: true, color: p.color, align: "center", fontFace: "Segoe UI"
    });
    slide.addText(p.desc, {
      x: p.x + 0.1, y: 4.98, w: 2.33, h: 0.45,
      fontSize: 8.5, color: "94A3B8", align: "center", fontFace: "Segoe UI"
    });
  });

  slide.addText("Confidential | Prepared for Management Review & Client Pitching | 2026 Edition", {
    x: 1.2, y: 6.0, w: 10.9, h: 0.3,
    fontSize: 9.5, color: "64748B", align: "center", fontFace: "Segoe UI"
  });
}

// =========================================================================
// SLIDE 2: What is Each Database (Business Understanding)
// =========================================================================
{
  const slide = pptx.addSlide();
  addHeader(slide, "Understanding the 4 Database Options at a Glance", "Platform Overview");

  const platforms = [
    {
      name: "1. Supabase",
      role: "The All-in-One Rocket",
      color: BRAND_SUPABASE,
      accent: "ECFDF5",
      x: 0.8,
      text: [
        { title: "Core Technology", desc: "100% standard PostgreSQL database (no emulation)." },
        { title: "Included Modules", desc: "Built-in User Logins (Google, Apple, Email), File Storage, and auto REST APIs." },
        { title: "Business Benefit", desc: "Cuts backend development time by 40% for new web/mobile apps." },
        { title: "Portability", desc: "Zero vendor lock-in. Full standard SQL dumps can be migrated anytime." }
      ]
    },
    {
      name: "2. MongoDB Atlas",
      role: "The Flexible Filing Cabinet",
      color: BRAND_MONGO,
      accent: "F0FDF4",
      x: 3.8,
      text: [
        { title: "Core Technology", desc: "Document-based NoSQL (stores data as JSON documents)." },
        { title: "Included Modules", desc: "Built-in Google-style Search Engine, 3-Node auto-replication cluster." },
        { title: "Business Benefit", desc: "Products can have totally different specs without breaking database tables." },
        { title: "Portability", desc: "Runs identically across AWS, Microsoft Azure, and Google Cloud." }
      ]
    },
    {
      name: "3. Microsoft Azure",
      role: "The Corporate Suite",
      color: BRAND_AZURE,
      accent: "EFF6FF",
      x: 6.8,
      text: [
        { title: "Core Technology", desc: "Azure SQL Database (T-SQL engine) & Azure Database for PostgreSQL." },
        { title: "Included Modules", desc: "Direct sync with Microsoft 365, Excel, Power BI dashboards, and C# .NET." },
        { title: "Business Benefit", desc: "Cheapest entry price ($5/mo Basic tier) for corporate back-office apps." },
        { title: "Security Tier", desc: "Tied to corporate Microsoft Active Directory / Entra ID logins." }
      ]
    },
    {
      name: "4. Amazon AWS",
      role: "The Industrial Powerhouse",
      color: BRAND_AWS,
      accent: "FFFBEB",
      x: 9.8,
      text: [
        { title: "Core Technology", desc: "Amazon RDS (Relational Postgres/MySQL) & DynamoDB (NoSQL)." },
        { title: "Included Modules", desc: "Multi-Availability Zone auto-failover, isolated VPC firewall subnets." },
        { title: "Business Benefit", desc: "DynamoDB gives 25 GB free forever with single-digit millisecond latency." },
        { title: "Scalability", desc: "Handles millions of transactions per second for large banks and tech giants." }
      ]
    }
  ];

  platforms.forEach(p => {
    // Outer Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: 1.45, w: 2.733, h: 5.3,
      fill: { color: COLOR_BG_LIGHT },
      line: { color: COLOR_BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    // Card Header Bar
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: 1.45, w: 2.733, h: 0.85,
      fill: { color: p.color },
      line: { color: p.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(p.name, {
      x: p.x + 0.15, y: 1.52, w: 2.433, h: 0.35,
      fontSize: 13, bold: true, color: COLOR_WHITE, fontFace: "Segoe UI"
    });
    slide.addText(p.role, {
      x: p.x + 0.15, y: 1.9, w: 2.433, h: 0.3,
      fontSize: 9.5, color: "E2E8F0", fontFace: "Segoe UI"
    });

    // Inner 4 Content Blocks
    p.text.forEach((t, idx) => {
      const boxY = 2.45 + (idx * 1.0);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: p.x + 0.15, y: boxY, w: 2.433, h: 0.9,
        fill: { color: COLOR_WHITE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });
      slide.addText(t.title.toUpperCase(), {
        x: p.x + 0.22, y: boxY + 0.06, w: 2.3, h: 0.22,
        fontSize: 8, bold: true, color: p.color, fontFace: "Segoe UI"
      });
      slide.addText(t.desc, {
        x: p.x + 0.22, y: boxY + 0.28, w: 2.3, h: 0.56,
        fontSize: 8.5, color: COLOR_TEXT, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
      });
    });
  });

  addFooter(slide, 2);
}

// =========================================================================
// SLIDE 3: Visual Architecture Flow (How Users Connect - Non-Coding)
// =========================================================================
{
  const slide = pptx.addSlide();
  addHeader(slide, "Visual Architecture: How Users Connect to Each Database", "Architecture Flow");

  const flows = [
    {
      title: "1. SUPABASE ARCHITECTURE (Direct & All-in-One BaaS)",
      color: BRAND_SUPABASE,
      step1Title: "User App", step1Sub: "Web / Mobile Client",
      step2Title: "API & Auth Gateway", step2Sub: "Kong + GoTrue + Storage",
      step3Title: "PostgreSQL Database", step3Sub: "Row Level Security (RLS)",
      benefit: "ADVANTAGE: No custom backend servers needed. Built-in security enforces permissions at database level.",
      y: 1.45
    },
    {
      title: "2. MONGODB ATLAS ARCHITECTURE (Multi-Cloud Auto-Replication)",
      color: BRAND_MONGO,
      step1Title: "User App", step1Sub: "Web / Mobile Client",
      step2Title: "App Server", step2Sub: "Node.js / Python API",
      step3Title: "3-Node Replica Cluster", step3Sub: "Auto-copies data across 3 servers",
      benefit: "ADVANTAGE: 100% High Availability. If one server dies, another takes over in under 2 seconds automatically.",
      y: 2.82
    },
    {
      title: "3. MICROSOFT AZURE ARCHITECTURE (Corporate Protected Network)",
      color: BRAND_AZURE,
      step1Title: "Corporate App", step1Sub: "Enterprise / Office 365",
      step2Title: "Azure Entra ID & Firewall", step2Sub: "Active Directory + IP Rules",
      step3Title: "Azure SQL Database", step3Sub: "Direct sync with Power BI & Excel",
      benefit: "ADVANTAGE: Deep corporate authentication. Employees log in using company single-sign-on credentials.",
      y: 4.19
    },
    {
      title: "4. AMAZON AWS ARCHITECTURE (Enterprise Fortress & Extreme Scale)",
      color: BRAND_AWS,
      step1Title: "High-Traffic App", step1Sub: "Millions of Visitors",
      step2Title: "VPC Gateway & IAM", step2Sub: "Private Subnet + Security Groups",
      step3Title: "Amazon RDS / DynamoDB", step3Sub: "SSD High IOPS Storage Cluster",
      benefit: "ADVANTAGE: Maximum bank-grade perimeter defense. Database is completely invisible to public internet.",
      y: 5.56
    }
  ];

  flows.forEach(f => {
    // Flow row container
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MARGIN_X, y: f.y, w: CONTENT_W, h: 1.22,
      fill: { color: COLOR_BG_LIGHT },
      line: { color: COLOR_BORDER, width: 1 },
      rectRadius: 0.1
    });

    // Left color indicator bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: MARGIN_X, y: f.y, w: 0.15, h: 1.22,
      fill: { color: f.color }
    });

    // Flow title
    slide.addText(f.title, {
      x: MARGIN_X + 0.3, y: f.y + 0.08, w: 10.5, h: 0.26,
      fontSize: 10.5, bold: true, color: COLOR_NAVY, fontFace: "Segoe UI"
    });

    // Step 1 Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MARGIN_X + 0.3, y: f.y + 0.38, w: 2.5, h: 0.48,
      fill: { color: "EFF6FF" },
      line: { color: "BFDBFE", width: 1 },
      rectRadius: 0.08
    });
    slide.addText(f.step1Title, {
      x: MARGIN_X + 0.3, y: f.y + 0.41, w: 2.5, h: 0.22,
      fontSize: 9.5, bold: true, color: "1E40AF", align: "center", fontFace: "Segoe UI"
    });
    slide.addText(f.step1Sub, {
      x: MARGIN_X + 0.3, y: f.y + 0.62, w: 2.5, h: 0.2,
      fontSize: 8, color: "3B82F6", align: "center", fontFace: "Segoe UI"
    });

    // Arrow 1
    slide.addText("➔", {
      x: MARGIN_X + 2.85, y: f.y + 0.38, w: 0.45, h: 0.48,
      fontSize: 16, bold: true, color: "94A3B8", align: "center", valign: "middle"
    });

    // Step 2 Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MARGIN_X + 3.35, y: f.y + 0.38, w: 3.8, h: 0.48,
      fill: { color: "F1F5F9" },
      line: { color: "CBD5E1", width: 1 },
      rectRadius: 0.08
    });
    slide.addText(f.step2Title, {
      x: MARGIN_X + 3.35, y: f.y + 0.41, w: 3.8, h: 0.22,
      fontSize: 9.5, bold: true, color: COLOR_TEXT, align: "center", fontFace: "Segoe UI"
    });
    slide.addText(f.step2Sub, {
      x: MARGIN_X + 3.35, y: f.y + 0.62, w: 3.8, h: 0.2,
      fontSize: 8, color: COLOR_MUTED, align: "center", fontFace: "Segoe UI"
    });

    // Arrow 2
    slide.addText("➔", {
      x: MARGIN_X + 7.2, y: f.y + 0.38, w: 0.45, h: 0.48,
      fontSize: 16, bold: true, color: "94A3B8", align: "center", valign: "middle"
    });

    // Step 3 Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MARGIN_X + 7.7, y: f.y + 0.38, w: 3.7, h: 0.48,
      fill: { color: "FEF3C7" },
      line: { color: "FCD34D", width: 1 },
      rectRadius: 0.08
    });
    slide.addText(f.step3Title, {
      x: MARGIN_X + 7.7, y: f.y + 0.41, w: 3.7, h: 0.22,
      fontSize: 9.5, bold: true, color: "92400E", align: "center", fontFace: "Segoe UI"
    });
    slide.addText(f.step3Sub, {
      x: MARGIN_X + 7.7, y: f.y + 0.62, w: 3.7, h: 0.2,
      fontSize: 8, color: "B45309", align: "center", fontFace: "Segoe UI"
    });

    // Bottom Benefit Callout
    slide.addText(f.benefit, {
      x: MARGIN_X + 0.3, y: f.y + 0.92, w: 11.1, h: 0.24,
      fontSize: 8.5, bold: true, color: COLOR_MUTED, fontFace: "Segoe UI"
    });
  });

  addFooter(slide, 3);
}

// =========================================================================
// SLIDE 4: Anti-Hacking Security: The Threat Landscape (Hacker's Eye View)
// =========================================================================
{
  const slide = pptx.addSlide();
  addHeader(slide, "Data Security in the Hacker's Eye: How Cyberattacks Happen", "Cybersecurity Assessment");

  const attacks = [
    {
      attack: "1. SQL Injection & Data Tampering",
      how: "How Hackers Attack:",
      howText: "Attackers inject malicious query fragments into form fields or APIs to dump or delete database tables.",
      danger: "HIGH DANGER: Complete database exfiltration, credential loss, and compliance fines.",
      x: 0.8, y: 1.45
    },
    {
      attack: "2. Port Scanning & Public Exposure",
      how: "How Hackers Attack:",
      howText: "Automated bots scan internet IP ranges for open ports (5432 for Postgres, 3306 for MySQL, 27017 for Mongo).",
      danger: "HIGH DANGER: Ransomware groups lock databases with weak admin passwords within 15 minutes.",
      x: 6.8, y: 1.45
    },
    {
      attack: "3. Broken Authorization & Leaked Keys",
      how: "How Hackers Attack:",
      howText: "Attackers inspect frontend mobile or web JavaScript code for hardcoded database connection secrets.",
      danger: "HIGH DANGER: Unauthorized actors read sensitive customer records directly without going through login.",
      x: 0.8, y: 4.15
    },
    {
      attack: "4. Network Man-in-the-Middle (Eavesdropping)",
      how: "How Hackers Attack:",
      howText: "Hackers intercept unencrypted traffic traveling between application servers and the cloud database.",
      danger: "HIGH DANGER: Passwords, credit cards, and PII stolen in transit over public WiFi and routers.",
      x: 6.8, y: 4.15
    }
  ];

  attacks.forEach(a => {
    // Outer Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: a.x, y: a.y, w: 5.733, h: 2.5,
      fill: { color: COLOR_BG_LIGHT },
      line: { color: "FCA5A5", width: 1.2 },
      rectRadius: 0.12
    });

    // Top Red Header
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: a.x, y: a.y, w: 5.733, h: 0.42,
      fill: { color: COLOR_RED },
      line: { color: COLOR_RED, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(a.attack, {
      x: a.x + 0.2, y: a.y + 0.06, w: 5.333, h: 0.3,
      fontSize: 11, bold: true, color: COLOR_WHITE, fontFace: "Segoe UI"
    });

    // Hacker Explanation Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: a.x + 0.2, y: a.y + 0.55, w: 5.333, h: 1.0,
      fill: { color: COLOR_WHITE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText(a.how.toUpperCase(), {
      x: a.x + 0.3, y: a.y + 0.62, w: 5.1, h: 0.22,
      fontSize: 8.5, bold: true, color: COLOR_RED, fontFace: "Segoe UI"
    });
    slide.addText(a.howText, {
      x: a.x + 0.3, y: a.y + 0.86, w: 5.1, h: 0.6,
      fontSize: 9, color: COLOR_TEXT, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });

    // Danger Callout
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: a.x + 0.2, y: a.y + 1.68, w: 5.333, h: 0.65,
      fill: { color: "FEF2F2" },
      line: { color: "FECACA", width: 1 },
      rectRadius: 0.08
    });
    slide.addText(a.danger, {
      x: a.x + 0.3, y: a.y + 1.72, w: 5.1, h: 0.55,
      fontSize: 8.5, bold: true, color: "991B1B", fontFace: "Segoe UI", lineSpacingMultiple: 1.15
    });
  });

  addFooter(slide, 4);
}

// =========================================================================
// SLIDE 5: How Each Database Defends Against Hackers
// =========================================================================
{
  const slide = pptx.addSlide();
  addHeader(slide, "Anti-Hacking Defenses: How Each Database Protects Client Data", "Defense In Depth");

  const defenses = [
    {
      name: "1. SUPABASE DEFENSE STACK",
      color: BRAND_SUPABASE,
      features: [
        { name: "Row-Level Security (RLS)", desc: "Database engine enforces that User A can never query or view User B's records, even if the API endpoint is hacked." },
        { name: "JWT Role Verification", desc: "Every database query requires a cryptographically signed JSON Web Token; anonymous queries are blocked." },
        { name: "Zero Direct Port Exposure", desc: "Client apps interact via encrypted HTTPS / Kong API Gateway. Raw PostgreSQL port 5432 stays shielded." },
        { name: "Encrypted Storage (AES-256)", desc: "Database files, WAL logs, and file storage buckets are encrypted at rest with AES-256." }
      ],
      x: 0.8, y: 1.45
    },
    {
      name: "2. MONGODB ATLAS DEFENSE STACK",
      color: BRAND_MONGO,
      features: [
        { name: "Client-Side Field Level Encryption (CSFLE)", desc: "Sensitive data (credit cards, SSN) is encrypted in memory on the app before reaching Mongo; even DB admins cannot read it." },
        { name: "IP Access Whitelisting", desc: "Clusters reject 100% of connection attempts by default unless the client's IP is explicitly registered in the firewall." },
        { name: "Automatic TLS 1.3 Encryption", desc: "All incoming and outgoing traffic is forced over modern TLS 1.3. Plaintext connections are immediately dropped." },
        { name: "Role-Based Access Control (RBAC)", desc: "Strict granular user privileges ensuring apps only have Read/Write access to specific collections." }
      ],
      x: 6.8, y: 1.45
    },
    {
      name: "3. MICROSOFT AZURE DEFENSE STACK",
      color: BRAND_AZURE,
      features: [
        { name: "Microsoft Defender for Cloud", desc: "AI-driven threat intelligence detects SQL injection attacks, anomalous login locations, and suspicious query dumps." },
        { name: "Entra ID (Active Directory) Auth", desc: "Eliminates hardcoded database passwords entirely; uses enterprise multi-factor authentication (MFA)." },
        { name: "Always Encrypted Technology", desc: "Protects sensitive data at rest, in transit, and even while active in server memory from virtualization attacks." },
        { name: "Private Link Endpoints", desc: "Keeps database traffic exclusively on Microsoft's private global fiber network, off the public internet." }
      ],
      x: 0.8, y: 4.15
    },
    {
      name: "4. AMAZON AWS DEFENSE STACK",
      color: BRAND_AWS,
      features: [
        { name: "VPC Private Subnet Isolation", desc: "Database has NO public IP address. It resides in an isolated subnet reachable ONLY by verified internal app servers." },
        { name: "AWS IAM Database Authentication", desc: "Short-lived temporary access tokens replace database passwords, preventing credential leaks." },
        { name: "AWS KMS Master Encryption Keys", desc: "Hardware security module (FIPS 140-2 Level 3) manages encryption keys; data is unreadable if drives are stolen." },
        { name: "AWS GuardDuty & CloudTrail", desc: "Logs every single administrative access and automatically alerts security teams to brute-force attempts." }
      ],
      x: 6.8, y: 4.15
    }
  ];

  defenses.forEach(d => {
    // Outer Card
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: d.x, y: d.y, w: 5.733, h: 2.55,
      fill: { color: COLOR_BG_LIGHT },
      line: { color: COLOR_BORDER, width: 1 },
      rectRadius: 0.12
    });

    // Top Header
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: d.x, y: d.y, w: 5.733, h: 0.4,
      fill: { color: d.color },
      line: { color: d.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(d.name, {
      x: d.x + 0.2, y: d.y + 0.05, w: 5.333, h: 0.3,
      fontSize: 10.5, bold: true, color: COLOR_WHITE, fontFace: "Segoe UI"
    });

    // 4 Defense Items
    d.features.forEach((feat, idx) => {
      const itemY = d.y + 0.48 + (idx * 0.5);
      slide.addShape(pptx.shapes.OVAL, {
        x: d.x + 0.2, y: itemY + 0.05, w: 0.12, h: 0.12,
        fill: { color: d.color }
      });
      slide.addText(`${feat.name}: `, {
        x: d.x + 0.38, y: itemY, w: 5.15, h: 0.45,
        fontSize: 8.5, bold: true, color: COLOR_TEXT, fontFace: "Segoe UI"
      });
      slide.addText(feat.desc, {
        x: d.x + 0.38, y: itemY + 0.16, w: 5.15, h: 0.32,
        fontSize: 8, color: COLOR_MUTED, fontFace: "Segoe UI"
      });
    });
  });

  addFooter(slide, 5);
}

// =========================================================================
// SLIDE 6: Master Security Checklist: What We Implement for Clients
// =========================================================================
{
  const slide = pptx.addSlide();
  addHeader(slide, "Anti-Hacking Checklist: Mandatory Controls We Implement for Clients", "Security Implementation");

  const checklist = [
    {
      colTitle: "NETWORK LEVEL DEFENSE",
      color: "1D4ED8",
      x: 0.8,
      items: [
        { title: "IP Whitelisting", desc: "Block 100% of public internet traffic; permit only client application IP ranges." },
        { title: "Enforced TLS 1.3 / SSL", desc: "Mandate encryption in transit with strong ciphers; reject unencrypted plain connections." },
        { title: "Private VPC Peering", desc: "Route database traffic through dedicated private cloud subnets with zero external exposure." }
      ]
    },
    {
      colTitle: "DATA & QUERY LEVEL DEFENSE",
      color: "059669",
      x: 4.8,
      items: [
        { title: "Row-Level Security (RLS)", desc: "Enforce strict tenant data separation at the database engine level." },
        { title: "Parameterized Queries", desc: "Zero dynamic SQL concatenation; eliminate SQL injection risks at the code boundary." },
        { title: "AES-256 Storage Encryption", desc: "Automate hardware-accelerated encryption for data at rest and all daily snapshots." }
      ]
    },
    {
      colTitle: "ACCESS & IDENTITY DEFENSE",
      color: "D97706",
      x: 8.8,
      items: [
        { title: "Principle of Least Privilege", desc: "Applications use read-only or restricted accounts; admin passwords never stored in code." },
        { title: "Multi-Factor Auth (MFA)", desc: "Mandatory hardware key / authenticator MFA for all engineers accessing cloud consoles." },
        { title: "Automated Daily Backups", desc: "Encrypted point-in-time recovery copies stored across independent geographic zones." }
      ]
    }
  ];

  checklist.forEach(c => {
    // Column Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 3.733, h: 4.6,
      fill: { color: COLOR_BG_LIGHT },
      line: { color: COLOR_BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    // Column Header
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 3.733, h: 0.5,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.colTitle, {
      x: c.x, y: 1.45, w: 3.733, h: 0.5,
      fontSize: 10.5, bold: true, color: COLOR_WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    // Items
    c.items.forEach((item, idx) => {
      const itemY = 2.15 + (idx * 1.25);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: c.x + 0.2, y: itemY, w: 3.333, h: 1.1,
        fill: { color: COLOR_WHITE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });
      slide.addShape(pptx.shapes.OVAL, {
        x: c.x + 0.35, y: itemY + 0.12, w: 0.18, h: 0.18,
        fill: { color: "16A34A" }
      });
      slide.addText("✔", {
        x: c.x + 0.35, y: itemY + 0.1, w: 0.18, h: 0.18,
        fontSize: 9, bold: true, color: COLOR_WHITE, align: "center", valign: "middle"
      });
      slide.addText(item.title, {
        x: c.x + 0.6, y: itemY + 0.08, w: 2.8, h: 0.25,
        fontSize: 9.5, bold: true, color: COLOR_TEXT, fontFace: "Segoe UI"
      });
      slide.addText(item.desc, {
        x: c.x + 0.35, y: itemY + 0.38, w: 3.05, h: 0.65,
        fontSize: 8.5, color: COLOR_MUTED, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
      });
    });
  });

  // Bottom Guarantee Banner
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN_X, y: 6.2, w: CONTENT_W, h: 0.55,
    fill: { color: "EFF6FF" },
    line: { color: "BFDBFE", width: 1 },
    rectRadius: 0.08
  });
  slide.addText("CLIENT SECURITY GUARANTEE: With these 9 layers configured, client database assets meet SOC 2, HIPAA, and GDPR compliance standards.", {
    x: MARGIN_X, y: 6.2, w: CONTENT_W, h: 0.55,
    fontSize: 9.5, bold: true, color: "1E40AF", align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  addFooter(slide, 6);
}

// =========================================================================
// SLIDE 7: Side-by-Side Pricing, Storage & User Limits Table
// =========================================================================
{
  const slide = pptx.addSlide();
  addHeader(slide, "Side-by-Side Pricing, Storage & User Limits", "Cost & Capacity");

  const tableData = [
    [
      { text: "Platform", options: { bold: true, fill: "0F172A", color: COLOR_WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Free Tier Quota", options: { bold: true, fill: "0F172A", color: COLOR_WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Monthly Active Users (Free)", options: { bold: true, fill: "0F172A", color: COLOR_WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Entry Paid Price", options: { bold: true, fill: "0F172A", color: COLOR_WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Storage in Paid Plan", options: { bold: true, fill: "0F172A", color: COLOR_WHITE, fontSize: 9.5, fontFace: "Segoe UI" } },
      { text: "Production / Scale Cost", options: { bold: true, fill: "0F172A", color: COLOR_WHITE, fontSize: 9.5, fontFace: "Segoe UI" } }
    ],
    [
      { text: "Supabase", options: { bold: true, color: BRAND_SUPABASE, fontFace: "Segoe UI" } },
      { text: "500 MB (Free Forever)\nNo credit card required", options: { fontFace: "Segoe UI" } },
      { text: "Up to 50,000 MAU\n(5 GB transfer)", options: { fontFace: "Segoe UI" } },
      { text: "$25 / month\n(Pro Flat Plan)", options: { bold: true, fontFace: "Segoe UI" } },
      { text: "8 GB included\n(+$0.125/GB auto-expand)", options: { fontFace: "Segoe UI" } },
      { text: "$599 / mo (Team Tier)\n100k+ MAU, SOC2, SLA", options: { fontFace: "Segoe UI" } }
    ],
    [
      { text: "MongoDB Atlas", options: { bold: true, color: BRAND_MONGO, fontFace: "Segoe UI" } },
      { text: "512 MB (M0 Sandbox)\nFree Forever", options: { fontFace: "Segoe UI" } },
      { text: "~15,000 MAU\n(500 connections)", options: { fontFace: "Segoe UI" } },
      { text: "$9 – $25 / month\n(M2 / M5 Shared)", options: { bold: true, fontFace: "Segoe UI" } },
      { text: "2 GB – 5 GB SSD\nAuto daily snapshots", options: { fontFace: "Segoe UI" } },
      { text: "$57 – $400+ / mo (Dedicated)\nUp to 4 TB NVMe SSD", options: { fontFace: "Segoe UI" } }
    ],
    [
      { text: "Microsoft Azure", options: { bold: true, color: BRAND_AZURE, fontFace: "Segoe UI" } },
      { text: "32 GB Free (12 Months)\n100k vCore-sec free/mo", options: { fontFace: "Segoe UI" } },
      { text: "~25,000 MAU\n(Serverless autosuspend)", options: { fontFace: "Segoe UI" } },
      { text: "$4.99 / month\n(Basic Tier - 5 DTU)", options: { bold: true, fontFace: "Segoe UI" } },
      { text: "2 GB max (Basic)\n250 GB in Standard ($15/mo)", options: { fontFace: "Segoe UI" } },
      { text: "$75 – $250+ / mo (Standard/vCore)\nUp to 100 TB on Hyperscale", options: { fontFace: "Segoe UI" } }
    ],
    [
      { text: "Amazon AWS (RDS)", options: { bold: true, color: BRAND_AWS, fontFace: "Segoe UI" } },
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
    x: MARGIN_X, y: 1.45, w: CONTENT_W, h: 5.2,
    colW: [1.8, 2.1, 2.0, 1.8, 2.0, 2.033],
    fontSize: 9,
    valign: "middle",
    border: { pt: 1, color: "CBD5E1" },
    fill: { color: COLOR_WHITE },
    rowH: [0.45, 0.92, 0.92, 0.92, 0.92, 0.95]
  });

  addFooter(slide, 7);
}

// =========================================================================
// SLIDE 8: Advantages & Disadvantages Matrix
// =========================================================================
{
  const slide = pptx.addSlide();
  addHeader(slide, "Advantages & Disadvantages of Each Platform", "Trade-Off Analysis");

  const cards = [
    {
      name: "1. Supabase",
      color: BRAND_SUPABASE,
      pros: ["Zero setup; live in 2 mins", "Auth & File Storage included", "No credit card needed to start", "Real open-source Postgres"],
      cons: ["Free tier pauses after 7 days idle", "High data transfer incurs fees", "Less mature than 15-yr clouds"],
      x: 0.8, y: 1.45
    },
    {
      name: "2. MongoDB Atlas",
      color: BRAND_MONGO,
      pros: ["Zero schema rigidity (JSON)", "Built-in full-text search", "Auto 3-node disaster backup", "Works across AWS, Azure, GCP"],
      cons: ["Dedicated servers start at $57/mo", "Inefficient for deep SQL JOINs", "High RAM consumption if unindexed"],
      x: 6.8, y: 1.45
    },
    {
      name: "3. Microsoft Azure",
      color: BRAND_AZURE,
      pros: ["Cheapest entry plan ($5/mo Basic)", "Native Power BI & Office sync", "Active Directory enterprise auth", "Serverless pauses off-hours"],
      cons: ["Basic plan capped at 2 GB", "Complex portal navigation", "Steep price jump on high vCores"],
      x: 0.8, y: 4.15
    },
    {
      name: "4. Amazon AWS",
      color: BRAND_AWS,
      pros: ["DynamoDB 25 GB free forever", "99.999% proven global uptime", "Infinite compute scalability", "VPC enterprise data fortress"],
      cons: ["Requires DevOps/Cloud engineers", "Risk of surprise bills (egress/IOPS)", "No built-in Auth or UI dashboard"],
      x: 6.8, y: 4.15
    }
  ];

  cards.forEach(c => {
    // Card Box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: c.y, w: 5.733, h: 2.55,
      fill: { color: COLOR_BG_LIGHT },
      line: { color: COLOR_BORDER, width: 1 },
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
      fontSize: 11.5, bold: true, color: COLOR_WHITE, fontFace: "Segoe UI"
    });

    // Left: PROS
    slide.addText("✔ ADVANTAGES", {
      x: c.x + 0.2, y: c.y + 0.5, w: 2.6, h: 0.25,
      fontSize: 9, bold: true, color: COLOR_GREEN, fontFace: "Segoe UI"
    });
    c.pros.forEach((p, idx) => {
      slide.addText(`• ${p}`, {
        x: c.x + 0.2, y: c.y + 0.75 + (idx * 0.38), w: 2.6, h: 0.35,
        fontSize: 8.5, color: COLOR_TEXT, fontFace: "Segoe UI"
      });
    });

    // Divider Line
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: c.x + 2.85, y: c.y + 0.55, w: 0.02, h: 1.8,
      fill: { color: "CBD5E1" }
    });

    // Right: CONS
    slide.addText("✖ DISADVANTAGES", {
      x: c.x + 3.05, y: c.y + 0.5, w: 2.5, h: 0.25,
      fontSize: 9, bold: true, color: COLOR_RED, fontFace: "Segoe UI"
    });
    c.cons.forEach((con, idx) => {
      slide.addText(`• ${con}`, {
        x: c.x + 3.05, y: c.y + 0.75 + (idx * 0.45), w: 2.5, h: 0.42,
        fontSize: 8.5, color: COLOR_MUTED, fontFace: "Segoe UI"
      });
    });
  });

  addFooter(slide, 8);
}

// =========================================================================
// SLIDE 9: Strategic Recommendations for Clients (What & Why)
// =========================================================================
{
  const slide = pptx.addSlide();
  addHeader(slide, "Strategic Recommendations for Clients (What to Suggest & Why)", "Client Advisory");

  const recommendations = [
    {
      scenario: "Web / Mobile Startup or MVP",
      pick: "SUPABASE",
      color: BRAND_SUPABASE,
      bg: "ECFDF5",
      why: [
        "Cuts development time by 40%: Auth, APIs, and File Uploads are built-in.",
        "Costs $0 to build and launch; smooth step to $25/mo when traffic grows.",
        "Standard PostgreSQL protects client from vendor lock-in."
      ],
      y: 1.45
    },
    {
      scenario: "E-Commerce, Store Catalogs & Media",
      pick: "MONGODB ATLAS",
      color: BRAND_MONGO,
      bg: "F0FDF4",
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
      color: BRAND_AZURE,
      bg: "EFF6FF",
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
      color: BRAND_AWS,
      bg: "FFFBEB",
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
      x: MARGIN_X, y: r.y, w: CONTENT_W, h: 1.22,
      fill: { color: r.bg },
      line: { color: r.color, width: 1.2 },
      rectRadius: 0.1
    });

    // Left Scenario Column
    slide.addText(r.scenario, {
      x: MARGIN_X + 0.25, y: r.y + 0.12, w: 3.2, h: 0.35,
      fontSize: 11, bold: true, color: COLOR_NAVY, fontFace: "Segoe UI"
    });

    // Pick Pill
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: MARGIN_X + 0.25, y: r.y + 0.5, w: 2.6, h: 0.45,
      fill: { color: r.color },
      line: { color: r.color, width: 1 },
      rectRadius: 0.08
    });
    slide.addText(`👉 SUGGEST: ${r.pick}`, {
      x: MARGIN_X + 0.25, y: r.y + 0.5, w: 2.6, h: 0.45,
      fontSize: 10, bold: true, color: COLOR_WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    // Right Justification Bullets
    r.why.forEach((w, idx) => {
      slide.addText(`• ${w}`, {
        x: MARGIN_X + 3.1, y: r.y + 0.1 + (idx * 0.34), w: 8.3, h: 0.32,
        fontSize: 9, color: COLOR_TEXT, fontFace: "Segoe UI"
      });
    });
  });

  addFooter(slide, 9);
}

// =========================================================================
// SLIDE 10: Executive Summary & 60-Second Client Pitch
// =========================================================================
{
  const slide = pptx.addSlide();
  addHeader(slide, "Executive Summary: The 60-Second Client Pitch", "Executive Pitch");

  // Main Callout Banner
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN_X, y: 1.45, w: CONTENT_W, h: 1.5,
    fill: { color: "EFF6FF" },
    line: { color: COLOR_BLUE, width: 2 },
    rectRadius: 0.15
  });

  slide.addText("THE WINNING RECOMMENDATION FOR 80% OF NEW CLIENTS:", {
    x: MARGIN_X + 0.3, y: 1.6, w: 11.0, h: 0.28,
    fontSize: 10.5, bold: true, color: "1D4ED8", fontFace: "Segoe UI"
  });

  slide.addText("\"Start with SUPABASE: It delivers the fastest time-to-market, costs $0 to build, and offers a predictable flat $25/month price with zero vendor lock-in.\"", {
    x: MARGIN_X + 0.3, y: 1.9, w: 11.1, h: 0.85,
    fontSize: 14, bold: true, color: COLOR_NAVY, italic: true, fontFace: "Segoe UI"
  });

  // 3 Pillar Highlights
  const pillars = [
    {
      title: "1. Massive Cost Savings",
      color: BRAND_SUPABASE,
      desc: "Free Tier provides 50,000 active users and 500 MB storage at $0. Moving to production is only $25/mo without surprise usage spikes.",
      x: 0.8
    },
    {
      title: "2. Fast Delivery Velocity",
      color: COLOR_BLUE,
      desc: "Authentication, storage buckets, and instant REST APIs come pre-built. Clients save 3 to 6 weeks of custom backend engineering.",
      x: 4.8
    },
    {
      title: "3. 100% Future-Proof",
      color: BRAND_AWS,
      desc: "Powered by pure standard PostgreSQL. If the client expands into an enterprise later, their data moves to AWS or Azure with 1 click.",
      x: 8.8
    }
  ];

  pillars.forEach(p => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: 3.2, w: 3.733, h: 2.7,
      fill: { color: COLOR_BG_LIGHT },
      line: { color: COLOR_BORDER, width: 1 },
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
      fontSize: 11, bold: true, color: COLOR_WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addText(p.desc, {
      x: p.x + 0.25, y: 4.0, w: 3.233, h: 1.7,
      fontSize: 9.5, color: COLOR_TEXT, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });
  });

  // Next Steps bar
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN_X, y: 6.15, w: CONTENT_W, h: 0.65,
    fill: { color: COLOR_NAVY },
    line: { color: COLOR_NAVY, width: 1 },
    rectRadius: 0.1
  });
  slide.addText("ACTIONABLE NEXT STEP: Deploy a 7-day Proof of Concept (POC) on Supabase Free Tier at zero cost to validate client requirements.", {
    x: MARGIN_X + 0.2, y: 6.15, w: CONTENT_W - 0.4, h: 0.65,
    fontSize: 10, bold: true, color: COLOR_WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  addFooter(slide, 10);
}

// Generate Presentation
const fileName = "Cloud_Database_Evaluation_Master.pptx";
pptx.writeFile({ fileName: fileName })
  .then(() => {
    console.log(`Presentation regenerated successfully: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating presentation:", err);
  });
