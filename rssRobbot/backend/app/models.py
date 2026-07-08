from sqlalchemy import Column, String, Text, Integer, Boolean, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Group(Base):
    __tablename__ = "groups"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    color = Column(String(7), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String(50), primary_key=True, index=True)
    feed_url = Column(String(500), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    group_id = Column(String(50), ForeignKey("groups.id"))
    polling_interval = Column(Integer, default=60)
    last_checked_at = Column(TIMESTAMP(timezone=True))
    enabled = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    subscription_id = Column(String(50), ForeignKey("subscriptions.id"))
    title = Column(String(500), nullable=False)
    link = Column(String(1000), nullable=False)
    content = Column(Text)
    summary = Column(Text)
    published_at = Column(TIMESTAMP(timezone=True))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())