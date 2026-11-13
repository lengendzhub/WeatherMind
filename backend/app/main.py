from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models  # noqa: F401 (registers SQLAlchemy models)
from app.config import FRONTEND_ORIGIN
from app.database import Base, engine
from app.routes import locations, media, records, weather

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Travel Weather Planner API",
    description="Backend API for the PMA Weather App assessment providing location search, weather data, forecasts, and record management.",
    version="0.1.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(locations.router)
app.include_router(weather.router)
app.include_router(records.router)
app.include_router(media.router)


@app.get("/api/health", tags=["system"])
def health():
    return {"status": "ok"}

