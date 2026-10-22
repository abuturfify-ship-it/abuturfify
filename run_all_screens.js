const { chromium } = require('playwright-chromium');
const path = require('path');
const fs = require('fs');

async function capture() {
  const outDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });

  const page = await context.newPage();

  // 1. Home Complete Full Page (Top to bottom)
  console.log('Capturing Home full page...');
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '01_home_complete_fullpage.png'), fullPage: true });

  // 2. Home Hero Viewport
  await page.screenshot({ path: path.join(outDir, '02_home_hero.png'), fullPage: false });

  // 3. Find Turfs & Popular Venues Grid
  const turfsSec = await page.$('#popular-turfs');
  if (turfsSec) {
    await turfsSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '03_find_turfs_section.png'), fullPage: false });
  }

  // 4. How It Works (4 Steps) & Turf Owner Card
  const howSec = await page.$('#how-it-works-section');
  if (howSec) {
    await howSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '04_how_it_works_section.png'), fullPage: false });
  }

  // 5. Booking Modal
  const bookBtn = await page.$('.btn-card-book');
  if (bookBtn) {
    await bookBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '05_booking_modal.png'), fullPage: false });
  }

  // 6. About Page Complete Full Page (Top to bottom)
  console.log('Capturing About full page...');
  await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, '06_about_complete_fullpage.png'), fullPage: true });

  // 7. About Hero & Stats Bar
  await page.screenshot({ path: path.join(outDir, '07_about_hero.png'), fullPage: false });

  // 8. About Two-Sided Platform (Owners vs Players)
  const roleCards = await page.$('.platform-two-sided-row');
  if (roleCards) {
    await roleCards.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, '08_about_owners_and_players.png'), fullPage: false });
  }

  await browser.close();
  console.log('All screenshots completed successfully!');
}

capture().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
