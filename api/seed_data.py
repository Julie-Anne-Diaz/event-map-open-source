from datetime import datetime, timedelta
import random

from database import SessionLocal, Base, engine
import models
import security

Base.metadata.create_all(bind=engine)

db = SessionLocal()


def clear_existing_seed_data():
    # delete seeded events first because they depend on users
    db.query(models.Event).filter(
        models.Event.title.like("Seeded Event %")
    ).delete(synchronize_session=False)

    db.query(models.User).filter(
        models.User.email.like("testuser%@example.com")
    ).delete(synchronize_session=False)

    db.commit()


def seed_users(count=100):
    users = []

    for i in range(1, count + 1):
        email = f"testuser{i}@example.com"

        user = models.User(
            email=email,
            hashed_password=security.hash_password("password123")
        )
        db.add(user)
        users.append(user)

    db.commit()

    for user in users:
        db.refresh(user)

    return users


def seed_events(users, count=100):
    visibilities = ["public", "private", "invite_only"]
    base_lat = 29.6516
    base_lon = -82.3248

    for i in range(1, count + 1):
        creator = users[(i - 1) % len(users)]
        start = datetime.now() + timedelta(hours=i)
        end = start + timedelta(hours=2)

        event = models.Event(
            creator_user_id=creator.id,
            title=f"Seeded Event {i}",
            description=f"This is seeded test event number {i}.",
            visibility=random.choice(visibilities),
            start_time=start,
            end_time=end,
            capacity=random.randint(10, 100),
            location_name=f"Seeded Address {i}, Gainesville, FL",
            latitude=base_lat + random.uniform(-0.05, 0.05),
            longitude=base_lon + random.uniform(-0.05, 0.05),
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        db.add(event)

    db.commit()


def main():
    clear_existing_seed_data()
    users = seed_users(100)
    seed_events(users, 100)
    print("Seeded 100 users and 100 events successfully.")


if __name__ == "__main__":
    main()