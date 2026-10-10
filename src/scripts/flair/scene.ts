/**
 * Scène « Le flair » : des particules lumineuses composent tour à tour
 * la rencontre (le logo), la balade (un sentier qui s'enfonce dans la profondeur, parcouru
 * par un flux continu) et le lien (deux anneaux entrelacés). Toutes les positions sont
 * calculées dans le vertex shader : un appel de dessin par couche, aucun calcul par
 * particule côté CPU.
 *
 * Pilotage : `setProgress(p)` reçoit la progression brute du défilement (0…1). La scène la
 * lisse avec un ressort amorti critique et renvoie la valeur lissée via `onProgress`, afin
 * que les textes HTML suivent exactement le même rythme que les particules, dans les deux sens.
 * Aucune interaction liée au pointeur.
 */
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, PerspectiveCamera, Points, Scene, ShaderMaterial, WebGLRenderer } from 'three';
import { PROFILES, lowerTier, type RenderTier, type Tier } from './quality';
import { cloud, dust, mulberry32, samplePath, type ViewBox } from './shapes';
import { timeline } from './timeline';

const COMMON = /* glsl */ `
  #define PI 3.14159265
  float sstep(float a, float b, float x) { float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }
  mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
`;

const vertex = /* glsl */ `
  ${COMMON}
  attribute vec3 aCloud;
  attribute vec3 aMeet;
  attribute vec4 aRand;
  uniform float uMorph;   // 0 poussière · 1 rencontre · 2 balade · 3 lien
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  varying float vAlpha;
  varying float vTone;

  // Le sentier : x serpente, z s'enfonce ; le flux avance doucement vers la caméra.
  vec3 trailPos(float t, float side) {
    float z = 3.0 - t * 40.0;
    float center = sin(t * 7.0) * (1.0 + t * 3.5) + sin(t * 2.1) * 1.2;
    float width = 1.35 - t * 0.85;
    return vec3(center + side * width, -1.8 + sin(t * 3.0) * 0.3, z);
  }

  // Le lien : deux anneaux entrelacés, parcourus par un flux lent.
  vec3 ringPos(float a, float which, float tube) {
    float R = 1.35 + tube;
    vec3 p = which < 0.5
      ? vec3(-0.75 + R * cos(a), R * sin(a), 0.0)
      : vec3(0.75 + R * cos(a), 0.0, R * sin(a));
    p.xz = rot(uTime * 0.12) * p.xz;
    p.yz = rot(0.35) * p.yz;
    return p;
  }

  void main() {
    float s = aRand.y * 2.0 - 1.0;
    float side = sign(s) * pow(abs(s), 0.55);
    float tFlow = fract(aRand.x - uTime * 0.01);
    vec3 trail = trailPos(tFlow, side);
    vec3 rings = ringPos((aRand.x + uTime * 0.025) * 2.0 * PI, aRand.w, (aRand.z - 0.5) * 0.12);

    float seg = clamp(floor(uMorph), 0.0, 2.0);
    float local = clamp(uMorph - seg, 0.0, 1.0);
    // Départ légèrement décalé selon les particules, mais une fenêtre courte : la forme reste lisible.
    float k = sstep(0.0, 1.0, (local - aRand.z * 0.3) / 0.7);
    vec3 from = seg < 0.5 ? aCloud : (seg < 1.5 ? aMeet : trail);
    vec3 to = seg < 0.5 ? aMeet : (seg < 1.5 ? trail : rings);
    vec3 p = mix(from, to, k);

    // Trajectoire en arc : les particules se soulèvent vers la caméra et tournent ensemble.
    float arc = sin(PI * k);
    p.z += arc * (0.6 + aRand.y * 1.1);
    p.xz = rot(arc * 0.45 * (aRand.w - 0.5)) * p.xz;

    // Respiration très légère au repos.
    p.x += sin(uTime * 0.7 + aRand.y * 40.0) * 0.012;
    p.y += cos(uTime * 0.6 + aRand.w * 40.0) * 0.012;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = clamp(uSize * uPixelRatio * (0.55 + aRand.y * 0.8) * (6.0 / depth), 1.0, 48.0);

    // Fondus : loin, très près de la caméra, et aux extrémités du flux du sentier.
    float trailW = (seg > 0.5 && seg < 2.5) ? (seg < 1.5 ? k : 1.0 - k) : 0.0;
    float ends = sstep(0.0, 0.06, tFlow) * sstep(1.0, 0.8, tFlow);
    vAlpha = sstep(48.0, 9.0, depth) * sstep(0.8, 3.0, depth) * mix(1.0, ends, trailW);
    vTone = aRand.w;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uLight;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vTone;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float a = pow(1.0 - r * 2.0, 1.6);
    vec3 col = mix(uDeep, uMid, smoothstep(0.1, 0.7, vTone));
    col = mix(col, uLight, step(0.93, vTone) * 0.8 + a * 0.25);
    gl_FragColor = vec4(col, a * uOpacity * vAlpha);
  }
`;

