import pptxgenjs from "pptxgenjs";

const pptx = new pptxgenjs();

// Explicit 16:9 Widescreen Layout (13.333 inches wide by 7.5 inches tall)
pptx.defineLayout({ name: "WIDESCREEN_16_9", width: 13.333, height: 7.5 });
pptx.layout = "WIDESCREEN_16_9";

pptx.author = "Cloud Architecture Advisory";
pptx.company = "Enterprise Consulting";
pptx.title = "Cloud Database Strategy & Anti-Hacking Security Review";

// Canvas Geometry
const W = 13.333;
const H = 7.5;
const MX = 0.8;
const CW = 11.733;

// Palette
const C = {
  NAVY: "0A0F1D",
  NAVY_CARD: "131D33",
  PAGE: "F8FAFC",
  WHITE: "FFFFFF",
  MAIN: "0F172A",
  MUTED: "475569",
  BORDER: "E2E8F0",
  CARD: "FFFFFF",
  
  // Brands
  SUPABASE: "059669",
  SUPABASE_BG: "ECFDF5",
  MONGO: "16A34A",
  MONGO_BG: "F0FDF4",
  AZURE: "0284C7",
  AZURE_BG: "F0F9FF",
  AWS: "D97706",
  AWS_BG: "FFFBEB",
  
  // Accents
  RED: "DC2626",
  RED_BG: "FEF2F2",
  RED_BORDER: "FECACA",
  BLUE: "2563EB",
  BLUE_BG: "EFF6FF",
  BLUE_BORDER: "BFDBFE"
};

const TOTAL_SLIDES = 17;

// Universal Slide Header
function addHeader(slide, title, category) {
  // Top thin blue accent bar
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: W, h: 0.08,
    fill: { color: C.BLUE }
  });

  // Category Tag Box
  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: MX, y: 0.35, w: 2.5, h: 0.3,
    fill: { color: C.BLUE_BG },
    line: { color: C.BLUE_BORDER, width: 1 },
    rectRadius: 0.08
  });
  slide.addText(category.toUpperCase(), {
    x: MX, y: 0.35, w: 2.5, h: 0.3,
    fontSize: 9, bold: true, color: "1D4ED8",
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  // Slide Title
  slide.addText(title, {
    x: MX, y: 0.72, w: CW, h: 0.55,
    fontSize: 21, bold: true, color: C.NAVY,
    fontFace: "Segoe UI", valign: "middle"
  });
}

// Universal Slide Footer
function addFooter(slide, current) {
  slide.addShape(pptx.shapes.RECTANGLE, {
    x: MX, y: 6.95, w: CW, h: 0.02,
    fill: { color: "E2E8F0" }
  });
  slide.addText("CONFIDENTIAL & PROPRIETARY | Enterprise Cloud Database Evaluation & Advisory", {
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
    x: 1.2, y: 1.2, w: 3.5, h: 0.35,
    fill: { color: "1E3A8A" },
    line: { color: "3B82F6", width: 1 },
    rectRadius: 0.08
  });
  slide.addText("EXECUTIVE STRATEGY & SECURITY REVIEW", {
    x: 1.2, y: 1.2, w: 3.5, h: 0.35,
    fontSize: 9.5, bold: true, color: "93C5FD",
    align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  slide.addText("Cloud Database Evaluation:\nArchitecture, Anti-Hacking & Pricing", {
    x: 1.2, y: 1.7, w: 10.9, h: 1.4,
    fontSize: 32, bold: true, color: C.WHITE, fontFace: "Segoe UI", lineSpacingMultiple: 1.15
  });

  slide.addText("A Spaciously Structured Assessment of Supabase, MongoDB Atlas, Microsoft Azure, and Amazon AWS for Clients and Management", {
    x: 1.2, y: 3.25, w: 10.9, h: 0.5,
    fontSize: 13, color: "94A3B8", fontFace: "Segoe UI"
  });

  // 4 Horizontal Badges
  const pCards = [
    { name: "Supabase", tag: "Postgres BaaS", color: "3ECF8E", sub: "Built-in Auth, Storage & RLS", x: 1.2 },
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

  slide.addText("2026 Strategic Advisory Edition | Spacious Presentation Layout", {
    x: 1.2, y: 6.1, w: 10.9, h: 0.3,
    fontSize: 9.5, color: "64748B", align: "center", fontFace: "Segoe UI"
  });
}

// =========================================================================
// SLIDE 2: Platform Overview (Part 1: Supabase & MongoDB Atlas)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform Overview: Supabase & MongoDB Atlas", "Platform Overview (1/2)");

  const cards = [
    {
      name: "1. SUPABASE",
      role: "The Modern All-in-One Engine (PostgreSQL BaaS)",
      color: C.SUPABASE,
      x: 0.8,
      points: [
        { title: "CORE TECHNOLOGY", text: "Runs 100% pure standard PostgreSQL. Not a fork or emulation—fully compatible with any PostgreSQL tool or framework." },
        { title: "INCLUDED MODULES", text: "Provides built-in User Authentication (Google, Apple, Email), S3-compatible File Storage, and auto-generated REST & Realtime APIs." },
        { title: "DEVELOPMENT IMPACT", text: "Cuts backend development time by 40% to 60%. Eliminates the need to build custom login, token, and storage logic." },
        { title: "ZERO VENDOR LOCK-IN", text: "Client can export standard .sql database dumps at any time and migrate to AWS, Azure, or local hardware with zero friction." }
      ]
    },
    {
      name: "2. MONGODB ATLAS",
      role: "The Flexible Filing Cabinet (Document NoSQL)",
      color: C.MONGO,
      x: 6.8,
      points: [
        { title: "CORE TECHNOLOGY", text: "Stores records as rich, flexible JSON/BSON documents. Ideal for catalogs, product specs, and unstructured data streams." },
        { title: "DYNAMIC SCHEMA AGILITY", text: "No rigid tables or columns. Adding new fields or attributes never breaks existing database schemas or requires complex migrations." },
        { title: "BUILT-IN SEARCH ENGINE", text: "Includes full-text search with Apache Lucene built-in. Eliminates the cost and operational overhead of running a separate Elasticsearch cluster." },
        { title: "MULTI-CLOUD PORTABILITY", text: "Runs identically across Amazon AWS, Microsoft Azure, and Google Cloud with 1-click cloud migration." }
      ]
    }
  ];

  cards.forEach(c => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 0.9,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.name, {
      x: c.x + 0.3, y: 1.55, w: 5.133, h: 0.35,
      fontSize: 14, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });
    slide.addText(c.role, {
      x: c.x + 0.3, y: 1.92, w: 5.133, h: 0.3,
      fontSize: 10, color: "E2E8F0", fontFace: "Segoe UI"
    });

    c.points.forEach((p, idx) => {
      const boxY = 2.5 + (idx * 1.02);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: c.x + 0.25, y: boxY, w: 5.233, h: 0.9,
        fill: { color: C.PAGE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: p.title + "\n", options: { bold: true, fontSize: 8.5, color: c.color } },
        { text: p.text, options: { bold: false, fontSize: 9, color: C.MAIN } }
      ], {
        x: c.x + 0.4, y: boxY + 0.08, w: 4.933, h: 0.74,
        fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.15
      });
    });
  });

  addFooter(slide, 2);
}

