/**
 * « Le monde par le nez » : rendu Canvas 2D + couche HTML.
 * - Les odeurs sont invisibles ; la truffe (souris, toucher ou flèches du clavier)
 *   les révèle localement. Le vent étire les panaches.
 * - Une fois trouvée, chaque source devient un vrai bouton HTML posé sur le pré :
 *   lisible au-dessus de la fumée, cliquable, accessible au clavier et au toucher.
 * - Un état unique (`select`) pilote la liste, les marqueurs et le carnet : cliquer une odeur,
 *   trouvée ou non, donne toujours un résultat visible.
 */
import { FOUND_RADIUS, SCENTS, distanceTo, levelWord, sniff, type Wind } from '~/lib/flair-field';
import { mulberry32 } from '~/scripts/flair/shapes';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  color: string;
  size: number;
}

const MAX_PARTICLES = 700;

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
  const note = $<HTMLElement>('[data-note]');
  const noteStatus = $<HTMLElement>('[data-note-status]');
  const noteTitle = $<HTMLElement>('[data-note-title]');
  const noteText = $<HTMLElement>('[data-note-text]');
  const count = $<HTMLElement>('[data-count]');
  const windAngle = $<HTMLInputElement>('[data-wind-angle]');
  const windStrength = $<HTMLInputElement>('[data-wind-strength]');
  const revealAll = $<HTMLInputElement>('[data-reveal-all]');
  const reset = $<HTMLButtonElement>('[data-reset]');
  const hint = $<HTMLElement>('[data-hint]');
  const listButtons = Array.from(wrap.querySelectorAll<HTMLButtonElement>('[data-scent]'));
  const markers = Array.from(wrap.querySelectorAll<HTMLButtonElement>('[data-marker]'));
  const intro = { status: noteStatus.textContent ?? '', title: noteTitle.textContent ?? '', text: noteText.textContent ?? '' };

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
  // Sources dans le rayon de la truffe : la découverte se déclenche à l'entrée, pas en continu.
  const inside = new Set<string>();
  let selected: string | null = null;
  const particles: Particle[] = [];
  const rand = mulberry32(42);
  let running = false;
  let raf = 0;
  let last = performance.now();
  let pulse = 0;

  // Halos pré-rendus (un par couleur) : doux et peu coûteux.
  const sprites = new Map<string, HTMLCanvasElement>();
  const sprite = (color: string) => {
    let c = sprites.get(color);
    if (c) return c;
    c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, color + 'cc');
    grad.addColorStop(0.35, color + '55');
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
    g.addColorStop(0, '#173130');
    g.addColorStop(1, '#0b1514');
    b.fillStyle = g;
    b.fillRect(0, 0, W, H);
    const r = mulberry32(7);
    // Sentier
    b.strokeStyle = 'rgba(154, 211, 205, 0.06)';
    b.lineWidth = Math.max(18, W * 0.045);
    b.lineCap = 'round';
    b.beginPath();
    b.moveTo(-20, H * 0.55);
    b.bezierCurveTo(W * 0.25, H * 0.35, W * 0.45, H * 0.85, W * 0.7, H * 0.5);
    b.bezierCurveTo(W * 0.85, H * 0.3, W * 0.95, H * 0.42, W + 20, H * 0.38);
    b.stroke();
    // Herbes
    for (let i = 0; i < (W * H) / 240; i++) {
      const x = r() * W;
      const y = r() * H;
      const l = 3 + r() * 7;
      b.strokeStyle = `rgba(${130 + r() * 40}, ${190 + r() * 30}, ${180 + r() * 20}, ${0.04 + r() * 0.07})`;
      b.lineWidth = 1;
      b.beginPath();
      b.moveTo(x, y);
      b.lineTo(x + (r() - 0.5) * 3, y - l);
      b.stroke();
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
    tg.addColorStop(0, 'rgba(10, 30, 28, 0.95)');
    tg.addColorStop(1, 'rgba(10, 30, 28, 0)');
    b.fillStyle = tg;
    b.beginPath();
    b.arc(tree.x * W, tree.y * H, W * 0.09, 0, Math.PI * 2);
    b.fill();
    // Lisière de haie : des masses floues et irrégulières plutôt que des disques nets.
    for (let i = 0; i < 26; i++) {
      const x = W * (0.5 + r() * 0.52);
      const y = H * (0.06 + r() * 0.08);
      const rad = W * (0.03 + r() * 0.04);
      const hg = b.createRadialGradient(x, y, 0, x, y, rad);
      hg.addColorStop(0, 'rgba(6, 18, 17, 0.55)');
      hg.addColorStop(1, 'rgba(6, 18, 17, 0)');
      b.fillStyle = hg;
      b.fillRect(x - rad, y - rad, rad * 2, rad * 2);
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

  // ---------- Particules d'odeur (avec profondeur : taille, opacité et vitesse varient selon z) ----------
  const spawn = (s: (typeof SCENTS)[number], w: Wind, t = 0): Particle => {
    const a = rand() * Math.PI * 2;
    const z = rand();
    const sp = 0.004 + rand() * 0.008;
    const drift = w.strength * (0.08 + z * 0.1);
    return {
      x: s.x + (rand() - 0.5) * 0.012 + Math.cos(w.angle) * drift * t,
      y: s.y + (rand() - 0.5) * 0.012 + Math.sin(w.angle) * drift * t,
      z,
      vx: Math.cos(a) * sp + Math.cos(w.angle) * drift,
      vy: Math.sin(a) * sp + Math.sin(w.angle) * drift - 0.004,
      age: 0,
      life: 2.2 + rand() * 3 * (0.6 + w.strength),
      color: s.color,
      size: 5 + z * 9,
    };
  };

  const emit = (dt: number) => {
    const w = wind();
    for (const s of SCENTS) {
      const rate = 46 * s.strength * dt;
      let n = Math.floor(rate) + (rand() < rate % 1 ? 1 : 0);
      while (n-- > 0 && particles.length < MAX_PARTICLES) particles.push(spawn(s, w));
    }
  };

  // Mouvement réduit : panaches figés, calculés une fois.
  const seedStatic = () => {
    particles.length = 0;
    const w = wind();
    for (const s of SCENTS) {
      for (let i = 0; i < 70 * s.strength; i++) {
        const p = spawn(s, w, rand() * (1 + w.strength * 3));
        const spread = 0.008 + rand() * 0.03;
        const a = rand() * Math.PI * 2;
        p.x += Math.cos(a) * spread;
        p.y += Math.sin(a) * spread;
        p.life = Infinity;
        particles.push(p);
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
      p.vx += (rand() - 0.5) * 0.016 * dt;
      p.vy += (rand() - 0.5) * 0.016 * dt;
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
      const fade = Number.isFinite(p.life) ? Math.sin((p.age / p.life) * Math.PI) : 0.6;
      lctx.globalAlpha = (0.16 + p.z * 0.18) * fade;
      lctx.drawImage(sprite(p.color), p.x * W - p.size, p.y * H - p.size, p.size * 2, p.size * 2);
    }
    lctx.globalAlpha = 1;
    if (!revealAll.checked) {
      // La truffe révèle ce qui l'entoure : masque radial doux.
      const R = Math.max(100, Math.min(W, H) * 0.26);
      const m = lctx.createRadialGradient(nose.x * W, nose.y * H, 0, nose.x * W, nose.y * H, R);
      m.addColorStop(0, 'rgba(0,0,0,1)');
      m.addColorStop(0.5, 'rgba(0,0,0,0.55)');
      m.addColorStop(1, 'rgba(0,0,0,0)');
      lctx.globalCompositeOperation = 'destination-in';
      lctx.fillStyle = m;
      lctx.fillRect(0, 0, W, H);
    }
    lctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(layer, 0, 0, W, H);

    // Le capteur : halo, anneau et ondes de reniflement, sans pictogramme.
    const { level } = sniff(nose.x, nose.y, wind(), W / H);
    pulse += dt * (0.9 + level * 2.4);
    const nx = nose.x * W;
    const ny = nose.y * H;
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.28 + level * 0.3;
    ctx.drawImage(sprite('#9ad3cd'), nx - 38, ny - 38, 76, 76);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    for (let k = 0; k < 2; k++) {
      const ph = (pulse + k / 2) % 1;
      ctx.strokeStyle = `rgba(154, 211, 205, ${(1 - ph) * (0.12 + level * 0.45)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(nx, ny, 16 + ph * (22 + level * 30), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(223, 243, 239, 0.9)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(nx, ny, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#dff3ef';
    ctx.beginPath();
    ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
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
      const near = distanceTo(s, nose.x, nose.y, W / H) < FOUND_RADIUS;
      if (near && !inside.has(s.id)) {
        inside.add(s.id);
        discover(s.id);
      } else if (!near) inside.delete(s.id);
    }
  };

  // ---------- État : sélection, découverte, carnet ----------
  const scentIndex = (id: string) => SCENTS.findIndex((x) => x.id === id);

  const renderNote = () => {
    const s = selected ? SCENTS[scentIndex(selected)] : undefined;
    if (!s) {
      noteStatus.textContent = intro.status;
      noteTitle.textContent = intro.title;
      noteText.textContent = intro.text;
    } else {
      const num = String(scentIndex(s.id) + 1).padStart(2, '0');
      const isFound = found.has(s.id);
      noteStatus.textContent = isFound ? `${num} · Trouvé` : `${num} · La truffe s’en approche…`;
      noteTitle.textContent = s.label;
      noteText.textContent = isFound ? s.text : 'Suivez la truffe : l’odeur se précise à mesure qu’elle approche de sa source.';
    }
    note.classList.remove('is-new');
    void note.offsetWidth;
    if (!reduced) note.classList.add('is-new');
  };

  const syncUi = () => {
    for (const btn of listButtons) {
      const id = btn.dataset.scent!;
      btn.setAttribute('aria-pressed', String(id === selected));
      btn.classList.toggle('is-found', found.has(id));
      const state = btn.querySelector<HTMLElement>('[data-state]');
      if (state) state.textContent = found.has(id) ? 'Trouvée' : 'À trouver';
    }
    for (const m of markers) {
      const id = m.dataset.marker!;
      const show = found.has(id) || revealAll.checked;
      m.classList.toggle('is-visible', show);
      m.setAttribute('aria-pressed', String(id === selected));
      m.tabIndex = show ? 0 : -1;
      m.setAttribute('aria-hidden', String(!show));
    }
    count.textContent = `${found.size} / ${SCENTS.length}`;
    wrap.classList.toggle('is-complete', found.size === SCENTS.length);
  };

  const discover = (id: string) => {
    const s = SCENTS[scentIndex(id)];
    if (!s || found.has(id)) return;
    found.add(id);
    // Une découverte en exploration libre devient la sélection.
    if (!selected || selected === id || found.has(selected)) selected = id;
    syncUi();
    renderNote();
    live.textContent = `Trouvé : ${s.label}. ${s.text}`;
  };

  /** Point d'entrée unique : liste, marqueurs et clavier passent par ici. */
  const select = (id: string) => {
    const s = SCENTS[scentIndex(id)];
    if (!s) return;
    firstInteraction();
    selected = id;
    nose.tx = s.x;
    nose.ty = s.y;
    // Déjà sur place (par exemple après « Recommencer ») : la découverte est immédiate.
    if (inside.has(id)) discover(id);
    // Sur petit écran, le pré peut être hors de vue : on le ramène.
    const r = canvas.getBoundingClientRect();
    if (r.bottom < 80 || r.top > innerHeight - 80) canvas.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    if (reduced) {
      nose.x = s.x;
      nose.y = s.y;
    }
    syncUi();
    renderNote();
    if (reduced || !running) draw(0);
  };

  // ---------- Boucle ----------
  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!interacted) {
      // Flânerie d'attente : la truffe se promène pour inviter à jouer.
      const t = now / 1000;
      nose.tx = 0.5 + Math.sin(t * 0.35) * 0.26;
      nose.ty = 0.5 + Math.sin(t * 0.52) * 0.2;
    }
    const k = Math.min(1, dt * (interacted ? 6 : 1.5));
    nose.x += (nose.tx - nose.x) * k;
    nose.y += (nose.ty - nose.y) * k;
    step(dt);
    draw(dt);
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || reduced) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // ---------- Commandes ----------
  function firstInteraction() {
    if (interacted) return;
    interacted = true;
    hint.classList.add('is-gone');
  }
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
  // Souris : la truffe suit le pointeur. Toucher : un appui place la truffe ; le glissement vertical fait défiler la page.
  canvas.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' || e.buttons) moveTo(e.clientX, e.clientY);
  });
  canvas.addEventListener('pointerdown', (e) => moveTo(e.clientX, e.clientY));
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
  revealAll.addEventListener('change', () => {
    syncUi();
    draw(0);
  });
  reset.addEventListener('click', () => {
    found.clear();
    selected = null;
    revealAll.checked = false;
    syncUi();
    renderNote();
    live.textContent = 'Le pré est réinitialisé.';
    draw(0);
  });
  for (const btn of [...listButtons, ...markers]) {
    btn.addEventListener('click', () => select(btn.dataset.scent ?? btn.dataset.marker ?? ''));
  }

  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver((entries) => (entries.some((e) => e.isIntersecting) ? start() : stop())).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  onWind();
  if (reduced) seedStatic();
  syncUi();
  resize();
}
