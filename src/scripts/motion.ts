/**
 * Mouvement de repli et ciel étoilé partagés par toutes les pages.
 * 1. Révélations au défilement pour les navigateurs sans `animation-timeline: view()`.
 * 2. Parallaxe légère (même condition).
 * 3. Ciels étoilés ([data-sky]) : une seule boucle d'animation pour toute la page, rendue
 *    uniquement pour les ciels visibles, figée en mouvement réduit.
 */
import { initNose } from './nose';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Photographies : chaque photo située sous le premier écran s'ouvre quand elle entre dans le champ,
 * avec un léger décalage entre photos voisines. Les scènes qui animent déjà leurs photos sont exclues.
 */
function initPhotoReveal(): void {
  if (reduced) return;
  const skip = '.op, .tv, .as, .ch__node, .hb, .lb, [data-no-reveal]';
  const photos = Array.from(document.querySelectorAll<HTMLElement>('.ph')).filter((el) => !el.closest(skip) && el.getBoundingClientRect().top > innerHeight * 0.9);
  if (!photos.length) return;
  document.documentElement.classList.add('ph-reveal');
  photos.forEach((el) => el.classList.add('ph-wait'));
  let batch = 0;
  let timer = 0;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const el = e.target as HTMLElement;
        io.unobserve(el);
        window.setTimeout(() => el.classList.remove('ph-wait'), batch++ * 110);
        window.clearTimeout(timer);
        timer = window.setTimeout(() => (batch = 0), 200);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  photos.forEach((el) => io.observe(el));
}

/**
 * Profondeur : tout élément [data-depth="0.2"] glisse verticalement à une vitesse propre selon sa
 * position dans l'écran (valeur positive : plus lent que la page, il semble plus loin ; négative : plus près).
 * Une seule boucle par image, uniquement pour les éléments visibles ; transform seul (pas de recalcul de mise en page).
 */
function initDepth(): void {
  if (reduced) return;
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-depth]'));
  if (!els.length) return;
  const visible = new Set<HTMLElement>();
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    visible.forEach((el) => {
      const r = el.getBoundingClientRect();
      const rel = (r.top + r.height / 2 - vh / 2) / vh; // ≈ -1 … 1
      el.style.setProperty('--depth-y', `${(rel * Number(el.dataset.depth) * vh * 0.35).toFixed(1)}px`);
    });
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement)));
    update();
  }, { rootMargin: '20% 0px' });
  els.forEach((el) => io.observe(el));
  addEventListener('scroll', () => {
    if (!ticking && visible.size) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
}

function initReveals(): void {
  if (reduced || CSS.supports('animation-timeline: view()')) return;
  const root = document.documentElement;
  root.classList.add('io-motion');
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  document.querySelectorAll('.reveal, .reveal-mask, .reveal-scale, .split:not(.split--now), .fil:not(.fil--immediate)').forEach((el) => io.observe(el));

  const parallax = Array.from(document.querySelectorAll<HTMLElement>('.parallax'));
  if (!parallax.length) return;
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = innerHeight;
    for (const el of parallax) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const p = (r.top + r.height / 2 - vh / 2) / vh; // −0,5 … 0,5 environ
      el.style.setProperty('--py-shift', `${(p * 6).toFixed(2)}rem`);
    }
  };
  addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });
  update();
}

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  tw: number;
  ph: number;
}

interface Sky {
  el: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  stars: Star[];
  w: number;
  h: number;
  visible: boolean;
  /** Densité : étoiles par 10 000 px². */
  density: number;
  /** Lignes de constellation entre étoiles proches (sections « lien »). */
  links: boolean;
}

function rand(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function initSkies(): void {
  const hosts = Array.from(document.querySelectorAll<HTMLElement>('[data-sky]'));
  if (!hosts.length) return;
  const skies: Sky[] = [];
  const dpr = Math.min(devicePixelRatio || 1, 1.75);

  const build = (s: Sky) => {
    const r = s.el.getBoundingClientRect();
    s.w = Math.max(1, r.width);
    s.h = Math.max(1, r.height);
    s.canvas.width = s.w * dpr;
    s.canvas.height = s.h * dpr;
    s.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(260, Math.round((s.w * s.h) / 10000 * s.density));
    const rnd = rand(Math.round(s.w + s.h * 7));
    s.stars = Array.from({ length: n }, () => ({ x: rnd(), y: rnd(), z: 0.2 + rnd() * 0.8, r: 0.4 + rnd() * 1.1, tw: 0.4 + rnd() * 1.4, ph: rnd() * 6.28 }));
  };

  const draw = (s: Sky, t: number) => {
    const { ctx, w, h } = s;
    ctx.clearRect(0, 0, w, h);
    const top = s.el.getBoundingClientRect().top;
    const pts: [number, number, number][] = [];
    for (const st of s.stars) {
      // Dérive lente et parallaxe selon la profondeur : les étoiles proches bougent davantage.
      const drift = reduced ? 0 : t * 0.004 * st.z;
      const x = ((st.x + drift) % 1) * w;
      const y = (((st.y * h + (reduced ? 0 : top * 0.06 * st.z)) % h) + h) % h;
      const a = reduced ? 0.55 * st.z : (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * st.tw + st.ph))) * st.z;
      ctx.globalAlpha = a;
      ctx.fillStyle = st.z > 0.85 ? '#dff3ef' : '#9ad3cd';
      ctx.beginPath();
      ctx.arc(x, y, st.r * st.z * 1.2, 0, Math.PI * 2);
      ctx.fill();
      if (s.links && st.z > 0.7) pts.push([x, y, a]);
    }
    if (s.links) {
      ctx.lineWidth = 0.6;
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i]![0] - pts[j]![0];
          const dy = pts[i]![1] - pts[j]![1];
          const d = Math.hypot(dx, dy);
          if (d > 120) continue;
          ctx.globalAlpha = (1 - d / 120) * 0.22 * Math.min(pts[i]![2], pts[j]![2]);
          ctx.strokeStyle = '#9ad3cd';
          ctx.beginPath();
          ctx.moveTo(pts[i]![0], pts[i]![1]);
          ctx.lineTo(pts[j]![0], pts[j]![1]);
          ctx.stroke();
        }
    }
    ctx.globalAlpha = 1;
  };

  for (const el of hosts) {
    const canvas = document.createElement('canvas');
    canvas.className = 'sky';
    canvas.setAttribute('aria-hidden', 'true');
    el.prepend(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    const s: Sky = { el, canvas, ctx, stars: [], w: 1, h: 1, visible: false, density: Number(el.dataset.sky || 1.2), links: el.hasAttribute('data-sky-links') };
    build(s);
    skies.push(s);
  }

  let raf = 0;
  const loop = (now: number) => {
    raf = 0;
    const t = now / 1000;
    let any = false;
    for (const s of skies)
      if (s.visible) {
        draw(s, t);
        any = true;
      }
    if (any && !reduced && !document.hidden) raf = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const s = skies.find((x) => x.el === e.target);
      if (s) s.visible = e.isIntersecting;
    }
    kick();
  });
  skies.forEach((s) => io.observe(s.el));
  new ResizeObserver(() => {
    skies.forEach(build);
    kick();
  }).observe(document.body);
  document.addEventListener('visibilitychange', kick);
}

export function initMotion(): void {
  initNose();
  initPhotoReveal();
  initDepth();
  initReveals();
  initSkies();
}
