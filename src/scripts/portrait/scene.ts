/**
 * Scène d'ouverture « Du regard au lien » (WebGL, three.js).
 *
 * Une vraie photographie est échantillonnée en une grille de particules (une particule = un
 * « pixel » coloré de la photo). Toutes les positions sont calculées dans le vertex shader à
 * partir de quelques uniformes : un seul appel de dessin, aucun calcul par particule côté CPU.
 *
 *  - uIntro (0→1, temps) : les particules arrivent d'un nuage profond et composent la photo.
 *  - uRelief (défilement) : la photo prend du volume (profondeur selon la luminosité) et pivote.
 *  - uScatter (défilement) : les pixels se détachent et deviennent des étoiles.
 *  - uEmblem (défilement) : les étoiles se rassemblent en constellation du logo ToutouBien.
 *  - uRipple : une onde traverse la photo quand on la touche.
 *
 * Coordonnées : caméra fixe en (0, 0, Z) ; les rectangles de la photo et du logo sont fournis en
 * unités monde, calculés depuis leur position à l'écran, pour que la photo de particules se pose
 * exactement sur la vraie photo HTML.
 */
import { BufferAttribute, BufferGeometry, NormalBlending, PerspectiveCamera, Points, Scene, ShaderMaterial, WebGLRenderer } from 'three';
import { mulberry32, samplePath, type ViewBox } from '../flair/shapes';

