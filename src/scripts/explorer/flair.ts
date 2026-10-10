/**
 * « Le monde par le nez » : rendu Canvas 2D.
 * Les odeurs sont invisibles ; la truffe (souris, doigt ou flèches du clavier)
 * les révèle localement, comme une lampe. Le vent étire les panaches.
 */
import { FOUND_RADIUS, SCENTS, distanceTo, levelWord, sniff, type Wind } from '~/lib/flair-field';
import { mulberry32 } from '~/scripts/flair/shapes';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  color: string;
  size: number;
}

export function initFlairField(root: ParentNode = document): void {
  const wrap = root.querySelector<HTMLElement>('[data-flair-field]');
  const canvas = wrap?.querySelector<HTMLCanvasElement>('canvas');
  if (!wrap || !canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  wrap.dataset.enhanced = 'true';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = <T extends Element>(sel: string) => wrap.querySelector<T>(sel)!;
  const meter = $<HTMLElement>('[data-meter]');
  const meterWord = $<HTMLElement>('[data-meter-word]');
  const live = $<HTMLElement>('[data-live]');
  const card = $<HTMLElement>('[data-card]');
  const cardTitle = $<HTMLElement>('[data-card-title]');
  const cardText = $<HTMLElement>('[data-card-text]');
  const count = $<HTMLElement>('[data-count]');
  const windAngle = $<HTMLInputElement>('[data-wind-angle]');
  const windStrength = $<HTMLInputElement>('[data-wind-strength]');
  const revealAll = $<HTMLInputElement>('[data-reveal-all]');
  const reset = $<HTMLButtonElement>('[data-reset]');
  const hint = $<HTMLElement>('[data-hint]');

  const bg = document.createElement('canvas');
  const layer = document.createElement('canvas');
  const lctx = layer.getContext('2d')!;
  let W = 1;
  let H = 1;
  let dpr = 1;
  const nose = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let interacted = false;
  let lastLevelWord = '';
  const found = new Set<string>();
  const particles: Particle[] = [];
  const rand = mulberry32(42);
  let running = false;
  let raf = 0;
  let last = performance.now();
  let pulse = 0;

  // Halos lumineux pré-rendus (un par couleur) : plus doux et plus rapides que des cercles.
  const sprites = new Map<string, HTMLCanvasElement>();
  const sprite = (color: string) => {
    let c = sprites.get(color);
    if (c) return c;
    c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, color);
    grad.addColorStop(0.25, color + 'aa');
    grad.addColorStop(1, color + '00');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    sprites.set(color, c);
    return c;
  };

  const wind = (): Wind => ({ angle: (Number(windAngle.value) * Math.PI) / 180, strength: Number(windStrength.value) / 100 });

  // ---------- Décor (dessiné une fois par taille) ----------
  const paintBackground = () => {
    const b = bg.getContext('2d')!;
    bg.width = W * dpr;
    bg.height = H * dpr;
    b.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = b.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
    g.addColorStop(0, '#24392f');
    g.addColorStop(1, '#0f1b17');
    b.fillStyle = g;
    b.fillRect(0, 0, W, H);
    const r = mulberry32(7);
    // Sentier
    b.strokeStyle = 'rgba(214, 197, 168, 0.13)';
    b.lineWidth = Math.max(18, W * 0.045);
    b.lineCap = 'round';
    b.beginPath();
    b.moveTo(-20, H * 0.55);
    b.bezierCurveTo(W * 0.25, H * 0.35, W * 0.45, H * 0.85, W * 0.7, H * 0.5);
    b.bezierCurveTo(W * 0.85, H * 0.3, W * 0.95, H * 0.42, W + 20, H * 0.38);
    b.stroke();
    // Herbes
    for (let i = 0; i < (W * H) / 260; i++) {
      const x = r() * W;
      const y = r() * H;
      const l = 3 + r() * 7;
      b.strokeStyle = `rgba(${150 + r() * 50}, ${190 + r() * 40}, ${150 + r() * 30}, ${0.05 + r() * 0.08})`;
      b.lineWidth = 1;
      b.beginPath();
      b.moveTo(x, y);
      b.lineTo(x + (r() - 0.5) * 3, y - l);
      b.stroke();
    }
    // Fleurs
    for (let i = 0; i < 60; i++) {
      b.fillStyle = r() > 0.5 ? 'rgba(242,192,138,0.35)' : 'rgba(241,236,227,0.3)';
      b.beginPath();
      b.arc(r() * W, r() * H, 1 + r() * 1.5, 0, Math.PI * 2);
      b.fill();
    }
    // Vignettage
    const v = b.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
    v.addColorStop(0, 'rgba(0,0,0,0)');
    v.addColorStop(1, 'rgba(0,0,0,0.45)');
    b.fillStyle = v;
    b.fillRect(0, 0, W, H);
    // Arbre (vu du dessus) et haie
    const tree = SCENTS[0]!;
    const tg = b.createRadialGradient(tree.x * W, tree.y * H, 0, tree.x * W, tree.y * H, W * 0.09);
    tg.addColorStop(0, 'rgba(20, 38, 30, 0.95)');
    tg.addColorStop(1, 'rgba(20, 38, 30, 0)');
    b.fillStyle = tg;
    b.beginPath();
    b.arc(tree.x * W, tree.y * H, W * 0.09, 0, Math.PI * 2);
    b.fill();
    b.fillStyle = 'rgba(16, 30, 24, 0.85)';
    for (let i = 0; i < 18; i++) {
      b.beginPath();
      b.arc(W * (0.55 + i * 0.026), H * (0.1 + Math.sin(i) * 0.015), W * 0.022, 0, Math.PI * 2);
      b.fill();
    }
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    W = Math.max(1, rect.width);
    H = Math.max(1, rect.height);
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    layer.width = W * dpr;
    layer.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBackground();
    if (!running) draw(0);
  };

  // ---------- Particules d'odeur ----------
  const emit = (dt: number) => {
    const w = wind();
    for (const s of SCENTS) {
      const rate = (reduced ? 0 : 60) * s.strength * dt;
      let n = Math.floor(rate) + (rand() < rate % 1 ? 1 : 0);
      while (n-- > 0 && particles.length < 900) {
        const a = rand() * Math.PI * 2;
        const sp = 0.004 + rand() * 0.01;
        particles.push({
          x: s.x + (rand() - 0.5) * 0.01,
          y: s.y + (rand() - 0.5) * 0.01,
          vx: Math.cos(a) * sp + Math.cos(w.angle) * w.strength * 0.15,
          vy: Math.sin(a) * sp + Math.sin(w.angle) * w.strength * 0.15,
          age: 0,
          life: 2.5 + rand() * 3.5 * (0.6 + w.strength),
          color: s.color,
          size: 4 + rand() * 7,
        });
      }
    }
  };

  // Mouvement réduit : panaches figés, calculés une fois.
  const seedStatic = () => {
    particles.length = 0;
    const w = wind();
    for (const s of SCENTS) {
      for (let i = 0; i < 90 * s.strength; i++) {
        const t = rand() * (1 + w.strength * 3);
        const a = rand() * Math.PI * 2;
        const spread = 0.01 + t * 0.03;
        particles.push({
          x: s.x + Math.cos(w.angle) * w.strength * t * 0.15 + Math.cos(a) * spread,
          y: s.y + Math.sin(w.angle) * w.strength * t * 0.15 + Math.sin(a) * spread,
          vx: 0,
          vy: 0,
          age: 0,
          life: 9999,
          color: s.color,
          size: 4 + rand() * 6,
        });
      }
    }
  };

  const step = (dt: number) => {
    if (reduced) return;
    emit(dt);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]!;
      p.age += dt;
      if (p.age > p.life) {
        particles.splice(i, 1);
        continue;
      }
      p.vx += (rand() - 0.5) * 0.02 * dt;
      p.vy += (rand() - 0.5) * 0.02 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  };

  // ---------- Dessin ----------
  const draw = (dt: number) => {
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(bg, 0, 0, W, H);

    lctx.globalCompositeOperation = 'source-over';
    lctx.clearRect(0, 0, W, H);
    lctx.globalCompositeOperation = 'lighter';
    for (const p of particles) {
      const fade = p.life > 999 ? 0.55 : Math.sin((p.age / p.life) * Math.PI);
      lctx.globalAlpha = 0.42 * fade;
      lctx.drawImage(sprite(p.color), p.x * W - p.size, p.y * H - p.size, p.size * 2, p.size * 2);
    }
    lctx.globalAlpha = 1;
    if (!revealAll.checked) {
      // La truffe révèle ce qui l'entoure : masque radial.
      const R = Math.max(110, Math.min(W, H) * 0.3);
      const m = lctx.createRadialGradient(nose.x * W, nose.y * H, 0, nose.x * W, nose.y * H, R);
      m.addColorStop(0, 'rgba(0,0,0,1)');
      m.addColorStop(0.55, 'rgba(0,0,0,0.6)');
      m.addColorStop(1, 'rgba(0,0,0,0)');
      lctx.globalCompositeOperation = 'destination-in';
      lctx.fillStyle = m;
      lctx.fillRect(0, 0, W, H);
    }
    lctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(layer, 0, 0, W, H);

    // Sources trouvées
    for (const s of SCENTS) {
      if (!found.has(s.id)) continue;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = 'rgba(241,236,227,0.9)';
      ctx.font = '500 12px "DM Mono", monospace';
      ctx.fillText(s.label, s.x * W + 16, s.y * H + 4);
    }

    // La truffe et ses ondes de reniflement
    const { level } = sniff(nose.x, nose.y, wind(), W / H);
    pulse += dt * (1.5 + level * 6);
    const nx = nose.x * W;
    const ny = nose.y * H;
    for (let k = 0; k < 3; k++) {
      const ph = (pulse + k / 3) % 1;
      ctx.strokeStyle = `rgba(242, 192, 138, ${(1 - ph) * (0.15 + level * 0.6)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(nx, ny, 14 + ph * (30 + level * 40), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#0c1513';
    ctx.beginPath();
    ctx.ellipse(nx, ny, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9ad3cd';
    ctx.beginPath();
    ctx.ellipse(nx, ny, 11, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0c1513';
    ctx.beginPath();
    ctx.ellipse(nx - 4, ny + 1, 2.4, 3.2, -0.3, 0, Math.PI * 2);
    ctx.ellipse(nx + 4, ny + 1, 2.4, 3.2, 0.3, 0, Math.PI * 2);
    ctx.fill();

    updateHud(level);
  };

  const updateHud = (level: number) => {
    meter.style.setProperty('--v', level.toFixed(3));
    const word = levelWord(level);
    meterWord.textContent = `Odeur ${word}`;
    if (word !== lastLevelWord && interacted) {
      lastLevelWord = word;
      live.textContent = `Odeur ${word}.`;
    }
    for (const s of SCENTS) {
      if (!found.has(s.id) && distanceTo(s, nose.x, nose.y, W / H) < FOUND_RADIUS) discover(s.id);
    }
  };

  const discover = (id: string) => {
    const s = SCENTS.find((x) => x.id === id);
    if (!s) return;
    found.add(id);
    cardTitle.textContent = s.label;
    cardText.textContent = s.text;
    card.hidden = false;
    card.classList.remove('is-new');
    void card.offsetWidth;
    card.classList.add('is-new');
    count.textContent = `${found.size} / ${SCENTS.length}`;
    wrap.querySelector<HTMLElement>(`[data-scent="${id}"]`)?.classList.add('is-found');
    live.textContent = `Trouvé : ${s.label}. ${s.text}`;
    if (found.size === SCENTS.length) wrap.classList.add('is-complete');
  };

  // ---------- Boucle ----------
  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!interacted && !reduced) {
      // Flânerie d'attente : la truffe se promène pour inviter à jouer.
      const t = now / 1000;
      nose.tx = 0.5 + Math.sin(t * 0.35) * 0.28;
      nose.ty = 0.5 + Math.sin(t * 0.52) * 0.22;
    }
    const k = Math.min(1, dt * (interacted ? 7 : 1.5));
    nose.x += (nose.tx - nose.x) * k;
    nose.y += (nose.ty - nose.y) * k;
    step(dt);
    draw(dt);
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // ---------- Commandes ----------
  const firstInteraction = () => {
    if (interacted) return;
    interacted = true;
    hint.classList.add('is-gone');
  };
  const moveTo = (clientX: number, clientY: number) => {
    const r = canvas.getBoundingClientRect();
    nose.tx = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    nose.ty = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    firstInteraction();
    if (reduced) {
      nose.x = nose.tx;
      nose.y = nose.ty;
      draw(0);
    }
  };
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' && e.buttons === 0) return;
    moveTo(e.clientX, e.clientY);
  });
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    moveTo(e.clientX, e.clientY);
  });
  canvas.addEventListener('keydown', (e) => {
    const stepSize = e.shiftKey ? 0.06 : 0.025;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-stepSize, 0], ArrowRight: [stepSize, 0], ArrowUp: [0, -stepSize], ArrowDown: [0, stepSize] };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    if (!interacted) {
      nose.tx = nose.x;
      nose.ty = nose.y;
    }
    firstInteraction();
    nose.tx = Math.min(1, Math.max(0, nose.tx + m[0]));
    nose.ty = Math.min(1, Math.max(0, nose.ty + m[1]));
    if (reduced) {
      nose.x = nose.tx;
      nose.y = nose.ty;
      draw(0);
    }
  });

  const onWind = () => {
    wrap.style.setProperty('--wind-angle', `${windAngle.value}deg`);
    $<HTMLElement>('[data-wind-out]').textContent = Number(windStrength.value) < 2 ? 'Calme' : `${windStrength.value} %`;
    if (reduced) {
      seedStatic();
      draw(0);
    }
  };
  windAngle.addEventListener('input', onWind);
  windStrength.addEventListener('input', onWind);
  revealAll.addEventListener('change', () => draw(0));
  reset.addEventListener('click', () => {
    found.clear();
    count.textContent = `0 / ${SCENTS.length}`;
    wrap.querySelectorAll('.is-found').forEach((el) => el.classList.remove('is-found'));
    wrap.classList.remove('is-complete');
    card.hidden = true;
    live.textContent = 'Le pré est réinitialisé.';
    draw(0);
  });
  wrap.querySelectorAll<HTMLButtonElement>('[data-scent]').forEach((btn) =>
    btn.addEventListener('click', () => {
      // Accès direct à une odeur (alternative au pointeur).
      const s = SCENTS.find((x) => x.id === btn.dataset.scent);
      if (!s) return;
      firstInteraction();
      nose.tx = s.x;
      nose.ty = s.y;
      if (reduced) {
        nose.x = s.x;
        nose.y = s.y;
        draw(0);
      }
    }),
  );

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => (entries.some((e) => e.isIntersecting) && !reduced ? start() : stop())).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : !reduced && start()));
  onWind();
  if (reduced) seedStatic();
  resize();
}
