from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import Group, Subscription, Article
from schemas import GroupBase, SubscriptionBase, ArticleBase
from typing import List, Optional


def get_group(db: Session, group_id: str) -> Optional[Group]:
    return db.query(Group).filter(Group.id == group_id).first()


def get_groups(db: Session) -> List[Group]:
    return db.query(Group).order_by(Group.name).all()


def create_group(db: Session, group: GroupBase) -> Group:
    db_group = Group(
        id=group.id,
        name=group.name,
        color=group.color
    )
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group


def update_group(db: Session, group_id: str, group: GroupBase) -> Optional[Group]:
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if db_group:
        db_group.name = group.name
        db_group.color = group.color
        db.commit()
        db.refresh(db_group)
    return db_group


def delete_group(db: Session, group_id: str) -> bool:
    db_group = db.query(Group).filter(Group.id == group_id).first()
    if db_group:
        db.delete(db_group)
        db.commit()
        return True
    return False


def get_subscription(db: Session, subscription_id: str) -> Optional[Subscription]:
    return db.query(Subscription).filter(Subscription.id == subscription_id).first()


def get_subscriptions(db: Session) -> List[Subscription]:
    return db.query(Subscription).order_by(Subscription.title).all()


def create_subscription(db: Session, subscription: SubscriptionBase) -> Subscription:
    db_subscription = Subscription(
        id=subscription.id,
        feed_url=subscription.feed_url,
        title=subscription.title,
        description=subscription.description,
        group_id=subscription.group_id,
        polling_interval=subscription.polling_interval,
        enabled=subscription.enabled
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription


def update_subscription(db: Session, subscription_id: str, subscription: SubscriptionBase) -> Optional[Subscription]:
    db_subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if db_subscription:
        db_subscription.feed_url = subscription.feed_url
        db_subscription.title = subscription.title
        db_subscription.description = subscription.description
        db_subscription.group_id = subscription.group_id
        db_subscription.polling_interval = subscription.polling_interval
        db_subscription.enabled = subscription.enabled
        db.commit()
        db.refresh(db_subscription)
    return db_subscription


def update_subscription_last_checked(db: Session, subscription_id: str) -> None:
    db_subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if db_subscription:
        db_subscription.last_checked_at = func.now()
        db.commit()


def delete_subscription(db: Session, subscription_id: str) -> bool:
    db_subscription = db.query(Subscription).filter(Subscription.id == subscription_id).first()
    if db_subscription:
        db.delete(db_subscription)
        db.commit()
        return True
    return False


def get_article(db: Session, article_id: int) -> Optional[Article]:
    return db.query(Article).filter(Article.id == article_id).first()


def get_articles(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    subscription_id: Optional[str] = None,
    group_id: Optional[str] = None
) -> tuple:
    query = db.query(Article).order_by(desc(Article.published_at))
    
    if subscription_id:
        query = query.filter(Article.subscription_id == subscription_id)
    
    if group_id:
        query = query.join(Subscription).filter(Subscription.group_id == group_id)
    
    total = query.count()
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    
    return items, total


def create_article(db: Session, article: ArticleBase, subscription_id: str) -> Article:
    db_article = Article(
        subscription_id=subscription_id,
        title=article.title,
        link=article.link,
        content=article.content,
        summary=article.summary,
        published_at=article.published_at
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


def article_exists(db: Session, title: str, link: str) -> bool:
    return db.query(Article).filter(
        (Article.title == title) | (Article.link == link)
    ).first() is not None


def search_articles(db: Session, query: str) -> List[Article]:
    return db.query(Article).filter(
        (Article.title.ilike(f"%{query}%")) | (Article.content.ilike(f"%{query}%")) | (Article.summary.ilike(f"%{query}%"))
    ).order_by(desc(Article.published_at)).all()


def get_statistics(db: Session) -> dict:
    total_articles = db.query(Article).count()
    total_subscriptions = db.query(Subscription).count()
    total_groups = db.query(Group).count()
    enabled_subscriptions = db.query(Subscription).filter(Subscription.enabled == True).count()
    
    articles_by_subscription = db.query(
        Subscription.id,
        Subscription.title,
        func.count(Article.id).label('article_count')
    ).outerjoin(Article).group_by(Subscription.id, Subscription.title).order_by(desc(func.count(Article.id))).all()
    
    articles_by_group = db.query(
        Group.id,
        Group.name,
        func.count(Article.id).label('article_count')
    ).outerjoin(Subscription).outerjoin(Article).group_by(Group.id, Group.name).order_by(desc(func.count(Article.id))).all()
    
    recent_activity = db.query(
        Article.published_at,
        func.count(Article.id).label('count')
    ).filter(Article.published_at.isnot(None)).group_by(Article.published_at).order_by(desc(Article.published_at)).limit(7).all()
    
    return {
        'total_articles': total_articles,
        'total_subscriptions': total_subscriptions,
        'total_groups': total_groups,
        'enabled_subscriptions': enabled_subscriptions,
        'articles_by_subscription': [
            {'id': s.id, 'title': s.title, 'count': s.article_count}
            for s in articles_by_subscription
        ],
        'articles_by_group': [
            {'id': g.id, 'name': g.name, 'count': g.article_count}
            for g in articles_by_group
        ],
        'recent_activity': [
            {'date': a.published_at.isoformat() if a.published_at else None, 'count': a.count}
            for a in recent_activity
        ]
    }