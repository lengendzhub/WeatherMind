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
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(GEOCODING_URL, params=params)
            response.raise_for_status()
    except httpx.HTTPError as exc:
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
