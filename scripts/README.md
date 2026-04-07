# Scripts

## set-claims.js — Gestion des accès famille

Ce script attribue le custom claim `familyMember: true` sur les comptes Firebase Auth des membres de la famille. Ce claim est utilisé par les security rules Firestore et Storage pour contrôler l'accès.

### Prérequis

1. **Service account key** : télécharger depuis Firebase Console → Project Settings → Service Accounts → Generate New Private Key
2. Sauvegarder le fichier sous `scripts/service-account-key.json` (ce fichier est gitignored)
3. `firebase-admin` est déjà dans les devDependencies

### Utilisation

```bash
node scripts/set-claims.js
```

### Ajouter un membre

1. Ajouter un document dans la collection `family` via la Firebase Console (champs : `email`, `name`, `version`)
2. S'assurer que la personne s'est connectée au moins une fois (pour que son compte Firebase Auth existe)
3. Lancer `node scripts/set-claims.js`
4. La personne doit se déconnecter et se reconnecter

### Retirer un membre

1. Supprimer le document de la collection `family` dans la Firebase Console
2. Pour révoquer immédiatement l'accès, lancer dans un script Node.js :
   ```js
   admin.auth().setCustomUserClaims(uid, { familyMember: false })
   ```
