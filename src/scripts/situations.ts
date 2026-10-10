/**
 * Sélection « C'est mon cas » sur les pages d'accompagnement :
 * met à jour le résumé et transmet la sélection au parcours de contact (paramètre ?note=).
 */
export function initSituations(root: ParentNode = document): void {
  const section = root.querySelector<HTMLElement>('[data-situations]');
  if (!section) return;
  const summary = section.querySelector<HTMLElement>('[data-sit-summary]');
  const link = section.querySelector<HTMLAnchorElement>('[data-sit-link]');
  const topic = section.dataset.topic;
  const boxes = Array.from(section.querySelectorAll<HTMLInputElement>('[data-situation]'));

  const update = () => {
    const picked = boxes.filter((b) => b.checked).map((b) => b.value);
    if (summary) {
      summary.textContent = picked.length
        ? `${picked.length} situation${picked.length > 1 ? 's' : ''} sélectionnée${picked.length > 1 ? 's' : ''} : ${picked.join(', ')}.`
        : 'Aucune situation sélectionnée pour l’instant.';
    }
    if (link) {
      const url = new URL('/parlons-de-votre-chien/', location.origin);
      if (topic) url.searchParams.set('sujet', topic);
      if (picked.length) url.searchParams.set('note', `Je me reconnais dans : ${picked.join(' ; ')}.`);
      link.href = url.pathname + url.search;
    }
  };
  boxes.forEach((b) => b.addEventListener('change', update));
  update();
}
