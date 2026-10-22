const { chromium } = require('playwright-chromium');
const path = require('path');
const fs = require('fs');

async function captureAllPages() {
  const outDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Use installed Edge executable
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  console.log('--- 1. Capturing HOME PAGE (Full Page & Major Sections) ---');
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1.1 Complete full-page long screenshot
  await page.screenshot({ path: path.join(outDir, '01_home_complete_fullpage.png'), fullPage: true });
  console.log('Captured 01_home_complete_fullpage.png');

  // 1.2 Hero Viewport (Above the fold)
  await page.screenshot({ path: path.join(outDir, '02_home_hero_viewport.png'), fullPage: false });
  console.log('Captured 02_home_hero_viewport.png');

  // 1.3 Find Turfs & Top Venues section
  const turfsSec = await page.$('#popular-turfs');
  if (turfsSec) {
    await turfsSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '03_find_turfs_section.png'), fullPage: false });
    console.log('Captured 03_find_turfs_section.png');
  }

  // 1.4 How It Works (4 Steps) & Owner Peach Card
  const howSec = await page.$('#how-it-works-section');
  if (howSec) {
    await howSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '04_how_it_works_steps.png'), fullPage: false });
    console.log('Captured 04_how_it_works_steps.png');
  }

  // 1.5 Interactive Booking Modal
  const bookBtn = await page.$('.btn-card-book');
  if (bookBtn) {
    await bookBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '05_booking_modal.png'), fullPage: false });
    console.log('Captured 05_booking_modal.png');
    // Close modal
    await page.click('#btn-close-booking');
    await page.waitForTimeout(400);
  }

  // 1.6 Turf Owner Registration Modal
  const ownerBtn = await page.$('#btn-hero-owner');
  if (ownerBtn) {
    await ownerBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '06_owner_registration_modal.png'), fullPage: false });
    console.log('Captured 06_owner_registration_modal.png');
    // Close modal
    await page.click('#btn-close-owner');
    await page.waitForTimeout(400);
  }

  // 1.7 Login / OTP Authentication Modal
  const loginBtn = await page.$('#btn-open-login');
  if (loginBtn) {
    await loginBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '07_login_auth_modal.png'), fullPage: false });
    console.log('Captured 07_login_auth_modal.png');
    // Close modal
    await page.click('#btn-close-auth');
    await page.waitForTimeout(400);
  }

  console.log('--- 2. Capturing ABOUT US PAGE (Full Page & Key Sections) ---');
  await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 2.1 Complete full-page long screenshot
  await page.screenshot({ path: path.join(outDir, '08_about_complete_fullpage.png'), fullPage: true });
  console.log('Captured 08_about_complete_fullpage.png');

  // 2.2 About Hero & Stats Bar
  await page.screenshot({ path: path.join(outDir, '09_about_hero_stats.png'), fullPage: false });
  console.log('Captured 09_about_hero_stats.png');

  // 2.3 Two-sided platform (For Turf Owners vs For Players)
  const roleCards = await page.$('.platform-two-sided-row');
  if (roleCards) {
    await roleCards.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '10_about_owners_and_players_cards.png'), fullPage: false });
    console.log('Captured 10_about_owners_and_players_cards.png');
  }

  await browser.close();
  console.log('✅ ALL 10 Screenshots captured and saved successfully!');
}

captureAllPages().catch(err => {
  console.error('Error capturing all pages:', err);
  process.exit(1);
});
