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
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const sstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function initOpening(): void {
  const root = document.querySelector<HTMLElement>('[data-opening]');
  if (!root) return;
  const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
  const photo = root.querySelector<HTMLElement>('[data-op-photo]')!;
  const img = photo.querySelector<HTMLImageElement>('img')!;
  const emblemBox = root.querySelector<HTMLElement>('[data-op-emblem]')!;
  const path = root.querySelector<SVGPathElement>('[data-op-emblem-path]')!;
  const sticky = root.querySelector<HTMLElement>('[data-op-sticky]')!;

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
  // Le titre et les particules démarrent ensemble ; si la scène tarde (connexion lente),
  // la photo apparaît sans attendre et la scène ne servira qu'au défilement.
  const fallbackTimer = window.setTimeout(() => {
    root.classList.add('is-playing', 'is-formed');
  }, 1900);

  let scene: OpeningScene | null = null;
  let introStart = performance.now();
  let progress = 0;
  let smooth = 0;
  let raf = 0;
  let visible = true;
  let frames = 0;
  let slow = 0;
  let last = performance.now();

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
    // La photo est mesurée sans la transformation d'échelle appliquée au défilement.
    const prev = photo.style.transform;
    photo.style.transform = 'none';
    const pr = rectIn(photo);
    photo.style.transform = prev;
    scene.layout(c.width, c.height, pr, rectIn(emblemBox));
  };

  /** État de la scène et des textes pour une progression lissée p et un temps d'intro i. */
  const state = (p: number, i: number): OpeningState => {
    const relief = sstep(0.04, 0.32, p);
    const out = sstep(0.62, 0.95, p);
    return {
      intro: i,
      relief: relief * (1 - sstep(0.4, 0.6, p)),
      scatter: sstep(0.26, 0.58, p),
      emblem: sstep(0.52, 0.84, p),
      yaw: (1 - i) * 0.55 + relief * 0.5 * (1 - sstep(0.35, 0.6, p)),
      pitch: (1 - i) * 0.18 + relief * 0.16 * (1 - sstep(0.35, 0.6, p)),
      dust: Math.max(0.35 * (1 - i), sstep(0.2, 0.5, p)) * (1 - out * 0.4),
    };
  };

  const applyText = (p: number) => {
    root.style.setProperty('--op-p', p.toFixed(4));
    root.style.setProperty('--op-out', sstep(0.06, 0.26, p).toFixed(3));
    root.style.setProperty('--op-m', sstep(0.56, 0.86, p).toFixed(3));
    // La vraie photo s'efface dès que les particules reprennent la main.
    const photoA = 1 - sstep(0.015, 0.08, p);
    photo.style.opacity = root.classList.contains('is-formed') ? photoA.toFixed(3) : '';
    const second = root.querySelector<HTMLElement>('[data-op-second]');
    if (second) {
      const shown = p > 0.6;
      if (second.inert === shown) second.inert = !shown;
    }
    const first = root.querySelector<HTMLElement>('[data-op-first]');
    if (first) {
      const shown = p < 0.3;
      if (first.inert === shown) first.inert = !shown;
    }
  };

  const toLite = () => {
    window.clearTimeout(fallbackTimer);
    root.classList.add('is-playing');
    cancelAnimationFrame(raf);
    scene?.dispose();
    scene = null;
    root.dataset.lite = 'true';
    root.classList.add('is-formed');
    canvas.style.opacity = '0';
  };

  const frame = (now: number) => {
    raf = 0;
    if (!scene || !visible) return;
    if (scene.lost) return toLite();
    const i = clamp01((now - introStart) / INTRO_MS);
    // Lissage critique simple : suit le défilement sans à-coups, dans les deux sens.
    smooth += (progress - smooth) * Math.min(1, (now - last) / 1000 * 9);
    const dt = now - last;
    last = now;
    if (i < 1 && ++frames > 8) {
      if (dt > 70) slow++;
      if (slow > 12) return toLite();
    }
    if (i >= 1 && !root.classList.contains('is-formed')) root.classList.add('is-formed');
    applyText(smooth);
    const s = state(smooth, i);
    // Pendant que la vraie photo est affichée et que rien ne bouge, on ne dessine plus rien.
    const idle = i >= 1 && smooth < 0.012 && Math.abs(progress - smooth) < 0.0005 && !scene.rippleActive;
    canvas.style.opacity = idle ? '0' : '1';
    if (!idle) scene.render(s);
    if (!idle || Math.abs(progress - smooth) > 0.0005) raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    if (!raf && visible && scene) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  // Le texte se chorégraphie tout de suite ; la scène se charge à côté.
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
      window.clearTimeout(fallbackTimer);
      // Scène prête à temps : titre et pixels démarrent au même instant. Sinon, pas de seconde intro.
      introStart = root.classList.contains('is-formed') ? performance.now() - INTRO_MS : performance.now();
      root.classList.add('is-playing');
      progress = readProgress();
      wake();
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

  // Toucher la photo : une onde la traverse (la vraie photo s'efface le temps de l'onde).
  photo.addEventListener('click', (e) => {
    if (!scene || !root.classList.contains('is-formed')) return;
    const c = sticky.getBoundingClientRect();
    scene.ripple(e.clientX - c.left, e.clientY - c.top);
    root.classList.add('is-rippling');
    window.setTimeout(() => root.classList.remove('is-rippling'), 2200);
    wake();
  });
  applyText(readProgress());
}
