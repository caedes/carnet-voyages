import type { Day } from './types'

export const ITINERARY: Day[] = [
  // J1 · MERCREDI 8 AVRIL — Arrivée à Montréal
  {
    id: 'j1',
    number: 1,
    date: '2026-04-08',
    title: 'Arrivée à Montréal',
    subtitle: 'Vieux-Port & première soirée québécoise',
    distance: '25 km',
    duration: '0h30',
    location: { name: 'Montréal', lat: 45.5017, lng: -73.5673 },
    schedule: [
      { time: '11h00', label: 'Atterrissage · YUL', description: 'Navette 747 (10,25 CAD) ou taxi (~45 CAD) vers le centre-ville' },
      { time: '14h00', label: 'Vieux-Port de Montréal', description: 'Balade douce — rue de la Commune, place Jacques-Cartier. Pas de voiture J1–J2' },
      { time: 'Soir', label: 'Airbnb', description: '1677 Rue Saint-Denis — Hôte : Theatre By Lodgo · Studio Downtown Serenity · Check-in dès 16h · réf. HMBEHM4AH4' },
    ],
    routes: [],
    documents: [
      { icon: '🏠', label: 'Airbnb Downtown Serenity', detail: 'Réf. HMBEHM4AH4 · Check-in 16h', url: 'https://www.airbnb.fr/' },
      { icon: '✈️', label: 'Boarding Pass', detail: 'Vol aller', url: 'https://drive.google.com/file/d/1RWF-zcnSHwnZ2Aw1LKmDrK-Fc0r3RES4/view?usp=sharing' },
    ],
    stages: ['Aéroport YUL', 'Vieux-Port de Montréal', 'Airbnb Saint-Denis'],
    tips: ['Pas de voiture J1–J2 → économie parking ~30 CAD/nuit'],
  },

  // J2 · JEUDI 9 AVRIL — Mont-Royal & Ville souterraine
  {
    id: 'j2',
    number: 2,
    date: '2026-04-09',
    title: 'Mont-Royal & Ville souterraine',
    subtitle: 'Belvédère, lac aux Castors & RESO',
    distance: '0 km',
    duration: 'à pied',
    location: { name: 'Montréal', lat: 45.5017, lng: -73.5673 },
    schedule: [
      { time: '09h30', label: 'Belvédère Kondiaronk', description: 'Vue 360° sur la skyline — 20 min à pied depuis l\'avenue du Parc' },
      { time: '11h30', label: 'Lac aux Castors & sentiers', description: 'Faune locale, atmosphère unique en pleine ville' },
      { time: '14h00', label: 'RESO — Ville souterraine', description: '33 km de galeries climatisées entre musées, boutiques et stations de métro' },
      { time: 'Soir', label: 'Quartier des Spectacles', description: 'Dîner local. Pas de voiture.' },
    ],
    routes: [],
    documents: [
      { icon: '🏠', label: 'Airbnb Downtown Serenity', detail: '2e nuit', url: 'https://www.airbnb.fr/' },
    ],
    stages: ['Belvédère Kondiaronk', 'Lac aux Castors', 'RESO', 'Quartier des Spectacles'],
    tips: [],
  },

  // J3 · VENDREDI 10 AVRIL — Montréal → Ottawa
  {
    id: 'j3',
    number: 3,
    date: '2026-04-10',
    title: 'Montréal → Ottawa',
    subtitle: 'Parlement, Marché By & visite du Sénat',
    distance: '200 km',
    duration: '2h',
    location: { name: 'Ottawa', lat: 45.4215, lng: -75.6972 },
    schedule: [
      { time: '08h30', label: 'Récupération voiture', description: 'Agence centre-ville MTL (rue Stanley ou Drummond)' },
      { time: '09h–11h', label: 'Route Montréal → Ottawa', description: '200 km via A-417' },
      { time: '11h–13h', label: 'Colline du Parlement — extérieur', description: 'Flamme du Centenaire, photos devant les façades néogothiques' },
      { time: '13h–15h', label: 'Marché By', description: 'Déjeuner, fromages québécois, épiceries locales' },
      { time: '15h35', label: 'Visite guidée du Sénat du Canada', description: 'En français · prévoir arrivée 15h20 · gratuit · réservé' },
    ],
    routes: [
      { from: 'Montréal', to: 'Ottawa', distance: '200 km', duration: '2h', googleMapsUrl: 'https://www.google.com/maps/dir/Montreal,+QC/Ottawa,+ON' },
    ],
    documents: [
      { icon: '🏛️', label: 'Visite du Sénat', detail: 'Réservé parl.ca · Gratuit · 3 personnes · Arriver 15h20', url: 'https://drive.google.com/file/d/1nG1gtPfH4v1Gczqe-qgYpy2EEvx-QhNU/view?usp=sharing' },
      { icon: '🏨', label: 'Ottawa Embassy Hotel & Suites', detail: 'Réf. 5815.166.619 · Code 0309 · Parking CAD 28/j', url: 'https://drive.google.com/file/d/1Y2SaCbY8tLpjnfh6jzMUIdQNhvIZcHKB/view?usp=sharing' },
    ],
    stages: ['Colline du Parlement', 'Marché By', 'Sénat du Canada', 'Ottawa Embassy Hotel'],
    tips: [],
  },

  // J4 · SAMEDI 11 AVRIL — Parc Oméga
  {
    id: 'j4',
    number: 4,
    date: '2026-04-11',
    title: 'Parc Oméga',
    subtitle: 'Cerfs, élans, bisons & loups — journée complète',
    distance: '150 km',
    duration: '1h30 A/R',
    location: { name: 'Montebello / Parc Oméga', lat: 45.5500, lng: -74.9333 },
    schedule: [
      { time: '09h00', label: 'Départ Ottawa → Parc Oméga', description: '75 km / 45 min · Route 148' },
      { time: '09h45', label: 'Arrivée Parc Oméga — entrée 10h00', description: 'Billets W89483214 + W91290942 + W46500683 · CAD 139,70' },
      { time: '10h–16h', label: 'Parc Oméga — journée complète', description: 'Circuit voiture 15 km · cerfs, élans, bisons, loups · possibilité de faire 2 tours ! · Déjeuner au café du parc' },
      { time: '16h–17h', label: 'Retour Ottawa', description: '75 km / 45 min — soirée libre' },
    ],
    routes: [
      { from: 'Ottawa', to: 'Parc Oméga, Montebello', distance: '75 km', duration: '0h45', googleMapsUrl: 'https://www.google.com/maps/dir/Ottawa,+ON/Parc+Omega,+Route+323+Nord,+Montebello,+QC' },
      { from: 'Parc Oméga, Montebello', to: 'Ottawa', distance: '75 km', duration: '0h45', googleMapsUrl: 'https://www.google.com/maps/dir/Parc+Omega,+Route+323+Nord,+Montebello,+QC/Ottawa,+ON' },
    ],
    documents: [
      { icon: '🦌', label: 'Parc Oméga — Billets', detail: 'Commande C584830 · Billets W89483214 · W91290942 · W46500683 · CAD 139,70 · Entrée 10h00', url: 'https://drive.google.com/file/d/1QQN2XW_cMHGocmXZOWcBp9MRObv7WXHR/view?usp=sharing' },
      { icon: '🗺️', label: 'Parc Oméga — Carte', detail: 'Carte du parc (circuit voiture)', url: 'https://drive.google.com/file/d/1qR8Nl6eXo8Tj0XCYR9x4cXazJrS-2hrY/view?usp=sharing' },
      { icon: '🏨', label: 'Ottawa Embassy Hotel', detail: '2e nuit · Réf. 5815.166.619 · Check-out dim 12 avr', url: 'https://drive.google.com/file/d/1Y2SaCbY8tLpjnfh6jzMUIdQNhvIZcHKB/view?usp=sharing' },
    ],
    stages: ['Parc Oméga', 'Ottawa soirée libre'],
    tips: [
      'Apporter 2 grands sacs de carottes !',
      'Samedi = réserver impérativement.',
      'Refaire le circuit en fin d\'après-midi quand les animaux sont plus actifs.',
    ],
  },

  // J5 · DIMANCHE 12 AVRIL — Ottawa → Sucrerie → Québec
  {
    id: 'j5',
    number: 5,
    date: '2026-04-12',
    title: 'Ottawa → Sucrerie → Québec',
    subtitle: 'Festin de l\'érable & route vers la Vieille Capitale',
    distance: '410 km',
    duration: '3h45',
    location: { name: 'Québec', lat: 46.8139, lng: -71.2080 },
    schedule: [
      { time: '08h00', label: 'Check-out Ottawa & départ → Rigaud', description: '130 km / 1h15 · Route 148 Est' },
      { time: '10h30–13h30', label: 'Sucrerie de la Montagne, Rigaud', description: 'Commande #443701 · 11h30 · festin de l\'érable · tire sur neige · musique folk' },
      { time: '14h–16h30', label: 'Route → Québec (Sainte-Foy)', description: '280 km / 2h30 via A-40 Est' },
      { time: '16h30', label: 'Petit Hôtel – Café Krieghoff', description: '1089 Avenue Cartier, Québec' },
    ],
    routes: [
      { from: 'Ottawa', to: 'Sucrerie de la Montagne, Rigaud', distance: '130 km', duration: '1h15', googleMapsUrl: 'https://www.google.com/maps/dir/Ottawa,+ON/Sucrerie+de+la+Montagne,+Rigaud,+QC' },
      { from: 'Sucrerie de la Montagne, Rigaud', to: 'Québec, QC', distance: '280 km', duration: '2h30', googleMapsUrl: 'https://www.google.com/maps/dir/Sucrerie+de+la+Montagne,+Rigaud,+QC/Quebec+City,+QC' },
    ],
    documents: [
      { icon: '🍁', label: 'Sucrerie de la Montagne', detail: 'Commande #443701 · 11h30 · 3 personnes · CAD 180,50', url: 'https://drive.google.com/file/d/1MLVaBZNYVOztcSGMqCLOmqk02CvCvMeJ/view?usp=sharing' },
      { icon: '🏨', label: 'Petit Hôtel – Café Krieghoff', detail: 'Réf. 5520.787.332 · Code 3510 · +1 418 522 3711', url: 'https://drive.google.com/file/d/1gE9tojo_VmHTXh-2PEOozxlnq9u1Kguz/view?usp=sharing' },
    ],
    stages: ['Sucrerie de la Montagne', 'Route vers Québec', 'Petit Hôtel Krieghoff'],
    tips: [
      'Arriver vers 10h30 pour le service déjeuner 11h30.',
      'L\'A-40 mène ensuite à Québec en 2h30.',
    ],
  },

  // J6 · LUNDI 13 AVRIL — Vieux-Québec
  {
    id: 'j6',
    number: 6,
    date: '2026-04-13',
    title: 'Vieux-Québec',
    subtitle: 'Château Frontenac, Petit-Champlain & Plaines d\'Abraham',
    distance: '0 km',
    duration: 'bus local',
    location: { name: 'Québec', lat: 46.8139, lng: -71.2080 },
    schedule: [
      { time: '09h30', label: 'Bus depuis Sainte-Foy', description: 'Voiture laissée à l\'hébergement' },
      { time: '10h–13h', label: 'Château Frontenac & Terrasse Dufferin', description: 'Remparts, vue sur le Saint-Laurent' },
      { time: '13h–16h', label: 'Quartier Petit-Champlain', description: 'Rues pavées, boutiques d\'artisans, funiculaire' },
      { time: '16h–19h', label: 'Plaines d\'Abraham', description: 'Balade libre · coucher de soleil sur le fleuve' },
    ],
    routes: [],
    documents: [
      { icon: '🏨', label: 'Petit Hôtel Krieghoff', detail: '2e nuit', url: 'https://drive.google.com/file/d/1gE9tojo_VmHTXh-2PEOozxlnq9u1Kguz/view?usp=sharing' },
    ],
    stages: ['Château Frontenac', 'Quartier Petit-Champlain', 'Plaines d\'Abraham'],
    tips: [],
  },

  // J7 · MARDI 14 AVRIL — Chutes Montmorency & Île d'Orléans
  {
    id: 'j7',
    number: 7,
    date: '2026-04-14',
    title: 'Chutes Montmorency & Paul Mirabel',
    subtitle: 'Cascades, Île d\'Orléans & spectacle Paul Mirabel',
    distance: '80 km',
    duration: '1h30',
    location: { name: 'Québec', lat: 46.8139, lng: -71.2080 },
    schedule: [
      { time: '09h–11h', label: 'Chute Montmorency', description: '10 km / 15 min · débit maximal en avril (fonte des neiges !). Télécabine + passerelle suspendue.' },
      { time: '11h30–15h30', label: 'Île d\'Orléans', description: 'Circuit 67 km · 6 villages · cidre, fromage, confitures, chocolat' },
      { time: '20h00', label: 'Spectacle — Paul Mirabel · Par amour', description: 'Centre Vidéotron · Sec. 103 · Rangée RR · Sièges 15–17' },
    ],
    routes: [
      { from: 'Sainte-Foy, Québec', to: 'Chute Montmorency', distance: '10 km', duration: '0h15', googleMapsUrl: 'https://www.google.com/maps/dir/Sainte-Foy,+Quebec+City,+QC/Parc+de+la+Chute-Montmorency' },
      { from: 'Chute Montmorency', to: 'Île d\'Orléans', distance: '15 km', duration: '0h20', googleMapsUrl: 'https://www.google.com/maps/dir/Parc+de+la+Chute-Montmorency/Ile+d\'Orleans,+QC' },
    ],
    documents: [
      { icon: '🎵', label: 'Concert Paul Mirabel', detail: 'Centre Vidéotron · Sec. 103 · Rangée RR · Sièges 15–17', url: 'https://www.ticketmaster.fr' },
      { icon: '🏨', label: 'Petit Hôtel Krieghoff', detail: '3e nuit · Réf. 5520.787.332 · Check-out 15 avr avant 11h', url: 'https://drive.google.com/file/d/1gE9tojo_VmHTXh-2PEOozxlnq9u1Kguz/view?usp=sharing' },
    ],
    stages: ['Chute Montmorency', 'Île d\'Orléans', 'Concert Paul Mirabel'],
    tips: [
      'Chute Montmorency : débit maximal en avril.',
      'L\'escalier peut encore être fermé → prendre la télécabine.',
    ],
  },

  // J8 · MERCREDI 15 AVRIL — Charlevoix → La Malbaie
  {
    id: 'j8',
    number: 8,
    date: '2026-04-15',
    title: 'Charlevoix → La Malbaie',
    subtitle: 'Baie-Saint-Paul, Route 362 & panoramas géants',
    distance: '130 km',
    duration: '2h',
    location: { name: 'La Malbaie', lat: 47.6500, lng: -70.1500 },
    schedule: [
      { time: '09h–10h15', label: 'Route Québec → Baie-Saint-Paul', description: '90 km / 1h15 · Route 138 panoramique' },
      { time: '10h30–13h', label: 'Baie-Saint-Paul', description: 'Galeries d\'art, fromageries, chocolatiers — déjeuner' },
      { time: '13h30–16h30', label: 'Route 362 — panoramas géants', description: 'La plus belle route de Charlevoix : falaises, anses, fleuve. Arrêts Cap-aux-Oies et Cap-à-l\'Aigle' },
      { time: '16h30', label: 'La Malbaie — Pointe-au-Pic', description: 'Belvédère panoramique' },
    ],
    routes: [
      { from: 'Québec, QC', to: 'Baie-Saint-Paul, QC', distance: '90 km', duration: '1h15', googleMapsUrl: 'https://www.google.com/maps/dir/Quebec+City,+QC/Baie-Saint-Paul,+QC' },
      { from: 'Baie-Saint-Paul, QC', to: 'La Malbaie, QC', distance: '40 km', duration: '0h45', googleMapsUrl: 'https://www.google.com/maps/dir/Baie-Saint-Paul,+QC/La+Malbaie,+QC' },
    ],
    documents: [
      { icon: '🏨', label: 'Hôtel Le Petit Manoir du Casino', detail: 'Réf. 6415.507.197 · Code 9541 · +1 418 665 0000 · Dépôt CAD 250 · Parking gratuit', url: 'https://drive.google.com/file/d/1T5R-RJ_PJzvfWgh3zx17PVzsVhZkjdg1/view?usp=sharing' },
    ],
    stages: ['Baie-Saint-Paul', 'Route 362 Charlevoix', 'La Malbaie'],
    tips: [
      'Route 362 : la plus belle route de Charlevoix.',
      'Au belvédère de Pointe-au-Pic, le fleuve fait 20 km de large !',
    ],
  },

  // J9 · JEUDI 16 AVRIL — Fjord du Saguenay → Baie-Sainte-Catherine
  {
    id: 'j9',
    number: 9,
    date: '2026-04-16',
    title: 'Fjord du Saguenay → Baie-Sainte-Catherine',
    subtitle: 'L\'Anse-Saint-Jean, Cap Trinité & fjord vertigineux',
    distance: '120 km',
    duration: '2h30',
    location: { name: 'Baie-Sainte-Catherine', lat: 48.1167, lng: -69.8833 },
    schedule: [
      { time: '09h00', label: 'Départ La Malbaie → L\'Anse-Saint-Jean', description: '~90 km / 1h15 · Route 170 directe' },
      { time: '10h15–13h', label: 'L\'Anse-Saint-Jean — fjord du Saguenay', description: 'Pont couvert de la Confédération · belvédère Anse-de-Tabatière (fjord à 500 m de profondeur !)' },
      { time: '13h30–16h30', label: 'Cap Trinité / Rivière-Éternité', description: 'Statue Notre-Dame-du-Saguenay (9 m) · sentier belvédère · panorama vertigineux' },
      { time: '17h30', label: 'Route → Baie-Sainte-Catherine', description: '~45 km / 40 min' },
    ],
    routes: [
      { from: 'La Malbaie, QC', to: 'L\'Anse-Saint-Jean, QC', distance: '90 km', duration: '1h15', googleMapsUrl: 'https://www.google.com/maps/dir/La+Malbaie,+QC/L\'Anse-Saint-Jean,+QC' },
      { from: 'L\'Anse-Saint-Jean, QC', to: 'Rivière-Éternité, QC', distance: '30 km', duration: '0h30', googleMapsUrl: 'https://www.google.com/maps/dir/L\'Anse-Saint-Jean,+QC/Riviere-Eternite,+QC' },
      { from: 'Rivière-Éternité, QC', to: 'Baie-Sainte-Catherine, QC', distance: '45 km', duration: '0h40', googleMapsUrl: 'https://www.google.com/maps/dir/Riviere-Eternite,+QC/Baie-Sainte-Catherine,+QC' },
    ],
    documents: [
      { icon: '🏨', label: 'Gîte la Maison Rochefort', detail: 'Réf. 6415.533.267 · Code 4316 · Pdéj inclus · À 200m du traversier', url: 'https://drive.google.com/file/d/1yYvCUJxj90uhIzkDxIcu2nq5qPQ773VY/view?usp=sharing' },
    ],
    stages: ['L\'Anse-Saint-Jean', 'Cap Trinité / Rivière-Éternité', 'Baie-Sainte-Catherine'],
    tips: ['Le traversier pour Tadoussac part à 200m du gîte — J10 matin en 5 min !'],
  },

  // J10 · VENDREDI 17 AVRIL — Bélugas à Tadoussac → Montréal
  {
    id: 'j10',
    number: 10,
    date: '2026-04-17',
    title: 'Bélugas à Tadoussac → Montréal',
    subtitle: 'Traversier, dunes & longue route retour',
    distance: '420 km',
    duration: '5h',
    location: { name: 'Tadoussac', lat: 48.1486, lng: -69.7197 },
    schedule: [
      { time: '09h00', label: 'Traversier Baie-Sainte-Catherine → Tadoussac', description: 'GRATUIT · 5 min · départs toutes les 20 min' },
      { time: '10h15–12h', label: 'Tadoussac — bélugas !', description: 'Grève & dunes de sable rouge · mi-avril = premiers bélugas · Jumelles indispensables' },
      { time: '12h30', label: 'Route directe → Montréal', description: '~440 km / 5h · A-138 Sud puis A-40 · arrivée ~17h30' },
      { time: '17h30', label: 'Montréal — dernière nuit', description: 'Airbnb ou hôtel centre-ville' },
    ],
    routes: [
      { from: 'Baie-Sainte-Catherine, QC', to: 'Tadoussac, QC', distance: '5 km', duration: '0h10', googleMapsUrl: 'https://www.google.com/maps/dir/Baie-Sainte-Catherine,+QC/Tadoussac,+QC' },
      { from: 'Tadoussac, QC', to: 'Montréal, QC', distance: '440 km', duration: '5h', googleMapsUrl: 'https://www.google.com/maps/dir/Tadoussac,+QC/Montreal,+QC' },
    ],
    documents: [
      { icon: '🏨', label: 'Dernière nuit Montréal', detail: 'Réservé', url: 'https://www.booking.com/' },
    ],
    stages: ['Traversier', 'Tadoussac bélugas', 'Route vers Montréal'],
    tips: ['Bélugas mi-avril : observation gratuite depuis la rive !', 'Jumelles indispensables.'],
  },

  // J11 · SAMEDI 18 AVRIL — Dernière matinée → Vol retour
  {
    id: 'j11',
    number: 11,
    date: '2026-04-18',
    title: 'Dernière matinée → Vol retour',
    subtitle: 'Marché Jean-Talon, souvenirs & aéroport',
    distance: '10 km',
    duration: '0h15',
    location: { name: 'Montréal', lat: 45.5017, lng: -73.5673 },
    schedule: [
      { time: 'Matin', label: 'Montréal — boucle parfaite', description: 'Café du Plateau, Vieux-Port, balade de clôture' },
      { time: '10h–13h', label: 'Marché Jean-Talon', description: 'Ouvert dès 8h · sirop d\'érable, fromages, épices — derniers souvenirs !' },
      { time: '14h', label: 'Route → Aéroport YUL', description: '15 min depuis Jean-Talon · retour voiture agence YUL' },
      { time: '17h30', label: 'Retour voiture YUL', description: 'Prévoir 3h30 avant le vol' },
      { time: '21h00', label: 'Vol de retour', description: '' },
    ],
    routes: [
      { from: 'Marché Jean-Talon, Montréal', to: 'Aéroport YUL, Montréal', distance: '10 km', duration: '0h15', googleMapsUrl: 'https://www.google.com/maps/dir/Marche+Jean-Talon,+Montreal,+QC/Montreal-Trudeau+International+Airport' },
    ],
    documents: [],
    stages: ['Marché Jean-Talon', 'Aéroport YUL'],
    tips: [
      'Prévoir 3h30 avant le vol.',
      'Retour voiture agence YUL (one-way depuis centre-ville J3).',
    ],
  },
]

export function getDay(dayId: string): Day | undefined {
  return ITINERARY.find((d) => d.id === dayId)
}

export function getTodayDay(): Day | undefined {
  const today = new Date().toISOString().slice(0, 10)
  return ITINERARY.find((d) => d.date === today)
}
