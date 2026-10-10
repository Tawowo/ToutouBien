import { isComplete, noteFor, orient, QUESTIONS, type OrientationAnswers, type WishId } from '~/lib/orientation';

interface Payload {
  articles: { id: string; title: string; minutes: number }[];
  accompagnements: { slug: string; label: string; short: string }[];
  explorers: { id: string; title: string; question: string; href: string }[];
}

const NEXT: Record<WishId, string> = {
  lire: 'Voir les ressources',
  preparer: 'Préparer le rendez-vous',
  parler: 'En parler avec l’éducatrice',
};

/** Parcours une question à la fois, avec retour, récapitulatif et reprise. Rien n'est stocké. */
export function initOrientation(root: ParentNode = document): void {
  const wrap = root.querySelector<HTMLElement>('[data-orientation]');
  const form = wrap?.querySelector<HTMLFormElement>('[data-or-form]');
  if (!wrap || !form) return;
  const payload = JSON.parse(wrap.dataset.payload ?? '{}') as Payload;
  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-step]'));
  const dots = Array.from(wrap.querySelectorAll<HTMLElement>('[data-dot]'));
  const nav = form.querySelector<HTMLElement>('[data-or-nav]')!;
  const back = form.querySelector<HTMLButtonElement>('[data-or-back]')!;
  const nextLabel = form.querySelector<HTMLElement>('[data-or-next-label]')!;
  const result = wrap.querySelector<HTMLElement>('[data-or-result]')!;
  const $ = <T extends HTMLElement>(sel: string) => result.querySelector<T>(sel)!;
  let current = 0;
  let timer = 0;

  wrap.classList.add('is-live');
  nav.hidden = false;

  const read = (): OrientationAnswers => {
    const d = new FormData(form);
    const one = <T>(k: string) => (d.get(k) as T | null) ?? undefined;
    return {
      stage: one('stage'),
      concerns: d.getAll('concerns') as OrientationAnswers['concerns'],
      feeling: one('feeling'),
      wish: one('wish'),
    };
  };

  const answered = (i: number) => steps[i]!.querySelector('input:checked') !== null;

  const setTrail = (n: number) => {
    dots.forEach((d, k) => (d.dataset.state = k < n ? 'done' : k === n ? 'current' : 'todo'));
    wrap.style.setProperty('--trail', (n / steps.length).toFixed(3));
  };

  const go = (n: number, focus = true) => {
    window.clearTimeout(timer);
    current = n;
    result.hidden = true;
    form.hidden = false;
    steps.forEach((s, k) => s.classList.toggle('is-current', k === n));
    back.hidden = n === 0;
    nextLabel.textContent = n === steps.length - 1 ? 'Voir mon récapitulatif' : 'Continuer';
    setTrail(n);
    if (focus) steps[n]!.querySelector<HTMLElement>('[data-step-title]')?.focus({ preventScroll: true });
    if (focus) wrap.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const el = (tag: string, text?: string) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    return node;
  };

  const showResult = () => {
    const answers = read();
    if (!isComplete(answers)) {
      go(steps.findIndex((_, i) => !answered(i)));
      return;
    }
    const r = orient(answers);
    $('[data-or-care]').hidden = !r.care;
    $('[data-or-summary]').replaceChildren(...r.summary.map((s) => el('li', s)));

    const acc = payload.accompagnements.find((a) => a.slug === r.accompagnement);
    if (acc) {
      $<HTMLAnchorElement>('[data-or-acc]').href = `/accompagnements/${acc.slug}/`;
      $('[data-or-acc-label]').textContent = acc.label;
      $('[data-or-acc-short]').textContent = acc.short;
    }
    const exp = payload.explorers.find((e) => e.id === r.explorer);
    if (exp) {
      $<HTMLAnchorElement>('[data-or-exp]').href = exp.href;
      $('[data-or-exp-label]').textContent = exp.title;
      $('[data-or-exp-question]').textContent = exp.question;
    }

    // Seuls les articles réellement publiés sont proposés.
    const reads = r.articles.map((id) => payload.articles.find((a) => a.id === id)).filter((a): a is Payload['articles'][number] => Boolean(a));
    $('[data-or-reads]').hidden = reads.length === 0;
    $('[data-or-reads-list]').replaceChildren(
      ...reads.map((a) => {
        const li = el('li');
        const link = el('a') as HTMLAnchorElement;
        link.href = `/blog/${a.id}/`;
        link.append(el('span', a.title), el('small', `${a.minutes} min`));
        li.append(link);
        return li;
      }),
    );

    const primary = $<HTMLAnchorElement>('[data-or-primary]');
    $('[data-or-primary-label]').textContent = NEXT[r.next];
    if (r.next === 'parler') {
      const url = new URL('/parlons-de-votre-chien/', location.origin);
      url.searchParams.set('sujet', r.topic);
      url.searchParams.set('note', noteFor(answers));
      primary.href = url.pathname + url.search;
    } else {
      primary.href = r.next === 'preparer' ? '/premier-rendez-vous/' : reads.length ? '/ressources/' : '/explorer/';
    }

    form.hidden = true;
    result.hidden = false;
    setTrail(steps.length);
    $('#or-result-title').focus({ preventScroll: true });
    wrap.scrollIntoView({ block: 'start' });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const error = steps[current]!.querySelector<HTMLElement>('[data-step-error]')!;
    if (!answered(current)) {
      error.textContent = QUESTIONS[current]!.multiple ? 'Choisissez au moins une réponse pour continuer.' : 'Choisissez une réponse pour continuer.';
      steps[current]!.querySelector<HTMLInputElement>('input')?.focus();
      return;
    }
    error.textContent = '';
    if (current < steps.length - 1) go(current + 1);
    else showResult();
  });

  // Choix unique : on avance tout seul après un court instant, sauf au clavier (flèches).
  let keyboard = false;
  form.addEventListener('keydown', (e) => (keyboard = e.key.startsWith('Arrow')));
  form.addEventListener('pointerdown', () => (keyboard = false));
  form.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    steps[current]!.querySelector<HTMLElement>('[data-step-error]')!.textContent = '';
    window.clearTimeout(timer);
    if (input.type !== 'radio' || keyboard) return;
    const at = current;
    timer = window.setTimeout(() => {
      if (current === at && !form.hidden) form.requestSubmit();
    }, 380);
  });

  back.addEventListener('click', () => go(Math.max(0, current - 1)));
  $('[data-or-edit]').addEventListener('click', () => go(0));
  $('[data-or-restart]').addEventListener('click', () => {
    form.reset();
    go(0);
  });

  go(0, false);
}
