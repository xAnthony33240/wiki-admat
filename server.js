import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors());
app.use(express.json());

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(() => {});

// Servir les fichiers statiques depuis le dossier uploads
app.use('/uploads', express.static(uploadsDir));

// En production, servir les fichiers React buildés
if (isProduction) {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
}

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    // Accepter les images et vidéos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image et vidéo sont autorisés'), false);
    }
  }
});

// Route pour l'upload de fichiers
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Aucun fichier fourni' });
    }

    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chemin vers le fichier mockData.ts
const MOCK_DATA_PATH = path.join(__dirname, 'src', 'data', 'mockData.ts');

// Fonction pour générer le contenu du fichier mockData.ts
const generateMockDataContent = (categories, articles) => {
  const categoriesStr = JSON.stringify(categories, null, 2);
  const articlesStr = JSON.stringify(articles, null, 2).replace(
    /"createdAt": "([^"]+)"/g, 
    '"createdAt": new Date("$1")'
  ).replace(
    /"updatedAt": "([^"]+)"/g, 
    '"updatedAt": new Date("$1")'
  );

  return `import { Article, Category } from '../types';

export const categories: Category[] = ${categoriesStr};

export const articles: Article[] = ${articlesStr};
`;
};

// Route pour sauvegarder les données
app.post('/api/save-data', async (req, res) => {
  try {
    const { categories, articles } = req.body;
    
    // Convertir les dates en strings pour la sérialisation
    const serializedArticles = articles.map(article => ({
      ...article,
      createdAt: new Date(article.createdAt).toISOString(),
      updatedAt: new Date(article.updatedAt).toISOString()
    }));
    
    // Générer le nouveau contenu du fichier
    const newContent = generateMockDataContent(categories, serializedArticles);
    
    // Écrire dans le fichier
    await fs.writeFile(MOCK_DATA_PATH, newContent, 'utf8');
    
    console.log('✅ Données sauvegardées dans mockData.ts');
    res.json({ success: true, message: 'Données sauvegardées avec succès' });
  } catch (error) {
    console.error('❌ Erreur lors de la sauvegarde:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route pour lire les données actuelles
app.get('/api/get-data', async (req, res) => {
  try {
    // Lire le fichier actuel
    const content = await fs.readFile(MOCK_DATA_PATH, 'utf8');
    res.json({ success: true, content });
  } catch (error) {
    console.error('❌ Erreur lors de la lecture:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route catch-all pour React Router (en production)
if (isProduction) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📁 Fichier cible: ${MOCK_DATA_PATH}`);
  console.log(`🌍 Mode: ${isProduction ? 'Production' : 'Développement'}`);
});
