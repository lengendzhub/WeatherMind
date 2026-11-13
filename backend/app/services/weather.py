import httpx

FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast"

# WMO Weather interpretation codes (WW)
# Code -> (description, day_icon, night_icon)
WMO_CODES: dict[int, tuple[str, str, str]] = {
    0: ("Clear sky", "clear-day", "clear-night"),
    1: ("Mainly clear", "partly-cloudy-day", "partly-cloudy-night"),
    2: ("Partly cloudy", "partly-cloudy-day", "partly-cloudy-night"),
    3: ("Overcast", "cloudy", "cloudy"),
    45: ("Fog", "fog", "fog"),
    48: ("Depositing rime fog", "fog", "fog"),
    51: ("Light drizzle", "drizzle", "drizzle"),
    53: ("Moderate drizzle", "drizzle", "drizzle"),
    55: ("Dense drizzle", "drizzle", "drizzle"),
    56: ("Light freezing drizzle", "sleet", "sleet"),
    57: ("Dense freezing drizzle", "sleet", "sleet"),
    61: ("Slight rain", "rain", "rain"),
    63: ("Moderate rain", "rain", "rain"),
    65: ("Heavy rain", "heavy-rain", "heavy-rain"),
    66: ("Light freezing rain", "sleet", "sleet"),
    67: ("Heavy freezing rain", "sleet", "sleet"),
    71: ("Slight snow fall", "snow", "snow"),
    73: ("Moderate snow fall", "snow", "snow"),
    75: ("Heavy snow fall", "heavy-snow", "heavy-snow"),
    77: ("Snow grains", "snow", "snow"),
    80: ("Slight rain showers", "rain-shower", "rain-shower"),
    81: ("Moderate rain showers", "rain-shower", "rain-shower"),
    82: ("Violent rain showers", "thunderstorm-rain", "thunderstorm-rain"),
    85: ("Slight snow showers", "snow-shower", "snow-shower"),
    86: ("Heavy snow showers", "snow-shower", "snow-shower"),
    95: ("Thunderstorm", "thunderstorm", "thunderstorm"),
    96: ("Thunderstorm with slight hail", "thunderstorm-hail", "thunderstorm-hail"),
    99: ("Thunderstorm with heavy hail", "thunderstorm-hail", "thunderstorm-hail"),
}


class WeatherServiceError(Exception):
    """Raised when upstream Open-Meteo weather service fails."""
    pass


class InvalidCoordinatesError(Exception):
    """Raised when coordinates are outside valid bounds."""
    pass


def validate_coords(lat: float, lon: float) -> None:
    if not (-90.0 <= lat <= 90.0 and -180.0 <= lon <= 180.0):
        raise InvalidCoordinatesError(
            f"Coordinates out of bounds: latitude {lat} must be [-90, 90], longitude {lon} must be [-180, 180]."
        )


def interpret_wmo_code(code: int, is_day: int = 1) -> tuple[str, str]:
    """Returns (condition_label, icon_name)."""
    if code in WMO_CODES:
        label, day_icon, night_icon = WMO_CODES[code]
        icon = day_icon if is_day == 1 else night_icon
        return label, icon
    return "Unknown", "cloudy"


async def fetch_weather_data(latitude: float, longitude: float, forecast_days: int = 5) -> dict:
    validate_coords(latitude, longitude)
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index,is_day",
        "daily": "temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,weather_code,uv_index_max",
        "forecast_days": forecast_days,
        "timezone": "auto",
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(FORECAST_API_URL, params=params)
            resp.raise_for_status()
            return resp.json()
    except httpx.HTTPStatusError as exc:
        raise WeatherServiceError(
            f"Open-Meteo API returned error {exc.response.status_code}: {exc.response.text}"
        ) from exc
    except httpx.HTTPError as exc:
        raise WeatherServiceError("Weather service is temporarily unavailable. Please try again.") from exc


def parse_current_weather(raw: dict) -> dict:
    cur = raw.get("current", {})
    daily = raw.get("daily", {})
    weather_code = int(cur.get("weather_code", 0))
    is_day = int(cur.get("is_day", 1))
    condition, icon = interpret_wmo_code(weather_code, is_day)

    sunrises = daily.get("sunrise", [])
    sunsets = daily.get("sunset", [])

    return {
        "time": cur.get("time", ""),
        "temperature": cur.get("temperature_2m", 0.0),
        "apparent_temperature": cur.get("apparent_temperature", 0.0),
        "relative_humidity": int(cur.get("relative_humidity_2m", 0)),
        "weather_code": weather_code,
        "condition": condition,
        "icon": icon,
        "wind_speed": cur.get("wind_speed_10m", 0.0),
        "precipitation": cur.get("precipitation", 0.0),
        "uv_index": cur.get("uv_index", 0.0),
        "is_day": is_day,
        "sunrise": sunrises[0] if sunrises else None,
        "sunset": sunsets[0] if sunsets else None,
        "timezone": raw.get("timezone", "UTC"),
    }


def parse_daily_forecast(raw: dict) -> list[dict]:
    daily = raw.get("daily", {})
    times = daily.get("time", [])
    temp_maxes = daily.get("temperature_2m_max", [])
    temp_mins = daily.get("temperature_2m_min", [])
    codes = daily.get("weather_code", [])
    precip_sums = daily.get("precipitation_sum", [])
    precip_probs = daily.get("precipitation_probability_max", [])
    sunrises = daily.get("sunrise", [])
    sunsets = daily.get("sunset", [])
    uv_maxes = daily.get("uv_index_max", [])

    items = []
    for i in range(len(times)):
        code = int(codes[i]) if i < len(codes) else 0
        cond, icon = interpret_wmo_code(code, is_day=1)
        items.append({
            "date": times[i],
            "weather_code": code,
            "condition": cond,
            "icon": icon,
            "temp_max": temp_maxes[i] if i < len(temp_maxes) else 0.0,
            "temp_min": temp_mins[i] if i < len(temp_mins) else 0.0,
            "precipitation_sum": precip_sums[i] if i < len(precip_sums) else 0.0,
            "precipitation_probability_max": precip_probs[i] if i < len(precip_probs) else None,
            "sunrise": sunrises[i] if i < len(sunrises) else None,
            "sunset": sunsets[i] if i < len(sunsets) else None,
            "uv_index_max": uv_maxes[i] if i < len(uv_maxes) else None,
        })
    return items


async def get_current_weather(latitude: float, longitude: float) -> dict:
    raw = await fetch_weather_data(latitude, longitude, forecast_days=1)
    return parse_current_weather(raw)


async def get_forecast(latitude: float, longitude: float, days: int = 5) -> dict:
    raw = await fetch_weather_data(latitude, longitude, forecast_days=days)
    return {
        "latitude": latitude,
        "longitude": longitude,
        "timezone": raw.get("timezone", "UTC"),
        "days": parse_daily_forecast(raw),
    }


async def get_weather_overview(latitude: float, longitude: float, days: int = 5) -> dict:
    raw = await fetch_weather_data(latitude, longitude, forecast_days=days)
    return {
        "current": parse_current_weather(raw),
        "forecast": parse_daily_forecast(raw),
    }
