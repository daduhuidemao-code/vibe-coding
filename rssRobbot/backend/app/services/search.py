from sqlalchemy.orm import Session
from models import Article
from sqlalchemy import desc
from typing import List


def search_articles(db: Session, query: str) -> List[Article]:
    return db.query(Article).filter(
        (Article.title.ilike(f"%{query}%")) | 
        (Article.content.ilike(f"%{query}%")) | 
        (Article.summary.ilike(f"%{query}%"))
    ).order_by(desc(Article.published_at)).all()