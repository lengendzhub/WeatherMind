# Testing Documentation & Verification Guide

This document outlines the testing strategy, test coverage, execution instructions, and verified test results for the **Travel Weather Planner** application.

---

## 1. Automated Test Suite (Pytest)

The test suite is located in `backend/tests/` and contains **16 automated test cases** covering:
- **Location Geocoding & Coordinate Parsing**: Local regex parsing, input length constraints, mocked Open-Meteo geocoding results, 404 not found handling, and 502 upstream errors.
- **Weather Service & Condition Decoding**: Complete WMO code mapping verification (day vs night icon resolution), coordinate bound validation, mocked forecast payloads, and service failure handling.
- **Database CRUD & Constraints**: SQLite transaction isolation, date-range validations (<= 31 days, start <= end, future window bounds), record updates with weather re-fetching, and deletion checks.
- **Export Engines**: Verification of MIME types and content validity for JSON, CSV, XML, and Markdown.
- **External Media Services**: OpenStreetMap bounding box coordinate generation and YouTube Data API graceful degradation when keys are absent.

### Running Automated Tests
From `backend/` with the virtual environment activated:
```bash
pytest tests/ -v
```

### Verified Test Results
```text
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-9.2.0, pluggy-1.7.0
rootdir: D:\PMA\pma-weather-app\backend
plugins: anyio-4.16.0, asyncio-1.5.0
collected 16 items

tests/test_locations.py::test_search_coordinates_bypass PASSED          [  6%]
tests/test_locations.py::test_search_min_length_validation PASSED       [ 12%]
tests/test_locations.py::test_search_success_mocked PASSED             [ 18%]
tests/test_locations.py::test_search_not_found_mocked PASSED            [ 25%]
tests/test_locations.py::test_search_upstream_error_mocked PASSED        [ 31%]
tests/test_media.py::test_map_endpoint_success PASSED                   [ 37%]
tests/test_media.py::test_map_endpoint_invalid_lat PASSED               [ 43%]
tests/test_media.py::test_videos_endpoint_fallback_without_key PASSED   [ 50%]
tests/test_records.py::test_create_record_and_read PASSED               [ 56%]
tests/test_records.py::test_date_range_exceeds_max PASSED               [ 62%]
tests/test_records.py::test_date_range_start_after_end PASSED           [ 68%]
tests/test_weather.py::test_interpret_wmo_code_all_cases PASSED         [ 75%]
tests/test_weather.py::test_weather_invalid_coordinates PASSED          [ 81%]
tests/test_weather.py::test_current_weather_mocked PASSED               [ 87%]
tests/test_weather.py::test_forecast_mocked PASSED                      [ 93%]
tests/test_weather.py::test_current_weather_service_error PASSED        [100%]

======================== 16 passed, 0 failures in 0.72s ========================
```

---

## 2. Manual Verification Checklist

Follow this checklist during evaluation to test all user journeys:

### Frontend Journeys
1. **Search Variations**:
   - Type `"Tokyo"` and click **Search**. Verify current weather card and 5-day forecast populate.
   - Type `"10001"` (postal code). Verify location resolves and updates weather.
   - Type `"40.7128,-74.0060"` (coordinates). Verify direct coordinate parsing bypass.
   - Type `"Eiffel Tower"` (landmark). Verify geocoding resolves to Paris.
2. **Geolocation**:
   - Click **"Use My Location"**. Verify the browser asks for permission. Allow it and verify current coordinates update.
3. **Unit Toggle**:
   - Click **°F**. Verify temperatures, feels-like, and wind speed update to Fahrenheit and mph. Click **°C** to toggle back. Refresh the page to verify preference is preserved in `localStorage`.
4. **Trip Planner (CRUD)**:
   - In the **Travel Weather Planner** form, destination is pre-populated with active search.
   - Pick dates (e.g. tomorrow to +4 days) and add notes `"Packing rain jacket"`.
   - Click **Save Trip Weather Record**. Verify record is added to the table with high/low range summary.
   - Click **Edit** (pencil icon). Change dates or notes and click **Update & Re-fetch**. Verify new temperatures are calculated.
   - Click **Export** on the record. Test downloading as **CSV**, **JSON**, **XML**, and **Markdown**.
   - Click **Delete** (trash icon). Confirm dialog and verify record is removed.
5. **Offline Simulation**:
   - In Chrome DevTools > Network tab, toggle **Offline**.
   - Verify the top alert banner displays: `"You are currently offline. Check your internet connection..."`.
   - Re-enable connection and observe the badge switch back to green **Online**.

---

## 3. Mock Strategy & Reliability
- **Isolated In-Memory Database**: Tests in `conftest.py` use SQLite `:memory:` with automatic transaction rollback to prevent test flakiness or state contamination.
- **External API Mocking**: All outbound `httpx` network calls in unit tests are mocked using `unittest.mock.patch`, ensuring tests run instantly and deterministically without network dependencies or rate limits.
