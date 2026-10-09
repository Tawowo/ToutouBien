import { expect, test, type Page } from '@playwright/test';

const ENDPOINT = 'https://forms.example.test/submit';

async function fillToSummary(page: Page) {
  await page.goto('/parlons-de-votre-chien/?sujet=rappel');
  await expect(page.getByText('Étape 1 sur 6')).toBeVisible();
  await page.getByLabel('Comment s’appelle-t-il ou elle').fill('Filou');
  await page.getByRole('radio', { name: 'Jeune (6 mois à 2 ans)' }).check();
  await page.getByRole('button', { name: 'Continuer' }).click();

  // Le sujet vient du lien de l'accueil.
  await expect(page.getByRole('checkbox', { name: 'Il ne revient pas toujours quand je l’appelle' })).toBeChecked();
  await page.getByRole('checkbox', { name: 'Il tire en laisse' }).check();
  await page.getByRole('button', { name: 'Continuer' }).click();

  await page.getByRole('checkbox', { name: 'En promenade' }).check();
  await page.getByRole('radio', { name: 'Depuis quelques mois' }).check();
  await page.getByRole('button', { name: 'Continuer' }).click();

  await page.getByLabel('Dans quelle commune').fill('Quelque part');
  await page.getByRole('button', { name: 'Continuer' }).click();

  await page.getByLabel('Comment pouvons-nous vous appeler').fill('Léa');
  await page.getByRole('radio', { name: 'Par e-mail' }).check();
  await page.getByRole('textbox', { name: 'E-mail' }).fill('lea@exemple.fr');
  await page.getByRole('checkbox', { name: /J’accepte/ }).check();
  await page.waitForTimeout(4100); // délai anti-robot
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.getByRole('heading', { name: 'Vérification' })).toBeVisible();
}

test('validation : un sujet est requis et l’erreur est annoncée', async ({ page }) => {
  await page.goto('/parlons-de-votre-chien/');
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.getByRole('alert')).toContainText('Choisissez au moins un sujet');
  await expect(page.getByText('Étape 2 sur 6')).toBeVisible();
});

test('résumé prudent, modification puis envoi confirmé par le serveur', async ({ page }) => {
  let payload: Record<string, string> = {};
  await page.route(ENDPOINT, async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await fillToSummary(page);
  await expect(page.getByText('Vous indiquez que votre chien, Filou, tire en laisse et ne revient pas toujours quand vous l’appelez.')).toBeVisible();

  // Retour pour corriger le prénom.
  await page.getByRole('button', { name: 'Modifier : Prénom du chien' }).click();
  await expect(page.getByText('Étape 1 sur 6')).toBeVisible();
  await page.getByLabel('Comment s’appelle-t-il ou elle').fill('Filou II');
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Continuer' }).click();
  await expect(page.getByText('votre chien, Filou II,')).toBeVisible();

  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.getByRole('heading', { name: 'Merci Léa, votre demande a bien été reçue.' })).toBeVisible();
  expect(payload['Prénom']).toBe('Léa');
  expect(payload['Prénom du chien']).toBe('Filou II');
  expect(payload['_replyto']).toBe('lea@exemple.fr');
  expect(payload['Reformulation']).not.toMatch(/agressi/i);
});

test('échec réseau : message clair, réponses conservées, nouvel essai réussi', async ({ page }) => {
  let calls = 0;
  await page.route(ENDPOINT, async (route) => {
    calls += 1;
    if (calls === 1) return route.abort('failed');
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  await fillToSummary(page);
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.getByRole('alert')).toContainText('n’a pas été envoyée');
  await expect(page.getByRole('heading', { name: /bien été reçue/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'Réessayer' }).click();
  await expect(page.getByRole('heading', { name: /bien été reçue/ })).toBeVisible();
  expect(calls).toBe(2);
});

test('refus du service : aucune confirmation fictive', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await fillToSummary(page);
  await page.getByRole('button', { name: 'Envoyer ma demande' }).click();
  await expect(page.getByRole('alert')).toContainText('n’a pas pu être enregistrée');
  await expect(page.getByRole('heading', { name: /bien été reçue/ })).toHaveCount(0);
});

test('une blessure déclarée affiche un message d’orientation', async ({ page }) => {
  await page.goto('/parlons-de-votre-chien/');
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByRole('checkbox', { name: 'Autre chose' }).check();
  await page.getByRole('button', { name: 'Continuer' }).click();
  await page.getByRole('radio', { name: 'Oui' }).check();
  await expect(page.getByText('Merci de nous le signaler.')).toBeVisible();
});

test('formulaire de contact : validation puis envoi', async ({ page }) => {
  await page.route(ENDPOINT, (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await page.goto('/contact/');
  await page.getByRole('button', { name: 'Envoyer le message' }).click();
  await expect(page.getByText('Indiquez au moins un moyen de vous répondre')).toBeVisible();
  await page.getByLabel('Votre prénom ou nom').fill('Léa');
  await page.getByLabel('Téléphone').fill('06 12 34 56 78');
  await page.getByLabel('Votre message').fill('Bonjour, une question.');
  await page.getByRole('checkbox', { name: /J’accepte/ }).check();
  await page.waitForTimeout(3100);
  await page.getByRole('button', { name: 'Envoyer le message' }).click();
  await expect(page.getByRole('heading', { name: 'Merci, votre message a bien été reçu.' })).toBeVisible();
});
