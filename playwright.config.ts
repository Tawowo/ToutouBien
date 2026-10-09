import { defineConfig, devices } from '@playwright/test';

const PORT = 4400;

/**
 * Les tests de bout en bout tournent sur un build de production dont le formulaire
 * pointe vers un point de réception fictif ; chaque test intercepte la requête
 * (aucune donnée ne quitte la machine).
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 860 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `astro build --outDir dist-test && astro preview --outDir dist-test --port ${PORT} --ignore-lock`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      PUBLIC_FORM_PROVIDER: 'custom',
      PUBLIC_FORM_ENDPOINT: 'https://forms.example.test/submit',
      PUBLIC_SITE_URL: 'https://toutoubien.example',
    },
  },
});
