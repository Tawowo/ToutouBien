/**
 * Configuration centrale de ToutouBien.
 *
 * C'est le SEUL fichier à modifier pour mettre à jour les informations de l'activité.
 * Chaque information porte un statut (voir src/lib/fields.ts) :
 * passez-la en `confirmed(...)` une fois validée par Mme Petitgand.
 *
 * Règle absolue : ne jamais saisir ici une information inventée.
 */
import { confirmed, fromBrief, missing, pending, type Field } from '~/lib/fields';

export interface ContactChannel {
  phone: Field<string>;
  /** Format international pour les liens `tel:` (ex. +33612345678). */
  phoneE164: Field<string>;
  email: Field<string>;
  /** Plages horaires de disponibilité téléphonique, uniquement si confirmées. */
  hours: Field<string>;
}

/** Une formule / prestation, telle qu'elle apparaîtra sur la page Tarifs. */
export interface Service {
  id: string;
  title: string;
  /** Pour qui. */
  audience: string;
  summary: string;
  /** Prix tel qu'affiché (ex. « 60 € »), uniquement s'il est confirmé. */
  price?: string;
  /** Précision sur le prix (ex. « par séance », « frais de déplacement inclus »). */
  priceNote?: string;
  duration?: string;
  includes: string[];
  conditions?: string;
  /** Accompagnements concernés (slugs de src/content/accompagnements.ts). */
  forPaths?: string[];
  highlight?: boolean;
}

export interface SocialProfile {
  label: string;
  url: string;
}

export const site = {
  name: confirmed('ToutouBien', 'Visible sur le logo fourni.'),
  tagline: confirmed('Une famille heureuse au quotidien', 'Signature visible sur le logo fourni.'),
  activity: confirmed(
    'Éducation canine et accompagnement des propriétaires de chiens',
    'Décrit dans le brief initial.',
  ),
  /** Langue et pays du site. */
  locale: 'fr-FR',

  educator: {
    /** Nom affiché publiquement. Le brief mentionne « Mme Petitgand » : à faire confirmer. */
    displayName: pending('Mme Petitgand', 'Nom d’usage public à confirmer (prénom + nom, ou nom seul).'),
    firstName: missing<string>('Prénom de l’éducatrice, si elle souhaite l’afficher.'),
    role: pending('Éducatrice canine', 'Intitulé exact du métier à confirmer (éducatrice canine, comportementaliste… selon les qualifications).'),
    /** Courte présentation (2-3 phrases) à la première personne ou à la troisième. */
    intro: missing<string>('Présentation courte : qui elle est, pourquoi elle a créé ToutouBien.'),
    story: missing<string[]>('Parcours : comment elle est venue à l’éducation canine (quelques paragraphes).'),
    vision: missing<string>('Sa vision de l’éducation canine et de la relation humain-chien.'),
    methods: missing<string>('Méthodes et outils utilisés (et ceux qu’elle n’utilise pas).'),
    values: missing<{ title: string; text: string }[]>('Trois à quatre valeurs, avec une phrase chacune.'),
    qualifications: missing<string[]>('Diplômes, certifications (ex. attestation ACACED), formations suivies — avec justificatifs.'),
    experience: missing<string>('Expérience (sans chiffre non vérifiable).'),
  },

  contact: {
    phone: missing<string>('Numéro de téléphone professionnel à afficher.'),
    phoneE164: missing<string>('Même numéro au format international (+33…).'),
    email: missing<string>('Adresse e-mail professionnelle à afficher.'),
    hours: missing<string>('Horaires de joignabilité (uniquement si elle souhaite les afficher).'),
  } satisfies ContactChannel,

  /** Zone d'intervention — ne jamais inventer de ville. */
  serviceArea: {
    label: missing<string>('Secteur d’intervention (ex. « Ville X et alentours, jusqu’à N km »).'),
    places: missing<string[]>('Liste des communes ou du département couverts (pour les données structurées).'),
    /** Commune de rattachement, uniquement si l'activité souhaite l'indiquer (pas d'adresse personnelle). */
    baseLocality: missing<string>('Commune de rattachement de l’activité (facultatif, utile au SEO local).'),
    region: missing<string>('Département / région.'),
  },

  social: missing<SocialProfile[]>('Profils sociaux officiels existants (Instagram, Facebook…), s’il y en a.'),

  /** Premier rendez-vous : affiché uniquement selon les informations validées. */
  firstMeeting: {
    /** Pratique décrite lors de l'échange initial. */
    purpose: fromBrief(
      'Parler de la situation, rencontrer votre chien et mieux comprendre vos besoins.',
      'Formulation fidèle au brief ; à relire.',
    ),
    places: fromBrief(['chez vous', 'en extérieur, par exemple pendant une balade'], 'Lieux évoqués dans le brief ; à confirmer.'),
    free: pending(true, 'Gratuité du premier déplacement évoquée — conditions exactes à confirmer (toujours ? sous conditions ? dans quel secteur ?).'),
    duration: missing<string>('Durée indicative du premier rendez-vous.'),
    conditions: missing<string>('Conditions particulières (distance, frais de déplacement…).'),
    remote: missing<boolean>('Un premier échange à distance (téléphone, visio) est-il possible ?'),
  },

  /** Prestations détaillées : aucune n'est confirmée à ce jour. */
  services: missing<Service[]>(
    'Liste des prestations réellement proposées (séances individuelles, suivi, ateliers…), avec tarifs si elle souhaite les afficher.',
  ),

  /** Informations juridiques (mentions légales). Toutes obligatoires avant publication. */
  legal: {
    publisherName: missing<string>('Nom et prénom de l’éditeur (ou dénomination sociale).'),
    legalForm: missing<string>('Statut juridique (ex. entreprise individuelle / micro-entreprise).'),
    siret: missing<string>('Numéro SIRET.'),
    address: missing<string>('Adresse de l’éditeur (domiciliation professionnelle possible).'),
    publicationDirector: missing<string>('Directeur ou directrice de la publication.'),
    vatNumber: missing<string>('Numéro de TVA intracommunautaire, le cas échéant.'),
    host: missing<{ name: string; address: string; contact: string }>('Hébergeur : nom, adresse, contact (dépend de la solution de déploiement retenue).'),
    privacyContact: missing<string>('Adresse de contact pour les demandes relatives aux données personnelles.'),
    mediator: missing<string>('Médiateur de la consommation (obligatoire pour les prestations aux particuliers).'),
    /** Proposition alignée sur la recommandation de la CNIL pour les données de prospects ; à valider. */
    retention: pending('3 ans à compter du dernier contact', 'Durée de conservation des demandes reçues via les formulaires (proposition à valider).'),
  },
} as const;

/** Libellé public de la personne qui accompagne, avec repli prudent. */
export const EDUCATOR_FALLBACK_LABEL = 'votre éducatrice';
