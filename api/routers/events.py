from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
import schemas
from dependencies import get_db, get_current_user

router = APIRouter(
    prefix="/events",
    tags=["Events"]
)


@router.post("/", response_model=schemas.EventResponse)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_event = models.Event(
        creator_user_id=1,  
        title=event.title,
        description=event.description,
        visibility=event.visibility,
        start_time=event.start_time,
        end_time=event.end_time,
        capacity=event.capacity,
        location_name=event.location_name,
        latitude=event.latitude,
        longitude=event.longitude,
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.get("/", response_model=list[schemas.EventResponse])
def get_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()
    return events