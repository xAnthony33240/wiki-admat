import { Article, Category, User } from '../types';

const STORAGE_KEYS = {
  ARTICLES: 'wiki_admat_articles',
  CATEGORIES: 'wiki_admat_categories',
  CURRENT_USER: 'wiki_admat_current_user',
} as const;

// Utilitaires pour sérialiser/désérialiser les dates
const serializeArticles = (articles: Article[]): string => {
  return JSON.stringify(articles.map(article => ({
    ...article,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  })));
};

const deserializeArticles = (articlesJson: string): Article[] => {
  const articles = JSON.parse(articlesJson);
  return articles.map((article: any) => ({
    ...article,
    createdAt: new Date(article.createdAt),
    updatedAt: new Date(article.updatedAt),
  }));
};

// Fonctions pour sauvegarder les données
export const saveArticles = (articles: Article[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, serializeArticles(articles));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des articles:', error);
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des catégories:', error);
  }
};

// Fonctions pour charger les données
export const loadArticles = (): Article[] | null => {
  try {
    const articlesJson = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    if (articlesJson) {
      return deserializeArticles(articlesJson);
    }
    return null;
  } catch (error) {
    console.error('Erreur lors du chargement des articles:', error);
    return null;
  }
};

export const loadCategories = (): Category[] | null => {
  try {
    const categoriesJson = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (categoriesJson) {
      return JSON.parse(categoriesJson);
    }
    return null;
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error);
    return null;
  }
};


// Fonctions pour gérer la session utilisateur
export const saveCurrentUser = (user: User): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
  }
};

export const loadCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  } catch (error) {
    console.error('Erreur lors du chargement de l\'utilisateur:', error);
    return null;
  }
};

export const clearCurrentUser = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
  }
};