// =========================================================================
// SLIDE 3: Platform Overview (Part 2: Microsoft Azure & Amazon AWS)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Platform Overview: Microsoft Azure & Amazon AWS", "Platform Overview (2/2)");

  const cards = [
    {
      name: "3. MICROSOFT AZURE",
      role: "The Corporate Suite (Enterprise SQL & Postgres)",
      color: C.AZURE,
      x: 0.8,
      points: [
        { title: "CORE TECHNOLOGY", text: "Azure SQL Database (flagship T-SQL engine) & Azure Database for PostgreSQL Flexible Server." },
        { title: "MICROSOFT ECOSYSTEM", text: "Seamless native connection to Microsoft 365, Excel spreadsheets, Power BI analytics dashboards, and C# / .NET." },
        { title: "LOW ENTRY COST", text: "Azure SQL Basic tier starts at only ~$4.99/month, making it the most affordable managed database for small business apps." },
        { title: "CORPORATE GOVERNANCE", text: "Native integration with Microsoft Entra ID (Active Directory) allows single-sign-on access using employee company credentials." }
      ]
    },
    {
      name: "4. AMAZON AWS",
      role: "The Industrial Powerhouse (RDS & DynamoDB)",
      color: C.AWS,
      x: 6.8,
      points: [
        { title: "CORE TECHNOLOGY", text: "Amazon RDS (managed PostgreSQL/MySQL) and Amazon DynamoDB (extreme throughput key-value NoSQL)." },
        { title: "UNMATCHED SCALE", text: "Proven global architecture capable of processing millions of transactions per second with single-digit millisecond response times." },
        { title: "ALWAYS-FREE DYNAMODB", text: "DynamoDB provides 25 GB of storage free forever (not just 12 months), handling up to 200 million requests monthly at $0." },
        { title: "ISOLATED DEFENSE", text: "Bank-grade Virtual Private Cloud (VPC) subnets isolate databases completely from the public internet." }
      ]
    }
  ];

  cards.forEach(c => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 0.9,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.name, {
      x: c.x + 0.3, y: 1.55, w: 5.133, h: 0.35,
      fontSize: 14, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });
    slide.addText(c.role, {
      x: c.x + 0.3, y: 1.92, w: 5.133, h: 0.3,
      fontSize: 10, color: "E2E8F0", fontFace: "Segoe UI"
    });

    c.points.forEach((p, idx) => {
      const boxY = 2.5 + (idx * 1.02);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: c.x + 0.25, y: boxY, w: 5.233, h: 0.9,
        fill: { color: C.PAGE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: p.title + "\n", options: { bold: true, fontSize: 8.5, color: c.color } },
        { text: p.text, options: { bold: false, fontSize: 9, color: C.MAIN } }
      ], {
        x: c.x + 0.4, y: boxY + 0.08, w: 4.933, h: 0.74,
        fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.15
      });
    });
  });

  addFooter(slide, 3);
}

