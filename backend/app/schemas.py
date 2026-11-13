from datetime import date
from pydantic import BaseModel, Field


class Location(BaseModel):
    name: str
    country: str | None = None
    region: str | None = None
    latitude: float
    longitude: float
    timezone: str | None = None


class CurrentWeather(BaseModel):
    time: str
    temperature: float
    apparent_temperature: float
    relative_humidity: int
    weather_code: int
    condition: str
    icon: str
    wind_speed: float
    precipitation: float
    uv_index: float
    is_day: int
    sunrise: str | None = None
    sunset: str | None = None
    timezone: str


class DailyForecastItem(BaseModel):
    date: str
    weather_code: int
    condition: str
    icon: str
    temp_max: float
    temp_min: float
    precipitation_sum: float
    precipitation_probability_max: int | None = None
    sunrise: str | None = None
    sunset: str | None = None
    uv_index_max: float | None = None


class ForecastResponse(BaseModel):
    latitude: float
    longitude: float
    timezone: str
    days: list[DailyForecastItem]


class WeatherOverview(BaseModel):
    location: Location | None = None
    current: CurrentWeather
    forecast: list[DailyForecastItem]
