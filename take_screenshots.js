const { chromium } = require('playwright');
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

  console.log('Navigating to Home page...');
  await page.goto('http://localhost:3000/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Full page screenshot of Home
  console.log('Capturing Home full page...');
  await page.screenshot({ path: path.join(outDir, '01_home_full.png'), fullPage: true });

  // Above the fold
  await page.screenshot({ path: path.join(outDir, '01_home_hero.png'), fullPage: false });

  // Scroll to featured turfs
  const turfsSection = await page.$('#turfs');
  if (turfsSection) {
    await turfsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '02_home_turfs_section.png'), fullPage: false });
  }

  // Scroll to booking or amenities/how it works
  const howSection = await page.$('#how-it-works, .how-it-works, #sports');
  if (howSection) {
    await howSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '03_home_features_section.png'), fullPage: false });
  }

  // About Page
  console.log('Navigating to About page...');
  await page.goto('http://localhost:3000/about.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('Capturing About full page...');
  await page.screenshot({ path: path.join(outDir, '04_about_full.png'), fullPage: true });
  await page.screenshot({ path: path.join(outDir, '04_about_hero.png'), fullPage: false });

  await browser.close();
  console.log('All screenshots captured successfully in /screenshots directory.');
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
