# Wiki ADMAT

## Fonctionnalités

### Éditeur d'articles avancé
- **Éditeur riche** avec TipTap
- **Support des images** : Upload local + URL
- **Support des vidéos** : Upload local + URL  
- **Formatage** : Gras, italique, titres, listes, tableaux
- **Code** : Blocs de code avec coloration syntaxique
- **Alignement** : Gauche, centre, droite

### Gestion des médias
- **Upload d'images** : JPG, PNG, GIF, WebP (max 50MB)
- **Upload de vidéos** : MP4, WebM, AVI (max 50MB)
- **Drag & Drop** : Glissez-déposez vos fichiers
- **Stockage local** : Fichiers sauvés dans `/uploads`

### Utilisation

#### Ajouter une image
1. Cliquez sur l'icône pour une URL
2. Cliquez sur l'icône pour uploader un fichier
3. Glissez-déposez directement dans la zone d'upload

#### Ajouter une vidéo  
1. Cliquez sur l'icône pour une URL
2. Cliquez sur l'icône pour uploader un fichier
3. Les vidéos sont automatiquement intégrées avec contrôles

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur backend
npm run server

# Démarrer l'application (nouveau terminal)
npm run dev
```

### Structure des fichiers
```
uploads/           # Fichiers uploadés (images/vidéos)
src/
  components/
    ArticleEditor.tsx    # Éditeur avec support média
    FileUpload.tsx       # Composant d'upload
  extensions/
    Video.ts            # Extension vidéo TipTap
```

### Sécurité
- Validation des types de fichiers côté serveur
- Limite de taille : 50MB par fichier
- Noms de fichiers uniques générés automatiquement