const dustVertex = /* glsl */ `
  attribute vec4 aRand;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.15 + aRand.x * 30.0) * 0.4;
    p.x += cos(uTime * 0.12 + aRand.y * 30.0) * 0.4;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = clamp(2.2 * uPixelRatio * (0.5 + aRand.z) * (8.0 / depth), 1.0, 10.0);
    vAlpha = clamp(1.0 - depth / 44.0, 0.0, 1.0) * smoothstep(0.5, 3.0, depth) * (0.25 + aRand.w * 0.35);
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uMid;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    gl_FragColor = vec4(uMid, (1.0 - r * 2.0) * vAlpha);
  }
`;

export interface FlairOptions {
  canvas: HTMLCanvasElement;
  emblemPath: string;
  emblemBox: ViewBox;
  tier: RenderTier;
  /** Progression lissée, à chaque image : les textes s'y synchronisent. */
  onProgress: (p: number) => void;
  /** Appelé si l'appareil ne tient pas la cadence même au niveau le plus bas. */
  onFallback: () => void;
}

export class FlairScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(38, 1, 0.1, 80);
  private material: ShaderMaterial;
  private dustMaterial: ShaderMaterial;
  private points: Points;
  private dust: Points;
  private tier: RenderTier;
  private raw = 0;
  private p = 0;
  private v = 0;
  private intro = 0;
  private running = false;
  private raf = 0;
  private last = 0;
  private samples: number[] = [];
  private warmup = 0;
  private aspect = 1;
  private readonly opts: FlairOptions;

  constructor(opts: FlairOptions) {
    this.opts = opts;
    this.tier = opts.tier;
    this.renderer = new WebGLRenderer({ canvas: opts.canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    const colors = { uDeep: { value: new Color('#119693') }, uMid: { value: new Color('#9ad3cd') }, uLight: { value: new Color('#effbf8') } };
    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uMorph: { value: 0 }, uTime: { value: 0 }, uSize: { value: 5.2 }, uPixelRatio: { value: 1 }, uOpacity: { value: 0.95 }, ...colors },
    });
    this.dustMaterial = new ShaderMaterial({
      vertexShader: dustVertex,
      fragmentShader: dustFragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uMid: colors.uMid },
    });
    this.points = new Points(this.buildGeometry(PROFILES[this.tier].particles), this.material);
    this.dust = new Points(this.buildDust(Math.round(PROFILES[this.tier].particles / 10)), this.dustMaterial);
    this.points.frustumCulled = false;
    this.dust.frustumCulled = false;
    this.scene.add(this.dust, this.points);
    this.resize();
    this.place(1, 0, 1);
  }

  private buildGeometry(n: number): BufferGeometry {
    const rand = mulberry32(20261009);
    const g = new BufferGeometry();
    const meet = samplePath(this.opts.emblemPath, this.opts.emblemBox, n, 3.9, rand);
    g.setAttribute('position', new BufferAttribute(meet.slice(), 3));
    g.setAttribute('aMeet', new BufferAttribute(meet, 3));
    g.setAttribute('aCloud', new BufferAttribute(cloud(n, rand), 3));
    const r = new Float32Array(n * 4);
    for (let i = 0; i < r.length; i++) r[i] = rand();
    g.setAttribute('aRand', new BufferAttribute(r, 4));
    return g;
  }

  private buildDust(n: number): BufferGeometry {
    const rand = mulberry32(7);
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(dust(n, rand), 3));
    const r = new Float32Array(n * 4);
    for (let i = 0; i < r.length; i++) r[i] = rand();
    g.setAttribute('aRand', new BufferAttribute(r, 4));
    return g;
  }

  resize(): void {
    const canvas = this.opts.canvas;
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    const dpr = Math.min(devicePixelRatio || 1, PROFILES[this.tier].dprMax);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.material.uniforms.uPixelRatio!.value = dpr;
    this.dustMaterial.uniforms.uPixelRatio!.value = dpr;
    this.camera.aspect = w / h;
    this.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /** Progression brute du défilement dans la section (0…1). */
  setProgress(p: number): void {
    this.raw = Math.max(0, Math.min(1, p));
  }

  /** Cadrage selon le chapitre : formes à droite du texte sur grand écran, en haut sur mobile. */
  private place(wMeet: number, wTrail: number, wRings: number, dolly = 0): void {
    const narrow = this.aspect < 0.8;
    const baseZ = narrow ? 17.5 : this.aspect < 1.15 ? 11 : 8;
    // Demi-largeur visible dans le plan z = 0 : la forme (≈ 2,1 de demi-largeur) reste entière,
    // à droite du texte sur grand écran, en haut sur écran étroit.
    const halfH = baseZ * Math.tan((this.camera.fov * Math.PI) / 360);
    const halfW = halfH * this.aspect;
    const side = this.aspect > 1.15 ? Math.max(0, halfW - 2.1 - 0.5) : 0;
    const up = narrow ? halfH * 0.5 : 0;
    const shapeW = wMeet + wRings;
    this.points.position.set(side * shapeW, up * shapeW, 0);
    this.points.rotation.x = wTrail * 0.3;
    // Travelling avant sur le sentier.
    // Le sentier se regarde toujours de près, quel que soit l'écran.
    this.camera.position.set(0, wTrail * 0.4, baseZ + (8.5 - baseZ) * wTrail - wTrail * dolly * 6.5);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private frame = (now: number) => {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    // Ressort amorti critique : réactif, sans dépassement, identique dans les deux sens.
    const omega = 9;
    const a = omega * omega * (this.raw - this.p) - 2 * omega * this.v;
    this.v += a * dt;
    this.p += this.v * dt;
    if (Math.abs(this.raw - this.p) < 1e-4 && Math.abs(this.v) < 1e-4) {
      this.p = this.raw;
      this.v = 0;
    }
    // Apparition : la poussière se rassemble en logo en 1,6 s, sans bloquer la lecture.
    this.intro = Math.min(1, this.intro + dt / 1.6);
    const introEase = 1 - Math.pow(1 - this.intro, 3);

    const t = timeline(this.p);
    const morph = Math.max(0, t.morph - (1 - introEase));
    const u = this.material.uniforms;
    u.uMorph!.value = morph;
    u.uTime!.value = now / 1000;
    this.dustMaterial.uniforms.uTime!.value = now / 1000;
    const wTrail = Math.max(0, 1 - Math.abs(morph - 2));
    const wRings = Math.max(0, Math.min(1, morph - 2));
    this.place(Math.max(0, 1 - wTrail - wRings), wTrail, wRings, t.dolly);
    this.opts.onProgress(this.p);

    this.renderer.render(this.scene, this.camera);
    this.watchBudget(dt * 1000);
    this.raf = requestAnimationFrame(this.frame);
  };

  /** Qualité adaptative : mesure des temps de frame, puis rétrogradation si nécessaire. */
  private watchBudget(ms: number): void {
    if (this.warmup < 60) {
      this.warmup++;
      return;
    }
    this.samples.push(ms);
    if (this.samples.length < 90) return;
    const avg = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    this.samples = [];
    if (avg <= PROFILES[this.tier].budgetMs) return;
    const next: Tier = lowerTier(this.tier);
    if (next === 'fallback') {
      this.stop();
      this.opts.onFallback();
      return;
    }
    this.tier = next;
    this.points.geometry.dispose();
    this.points.geometry = this.buildGeometry(PROFILES[next].particles);
    this.dust.geometry.dispose();
    this.dust.geometry = this.buildDust(Math.round(PROFILES[next].particles / 10));
    this.resize();
    this.warmup = 0;
  }

  get currentTier(): RenderTier {
    return this.tier;
  }

  dispose(): void {
    this.stop();
    this.points.geometry.dispose();
    this.dust.geometry.dispose();
    this.material.dispose();
    this.dustMaterial.dispose();
    this.renderer.dispose();
  }
}