// =========================================================================
// SLIDE 4: Architecture Flow (Part 1: Supabase & MongoDB Atlas)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Visual Architecture: Supabase & MongoDB Atlas", "Architecture Flow (1/2)");

  const flows = [
    {
      name: "1. SUPABASE ARCHITECTURE (Direct & All-in-One BaaS)",
      color: C.SUPABASE,
      step1T: "Client App", step1S: "Web / Mobile Interface",
      step2T: "API & Auth Gateway", step2S: "Kong + GoTrue + Storage",
      step3T: "PostgreSQL Engine", step3S: "Row-Level Security (RLS)",
      desc: "HOW IT WORKS: The client app talks directly to Supabase via secure HTTPS/WebSockets. The built-in Kong Gateway validates user identity, applies Row-Level Security, and returns data in milliseconds without needing a separate backend server.",
      y: 1.45
    },
    {
      name: "2. MONGODB ATLAS ARCHITECTURE (Multi-Cloud Auto-Replication)",
      color: C.MONGO,
      step1T: "Client App", step1S: "Web / Mobile Interface",
      step2T: "App Server API", step2S: "Node.js / Python / Java",
      step3T: "3-Node Replica Set", step3S: "Auto-copies data across 3 nodes",
      desc: "HOW IT WORKS: Applications connect through standard database drivers. Behind the scenes, MongoDB automatically replicates data across 3 separate server nodes. If a hardware failure occurs, a secondary node is elected primary in under 2 seconds.",
      y: 4.15
    }
  ];

  flows.forEach(f => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: f.y, w: CW, h: 2.55,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: f.y, w: CW, h: 0.42,
      fill: { color: f.color },
      line: { color: f.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(f.name, {
      x: 1.1, y: f.y + 0.06, w: 11.0, h: 0.3,
      fontSize: 11, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: f.y + 0.55, w: 2.6, h: 0.7,
      fill: { color: C.BLUE_BG },
      line: { color: C.BLUE_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: f.step1T + "\n", options: { bold: true, fontSize: 10, color: "1E40AF" } },
      { text: f.step1S, options: { bold: false, fontSize: 8.5, color: "3B82F6" } }
    ], {
      x: 1.1, y: f.y + 0.6, w: 2.6, h: 0.6,
      align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addText("➔", {
      x: 3.85, y: f.y + 0.55, w: 0.5, h: 0.7,
      fontSize: 20, bold: true, color: "94A3B8", align: "center", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 4.5, y: f.y + 0.55, w: 3.8, h: 0.7,
      fill: { color: C.PAGE },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: f.step2T + "\n", options: { bold: true, fontSize: 10, color: C.MAIN } },
      { text: f.step2S, options: { bold: false, fontSize: 8.5, color: C.MUTED } }
    ], {
      x: 4.5, y: f.y + 0.6, w: 3.8, h: 0.6,
      align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addText("➔", {
      x: 8.45, y: f.y + 0.55, w: 0.5, h: 0.7,
      fontSize: 20, bold: true, color: "94A3B8", align: "center", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.1, y: f.y + 0.55, w: 3.1, h: 0.7,
      fill: { color: "FEF3C7" },
      line: { color: "FCD34D", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: f.step3T + "\n", options: { bold: true, fontSize: 10, color: "92400E" } },
      { text: f.step3S, options: { bold: false, fontSize: 8.5, color: "B45309" } }
    ], {
      x: 9.1, y: f.y + 0.6, w: 3.1, h: 0.6,
      align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: f.y + 1.4, w: 11.1, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText(f.desc, {
      x: 1.3, y: f.y + 1.45, w: 10.7, h: 0.85,
      fontSize: 9.5, color: C.MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });
  });

  addFooter(slide, 4);
}

// =========================================================================
// SLIDE 5: Architecture Flow (Part 2: Microsoft Azure & Amazon AWS)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Visual Architecture: Microsoft Azure & Amazon AWS", "Architecture Flow (2/2)");

  const flows = [
    {
      name: "3. MICROSOFT AZURE ARCHITECTURE (Corporate Protected Network)",
      color: C.AZURE,
      step1T: "Enterprise Client", step1S: "Web / Office 365",
      step2T: "Azure Entra ID & Firewall", step2S: "Active Directory + IP Whitelisting",
      step3T: "Azure SQL Database", step3S: "Direct sync with Power BI & Excel",
      desc: "HOW IT WORKS: Applications connect through Azure's secure gateway using single-sign-on (SSO). Security policies, firewall rules, and encryption are applied centrally, with native connections feeding data into Power BI dashboards without third-party plugins.",
      y: 1.45
    },
    {
      name: "4. AMAZON AWS ARCHITECTURE (Enterprise Fortress & Extreme Scale)",
      color: C.AWS,
      step1T: "High-Traffic App", step1S: "Millions of Visitors",
      step2T: "VPC Gateway & IAM", step2S: "Private Subnet + Security Groups",
      step3T: "Amazon RDS / Dynamo", step3S: "SSD High IOPS Storage Cluster",
      desc: "HOW IT WORKS: The database resides inside an isolated private subnet with NO public internet IP address. Inbound traffic is strictly filtered by AWS Security Groups, and compute can scale dynamically to handle billions of requests.",
      y: 4.15
    }
  ];

  flows.forEach(f => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: f.y, w: CW, h: 2.55,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: f.y, w: CW, h: 0.42,
      fill: { color: f.color },
      line: { color: f.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(f.name, {
      x: 1.1, y: f.y + 0.06, w: 11.0, h: 0.3,
      fontSize: 11, bold: true, color: C.WHITE, fontFace: "Segoe UI"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: f.y + 0.55, w: 2.6, h: 0.7,
      fill: { color: C.BLUE_BG },
      line: { color: C.BLUE_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: f.step1T + "\n", options: { bold: true, fontSize: 10, color: "1E40AF" } },
      { text: f.step1S, options: { bold: false, fontSize: 8.5, color: "3B82F6" } }
    ], {
      x: 1.1, y: f.y + 0.6, w: 2.6, h: 0.6,
      align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addText("➔", {
      x: 3.85, y: f.y + 0.55, w: 0.5, h: 0.7,
      fontSize: 20, bold: true, color: "94A3B8", align: "center", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 4.5, y: f.y + 0.55, w: 3.8, h: 0.7,
      fill: { color: C.PAGE },
      line: { color: C.BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: f.step2T + "\n", options: { bold: true, fontSize: 10, color: C.MAIN } },
      { text: f.step2S, options: { bold: false, fontSize: 8.5, color: C.MUTED } }
    ], {
      x: 4.5, y: f.y + 0.6, w: 3.8, h: 0.6,
      align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addText("➔", {
      x: 8.45, y: f.y + 0.55, w: 0.5, h: 0.7,
      fontSize: 20, bold: true, color: "94A3B8", align: "center", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.1, y: f.y + 0.55, w: 3.1, h: 0.7,
      fill: { color: "FEF3C7" },
      line: { color: "FCD34D", width: 1 },
      rectRadius: 0.08
    });
    slide.addText([
      { text: f.step3T + "\n", options: { bold: true, fontSize: 10, color: "92400E" } },
      { text: f.step3S, options: { bold: false, fontSize: 8.5, color: "B45309" } }
    ], {
      x: 9.1, y: f.y + 0.6, w: 3.1, h: 0.6,
      align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.1, y: f.y + 1.4, w: 11.1, h: 0.95,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText(f.desc, {
      x: 1.3, y: f.y + 1.45, w: 10.7, h: 0.85,
      fontSize: 9.5, color: C.MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });
  });

  addFooter(slide, 5);
}

// =========================================================================
// SLIDE 6: Security Threat (Part 1: SQL Injection & Public Port Scanning)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Data Security in Hacker's Eye: Injections & Port Scanning", "Hacker Threat Landscape (1/2)");

  const threats = [
    {
      title: "THREAT 1: SQL INJECTION & DATA TAMPERING",
      attack: "HOW THE ATTACK WORKS:\nAttackers inject malicious SQL fragments (e.g. ' OR 1=1; DROP TABLE users;--) into website form inputs, search bars, or URL parameters. Unprotected backend code concatenates this input directly into database queries, giving the hacker full administrative control.",
      consequence: "POTENTIAL DAMAGE:\n• Total exfiltration of customer database tables, passwords, and PII.\n• Malicious deletion or corruption of financial transaction histories.\n• Regulatory fines (GDPR/HIPAA) exceeding $1M+.",
      x: 0.8
    },
    {
      title: "THREAT 2: PUBLIC PORT SCANNING & RANSOMWARE",
      attack: "HOW THE ATTACK WORKS:\nAutomated hacker botnets scan millions of public IP addresses on standard database ports: Port 5432 (PostgreSQL), Port 3306 (MySQL), and Port 27017 (MongoDB). Databases left accessible to '0.0.0.0/0' (all IPs) are probed for weak or default passwords.",
      consequence: "POTENTIAL DAMAGE:\n• Automated scripts wipe the database and leave a ransom note in under 15 minutes.\n• Stolen credentials sold on dark web forums.\n• Total loss of business continuity and client trust.",
      x: 6.8
    }
  ];

  threats.forEach(t => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.RED_BORDER, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: C.RED },
      line: { color: C.RED, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(t.title, {
      x: t.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 12, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x + 0.3, y: 2.35, w: 5.133, h: 2.0,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText(t.attack, {
      x: t.x + 0.5, y: 2.45, w: 4.733, h: 1.8,
      fontSize: 9.5, color: C.MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x + 0.3, y: 4.55, w: 5.133, h: 2.0,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText(t.consequence, {
      x: t.x + 0.5, y: 4.65, w: 4.733, h: 1.8,
      fontSize: 9.5, bold: false, color: "991B1B", fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });
  });

  addFooter(slide, 6);
}

// =========================================================================
// SLIDE 7: Security Threat (Part 2: Leaked Keys & Network Interception)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Data Security in Hacker's Eye: Leaked Keys & Eavesdropping", "Hacker Threat Landscape (2/2)");

  const threats = [
    {
      title: "THREAT 3: BROKEN AUTHORIZATION & LEAKED KEYS",
      attack: "HOW THE ATTACK WORKS:\nDevelopers frequently make the mistake of hardcoding database passwords, service role keys, or connection strings into mobile apps or frontend JavaScript files. Attackers inspect the page source code or decompile APKs to extract raw database credentials.",
      consequence: "POTENTIAL DAMAGE:\n• Attackers bypass all frontend login screens and query database tables directly.\n• Users can modify other users' profiles, balances, or private documents.\n• Mass breach without triggering standard login alerts.",
      x: 0.8
    },
    {
      title: "THREAT 4: NETWORK MAN-IN-THE-MIDDLE (EAVESDROPPING)",
      attack: "HOW THE ATTACK WORKS:\nWhen traffic between the application and database travels without strict SSL/TLS encryption, hackers sitting on public Wi-Fi networks, ISP routers, or compromised proxies capture unencrypted data packets using network packet sniffers (Wireshark).",
      consequence: "POTENTIAL DAMAGE:\n• Plaintext passwords, credit card numbers, and session tokens stolen in transit.\n• Attackers hijack live database sessions and inject fake data.\n• Silent ongoing surveillance of client data flows.",
      x: 6.8
    }
  ];

  threats.forEach(t => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.RED_BORDER, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: C.RED },
      line: { color: C.RED, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(t.title, {
      x: t.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 12, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x + 0.3, y: 2.35, w: 5.133, h: 2.0,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    slide.addText(t.attack, {
      x: t.x + 0.5, y: 2.45, w: 4.733, h: 1.8,
      fontSize: 9.5, color: C.MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: t.x + 0.3, y: 4.55, w: 5.133, h: 2.0,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    slide.addText(t.consequence, {
      x: t.x + 0.5, y: 4.65, w: 4.733, h: 1.8,
      fontSize: 9.5, bold: false, color: "991B1B", fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });
  });

  addFooter(slide, 7);
}

// =========================================================================
// SLIDE 8: Anti-Hacking Defenses (Part 1: Supabase & MongoDB Atlas)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Anti-Hacking Defenses: Supabase & MongoDB Atlas", "Cyber Defense (1/2)");

  const defenses = [
    {
      name: "1. SUPABASE ANTI-HACKING STACK",
      color: C.SUPABASE,
      x: 0.8,
      items: [
        { title: "Row-Level Security (RLS)", desc: "Database-level policy engine. Even if a hacker breaches an API endpoint, the Postgres engine enforces that User A can ONLY see their own rows. Cross-tenant leakage is mathematically impossible." },
        { title: "Cryptographic JWT Verification", desc: "Every database query requires a cryptographically signed JSON Web Token from the auth server. Anonymous and forged requests are dropped instantly at the gateway." },
        { title: "Zero Direct Port Exposure", desc: "Standard Postgres port 5432 is shielded from the public internet. All communication travels over encrypted HTTPS through the Kong API Gateway." },
        { title: "AES-256 Storage & Backup Encryption", desc: "Database files, WAL logs, and S3-compatible file storage buckets are fully encrypted at rest using AES-256 hardware encryption." }
      ]
    },
    {
      name: "2. MONGODB ATLAS ANTI-HACKING STACK",
      color: C.MONGO,
      x: 6.8,
      items: [
        { title: "Client-Side Field Level Encryption (CSFLE)", desc: "Sensitive data (credit cards, SSNs) is encrypted in client memory BEFORE transmission. Data arrives at the database encrypted; even MongoDB database administrators cannot view plaintext." },
        { title: "Default IP Whitelisting", desc: "Atlas rejects 100% of external connection requests by default. The database cannot be reached unless the client's static IP is explicitly registered in the firewall." },
        { title: "Enforced TLS 1.3 Encryption", desc: "All connections must negotiate TLS 1.3 with modern ciphers. Plaintext connections or older deprecated SSL protocols are rejected." },
        { title: "Granular Role-Based Access (RBAC)", desc: "Database users receive fine-grained permissions (read-only, write-specific collections) rather than broad administrative access." }
      ]
    }
  ];

  defenses.forEach(d => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: d.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: d.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: d.color },
      line: { color: d.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(d.name, {
      x: d.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 12, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    d.items.forEach((item, idx) => {
      const boxY = 2.3 + (idx * 1.12);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: d.x + 0.25, y: boxY, w: 5.233, h: 1.0,
        fill: { color: C.PAGE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: "✔  " + item.title + "\n", options: { bold: true, fontSize: 9.5, color: d.color } },
        { text: item.desc, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
      ], {
        x: d.x + 0.4, y: boxY + 0.08, w: 4.933, h: 0.84,
        fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.15
      });
    });
  });

  addFooter(slide, 8);
}

// =========================================================================
// SLIDE 9: Anti-Hacking Defenses (Part 2: Microsoft Azure & Amazon AWS)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Anti-Hacking Defenses: Microsoft Azure & Amazon AWS", "Cyber Defense (2/2)");

  const defenses = [
    {
      name: "3. MICROSOFT AZURE ANTI-HACKING STACK",
      color: C.AZURE,
      x: 0.8,
      items: [
        { title: "Microsoft Defender for Cloud AI", desc: "Machine-learning behavioral engine constantly monitors database queries. Flags abnormal query volumes, brute-force attempts, and SQL injection probes in real-time." },
        { title: "Entra ID (Active Directory) MFA", desc: "Eliminates database passwords entirely. Engineers and services authenticate using short-lived Azure tokens backed by Multi-Factor Authentication." },
        { title: "Always Encrypted Technology", desc: "Protects sensitive data at rest, during network transit, and even while active inside server RAM chips from virtualization or memory-dump attacks." },
        { title: "Azure Private Link", desc: "Connects client apps to the database via private endpoints, completely bypassing the public internet across Microsoft's global fiber backbone." }
      ]
    },
    {
      name: "4. AMAZON AWS ANTI-HACKING STACK",
      color: C.AWS,
      x: 6.8,
      items: [
        { title: "VPC Private Subnet Isolation", desc: "Database has NO public IP address. It resides in a mathematically isolated private subnet reachable ONLY by verified internal application servers." },
        { title: "IAM Database Authentication", desc: "Replaces database passwords with temporary 15-minute cryptographically signed tokens generated by AWS IAM, completely preventing credential theft." },
        { title: "AWS KMS Hardware Security Modules", desc: "Encryption keys are managed by dedicated hardware (FIPS 140-2 Level 3). Keys automatically rotate; raw data is unreadable if physical drives are seized." },
        { title: "GuardDuty & CloudTrail Auditing", desc: "Immutable tamper-proof logs record every single connection and configuration change with automated alerts on suspicious activity." }
      ]
    }
  ];

  defenses.forEach(d => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: d.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: d.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: d.color },
      line: { color: d.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(d.name, {
      x: d.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 12, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    d.items.forEach((item, idx) => {
      const boxY = 2.3 + (idx * 1.12);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: d.x + 0.25, y: boxY, w: 5.233, h: 1.0,
        fill: { color: C.PAGE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: "✔  " + item.title + "\n", options: { bold: true, fontSize: 9.5, color: d.color } },
        { text: item.desc, options: { bold: false, fontSize: 8.5, color: C.MAIN } }
      ], {
        x: d.x + 0.4, y: boxY + 0.08, w: 4.933, h: 0.84,
        fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.15
      });
    });
  });

  addFooter(slide, 9);
}

// =========================================================================
// SLIDE 10: Master Security Checklist for Clients (Spacious 3 Columns)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Anti-Hacking Checklist: Mandatory Controls We Implement", "Security Implementation");

  const cols = [
    {
      title: "1. NETWORK DEFENSE",
      color: "1D4ED8",
      x: 0.8,
      items: [
        { title: "Strict IP Whitelisting", desc: "Block 100% of public internet; permit only verified client application server IPs." },
        { title: "Enforced TLS 1.3 / SSL", desc: "Mandate end-to-end encrypted transit with modern ciphers; reject unencrypted connections." },
        { title: "Private VPC Peering", desc: "Route database traffic through dedicated private subnets with zero external exposure." }
      ]
    },
    {
      title: "2. DATA DEFENSE",
      color: "059669",
      x: 4.8,
      items: [
        { title: "Row-Level Security (RLS)", desc: "Enforce strict tenant data separation directly inside the database engine." },
        { title: "Parameterized Queries", desc: "Zero dynamic SQL concatenation; completely eliminate SQL injection vulnerability." },
        { title: "AES-256 Storage Encryption", desc: "Automate hardware-accelerated encryption for data at rest and all backups." }
      ]
    },
    {
      title: "3. ACCESS DEFENSE",
      color: "D97706",
      x: 8.8,
      items: [
        { title: "Least Privilege Access", desc: "Apps use restricted accounts; master passwords are never stored in source code." },
        { title: "Multi-Factor Auth (MFA)", desc: "Mandatory hardware key / authenticator MFA for all engineers accessing consoles." },
        { title: "Automated Daily Backups", desc: "Encrypted point-in-time recovery copies stored across separate geographic zones." }
      ]
    }
  ];

  cols.forEach(c => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 3.733, h: 4.6,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

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

    c.items.forEach((item, idx) => {
      const itemY = 2.15 + (idx * 1.25);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: c.x + 0.2, y: itemY, w: 3.333, h: 1.1,
        fill: { color: C.PAGE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: "✔  " + item.title + "\n", options: { bold: true, fontSize: 9.5, color: C.MAIN } },
        { text: item.desc, options: { bold: false, fontSize: 8.5, color: C.MUTED } }
      ], {
        x: c.x + 0.35, y: itemY + 0.1, w: 3.033, h: 0.9,
        fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.18
      });
    });
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 6.2, w: CW, h: 0.55,
    fill: { color: C.BLUE_BG },
    line: { color: C.BLUE_BORDER, width: 1 },
    rectRadius: 0.08
  });
  slide.addText("CLIENT SECURITY GUARANTEE: With these 9 controls configured, database assets fully satisfy SOC 2, HIPAA, and GDPR standards.", {
    x: 0.8, y: 6.2, w: CW, h: 0.55,
    fontSize: 9.5, bold: true, color: "1E40AF", align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  addFooter(slide, 10);
}

// =========================================================================
// SLIDE 11: Pricing & Storage Comparison (Part 1: Supabase & MongoDB Atlas)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Pricing & Capacity: Supabase vs. MongoDB Atlas", "Pricing & Storage (1/2)");

  const cards = [
    {
      name: "SUPABASE PRICING BREAKDOWN",
      color: C.SUPABASE,
      x: 0.8,
      tiers: [
        { name: "FREE TIER ($0 / Month)", desc: "• 500 MB database storage included free forever.\n• Supports up to 50,000 Monthly Active Users (MAU).\n• 5 GB file storage & 5 GB bandwidth included.\n• Zero credit card required to sign up." },
        { name: "PRO PLAN ($25 / Month)", desc: "• 8 GB database storage included (auto-expands at $0.125/GB).\n• Up to 100,000 Monthly Active Users included.\n• 100 GB file storage & 250 GB bandwidth included.\n• Daily automated backups; compute never pauses." },
        { name: "TEAM TIER ($599 / Month)", desc: "• Priority support, SOC2 compliance, custom SLA, and team roles." }
      ]
    },
    {
      name: "MONGODB ATLAS PRICING BREAKDOWN",
      color: C.MONGO,
      x: 6.8,
      tiers: [
        { name: "FREE M0 SANDBOX ($0 / Month)", desc: "• 512 MB storage free forever (shared RAM/CPU).\n• Up to ~15,000 active users; 500 concurrent connections.\n• Includes built-in full-text search engine.\n• Zero credit card required to start." },
        { name: "SHARED CLUSTER M2/M5 ($9 – $25 / Month)", desc: "• 2 GB to 5 GB storage with automated daily backups.\n• Up to ~100,000 active users; 1,500 connections.\n• Great for staging environments and growing stores." },
        { name: "DEDICATED M10+ ($57 – $400+ / Month)", desc: "• 10 GB to 4 TB NVMe SSD; dedicated CPU/RAM, VPC peering." }
      ]
    }
  ];

  cards.forEach(c => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.name, {
      x: c.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 12, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    c.tiers.forEach((t, idx) => {
      const boxY = 2.3 + (idx * 1.45);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: c.x + 0.25, y: boxY, w: 5.233, h: 1.35,
        fill: { color: C.PAGE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: t.name + "\n", options: { bold: true, fontSize: 10, color: c.color } },
        { text: t.desc, options: { bold: false, fontSize: 8.8, color: C.MAIN } }
      ], {
        x: c.x + 0.4, y: boxY + 0.1, w: 4.933, h: 1.15,
        fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.18
      });
    });
  });

  addFooter(slide, 11);
}

// =========================================================================
// SLIDE 12: Pricing & Storage Comparison (Part 2: Microsoft Azure & Amazon AWS)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Pricing & Capacity: Microsoft Azure vs. Amazon AWS", "Pricing & Storage (2/2)");

  const cards = [
    {
      name: "MICROSOFT AZURE PRICING BREAKDOWN",
      color: C.AZURE,
      x: 0.8,
      tiers: [
        { name: "FREE TIER ($0 / Month)", desc: "• 32 GB storage free for 12 months (or 100,000 vCore-sec free/mo on Azure SQL Serverless).\n• Good for ~25,000 active users with auto-pause." },
        { name: "AZURE SQL BASIC ($4.99 / Month)", desc: "• 2 GB storage limit, 5 DTU performance.\n• Most affordable managed cloud database for internal office tools." },
        { name: "STANDARD & HYPERSCALE ($15 – $250+ / Month)", desc: "• 250 GB storage in Standard tier ($15/mo).\n• Auto-scales up to 100 TB on Hyperscale for enterprise apps." }
      ]
    },
    {
      name: "AMAZON AWS PRICING BREAKDOWN",
      color: C.AWS,
      x: 6.8,
      tiers: [
        { name: "FREE TIER (12 MONTHS RDS / ALWAYS DYNAMODB)", desc: "• RDS: 20 GB free for 12 months on db.t4g.micro (~20,000 users).\n• DynamoDB: 25 GB free forever with 200M requests/month ($0)." },
        { name: "RDS ENTRY PRODUCTION ($15 – $35 / Month)", desc: "• 20 GB to 100 GB SSD storage, 2 vCPU, 2 GB RAM.\n• Handles 50,000 to 150,000 active users easily." },
        { name: "MULTI-AZ HIGH AVAILABILITY ($150 – $350+ / Month)", desc: "• Redundant dual-server failover across data centers for banking/enterprise." }
      ]
    }
  ];

  cards.forEach(c => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.name, {
      x: c.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 12, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    c.tiers.forEach((t, idx) => {
      const boxY = 2.3 + (idx * 1.45);
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: c.x + 0.25, y: boxY, w: 5.233, h: 1.35,
        fill: { color: C.PAGE },
        line: { color: "E2E8F0", width: 1 },
        rectRadius: 0.08
      });

      slide.addText([
        { text: t.name + "\n", options: { bold: true, fontSize: 10, color: c.color } },
        { text: t.desc, options: { bold: false, fontSize: 8.8, color: C.MAIN } }
      ], {
        x: c.x + 0.4, y: boxY + 0.1, w: 4.933, h: 1.15,
        fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.18
      });
    });
  });

  addFooter(slide, 12);
}

// =========================================================================
// SLIDE 13: Advantages & Disadvantages (Part 1: Supabase & MongoDB)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Advantages & Disadvantages: Supabase vs. MongoDB Atlas", "Trade-Off Analysis (1/2)");

  const cards = [
    {
      name: "1. SUPABASE PROS & CONS",
      color: C.SUPABASE,
      x: 0.8,
      pros: [
        "Zero infrastructure setup; deployment in under 2 minutes.",
        "User Auth, File Storage, and auto REST APIs included.",
        "No credit card required for the 500 MB Free Tier.",
        "Real standard PostgreSQL; zero developer vendor lock-in."
      ],
      cons: [
        "Free tier projects pause after 7 days of inactivity (takes 15s to resume).",
        "High bandwidth egress incurs extra usage fees on heavy file apps.",
        "Younger ecosystem compared to 15-year established clouds."
      ]
    },
    {
      name: "2. MONGODB ATLAS PROS & CONS",
      color: C.MONGO,
      x: 6.8,
      pros: [
        "Complete schema flexibility; JSON documents never require table migrations.",
        "Built-in full-text search eliminates costly Elasticsearch clusters.",
        "Automated 3-server replication provides zero-downtime failover.",
        "Runs multi-cloud across AWS, Azure, and Google Cloud."
      ],
      cons: [
        "Dedicated production instances start at $57/month.",
        "Inefficient for strict relational data requiring complex multi-table SQL JOINs.",
        "High memory consumption if document indexes are not carefully designed."
      ]
    }
  ];

  cards.forEach(c => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.name, {
      x: c.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 12, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x + 0.25, y: 2.3, w: 5.233, h: 2.1,
      fill: { color: "F0FDF4" },
      line: { color: "BBF7D0", width: 1 },
      rectRadius: 0.08
    });
    const proRuns = [{ text: "✔  KEY ADVANTAGES:\n", options: { bold: true, fontSize: 9.5, color: "15803D" } }];
    c.pros.forEach((p, idx) => {
      proRuns.push({ text: `• ${p}${idx < c.pros.length - 1 ? "\n" : ""}`, options: { bold: false, fontSize: 8.8, color: C.MAIN } });
    });
    slide.addText(proRuns, {
      x: c.x + 0.45, y: 2.4, w: 4.833, h: 1.9,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.2
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x + 0.25, y: 4.55, w: 5.233, h: 2.0,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    const conRuns = [{ text: "✖  KEY DISADVANTAGES:\n", options: { bold: true, fontSize: 9.5, color: C.RED } }];
    c.cons.forEach((con, idx) => {
      conRuns.push({ text: `• ${con}${idx < c.cons.length - 1 ? "\n" : ""}`, options: { bold: false, fontSize: 8.8, color: C.MUTED } });
    });
    slide.addText(conRuns, {
      x: c.x + 0.45, y: 4.65, w: 4.833, h: 1.8,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.2
    });
  });

  addFooter(slide, 13);
}

// =========================================================================
// SLIDE 14: Advantages & Disadvantages (Part 2: Azure & AWS)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Advantages & Disadvantages: Microsoft Azure vs. Amazon AWS", "Trade-Off Analysis (2/2)");

  const cards = [
    {
      name: "3. MICROSOFT AZURE PROS & CONS",
      color: C.AZURE,
      x: 0.8,
      pros: [
        "Lowest entry cost in cloud ($4.99/mo Basic tier for small business).",
        "Direct synchronization with Power BI, Excel, and Office 365.",
        "Active Directory enterprise single sign-on security.",
        "Serverless tier pauses during off-hours, lowering development bills."
      ],
      cons: [
        "Basic plan has a strict 2 GB storage limit.",
        "Azure Portal has a steep navigation learning curve for newcomers.",
        "High-performance vCore tiers become expensive without multi-year commitments."
      ]
    },
    {
      name: "4. AMAZON AWS PROS & CONS",
      color: C.AWS,
      x: 6.8,
      pros: [
        "DynamoDB provides 25 GB free forever with single-digit millisecond latency.",
        "Proven 99.999% global reliability trusted by the world's largest banks.",
        "Virtually unlimited compute and storage auto-scaling capacity.",
        "Bank-grade Virtual Private Cloud (VPC) isolated network architecture."
      ],
      cons: [
        "Requires dedicated DevOps / Cloud Engineers to configure and manage.",
        "High risk of unexpected billing spikes from IOPS and data egress.",
        "No built-in user authentication or auto-generated REST APIs."
      ]
    }
  ];

  cards.forEach(c => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: C.BORDER, width: 1.2 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: c.color },
      line: { color: c.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(c.name, {
      x: c.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 12, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x + 0.25, y: 2.3, w: 5.233, h: 2.1,
      fill: { color: "F0F9FF" },
      line: { color: "BAE6FD", width: 1 },
      rectRadius: 0.08
    });
    const proRuns = [{ text: "✔  KEY ADVANTAGES:\n", options: { bold: true, fontSize: 9.5, color: "0369A1" } }];
    c.pros.forEach((p, idx) => {
      proRuns.push({ text: `• ${p}${idx < c.pros.length - 1 ? "\n" : ""}`, options: { bold: false, fontSize: 8.8, color: C.MAIN } });
    });
    slide.addText(proRuns, {
      x: c.x + 0.45, y: 2.4, w: 4.833, h: 1.9,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.2
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: c.x + 0.25, y: 4.55, w: 5.233, h: 2.0,
      fill: { color: C.RED_BG },
      line: { color: C.RED_BORDER, width: 1 },
      rectRadius: 0.08
    });
    const conRuns = [{ text: "✖  KEY DISADVANTAGES:\n", options: { bold: true, fontSize: 9.5, color: C.RED } }];
    c.cons.forEach((con, idx) => {
      conRuns.push({ text: `• ${con}${idx < c.cons.length - 1 ? "\n" : ""}`, options: { bold: false, fontSize: 8.8, color: C.MUTED } });
    });
    slide.addText(conRuns, {
      x: c.x + 0.45, y: 4.65, w: 4.833, h: 1.8,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.2
    });
  });

  addFooter(slide, 14);
}

