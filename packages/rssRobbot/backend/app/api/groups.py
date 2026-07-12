from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud import get_groups, get_group
from schemas import Group

router = APIRouter(prefix="/api/groups", tags=["groups"])


@router.get("/", response_model=list[Group])
def list_groups(db: Session = Depends(get_db)):
    return get_groups(db)


@router.get("/{group_id}", response_model=Group)
def get_group_detail(group_id: str, db: Session = Depends(get_db)):
    group = get_group(db, group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group