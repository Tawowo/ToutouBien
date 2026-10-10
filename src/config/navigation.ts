export interface NavItem {
  href: string;
  label: string;
  hint?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

/** Liens visibles en permanence dans l'en-tête (grand écran). */
export const PRIMARY_NAV: NavItem[] = [
  { href: '/accompagnements/', label: 'Accompagnements' },
  { href: '/approche/', label: 'L’approche' },
  { href: '/explorer/', label: 'Explorer' },
  { href: '/tarifs/', label: 'Tarifs' },
];

/** Menu complet (panneau plein écran et pied de page). « Ressources » n'apparaît que si des articles sont visibles. */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Accompagner',
    items: [
      { href: '/accompagnements/', label: 'Tous les accompagnements' },
      { href: '/accompagnements/chiot/', label: 'L’arrivée d’un chiot' },
      { href: '/accompagnements/chien-adulte/', label: 'Le chien adulte' },
      { href: '/accompagnements/quotidien/', label: 'Les difficultés du quotidien' },
      { href: '/accompagnements/comprendre/', label: 'Mieux comprendre son chien' },
    ],
  },
  {
    title: 'Découvrir',
    items: [
      { href: '/approche/', label: 'L’approche' },
      { href: '/a-propos/', label: 'Qui vous accompagne' },
      { href: '/premier-rendez-vous/', label: 'Le premier rendez-vous' },
      { href: '/deroulement/', label: 'Le déroulement' },
      { href: '/tarifs/', label: 'Tarifs' },
    ],
  },
  {
    title: 'Comprendre',
    items: [
      { href: '/explorer/', label: 'Explorer : expériences interactives' },
      { href: '/ressources/', label: 'Ressources et articles' },
      { href: '/orientation/', label: 'Par où commencer ?' },
      { href: '/faq/', label: 'Questions fréquentes' },
      { href: '/contact/', label: 'Contact' },
    ],
  },
];

export const CTA_NAV: NavItem = { href: '/parlons-de-votre-chien/', label: 'Parlons de votre chien' };

export const LEGAL_NAV: NavItem[] = [
  { href: '/mentions-legales/', label: 'Mentions légales' },
  { href: '/confidentialite/', label: 'Confidentialité' },
  { href: '/accessibilite/', label: 'Accessibilité' },
];
