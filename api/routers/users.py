from fastapi import APIRouter, Depends, HTTPException
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

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_id}/friends", response_model=list[schemas.UserResponse])
def get_friends(user_id: int, db: Session = Depends(get_db)):
    friendships = db.query(models.Friendship).filter(
        (models.Friendship.user_one_id == user_id) |
        (models.Friendship.user_two_id == user_id)
    ).all()

    friend_ids = [
        f.user_two_id if f.user_one_id == user_id else f.user_one_id
        for f in friendships
    ]

    friends = db.query(models.User).filter(models.User.id.in_(friend_ids)).all()
    return friends