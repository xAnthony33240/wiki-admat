import React from 'react';
import { Clock, ThumbsUp, Eye } from 'lucide-react';
import { Article } from '../types';

interface PopularArticlesProps {
  articles: Article[];
}

export function PopularArticles({ articles }: PopularArticlesProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Articles Populaires
      </h2>
      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {article.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {article.description}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(article.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {article.views}
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {article.likes}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}