const vertex = /* glsl */ `
  #define PI 3.14159265
  attribute vec2 aUv;
  attribute vec3 aColor;
  attribute vec4 aRand;
  attribute vec3 aStar;
  attribute vec2 aEmb;
  uniform vec4 uRect;      // photo : centre (x, y), taille (w, h) en unités monde
  uniform vec3 uEmbRect;   // logo : centre (x, y), échelle
  uniform vec2 uSpan;      // demi-largeur et demi-hauteur visibles
  uniform float uIntro, uRelief, uScatter, uEmblem, uYaw, uPitch, uTime, uCell, uPx, uDpr;
  uniform vec3 uRipple;    // origine (x, y), âge (s) ; âge < 0 : inactif
  varying vec3 vColor;
  varying float vStar;
  varying float vAlpha;

  float ease(float t) { t = clamp(t, 0.0, 1.0); return 1.0 - pow(1.0 - t, 3.0); }
  float sstep(float a, float b, float x) { float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
  mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

  void main() {
    vec2 c = uRect.xy;
    vec3 home = vec3(c + (aUv - 0.5) * uRect.zw, 0.0);
    float lum = dot(aColor, vec3(0.299, 0.587, 0.114));

    // 1. Arrivée : chaque pixel part d'un nuage profond et décrit une spirale qui se resserre
    //    (début lent, accélération, atterrissage doux), avec un léger retard propre.
    float k = ease((uIntro - aRand.z * 0.48) / 0.52);
    vec3 cloud = vec3(c + (aRand.xy - 0.5) * vec2(uSpan.x * 3.4, uSpan.y * 2.8), -16.0 - aRand.w * 28.0);
    vec3 p = mix(cloud, home, k);
    vec2 off = p.xy - home.xy;
    p.xy = home.xy + rot((1.0 - k) * (2.2 + aRand.y * 2.4) * (aRand.w > 0.5 ? 1.0 : -1.0)) * off;
    p.z += sin(PI * k) * (1.6 + aRand.y * 2.4);
    // 2. Relief : la luminosité devient profondeur ; le centre se bombe doucement.
    float dc = length((aUv - 0.5) * vec2(1.4, 1.0));
    p.z += uRelief * ((lum - 0.5) * 0.7 + (0.55 - dc) * 1.5) * uRect.w * 0.3;

    // Onde au toucher.
    if (uRipple.z >= 0.0) {
      float d = length(home.xy - uRipple.xy);
      float front = uRipple.z * 7.0;
      float env = exp(-pow((d - front) * 1.4, 2.0)) * exp(-uRipple.z * 1.6);
      p.z += env * 1.4;
      p.xy += normalize(home.xy - uRipple.xy + 0.0001) * env * 0.18;
    }

    // Rotation autour du centre de la photo (le volume se révèle).
    p -= vec3(c, 0.0);
    p.xz = rot(uYaw) * p.xz;
    p.yz = rot(uPitch) * p.yz;
    p += vec3(c, 0.0);

    // 3. Dispersion : décalage propre à chaque pixel ; les étoiles s'enroulent autour du centre (galaxie lente).
    float s = sstep(aRand.x * 0.55, aRand.x * 0.55 + 0.45, uScatter);
    vec3 sky = vec3(aStar.xy * uSpan * 1.05, aStar.z);
    sky.xy = rot(uScatter * 0.9 * (1.2 - length(aStar.xy))) * sky.xy;
    sky.xy += vec2(sin(uTime * 0.2 + aRand.w * 30.0), cos(uTime * 0.17 + aRand.y * 30.0)) * 0.08;
    vec3 q = mix(p, sky, s);
    q.xy += rot(s * 2.4 * (aRand.y - 0.5)) * vec2(0.0, sin(PI * s) * 1.2);
    // 4. Constellation du logo.
    float e = sstep(aRand.z * 0.45, aRand.z * 0.45 + 0.55, uEmblem);
    vec3 emb = vec3(uEmbRect.xy + aEmb * uEmbRect.z, (aRand.w - 0.5) * 0.25);
    q = mix(q, emb, e);
    q.z += sin(PI * e) * (0.8 + aRand.y);

    vec4 mv = modelViewMatrix * vec4(q, 1.0);
    gl_Position = projectionMatrix * mv;

    float star = max(s, e);
    vStar = max(star, 1.0 - sstep(0.35, 0.8, k));
    // Couleurs : la photo, puis des étoiles sarcelle et turquoise (palette du logo).
    vec3 starCol = mix(vec3(0.067, 0.588, 0.576), vec3(0.055, 0.373, 0.357), aRand.y);
    starCol = mix(starCol, vec3(0.42, 0.75, 0.72), step(0.86, aRand.w));
    vec3 embCol = mix(vec3(0.043, 0.33, 0.31), vec3(0.067, 0.588, 0.576), aEmb.y * 0.5 + 0.5);
    // Pendant l'arrivée, les pixels voyagent comme des étoiles et prennent la couleur de la photo en se posant.
    float landed = sstep(0.55, 1.0, k);
    vec3 photoCol = mix(starCol, aColor, landed);
    vColor = mix(mix(photoCol, starCol, s), embCol, e);

    // Taille : un pixel de photo couvre sa cellule ; une étoile est un point lumineux.
    // Mise au point : un pixel qui arrive est plus grand et plus doux, puis se resserre exactement sur sa cellule.
    float photoSize = uCell * uPx * 1.18 * mix(2.3, 1.0, landed);
    photoSize = mix((2.0 + aRand.y * 2.0) * uDpr, photoSize, sstep(0.2, 0.7, k));
    float starSize = (2.2 + aRand.y * 3.2) * uDpr * (1.0 + step(0.93, aRand.w) * 1.4);
    float embSize = (2.6 + aRand.y * 1.8) * uDpr * (0.85 + 0.3 * sin(uTime * (1.2 + aRand.w) + aRand.x * 40.0));
    float size = mix(mix(photoSize, starSize, s), embSize, e);
    gl_PointSize = size * (10.0 / max(0.5, -mv.z)) ;
    vAlpha = mix(1.0, 0.92, star) * sstep(0.0, 0.25, uIntro + 0.05);
  }
`;

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vStar;
  varying float vAlpha;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    // Pixel : carré aux coins adoucis. Étoile : disque au halo doux.
    float sq = 1.0 - smoothstep(0.42, 0.5, max(abs(d.x), abs(d.y)));
    float r = length(d);
    float disc = smoothstep(0.5, 0.0, r);
    disc = clamp(disc * 1.8, 0.0, 1.0);
    float a = mix(sq, disc, vStar) * vAlpha;
    if (a < 0.02) discard;
    gl_FragColor = vec4(vColor, a);
  }
