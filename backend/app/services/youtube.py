import httpx
from app.config import YOUTUBE_API_KEY

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


async def search_travel_videos(location_name: str, max_results: int = 4) -> dict:
    """Searches YouTube for travel guide videos related to the location.
    Gracefully degrades if YOUTUBE_API_KEY is not configured or fails.
    """
    if not YOUTUBE_API_KEY or not YOUTUBE_API_KEY.strip():
        return {
            "available": False,
            "message": "YouTube API key not configured.",
            "videos": [],
        }

    query = f"{location_name} travel guide things to do"
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY.strip(),
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(YOUTUBE_SEARCH_URL, params=params)
            if resp.status_code != 200:
                return {
                    "available": False,
                    "message": f"YouTube API returned status {resp.status_code}.",
                    "videos": [],
                }
            data = resp.json()
            videos = []
            for item in data.get("items", []):
                vid_id = item.get("id", {}).get("videoId")
                if not vid_id:
                    continue
                snippet = item.get("snippet", {})
                thumbnails = snippet.get("thumbnails", {})
                thumb_url = (
                    thumbnails.get("medium", {}).get("url")
                    or thumbnails.get("default", {}).get("url")
                    or ""
                )
                videos.append({
                    "id": vid_id,
                    "title": snippet.get("title", ""),
                    "description": snippet.get("description", ""),
                    "thumbnail": thumb_url,
                    "channel_title": snippet.get("channelTitle", ""),
                    "url": f"https://www.youtube.com/watch?v={vid_id}",
                    "embed_url": f"https://www.youtube.com/embed/{vid_id}",
                })
            return {
                "available": True,
                "message": "Videos retrieved successfully.",
                "videos": videos,
            }
    except Exception as exc:
        return {
            "available": False,
            "message": f"Could not fetch videos: {str(exc)}",
            "videos": [],
        }
