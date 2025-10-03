import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CategoryGrid } from './components/CategoryGrid';
import { categories as initialCategories, articles as initialArticles } from './data/mockData';
import { Article, Category, User } from './types';
import { ArticleView } from './components/ArticleView';
import { ArticleEditor } from './components/ArticleEditor';
import { CategoryEditor } from './components/CategoryEditor';
import { Login } from './components/Login.tsx';
import { PlusCircle } from 'lucide-react';
import { saveArticles, saveCategories, loadArticles, loadCategories, saveCurrentUser, loadCurrentUser, clearCurrentUser } from './utils/storage';
import { saveDataToFile, checkServerAvailability, showSaveStatus } from './utils/fileStorage';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Charger les données au démarrage
  useEffect(() => {
    const loadedArticles = loadArticles();
    const loadedCategories = loadCategories();
    const loadedUser = loadCurrentUser();
    
    // Charger l'utilisateur s'il existe
    if (loadedUser) {
      setCurrentUser(loadedUser);
    }
    
    // Si des données existent dans localStorage, les utiliser
    if (loadedArticles && loadedCategories) {
      setArticlesList(loadedArticles);
      setCategoriesList(loadedCategories);
    } else {
      // Sinon, utiliser les données par défaut et les sauvegarder
      setArticlesList(initialArticles);
      setCategoriesList(initialCategories);
      saveArticles(initialArticles);
      saveCategories(initialCategories);
    }
    
    setIsDataLoaded(true);
  }, []);

  // Fonction pour sauvegarder dans le fichier source
  const saveToSourceFile = async () => {
    if (articlesList.length > 0 && categoriesList.length > 0) {
      const isServerAvailable = await checkServerAvailability();
      const success = await saveDataToFile(articlesList, categoriesList);
      showSaveStatus(success, isServerAvailable);
    }
  };

  // Sauvegarder automatiquement les articles quand ils changent
  useEffect(() => {
    if (isDataLoaded && articlesList.length > 0) {
      saveArticles(articlesList);
      // Sauvegarder aussi dans le fichier source
      saveToSourceFile();
    }
  }, [articlesList, isDataLoaded]);

  // Sauvegarder automatiquement les catégories quand elles changent
  useEffect(() => {
    if (isDataLoaded && categoriesList.length > 0) {
      saveCategories(categoriesList);
      // Sauvegarder aussi dans le fichier source
      saveToSourceFile();
    }
  }, [categoriesList, isDataLoaded]);

  const isAdmin = currentUser?.role === 'admin';

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    saveCurrentUser(user); // Sauvegarder la session
  };

  const handleLogout = () => {
    setCurrentUser(null);
    clearCurrentUser(); // Effacer la session sauvegardée
    setSelectedArticle(null);
    setIsEditing(false);
    setIsNewArticle(false);
    setIsNewCategory(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedArticle(null);
    setIsEditing(false);
    setIsNewArticle(false);
    setIsNewCategory(false);
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    setSearchQuery('');
    setIsEditing(false);
    setIsNewArticle(false);
    setIsNewCategory(false);
  };

  const handleEditClick = () => {
    if (!isAdmin) {
      alert('Seuls les administrateurs peuvent modifier les articles.');
      return;
    }
    setIsEditing(true);
  };

  const handleNewArticle = () => {
    if (!isAdmin) {
      alert('Seuls les administrateurs peuvent créer des articles.');
      return;
    }
    const newArticle: Article = {
      id: `article-${Date.now()}`,
      title: '',
      description: '',
      category: categoriesList[0].name,
      content: '',
      author: currentUser?.name || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSelectedArticle(newArticle);
    setIsNewArticle(true);
    setIsEditing(true);
  };

  const handleNewCategory = () => {
    if (!isAdmin) {
      alert('Seuls les administrateurs peuvent créer des catégories.');
      return;
    }
    setIsNewCategory(true);
  };

  const handleSaveArticle = (updatedArticle: Article) => {
    if (!isAdmin) {
      alert('Seuls les administrateurs peuvent sauvegarder les articles.');
      return;
    }
    if (isNewArticle) {
      setArticlesList(prev => [...prev, updatedArticle]);
    } else {
      setArticlesList(prev => 
        prev.map(article => 
          article.id === updatedArticle.id ? updatedArticle : article
        )
      );
    }
    setSelectedArticle(updatedArticle);
    setIsEditing(false);
    setIsNewArticle(false);
  };

  const handleSaveCategory = (newCategory: Category) => {
    if (!isAdmin) {
      alert('Seuls les administrateurs peuvent sauvegarder les catégories.');
      return;
    }
    setCategoriesList(prev => [...prev, newCategory]);
    setIsNewCategory(false);
  };

  const handleDeleteArticle = () => {
    if (!isAdmin) {
      alert('Seuls les administrateurs peuvent supprimer les articles.');
      return;
    }
    if (selectedArticle) {
      setArticlesList(prev => prev.filter(article => article.id !== selectedArticle.id));
      setSelectedArticle(null);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!isAdmin) {
      alert('Seuls les administrateurs peuvent supprimer les catégories.');
      return;
    }
    setCategoriesList(prev => prev.filter(category => category.id !== categoryId));
  };


  const filteredArticles = searchQuery
    ? articlesList.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Afficher un indicateur de chargement pendant le chargement des données
  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {selectedArticle && isEditing ? (
          <ArticleEditor 
            article={selectedArticle}
            onSave={handleSaveArticle}
            onCancel={() => {
              setIsEditing(false);
              if (isNewArticle) setSelectedArticle(null);
            }}
            categories={categoriesList}
            isNew={isNewArticle}
          />
        ) : selectedArticle ? (
          <ArticleView 
            article={selectedArticle} 
            onBack={() => setSelectedArticle(null)}
            onEdit={handleEditClick}
            onDelete={handleDeleteArticle}
            isAdmin={isAdmin}
          />
        ) : isNewCategory ? (
          <CategoryEditor
            onSave={handleSaveCategory}
            onCancel={() => setIsNewCategory(false)}
          />
        ) : (
          <>
            {/* Search Results */}
            {searchQuery && (
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                  Résultats de recherche
                </h2>
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                      onClick={() => handleArticleSelect(article)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">{article.description}</p>
                    </div>
                  ))}
                  {filteredArticles.length === 0 && (
                    <p className="text-gray-600 dark:text-gray-300">Aucun résultat trouvé</p>
                  )}
                </div>
              </div>
            )}

            {/* Hero Section */}
            {!searchQuery && (
              <>
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Base de Connaissances Entreprise
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                    Accédez à toutes les ressources, guides et documentation dont vous avez besoin pour exceller dans votre travail.
                  </p>
                  {isAdmin && (
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={handleNewArticle}
                        className="flex items-center px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Nouvel Article
                      </button>
                      <button
                        onClick={handleNewCategory}
                        className="flex items-center px-6 py-3 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
                      >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Nouvelle Catégorie
                      </button>
                    </div>
                  )}
                </div>


                {/* Categories Grid */}
                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Catégories
                  </h2>
                  <CategoryGrid 
                    categories={categoriesList} 
                    onArticleSelect={handleArticleSelect} 
                    onCategoryDelete={handleDeleteCategory}
                    articles={articlesList}
                    isAdmin={isAdmin}
                  />
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;