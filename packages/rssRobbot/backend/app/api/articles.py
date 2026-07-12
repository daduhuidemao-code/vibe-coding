from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud import get_articles, get_article, search_articles
from schemas import Article, ArticleListResponse, SearchResponse

router = APIRouter(prefix="/api", tags=["articles"])


@router.get("/articles", response_model=ArticleListResponse)
def list_articles(
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    subscription_id: str = Query(None),
    group_id: str = Query(None)
):
    items, total = get_articles(db, page, page_size, subscription_id, group_id)
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size
    }


@router.get("/articles/{article_id}", response_model=Article)
def get_article_detail(article_id: int, db: Session = Depends(get_db)):
    article = get_article(db, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@router.get("/search", response_model=SearchResponse)
def search(
    q: str = Query(..., description="搜索关键词"),
    db: Session = Depends(get_db)
):
    items = search_articles(db, q)
    return {
        "items": items,
        "total": len(items)
    }