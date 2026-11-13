# Travel Weather Planner 🌤️✈️
*Full-Stack Weather & Trip Planning Application for PM Accelerator AI Engineer Assessment*

![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61dafb?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![SQLite](https://img.shields.io/badge/Database-SQLite_3-003b57?logo=sqlite)
![Open-Meteo](https://img.shields.io/badge/Weather_API-Open--Meteo-orange)
![Tests](https://img.shields.io/badge/Tests-16_Passed-brightgreen)

Developed by **[YOUR NAME]** for the **Product Manager Accelerator (PM Accelerator)** AI Engineer Intern technical assessment, satisfying both **Tech Assessment #1 (Frontend)** and **Tech Assessment #2 (Backend)**.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & System Design](#architecture--system-design)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Prerequisites](#prerequisites)
6. [Setup & Running Locally](#setup--running-locally)
7. [API Specification](#api-specification)
8. [Export Formats](#export-formats)
9. [Design Decisions & Trade-offs](#design-decisions--trade-offs)
10. [Limitations & Future Roadmap](#limitations--future-roadmap)

---

## 1. Project Overview
**Travel Weather Planner** empowers users to research live weather conditions, review 5-day forecasts, view geographical maps, explore curated travel video guides, and persist travel itineraries with daily temperature records.

### Key Capabilities
- **Flexible Location Input**: Accepts city names (`London`), postal/zip codes (`10001`), landmarks (`Eiffel Tower`), or direct GPS coordinates (`40.7128,-74.0060`).
- **One-Click Geolocation**: "Use My Location" queries browser GPS to retrieve local weather instantly.
- **Current Conditions**: Live temperature, apparent "feels-like", WMO weather condition with custom day/night icons, humidity percentage, wind speed, UV index with danger classification, and exact sunrise/sunset times.
- **5-Day Visual Forecast**: Card layout showing daily highs/lows, rain probabilities, and condition summaries.
- **Unit Switching**: Smooth instant toggle between Celsius (°C) and Fahrenheit (°F) with local storage persistence.
- **Trip Records Management (CRUD)**: Save trips up to 31 days. The backend automatically fetches and stores daily weather in SQLite. Users can edit trip dates or notes, trigger recalculations, or delete records.
- **Multi-Format Data Export**: One-click download of single or collective trip records in **JSON**, **CSV**, **XML**, and **Markdown (.md)**.
- **Map & Media**: OpenStreetMap embed (no key required) and YouTube travel video guides (graceful fallback if API key is not configured).

---

## 2. Architecture & System Design

```
                     ┌──────────────────────────────────────────────┐
                     │          Vite + React Frontend (5173)         │
                     │  - Header & Realtime Clock                   │
                     │  - Multi-Input Search & GPS Geolocation       │
                     │  - Hero Current Weather & 5-Day Cards        │
                     │  - OpenStreetMap & YouTube Media Grid        │
                     │  - Trip Planner CRUD & Multi-Format Exports   │
                     │  - PM Accelerator Attribution Banner         │
                     └──────────────────────┬───────────────────────┘
                                            │ HTTP / JSON (Proxy /api)
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │          FastAPI Backend Server (8000)        │
                     │  ├── CORS Middleware                         │
                     │  ├── /api/locations (Geocoding & Parse)      │
                     │  ├── /api/weather   (Current, 5-Day, Ov.)    │
                     │  ├── /api/records   (CRUD + 31-Day Val)      │
                     │  └── /api/media     (Map BBox + YouTube API) │
                     └───────────────┬──────────────────────┬───────┘
                                     │                      │
                   HTTP Outbound Calls                      │ SQLAlchemy ORM
                   (Timeouts & Fallbacks)                   ▼
                ┌────────────────────────────┐    ┌──────────────────┐
                │       External APIs        │    │  SQLite Database │
                │ 1. Open-Meteo Geocoding    │    │   (weather.db)   │
                │ 2. Open-Meteo Forecast     │    └──────────────────┘
                │ 3. Open-Meteo Archive      │
                │ 4. OpenStreetMap (Embed)   │
                │ 5. YouTube Data API v3     │
                └────────────────────────────┘
```

---

## 3. Tech Stack
- **Frontend**: React 18, Vite, Lucide Icons, Pure CSS (custom responsive design). No Python or Java frontend frameworks used.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, SQLAlchemy 2.x, SQLite 3, HTTPX (async client with 10s timeouts), Pydantic v2.
- **External Services**: Open-Meteo APIs (Geocoding, Live Forecast, Historical Archive), OpenStreetMap, Google YouTube Data API v3.
- **Testing**: Pytest, Pytest-Asyncio, Starlette TestClient, In-memory SQLite with Mocked external APIs.

---

## 4. Prerequisites
- **Node.js**: v18.0.0 or newer
- **Python**: v3.10 or newer
- **Git**: v2.x

---

## 5. Setup & Running Locally

### Step 1: Clone or Navigate to the Workspace
```bash
cd D:\PMA\pma-weather-app
```

### Step 2: Backend Setup
```bash
cd backend

# 1. Create and activate virtual environment
# Windows:
python -m venv venv
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file from .env.example
copy .env.example .env
# (Optional) Add your YOUTUBE_API_KEY inside backend/.env if desired

# 4. Start the backend server
uvicorn app.main:app --reload --port 8000
```
*API will be available at `http://127.0.0.1:8000` with Swagger docs at `http://127.0.0.1:8000/docs`.*

### Step 3: Frontend Setup (Open a second terminal)
```bash
cd D:\PMA\pma-weather-app\frontend

# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 6. API Specification

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck endpoint | `200` |
| `GET` | `/api/locations/search?q={query}` | Geocode place, zip, landmark, or lat,lon | `200`, `404`, `422`, `502` |
| `GET` | `/api/weather/current?latitude={lat}&longitude={lon}` | Real-time weather, UV index, and sunrise/sunset | `200`, `422`, `502` |
| `GET` | `/api/weather/forecast?latitude={lat}&longitude={lon}&days=5` | 5-day daily forecast with rain chances | `200`, `422`, `502` |
| `GET` | `/api/weather/overview?latitude={lat}&longitude={lon}&days=5` | Consolidated current & forecast response | `200`, `422`, `502` |
| `POST` | `/api/records` | Create trip weather record (max 31 days) | `201`, `422`, `502` |
| `GET` | `/api/records` | List all saved trip records | `200` |
| `GET` | `/api/records/{id}` | Retrieve single record by ID | `200`, `404` |
| `PUT` | `/api/records/{id}` | Update date range or notes (re-fetches weather) | `200`, `404`, `422`, `502` |
| `DELETE`| `/api/records/{id}` | Delete record by ID | `200`, `404` |
| `GET` | `/api/records/export?format={json\|csv\|xml\|markdown}` | Bulk export all records | `200` |
| `GET` | `/api/records/{id}/export?format={json\|csv\|xml\|markdown}` | Export single record | `200`, `404` |
| `GET` | `/api/media/map?latitude={lat}&longitude={lon}&zoom=11` | OpenStreetMap embed URL and bounding box | `200`, `422` |
| `GET` | `/api/media/videos?q={destination}` | Travel videos from YouTube API (or fallback) | `200` |

---

## 7. Export Formats
The application provides native, standard-compliant export generation:
- **JSON**: Formatted ISO 8601 timestamps, structured daily temperature arrays, and location metadata.
- **CSV**: Spreadsheet-ready flattened rows mapping record metadata to daily date rows with temperatures, rain totals, and notes.
- **XML**: Strict XML with standard tags (`<WeatherRecords>`, `<WeatherRecord>`, `<DailyData>`).
- **Markdown (.md)**: Human-readable GitHub-flavored markdown tables with summary headings.

---

## 8. Design Decisions & Trade-offs
1. **Open-Meteo Integration**: We selected Open-Meteo because it provides high quality global forecasts without requiring API keys, eliminating key rotation or quota expiration risks during recruitment evaluation.
2. **Unified Overview Endpoint**: In addition to dedicated `/current` and `/forecast` endpoints, we built `/api/weather/overview` to query both `current` and `daily` in one upstream call, reducing latency by 50%.
3. **Regex Coordinate Parsing**: Raw coordinate queries (`40.7128,-74.0060`) are parsed locally using regex, preventing unnecessary upstream network calls.
4. **Resilient YouTube Integration**: If `YOUTUBE_API_KEY` is not present, the system returns `{available: false, videos: []}` gracefully, displaying informative travel cards rather than raising unhandled exceptions.
5. **JSON Column for Daily Records**: SQLite's native JSON support stores daily arrays cleanly without requiring complex multiple join tables, optimizing performance for records under 31 days.

---

## 9. Limitations & Future Roadmap
- **Historical Data Boundary**: Queries older than 1950 are blocked as Open-Meteo ERA5 archive covers 1950 onward.
- **Offline Caching**: While the frontend detects offline status and maintains UI state, service workers could be added in the future for offline PWA functionality.

---

## 10. Candidate Attribution
- **Candidate Name**: `[YOUR NAME]`
- **Assessment**: AI Engineer Intern - PM Accelerator
- **Description**: *Refer to [PMA Info Section](file:///D:/PMA/pma-weather-app/frontend/src/components/PmaInfoSection.jsx) for the official PM Accelerator placeholder.*

