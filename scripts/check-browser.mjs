import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const base = process.env.APP_URL || 'http://127.0.0.1:5173';
const executablePath =
  process.env.CHROME_PATH ||
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined);
const browser = await chromium.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 900 },
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const ids = [399, 493, 1193, 231, 316, 692, 794, 397, 363, 645];
  await page.goto(base, { waitUntil: 'networkidle' });
  for (const id of ids) {
    await page
      .locator('.proof-card')
      .filter({ has: page.locator('.card-meta', { hasText: `#${id}` }) })
      .click();
    for (let step = 0; step < 4; step++) {
      await page.locator('.steps-nav button').nth(step).click();
      await page.locator('.scene').waitFor();
      assert.ok((await page.locator('.code-panel pre').innerText()).trim());
      assert.ok(page.url().endsWith(`#${id}/${step + 1}`));
    }
  }
  await page.goto(`${base}/#399/1`);
  await page
    .getByRole('button', { name: 'Play walkthrough', exact: true })
    .click();
  await page.waitForTimeout(800);
  await page
    .getByRole('button', { name: 'Pause walkthrough', exact: true })
    .click();
  const paused = await page
    .locator('.timeline button span')
    .first()
    .getAttribute('style');
  await page.waitForTimeout(300);
  assert.equal(
    await page.locator('.timeline button span').first().getAttribute('style'),
    paused,
  );
  await page.getByLabel('Playback speed').selectOption('1.5');
  await page
    .getByRole('button', { name: 'Play walkthrough', exact: true })
    .click();
  await page.waitForURL('**/#399/2', { timeout: 9000 });
  await page
    .getByRole('button', { name: 'Pause walkthrough', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Presentation mode', exact: true })
    .click();
  await page.locator('.arcade.presenting').waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.arcade.presenting').count(), 0);
  await page.keyboard.press('ArrowRight');
  assert.ok(page.url().endsWith('/3'));
  await page
    .getByRole('button', { name: 'Read full file', exact: true })
    .click();
  await page.locator('.full-source').waitFor();
  await page.goto(`${base}/#316/2`);
  const before = await page.locator('.bin-title b').first().innerText();
  await page
    .getByRole('button', { name: 'Move 1/2 to right bin', exact: true })
    .click();
  assert.notEqual(
    await page.locator('.bin-title b').first().innerText(),
    before,
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.arcade.reduced').waitFor();
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const id of ids) {
      await page.goto(`${base}/#${id}/4`);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `Overflow: ${id} at ${width}px`,
      );
    }
  }
  for (const id of ids) {
    const r = await page.request.get(
      `${base}/proofs/ErdosProblems/Erdos${id}.lean`,
    );
    assert.equal(r.status(), 200);
    assert.ok((await r.text()).includes('import Mathlib') || id === 231);
  }
  assert.deepEqual(errors, []);
  console.log(
    'Passed: 40 steps, playback, pause, speed, keyboard, presentation, source, packing interaction, reduced motion, 20 phone layouts and 10 downloads.',
  );
} finally {
  await browser.close();
}
