from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

#user auth schemas
class UserCreate(BaseModel):

    email: EmailStr
    password: str


class UserLogin(BaseModel):

    email: EmailStr
    password: str


class Token(BaseModel):

    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr

    model_config = {"from_attributes": True}

# Friend request schemas
class FriendRequestCreate(BaseModel):
    receiver_id: int


class FriendRequestResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

# Friendship schemas
class FriendshipResponse(BaseModel):
    id: int
    user_one_id: int
    user_two_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Event schemas
class EventBase(BaseModel):
    creator_user_id: int
    title: str
    description: Optional[str] = None
    visibility: str = "public"
    start_time: datetime
    end_time: datetime
    capacity: Optional[int] = Field(default=None, gt=0)
    location_name: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    visibility: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    capacity: Optional[int] = Field(default=None, gt=0)
    location_name: Optional[str] = None
    latitude: Optional[float] = Field(default=None, ge=-90, le=90)
    longitude: Optional[float] = Field(default=None, ge=-180, le=180)


class EventResponse(EventBase):
    id: int
    creator_user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

# Attendance schemas
class AttendanceCreate(BaseModel):
    status: str  # attending, interested, declined


class AttendanceResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

# Event invite schemas
class EventInviteCreate(BaseModel):
    user_id: int


class EventInviteResponse(BaseModel):
    id: int
    event_id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
