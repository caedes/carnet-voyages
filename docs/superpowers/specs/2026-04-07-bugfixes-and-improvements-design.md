# Bugfixes & Improvements — Carnet de Voyages

**Date :** 2026-04-07
**Scope :** 6 modifications ciblées (navigation, encodage, données, documents)

---

## 1. Bottom tabs sur `/jour/:id`

**Problème :** Les routes `/jour/$dayId` et `/jour/$dayId/souvenir/nouveau` sont en dehors du layout `/_app`, qui est le seul à afficher `<BottomTabs />`. Résultat : pas de barre de navigation en bas sur les pages jour.

**Solution :** Déplacer les fichiers route sous le layout `/_app` :

| Avant | Après |
|-------|-------|
| `src/routes/jour/$dayId.tsx` | `src/routes/_app/jour/$dayId.tsx` |
| `src/routes/jour/$dayId_.souvenir.nouveau.tsx` | `src/routes/_app/jour/$dayId_.souvenir.nouveau.tsx` |

- Supprimer le dossier `src/routes/jour/` une fois les fichiers déplacés
- Régénérer le route tree (automatique au `dev`, ou `npx tsr generate`)
- Les URLs restent identiques (`/jour/j1`, `/jour/j1/souvenir/nouveau`) car TanStack Router utilise le segment `_app` comme layout group (préfixé `_`, il ne crée pas de segment d'URL)
- Supprimer le bouton retour `<LeftOutlined>` dans `$dayId.tsx` — la tab "Jours" suffit pour revenir

**Impact :** Le `paddingBottom: 80` déjà présent dans `$dayId.tsx` assure que le contenu ne sera pas masqué par la barre.

---

## 2. Caractères unicode échappés

**Problème :** Les séquences `\uXXXX` s'affichent littéralement dans l'UI au lieu des caractères correspondants (°, ·, à, é, etc.).

**Fichiers à modifier :**

### `src/components/WeatherWidget.tsx`
- Ligne 20 : `M\u00e9t\u00e9o` → `Météo`
- Ligne 35 : `\u00b0C` → `°C`
- Ligne 36 : `\u00b7` → `·`
- Ligne 37 : `\u00b0` → `°`, `\u00b7` → `·`

### `src/lib/weather.ts`
- Toutes les lignes 13-35 : remplacer `\u00e9` → `é`, `\u00e8` → `è`, `\u00ea` → `ê`, `\u00e9r\u00e9es` → `érées` dans les labels des codes météo

### `src/routes/_app/jour/$dayId_.souvenir.nouveau.tsx`
- Ligne 145 : `Rattacher \u00e0 \u00b7 J{day.number}` → `Rattacher à · J{day.number}`

### `src/data/infos.ts`
- Toutes les occurrences : `\u00e9` → `é`, `\u00f4` → `ô`, `\u00ee` → `î`, `\u20ac` → `€`, `\u00b7` → `·`, `\u2194` → `↔`, `\u2192` → `→`, `\u00ea` → `ê`, `\u00e0` → `à`

---

## 3. Documents J1/J2 — lien Airbnb

**Fichier :** `src/data/itinerary.ts`

- J1 (ligne 21) : `url: ''` → `url: 'https://www.airbnb.fr/'`
- J2 (ligne 45) : `url: ''` → `url: 'https://www.airbnb.fr/'`

---

## 4. J7 — titre & Spectacle

**Fichier :** `src/data/itinerary.ts`

- Ligne 172 : `title: 'Chutes Montmorency & Île d\'Orléans'` → `title: 'Chutes Montmorency & Paul Mirabel'`
- Ligne 173 : `subtitle: 'Cascades, terroir & concert Paul Mirabel'` → `subtitle: 'Cascades, Île d\'Orléans & spectacle Paul Mirabel'`
- Ligne 180 : `'Concert — Paul Mirabel · Par amour'` → `'Spectacle — Paul Mirabel · Par amour'`

---

## 5. J10 — Dernière nuit Montréal

### `src/data/itinerary.ts`
- Document J10 (ligne 276) :
  - `detail: 'À réserver · ~120 €'` → `detail: 'Réservé'`
  - `url: ''` → `url: 'https://www.booking.com/'`

### `src/data/infos.ts`
- Hébergement "Dernière nuit Montréal" (ligne 18) :
  - `amount: '~120 \u20ac'` → `amount: '142 €'`
  - `status: 'estimated'` → `status: 'confirmed'`
- `BUDGET_TOTAL_CONFIRMED` (ligne 30) : `'3 103 \u20ac'` → `'3 245 €'` (3 103 + 142)
- `BUDGET_EXTRA` (ligne 31) : retirer `dernière nuit ~120 €` de la chaîne

---

## 6. J1 — Boarding Pass

**Fichier :** `src/data/itinerary.ts`

Ajouter au tableau `documents` de J1 :
```ts
{ icon: '✈️', label: 'Boarding Pass', detail: 'Vol aller', url: 'https://drive.google.com/file/d/1RWF-zcnSHwnZ2Aw1LKmDrK-Fc0r3RES4/view?usp=sharing' }
```

---

## Hors scope

- Pas de changement de composant UI ou de style (sauf suppression du bouton retour)
- Pas de nouvelle fonctionnalité
- Pas de modification Firebase / backend
