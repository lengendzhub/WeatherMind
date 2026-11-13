from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


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


class WeatherRecordCreate(BaseModel):
    location_name: str = Field(..., min_length=2, max_length=200)
    country: str | None = None
    latitude: float | None = Field(None, ge=-90.0, le=90.0)
    longitude: float | None = Field(None, ge=-180.0, le=180.0)
    start_date: date
    end_date: date
    notes: str | None = Field(None, max_length=500)


class WeatherRecordUpdate(BaseModel):
    start_date: date | None = None
    end_date: date | None = None
    notes: str | None = Field(None, max_length=500)


class WeatherRecordResponse(BaseModel):
    id: int
    location_name: str
    country: str | None = None
    latitude: float
    longitude: float
    start_date: date
    end_date: date
    daily_data: list[dict]
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VideoItem(BaseModel):
    id: str
    title: str
    description: str
    thumbnail: str
    channel_title: str
    url: str
    embed_url: str


class VideoResponse(BaseModel):
    available: bool
    message: str
    videos: list[VideoItem]


class MapInfo(BaseModel):
    latitude: float
    longitude: float
    zoom: int
    embed_url: str
    osm_url: str


