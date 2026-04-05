# Carnet de Voyages — Design Spec

**Date** : 2026-04-05
**Projet** : App web mobile — carnet de souvenirs familial pour un road-trip Canada (Québec & Ontario)
**Voyage** : 8–18 avril 2026 · 11 jours · ~1 450 km · 2 adultes + 1 enfant (12 ans)
**Contrainte** : 2 jours de développement

---

## 1. Vue d'ensemble

Application web mobile-first sécurisée permettant à une famille de 3 personnes de :
- Consulter le programme jour par jour du road-trip (itinéraire pré-rempli depuis le PDF)
- Voir la météo prévisionnelle de chaque étape (lieu + date)
- Accéder rapidement aux itinéraires Google Maps et documents de réservation (Google Drive)
- Collecter des souvenirs (photos, vidéos, descriptions) organisés par jour et par étape

## 2. Stack technique

| Couche | Technologie |
|--------|------------|
| Framework | TanStack Start (SSR, Vite 7, React 19) |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| Formulaires | TanStack Form + Zod |
| UI / Styling | Ant Design (antd) |
| Auth | Firebase Auth (Google Sign-In) |
| Base de données | Cloud Firestore |
| Stockage médias | Firebase Storage |
| Météo | Open-Meteo API (gratuit, sans clé API, prévisions 16 jours) |
| Error tracking | Sentry (@sentry/tanstackstart-react) |
| Icônes | Ant Design Icons (@ant-design/icons) |
| Hébergement | Netlify |

## 3. Authentification & sécurité

