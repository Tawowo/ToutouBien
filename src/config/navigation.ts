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
  { href: '/dossiers/', label: 'Comprendre' },
  { href: '/blog/', label: 'Blog' },
  { href: '/galerie/', label: 'Galerie' },
  { href: '/qui-suis-je/', label: 'Qui suis-je' },
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
      { href: '/approche/', label: 'L’approche' },
      { href: '/deroulement/', label: 'Le déroulement' },
      { href: '/premier-rendez-vous/', label: 'Le premier rendez-vous' },
      { href: '/tarifs/', label: 'Tarifs' },
    ],
  },
  {
    title: 'Comprendre',
    items: [
      { href: '/dossiers/', label: 'Les dossiers : comprendre les situations' },
      { href: '/decodeur/', label: 'Le décodeur du quotidien' },
      { href: '/explorer/', label: 'Explorer : expériences interactives' },
      { href: '/orientation/', label: 'Où en êtes-vous ? (orientation)' },
      { href: '/faq/', label: 'Questions fréquentes' },
      { href: '/questions/', label: 'Les questions que l’on n’ose pas poser' },
    ],
  },
  {
    title: 'ToutouBien',
    items: [
      { href: '/qui-suis-je/', label: 'Qui suis-je' },
      { href: '/blog/', label: 'Blog' },
      { href: '/ressources/', label: 'La bibliothèque' },
      { href: '/galerie/', label: 'Galerie' },
      { href: '/contact/', label: 'Contact' },
      { href: '/parlons-de-votre-chien/', label: 'Parlons de votre chien' },
    ],
  },
];

export const CTA_NAV: NavItem = { href: '/contact/', label: 'Contact' };

export const LEGAL_NAV: NavItem[] = [
  { href: '/mentions-legales/', label: 'Mentions légales' },
  { href: '/confidentialite/', label: 'Confidentialité' },
  { href: '/accessibilite/', label: 'Accessibilité' },
  { href: '/credits-photos/', label: 'Crédits photos' },
];
