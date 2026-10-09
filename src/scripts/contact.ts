import { formConfig } from '~/config/forms';
import { submitForm } from '~/lib/submit';
import { validateContact, type ContactAnswers } from '~/lib/contact';

const MIN_FILL_MS = 3000;

export function initContactForm(root: ParentNode = document): void {
  const form = root.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;
  const summary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const label = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const success = form.parentElement?.querySelector<HTMLElement>('[data-success]');
  const startedAt = Date.now();
  let sending = false;
  form.noValidate = true;

  const read = (): ContactAnswers => {
    const d = new FormData(form);
    const t = (k: string) => {
      const v = d.get(k);
      return typeof v === 'string' && v.trim() ? v.trim() : undefined;
    };
    const a: ContactAnswers = { consent: d.get('consent') === 'oui' };
    (['name', 'email', 'phone', 'message'] as const).forEach((k) => {
      const v = t(k);
      if (v) a[k] = v;
    });
    return a;
  };

  const show = (errors: Record<string, string>) => {
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    const entries = Object.entries(errors);
    summary.hidden = entries.length === 0;
    summary.textContent = entries.length ? (entries.length > 1 ? `${entries.length} points à compléter.` : 'Un point à compléter.') : '';
    for (const [name, message] of entries) {
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      if (slot) slot.textContent = message;
      form.querySelector<HTMLElement>(`[name="${name}"]`)?.setAttribute('aria-invalid', 'true');
    }
    if (entries.length) form.querySelector<HTMLElement>(`[name="${entries[0]![0]}"]`)?.focus();
    return entries.length === 0;
  };

  const notice = (kind: 'error' | 'info', text: string) => {
    const box = document.createElement('div');
    box.className = `notice notice--${kind}`;
    box.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    box.textContent = text;
    status.replaceChildren(box);
  };

  form.querySelectorAll<HTMLTextAreaElement>('textarea[maxlength]').forEach((area) => {
    const counter = form.querySelector<HTMLElement>(`[data-counter-for="${area.name}"]`);
    area.addEventListener('input', () => {
      if (counter) counter.textContent = `${area.value.length} / ${area.maxLength} caractères`;
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    const answers = read();
    if (!show(validateContact(answers))) return;
    if (!formConfig) {
      notice('error', 'L’envoi en ligne n’est pas encore activé. Merci d’utiliser les coordonnées indiquées sur cette page.');
      return;
    }
    const trap = (form.elements.namedItem('botcheck') as HTMLInputElement | null)?.value;
    if (trap || Date.now() - startedAt < MIN_FILL_MS) {
      notice('error', 'L’envoi n’a pas pu aboutir. Merci de réessayer dans quelques secondes.');
      return;
    }
    sending = true;
    submit.classList.add('is-loading');
    submit.setAttribute('aria-disabled', 'true');
    label.textContent = 'Envoi en cours…';
    const result = await submitForm(formConfig, {
      subject: `Message de ${answers.name} — page Contact`,
      fields: { Nom: answers.name ?? '', 'E-mail': answers.email ?? '', Téléphone: answers.phone ?? '', Message: answers.message ?? '', Consentement: 'Oui' },
      replyTo: answers.email,
    });
    sending = false;
    submit.classList.remove('is-loading');
    submit.removeAttribute('aria-disabled');
    label.textContent = 'Envoyer le message';
    if (result.ok) {
      form.reset();
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
      return;
    }
    notice(
      'error',
      result.reason === 'network'
        ? 'La connexion semble interrompue : votre message n’a pas été envoyé. Votre texte est conservé, vous pouvez réessayer.'
        : 'Votre message n’a pas pu être enregistré par le service d’envoi. Votre texte est conservé, vous pouvez réessayer.',
    );
  });
}
