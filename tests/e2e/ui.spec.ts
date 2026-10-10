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
  await expect(page.locator('[data-faq-empty]')).toBeVisible();
  await expect(page.locator('[data-faq-empty]').getByRole('link', { name: /questions que l’on n’ose pas poser/i })).toBeVisible();
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

test('le monde par le nez : chaque odeur se trouve, se re-sélectionne et se réinitialise', async ({ page }) => {
  await page.goto('/explorer/flair/');
  const ids = await page.locator('[data-scent]').evaluateAll((els) => els.map((e) => (e as HTMLElement).dataset.scent!));
  expect(ids.length).toBe(6);
  for (const id of ids) {
    await page.locator(`[data-scent="${id}"]`).click();
    await expect(page.locator(`[data-scent="${id}"]`)).toHaveClass(/is-found/, { timeout: 6000 });
    await expect(page.locator(`[data-scent="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator(`[data-marker="${id}"]`)).toHaveClass(/is-visible/);
  }
  await expect(page.locator('[data-count]')).toHaveText('6 / 6');
  // Une odeur déjà trouvée se rouvre dans le carnet.
  await page.locator(`[data-marker="${ids[0]}"]`).click();
  await expect(page.locator('[data-note-status]')).toContainText('Trouvé');
  await page.getByRole('button', { name: 'Recommencer' }).click();
  await expect(page.locator('[data-count]')).toHaveText('0 / 6');
  await expect(page.locator('.fx__marker.is-visible')).toHaveCount(0);
});

test('accueil : aucun élément ne suit le pointeur', async ({ page, isMobile }) => {
  test.skip(isMobile, 'souris uniquement');
  await page.goto('/');
  const before = await page.locator('[data-cine]').screenshot();
  await page.mouse.move(900, 400);
  await page.mouse.move(1000, 450, { steps: 5 });
  // Aucune propriété liée au pointeur n'est exposée par la scène.
  const html = await page.content();
  expect(html).not.toContain('uPointer');
  expect(before.length).toBeGreaterThan(0);
});

test('décodeur : situation, étapes, carnet transmis et retour arrière', async ({ page }) => {
  await page.goto('/decodeur/');
  await page.locator('[data-dc-pick="rappel"]').click();
  await expect(page).toHaveURL(/#rappel$/);
  const read = page.locator('#rappel');
  await expect(read.locator('[data-dc-count]')).toHaveText('1');
  await read.locator('[data-dc-next]').click();
  await read.locator('label.dc-obs__item').first().click();
  for (let i = 0; i < 3; i++) await read.locator('[data-dc-next]').click();
  await expect(read.locator('[data-dc-count]')).toHaveText('5');
  await expect(read.locator('[data-dc-next]')).toBeDisabled();
  await expect(read.locator('[data-dc-send]')).toHaveAttribute('href', /sujet=rappel&note=/);
  await page.goBack();
  await expect(page.locator('[data-dc-choices]')).toBeVisible();
});

test('accueil : une perte du contexte WebGL ne fait pas sauter la page', async ({ page }) => {
  await page.goto('/?quality=low');
  const section = page.locator('[data-cine]');
  await expect(section).toHaveAttribute('data-ready', 'true', { timeout: 15000 });
  const before = await section.evaluate((el) => (el as HTMLElement).offsetHeight);
  await page.evaluate(() => {
    const c = document.querySelector<HTMLCanvasElement>('[data-cine] canvas')!;
    c.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
  });
  await expect(section).toHaveAttribute('data-lite', 'true');
  expect(await section.evaluate((el) => (el as HTMLElement).offsetHeight)).toBe(before);
  await expect(page.locator('#cine-title')).toBeVisible();
});
