/**
 * Formes cibles des particules. Chaque fonction renvoie N positions (x, y, z).
 * Générateur pseudo-aléatoire déterministe (mulberry32, domaine public) pour un rendu stable.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Échantillonne l'intérieur d'un tracé SVG (le logo) par rastérisation :
 * le tracé est rempli dans un canvas hors écran, puis on tire N pixels remplis.
 */
export function samplePath(d: string, box: ViewBox, n: number, height: number, rand: () => number): Float32Array {
  const res = 360;
  const scale = res / Math.max(box.w, box.h);
  const cw = Math.ceil(box.w * scale);
  const ch = Math.ceil(box.h * scale);
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const out = new Float32Array(n * 3);
  if (!ctx) return out;
  ctx.setTransform(scale, 0, 0, scale, -box.x * scale, -box.y * scale);
  ctx.fill(new Path2D(d), 'evenodd');
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const filled: number[] = [];
  for (let i = 0; i < cw * ch; i++) if (data[i * 4 + 3]! > 128) filled.push(i);
  if (!filled.length) return out;
  const unit = height / ch;
  for (let i = 0; i < n; i++) {
    const idx = filled[Math.floor(rand() * filled.length)]!;
    const px = (idx % cw) + rand();
    const py = Math.floor(idx / cw) + rand();
    out[i * 3] = (px - cw / 2) * unit;
    out[i * 3 + 1] = -(py - ch / 2) * unit;
    out[i * 3 + 2] = (rand() - 0.5) * 0.18;
  }
  return out;
}

/** Un sentier qui serpente et s'enfonce dans la profondeur (la balade). */
export function trail(n: number, rand: () => number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = Math.pow(rand(), 0.85); // plus dense au premier plan
    const z = 3 - t * 42;
    const center = Math.sin(t * 7.5) * (1.2 + t * 4) + Math.sin(t * 2.1) * 1.4;
    const width = 1.5 - t * 0.9;
    const side = (rand() - 0.5) * 2;
    const edge = Math.sign(side) * Math.pow(Math.abs(side), 0.6); // densité sur les bords du sentier
    out[i * 3] = center + edge * width;
    out[i * 3 + 1] = -1.8 + (rand() - 0.5) * 0.08 + Math.sin(t * 3) * 0.3;
    out[i * 3 + 2] = z;
  }
  return out;
}

/** Contour de cœur épais (le lien), courbe paramétrique classique. */
export function heart(n: number, size: number, rand: () => number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = rand() * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const r = (1 + (rand() - 0.5) * 0.12) * size / 17;
    out[i * 3] = x * r + (rand() - 0.5) * 0.12;
    out[i * 3 + 1] = y * r + 0.3 + (rand() - 0.5) * 0.12;
    out[i * 3 + 2] = (rand() - 0.5) * 0.5;
  }
  return out;
}

/** Nuage diffus de départ (le pollen, les odeurs dans l'air). */
export function cloud(n: number, rand: () => number): Float32Array {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = rand() * Math.PI * 2;
    const v = Math.acos(2 * rand() - 1);
    const r = 4 + Math.pow(rand(), 0.5) * 9;
    out[i * 3] = r * Math.sin(v) * Math.cos(u) * 1.6;
    out[i * 3 + 1] = r * Math.cos(v) * 0.7;
    out[i * 3 + 2] = r * Math.sin(v) * Math.sin(u) - 4;
  }
  return out;
}
