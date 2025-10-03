# 🚀 Déploiement sur Render (100% Gratuit)

## Étapes de déploiement

### 1. Créer un compte Render
- Allez sur [render.com](https://render.com)
- Connectez-vous avec GitHub (gratuit)

### 2. Préparer le repository GitHub
```bash
# Dans le dossier de votre projet
cd /home/atoll/Bureau/Wiki_ADMAT-main

# Initialiser git
git init
git add .
git commit -m "Wiki ADMAT - Ready for Render deployment"

# Créer un repository sur GitHub et le lier
git remote add origin https://github.com/VOTRE_USERNAME/wiki-admat.git
git push -u origin main
```

### 3. Déployer sur Render
1. Sur Render Dashboard, cliquez **"New +"**
2. Sélectionnez **"Web Service"**
3. Connectez votre repository GitHub `wiki-admat`
4. Configuration automatique :
   - **Name** : `wiki-admat`
   - **Environment** : `Node`
   - **Build Command** : `npm install && npm run build`
   - **Start Command** : `npm run server:prod`
   - **Plan** : `Free` ✅

### 4. Variables d'environnement (automatiques)
- `NODE_ENV=production` (Render le configure automatiquement)
- `PORT` (Render assigne automatiquement)

### 5. Déploiement
- Render build et déploie automatiquement
- Durée : ~3-5 minutes
- URL fournie : `https://wiki-admat-XXXX.onrender.com`

## 🎯 Fonctionnalités en production
- ✅ **Upload d'images/vidéos** (stockage temporaire)
- ✅ **Sauvegarde dans mockData.ts**
- ✅ **Interface complète**
- ✅ **Authentification admin**
- ✅ **Responsive design**

## ⚠️ Limitations (plan gratuit)
- **Mise en veille** après 15min d'inactivité
- **Réveil** en ~30 secondes au premier accès
- **750h/mois** d'utilisation (largement suffisant)
- **Stockage temporaire** (fichiers uploadés peuvent être perdus au redémarrage)

## 💡 Conseils
- Pour éviter la mise en veille : visitez votre site régulièrement
- Les données (articles/catégories) sont sauvées dans le code
- Les fichiers uploadés sont temporaires sur le plan gratuit

Votre wiki sera accessible 24h/7j gratuitement ! 🎉
