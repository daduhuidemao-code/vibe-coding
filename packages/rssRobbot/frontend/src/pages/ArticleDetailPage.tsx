import { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Clock, Rss } from 'lucide-react';
import { getArticle } from '../services/api';
import { Article } from '../types';

interface ArticleDetailPageProps {
  articleId: number;
  onBack: () => void;
}

export function ArticleDetailPage({ articleId, onBack }: ArticleDetailPageProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const data = await getArticle(articleId);
        setArticle(data);
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">文章不存在</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回列表
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回文章列表</span>
      </button>

      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex-1">
            {article.title}
          </h1>
          <div className="flex items-center space-x-2">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              <span>原文链接</span>
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
          {article.subscription && (
            <div className="flex items-center space-x-2">
              <Rss className="w-4 h-4" />
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-full">
                {article.subscription.title}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(article.published_at)}</span>
          </div>
        </div>

        {article.summary && (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">摘要</h3>
            <p className="text-gray-600 dark:text-gray-400">{article.summary}</p>
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <div
            className="article-content text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content || '<p>暂无内容</p>' }}
          />
        </div>
      </article>
    </div>
  );
}