// =========================================================================
// SLIDE 15: Strategic Recommendations (Part 1: Startups & E-Commerce)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Client Advisory: Startups, MVPs & E-Commerce", "Client Strategy (1/2)");

  const recs = [
    {
      scenario: "CLIENT SCENARIO 1: STARTUP, MVP OR NEW SAAS APP",
      rec: "WE STRONGLY RECOMMEND: SUPABASE",
      color: C.SUPABASE,
      bg: C.SUPABASE_BG,
      x: 0.8,
      why: [
        "Accelerates Delivery: Built-in User Auth, Image/File Storage, and REST APIs save 4 to 6 weeks of initial backend engineering.",
        "Zero Initial Cost: Client starts at $0 with 50,000 active users and 500 MB storage. Smooth step to flat $25/mo when product gains traction.",
        "Future-Proof Architecture: Powered by pure standard PostgreSQL. If the client expands into enterprise scale, their data moves seamlessly with 0 lock-in."
      ]
    },
    {
      scenario: "CLIENT SCENARIO 2: E-COMMERCE, STORE CATALOGS & MEDIA",
      rec: "WE STRONGLY RECOMMEND: MONGODB ATLAS",
      color: C.MONGO,
      bg: C.MONGO_BG,
      x: 6.8,
      why: [
        "Flexible Product Attributes: Electronics, clothing, and groceries have completely different specifications. JSON documents handle this without table redesigns.",
        "All-in-One Search: Built-in search engine eliminates the cost and complexity of setting up and paying for an external Elasticsearch service.",
        "Zero-Downtime Guarantee: Automated 3-server replica cluster guarantees store checkout never goes offline even during physical server failures."
      ]
    }
  ];

  recs.forEach(r => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: r.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: r.color, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: r.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: r.color },
      line: { color: r.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(r.scenario, {
      x: r.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 10.5, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: r.x + 0.3, y: 2.35, w: 5.133, h: 0.55,
      fill: { color: r.bg },
      line: { color: r.color, width: 1.2 },
      rectRadius: 0.08
    });
    slide.addText(r.rec, {
      x: r.x + 0.3, y: 2.35, w: 5.133, h: 0.55,
      fontSize: 11, bold: true, color: r.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: r.x + 0.3, y: 3.1, w: 5.133, h: 3.45,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    const whyRuns = [{ text: "WHY WE PROPOSE THIS TO THE CLIENT:\n\n", options: { bold: true, fontSize: 10, color: C.NAVY } }];
    r.why.forEach(w => {
      whyRuns.push({ text: `• ${w}\n\n`, options: { bold: false, fontSize: 9.2, color: C.MAIN } });
    });
    slide.addText(whyRuns, {
      x: r.x + 0.5, y: 3.25, w: 4.733, h: 3.15,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.2
    });
  });

  addFooter(slide, 15);
}

