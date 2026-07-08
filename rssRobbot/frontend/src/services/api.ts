import { Group, Subscription, Article, ArticleListResponse, SearchResponse } from '../types';

const BASE_URL = '/api';

export async function getGroups(): Promise<Group[]> {
  const response = await fetch(`${BASE_URL}/groups`);
  return response.json();
}

export async function getGroup(groupId: string): Promise<Group> {
  const response = await fetch(`${BASE_URL}/groups/${groupId}`);
  return response.json();
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const response = await fetch(`${BASE_URL}/subscriptions`);
  return response.json();
}

export async function getSubscription(subscriptionId: string): Promise<Subscription> {
  const response = await fetch(`${BASE_URL}/subscriptions/${subscriptionId}`);
  return response.json();
}

export async function getArticles(
  params?: {
    page?: number;
    page_size?: number;
    subscription_id?: string;
    group_id?: string;
  }
): Promise<ArticleListResponse> {
  const url = new URL(`${BASE_URL}/articles`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  const response = await fetch(url.toString());
  return response.json();
}

export async function getArticle(articleId: number): Promise<Article> {
  const response = await fetch(`${BASE_URL}/articles/${articleId}`);
  return response.json();
}

export async function searchArticles(query: string): Promise<SearchResponse> {
  const url = new URL(`${BASE_URL}/search`);
  url.searchParams.set('q', query);
  const response = await fetch(url.toString());
  return response.json();
}