/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Contrôle de mise en ligne : `npm run check:launch`.
export default getViteConfig({
  test: { include: ['tests/launch/**/*.test.ts'] },
});
