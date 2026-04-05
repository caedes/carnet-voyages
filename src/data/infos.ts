import type { Contact } from './types'

export const BUDGET_CATEGORIES = [
  {
    category: 'Vols',
    items: [
      { label: 'Bordeaux \u2194 Montr\u00e9al \u00b7 Air Transat \u00b7 3 passagers', amount: '1 652 \u20ac', status: 'confirmed' as const },
    ],
  },
  {
    category: 'H\u00e9bergements',
    items: [
      { label: 'Airbnb Montr\u00e9al (2 nuits)', amount: '175 \u20ac', status: 'confirmed' as const },
      { label: 'Ottawa Embassy Hotel (2 nuits)', amount: '233 \u20ac', status: 'confirmed' as const },
      { label: 'Petit H\u00f4tel Krieghoff, Qu\u00e9bec (3 nuits)', amount: '338 \u20ac', status: 'confirmed' as const },
      { label: 'Petit Manoir du Casino, La Malbaie (1 nuit)', amount: '129 \u20ac', status: 'confirmed' as const },
      { label: 'G\u00eete Maison Rochefort, Baie-Ste-Catherine (1 nuit)', amount: '136 \u20ac', status: 'confirmed' as const },
      { label: 'Derni\u00e8re nuit Montr\u00e9al', amount: '~120 \u20ac', status: 'estimated' as const },
    ],
  },
  {
    category: 'Activit\u00e9s',
    items: [
      { label: 'Parc Om\u00e9ga \u2014 3 billets', amount: '140 \u20ac', status: 'confirmed' as const },
      { label: 'Sucrerie de la Montagne \u2014 3 personnes', amount: '180 \u20ac', status: 'confirmed' as const },
    ],
  },
]

export const BUDGET_TOTAL_CONFIRMED = '3 103 \u20ac'
export const BUDGET_EXTRA = 'Carburant ~150 \u20ac \u00b7 repas ~300 \u20ac \u00b7 derni\u00e8re nuit ~120 \u20ac'

export const TRIP_STATS = {
  days: 11,
  nights: 10,
  km: '1 450',
  souvenirs: '\u221e',
}

export const CONTACTS: Contact[] = [
  { icon: '\ud83d\ude97', label: 'Agence location voiture', detail: 'Rue Stanley, Montr\u00e9al' },
  { icon: '\u2708\ufe0f', label: 'Air Transat', detail: 'Vol BOD \u2194 YUL' },
  { icon: '\ud83c\udd98', label: 'Urgences Canada', detail: '911', phone: '911' },
]

export const GENERAL_TIPS = [
  '\ud83e\udd55 Parc Om\u00e9ga : 2 grands sacs de carottes !',
  '\ud83d\udd2d Tadoussac : jumelles indispensables pour les b\u00e9lugas',
  '\ud83d\ude97 Voiture one-way : retour \u00e0 YUL, pas centre-ville',
  '\u26f0\ufe0f Chute Montmorency : escalier peut-\u00eatre ferm\u00e9 en avril \u2192 t\u00e9l\u00e9cabine',
  '\ud83c\udf41 Sucrerie : arriver vers 10h30 pour le service 11h30',
  '\ud83d\udc0b B\u00e9lugas mi-avril : observation gratuite depuis la rive !',
  '\ud83d\udee3\ufe0f Route 362 : la plus belle route de Charlevoix, belv\u00e9d\u00e8res \u00e0 Cap-aux-Oies et Cap-\u00e0-l\'Aigle',
]
