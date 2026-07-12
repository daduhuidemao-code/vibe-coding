export interface Group {
  id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  feed_url: string;
  title: string;
  description?: string;
  group_id: string;
  polling_interval: number;
  last_checked_at?: string;
  enabled: boolean;
  created_at: string;
  group?: Group;
}

export interface Article {
  id: number;
  subscription_id: string;
  title: string;
  link: string;
  content?: string;
  summary?: string;
  published_at?: string;
  created_at: string;
  subscription?: Subscription;
}

export interface ArticleListResponse {
  items: Article[];
  total: number;
  page: number;
  page_size: number;
}

export interface SearchResponse {
  items: Article[];
  total: number;
}

export interface Statistics {
  total_articles: number;
  total_subscriptions: number;
  total_groups: number;
  enabled_subscriptions: number;
  articles_by_subscription: SubscriptionStats[];
  articles_by_group: GroupStats[];
  recent_activity: ActivityStats[];
}

export interface SubscriptionStats {
  id: string;
  title: string;
  count: number;
}

export interface GroupStats {
  id: string;
  name: string;
  count: number;
}

export interface ActivityStats {
  date: string | null;
  count: number;
}