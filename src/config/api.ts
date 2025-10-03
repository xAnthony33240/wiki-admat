// Configuration API pour différents environnements
const isDevelopment = import.meta.env.DEV;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:3001'  // Développement
  : '';                      // Production (même domaine)

export const API_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/api/upload`,
  SAVE_DATA: `${API_BASE_URL}/api/save-data`,
  GET_DATA: `${API_BASE_URL}/api/get-data`,
  UPLOADS: `${API_BASE_URL}/uploads`
};
