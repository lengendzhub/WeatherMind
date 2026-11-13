from fastapi import APIRouter, HTTPException, Query
from app.schemas import CurrentWeather, ForecastResponse, WeatherOverview
from app.services.weather import (
    InvalidCoordinatesError,
    WeatherServiceError,
    get_current_weather,
    get_forecast,
    get_weather_overview,
)

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("/current", response_model=CurrentWeather)
async def current_weather(
    latitude: float = Query(..., ge=-90.0, le=90.0, description="Latitude [-90.0, 90.0]"),
    longitude: float = Query(..., ge=-180.0, le=180.0, description="Longitude [-180.0, 180.0]"),
):
    try:
        return await get_current_weather(latitude, longitude)
    except InvalidCoordinatesError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except WeatherServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.get("/forecast", response_model=ForecastResponse)
async def forecast(
    latitude: float = Query(..., ge=-90.0, le=90.0, description="Latitude [-90.0, 90.0]"),
    longitude: float = Query(..., ge=-180.0, le=180.0, description="Longitude [-180.0, 180.0]"),
    days: int = Query(5, ge=1, le=16, description="Forecast days (1-16, default 5)"),
):
    try:
        return await get_forecast(latitude, longitude, days=days)
    except InvalidCoordinatesError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except WeatherServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))


@router.get("/overview", response_model=WeatherOverview)
async def weather_overview(
    latitude: float = Query(..., ge=-90.0, le=90.0, description="Latitude [-90.0, 90.0]"),
    longitude: float = Query(..., ge=-180.0, le=180.0, description="Longitude [-180.0, 180.0]"),
    days: int = Query(5, ge=1, le=16, description="Forecast days (default 5)"),
):
    try:
        return await get_weather_overview(latitude, longitude, days=days)
    except InvalidCoordinatesError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except WeatherServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

