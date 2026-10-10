/**
 * Pilotage de la scène d'accueil.
 * - Rien n'est chargé si l'appareil ne s'y prête pas (pas de WebGL 2, mouvement réduit,
 *   économie de données) : l'illustration statique et les textes restent affichés.
 * - Three.js (≈ 130 Ko compressés) est importé à la demande, dans un fichier séparé.
 * - Le rendu est suspendu hors écran et quand l'onglet est masqué.
 */
import { pickTier, readCapabilities, tierFromQuery } from './quality';
import type { FlairScene } from './scene';

export function initFlairHero(): void {
  const section = document.querySelector<HTMLElement>('[data-cine]');
  const canvas = section?.querySelector<HTMLCanvasElement>('canvas');
  if (!section || !canvas) return;

  const tier = tierFromQuery(location.search) ?? pickTier(readCapabilities());
  section.dataset.tier = tier;
  if (tier === 'fallback') return;

  section.dataset.mode = 'cinema';
  const emblem = section.querySelector<SVGPathElement>('[data-emblem-path]');
  const svg = emblem?.ownerSVGElement;
  if (!emblem || !svg) return;
  const vb = svg.viewBox.baseVal;

  let scene: FlairScene | null = null;
  let visible = true;
  let ticking = false;

  const toStatic = () => {
    section.dataset.mode = 'static';
    scene?.dispose();
    scene = null;
  };

  const progress = (): number => {
    const r = section.getBoundingClientRect();
    const span = r.height - innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  };

  const update = () => {
    ticking = false;
    const p = progress();
    section.style.setProperty('--p', p.toFixed(4));
    const chapter = p < 0.1 ? 0 : p < 0.42 ? 1 : p < 0.72 ? 2 : 3;
    if (section.dataset.chapter !== String(chapter)) section.dataset.chapter = String(chapter);
    // 1 = rencontre (dès l'arrivée) → 2 = balade → 3 = lien
    const toWalk = Math.min(1, Math.max(0, (p - 0.36) / 0.18));
    const toLink = Math.min(1, Math.max(0, (p - 0.68) / 0.2));
    scene?.setMorph(1 + toWalk + toLink);
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  const load = async () => {
    try {
      const { FlairScene } = await import('./scene');
      scene = new FlairScene({
        canvas,
        emblemPath: emblem.getAttribute('d') ?? '',
        emblemBox: { x: vb.x, y: vb.y, w: vb.width, h: vb.height },
        tier,
        onFallback: toStatic,
      });
      section.dataset.ready = 'true';
      update();
      if (visible && !document.hidden) scene.start();
    } catch {
      toStatic();
    }
  };

  // Chargement à l'approche de la scène (elle est en haut de page : presque immédiat).
  const near = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      near.disconnect();
      void load();
    }
  }, { rootMargin: '300px' });
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
    update();
  }).observe(canvas);

  section.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || !scene) return;
    const r = canvas.getBoundingClientRect();
    scene.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
  });
  section.addEventListener('pointerleave', () => scene?.setPointer(null));
  update();
}
