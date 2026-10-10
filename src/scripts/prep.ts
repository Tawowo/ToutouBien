/**
 * Centre de préparation du premier rendez-vous.
 * Tout reste en mémoire dans la page : aucune donnée n'est enregistrée ni envoyée.
 */
export function initPrep(root: ParentNode = document): void {
  const wrap = root.querySelector<HTMLElement>('[data-prep]');
  const form = wrap?.querySelector<HTMLFormElement>('[data-prep-form]');
  if (!wrap || !form) return;
  const count = wrap.querySelector<HTMLElement>('[data-prep-count]');
  const recap = wrap.querySelector<HTMLElement>('[data-prep-recap-body]');
  const send = wrap.querySelector<HTMLAnchorElement>('[data-prep-send]');
  const checks = Array.from(form.querySelectorAll<HTMLInputElement>('[data-prep-check]'));
  const questions = Array.from(form.querySelectorAll<HTMLInputElement>('[data-prep-question]'));
  const notes = Array.from(form.querySelectorAll<HTMLTextAreaElement>('[data-prep-note]'));

  const el = (tag: string, text?: string) => {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    return node;
  };

  const update = () => {
    const done = checks.filter((c) => c.checked).length;
    if (count) count.textContent = String(done);
    wrap.style.setProperty('--prep', (done / checks.length).toFixed(3));

    if (recap) {
      recap.replaceChildren();
      const ready = checks.filter((c) => c.checked).map((c) => c.value);
      if (ready.length) {
        recap.append(el('h3', 'Points préparés'));
        const ul = el('ul');
        ready.forEach((r) => ul.append(el('li', r)));
        recap.append(ul);
      }
      notes.filter((n) => n.value.trim()).forEach((n) => {
        recap.append(el('h3', n.dataset.prepNote ?? 'Notes'));
        recap.append(el('p', n.value.trim()));
      });
      const qs = questions.filter((q) => q.checked).map((q) => q.value);
      if (qs.length) {
        recap.append(el('h3', 'Mes questions'));
        const ul = el('ul');
        qs.forEach((q) => ul.append(el('li', q)));
        recap.append(ul);
      }
      if (!recap.childElementCount) recap.append(el('p', 'Cochez des éléments ou ajoutez des notes pour composer votre récapitulatif.'));
    }

    if (send) {
      const text = notes
        .filter((n) => n.value.trim())
        .map((n) => `${n.dataset.prepNote} : ${n.value.trim()}`)
        .join(' — ');
      const url = new URL('/parlons-de-votre-chien/', location.origin);
      if (text) url.searchParams.set('note', text.slice(0, 1000));
      send.href = url.pathname + url.search;
    }
  };

  form.addEventListener('input', update);
  form.addEventListener('change', update);
  wrap.querySelector<HTMLButtonElement>('[data-prep-print]')?.addEventListener('click', () => {
    update();
    window.print();
  });
  update();
}
