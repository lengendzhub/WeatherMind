import re
import httpx

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
COORDS_PATTERN = re.compile(r"^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$")


class LocationNotFound(Exception):
    pass


class UpstreamError(Exception):
    pass


def parse_coordinates(query: str):
    """Return (lat, lon) if the text looks like 'lat,lon', else None."""
    match = COORDS_PATTERN.match(query)
    if not match:
        return None
    lat, lon = float(match.group(1)), float(match.group(2))
    if -90 <= lat <= 90 and -180 <= lon <= 180:
        return lat, lon
    return None


POPULAR_LOCATIONS = {
    "london": {"name": "London", "country": "United Kingdom", "region": "England", "latitude": 51.5085, "longitude": -0.1257, "timezone": "Europe/London"},
    "tokyo": {"name": "Tokyo", "country": "Japan", "region": "Tokyo", "latitude": 35.6895, "longitude": 139.6917, "timezone": "Asia/Tokyo"},
    "new york": {"name": "New York", "country": "United States", "region": "New York", "latitude": 40.7128, "longitude": -74.006, "timezone": "America/New_York"},
    "paris": {"name": "Paris", "country": "France", "region": "Île-de-France", "latitude": 48.8534, "longitude": 2.3488, "timezone": "Europe/Paris"},
    "sydney": {"name": "Sydney", "country": "Australia", "region": "New South Wales", "latitude": -33.8678, "longitude": 151.2073, "timezone": "Australia/Sydney"},
    "thoothukudi": {"name": "Thoothukudi", "country": "India", "region": "Tamil Nadu", "latitude": 8.8066, "longitude": 78.126, "timezone": "Asia/Kolkata"},
}


async def search_locations(query: str, count: int = 5) -> list[dict]:
    coords = parse_coordinates(query)
    if coords:
        lat, lon = coords
        return [
            {
                "name": f"{lat:.4f}, {lon:.4f}",
                "country": None,
                "region": None,
                "latitude": lat,
                "longitude": lon,
                "timezone": None,
            }
        ]

    params = {"name": query, "count": count, "language": "en", "format": "json"}
    headers = {"User-Agent": "WeatherMindApp/1.0 (https://github.com/lengendzhub/WeatherMind)"}
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GEOCODING_URL, params=params, headers=headers)
            response.raise_for_status()
    except httpx.HTTPError as exc:
        q_clean = query.strip().lower()
        if q_clean in POPULAR_LOCATIONS:
            return [POPULAR_LOCATIONS[q_clean]]
        raise UpstreamError("Location service is unavailable. Please try again.") from exc

    results = response.json().get("results", [])
    if not results:
        raise LocationNotFound(f"No location found for '{query}'.")

    return [
        {
            "name": item["name"],
            "country": item.get("country"),
            "region": item.get("admin1"),
            "latitude": item["latitude"],
            "longitude": item["longitude"],
            "timezone": item.get("timezone"),
        }
        for item in results
    ]

