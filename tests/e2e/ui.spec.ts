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
  const scene = page.locator('[data-hh-scene]');
  const box = async () => scene.locator('.hh__main').boundingBox();
  const before = await box();
  await page.mouse.move(900, 400);
  await page.mouse.move(1000, 450, { steps: 5 });
  // La photo principale ne bouge pas avec la souris.
  expect(await box()).toEqual(before);
  expect(await page.content()).not.toContain('uPointer');
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

test('accueil : le sélecteur de chemin répond au clic et au clavier', async ({ page }) => {
  await page.goto('/');
  const group = page.getByRole('radiogroup').first();
  await group.scrollIntoViewIfNeeded();
  const first = group.getByRole('radio').first();
  await first.click();
  await expect(first).toHaveAttribute('aria-checked', 'true');
  const panel = page.locator('[data-ch-panel="chiot"]');
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('link', { name: /Affiner en quatre questions/ })).toHaveAttribute('href', /\/orientation\/\?stage=/);
  await page.keyboard.press('ArrowDown');
  const second = group.getByRole('radio').nth(1);
  await expect(second).toHaveAttribute('aria-checked', 'true');
  await expect(second).toBeFocused();
  await expect(page.locator('[data-ch-panel="chien-adulte"]')).toBeVisible();
});

test('accueil : les histoires changent de situation et mènent au dossier', async ({ page }) => {
  await page.goto('/');
  const tabs = page.getByRole('tablist', { name: 'Situations' });
  await tabs.scrollIntoViewIfNeeded();
  const tab = tabs.getByRole('tab').nth(2);
  await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
  const panel = page.locator('#st-panel-solitude');
  await expect(panel).toBeVisible();
  await panel.getByRole('link', { name: /Lire le dossier/ }).click();
  await expect(page).toHaveURL(/\/dossiers\/solitude\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/seul/);
});

test('galerie : visionneuse au clavier, compteur, fermeture et retour du focus', async ({ page }) => {
  await page.goto('/galerie/');
  const thumbs = page.locator('[data-lb]');
  const n = await thumbs.count();
  expect(n).toBeGreaterThan(1);
  await thumbs.first().click();
  const dialog = page.locator('dialog.lb');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-lb-count]')).toHaveText(`1 / ${n}`);
  await page.keyboard.press('ArrowRight');
  await expect(dialog.locator('[data-lb-count]')).toHaveText(`2 / ${n}`);
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(dialog.locator('[data-lb-count]')).toHaveText(`${n} / ${n}`);
  await dialog.getByRole('button', { name: 'Image suivante' }).click();
  await expect(dialog.locator('[data-lb-count]')).toHaveText(`1 / ${n}`);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(thumbs.first()).toBeFocused();
  await thumbs.nth(1).click();
  await dialog.getByRole('button', { name: 'Fermer la visionneuse' }).click();
  await expect(dialog).toBeHidden();
});

test('dossiers : la liste mène à chaque dossier, la carte suit la lecture', async ({ page }) => {
  await page.goto('/dossiers/');
  const cards = page.locator('.dl__card');
  await expect(cards).toHaveCount(6);
  await cards.first().click();
  await expect(page).toHaveURL(/\/dossiers\/laisse\/$/);
  const map = page.getByRole('navigation', { name: 'Les cinq temps du dossier' });
  await map.locator('a[href="#d-questions"]').click();
  await expect(map.locator('a[href="#d-questions"]')).toHaveAttribute('aria-current', 'step');
  await expect(page.getByRole('link', { name: /Préparer un échange/ })).toHaveAttribute('href', /sujet=marche-en-laisse/);
  await page.getByRole('link', { name: /Dossier suivant/ }).click();
  await expect(page).toHaveURL(/\/dossiers\/rappel\/$/);
});

test('orientation : parcours entièrement au clavier, constellation et repères', async ({ page }) => {
  await page.goto('/orientation/');
  const step = page.locator('.or__step.is-current');
  // Question 1 : flèches pour choisir (pas d'avance automatique au clavier), Entrée pour valider.
  await step.locator('input').first().focus();
  await page.keyboard.press('ArrowDown');
  await expect(step.locator('input:checked')).toHaveValue('chiot-arrive');
  await expect(step.locator('.or__insight')).toContainText('premières semaines');
  await expect(page.locator('[data-star="0"]')).toHaveClass(/is-on/);
  await page.keyboard.press('Enter');
  await expect(page.locator('.or__step.is-current .or__q-text')).toHaveText(/occupe vos pensées/);
  // Question 2 : cases à cocher avec Espace ; chaque coche ajoute une étoile satellite.
  const boxes = page.locator('.or__step.is-current input');
  await boxes.nth(0).focus();
  await page.keyboard.press('Space');
  await boxes.nth(2).focus();
  await page.keyboard.press('Space');
  await expect(page.locator('[data-sat].is-on')).toHaveCount(2);
  await page.keyboard.press('Enter');
  await page.locator('.or__step.is-current input').first().focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await page.locator('.or__step.is-current input').first().focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.or__step.is-current [data-step-error]')).toHaveText(/Choisissez une réponse/);
  await page.keyboard.press('Space');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: /récapitulatif/ })).toBeFocused();
  await expect(page.locator('[data-star="4"]')).toHaveClass(/is-on/);
  await expect(page.locator('[data-or-dossiers-list] a')).toHaveCount(2);
  await expect(page.locator('[data-or-primary]')).toHaveAttribute('href', '/dossiers/laisse/');
  // Modifier conserve les réponses ; Recommencer les efface.
  await page.getByRole('button', { name: 'Modifier mes réponses' }).click();
  await expect(page.locator('input[name="stage"]:checked')).toHaveValue('chiot-arrive');
  await page.getByRole('button', { name: /Continuer/ }).click();
  await page.getByRole('button', { name: /Continuer/ }).click();
  await page.getByRole('button', { name: /Continuer/ }).click();
  await page.getByRole('button', { name: /récapitulatif/ }).click();
  await page.getByRole('button', { name: 'Recommencer' }).click();
  await expect(page.locator('.or__form input:checked')).toHaveCount(0);
  await expect(page.locator('[data-star].is-on')).toHaveCount(0);
  await expect(page.locator('.or__step.is-current .or__q-text')).toHaveText(/situation aujourd/);
});

