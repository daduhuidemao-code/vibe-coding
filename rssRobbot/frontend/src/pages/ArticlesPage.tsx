import { useState, useEffect } from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { Pagination } from '../components/Pagination';
import { getArticles, getSubscriptions } from '../services/api';
import { Article, Subscription } from '../types';
import { Filter, Loading } from 'lucide-react';

export function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedSubscription, setSelectedSubscription] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articlesResponse, subs] = await Promise.all([
          getArticles({ page, page_size: pageSize, subscription_id: selectedSubscription }),
          getSubscriptions()
        ]);
        setArticles(articlesResponse.items);
        setTotal(articlesResponse.total);
        setSubscriptions(subs);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [page, pageSize, selectedSubscription]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loading className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">最新文章</h2>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={selectedSubscription || ''}
            onChange={(e) => {
              setSelectedSubscription(e.target.value || undefined);
              setPage(1);
            }}
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">全部订阅源</option>
            {subscriptions.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>暂无文章</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}