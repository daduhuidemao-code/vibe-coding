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