test('orientation : reprise du choix fait sur l’accueil, modifiable', async ({ page }) => {
  await page.goto('/orientation/?stage=adopte');
  await expect(page.locator('[data-or-preset]')).toContainText('Un chien adulte vient d’arriver');
  await expect(page.locator('.or__step.is-current .or__q-text')).toHaveText(/occupe vos pensées/);
  await page.getByRole('button', { name: 'Retour' }).click();
  await expect(page.locator('input[name="stage"]:checked')).toHaveValue('adopte');
  await page.goto('/orientation/?stage=inconnu');
  await expect(page.locator('[data-or-preset]')).toBeHidden();
  await expect(page.locator('.or__step.is-current .or__q-text')).toHaveText(/situation aujourd/);
});

test('orientation : chaque préoccupation mène à un récapitulatif cohérent', async ({ page }) => {
  await page.goto('/orientation/');
  const labels = await page.locator('input[name="concerns"]').evaluateAll((els) => els.map((e) => (e as HTMLInputElement).value));
  for (const value of labels) {
    await page.locator('input[name="stage"][value="installe"]').check({ force: true });
    await page.getByRole('button', { name: /Continuer/ }).click();
    await page.locator(`input[name="concerns"][value="${value}"]`).check({ force: true });
    await page.getByRole('button', { name: /Continuer/ }).click();
    await page.locator('input[name="feeling"][value="curieux"]').check({ force: true });
    await page.getByRole('button', { name: /Continuer/ }).click();
    await page.locator('input[name="wish"][value="lire"]').check({ force: true });
    await page.getByRole('button', { name: /récapitulatif/ }).click();
    await expect(page.getByRole('heading', { name: /récapitulatif/ })).toBeVisible();
    await expect(page.locator('[data-or-acc]')).toHaveAttribute('href', /^\/accompagnements\/[a-z-]+\/$/);
    const href = await page.locator('[data-or-primary]').getAttribute('href');
    expect(href).toMatch(/^\/(dossiers|blog)\//);
    await page.getByRole('button', { name: 'Recommencer' }).click();
  }
});

test('photos : les photographies de chiens se chargent, sans image cassée', async ({ page }) => {
  for (const path of ['/', '/galerie/', '/accompagnements/chiot/', '/blog/']) {
    await page.goto(path);
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForLoadState('networkidle');
    const stats = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
      return { total: imgs.length, broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).length, photos: document.querySelectorAll('[data-photo], .g-tile').length };
    });
    expect(stats.broken, path).toBe(0);
    expect(stats.photos, path).toBeGreaterThan(0);
  }
});

test('accueil : apprendre à regarder, les six repères se découvrent', async ({ page }) => {
  await page.goto('/');
  const spots = page.locator('[data-ho-spot]');
  await spots.first().scrollIntoViewIfNeeded();
  await expect(spots).toHaveCount(6);
  for (let i = 0; i < 6; i++) {
    await spots.nth(i).click();
    await expect(spots.nth(i)).toHaveAttribute('aria-pressed', 'true');
  }
  await expect(page.locator('[data-ho-count]')).toHaveText('6 / 6 repères observés');
  await expect(page.locator('[data-ho-done]')).toBeVisible();
  await expect(page.locator('[data-ho-title]')).toHaveText('L’environnement');
});

test('galerie : le filtre par thème limite les photos et la visionneuse', async ({ page }) => {
  await page.goto('/galerie/');
  const tiles = page.locator('.g-tile');
  const total = await tiles.count();
  await page.locator('[data-gal-theme="chiot"]').click();
  const visible = page.locator('.g-tile:visible');
  const n = await visible.count();
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThan(total);
  await expect(page.locator('[data-gal-count]')).toHaveText(`${n} photos`);
  await visible.first().locator('[data-lb]').click();
  await expect(page.locator('dialog.lb [data-lb-count]')).toHaveText(`1 / ${n}`);
  await page.keyboard.press('Escape');
  await page.locator('[data-gal-theme=""]').click();
  await expect(page.locator('.g-tile:visible')).toHaveCount(total);
});
