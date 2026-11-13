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

# CORS configuration supporting local dev, Vercel deployments, and production origins
origins = [o.strip() for o in FRONTEND_ORIGIN.split(",") if o.strip()]
for default_o in ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]:
    if default_o not in origins:
        origins.append(default_o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in origins else origins,
    allow_origin_regex=r"https://.*\.vercel\.app" if "*" not in origins else None,
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

