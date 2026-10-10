/**
 * Aperçu qui suit le pointeur au survol d'une liste (souris uniquement).
 * Le contenu reste accessible sans cet effet : l'aperçu est décoratif.
 */
export function initHoverPreview(root: ParentNode = document): void {
  if (!matchMedia('(pointer: fine)').matches) return;
  root.querySelectorAll<HTMLElement>('[data-hover-list]').forEach((list) => {
    const preview = list.querySelector<HTMLElement>('[data-hover-preview]');
    if (!preview) return;
    list.classList.add('has-hover-preview');
    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loop = () => {
      x += (tx - x) * (reduced ? 1 : 0.18);
      y += (ty - y) * (reduced ? 1 : 0.18);
      preview.style.setProperty('--px', `${x}px`);
      preview.style.setProperty('--py', `${y}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    list.addEventListener('pointermove', (e) => {
      const r = list.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    list.querySelectorAll<HTMLElement>('[data-hover-item]').forEach((item) => {
      const show = () => {
        preview.dataset.active = item.dataset.hoverItem ?? '';
        list.classList.add('is-previewing');
      };
      item.addEventListener('pointerenter', show);
      item.addEventListener('focusin', show);
    });
    list.addEventListener('pointerleave', () => list.classList.remove('is-previewing'));
    list.addEventListener('focusout', () => list.classList.remove('is-previewing'));
  });
}
