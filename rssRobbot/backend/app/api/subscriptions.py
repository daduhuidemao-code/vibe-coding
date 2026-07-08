from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud import get_subscriptions, get_subscription
from schemas import Subscription

router = APIRouter(prefix="/api/subscriptions", tags=["subscriptions"])


@router.get("/", response_model=list[Subscription])
def list_subscriptions(db: Session = Depends(get_db)):
    return get_subscriptions(db)


@router.get("/{subscription_id}", response_model=Subscription)
def get_subscription_detail(subscription_id: str, db: Session = Depends(get_db)):
    subscription = get_subscription(db, subscription_id)
    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return subscription