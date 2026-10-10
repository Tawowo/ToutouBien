import { SITUATIONS, STEPS, carnetNote, situation } from '~/lib/decodeur';

/**
 * Décodeur du quotidien : une situation à la fois, une étape à la fois.
 * L'adresse (#laisse) suit la situation ouverte : le bouton « retour » du navigateur ramène à la liste.
 * Rien n'est stocké.
 */
export function initDecodeur(root: ParentNode = document): void {
  const wrap = root.querySelector<HTMLElement>('[data-decodeur]');
  if (!wrap) return;
  wrap.classList.add('is-live');
  const reads = new Map(Array.from(wrap.querySelectorAll<HTMLElement>('[data-dc-read]')).map((el) => [el.dataset.dcRead!, el]));
  const carnet = wrap.querySelector<HTMLElement>('[data-dc-carnet]')!;
  const step = new Map<string, number>();
  let open: string | null = null;

  const el = (tag: string, text?: string) => {
    const n = document.createElement(tag);
    if (text) n.textContent = text;
    return n;
  };

  const observed = (id: string) =>
    Array.from(reads.get(id)!.querySelectorAll<HTMLInputElement>('[data-dc-obs]:checked')).map((i) => i.value);

  const refresh = (id: string, back = false) => {
    const read = reads.get(id)!;
    const k = step.get(id) ?? 0;
    read.querySelectorAll<HTMLElement>('[data-dc-step]').forEach((s) => {
      const on = Number(s.dataset.dcStep) === k;
      s.classList.toggle('is-current', on);
      s.classList.toggle('is-back', on && back);
    });
    read.querySelectorAll<HTMLElement>('[data-dc-dot]').forEach((d) => {
      const n = Number(d.dataset.dcDot);
      d.dataset.state = n < k ? 'done' : n === k ? 'current' : 'todo';
    });
    read.querySelector<HTMLElement>('[data-dc-count]')!.textContent = String(k + 1);
    read.querySelector<HTMLButtonElement>('[data-dc-prev]')!.disabled = k === 0;
    const next = read.querySelector<HTMLButtonElement>('[data-dc-next]')!;
    next.disabled = k === STEPS.length - 1;
    // Lien vers le formulaire : sujet + points cochés (et rien d'autre).
    const s = situation(id)!;
    const send = read.querySelector<HTMLAnchorElement>('[data-dc-send]');
    if (send) {
      const url = new URL('/parlons-de-votre-chien/', location.origin);
      url.searchParams.set('sujet', s.topic);
      url.searchParams.set('note', carnetNote(s, observed(id)));
      send.href = url.pathname + url.search;
    }
  };

  const show = (id: string | null, focus = true) => {
    open = id && reads.has(id) ? id : null;
    wrap.classList.toggle('has-open', Boolean(open));
    reads.forEach((r, key) => {
      r.classList.toggle('is-open', key === open);
      r.querySelector<HTMLElement>('[data-dc-nav]')!.hidden = false;
    });
    if (open) {
      refresh(open);
      const read = reads.get(open)!;
      read.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      if (focus) read.querySelector<HTMLElement>('.dc-read__title')?.focus({ preventScroll: true });
    }
  };

  const go = (id: string, delta: number) => {
    const k = Math.max(0, Math.min(STEPS.length - 1, (step.get(id) ?? 0) + delta));
    step.set(id, k);
    refresh(id, delta < 0);
    const current = reads.get(id)!.querySelector<HTMLElement>(`[data-dc-step="${k}"] h3`);
    current?.setAttribute('tabindex', '-1');
    current?.focus({ preventScroll: true });
  };

  const print = (id: string) => {
    const s = situation(id)!;
    const marks = observed(id);
    carnet.replaceChildren(el('h2', `Mon carnet d’observation · ${s.title}`));
    carnet.append(el('h3', 'Ce que j’ai observé ou que je peux décrire'));
    const ul = el('ul');
    const items = s.observe.filter((o) => marks.includes(o.id));
    (items.length ? items : s.observe).forEach((o) => ul.append(el('li', items.length ? o.label : `${o.label} : …`)));
    carnet.append(ul);
    carnet.append(el('h3', 'Questions à se poser'));
    const ol = el('ol');
    s.questions.forEach((q) => ol.append(el('li', q)));
    carnet.append(ol);
    carnet.append(el('h3', 'Mes notes'), el('p', '…'.repeat(60)));
    carnet.append(el('p', 'Carnet préparé avec le décodeur du quotidien de ToutouBien. Aide à l’observation, sans valeur de diagnostic.'));
    window.print();
  };

  wrap.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    const pick = t.closest<HTMLAnchorElement>('[data-dc-pick]');
    if (pick) {
      e.preventDefault();
      history.pushState({ dc: pick.dataset.dcPick }, '', `#${pick.dataset.dcPick}`);
      show(pick.dataset.dcPick!);
      return;
    }
    const read = t.closest<HTMLElement>('[data-dc-read]');
    if (!read) return;
    const id = read.dataset.dcRead!;
    if (t.closest('[data-dc-next]')) go(id, 1);
    else if (t.closest('[data-dc-prev]')) go(id, -1);
    else if (t.closest('[data-dc-print]')) print(id);
    else if (t.closest('[data-dc-close]')) {
      history.pushState({ dc: null }, '', location.pathname);
      show(null);
      wrap.querySelector<HTMLElement>(`[data-dc-pick="${id}"]`)?.focus();
    }
  });
  wrap.addEventListener('change', (e) => {
    const read = (e.target as HTMLElement).closest<HTMLElement>('[data-dc-read]');
    if (read) refresh(read.dataset.dcRead!);
  });
  addEventListener('popstate', () => show(location.hash.slice(1) || null, false));

  // Ouverture directe depuis un lien (/decodeur/#rappel).
  const initial = location.hash.slice(1);
  show(SITUATIONS.some((s) => s.id === initial) ? initial : null, false);
}
