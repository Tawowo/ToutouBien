/**
 * Configuration de la transmission des formulaires.
 * Lue depuis les variables d'environnement publiques au moment du build
 * (voir .env.example et docs/DEPLOYMENT.md).
 */
export type FormProvider = 'formspree' | 'web3forms' | 'custom';

export interface FormConfig {
  provider: FormProvider;
  endpoint: string;
  /** Clé publique Web3Forms (conçue pour être exposée). */
  accessKey?: string;
}

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export function readFormConfig(env: Record<string, string | undefined>): FormConfig | null {
  const provider = (env.PUBLIC_FORM_PROVIDER ?? '').trim().toLowerCase();
  if (provider === 'web3forms') {
    const accessKey = env.PUBLIC_WEB3FORMS_ACCESS_KEY?.trim();
    return accessKey ? { provider, endpoint: WEB3FORMS_ENDPOINT, accessKey } : null;
  }
  if (provider === 'formspree' || provider === 'custom') {
    const endpoint = env.PUBLIC_FORM_ENDPOINT?.trim();
    if (!endpoint || !/^https:\/\//.test(endpoint)) return null;
    return { provider, endpoint };
  }
  return null;
}

export const formConfig = readFormConfig(import.meta.env as Record<string, string | undefined>);
