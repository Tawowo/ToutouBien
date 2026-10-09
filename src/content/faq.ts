/**
 * Questions fréquentes. Les réponses qui dépendent d'une information métier
 * ne sont générées que si celle-ci est publiable (voir src/config/site.ts).
 * Les réponses éditoriales sont à relire (docs/CONTENT-VALIDATION.md).
 */
import { site } from '~/config/site';
import { joinFr } from '~/lib/wizard';
import { resolve } from '~/lib/fields';

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  /** Visible uniquement parce que les brouillons sont affichés. */
  draft: boolean;
  /** Pages où la question est pertinente. */
  scope: ('accueil' | 'accompagnement' | 'contact')[];
}

export function buildFaq(): FaqItem[] {
  const items: FaqItem[] = [];
  const purpose = resolve(site.firstMeeting.purpose);
  const places = resolve(site.firstMeeting.places);
  const free = resolve(site.firstMeeting.free);
  const duration = resolve(site.firstMeeting.duration);
  const area = resolve(site.serviceArea.label);
  const remote = resolve(site.firstMeeting.remote);

  items.push({
    id: 'probleme',
    q: 'Faut-il que mon chien ait un « problème » pour prendre contact ?',
    a: 'Non. L’arrivée d’un chiot, une question du quotidien ou simplement l’envie de mieux comprendre votre chien sont de très bonnes raisons d’en parler.',
    draft: false,
    scope: ['accueil', 'accompagnement'],
  });

  if (purpose) {
    const where = places ? ` Il peut se dérouler ${joinFr(places.value)}.` : '';
    const how = duration ? ` Comptez environ ${duration.value}.` : '';
    items.push({
      id: 'premier-rendez-vous',
      q: 'À quoi sert le premier rendez-vous ?',
      a: `${purpose.value}${where}${how}`,
      draft: purpose.draft || Boolean(places?.draft) || Boolean(duration?.draft),
      scope: ['accueil', 'accompagnement'],
    });
  }

  if (free?.value === true) {
    const conditions = resolve(site.firstMeeting.conditions);
    items.push({
      id: 'gratuit',
      q: 'Le premier rendez-vous est-il payant ?',
      a: `Non, la première rencontre est offerte.${conditions ? ` ${conditions.value}` : ''}`,
      draft: free.draft || Boolean(conditions?.draft),
      scope: ['accueil', 'accompagnement', 'contact'],
    });
  }

  if (area) {
    items.push({ id: 'secteur', q: 'Dans quel secteur intervenez-vous ?', a: area.value, draft: area.draft, scope: ['accueil', 'accompagnement', 'contact'] });
  }

  if (remote) {
    items.push({
      id: 'distance',
      q: 'Un premier échange à distance est-il possible ?',
      a: remote.value ? 'Oui, un premier échange peut avoir lieu par téléphone ou en visio.' : 'Le premier échange se fait de préférence en présence de votre chien.',
      draft: remote.draft,
      scope: ['accompagnement', 'contact'],
    });
  }

  items.push({
    id: 'preparer',
    q: 'Que dois-je préparer avant de prendre contact ?',
    a: 'Rien de particulier. Si vous le souhaitez, notez les moments qui vous questionnent : où, quand, avec qui. Ces détails aident à mieux comprendre la situation, mais ils ne sont pas indispensables.',
    draft: false,
    scope: ['accompagnement', 'contact'],
  });

  items.push({
    id: 'morsure',
    q: 'Mon chien a mordu quelqu’un : que faire ?',
    a: 'La priorité est de faire soigner la personne blessée. En France, une morsure sur une personne doit être déclarée en mairie, et le chien fait l’objet d’une surveillance vétérinaire ainsi que d’une évaluation comportementale par un vétérinaire habilité : votre vétérinaire ou votre mairie vous indiqueront les démarches. Un changement soudain de comportement peut aussi avoir une cause médicale, comme une douleur. Vous pouvez ensuite décrire la situation via le formulaire.',
    draft: false,
    scope: ['accompagnement'],
  });

  return items;
}
