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

  // Même décision que le script en ligne de Base.astro (avant le premier rendu) : pas de décalage.
  if (!document.documentElement.classList.contains('can-cine')) {
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

  const marks = Array.from(section.querySelectorAll<HTMLElement>('[data-mark]'));
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
    if (!scene && section.dataset.lite === 'true') svg.style.opacity = String(1 - t.walk * 0.75);
    const chapter = String(t.chapter);
    if (section.dataset.chapter !== chapter) section.dataset.chapter = chapter;
  };

  /**
   * Repli en cours de visite (appareil trop lent, contexte WebGL perdu, échec de chargement,
   * préférence de mouvement réduit activée) : on garde la mise en scène défilante et la
   * synchronisation des textes, seules les particules cèdent la place au logo dessiné.
   * La hauteur de la section ne change pas : aucun saut de page.
   */
  const toLite = () => {
    section.dataset.ready = 'false';
    section.dataset.lite = 'true';
    scene?.dispose();
    scene = null;
    apply(progress());
  };

  const onScroll = () => {
    const p = progress();
    if (scene) scene.setProgress(p);
    else apply(p);
  };

  const load = async () => {
    // Le test des capacités (création d'un contexte d'essai) a lieu ici, au repos du navigateur.
    const tier = tierFromQuery(location.search) ?? pickTier(readCapabilities());
    section.dataset.tier = tier;
    if (tier === 'fallback') {
      toLite();
      return;
    }
    try {
      const { FlairScene } = await import('./scene');
      scene = new FlairScene({
        canvas,
        emblemPath: emblem.getAttribute('d') ?? '',
        emblemBox: { x: vb.x, y: vb.y, w: vb.width, h: vb.height },
        tier,
        onProgress: apply,
        onMarks: (list) => {
          // Un mot qui tomberait sur le bloc de texte du chapitre est masqué (lisibilité, surtout sur mobile).
          const card = blocks.walk?.getBoundingClientRect();
          const top = canvas.getBoundingClientRect().top;
          list.forEach((m, i) => {
            const el = marks[i];
            if (!el) return;
            const y = m.y + top;
            const covered = card && y > card.top - 24 && y < card.bottom + 24 && m.x > card.left - 40 && m.x - 200 < card.right;
            el.style.opacity = (covered ? 0 : m.a).toFixed(3);
            // Mot à gauche de l'étoile, pour ne pas recouvrir le duo qui passe sur le jalon.
            el.style.transform = `translate3d(${(m.x - 18 - m.a * 8).toFixed(1)}px, ${m.y.toFixed(1)}px, 0) translate(-100%, -50%)`;
          });
        },
        onFallback: toLite,
      });
      section.dataset.ready = 'true';
      scene.setProgress(progress());
      if (visible && !document.hidden) scene.start();
    } catch {
      toLite();
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

  // Préférence « réduire les animations » activée pendant la visite : version statique immédiate.
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    if (e.matches) toLite();
  });

  addEventListener('scroll', onScroll, { passive: true });
  new ResizeObserver(() => {
    scene?.resize();
    onScroll();
  }).observe(canvas);
  apply(progress());
}
