# Déploiement

## Netlify

L'application est déployée automatiquement sur Netlify. Chaque pull request génère une URL de preview.

## Firebase Auth — Domaines autorisés

Pour que la connexion Google fonctionne sur un domaine (production ou preview), il faut l'ajouter dans Firebase :

1. Aller dans [Firebase Console](https://console.firebase.google.com) → Authentication → Settings → Authorized domains
2. Ajouter le domaine :
   - Production : `carnet-voyages.netlify.app`
   - Previews Netlify : `deploy-preview-*--carnet-voyages.netlify.app` (ou ajouter chaque URL de preview individuellement, Firebase ne supporte pas les wildcards — ajouter le domaine exact de chaque preview, par exemple `deploy-preview-1--carnet-voyages.netlify.app`)

> **Note :** Firebase n'accepte pas les wildcards dans les domaines autorisés. Pour les previews Netlify, il faut ajouter chaque domaine de preview manuellement, ou utiliser un domaine personnalisé unique pour toutes les previews.

## Firebase Security Rules

Après un merge sur `main`, déployer les rules :

```bash
firebase deploy --only firestore:rules,storage
```

## Custom Claims (accès famille)

Voir [scripts/README.md](../scripts/README.md) pour la gestion des accès famille via custom claims.
