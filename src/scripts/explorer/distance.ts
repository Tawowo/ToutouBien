import { ZONE_TEXT, thresholds, zoneFor, type DayId, type StimulusId } from '~/lib/distance';

export function initDistance(root: ParentNode = document): void {
  const lab = root.querySelector<HTMLElement>('[data-distance]');
  const dog = lab?.querySelector<SVGSVGElement>('.dog');
  if (!lab || !dog) return;
  const $ = <T extends Element>(sel: string) => lab.querySelector<T>(sel)!;
  const dist = $<HTMLInputElement>('[data-dist]');
  const arc = $<HTMLInputElement>('[data-arc]');
  const title = $<HTMLElement>('[data-zone-title]');
  const text = $<HTMLElement>('[data-zone-text]');
  const play = $<HTMLButtonElement>('[data-play]');
  const playLabel = $<HTMLElement>('[data-play-label]');
  const back = $<HTMLButtonElement>('[data-back]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let anim = 0;

  const value = (name: string) => lab.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? '';

  const render = () => {
    const d = Number(dist.value) / 100;
    const t = thresholds(value('stimulus') as StimulusId, value('day') as DayId, arc.checked);
    lab.style.setProperty('--d', d.toFixed(3));
    lab.style.setProperty('--comfort', t.comfort.toFixed(3));
    lab.style.setProperty('--alert', t.alert.toFixed(3));
    lab.dataset.stimulus = value('stimulus');
    lab.toggleAttribute('data-arc-on', arc.checked);
    const zone = zoneFor(d, t);
    dist.setAttribute('aria-valuetext', `${d > 0.66 ? 'Loin' : d > 0.33 ? 'Distance moyenne' : 'Proche'} : votre chien est ${ZONE_TEXT[zone].title.toLowerCase()}`);
    if (lab.dataset.zone !== zone) {
      lab.dataset.zone = zone;
      title.textContent = ZONE_TEXT[zone].title;
      text.textContent = ZONE_TEXT[zone].text;
      for (const [k, v] of Object.entries(ZONE_TEXT[zone].posture)) dog.dataset[k] = v;
    }
  };

  const stopAnim = () => {
    cancelAnimationFrame(anim);
    anim = 0;
    playLabel.textContent = 'Faire passer';
  };

  // Démonstration : ce qu'il croise approche puis s'éloigne.
  play.addEventListener('click', () => {
    if (anim) return stopAnim();
    if (reduced) {
      dist.value = '20';
      render();
      return;
    }
    playLabel.textContent = 'Arrêter';
    const start = performance.now();
    const duration = 7000;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const d = 0.95 - Math.sin(p * Math.PI) * 0.88;
      dist.value = String(Math.round(d * 100));
      render();
      if (p < 1) anim = requestAnimationFrame(tick);
      else stopAnim();
    };
    anim = requestAnimationFrame(tick);
  });

  back.addEventListener('click', () => {
    stopAnim();
    const t = thresholds(value('stimulus') as StimulusId, value('day') as DayId, arc.checked);
    dist.value = String(Math.min(100, Math.ceil(t.comfort * 100) + 8));
    render();
  });

  lab.addEventListener('input', () => render());
  lab.addEventListener('change', () => render());
  render();
}
