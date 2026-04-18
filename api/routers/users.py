from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
import schemas
from dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/", response_model=list[schemas.UserResponse])
def get_users(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users