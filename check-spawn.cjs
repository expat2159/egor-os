const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/sulim/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname, 'dist/index.html')).href);
    const result = await page.evaluate(() => {
      const batches = [];
      const uniqueBatches = [];
      for (let i = 0; i < 20; i++) {
        const before = document.querySelector('#clones').childElementCount;
        document.querySelector(i % 2 ? '#spawn-more' : '#spawn').click();
        batches.push(document.querySelector('#clones').childElementCount - before);
        uniqueBatches.push(new Set([...document.querySelector('#clones').children].slice(before).map(img => img.src)).size);
      }
      return { batches, uniqueBatches, total: Number(document.querySelector('#count').textContent), active: document.querySelector('#clones').childElementCount };
    });
    assert.deepEqual(result.batches, Array(20).fill(5), 'Every click must launch five photos, even above 30 active photos');
    assert.equal(result.total, 100);
    assert.equal(result.active, 100);
    assert.deepEqual(result.uniqueBatches, Array(20).fill(5));
    await page.waitForTimeout(5200);
    assert.equal(await page.locator('.clone').count(), 0, 'Finished animations must release their elements');
    assert.equal(await page.locator('.egor-card').count(), 14);
    await page.evaluate(async () => {
      await Promise.all([...document.querySelectorAll('.egor-card img')].map(img => { img.loading = 'eager'; return img.decode(); }));
    });
    await page.locator('.egor-card').last().click();
    assert.equal(await page.locator('#viewer').evaluate(dialog => dialog.open), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#viewer').evaluate(dialog => dialog.open), false);
    await page.locator('#switch-button').click();
    assert.match(await page.locator('#switch-status').textContent(), /Контакт установлен/);
    await page.locator('#teacher').click();
    assert.match(await page.locator('#game-title').textContent(), /midnight-commander/);
    await page.locator('#teacher').click();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `No horizontal overflow at ${width}px`);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#spawn').click();
    assert.equal(await page.locator('.clone').count(), 5);
    assert.equal(await page.locator('.clone').first().evaluate(img => getComputedStyle(img).animationName), 'none');
    assert.deepEqual(errors, []);
    console.log('PASS: both buttons, 20 rapid clicks, 100 photos, cleanup');
    console.log('PASS: 24 gallery photos, modal/Escape, switch, teacher, desktop/mobile overflow, reduced motion, no JS errors');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
