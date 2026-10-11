/**
 * Curseur « truffe » : une petite truffe stylisée remplace la flèche, uniquement avec une souris
 * (pointeur précis + survol). Principes :
 *  - la truffe est centrée exactement sur la position du pointeur, sans retard ni inertie ;
 *  - elle n'intercepte jamais les clics (pointer-events: none) ;
 *  - le curseur natif n'est masqué qu'après le premier déplacement réussi, et revient dès que la souris
 *    quitte la fenêtre, survole un champ de saisie, ou qu'un toucher / stylet est utilisé ;
 *  - aucun effet sur écran tactile, en contraste forcé, ni sans JavaScript.
 */
const FIELD = 'input, textarea, select, [contenteditable=""], [contenteditable="true"], iframe';
const ACTION = 'a, button, [role="button"], label, summary, [data-as-go], [tabindex]:not([tabindex="-1"])';

export function initNose(): void {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(forced-colors: active)').matches) return;
  const html = document.documentElement;
  const nose = document.createElement('div');
  nose.className = 'nose';
  nose.setAttribute('aria-hidden', 'true');
  nose.innerHTML =
    '<svg viewBox="0 0 24 18" width="24" height="18"><path d="M12 1.2c4.9 0 10.2 2.3 10.2 6.6 0 4.6-5 8.9-10.2 8.9S1.8 12.4 1.8 7.8C1.8 3.5 7.1 1.2 12 1.2Z"/><ellipse class="nose__n" cx="7.6" cy="8.6" rx="2.3" ry="1.6" transform="rotate(-18 7.6 8.6)"/><ellipse class="nose__n" cx="16.4" cy="8.6" rx="2.3" ry="1.6" transform="rotate(18 16.4 8.6)"/><path class="nose__h" d="M7 4.2c1.6-.9 3.3-1.2 5-1.2"/></svg>';
  document.body.append(nose);
  let on = false;
  const modalOpen = () => {
    try {
      return !!document.querySelector(':modal, :popover-open');
    } catch {
      return !!document.querySelector('dialog[open]');
    }
  };

  const show = (state: boolean) => {
    if (state === on) return;
    on = state;
    html.classList.toggle('has-nose', state);
  };

  addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return show(false);
      nose.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      const t = e.target instanceof Element ? e.target : null;
      // Champ de saisie (curseur texte natif indispensable) ou fenêtre modale (couche supérieure du
      // navigateur, au-dessus de la truffe) : on rend la main au curseur natif.
      const field = !!t?.closest(FIELD) || modalOpen();
      nose.classList.toggle('is-action', !field && !!t?.closest(ACTION));
      show(!field);
    },
    { passive: true },
  );
  addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return show(false);
    nose.classList.add('is-down');
  });
  addEventListener('pointerup', () => nose.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave', () => show(false));
  addEventListener('blur', () => show(false));
}
