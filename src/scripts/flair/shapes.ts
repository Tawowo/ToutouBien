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
 * Échantillonne le logo par rastérisation. Une part des particules est réservée aux bords
 * du tracé : la silhouette reste nette même avec peu de points, l'intérieur est plus diffus.
 */
export function samplePath(d: string, box: ViewBox, n: number, height: number, rand: () => number, edgeShare = 0.5): Float32Array {
  const res = 420;
  const scale = res / Math.max(box.w, box.h);
  const cw = Math.ceil(box.w * scale);
  const ch = Math.ceil(box.h * scale);
  const out = new Float32Array(n * 3);
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return out;
  ctx.setTransform(scale, 0, 0, scale, -box.x * scale, -box.y * scale);
  ctx.fill(new Path2D(d), 'evenodd');
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const on = (x: number, y: number) => x >= 0 && y >= 0 && x < cw && y < ch && data[(y * cw + x) * 4 + 3]! > 128;
  const edges: number[] = [];
  const inner: number[] = [];
  for (let y = 0; y < ch; y++)
    for (let x = 0; x < cw; x++) {
      if (!on(x, y)) continue;
      const edge = !on(x - 2, y) || !on(x + 2, y) || !on(x, y - 2) || !on(x, y + 2);
      (edge ? edges : inner).push(y * cw + x);
    }
  if (!edges.length && !inner.length) return out;
  const unit = height / ch;
  for (let i = 0; i < n; i++) {
    const pool = (rand() < edgeShare && edges.length) || !inner.length ? edges : inner;
    const idx = pool[Math.floor(rand() * pool.length)]!;
    const px = (idx % cw) + rand();
    const py = Math.floor(idx / cw) + rand();
    out[i * 3] = (px - cw / 2) * unit;
    out[i * 3 + 1] = -(py - ch / 2) * unit;
    out[i * 3 + 2] = (rand() - 0.5) * (pool === edges ? 0.05 : 0.22);
  }
  return out;
}
