import type { Contact } from './types'

export const BUDGET_CATEGORIES = [
  {
    category: 'Vols',
    items: [
      { label: 'Bordeaux ↔ Montréal · Air Transat · 3 passagers', amount: '1 652 €', status: 'confirmed' as const },
    ],
  },
  {
    category: 'Hébergements',
    items: [
      { label: 'Airbnb Montréal (2 nuits)', amount: '175 €', status: 'confirmed' as const },
      { label: 'Ottawa Embassy Hotel (2 nuits)', amount: '233 €', status: 'confirmed' as const },
      { label: 'Petit Hôtel Krieghoff, Québec (3 nuits)', amount: '338 €', status: 'confirmed' as const },
      { label: 'Petit Manoir du Casino, La Malbaie (1 nuit)', amount: '129 €', status: 'confirmed' as const },
      { label: 'Gîte Maison Rochefort, Baie-Ste-Catherine (1 nuit)', amount: '136 €', status: 'confirmed' as const },
      { label: 'Dernière nuit Montréal', amount: '142 €', status: 'confirmed' as const },
    ],
  },
  {
    category: 'Activités',
    items: [
      { label: 'Parc Oméga — 3 billets', amount: '140 €', status: 'confirmed' as const },
      { label: 'Sucrerie de la Montagne — 3 personnes', amount: '180 €', status: 'confirmed' as const },
    ],
  },
]

export const BUDGET_TOTAL_CONFIRMED = '3 245 €'
export const BUDGET_EXTRA = 'Carburant ~150 € · repas ~300 €'

export const TRIP_STATS = {
  days: 11,
  nights: 10,
  km: '1 450',
  souvenirs: '∞',
}

export const CONTACTS: Contact[] = [
  { icon: '🚗', label: 'Agence location voiture', detail: 'Rue Stanley, Montréal' },
  { icon: '✈️', label: 'Air Transat', detail: 'Vol BOD ↔ YUL' },
  { icon: '🆘', label: 'Urgences Canada', detail: '911', phone: '911' },
]

export const GENERAL_TIPS = [
  '🥕 Parc Oméga : 2 grands sacs de carottes !',
  '🔭 Tadoussac : jumelles indispensables pour les bélugas',
  '🚗 Voiture one-way : retour à YUL, pas centre-ville',
  '⛰️ Chute Montmorency : escalier peut-être fermé en avril → télécabine',
  '🍁 Sucrerie : arriver vers 10h30 pour le service 11h30',
  '🐋 Bélugas mi-avril : observation gratuite depuis la rive !',
  '🛣️ Route 362 : la plus belle route de Charlevoix, belvédères à Cap-aux-Oies et Cap-à-l\'Aigle',
]
