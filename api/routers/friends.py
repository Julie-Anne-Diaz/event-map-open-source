from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/friends",
    tags=["Friends"]
)


@router.post("/add")
def send_friend_request(request: dict, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Send a friend request by email"""
    friend_email = request.get("email")
    
    if not friend_email:
        raise HTTPException(status_code=400, detail="Email is required")
    
    # Find user by email
    friend_user = db.query(models.User).filter(models.User.email == friend_email).first()
    
    if not friend_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if friend_user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot add yourself as friend")
    
    # Check if friend request already exists
    existing_request = db.query(models.FriendRequest).filter(
        (models.FriendRequest.sender_id == current_user.id) & 
        (models.FriendRequest.receiver_id == friend_user.id) &
        (models.FriendRequest.status == "pending")
    ).first()
    
    if existing_request:
        raise HTTPException(status_code=400, detail="Friend request already sent")
    
    # Check if already friends
    existing_friendship = db.query(models.Friendship).filter(
        ((models.Friendship.user_one_id == current_user.id) & 
         (models.Friendship.user_two_id == friend_user.id)) |
        ((models.Friendship.user_one_id == friend_user.id) & 
         (models.Friendship.user_two_id == current_user.id))
    ).first()
    
    if existing_friendship:
        raise HTTPException(status_code=400, detail="Already friends")
    
    # Create friend request
    friend_request = models.FriendRequest(
        sender_id=current_user.id,
        receiver_id=friend_user.id,
        status="pending"
    )
    
    db.add(friend_request)
    db.commit()
    db.refresh(friend_request)
    
    # TODO: Send email notification to friend_user.email
    # This would require email configuration (SMTP settings, email library like python-dotenv, etc.)
    
    return {
        "success": True,
        "message": f"Friend request sent to {friend_email}",
        "request_id": friend_request.id
    }


@router.get("/requests", response_model=list[schemas.FriendRequestResponse])
def get_pending_requests(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get all pending friend requests for current user"""
    requests = db.query(models.FriendRequest).filter(
        (models.FriendRequest.receiver_id == current_user.id) &
        (models.FriendRequest.status == "pending")
    ).all()
    
    return requests


@router.post("/requests/{request_id}/accept")
def accept_friend_request(request_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Accept a friend request"""
    friend_request = db.query(models.FriendRequest).filter(
        models.FriendRequest.id == request_id
    ).first()
    
    if not friend_request:
        raise HTTPException(status_code=404, detail="Friend request not found")
    
    if friend_request.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to accept this request")
    
    if friend_request.status != "pending":
        raise HTTPException(status_code=400, detail="Friend request already processed")
    
    # Update request status
    friend_request.status = "accepted"
    
    # Create friendship (ensure smaller id is user_one_id for consistency)
    user_one_id = min(friend_request.sender_id, friend_request.receiver_id)
    user_two_id = max(friend_request.sender_id, friend_request.receiver_id)
    
    friendship = models.Friendship(
        user_one_id=user_one_id,
        user_two_id=user_two_id
    )
    
    db.add(friendship)
    db.commit()
    db.refresh(friend_request)
    
    return {
        "success": True,
        "message": "Friend request accepted",
        "friendship_id": friendship.id
    }


@router.post("/requests/{request_id}/decline")
def decline_friend_request(request_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Decline a friend request"""
    friend_request = db.query(models.FriendRequest).filter(
        models.FriendRequest.id == request_id
    ).first()
    
    if not friend_request:
        raise HTTPException(status_code=404, detail="Friend request not found")
    
    if friend_request.receiver_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to decline this request")
    
    if friend_request.status != "pending":
        raise HTTPException(status_code=400, detail="Friend request already processed")
    
    # Update request status
    friend_request.status = "declined"
    db.commit()
    
    return {
        "success": True,
        "message": "Friend request declined"
    }
