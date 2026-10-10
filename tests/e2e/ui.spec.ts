import { expect, test } from '@playwright/test';

test('menu complet : ouverture, focus piégé, fermeture par Échap', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(page.getByRole('button', { name: 'Fermer' })).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation', { name: 'Menu complet' }).getByRole('link', { name: 'Le premier rendez-vous' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('button', { name: 'Menu' })).toBeFocused();
});

test('FAQ : les accordéons s’ouvrent', async ({ page }) => {
  await page.goto('/deroulement/');
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

test('FAQ : recherche insensible aux accents et état vide', async ({ page }) => {
  await page.goto('/faq/');
  const input = page.locator('[data-faq-input]');
  await input.fill('zzzzqq');
  await expect(page.locator('[data-faq-item]:visible')).toHaveCount(0);
  await expect(page.getByRole('link', { name: /questions que l’on n’ose pas poser/i }).first()).toBeVisible();
  await input.fill('');
  expect(await page.locator('[data-faq-item]:visible').count()).toBeGreaterThan(3);
});

test('questions : navigation une question à la fois', async ({ page }) => {
  await page.goto('/questions/');
  await expect(page.locator('[data-deck-current]')).toHaveText('1');
  await page.getByRole('button', { name: 'Question suivante' }).click();
  await expect(page.locator('[data-deck-current]')).toHaveText('2');
  await expect(page.locator('[data-card="1"]')).toHaveAttribute('aria-hidden', 'false');
  await page.getByRole('button', { name: 'Question précédente' }).click();
  await expect(page.locator('[data-deck-current]')).toHaveText('1');
});

test('orientation : parcours complet, retour arrière et préremplissage', async ({ page }) => {
  await page.goto('/orientation/');
  const choose = (text: string) => page.locator('label.or__opt', { hasText: text }).click();
  await choose('Un chiot vient d’arriver');
  await expect(page.getByText('Qu’est-ce qui occupe vos pensées en ce moment ?')).toBeVisible();
  await page.getByRole('button', { name: /Continuer/ }).click();
  await expect(page.getByText('Choisissez au moins une réponse pour continuer.')).toBeVisible();
  await choose('Il mordille, il attrape');
  await page.getByRole('button', { name: /Continuer/ }).click();
  await page.getByRole('button', { name: 'Retour' }).click();
  await expect(page.locator('input[name="concerns"]:checked')).toHaveCount(1);
  await page.getByRole('button', { name: /Continuer/ }).click();
  await choose('Fatigué·e');
  await choose('En parler avec l’éducatrice');
  await expect(page.getByRole('heading', { name: /récapitulatif/ })).toBeVisible();
  await expect(page.locator('[data-or-acc]')).toHaveAttribute('href', '/accompagnements/chiot/');
  await expect(page.locator('[data-or-care]')).toBeHidden();
  await page.locator('[data-or-primary]').click();
  await expect(page).toHaveURL(/parlons-de-votre-chien\/\?sujet=chiot/);
  await expect(page.locator('textarea[name="message"]')).toHaveValue(/D’après le parcours d’orientation/);
});

test('premier rendez-vous : la checklist alimente le récapitulatif', async ({ page }) => {
  await page.goto('/premier-rendez-vous/');
  await page.locator('label.prep__item').first().click();
  await expect(page.locator('[data-prep-count]')).toHaveText('1');
  await page.locator('textarea[data-prep-note]').first().fill('Il a trois ans.');
  await expect(page.locator('[data-prep-send]')).toHaveAttribute('href', /note=/);
});
