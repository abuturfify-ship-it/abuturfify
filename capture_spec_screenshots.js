const { chromium } = require('playwright-chromium');
const path = require('path');
const fs = require('fs');

async function captureSpecScreens() {
  const outDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  // 1. Home Page Elements
  await page.goto('file:///' + path.join(__dirname, 'index.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // Search Bar
  const searchBar = await page.$('.search-pill-card');
  if (searchBar) {
    await searchBar.screenshot({ path: path.join(outDir, 'comp_search_bar.png') });
    console.log('Saved comp_search_bar.png');
  }

  // Sports Pills
  const sportsRow = await page.$('.sports-pill-grid');
  if (sportsRow) {
    await sportsRow.screenshot({ path: path.join(outDir, 'comp_sports_pills.png') });
    console.log('Saved comp_sports_pills.png');
  }

  // Turf Card
  const turfCard = await page.$('.turf-listing-card');
  if (turfCard) {
    await turfCard.screenshot({ path: path.join(outDir, 'comp_turf_card.png') });
    console.log('Saved comp_turf_card.png');
  }

  // Booking Modal with selected slot
  const bookBtn = await page.$('.btn-card-book');
  if (bookBtn) {
    await bookBtn.click();
    await page.waitForTimeout(400);
    // select a slot
    const slot = await page.$('.slot-btn:not(.booked)');
    if (slot) await slot.click();
    await page.waitForTimeout(300);
    const modalContent = await page.$('#modal-booking .modal-card');
    if (modalContent) {
      await modalContent.screenshot({ path: path.join(outDir, 'comp_booking_modal.png') });
      console.log('Saved comp_booking_modal.png');
    }
    await page.click('#btn-close-booking');
    await page.waitForTimeout(300);
  }

  // Auth Modal
  const loginBtn = await page.$('#btn-open-login');
  if (loginBtn) {
    await loginBtn.click();
    await page.waitForTimeout(400);
    const authModal = await page.$('#modal-auth .modal-card');
    if (authModal) {
      await authModal.screenshot({ path: path.join(outDir, 'comp_auth_modal.png') });
      console.log('Saved comp_auth_modal.png');
    }
    await page.click('#btn-close-auth');
    await page.waitForTimeout(300);
  }

  // Owner Register Modal
  const ownerRegBtn = await page.$('#btn-hero-owner');
  if (ownerRegBtn) {
    await ownerRegBtn.click();
    await page.waitForTimeout(400);
    const ownerModal = await page.$('#modal-owner .modal-card');
    if (ownerModal) {
      await ownerModal.screenshot({ path: path.join(outDir, 'comp_owner_modal.png') });
      console.log('Saved comp_owner_modal.png');
    }
    await page.click('#btn-close-owner');
    await page.waitForTimeout(300);
  }

  // 2. Player Dashboard Elements
  await page.goto('file:///' + path.join(__dirname, 'player-dashboard.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const heroMatch = await page.$('.hero-match-card');
  if (heroMatch) {
    await heroMatch.screenshot({ path: path.join(outDir, 'comp_player_hero_match.png') });
    console.log('Saved comp_player_hero_match.png');
  }

  // 3. Owner Dashboard Elements
  await page.goto('file:///' + path.join(__dirname, 'owner-dashboard.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const metricsGrid = await page.$('.metrics-grid');
  if (metricsGrid) {
    await metricsGrid.screenshot({ path: path.join(outDir, 'comp_owner_metrics.png') });
    console.log('Saved comp_owner_metrics.png');
  }

  const slotMatrix = await page.$('.slots-matrix-container');
  if (slotMatrix) {
    await slotMatrix.screenshot({ path: path.join(outDir, 'comp_owner_slots_matrix.png') });
    console.log('Saved comp_owner_slots_matrix.png');
  }

  await browser.close();
  console.log('All targeted spec screenshots captured successfully!');
}

captureSpecScreens().catch(console.error);
