/**
 * Pilotage de l'ouverture « Du regard au lien ».
 *
 * Séquence d'arrivée (temps) : les pixels de la photo arrivent de la profondeur et la composent
 * (≈ 2,4 s) ; les lettres du titre entrent en même temps (mêmes constantes, voir INTRO_MS) ;
 * la vraie photo, nette, prend ensuite le relais. Rien n'empêche de lire ou de défiler pendant ce temps.
 *
 * Défilement : la photo redevient particules, prend du relief et pivote, se disperse en étoiles
 * puis se recompose en constellation du logo ; le second message apparaît lettre à lettre.
 *
 * Toucher la photo y fait passer une onde. Rendu suspendu hors écran, onglet masqué ou au repos.
 * Repli sans WebGL (ou trop lent) : la même chorégraphie s'applique à la vraie photo en CSS.
 */
import { pickTier, readCapabilities, tierFromQuery } from '../flair/quality';
import type { OpeningScene, OpeningState, Rect } from './scene';

export const INTRO_MS = 2600;
/** Attente maximale de la scène 3D avant de lancer l'arrivée sans elle (mise au point CSS de la vraie photo). */
export const GO_WAIT_MS = 1100;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * États (classes sur la section) :
 *  - aucun       : premier affichage — photo voilée (floue, atténuée), soleil, sur-titre ; jamais d'écran vide ;
 *  - is-playing  : top départ unique du titre (lettres) ;
 *  - is-gathering: arrivée en 3D — le voile s'efface pendant que les pixels composent la photo ;
 *  - is-focusing : arrivée sans 3D (scène pas prête à temps, ou indisponible) — la vraie photo fait sa mise au point ;
 *  - is-formed   : photo nette ; le défilement peut reprendre la main.
 * Le top départ a lieu UNE fois : dès que la scène est prête, ou au plus tard après GO_WAIT_MS.
 * Une scène arrivée en retard ne rejoue pas d'introduction : elle sert au défilement.
 */
