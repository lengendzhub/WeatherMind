from unittest.mock import AsyncMock, patch
from app.services.weather import InvalidCoordinatesError, WeatherServiceError, interpret_wmo_code


def test_interpret_wmo_code_all_cases():
    desc, icon = interpret_wmo_code(0, is_day=1)
    assert desc == "Clear sky"
    assert icon == "clear-day"

    desc, icon = interpret_wmo_code(0, is_day=0)
    assert icon == "clear-night"

    desc, icon = interpret_wmo_code(61, is_day=1)
    assert "Rain" in desc or "rain" in desc
    assert icon == "rain"

    desc, icon = interpret_wmo_code(999, is_day=1)
    assert desc == "Unknown"
    assert icon == "cloudy"


def test_weather_invalid_coordinates(client):
    """Latitude > 90 must fail with 422."""
    response = client.get("/api/weather/current?latitude=100.0&longitude=0.0")
    assert response.status_code == 422


@patch("app.routes.weather.get_current_weather", new_callable=AsyncMock)
def test_current_weather_mocked(mock_get_current, client):
    mock_get_current.return_value = {
        "time": "2026-11-13T12:00",
        "temperature": 18.5,
        "apparent_temperature": 17.8,
        "relative_humidity": 65,
        "weather_code": 1,
        "condition": "Mainly clear",
        "icon": "partly-cloudy-day",
        "wind_speed": 12.0,
        "precipitation": 0.0,
        "uv_index": 3.4,
        "is_day": 1,
        "sunrise": "2026-11-13T06:30",
        "sunset": "2026-11-13T17:45",
        "timezone": "Europe/London",
    }
    response = client.get("/api/weather/current?latitude=51.5074&longitude=-0.1278")
    assert response.status_code == 200
    data = response.json()
    assert data["temperature"] == 18.5
    assert data["condition"] == "Mainly clear"
    assert data["uv_index"] == 3.4


@patch("app.routes.weather.get_forecast", new_callable=AsyncMock)
def test_forecast_mocked(mock_get_forecast, client):
    mock_get_forecast.return_value = {
        "latitude": 51.5074,
        "longitude": -0.1278,
        "timezone": "Europe/London",
        "days": [
            {
                "date": f"2026-11-{13+i:02d}",
                "weather_code": 0,
                "condition": "Clear sky",
                "icon": "clear-day",
                "temp_max": 20.0 + i,
                "temp_min": 10.0 + i,
                "precipitation_sum": 0.0,
                "precipitation_probability_max": 10,
                "sunrise": "2026-11-13T06:30",
                "sunset": "2026-11-13T17:45",
                "uv_index_max": 3.5,
            }
            for i in range(5)
        ],
    }
    response = client.get("/api/weather/forecast?latitude=51.5074&longitude=-0.1278&days=5")
    assert response.status_code == 200
    data = response.json()
    assert len(data["days"]) == 5
    assert data["days"][0]["temp_max"] == 20.0


@patch("app.routes.weather.get_current_weather", new_callable=AsyncMock)
def test_current_weather_service_error(mock_get_current, client):
    mock_get_current.side_effect = WeatherServiceError("Upstream timeout")
    response = client.get("/api/weather/current?latitude=51.5074&longitude=-0.1278")
    assert response.status_code == 502