- Firebase Auth avec Google Sign-In uniquement
- Whitelist de 3 adresses email :
  - Variable d'environnement `ALLOWED_EMAILS` (séparées par des virgules) pour la vérification côté client
  - Les mêmes emails sont hardcodés dans les règles de sécurité Firestore/Storage (les règles Firebase ne peuvent pas lire les variables d'env)
- Vérification côté client au login : si l'email n'est pas dans la whitelist, déconnexion immédiate + message d'erreur
- Règles Firestore et Storage : lecture/écriture uniquement si `request.auth.token.email` est dans la liste hardcodée
- Mapping des membres de la famille stocké en constante statique dans le code :
  ```typescript
  type FamilyMember = { email: string; name: string; initial: string }
  // Ex: [{ email: "romain@...", name: "Romain", initial: "R" }, ...]
  ```

## 4. Modèle de données

### 4.1 Données statiques (JSON dans le code)

L'itinéraire complet est pré-rempli en JSON statique, extrait du PDF. Pas de CRUD, lecture seule.

```typescript
type Day = {
  id: string                    // "j1", "j2", ...
  number: number                // 1, 2, ...
  date: string                  // "2026-04-08"
  title: string                 // "Arrivée Montréal"
  subtitle: string              // "Vieux-Port, installation"
  distance: string              // "25 km"
  duration: string              // "0h30"
  location: {
    name: string                // "Montréal"
    lat: number
    lng: number
  }
  schedule: ScheduleItem[]
  routes: Route[]
  documents: Document[]
  stages: string[]              // étapes du jour pour rattacher les souvenirs
                                // ex: ["Sucrerie de la Montagne", "Route → Québec", "Petit Hôtel Krieghoff"]
  tips: string[]                // conseils du jour
}

type ScheduleItem = {
  time: string                  // "14h00"
  label: string                 // "Vieux-Port de Montréal"
  description?: string          // "Balade douce — rue de la Commune..."
}

type Route = {
  from: string                  // "Ottawa"
  to: string                    // "Rigaud"
  distance: string              // "130 km"
  duration: string              // "1h15"
  googleMapsUrl: string         // lien deep-link Google Maps
}

type Document = {
  icon: string                  // emoji ou identifiant icône
  label: string                 // "Sucrerie de la Montagne"
  detail: string                // "Commande #443701 · 11h30 · 3 pers."
  url: string                   // lien Google Drive
}
```

### 4.2 Données dynamiques (Firestore)

Collection `memories` — les souvenirs uploadés par la famille :

```typescript
type Memory = {
  id: string                    // auto-generated
  dayId: string                 // "j5"
  stageLabel: string            // "Sucrerie de la Montagne"
  description: string           // texte libre
  authorEmail: string           // email Google de l'auteur
  authorName: string            // prénom affiché
  media: MediaItem[]             // photos et vidéos avec thumbnails
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### 4.3 Stockage médias (Firebase Storage)

Structure :
```
memories/{memoryId}/original/{filename}     // fichier original
memories/{memoryId}/thumbnail/{filename}    // miniature (photos uniquement)
```

**Photos** : JPEG/PNG, compression côté client avant upload (max ~2 Mo). Une miniature (~200px de large, ~30-80 Ko) est générée côté client et uploadée séparément. Les galeries et listes n'affichent que les thumbnails pour économiser la bande passante mobile.

**Vidéos** : MP4, limite à 50 Mo par vidéo. Une image poster est capturée côté client (première frame) et stockée comme thumbnail. Les vidéos ne sont streamées qu'au tap explicite de l'utilisateur.

**Distinction photo/vidéo dans le modèle** :

```typescript
type MediaItem = {
  filename: string              // nom du fichier original
  type: 'photo' | 'video'      // distinction explicite
  originalUrl: string           // URL Firebase Storage — fichier pleine résolution
  thumbnailUrl: string          // URL Firebase Storage — miniature (photo: image réduite, vidéo: poster frame)
  size: number                  // taille en octets du fichier original
}
```

## 5. Architecture des pages

### 5.1 Navigation

3 bottom tabs persistants :

| Tab | Route | Contenu |
|-----|-------|---------|
| **Jours** | `/` | Liste des 11 jours, jour en cours mis en avant |
| **Souvenirs** | `/souvenirs` | Galerie globale de tous les souvenirs, groupés par jour |
| **Infos** | `/infos` | Budget, chiffres du voyage, contacts, conseils |

### 5.2 Page Accueil — Liste des jours (`/`)

- Liste verticale des 11 jours
- Chaque carte affiche : numéro du jour, titre, date, distance
- Le jour correspondant à la date actuelle est visuellement mis en avant (bordure + badge "Auj.")
- Tap sur un jour → page détail

### 5.3 Page Détail du jour (`/jour/$dayId`)

Scroll vertical, sections empilées :

1. **Header** : bouton retour, numéro + titre du jour, date, distance
2. **Météo** : widget intégré (icône, température, conditions, min/max, précipitations). Données issues d'Open-Meteo pour le lieu + la date de l'étape.
3. **Programme** : liste horaire des activités (heure + description)
4. **Itinéraires** : liste verticale des trajets du jour. Chaque trajet affiche "Ville A → Ville B" avec distance/durée et un lien qui ouvre Google Maps.
5. **Documents** : liste verticale des réservations/billets du jour. Chaque document est nommé (ex : "Petit Hôtel – Café Krieghoff") avec détails (n° résa, code) et un lien vers le Google Drive.
6. **Souvenirs** : souvenirs du jour groupés par étape/lieu. Affiche les thumbnails photo/vidéo + description. Bouton "+ Ajouter" pour créer un nouveau souvenir.

### 5.4 Page Ajout de souvenir (`/jour/$dayId/souvenir/nouveau`)

- **Rattacher à** : jour pré-sélectionné + choix de l'étape parmi les étapes du jour (chips)
- **Photos & vidéos** : upload multi-fichiers depuis la galerie du téléphone. Aperçu des fichiers sélectionnés. Bouton "+" pour en ajouter.
- **Description** : champ texte libre
- **Auteur** : choix parmi les 3 membres de la famille (avatars avec initiale). Permet de poster pour un autre membre (utile si un membre n'a pas de réseau).
- **Publier** : sauvegarde en Firestore + upload des médias en Firebase Storage

### 5.5 Page Souvenirs globale (`/souvenirs`)

- Vue galerie de tous les souvenirs du voyage, groupés par jour
- Chaque souvenir affiche : thumbnails, description (tronquée), auteur, étape
- Tap sur un souvenir → vue détaillée (carrousel photos/vidéos + description complète)

### 5.6 Page Infos (`/infos`)

Contenu 100% statique, extrait du PDF :

- **Budget** : tableau détaillé (vols, hébergements, activités) + total confirmé + estimation complémentaire
- **Le voyage en chiffres** : 11 jours, 1 450 km, 10 nuits, ∞ souvenirs
- **Contacts utiles** : agence location voiture, Air Transat, urgences 911 — avec boutons "Appeler" (`tel:` links)
- **Conseils & rappels** : tips extraits du PDF (carottes Parc Oméga, jumelles Tadoussac, voiture one-way, etc.)

### 5.7 Page Login

- Écran simple avec le nom du voyage, un visuel, et un bouton "Se connecter avec Google"
- Après auth, vérification de l'email contre la whitelist
- Si non autorisé : déconnexion + message "Ce voyage est privé"

## 6. Intégration météo

- **API** : Open-Meteo (https://open-meteo.com/) — gratuit, sans clé API
- **Endpoint** : Forecast API avec paramètres latitude, longitude, date
- **Données affichées** : icône conditions, température moyenne, min, max, probabilité de précipitations, vitesse du vent
- **Cache** : TanStack Query avec `staleTime` de 3h (les prévisions ne changent pas toutes les minutes)
- **Coordonnées** : pré-remplies dans les données statiques pour chaque jour/lieu

## 7. Gestion d'erreurs

- **Sentry** : déjà configuré (`@sentry/tanstackstart-react`), capture les erreurs non gérées et les server functions
- **Upload échoué** : retry automatique + message utilisateur. Les médias en cours d'upload montrent une barre de progression.
- **Pas de réseau** : message clair "Pas de connexion — les souvenirs seront envoyés quand le réseau reviendra" (pas de mode offline complet, juste un message informatif)
- **Auth refusée** : message explicite "Ce voyage est privé" avec option de se reconnecter avec un autre compte

## 8. Performance

- **Images** : compression côté client avant upload (bibliothèque browser-image-compression ou similaire)
- **Thumbnails** : miniature ~200px générée et uploadée séparément pour chaque photo (~30-80 Ko). Pour les vidéos, capture de la première frame comme poster. Les galeries n'affichent que les thumbnails — le fichier original n'est chargé qu'au tap.
- **Lazy loading** : les thumbnails sont chargés au scroll (native `loading="lazy"`)
- **SSR** : TanStack Start pour le rendu initial rapide
- **Bundle** : code-splitting par route (automatique avec TanStack Router)
- **Budget data mobile** : l'architecture thumbnail-first est conçue pour minimiser la consommation data sur réseau 4G/5G

## 9. Ce qui est hors scope

- Édition de l'itinéraire (lecture seule)
- Mode offline complet (PWA avec sync)
- Notifications push
- Commentaires sur les souvenirs
- Édition/suppression de souvenirs (v1 : ajout uniquement)
- Carte interactive
- Export PDF du carnet