// =========================================================================
// SLIDE 16: Strategic Recommendations (Part 2: Corporate & Large Scale)
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Client Advisory: Corporate & Large-Scale Scale", "Client Strategy (2/2)");

  const recs = [
    {
      scenario: "CLIENT SCENARIO 3: ENTERPRISE CORPORATE & .NET",
      rec: "WE STRONGLY RECOMMEND: MICROSOFT AZURE",
      color: C.AZURE,
      bg: C.AZURE_BG,
      x: 0.8,
      why: [
        "Enterprise Ecosystem: Direct native integration with Active Directory (Entra ID), C# .NET frameworks, and Power BI dashboards.",
        "Budget-Friendly Entry: Azure SQL Basic tier ($4.99/mo) provides full corporate compliance at minimal cost for internal office portals.",
        "Built-in Enterprise Compliance: Pre-packaged with HIPAA, SOC 1/2, and ISO regulatory certifications meeting strict corporate audits."
      ]
    },
    {
      scenario: "CLIENT SCENARIO 4: HIGH-SCALE ENTERPRISE & IOT",
      rec: "WE STRONGLY RECOMMEND: AMAZON AWS",
      color: C.AWS,
      bg: C.AWS_BG,
      x: 6.8,
      why: [
        "Uncapped Global Scalability: DynamoDB and RDS Multi-AZ effortlessly handle millions of concurrent transactions with single-digit millisecond response times.",
        "Always-Free Tier Value: DynamoDB provides 25 GB free storage forever with zero maintenance overhead.",
        "Bank-Grade Security: VPC private subnet isolation guarantees the database is completely invisible to public internet scanners."
      ]
    }
  ];

  recs.forEach(r => {
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: r.x, y: 1.45, w: 5.733, h: 5.3,
      fill: { color: C.CARD },
      line: { color: r.color, width: 1.5 },
      rectRadius: 0.12
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: r.x, y: 1.45, w: 5.733, h: 0.7,
      fill: { color: r.color },
      line: { color: r.color, width: 1 },
      rectRadius: 0.12
    });
    slide.addText(r.scenario, {
      x: r.x + 0.3, y: 1.45, w: 5.133, h: 0.7,
      fontSize: 10.5, bold: true, color: C.WHITE, fontFace: "Segoe UI", valign: "middle"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: r.x + 0.3, y: 2.35, w: 5.133, h: 0.55,
      fill: { color: r.bg },
      line: { color: r.color, width: 1.2 },
      rectRadius: 0.08
    });
    slide.addText(r.rec, {
      x: r.x + 0.3, y: 2.35, w: 5.133, h: 0.55,
      fontSize: 11, bold: true, color: r.color, align: "center", valign: "middle", fontFace: "Segoe UI"
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: r.x + 0.3, y: 3.1, w: 5.133, h: 3.45,
      fill: { color: C.PAGE },
      line: { color: "E2E8F0", width: 1 },
      rectRadius: 0.08
    });
    const whyRuns = [{ text: "WHY WE PROPOSE THIS TO THE CLIENT:\n\n", options: { bold: true, fontSize: 10, color: C.NAVY } }];
    r.why.forEach(w => {
      whyRuns.push({ text: `• ${w}\n\n`, options: { bold: false, fontSize: 9.2, color: C.MAIN } });
    });
    slide.addText(whyRuns, {
      x: r.x + 0.5, y: 3.25, w: 4.733, h: 3.15,
      fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.2
    });
  });

  addFooter(slide, 16);
}

