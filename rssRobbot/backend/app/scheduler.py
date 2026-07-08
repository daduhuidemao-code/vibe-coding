from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from database import SessionLocal
from crud import get_subscriptions, get_subscription, article_exists, create_article, update_subscription_last_checked
from services.rss_parser import parse_rss_feed
from services.notification import notify_new_articles
from typing import List

scheduler = AsyncIOScheduler()


def fetch_rss_feed(subscription_id: str) -> List[dict]:
    new_articles = []
    
    db = SessionLocal()
    try:
        subscription = get_subscription(db, subscription_id)
        if not subscription or not subscription.enabled:
            db.close()
            return []
        
        feed_data = parse_rss_feed(subscription.feed_url)
        
        for article in feed_data["articles"]:
            if not article_exists(db, article.title, article.link):
                db_article = create_article(db, article, subscription.id)
                new_articles.append(db_article)
        
        update_subscription_last_checked(db, subscription.id)
        
        if new_articles:
            notify_new_articles(new_articles)
        
        return new_articles
    except Exception as e:
        print(f"Failed to fetch feed {subscription_id}: {e}")
        return []
    finally:
        db.close()


def sync_all_feeds() -> None:
    db = SessionLocal()
    subscriptions = get_subscriptions(db)
    db.close()
    
    for subscription in subscriptions:
        if subscription.enabled:
            fetch_rss_feed(subscription.id)


def setup_scheduler() -> None:
    db = SessionLocal()
    subscriptions = get_subscriptions(db)
    db.close()
    
    for subscription in subscriptions:
        if subscription.enabled:
            scheduler.add_job(
                fetch_rss_feed,
                "interval",
                minutes=subscription.polling_interval,
                args=[subscription.id],
                id=f"feed-{subscription.id}",
                replace_existing=True
            )
    
    scheduler.add_job(
        sync_all_feeds,
        "interval",
        hours=24,
        id="daily-sync",
        replace_existing=True
    )


def start_scheduler() -> None:
    setup_scheduler()
    scheduler.start()


def stop_scheduler() -> None:
    scheduler.shutdown()


def reschedule_feeds() -> None:
    scheduler.remove_all_jobs()
    setup_scheduler()