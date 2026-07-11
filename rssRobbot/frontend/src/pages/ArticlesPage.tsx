import { useState, useEffect } from 'react';
import { ArticleCard } from '../components/ArticleCard';
import { Pagination } from '../components/Pagination';
import { getArticles, getSubscriptions, getGroups } from '../services/api';
import { Article, Subscription, Group } from '../types';
import { Filter, Loader2 } from 'lucide-react';

interface ArticlesPageProps {
  onArticleClick: (articleId: number) => void;
}

export function ArticlesPage({ onArticleClick }: ArticlesPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [selectedSubscription, setSelectedSubscription] = useState<string | undefined>();
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [articlesResponse, subs, grps] = await Promise.all([
          getArticles({ page, page_size: pageSize, subscription_id: selectedSubscription, group_id: selectedGroup }),
          getSubscriptions(),
          getGroups()
        ]);
        setArticles(articlesResponse.items);
        setTotal(articlesResponse.total);
        setSubscriptions(subs);
        setGroups(grps);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [page, pageSize, selectedSubscription, selectedGroup]);

  const handleFilterChange = () => {
    setPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">最新文章</h2>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedGroup || ''}
              onChange={(e) => {
                setSelectedGroup(e.target.value || undefined);
                setSelectedSubscription(undefined);
                handleFilterChange();
              }}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部分组</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={selectedSubscription || ''}
              onChange={(e) => {
                setSelectedSubscription(e.target.value || undefined);
                setSelectedGroup(undefined);
                handleFilterChange();
              }}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <p>暂无文章</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} onClick={() => onArticleClick(article.id)} />
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