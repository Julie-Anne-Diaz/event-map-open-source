from fastapi import FastAPI
from routers import auth
from database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Event Mapping API"
)

app.include_router(auth.router)


@app.get("/")
def root():
    return {"message": "Event Mapping API running"}
