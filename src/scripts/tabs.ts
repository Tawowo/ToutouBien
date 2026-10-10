/**
 * Onglets accessibles (motif ARIA « tabs ») : flèches, Début, Fin.
 * Sans JavaScript, tous les panneaux restent visibles les uns sous les autres.
 */
export function initTabs(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-tabs]').forEach((group) => {
    const tabs = Array.from(group.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
    const panels = tabs.map((t) => group.querySelector<HTMLElement>(`#${t.getAttribute('aria-controls')}`));
    group.classList.add('is-tabbed');
    const select = (i: number, focus = false) => {
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = panels[k];
        if (panel) panel.hidden = !on;
      });
      group.dataset.active = String(i);
      if (focus) tabs[i]?.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const n = tabs.length;
        const map: Record<string, number> = { ArrowDown: (i + 1) % n, ArrowRight: (i + 1) % n, ArrowUp: (i - 1 + n) % n, ArrowLeft: (i - 1 + n) % n, Home: 0, End: n - 1 };
        const next = map[e.key];
        if (next === undefined) return;
        e.preventDefault();
        select(next, true);
      });
    });
    select(0);
  });
}
