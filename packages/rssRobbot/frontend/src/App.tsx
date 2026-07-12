import { useState } from 'react';
import { Header } from './components/Header';
import { ArticlesPage } from './pages/ArticlesPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { SearchPage } from './pages/SearchPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';

type PageType = 'articles' | 'subscriptions' | 'search' | 'article-detail';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    setSelectedArticleId(null);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleArticleClick = (articleId: number) => {
    setSelectedArticleId(articleId);
    setCurrentPage('article-detail');
  };

  const handleBackToList = () => {
    setCurrentPage('articles');
    setSelectedArticleId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {currentPage !== 'article-detail' && (
        <Header
          currentPage={currentPage}
          onPageChange={handlePageChange}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />
      )}
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentPage === 'articles' && <ArticlesPage onArticleClick={handleArticleClick} />}
        {currentPage === 'subscriptions' && <SubscriptionsPage />}
        {currentPage === 'search' && <SearchPage query={searchQuery} onArticleClick={handleArticleClick} />}
        {currentPage === 'article-detail' && selectedArticleId && (
          <ArticleDetailPage articleId={selectedArticleId} onBack={handleBackToList} />
        )}
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          RSS 订阅机器人 - 完全公开的内容聚合器
        </div>
      </footer>
    </div>
  );
}

export default App;