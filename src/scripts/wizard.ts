/**
 * Parcours « Parlons de votre chien » — amélioration progressive.
 * Sans ce script, le formulaire reste utilisable d'un seul tenant.
 */
import { formConfig } from '~/config/forms';
import { submitForm } from '~/lib/submit';
import {
  STEPS,
  rephrase,
  summaryFields,
  topicFromQuery,
  validateAll,
  validateStep,
  type Errors,
  type StepId,
  type WizardAnswers,
} from '~/lib/wizard';

const MIN_FILL_MS = 4000;

export function initWizard(root: ParentNode = document): void {
  const wizard = root.querySelector<HTMLElement>('[data-wizard]');
  const form = wizard?.querySelector<HTMLFormElement>('[data-wizard-form]');
  if (!wizard || !form) return;

  const steps = Array.from(form.querySelectorAll<HTMLElement>('[data-step]'));
  const prevBtn = form.querySelector<HTMLButtonElement>('[data-prev]')!;
  const nextBtn = form.querySelector<HTMLButtonElement>('[data-next]')!;
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const copyBtn = form.querySelector<HTMLButtonElement>('[data-copy]')!;
  const errorSummary = form.querySelector<HTMLElement>('[data-error-summary]')!;
  const progress = wizard.querySelector<HTMLElement>('[data-progress]')!;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const success = wizard.querySelector<HTMLElement>('[data-success]')!;
  const safetyNote = form.querySelector<HTMLElement>('[data-safety-note]');
  const startedAt = Date.now();
  let current = 0;
  let sending = false;

  form.noValidate = true;
  wizard.classList.add('is-enhanced');
  form.querySelector<HTMLElement>('[data-step="resume"]')!.hidden = false;

  // Préremplissage depuis l'accueil : ?sujet=marche-en-laisse
  const preset = topicFromQuery(new URLSearchParams(location.search).get('sujet'));
  if (preset) {
    const box = form.querySelector<HTMLInputElement>(`input[name="topics"][value="${preset}"]`);
    if (box) box.checked = true;
  }

  const read = (): WizardAnswers => {
    const data = new FormData(form);
    const text = (name: string) => {
      const v = data.get(name);
      return typeof v === 'string' && v.trim() ? v.trim() : undefined;
    };
    const answers: WizardAnswers = {
      topics: data.getAll('topics').map(String),
      contexts: data.getAll('contexts').map(String),
      consent: data.get('consent') === 'oui',
    };
    const assign = (key: Exclude<keyof WizardAnswers, 'topics' | 'contexts' | 'consent'>) => {
      const v = text(key);
      if (v !== undefined) answers[key] = v;
    };
    (['dogName', 'age', 'since', 'safety', 'area', 'meeting', 'message', 'firstName', 'contactMethod', 'email', 'phone', 'bestTime'] as const).forEach(assign);
    return answers;
  };

  // --- Affichage des erreurs ---------------------------------------------
  const clearErrors = () => {
    form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((el) => (el.textContent = ''));
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    errorSummary.hidden = true;
    errorSummary.textContent = '';
  };

  const showErrors = (errors: Errors): boolean => {
    clearErrors();
    const entries = Object.entries(errors) as [string, string][];
    if (!entries.length) return true;
    for (const [name, message] of entries) {
      const slot = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
      if (slot) slot.textContent = message;
      form.querySelectorAll<HTMLElement>(`[name="${name}"]`).forEach((el) => el.setAttribute('aria-invalid', 'true'));
    }
    errorSummary.hidden = false;
    const title = document.createElement('p');
    title.innerHTML = '<strong></strong>';
    title.querySelector('strong')!.textContent = entries.length > 1 ? `${entries.length} points à compléter :` : 'Un point à compléter :';
    const list = document.createElement('ul');
    for (const [name, message] of entries) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#f-${name}`;
      link.textContent = message;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        form.querySelector<HTMLElement>(`[name="${name}"]`)?.focus();
      });
      li.append(link);
      list.append(li);
    }
    errorSummary.append(title, list);
    const firstName = entries[0]![0];
    form.querySelector<HTMLElement>(`[name="${firstName}"]`)?.focus();
    return false;
  };

  // --- Navigation ----------------------------------------------------------
  const render = (focus = true) => {
    const id = STEPS[current]!;
    steps.forEach((step) => (step.hidden = step.dataset.step !== id));
    const isSummary = id === 'resume';
    prevBtn.hidden = current === 0;
    nextBtn.hidden = isSummary;
    submitBtn.hidden = !isSummary || !formConfig;
    copyBtn.hidden = !isSummary || Boolean(formConfig);

    wizard.querySelector<HTMLElement>('[data-progress-count]')!.textContent = `Étape ${current + 1} sur ${STEPS.length}`;
    wizard.querySelector<HTMLElement>('[data-progress-bar]')!.parentElement!.style.setProperty('--progress', `${((current + 1) / STEPS.length) * 100}%`);
    wizard.querySelectorAll<HTMLElement>('[data-progress-step]').forEach((li, i) => {
      if (i === current) li.setAttribute('aria-current', 'step');
      else li.removeAttribute('aria-current');
      li.dataset.state = i < current ? 'done' : '';
    });

    if (isSummary) renderSummary();
    if (focus) steps.find((s) => s.dataset.step === id)?.querySelector<HTMLElement>('.step__title')?.focus();
    if (focus) wizard.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const goTo = (index: number) => {
    current = Math.max(0, Math.min(STEPS.length - 1, index));
    clearErrors();
    render();
  };

  nextBtn.addEventListener('click', () => {
    if (showErrors(validateStep(STEPS[current]!, read()))) goTo(current + 1);
  });
  prevBtn.addEventListener('click', () => goTo(current - 1));

  // Entrée dans un champ texte : passer à l'étape suivante plutôt qu'envoyer.
  form.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement;
    if (event.key === 'Enter' && target instanceof HTMLInputElement && target.type !== 'checkbox' && target.type !== 'radio' && STEPS[current] !== 'resume') {
      event.preventDefault();
      nextBtn.click();
    }
  });

  // --- Champs dynamiques ---------------------------------------------------
  const updateContactRequirement = () => {
    const method = (form.querySelector<HTMLInputElement>('input[name="contactMethod"]:checked')?.value ?? '') as string;
    const states: Record<string, boolean> = { phone: method === 'telephone', email: method === 'email' };
    for (const [name, required] of Object.entries(states)) {
      const label = form.querySelector<HTMLElement>(`[data-req-state="${name}"]`);
      if (label) label.textContent = required ? ' (obligatoire)' : ' (facultatif)';
      form.querySelector<HTMLInputElement>(`[name="${name}"]`)?.toggleAttribute('aria-required', required);
    }
  };
  form.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    if (target.name === 'contactMethod') updateContactRequirement();
    if (target.name === 'safety' && safetyNote) safetyNote.hidden = target.value !== 'oui';
  });

  form.querySelectorAll<HTMLTextAreaElement>('textarea[maxlength]').forEach((area) => {
    const counter = form.querySelector<HTMLElement>(`[data-counter-for="${area.name}"]`);
    const max = area.maxLength;
    const update = () => {
      if (counter) counter.textContent = `${area.value.length} / ${max} caractères`;
    };
    area.addEventListener('input', update);
    update();
  });

  // --- Résumé --------------------------------------------------------------
  const renderSummary = () => {
    const answers = read();
    const rephraseBox = form.querySelector<HTMLElement>('[data-rephrase]')!;
    rephraseBox.replaceChildren(
      ...rephrase(answers).map((line) => {
        const p = document.createElement('p');
        p.textContent = line;
        return p;
      }),
    );
    const list = form.querySelector<HTMLElement>('[data-summary]')!;
    list.replaceChildren(
      ...summaryFields(answers).map((row) => {
        const wrap = document.createElement('div');
        wrap.className = 'summary__row';
        const dt = document.createElement('dt');
        dt.textContent = row.label;
        const dd = document.createElement('dd');
        dd.textContent = row.value;
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'summary__edit';
        edit.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/></svg><span></span>';
        edit.querySelector('span')!.textContent = 'Modifier';
        edit.setAttribute('aria-label', `Modifier : ${row.label}`);
        edit.addEventListener('click', () => goTo(STEPS.indexOf(row.step as StepId)));
        wrap.append(dt, dd, edit);
        return wrap;
      }),
    );
    status.replaceChildren();
  };

  const summaryText = (answers: WizardAnswers) =>
    [...rephrase(answers), '', ...summaryFields(answers).map((r) => `${r.label} : ${r.value}`)].join('\n');

  copyBtn.addEventListener('click', async () => {
    const text = summaryText(read());
    try {
      await navigator.clipboard.writeText(text);
      setStatus('info', 'Résumé copié. Vous pouvez le coller dans un e-mail ou un message.');
    } catch {
      setStatus('error', 'La copie automatique n’a pas fonctionné. Vous pouvez sélectionner le texte du résumé ci-dessus.');
    }
  });

  const setStatus = (kind: 'error' | 'info', message: string, retry = false) => {
    const box = document.createElement('div');
    box.className = `notice notice--${kind}`;
    box.setAttribute('role', kind === 'error' ? 'alert' : 'status');
    const p = document.createElement('p');
    p.textContent = message;
    box.append(p);
    if (retry) {
      const again = document.createElement('button');
      again.type = 'button';
      again.className = 'btn btn--ghost';
      again.textContent = 'Réessayer';
      again.addEventListener('click', () => form.requestSubmit(submitBtn));
      box.append(again);
    }
    status.replaceChildren(box);
  };

  // --- Envoi ---------------------------------------------------------------
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    const answers = read();
    const errors = validateAll(answers);
    if (Object.keys(errors).length) {
      // Revenir à la première étape concernée.
      const firstStep = STEPS.find((s) => Object.keys(validateStep(s, answers)).length);
      if (firstStep) {
        goTo(STEPS.indexOf(firstStep));
        showErrors(validateStep(firstStep, answers));
      }
      return;
    }
    const trap = (form.elements.namedItem('botcheck') as HTMLInputElement | null)?.value;
    if (trap || Date.now() - startedAt < MIN_FILL_MS) {
      setStatus('error', 'L’envoi n’a pas pu aboutir. Merci de réessayer dans quelques secondes.', true);
      return;
    }

    sending = true;
    submitBtn.classList.add('is-loading');
    submitBtn.setAttribute('aria-disabled', 'true');
    submitLabel.textContent = 'Envoi en cours…';
    status.replaceChildren();

    const fields = Object.fromEntries(summaryFields(answers).map((r) => [r.label, r.value]));
    fields['Reformulation'] = rephrase(answers).join(' ');
    fields['Consentement'] = 'Oui';
    const result = await submitForm(formConfig, {
      subject: `Demande de ${answers.firstName ?? 'contact'} — Parlons de votre chien`,
      fields,
      replyTo: answers.email,
    });

    sending = false;
    submitBtn.classList.remove('is-loading');
    submitBtn.removeAttribute('aria-disabled');
    submitLabel.textContent = 'Envoyer ma demande';

    if (result.ok) {
      form.hidden = true;
      progress.hidden = true;
      wizard.querySelector<HTMLElement>('[data-offline-notice]')?.remove();
      success.hidden = false;
      success.querySelector('[data-success-title]')!.textContent = `Merci ${answers.firstName}, votre demande a bien été reçue.`;
      success.querySelector('[data-success-text]')!.textContent =
        answers.contactMethod === 'telephone' ? 'Vous serez rappelé·e au numéro indiqué pour en parler.' : 'Vous recevrez une réponse à l’adresse e-mail indiquée.';
      success.focus();
      form.reset();
      return;
    }
    const message =
      result.reason === 'network'
        ? 'La connexion semble interrompue : votre demande n’a pas été envoyée. Vos réponses sont conservées, vous pouvez réessayer.'
        : 'Votre demande n’a pas pu être enregistrée par le service d’envoi. Vos réponses sont conservées, vous pouvez réessayer.';
    setStatus('error', message, true);
  });

  updateContactRequirement();
  render(false);
}
