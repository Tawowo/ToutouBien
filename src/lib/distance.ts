/**
 * Explorateur « La distance de confort » : modèle pur, ILLUSTRATIF.
 * Chaque chien a ses propres seuils ; les valeurs ci-dessous servent uniquement
 * à montrer le principe (plus c'est proche, plus c'est difficile ; une journée
 * chargée réduit la marge). L'interface l'indique clairement.
 */
export const STIMULI = [
  { id: 'chien', label: 'Un autre chien', comfort: 0.62, alert: 0.34 },
  { id: 'velo', label: 'Un vélo', comfort: 0.5, alert: 0.26 },
  { id: 'enfant', label: 'Un enfant qui court', comfort: 0.44, alert: 0.22 },
] as const;
export type StimulusId = (typeof STIMULI)[number]['id'];

export const DAYS = [
  { id: 'calme', label: 'Journée calme', factor: 0.75 },
  { id: 'normale', label: 'Journée ordinaire', factor: 1 },
  { id: 'chargee', label: 'Journée chargée', factor: 1.3 },
] as const;
export type DayId = (typeof DAYS)[number]['id'];

export type Zone = 'aise' | 'vigilant' | 'deborde';

export interface Thresholds {
  /** En dessous de cette distance (0…1), le chien quitte sa zone de confort. */
  comfort: number;
  /** En dessous de celle-ci, il risque d'être débordé. */
  alert: number;
}

export function thresholds(stimulus: StimulusId, day: DayId, arc = false): Thresholds {
  const s = STIMULI.find((x) => x.id === stimulus) ?? STIMULI[0];
  const d = DAYS.find((x) => x.id === day) ?? DAYS[1];
  // Un passage en arc de cercle (pas de face-à-face) rend la rencontre plus facile.
  const ease = arc ? 0.72 : 1;
  return {
    comfort: Math.min(0.95, s.comfort * d.factor * ease),
    alert: Math.min(0.9, s.alert * d.factor * ease),
  };
}

export function zoneFor(distance: number, t: Thresholds): Zone {
  if (distance >= t.comfort) return 'aise';
  if (distance >= t.alert) return 'vigilant';
  return 'deborde';
}

export const ZONE_TEXT: Record<Zone, { title: string; text: string; posture: Record<string, string> }> = {
  aise: {
    title: 'À l’aise',
    text: 'À cette distance, votre chien peut remarquer l’autre sans être dépassé. C’est la zone idéale pour apprendre : il reste disponible pour vous.',
    posture: { body: 'soft', ears: 'relaxed', tail: 'neutral', wag: 'none', head: 'neutral', mouth: 'relaxed', gaze: 'soft' },
  },
  vigilant: {
    title: 'Vigilant',
    text: 'Il se concentre sur ce qui approche : corps qui se fige, regard fixe. Il peut encore revenir vers vous, mais la marge se réduit.',
    posture: { body: 'frozen', ears: 'forward', tail: 'high', wag: 'stiff', head: 'up', mouth: 'closed', gaze: 'fixed' },
  },
  deborde: {
    title: 'Débordé',
    text: 'Trop proche : il n’est plus en état d’écouter ni d’apprendre. Selon les chiens, cela peut se traduire par la fuite, le blocage ou une réaction forte. Ce n’est pas le moment d’insister.',
    posture: { body: 'lowered', ears: 'back', tail: 'low', wag: 'none', head: 'low', mouth: 'lick', gaze: 'away' },
  },
};
