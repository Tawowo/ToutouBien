export interface NavItem {
  href: string;
  label: string;
}

/** Navigation principale. « Ressources » n'apparaît que si des articles sont visibles. */
export const PRIMARY_NAV: NavItem[] = [
  { href: '/accompagnement/', label: 'L’accompagnement' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/ressources/', label: 'Ressources' },
  { href: '/contact/', label: 'Contact' },
];

export const CTA_NAV: NavItem = { href: '/parlons-de-votre-chien/', label: 'Parlons de votre chien' };

export const LEGAL_NAV: NavItem[] = [
  { href: '/mentions-legales/', label: 'Mentions légales' },
  { href: '/confidentialite/', label: 'Confidentialité' },
];
