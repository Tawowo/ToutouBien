/**
 * Scène « Le flair » : des milliers de particules lumineuses (pollen, odeurs)
 * qui composent tour à tour la rencontre (le logo), la balade (un sentier en profondeur)
 * et le lien (un cœur). Les positions sont interpolées dans le vertex shader :
 * un seul appel de dessin, aucun calcul par particule côté CPU.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { PROFILES, lowerTier, type RenderTier, type Tier } from './quality';
import { cloud, heart, mulberry32, samplePath, trail, type ViewBox } from './shapes';

const vertex = /* glsl */ `
  attribute vec3 aCloud;
  attribute vec3 aMeet;
  attribute vec3 aTrail;
  attribute vec3 aHeart;
  attribute vec4 aRand;
  uniform float uMorph;     // 0 nuage · 1 rencontre · 2 balade · 3 lien
  uniform float uTime;
  uniform float uSize;
  uniform vec2 uPointer;    // position du pointeur dans le plan z = 0
  uniform float uPointerForce;
  varying float vRand;
  varying float vFade;
  varying float vWarm;

  float ease(float t) { return t * t * (3.0 - 2.0 * t); }

  void main() {
    float seg = clamp(floor(uMorph), 0.0, 2.0);
    float local = clamp(uMorph - seg, 0.0, 1.0);
    // Décalage individuel : les particules ne partent pas toutes en même temps.
    float k = ease(clamp(local * 1.5 - aRand.x * 0.5, 0.0, 1.0));
    vec3 from = seg < 0.5 ? aCloud : (seg < 1.5 ? aMeet : aTrail);
    vec3 to = seg < 0.5 ? aMeet : (seg < 1.5 ? aTrail : aHeart);
    vec3 p = mix(from, to, k);

    // Dérive douce, plus ample pendant les transitions (« dans l'air »).
    float drift = 0.035 + sin(3.14159 * k) * 0.6;
    p.x += sin(uTime * 0.6 + aRand.y * 30.0) * drift;
    p.y += cos(uTime * 0.5 + aRand.z * 30.0) * drift * 0.8;
    p.z += sin(uTime * 0.4 + aRand.w * 30.0) * drift * 0.6;

    // La truffe : le pointeur écarte les particules proches, en tourbillon.
    vec2 d = p.xy - uPointer;
    float dist = length(d);
    float push = uPointerForce * exp(-dist * dist * 1.6);
    vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
    p.xy += (dir + vec2(-dir.y, dir.x) * 0.6) * push * 0.85;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = uSize * (0.45 + aRand.y * 0.9);
    gl_PointSize = size * (8.0 / -mv.z);
    vRand = aRand.z;
    vFade = clamp(1.0 - (-mv.z - 8.0) / 40.0, 0.15, 1.0);
    vWarm = clamp(push * 2.0 + (uMorph > 1.5 && uMorph < 2.6 ? 0.35 : 0.0), 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uCool;
  uniform vec3 uWarm;
  uniform float uOpacity;
  varying float vRand;
  varying float vFade;
  varying float vWarm;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float core = smoothstep(0.5, 0.12, r);
    float halo = smoothstep(0.5, 0.0, r) * 0.35;
    vec3 col = mix(uCool, uWarm, clamp(step(0.8, vRand) + vWarm, 0.0, 1.0));
    gl_FragColor = vec4(col * (1.0 + core * 0.6), (core * 0.75 + halo) * uOpacity * vFade);
  }
`;

export interface FlairOptions {
  canvas: HTMLCanvasElement;
  emblemPath: string;
  emblemBox: ViewBox;
  tier: RenderTier;
  /** Appelé si l'appareil ne tient pas la cadence même au niveau le plus bas. */
  onFallback: () => void;
}

export class FlairScene {
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera = new PerspectiveCamera(38, 1, 0.1, 80);
  private material: ShaderMaterial;
  private points: Points;
  private tier: RenderTier;
  private target = 0;
  private morph = 0;
  private running = false;
  private raf = 0;
  private last = 0;
  private samples: number[] = [];
  private warmup = 0;
  private pointerTarget = new Vector2(99, 99);
  private pointerForce = 0;
  private tilt = new Vector2();
  private aspect = 1;
  private readonly onFallback: () => void;
  private readonly opts: FlairOptions;

