from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class GroupBase(BaseModel):
    id: str
    name: str
    color: str


class Group(GroupBase):
    created_at: datetime

    class Config:
        from_attributes = True


class SubscriptionBase(BaseModel):
    id: str
    feed_url: str
    title: str
    description: Optional[str] = None
    group_id: str
    polling_interval: int = 60
    enabled: bool = True


class Subscription(SubscriptionBase):
    last_checked_at: Optional[datetime] = None
    created_at: datetime
    group: Optional[Group] = None

    class Config:
        from_attributes = True


class ArticleBase(BaseModel):
    title: str
    link: str
    content: Optional[str] = None
    summary: Optional[str] = None
    published_at: Optional[datetime] = None


class Article(ArticleBase):
    id: int
    subscription_id: str
    created_at: datetime
    subscription: Optional[Subscription] = None

    class Config:
        from_attributes = True


class ArticleListResponse(BaseModel):
    items: List[Article]
    total: int
    page: int
    page_size: int


class SearchResponse(BaseModel):
    items: List[Article]
    total: int