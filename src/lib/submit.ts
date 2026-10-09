import type { FormConfig } from '~/config/forms';

export type SubmitResult = { ok: true } | { ok: false; reason: 'network' | 'rejected' | 'not-configured'; message?: string };

export interface Submission {
  /** Objet du message reçu par l'activité. */
  subject: string;
  /** Champs lisibles (libellé → valeur), dans l'ordre d'affichage. */
  fields: Record<string, string>;
  /** Adresse de réponse, si fournie. */
  replyTo?: string | undefined;
}

/**
 * Construit le corps JSON attendu par le fournisseur.
 * Formspree et Web3Forms acceptent tous deux un objet JSON plat.
 */
export function buildPayload(config: FormConfig, submission: Submission): Record<string, string> {
  const payload: Record<string, string> = { ...submission.fields };
  if (config.provider === 'web3forms') {
    payload.access_key = config.accessKey ?? '';
    payload.subject = submission.subject;
    payload.from_name = 'Site ToutouBien';
    if (submission.replyTo) payload.replyto = submission.replyTo;
  } else {
    payload._subject = submission.subject;
    if (submission.replyTo) payload._replyto = submission.replyTo;
  }
  return payload;
}

/**
 * Envoie une demande. Ne renvoie `ok: true` que lorsque le fournisseur a
 * confirmé la réception (HTTP 2xx et, le cas échéant, `success: true`).
 */
export async function submitForm(
  config: FormConfig | null,
  submission: Submission,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 15000,
): Promise<SubmitResult> {
  if (!config) return { ok: false, reason: 'not-configured' };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(buildPayload(config, submission)),
      signal: controller.signal,
    });
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    const explicitFailure = typeof body === 'object' && body !== null && 'success' in body && (body as { success: unknown }).success === false;
    if (response.ok && !explicitFailure) return { ok: true };
    const message = typeof body === 'object' && body !== null && 'message' in body ? String((body as { message: unknown }).message) : undefined;
    return { ok: false, reason: 'rejected', ...(message ? { message } : {}) };
  } catch {
    return { ok: false, reason: 'network' };
  } finally {
    clearTimeout(timer);
  }
}
