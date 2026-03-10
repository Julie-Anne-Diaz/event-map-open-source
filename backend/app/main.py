from fastapi import FastAPI
from app.routers import auth

app = FastAPI(
    title="Event Mapping API"
)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Event Mapping API running"}
