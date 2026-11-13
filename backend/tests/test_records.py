from unittest.mock import AsyncMock, patch


@patch("app.routes.records.fetch_range_weather", new_callable=AsyncMock)
def test_create_record_and_read(mock_fetch_range, client):
    mock_fetch_range.return_value = [
        {"date": "2026-11-14", "temp_max": 22.0, "temp_min": 14.0, "precipitation_sum": 0.0, "weather_code": 0, "condition": "Clear sky"},
        {"date": "2026-11-15", "temp_max": 21.0, "temp_min": 13.0, "precipitation_sum": 1.2, "weather_code": 61, "condition": "Slight rain"},
    ]

    # 1. Create
    payload = {
        "location_name": "Barcelona",
        "country": "Spain",
        "latitude": 41.3851,
        "longitude": 2.1734,
        "start_date": "2026-11-14",
        "end_date": "2026-11-15",
        "notes": "Weekend getaway in Barcelona",
    }
    res_create = client.post("/api/records", json=payload)
    assert res_create.status_code == 201
    created = res_create.json()
    record_id = created["id"]
    assert created["location_name"] == "Barcelona"
    assert len(created["daily_data"]) == 2

    # 2. List
    res_list = client.get("/api/records")
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1

    # 3. Read single
    res_get = client.get(f"/api/records/{record_id}")
    assert res_get.status_code == 200
    assert res_get.json()["id"] == record_id

    # 4. Update
    mock_fetch_range.return_value = [
        {"date": "2026-11-14", "temp_max": 22.0, "temp_min": 14.0, "precipitation_sum": 0.0, "weather_code": 0, "condition": "Clear sky"}
    ]
    res_update = client.put(
        f"/api/records/{record_id}",
        json={"notes": "Updated: pack sunglasses", "start_date": "2026-11-14", "end_date": "2026-11-14"},
    )
    assert res_update.status_code == 200
    updated = res_update.json()
    assert updated["notes"] == "Updated: pack sunglasses"
    assert len(updated["daily_data"]) == 1

    # 5. Export single formats
    for fmt in ["json", "csv", "xml", "markdown"]:
        res_exp = client.get(f"/api/records/{record_id}/export?format={fmt}")
        assert res_exp.status_code == 200
        assert len(res_exp.text) > 0

    # 6. Delete
    res_del = client.delete(f"/api/records/{record_id}")
    assert res_del.status_code == 200

    # 7. Verify 404 after delete
    res_after = client.get(f"/api/records/{record_id}")
    assert res_after.status_code == 404


def test_date_range_exceeds_max(client):
    """Date ranges > 31 days must be rejected with 422."""
    payload = {
        "location_name": "London",
        "latitude": 51.5,
        "longitude": -0.1,
        "start_date": "2026-01-01",
        "end_date": "2026-02-15",
    }
    response = client.post("/api/records", json=payload)
    assert response.status_code == 422
    assert "exceeds maximum allowed limit" in response.json()["detail"]


def test_date_range_start_after_end(client):
    """start_date > end_date must be rejected with 422."""
    payload = {
        "location_name": "London",
        "latitude": 51.5,
        "longitude": -0.1,
        "start_date": "2026-05-10",
        "end_date": "2026-05-01",
    }
    response = client.post("/api/records", json=payload)
    assert response.status_code == 422
    assert "cannot be after" in response.json()["detail"]
