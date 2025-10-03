import React from 'react';
import { Category, Article } from '../types';
import { ChevronRight, Trash2 } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  onArticleSelect: (article: Article) => void;
  onCategoryDelete: (categoryId: string) => void;
  articles: Article[];
  isAdmin: boolean;
}

export function CategoryGrid({ categories, onArticleSelect, onCategoryDelete, articles, isAdmin }: CategoryGridProps) {
  const getCategoryArticles = (categoryName: string) => {
    return articles.filter(article => article.category === categoryName);
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    const categoryArticles = getCategoryArticles(categoryName);
    if (categoryArticles.length > 0) {
      alert('Impossible de supprimer une catégorie contenant des articles.');
      return;
    }
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      onCategoryDelete(categoryId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const categoryArticles = getCategoryArticles(category.name);
        return (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-indigo-600 dark:text-indigo-400">
                  {category.icon}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {category.name}
                </h3>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 p-1"
                  title="Supprimer la catégorie"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {categoryArticles.map((article) => (
                <li key={article.id}>
                  <button
                    onClick={() => onArticleSelect(article)}
                    className="w-full flex items-center justify-between text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <span>{article.title}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}