// =========================================================================
// SLIDE 17: Executive Summary & The 60-Second Client Pitch
// =========================================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: C.PAGE };
  addHeader(slide, "Executive Summary: The 60-Second Client Pitch", "Executive Pitch");

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 1.45, w: CW, h: 1.5,
    fill: { color: C.BLUE_BG },
    line: { color: C.BLUE, width: 2 },
    rectRadius: 0.12
  });

  slide.addText([
    { text: "THE WINNING RECOMMENDATION FOR 80% OF NEW CLIENT PROJECTS:\n", options: { bold: true, fontSize: 10.5, color: "1D4ED8" } },
    { text: "\"Start with SUPABASE: It delivers the fastest time-to-market, costs $0 to build, and offers a predictable flat $25/month price with zero vendor lock-in.\"", options: { bold: true, fontSize: 13.5, color: C.NAVY, italic: true } }
  ], {
    x: 1.1, y: 1.6, w: 11.133, h: 1.2,
    fontFace: "Segoe UI", valign: "top", lineSpacingMultiple: 1.2
  });

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
      fill: { color: C.CARD },
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
      fontSize: 9.5, color: C.MAIN, fontFace: "Segoe UI", lineSpacingMultiple: 1.2
    });
  });

  slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.8, y: 6.15, w: CW, h: 0.65,
    fill: { color: C.NAVY },
    line: { color: C.NAVY, width: 1 },
    rectRadius: 0.1
  });
  slide.addText("ACTIONABLE NEXT STEP: Deploy a 7-day Proof of Concept (POC) on Supabase Free Tier at zero cost to validate client requirements.", {
    x: 1.0, y: 6.15, w: 11.333, h: 0.65,
    fontSize: 10, bold: true, color: C.WHITE, align: "center", valign: "middle", fontFace: "Segoe UI"
  });

  addFooter(slide, 17);
}

// Generate Presentation
const fileName = "Cloud_Database_Executive_Perfect_16x9.pptx";
pptx.writeFile({ fileName: fileName })
  .then(() => {
    console.log(`Presentation generated with true 16x9 layout: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating presentation:", err);
  });
