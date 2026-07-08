import { Article } from '../types';
import { ExternalLink, Clock, Rss } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '未知时间';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 flex-1 mr-4">
          {article.title}
        </h3>
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
      
      {article.summary && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {article.summary}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          {article.subscription && (
            <>
              <Rss className="w-4 h-4" />
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                {article.subscription.title}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>{formatDate(article.published_at)}</span>
        </div>
      </div>
    </article>
  );
}