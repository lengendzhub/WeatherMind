from fastapi import APIRouter, Query
from app.schemas import MapInfo, VideoResponse
from app.services.youtube import search_travel_videos

router = APIRouter(prefix="/api/media", tags=["media"])


@router.get("/map", response_model=MapInfo)
def get_map_info(
    latitude: float = Query(..., ge=-90.0, le=90.0),
    longitude: float = Query(..., ge=-180.0, le=180.0),
    zoom: int = Query(11, ge=1, le=19),
):
    # Calculate bounding box based on zoom level
    delta = 0.05 * (13 / max(zoom, 1))
    bbox = f"{longitude - delta:.4f}%2C{latitude - delta:.4f}%2C{longitude + delta:.4f}%2C{latitude + delta:.4f}"
    embed_url = f"https://www.openstreetmap.org/export/embed.html?bbox={bbox}&layer=mapnik&marker={latitude:.4f}%2C{longitude:.4f}"
    osm_url = f"https://www.openstreetmap.org/?mlat={latitude:.4f}&mlon={longitude:.4f}#map={zoom}/{latitude:.4f}/{longitude:.4f}"

    return {
        "latitude": latitude,
        "longitude": longitude,
        "zoom": zoom,
        "embed_url": embed_url,
        "osm_url": osm_url,
    }


@router.get("/videos", response_model=VideoResponse)
async def get_travel_videos(
    q: str = Query(..., min_length=2, max_length=100, description="Destination or city name"),
):
    return await search_travel_videos(q.strip())