  constructor(opts: FlairOptions) {
    this.opts = opts;
    this.tier = opts.tier;
    this.onFallback = opts.onFallback;
    this.renderer = new WebGLRenderer({ canvas: opts.canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.camera.position.set(0, 0, 8);
    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uMorph: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 6.5 },
        uPointer: { value: new Vector2(99, 99) },
        uPointerForce: { value: 0 },
        uCool: { value: new Color('#9ad3cd') },
        uWarm: { value: new Color('#f2c08a') },
        uOpacity: { value: 1.0 },
      },
    });
    this.points = new Points(this.buildGeometry(PROFILES[this.tier].particles), this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);
    this.resize();
    this.points.position.set(this.aspect > 1.15 ? 2.3 : 0, this.aspect < 0.8 ? 3.4 : 0, 0);
  }

  private buildGeometry(n: number): BufferGeometry {
    const rand = mulberry32(20261009);
    const g = new BufferGeometry();
    const meet = samplePath(this.opts.emblemPath, this.opts.emblemBox, n, 4.2, rand);
    g.setAttribute('position', new BufferAttribute(meet.slice(), 3));
    g.setAttribute('aMeet', new BufferAttribute(meet, 3));
    g.setAttribute('aCloud', new BufferAttribute(cloud(n, rand), 3));
    g.setAttribute('aTrail', new BufferAttribute(trail(n, rand), 3));
    g.setAttribute('aHeart', new BufferAttribute(heart(n, 2.6, rand), 3));
    const r = new Float32Array(n * 4);
    for (let i = 0; i < r.length; i++) r[i] = rand();
    g.setAttribute('aRand', new BufferAttribute(r, 4));
    return g;
  }

  resize(): void {
    const canvas = this.opts.canvas;
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, PROFILES[this.tier].dprMax));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Sur un écran étroit, on recule pour garder le logo entier.
    this.camera.position.z = w / h < 0.8 ? 15 : 8;
    this.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  /** Progression narrative : 0 nuage → 1 rencontre → 2 balade → 3 lien. */
  setMorph(value: number): void {
    this.target = Math.max(0, Math.min(3, value));
  }

  /** Coordonnées normalisées du pointeur (−1…1), ou null s'il sort. */
  setPointer(nx: number | null, ny = 0): void {
    if (!PROFILES[this.tier].pointer || nx === null) {
      this.pointerForce = 0;
      return;
    }
    const v = new Vector3(nx, ny, 0.5).unproject(this.camera);
    const dir = v.sub(this.camera.position).normalize();
    const t = -this.camera.position.z / dir.z;
    const hit = this.camera.position.clone().add(dir.multiplyScalar(t));
    this.pointerTarget.set(hit.x, hit.y);
    this.pointerForce = 1;
    this.tilt.set(nx, ny);
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
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    const u = this.material.uniforms;
    // Amortissement : la scène suit le défilement sans à-coups.
    this.morph += (this.target - this.morph) * Math.min(1, dt * 3.2);
    u.uMorph!.value = this.morph;
    u.uTime!.value = now / 1000;
    const p = u.uPointer!.value as Vector2;
    p.lerp(this.pointerTarget, Math.min(1, dt * 6));
    u.uPointerForce!.value += (this.pointerForce * (this.morph < 1.6 || this.morph > 2.5 ? 1 : 0.3) - u.uPointerForce!.value) * Math.min(1, dt * 4);
    // Légère parallaxe et inclinaison vers le sentier pendant la balade.
    const walk = Math.max(0, 1 - Math.abs(this.morph - 2));
    this.points.rotation.y += (this.tilt.x * 0.12 - this.points.rotation.y) * dt * 2;
    this.points.rotation.x += (-this.tilt.y * 0.06 + walk * 0.32 - this.points.rotation.x) * dt * 2;
    // Placement : à droite du texte sur grand écran, en haut sur écran étroit ; centré pour la balade.
    const wide = this.aspect > 1.15;
    const tx = wide ? 2.3 * (1 - walk) : 0;
    const ty = this.aspect < 0.8 ? 3.4 * (1 - walk) : 0;
    this.points.position.x += (tx - this.points.position.x) * Math.min(1, dt * 2.5);
    this.points.position.y += (ty - this.points.position.y) * Math.min(1, dt * 2.5);
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
      this.onFallback();
      return;
    }
    this.tier = next;
    this.points.geometry.dispose();
    this.points.geometry = this.buildGeometry(PROFILES[next].particles);
    this.resize();
    this.warmup = 0;
  }

  get currentTier(): RenderTier {
    return this.tier;
  }

  dispose(): void {
    this.stop();
    this.points.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}
