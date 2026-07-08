import { useState, useEffect } from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { searchArticles } from '../services/api';
import { Article } from '../types';
import { Search, Loading } from 'lucide-react';

interface SearchPageProps {
  query: string;
}

export function SearchPage({ query }: SearchPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setArticles([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await searchArticles(query);
        setArticles(response.items);
      } catch (error) {
        console.error('Failed to search articles:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loading className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
          <Search className="w-5 h-5" />
          <span>搜索结果</span>
          {query && (
            <span className="text-gray-500 font-normal">: "{query}"</span>
          )}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {articles.length > 0 ? `找到 ${articles.length} 篇相关文章` : '输入关键词开始搜索'}
        </p>
      </div>

      {!query.trim() ? (
        <div className="text-center py-20 text-gray-500">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>请在顶部搜索框输入关键词</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>没有找到相关文章</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}