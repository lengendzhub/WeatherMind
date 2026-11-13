def test_map_endpoint_success(client):
    response = client.get("/api/media/map?latitude=40.7128&longitude=-74.0060&zoom=12")
    assert response.status_code == 200
    data = response.json()
    assert "openstreetmap.org" in data["embed_url"]
    assert "marker=40.7128%2C-74.0060" in data["embed_url"]
    assert data["zoom"] == 12


def test_map_endpoint_invalid_lat(client):
    response = client.get("/api/media/map?latitude=120.0&longitude=0.0")
    assert response.status_code == 422


def test_videos_endpoint_fallback_without_key(client, monkeypatch):
    """When YOUTUBE_API_KEY is unset or invalid, endpoint returns available: False without crashing."""
    monkeypatch.setattr("app.services.youtube.YOUTUBE_API_KEY", "")
    response = client.get("/api/media/videos?q=Tokyo")
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is False
    assert isinstance(data["videos"], list)

