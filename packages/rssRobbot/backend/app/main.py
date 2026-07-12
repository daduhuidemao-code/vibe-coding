from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from api import groups_router, subscriptions_router, articles_router, statistics_router
from scheduler import start_scheduler, stop_scheduler, sync_all_feeds
from config import get_cors_origins, get_groups, get_subscriptions
from crud import create_group, update_group, create_subscription, update_subscription, get_group, get_subscription
from database import SessionLocal
from schemas import GroupBase, SubscriptionBase

Base.metadata.create_all(bind=engine)

app = FastAPI(title="RSS 订阅机器人", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(groups_router)
app.include_router(subscriptions_router)
app.include_router(articles_router)
app.include_router(statistics_router)


def sync_config_to_db():
    db = SessionLocal()
    
    for group_config in get_groups():
        existing = get_group(db, group_config["id"])
        group = GroupBase(
            id=group_config["id"],
            name=group_config["name"],
            color=group_config["color"]
        )
        if not existing:
            create_group(db, group)
        else:
            update_group(db, group_config["id"], group)
    
    for sub_config in get_subscriptions():
        existing = get_subscription(db, sub_config["id"])
        subscription = SubscriptionBase(
            id=sub_config["id"],
            feed_url=sub_config["feed_url"],
            title=sub_config["title"],
            group_id=sub_config["group_id"],
            polling_interval=sub_config["polling_interval"],
            enabled=sub_config["enabled"]
        )
        if not existing:
            create_subscription(db, subscription)
        else:
            update_subscription(db, sub_config["id"], subscription)
    
    db.close()


@app.on_event("startup")
async def on_startup():
    sync_config_to_db()
    sync_all_feeds()
    start_scheduler()


@app.on_event("shutdown")
async def on_shutdown():
    stop_scheduler()


@app.get("/")
def root():
    return {"message": "RSS 订阅机器人 API"}