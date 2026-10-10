import { chromium, devices } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ ...devices['Pixel 7'] });
await p.goto('http://localhost:4400/', { waitUntil: 'networkidle' });
for (const t of [0, 1500, 3000]) {
  await p.waitForTimeout(t ? 1500 : 0);
  const r = await p.evaluate(() => {
    const W = document.documentElement.clientWidth;
    const out = [];
    document.querySelectorAll('body *').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.right > W + 0.5 && b.width > 0) out.push(`${el.tagName}.${(el.className?.baseVal ?? el.className) || ''} r=${Math.round(b.right)} w=${Math.round(b.width)}`);
    });
    return [document.documentElement.scrollWidth - W, out.slice(0, 12)];
  });
  console.log(JSON.stringify(r));
}
await b.close();
