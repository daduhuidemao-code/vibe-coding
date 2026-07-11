from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from crud import get_statistics

router = APIRouter(prefix="/api", tags=["statistics"])


@router.get("/statistics")
def get_stats(db: Session = Depends(get_db)):
    return get_statistics(db)