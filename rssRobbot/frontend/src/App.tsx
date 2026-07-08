import { useState } from 'react';
import { Header } from './components/Header';
import { ArticlesPage } from './pages/ArticlesPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { SearchPage } from './pages/SearchPage';

type PageType = 'articles' | 'subscriptions' | 'search';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('articles');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentPage={currentPage}
        onPageChange={handlePageChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {currentPage === 'articles' && <ArticlesPage />}
        {currentPage === 'subscriptions' && <SubscriptionsPage />}
        {currentPage === 'search' && <SearchPage query={searchQuery} />}
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          RSS 订阅机器人 - 完全公开的内容聚合器
        </div>
      </footer>
    </div>
  );
}

export default App;