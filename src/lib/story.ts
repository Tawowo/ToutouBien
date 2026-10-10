export interface StoryStep {
  title: string;
  text: string;
  detail?: string;
  note?: string;
  scene: 'demande' | 'echange' | 'clarifier' | 'organiser' | 'suite';
}
