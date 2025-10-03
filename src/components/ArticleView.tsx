import React from 'react';
import { Article } from '../types';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isAdmin: boolean;
}

export function ArticleView({ article, onBack, onEdit, onDelete, isAdmin }: ArticleViewProps) {
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      onDelete();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>
        {isAdmin && (
          <div className="flex items-center space-x-4">
            <button
              onClick={onEdit}
              className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Éditer
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </button>
          </div>
        )}
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {article.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Par {article.author}
          </p>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            {article.description}
          </p>
          
          <div 
            className="text-gray-600 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: article.content || '' }}
          />
        </div>
      </article>
    </div>
  );
}