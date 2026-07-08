import { Rss, Search, List } from 'lucide-react';

interface HeaderProps {
  currentPage: 'articles' | 'subscriptions' | 'search';
  onPageChange: (page: 'articles' | 'subscriptions' | 'search') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ currentPage, onPageChange, searchQuery, onSearchChange }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Rss className="w-8 h-8" />
            <h1 className="text-2xl font-bold">RSS 订阅机器人</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-2">
              <button
                onClick={() => onPageChange('articles')}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'articles'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                <span>文章</span>
              </button>
              <button
                onClick={() => onPageChange('subscriptions')}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
                  currentPage === 'subscriptions'
                    ? 'bg-white/20 text-white'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Rss className="w-4 h-4" />
                <span>订阅源</span>
              </button>
            </nav>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (e.target.value && currentPage !== 'search') {
                    onPageChange('search');
                  }
                }}
                className="pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}