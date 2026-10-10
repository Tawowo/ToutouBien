/** Les expériences interactives d'« Explorer ». */
export interface Experience {
  id: 'flair' | 'distance' | 'signaux';
  num: string;
  href: string;
  title: string;
  question: string;
  text: string;
  learn: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    id: 'flair',
    num: '01',
    href: '/explorer/flair/',
    title: 'Le monde par le nez',
    question: 'Que perçoit votre chien pendant la balade ?',
    text: 'Promenez une truffe dans un pré, suivez les odeurs portées par le vent et découvrez ce qu’un simple carré d’herbe peut raconter.',
    learn: ['Pourquoi il renifle si longtemps', 'Le rôle du vent', 'Le flair comme besoin'],
  },
  {
    id: 'distance',
    num: '02',
    href: '/explorer/distance/',
    title: 'La distance de confort',
    question: 'Pourquoi réagit-il ici et pas là ?',
    text: 'Rapprochez un vélo, un enfant qui court ou un autre chien, et voyez comment la distance et la fatigue de la journée changent tout.',
    learn: ['Le seuil de confort', 'L’accumulation des tensions', 'Des stratégies simples'],
  },
  {
    id: 'signaux',
    num: '03',
    href: '/explorer/signaux/',
    title: 'Lire les signaux',
    question: 'Que raconte son corps ?',
    text: 'Changez la posture, les oreilles, la queue ou le regard d’un chien et apprenez à lire l’ensemble, en contexte.',
    learn: ['Les grandes zones du corps', 'Le poids du contexte', 'Un petit quiz pour s’entraîner'],
  },
];