export function initOpening(): void {
  const root = document.querySelector<HTMLElement>('[data-opening]');
  if (!root) return;
  const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
  const photo = root.querySelector<HTMLElement>('[data-op-photo]')!;
  const img = photo.querySelector<HTMLImageElement>('img')!;
  const emblemBox = root.querySelector<HTMLElement>('[data-op-emblem]')!;
  const path = root.querySelector<SVGPathElement>('[data-op-emblem-path]')!;
  const sticky = root.querySelector<HTMLElement>('[data-op-sticky]')!;
  const first = root.querySelector<HTMLElement>('[data-op-first]');
  const second = root.querySelector<HTMLElement>('[data-op-second]');

  // Index des lettres pour la chorégraphie du texte (délais calculés en CSS).
  root.querySelectorAll<HTMLElement>('[data-op-chars]').forEach((line) => {
    line.querySelectorAll<HTMLElement>('.op-ch').forEach((ch, i) => ch.style.setProperty('--i', String(i)));
  });

  const cinema = document.documentElement.classList.contains('can-cine');
  root.dataset.mode = cinema ? 'cinema' : 'static';
  if (!cinema) {
    root.classList.add('is-playing', 'is-formed');
    return;
  }

  let scene: OpeningScene | null = null;
  let started = false;
  let with3d = false;
  let introStart = performance.now();
  let progress = 0;
  let smooth = 0;
  let raf = 0;
  let visible = true;
  let frames = 0;
  let slow = 0;
  let last = performance.now();
  let formedTimer = 0;
  let formedAt = 0;
  // Inclinaison au pointeur (ordinateur) : cible et valeur lissée, -1 … 1.
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

  const has = (c: string) => root.classList.contains(c);

  /** Top départ unique de l'arrivée. */
  const go = (useScene: boolean) => {
    if (started) return;
    started = true;
    with3d = useScene;
    introStart = performance.now();
    root.classList.add('is-playing', useScene ? 'is-gathering' : 'is-focusing');
    if (!useScene) formedTimer = window.setTimeout(() => root.classList.add('is-formed'), INTRO_MS);
    wake();
  };
  const goTimer = window.setTimeout(() => go(false), GO_WAIT_MS);

  const readProgress = () => {
    const r = root.getBoundingClientRect();
    const span = r.height - innerHeight;
    return span > 0 ? clamp01(-r.top / span) : 0;
  };

  const rectIn = (el: HTMLElement): Rect => {
    const c = sticky.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { left: r.left - c.left, top: r.top - c.top, width: r.width, height: r.height };
  };

  const layout = () => {
    if (!scene) return;
    const c = sticky.getBoundingClientRect();
    // Mesure sans l'inclinaison au pointeur, pour que les pixels se posent exactement sur la photo.
    photo.classList.add('is-measuring');
    const pr = rectIn(photo);
    photo.classList.remove('is-measuring');
    scene.layout(c.width, c.height, pr, rectIn(emblemBox));
  };

  /** État de la scène pour une progression lissée p et un temps d'intro i. */
  const state = (p: number, i: number): OpeningState => {
    const relief = sstep(0.03, 0.3, p);
    const fade = 1 - sstep(0.36, 0.6, p);
    const out = sstep(0.62, 0.95, p);
    return {
      intro: i,
      relief: relief * fade,
      scatter: sstep(0.24, 0.58, p),
      emblem: sstep(0.5, 0.84, p),
      yaw: (1 - i) * 0.6 + relief * 0.5 * fade + tilt.x * 0.07 * (1 - out),
      pitch: (1 - i) * 0.2 + relief * 0.15 * fade - tilt.y * 0.05 * (1 - out),
      dust: Math.max(0.4 * (1 - i), sstep(0.18, 0.5, p)) * (1 - out * 0.4),
    };
  };

  const applyText = (p: number) => {
    root.style.setProperty('--op-p', p.toFixed(4));
    root.style.setProperty('--op-out', sstep(0.05, 0.24, p).toFixed(3));
    // Sans 3D (mode allégé), rien ne remplit l'écran entre la photo et le logo : la photo se retire donc
    // lentement (elle recule et se voile) pendant que le logo commence à se dessiner, sans écran vide.
    const lite = !!root.dataset.lite;
    const m = lite ? sstep(0.34, 0.74, p) : sstep(0.56, 0.86, p);
    root.style.setProperty('--op-m', m.toFixed(3));
    root.style.setProperty('--op-l', lite ? sstep(0.04, 0.5, p).toFixed(3) : '0');
    // La vraie photo s'efface quand les particules reprennent la main (ou, sans 3D, avant que le logo se dessine).
    const live = has('is-formed') || has('is-focusing');
    photo.style.opacity = live ? (1 - (lite ? sstep(0.12, 0.5, p) : sstep(0.012, 0.07, p))).toFixed(3) : '';
    const shownSecond = m > 0.12;
    if (second && second.inert === shownSecond) second.inert = !shownSecond;
    const shownFirst = p < 0.3;
    if (first && first.inert === shownFirst) first.inert = !shownFirst;
  };

  const toLite = () => {
    window.clearTimeout(goTimer);
    cancelAnimationFrame(raf);
    raf = 0;
    scene?.dispose();
    scene = null;
    root.dataset.lite = 'true';
    canvas.style.opacity = '0';
    if (!started) go(false);
    else if (!has('is-formed')) {
      // Arrivée 3D interrompue : la vraie photo termine l'arrivée par une mise au point.
      root.classList.remove('is-gathering');
      root.classList.add('is-focusing');
      window.clearTimeout(formedTimer);
      formedTimer = window.setTimeout(() => root.classList.add('is-formed'), INTRO_MS * 0.5);
    }
  };

  const frame = (now: number) => {
    raf = 0;
    if (!scene || !visible || !started) return;
    if (scene.lost) return toLite();
    const i = with3d ? clamp01((now - introStart) / INTRO_MS) : 1;
    const raw = now - last;
    const dt = Math.min(64, raw);
    last = now;
    // Lissage exponentiel indépendant de la cadence : suit le défilement sans à-coups, dans les deux sens.
    smooth += (progress - smooth) * (1 - Math.exp(-dt / 110));
    tilt.x += (tilt.tx - tilt.x) * (1 - Math.exp(-dt / 180));
    tilt.y += (tilt.ty - tilt.y) * (1 - Math.exp(-dt / 180));
    if (with3d && i < 1 && ++frames > 8) {
      if (raw > 70) slow++;
      if (slow > 14) return toLite();
    }
    if (with3d && i >= 1 && !has('is-formed')) {
      root.classList.add('is-formed');
      formedAt = now;
    }
    applyText(smooth);
    const settling = Math.abs(progress - smooth) > 0.0004;
    // Photo nette affichée et rien ne bouge : plus aucun rendu WebGL.
    // Les pixels restent affichés le temps que la photo nette finisse d'apparaître dessous (fondu de 700 ms).
    const crossfading = with3d && now - formedAt < 760;
    const idle = i >= 1 && has('is-formed') && !crossfading && smooth < 0.008 && !settling && !scene.rippleActive;
    canvas.style.opacity = idle ? '0' : '1';
    if (!idle) scene.render(state(smooth, i));
    if (!idle || settling) raf = requestAnimationFrame(frame);
  };
  function wake() {
    if (!raf && visible && scene && started) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  const caps = readCapabilities();
  const tier = tierFromQuery(location.search) ?? pickTier(caps);
  if (tier === 'fallback') {
    toLite();
    return;
  }
  const cols = tier === 'high' ? 210 : tier === 'medium' ? 165 : 118;
  const d = path.getAttribute('d') ?? '';
  const vb = path.ownerSVGElement!.viewBox.baseVal;

  import('./scene')
    .then(({ OpeningScene }) => OpeningScene.create({ canvas, image: img, cols, dprMax: tier === 'high' ? 1.75 : 1.4, emblem: { d, box: { x: vb.x, y: vb.y, w: vb.width, h: vb.height } } }))
    .then((s) => {
      scene = s;
      layout();
      root.dataset.ready = 'true';
      progress = readProgress();
      smooth = progress;
      if (!started) {
        window.clearTimeout(goTimer);
        go(true);
      } else wake();
    })
    .catch(() => toLite());

  addEventListener('scroll', () => {
    progress = readProgress();
    if (!scene) applyText(progress);
    wake();
  }, { passive: true });
  new ResizeObserver(() => {
    layout();
    wake();
  }).observe(sticky);
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    wake();
  }).observe(root);
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    wake();
  });

  // Ordinateur : la photo s'incline très légèrement vers le pointeur (rien ne suit le curseur).
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let pending = false;
    sticky.addEventListener('pointermove', (e) => {
      const r = photo.getBoundingClientRect();
      tilt.tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)));
      tilt.ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)));
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          root.style.setProperty('--tx', tilt.tx.toFixed(3));
          root.style.setProperty('--ty', tilt.ty.toFixed(3));
        });
      }
      if (smooth > 0.008) wake();
    });
    sticky.addEventListener('pointerleave', () => {
      tilt.tx = 0;
      tilt.ty = 0;
      root.style.setProperty('--tx', '0');
      root.style.setProperty('--ty', '0');
    });
  }

  // Toucher la photo : une onde la traverse (la vraie photo s'efface le temps de l'onde).
  photo.addEventListener('click', (e) => {
    if (!scene || !has('is-formed') || smooth > 0.02) return;
    const c = sticky.getBoundingClientRect();
    scene.ripple(e.clientX - c.left, e.clientY - c.top);
    root.classList.add('is-rippling');
    window.setTimeout(() => root.classList.remove('is-rippling'), 2300);
    wake();
  });
  applyText(readProgress());
}
