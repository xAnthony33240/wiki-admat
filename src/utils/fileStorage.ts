import { Article, Category } from '../types';
import { API_ENDPOINTS } from '../config/api';

// Fonction pour sauvegarder les données dans le fichier source
export const saveDataToFile = async (articles: Article[], categories: Category[]): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.SAVE_DATA, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        articles,
        categories,
      }),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Données sauvegardées dans le fichier source');
      return true;
    } else {
      console.error('❌ Erreur lors de la sauvegarde:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur de connexion au serveur:', error);
    return false;
  }
};

// Fonction pour vérifier si le serveur de sauvegarde est disponible
export const checkServerAvailability = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_DATA);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Fonction pour afficher un message d'information à l'utilisateur
export const showSaveStatus = (success: boolean, isServerAvailable: boolean) => {
  if (!isServerAvailable) {
    console.warn('⚠️ Serveur de sauvegarde non disponible. Démarrez-le avec "npm run server"');
    return;
  }
  
  if (success) {
    // Vous pouvez remplacer ceci par une notification toast plus élégante
    console.log('✅ Données sauvegardées dans le code source !');
  } else {
    console.error('❌ Échec de la sauvegarde');
  }
};
