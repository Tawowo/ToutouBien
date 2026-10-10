/**
 * Visionneuse accessible : <dialog> natif (piège du focus et Échap fournis par le navigateur),
 * flèches du clavier, balayage tactile, compteur annoncé, retour du focus sur la vignette.
 *
 * Chaque vignette est un bouton `[data-lb]` portant `data-lb-caption` et, pour une photo,
 * `data-lb-full` (grande image) + `data-lb-alt`. Sans grande image, le contenu `[data-lb-art]`
 * de la vignette est cloné (compositions graphiques).
 */
export function initLightbox(root: ParentNode = document): void {
  const items = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-lb]'));
  if (!items.length) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'lb';
  dialog.setAttribute('aria-label', 'Visionneuse');
  dialog.innerHTML = `
    <div class="lb__stage" data-lb-stage></div>
    <p class="lb__caption"><span class="lb__count" data-lb-count></span><span data-lb-text></span></p>
    <button type="button" class="lb__btn lb__close" data-lb-close aria-label="Fermer la visionneuse">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>
    <button type="button" class="lb__btn lb__prev" data-lb-prev aria-label="Image précédente">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
    </button>
    <button type="button" class="lb__btn lb__next" data-lb-next aria-label="Image suivante">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
    </button>`;
  document.body.append(dialog);

  const stage = dialog.querySelector<HTMLElement>('[data-lb-stage]')!;
  const count = dialog.querySelector<HTMLElement>('[data-lb-count]')!;
  const text = dialog.querySelector<HTMLElement>('[data-lb-text]')!;
  const prevBtn = dialog.querySelector<HTMLButtonElement>('[data-lb-prev]')!;
  const nextBtn = dialog.querySelector<HTMLButtonElement>('[data-lb-next]')!;
  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (i: number, dir = 0) => {
    index = (i + items.length) % items.length;
    const item = items[index]!;
    const node = document.createElement('figure');
    node.className = 'lb__figure';
    if (dir) node.dataset.dir = dir > 0 ? 'next' : 'prev';
    const full = item.dataset.lbFull;
    if (full) {
      const img = document.createElement('img');
      img.src = full;
      img.alt = item.dataset.lbAlt ?? '';
      img.decoding = 'async';
      node.append(img);
    } else {
      const art = item.querySelector('[data-lb-art]');
      if (art) node.append(art.cloneNode(true));
    }
    stage.replaceChildren(node);
    count.textContent = `${index + 1} / ${items.length}`;
    text.textContent = item.dataset.lbCaption ?? '';
    const single = items.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
  };

  items.forEach((item, i) =>
    item.addEventListener('click', () => {
      opener = item;
      show(i);
      dialog.showModal();
      document.documentElement.classList.add('lb-open');
    }),
  );
  prevBtn.addEventListener('click', () => show(index - 1, -1));
  nextBtn.addEventListener('click', () => show(index + 1, 1));
  dialog.querySelector('[data-lb-close]')!.addEventListener('click', () => dialog.close());
  // Un clic sur le fond (hors image et boutons) ferme.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target === stage) dialog.close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') show(index + 1, 1);
    else if (e.key === 'ArrowLeft') show(index - 1, -1);
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(items.length - 1);
    else return;
    e.preventDefault();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('lb-open');
    stage.replaceChildren();
    opener?.focus();
  });

  // Balayage horizontal (tactile ou stylet).
  let x0: number | null = null;
  let y0 = 0;
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    x0 = e.clientX;
    y0 = e.clientY;
  });
  stage.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    const dy = e.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  stage.addEventListener('pointercancel', () => (x0 = null));
}
