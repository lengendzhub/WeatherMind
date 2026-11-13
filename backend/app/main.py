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

# CORS configuration: allow all origins dynamically (supporting localhost, Render, Vercel, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(locations.router)
app.include_router(weather.router)
app.include_router(records.router)
app.include_router(media.router)


@app.get("/", tags=["system"])
def root():
    return {
        "name": "WeatherMind API",
        "status": "online",
        "docs": "/docs",
        "health": "/api/health",
    }


@app.get("/health", tags=["system"])
@app.get("/api/health", tags=["system"])
def health():
    return {"status": "ok"}

