import { expect, test } from '@playwright/test';

test('menu mobile : ouverture, navigation clavier, fermeture par Échap', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'menu compact uniquement sur mobile');
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(page.getByRole('button', { name: 'Fermer' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Navigation principale' }).getByRole('link', { name: 'À propos' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused();
});

test('FAQ : les accordéons s’ouvrent', async ({ page }) => {
  await page.goto('/accompagnement/');
  const item = page.locator('details[data-faq="preparer"]');
  await item.locator('summary').click();
  await expect(item).toHaveAttribute('open', '');
  await expect(item.getByText('Rien de particulier')).toBeVisible();
});

test('mouvement réduit : tout le contenu est visible sans animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const hidden = await page.locator('.reveal, .enter').evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== '1' || getComputedStyle(el).animationName !== 'none').length);
  expect(hidden).toBe(0);
});

test('lien d’évitement vers le contenu', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
});
