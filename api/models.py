from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    Float,
    UniqueConstraint,
    CheckConstraint,
)
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    created_events = relationship("Event", back_populates="creator", cascade="all, delete-orphan")
    sent_friend_requests = relationship(
        "FriendRequest",
        foreign_keys="FriendRequest.sender_id",
        back_populates="sender",
        cascade="all, delete-orphan",
    )
    received_friend_requests = relationship(
        "FriendRequest",
        foreign_keys="FriendRequest.receiver_id",
        back_populates="receiver",
        cascade="all, delete-orphan",
    )
    attendance_records = relationship(
        "EventAttendance",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    event_invites = relationship(
        "EventInvite",
        back_populates="user",
        cascade="all, delete-orphan",
    )


class FriendRequest(Base):
    __tablename__ = "friend_requests"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String, nullable=False, default="pending")  # pending, accepted, declined
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    sender = relationship("User", foreign_keys=[sender_id], back_populates="sent_friend_requests")
    receiver = relationship("User", foreign_keys=[receiver_id], back_populates="received_friend_requests")

    __table_args__ = (
        UniqueConstraint("sender_id", "receiver_id", name="uq_friend_request_sender_receiver"),
        CheckConstraint("sender_id != receiver_id", name="ck_friend_request_not_self"),
    )


class Friendship(Base):
    __tablename__ = "friendships"

    id = Column(Integer, primary_key=True, index=True)
    user_one_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    user_two_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint("user_one_id", "user_two_id", name="uq_friendship_pair"),
        CheckConstraint("user_one_id != user_two_id", name="ck_friendship_not_self"),
        CheckConstraint("user_one_id < user_two_id", name="ck_friendship_order"),
    )


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    creator_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)

    # public, friends, invite_only, private
    visibility = Column(String, nullable=False, default="public")

    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

    capacity = Column(Integer, nullable=True)

    location_name = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    creator = relationship("User", back_populates="created_events")
    attendance = relationship("EventAttendance", back_populates="event", cascade="all, delete-orphan")
    invites = relationship("EventInvite", back_populates="event", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint(
            "visibility IN ('public', 'friends', 'invite_only', 'private')",
            name="ck_event_visibility_valid",
        ),
        CheckConstraint(
            "capacity IS NULL OR capacity > 0",
            name="ck_event_capacity_positive",
        ),
        CheckConstraint(
            "latitude >= -90 AND latitude <= 90",
            name="ck_event_latitude_valid",
        ),
        CheckConstraint(
            "longitude >= -180 AND longitude <= 180",
            name="ck_event_longitude_valid",
        ),
        CheckConstraint(
            "end_time > start_time",
            name="ck_event_time_order",
        ),
    )


class EventAttendance(Base):
    __tablename__ = "event_attendance"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # attending, interested, declined
    status = Column(String, nullable=False, default="attending")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    event = relationship("Event", back_populates="attendance")
    user = relationship("User", back_populates="attendance_records")

    __table_args__ = (
        UniqueConstraint("event_id", "user_id", name="uq_event_attendance_event_user"),
        CheckConstraint(
            "status IN ('attending', 'interested', 'declined')",
            name="ck_event_attendance_status_valid",
        ),
    )


class EventInvite(Base):
    __tablename__ = "event_invites"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    event = relationship("Event", back_populates="invites")
    user = relationship("User", back_populates="event_invites")

    __table_args__ = (
        UniqueConstraint("event_id", "user_id", name="uq_event_invite_event_user"),
    )