`;

const dustVertex = /* glsl */ `
  attribute vec4 aRand;
  uniform vec2 uSpan;
  uniform float uTime, uDpr, uAlpha;
  varying float vA;
  void main() {
    vec3 p = vec3((aRand.x - 0.5) * uSpan.x * 2.6, (aRand.y - 0.5) * uSpan.y * 2.4, -2.0 - aRand.z * 22.0);
    p.y += mod(uTime * (0.05 + aRand.w * 0.08) + aRand.w * 10.0, uSpan.y * 2.4) - uSpan.y * 1.2;
    p.x += sin(uTime * 0.3 + aRand.z * 20.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.6 + aRand.w * 2.6) * uDpr * (10.0 / max(1.0, -mv.z));
    vA = (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.8 + aRand.w) + aRand.x * 40.0))) * uAlpha;
  }
`;
const dustFragment = /* glsl */ `
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, r) * vA;
    if (a < 0.02) discard;
    gl_FragColor = vec4(0.067, 0.588, 0.576, a);
  }
`;

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface OpeningOptions {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement;
  cols: number;
  dprMax: number;
  emblem: { d: string; box: ViewBox };
}

export interface OpeningState {
  intro: number;
  relief: number;
  scatter: number;
  emblem: number;
  yaw: number;
  pitch: number;
  dust: number;
}

export class OpeningScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(35, 1, 0.1, 200);
  private material: ShaderMaterial;
  private dustMaterial: ShaderMaterial;
  private geometry = new BufferGeometry();
  private dustGeometry = new BufferGeometry();
  private size = { w: 1, h: 1 };
  private camZ = 10;
  private rippleStart = -1;
  private start = performance.now();
  lost = false;

  private constructor(private opts: OpeningOptions, pixels: { colors: Float32Array; uvs: Float32Array; rows: number }) {
    const { canvas } = opts;
    this.renderer = new WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.lost = true;
    });
    this.camera.position.set(0, 0, this.camZ);

    const n = pixels.colors.length / 3;
    const rand = mulberry32(20261011);
    const r4 = new Float32Array(n * 4);
    const stars = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      r4.set([rand(), rand(), rand(), rand()], i * 4);
      // Ciel : un disque aplati, plus dense près du centre, sur plusieurs plans de profondeur.
      const a = rand() * Math.PI * 2;
      const rr = Math.pow(rand(), 0.7);
      stars.set([Math.cos(a) * rr * 1.1, Math.sin(a) * rr * 0.95, -1 - rand() * 9], i * 3);
    }
    const emb = samplePath(opts.emblem.d, opts.emblem.box, n, 2, rand, 0.72);
    const emb2 = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) emb2.set([emb[i * 3]!, emb[i * 3 + 1]!], i * 2);

    const g = this.geometry;
    g.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3));
    g.setAttribute('aUv', new BufferAttribute(pixels.uvs, 2));
    g.setAttribute('aColor', new BufferAttribute(pixels.colors, 3));
    g.setAttribute('aRand', new BufferAttribute(r4, 4));
    g.setAttribute('aStar', new BufferAttribute(stars, 3));
    g.setAttribute('aEmb', new BufferAttribute(emb2, 2));

    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: NormalBlending,
      uniforms: {
        uRect: { value: [0, 0, 1, 1] },
        uEmbRect: { value: [0, 0, 1] },
        uSpan: { value: [1, 1] },
        uIntro: { value: 0 },
        uRelief: { value: 0 },
        uScatter: { value: 0 },
        uEmblem: { value: 0 },
        uYaw: { value: 0 },
        uPitch: { value: 0 },
        uTime: { value: 0 },
        uCell: { value: 1 },
        uPx: { value: 1 },
        uDpr: { value: 1 },
        uRipple: { value: [0, 0, -1] },
      },
    });
    const points = new Points(g, this.material);
    points.frustumCulled = false;

    const dn = opts.cols > 150 ? 900 : 450;
    const dr = new Float32Array(dn * 4);
    for (let i = 0; i < dn * 4; i++) dr[i] = rand();
    this.dustGeometry.setAttribute('position', new BufferAttribute(new Float32Array(dn * 3), 3));
    this.dustGeometry.setAttribute('aRand', new BufferAttribute(dr, 4));
    this.dustMaterial = new ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      uniforms: { uSpan: { value: [1, 1] }, uTime: { value: 0 }, uDpr: { value: 1 }, uAlpha: { value: 0 } },
    });
    const dust = new Points(this.dustGeometry, this.dustMaterial);
    dust.frustumCulled = false;
    this.scene.add(dust, points);
  }

  /** Charge et échantillonne la photo (même origine), puis crée la scène. */
  static async create(opts: OpeningOptions): Promise<OpeningScene> {
    const img = new Image();
    img.decoding = 'async';
    img.src = opts.image.currentSrc || opts.image.src;
    await img.decode();
    const cols = opts.cols;
    const rows = Math.round((cols * img.naturalHeight) / img.naturalWidth);
    const cv = document.createElement('canvas');
    cv.width = cols;
    cv.height = rows;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('canvas 2D indisponible');
    ctx.drawImage(img, 0, 0, cols, rows);
    const data = ctx.getImageData(0, 0, cols, rows).data;
    const n = cols * rows;
    const colors = new Float32Array(n * 3);
    const uvs = new Float32Array(n * 2);
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        colors[k * 3] = data[k * 4]! / 255;
        colors[k * 3 + 1] = data[k * 4 + 1]! / 255;
        colors[k * 3 + 2] = data[k * 4 + 2]! / 255;
        uvs[k * 2] = (i + 0.5) / cols;
        uvs[k * 2 + 1] = 1 - (j + 0.5) / rows;
      }
    return new OpeningScene(opts, { colors, uvs, rows });
  }

  /** Met à jour la taille du rendu et la position des formes (en pixels, relatives au canvas). */
  layout(w: number, h: number, photo: Rect, emblem: Rect): void {
    this.size = { w, h };
    const dpr = Math.min(devicePixelRatio || 1, this.opts.dprMax);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const visH = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * this.camZ;
    const k = visH / h;
    const toWorld = (r: Rect) => ({ x: (r.left + r.width / 2 - w / 2) * k, y: -(r.top + r.height / 2 - h / 2) * k, w: r.width * k, h: r.height * k });
    const p = toWorld(photo);
    const e = toWorld(emblem);
    const u = this.material.uniforms;
    u.uRect!.value = [p.x, p.y, p.w, p.h];
    u.uEmbRect!.value = [e.x, e.y, e.h / 2];
    u.uSpan!.value = [(w * k) / 2, visH / 2];
    u.uCell!.value = photo.width / this.opts.cols;
    u.uPx!.value = dpr;
    u.uDpr!.value = dpr;
    this.dustMaterial.uniforms.uSpan!.value = [(w * k) / 2, visH / 2];
    this.dustMaterial.uniforms.uDpr!.value = dpr;
  }

  /** Onde à partir d'un point (pixels relatifs au canvas). */
  ripple(x: number, y: number): void {
    const { w, h } = this.size;
    const visH = 2 * Math.tan((this.camera.fov * Math.PI) / 360) * this.camZ;
    const k = visH / h;
    this.material.uniforms.uRipple!.value = [(x - w / 2) * k, -(y - h / 2) * k, 0];
    this.rippleStart = performance.now();
  }

  get rippleActive(): boolean {
    return this.rippleStart > 0 && performance.now() - this.rippleStart < 2600;
  }

  render(s: OpeningState): void {
    if (this.lost) return;
    const t = (performance.now() - this.start) / 1000;
    const u = this.material.uniforms;
    u.uIntro!.value = s.intro;
    u.uRelief!.value = s.relief;
    u.uScatter!.value = s.scatter;
    u.uEmblem!.value = s.emblem;
    u.uYaw!.value = s.yaw;
    u.uPitch!.value = s.pitch;
    u.uTime!.value = t;
    const age = this.rippleStart > 0 ? (performance.now() - this.rippleStart) / 1000 : -1;
    u.uRipple!.value = [u.uRipple!.value[0], u.uRipple!.value[1], age > 2.6 ? -1 : age];
    this.dustMaterial.uniforms.uTime!.value = t;
    this.dustMaterial.uniforms.uAlpha!.value = s.dust;
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.geometry.dispose();
    this.dustGeometry.dispose();
    this.material.dispose();
    this.dustMaterial.dispose();
    this.renderer.dispose();
  }
}
