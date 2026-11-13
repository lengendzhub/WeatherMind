from fastapi import APIRouter, HTTPException, Query
from app.schemas import Location
from app.services.geocoding import LocationNotFound, UpstreamError, search_locations

router = APIRouter(prefix="/api/locations", tags=["locations"])


@router.get("/search", response_model=list[Location])
async def search(q: str = Query(..., min_length=2, max_length=100, description="City, landmark, zip code, or lat,lon")):
    try:
        return await search_locations(q.strip())
    except LocationNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except UpstreamError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

