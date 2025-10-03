# 🚀 Déploiement sur Railway

## Étapes de déploiement

### 1. Créer un compte Railway
- Allez sur [railway.app](https://railway.app)
- Connectez-vous avec GitHub

### 2. Préparer le repository GitHub
```bash
# Initialiser git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - Wiki ADMAT"

# Créer un repository sur GitHub et le lier
git remote add origin https://github.com/VOTRE_USERNAME/wiki-admat.git
git push -u origin main
```

### 3. Déployer sur Railway
1. Sur Railway, cliquez "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Choisissez votre repository `wiki-admat`
4. Railway détectera automatiquement Node.js
5. Le déploiement se lance automatiquement

### 4. Configuration automatique
- ✅ Port automatique (Railway configure `process.env.PORT`)
- ✅ Build automatique (`npm run start:prod`)
- ✅ Fichiers statiques servis
- ✅ API endpoints fonctionnels

### 5. Accès à votre wiki
Après déploiement, Railway vous donnera une URL comme :
`https://votre-projet.railway.app`

## 🔧 Variables d'environnement (optionnel)
Si besoin, vous pouvez ajouter dans Railway :
- `NODE_ENV=production` (déjà configuré automatiquement)

## 📁 Structure déployée
```
Railway
├── Frontend React (/)
├── API Backend (/api/*)
├── Upload files (/uploads/*)
└── Data persistence (mockData.ts)
```

## 🎯 Fonctionnalités en production
- ✅ Upload d'images/vidéos
- ✅ Sauvegarde automatique
- ✅ Interface complète
- ✅ Authentification admin
- ✅ Responsive design

Votre wiki sera accessible 24h/7j gratuitement ! 🎉
