import { isEmail, isPhone } from './wizard';

export interface ContactAnswers {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  consent?: boolean;
}

export const CONTACT_LIMITS = { name: 80, email: 120, phone: 25, message: 1500 } as const;

export function validateContact(a: ContactAnswers): Partial<Record<keyof ContactAnswers, string>> {
  const e: Partial<Record<keyof ContactAnswers, string>> = {};
  if (!a.name?.trim()) e.name = 'Indiquez comment nous pouvons vous appeler.';
  else if (a.name.length > CONTACT_LIMITS.name) e.name = `${CONTACT_LIMITS.name} caractères maximum.`;
  if (!a.email && !a.phone) e.email = 'Indiquez au moins un moyen de vous répondre : e-mail ou téléphone.';
  if (a.email && !isEmail(a.email)) e.email = 'Indiquez une adresse e-mail valide, par exemple nom@exemple.fr.';
  if (a.phone && !isPhone(a.phone)) e.phone = 'Indiquez un numéro de téléphone valide, par exemple 06 12 34 56 78.';
  if (!a.message?.trim()) e.message = 'Écrivez quelques mots sur votre demande.';
  else if (a.message.length > CONTACT_LIMITS.message) e.message = `${CONTACT_LIMITS.message} caractères maximum.`;
  if (!a.consent) e.consent = 'Votre accord est nécessaire pour que nous puissions traiter votre demande.';
  return e;
}
