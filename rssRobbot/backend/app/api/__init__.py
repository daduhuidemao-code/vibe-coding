from .groups import router as groups_router
from .subscriptions import router as subscriptions_router
from .articles import router as articles_router

__all__ = ["groups_router", "subscriptions_router", "articles_router"]