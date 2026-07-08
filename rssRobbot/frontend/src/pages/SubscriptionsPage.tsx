import { useState, useEffect } from 'react';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { getSubscriptions, getGroups } from '../services/api';
import { Subscription, Group } from '../types';
import { Folder, Loading } from 'lucide-react';

export function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [subs, grps] = await Promise.all([
          getSubscriptions(),
          getGroups()
        ]);
        setSubscriptions(subs);
        setGroups(grps);
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const filteredSubscriptions = selectedGroup
    ? subscriptions.filter((sub) => sub.group_id === selectedGroup)
    : subscriptions;

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
        <h2 className="text-xl font-bold text-gray-800 mb-4">订阅源列表</h2>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedGroup(undefined)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              !selectedGroup
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`px-4 py-2 rounded-full text-sm transition-colors flex items-center space-x-1 ${
                selectedGroup === group.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedGroup === group.id ? group.color : undefined
              }}
            >
              <Folder className="w-3 h-3" />
              <span>{group.name}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                {subscriptions.filter((sub) => sub.group_id === group.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredSubscriptions.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>暂无订阅源</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSubscriptions.map((subscription) => (
            <SubscriptionCard key={subscription.id} subscription={subscription} />
          ))}
        </div>
      )}
    </div>
  );
}