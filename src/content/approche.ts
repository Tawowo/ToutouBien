/**
 * Principes de l'approche — textes éditoriaux À VALIDER avec l'éducatrice
 * (ils décrivent une posture générale, pas une méthode ou une certification).
 */
export const PRINCIPLES = [
  {
    id: 'observer',
    word: 'Observer',
    tagline: 'avant d’agir',
    text: 'Avant de proposer quoi que ce soit, on regarde : votre chien, son environnement, vos habitudes. Beaucoup de réponses se trouvent dans les détails du quotidien.',
    concretely: ['Prendre le temps de voir votre chien dans son cadre de vie', 'S’intéresser à ce qui se passe avant et après une situation', 'Partir de ce qui fonctionne déjà'],
  },
  {
    id: 'comprendre',
    word: 'Comprendre',
    tagline: 'le contexte',
    text: 'Un comportement a presque toujours une raison. Le comprendre permet d’agir sur la cause plutôt que de seulement contenir le symptôme.',
    concretely: ['Lire les signaux en tenant compte du contexte', 'Distinguer ce qui relève de l’éducation, du besoin ou de la santé', 'Éviter les étiquettes hâtives (« têtu », « dominant »…)'],
  },
  {
    id: 'respecter',
    word: 'Respecter',
    tagline: 'le rythme du chien',
    text: 'Chaque chien apprend à son rythme, selon son âge, son histoire et sa sensibilité. Forcer l’allure fragilise souvent les progrès.',
    concretely: ['Des étapes à sa mesure', 'Lui laisser des choix quand c’est possible', 'Ne jamais chercher à l’intimider'],
  },
  {
    id: 'expliquer',
    word: 'Expliquer',
    tagline: 'simplement',
    text: 'Vous êtes la personne qui vit avec votre chien : comprendre le « pourquoi » vous permet d’être autonome entre deux rencontres.',
    concretely: ['Des explications sans jargon', 'Des exercices montrés, puis essayés ensemble', 'Le droit de poser toutes les questions'],
  },
  {
    id: 'ajuster',
    word: 'Ajuster',
    tagline: 'à votre vraie vie',
    text: 'Un conseil n’est utile que s’il est applicable. Les pistes tiennent compte de votre temps, de votre logement et de votre famille.',
    concretely: ['Des propositions réalistes', 'Une progression revue au fil des semaines', 'Des solutions pour toute la famille'],
  },
  {
    id: 'orienter',
    word: 'Orienter',
    tagline: 'quand il le faut',
    text: 'Certaines situations dépassent l’éducation : douleur, maladie, troubles importants. Dans ce cas, l’orientation vers un vétérinaire ou un vétérinaire comportementaliste fait partie de l’accompagnement.',
    concretely: ['Penser à la santé en premier en cas de changement brutal', 'Reconnaître les limites de son rôle', 'Travailler en complément d’autres professionnels'],
  },
] as const;
