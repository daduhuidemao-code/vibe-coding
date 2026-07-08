import { Subscription } from '../types';
import { Rss, Clock, Folder } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const formatInterval = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    if (minutes < 1440) return `${Math.round(minutes / 60)}小时`;
    return `${Math.round(minutes / 1440)}天`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: subscription.group?.color + '20' }}
          >
            <Rss className="w-5 h-5" style={{ color: subscription.group?.color }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{subscription.title}</h3>
            <p className="text-sm text-gray-500 truncate max-w-xs">{subscription.feed_url}</p>
          </div>
        </div>
        {subscription.enabled ? (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
            已启用
          </span>
        ) : (
          <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">
            已禁用
          </span>
        )}
      </div>
      
      <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
        {subscription.group && (
          <div className="flex items-center space-x-1">
            <Folder className="w-4 h-4" />
            <span>{subscription.group.name}</span>
          </div>
        )}
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4" />
          <span>每 {formatInterval(subscription.polling_interval)} 更新</span>
        </div>
      </div>
    </div>
  );
}