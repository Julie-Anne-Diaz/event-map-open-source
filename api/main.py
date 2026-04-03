from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, events
from database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Event Mapping API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(events.router)

@app.get("/")
def root():
    return {"message": "Event Mapping API running"}
