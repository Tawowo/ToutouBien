/**
 * Pilotage de la scène d'accueil.
 * - Rien n'est chargé si l'appareil ne s'y prête pas (pas de WebGL 2, mouvement réduit,
 *   économie de données) : l'illustration statique et les textes restent affichés.
 * - Three.js est importé à la demande, dans un fichier séparé.
 * - Le rendu est suspendu hors écran et quand l'onglet est masqué.
 * - Textes et particules partagent la même progression lissée (voir timeline.ts).
 */
import { pickTier, readCapabilities, tierFromQuery } from './quality';
import { timeline } from './timeline';
import type { FlairScene } from './scene';

export function initFlairHero(): void {
  const section = document.querySelector<HTMLElement>('[data-cine]');
  const canvas = section?.querySelector<HTMLCanvasElement>('canvas');
  if (!section || !canvas) return;

  const tier = tierFromQuery(location.search) ?? pickTier(readCapabilities());
  section.dataset.tier = tier;
  if (tier === 'fallback') {
    section.dataset.mode = 'static';
    return;
  }

  const emblem = section.querySelector<SVGPathElement>('[data-emblem-path]');
  const svg = emblem?.ownerSVGElement;
  if (!emblem || !svg) {
    section.dataset.mode = 'static';
    return;
  }
  section.dataset.mode = 'cinema';
  const vb = svg.viewBox.baseVal;
  const blocks = {
    intro: section.querySelector<HTMLElement>('[data-block="intro"]'),
    walk: section.querySelector<HTMLElement>('[data-block="walk"]'),
    link: section.querySelector<HTMLElement>('[data-block="link"]'),
  };

  let scene: FlairScene | null = null;
  let visible = true;

  const progress = (): number => {
    const r = section.getBoundingClientRect();
    const span = r.height - innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  };

  /** Applique la progression (lissée par la scène) aux textes. */
  const apply = (p: number) => {
    const t = timeline(p);
    section.style.setProperty('--p', p.toFixed(4));
    for (const [key, el] of Object.entries(blocks)) {
      if (!el) continue;
      const a = t[key as keyof typeof blocks];
      el.style.setProperty('--a', a.toFixed(3));
      // Un bloc invisible ne doit ni capter les clics ni être atteint au clavier.
      const shown = a > 0.02;
      if (el.inert === shown) el.inert = !shown;
    }
    const chapter = String(t.chapter);
    if (section.dataset.chapter !== chapter) section.dataset.chapter = chapter;
  };

  const toStatic = () => {
    section.dataset.mode = 'static';
    Object.values(blocks).forEach((el) => {
      if (el) {
        el.inert = false;
        el.style.removeProperty('--a');
      }
    });
    scene?.dispose();
    scene = null;
  };

  const onScroll = () => {
    const p = progress();
    if (scene) scene.setProgress(p);
    else apply(p);
  };

  const load = async () => {
    try {
      const { FlairScene } = await import('./scene');
      scene = new FlairScene({
        canvas,
        emblemPath: emblem.getAttribute('d') ?? '',
        emblemBox: { x: vb.x, y: vb.y, w: vb.width, h: vb.height },
        tier,
        onProgress: apply,
        onFallback: toStatic,
      });
      section.dataset.ready = 'true';
      scene.setProgress(progress());
      if (visible && !document.hidden) scene.start();
    } catch {
      toStatic();
    }
  };

  // Chargement à l'approche de la scène (elle est en haut de page : presque immédiat).
  const near = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        near.disconnect();
        // Chargement quand le navigateur est disponible : le texte et le logo statique s'affichent d'abord.
        const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
        if (idle) idle(() => void load(), { timeout: 1200 });
        else setTimeout(() => void load(), 200);
      }
    },
    { rootMargin: '300px' },
  );
  near.observe(section);

  // Rendu suspendu hors écran.
  new IntersectionObserver((entries) => {
    visible = entries.some((e) => e.isIntersecting);
    if (!scene) return;
    if (visible && !document.hidden) scene.start();
    else scene.stop();
  }).observe(section);
  document.addEventListener('visibilitychange', () => {
    if (!scene) return;
    if (document.hidden) scene.stop();
    else if (visible) scene.start();
  });

  addEventListener('scroll', onScroll, { passive: true });
  new ResizeObserver(() => {
    scene?.resize();
    onScroll();
  }).observe(canvas);
  apply(progress());
}
