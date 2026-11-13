from unittest.mock import AsyncMock, patch
from app.services.geocoding import LocationNotFound, UpstreamError


def test_search_coordinates_bypass(client):
    """Coordinates should be parsed directly without calling external geocoding API."""
    response = client.get("/api/locations/search?q=40.7128,-74.0060")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["latitude"] == 40.7128
    assert data[0]["longitude"] == -74.0060


def test_search_min_length_validation(client):
    """Query with fewer than 2 characters should trigger 422 Unprocessable Entity."""
    response = client.get("/api/locations/search?q=a")
    assert response.status_code == 422


@patch("app.routes.locations.search_locations", new_callable=AsyncMock)
def test_search_success_mocked(mock_search, client):
    """Mocked geocoding returns multiple candidate locations."""
    mock_search.return_value = [
        {"name": "London", "country": "United Kingdom", "region": "England", "latitude": 51.5074, "longitude": -0.1278, "timezone": "Europe/London"},
        {"name": "London", "country": "Canada", "region": "Ontario", "latitude": 42.9849, "longitude": -81.2453, "timezone": "America/Toronto"},
    ]
    response = client.get("/api/locations/search?q=London")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "London"
    assert data[1]["country"] == "Canada"


@patch("app.routes.locations.search_locations", new_callable=AsyncMock)
def test_search_not_found_mocked(mock_search, client):
    """When geocoding returns no results, 404 should be returned."""
    mock_search.side_effect = LocationNotFound("No location found for 'nonexistent'.")
    response = client.get("/api/locations/search?q=nonexistent")
    assert response.status_code == 404
    assert "No location found" in response.json()["detail"]


@patch("app.routes.locations.search_locations", new_callable=AsyncMock)
def test_search_upstream_error_mocked(mock_search, client):
    """When geocoding API fails, 502 should be returned."""
    mock_search.side_effect = UpstreamError("Location service is unavailable.")
    response = client.get("/api/locations/search?q=London")
    assert response.status_code == 502
    assert "unavailable" in response.json()["detail"]
