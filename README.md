# WeatherMind 🌤️✈️
### *Travel Weather Planner & Trip Intelligence Platform*
> **Candidate**: Marimuthu  
> **Program**: Product Manager Accelerator (PM Accelerator) – AI Engineer Intern Technical Assessment  
> **Satisfies**: Tech Assessment #1 (Frontend) & Tech Assessment #2 (Backend)

---

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_19_%2B_Vite-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Design](https://img.shields.io/badge/Design_System-Apple_HIG_%7C_visionOS_Glass-blueviolet?style=for-the-badge)](https://developer.apple.com/design/human-interface-guidelines)
[![SQLite](https://img.shields.io/badge/Database-SQLite_3-003b57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org)
[![Tests](https://img.shields.io/badge/Pytest-16_Passed_100%25-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)](backend/tests)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🚀 Live Production Deployments
- 🌐 **Live Web Application**: [https://weather-mind.onrender.com/](https://weather-mind.onrender.com/)
- ⚙️ **Backend REST API**: [https://weathermind-u12d.onrender.com](https://weathermind-u12d.onrender.com)
- 📖 **Interactive Swagger UI**: [https://weathermind-u12d.onrender.com/docs](https://weathermind-u12d.onrender.com/docs)
- 💚 **Backend Health Status**: [https://weathermind-u12d.onrender.com/health](https://weathermind-u12d.onrender.com/health)

---

## 🌟 Executive Summary

**WeatherMind (Travel Weather Planner)** is an Apple HIG & visionOS-inspired, widget-based weather forecast and trip intelligence web application. Designed for discerning travelers, the application unifies real-time meteorology from **Open-Meteo**, interactive mapping from **OpenStreetMap**, curated travel guides from the **YouTube Data API v3**, and robust travel itinerary persistence (CRUD + 4-format export) powered by a **FastAPI + SQLite** backend.

The user interface follows strict Apple Human Interface Guidelines: continuous curvature bento grids, frosted glass surfaces (`backdrop-filter: blur(24px)`), fluid typography clamps, dynamic atmospheric weather gradients, and mobile-first responsive architecture supporting all viewports from **320px to 2560px+**.

---

## 📸 Visual Highlights & Interactive Bento Grid

| Feature | Visual Description |
| :--- | :--- |
| **Spotlight Search & Chips** | Instant autocomplete search with postal code/GPS coordinate parsing and quick-select capital chips (London, New York, Tokyo, Paris, Sydney). |
| **Hero Current Weather** | Dynamic ambient gradient that shifts based on real-time temperature, day/night cycle, and WMO weather codes; includes ultra-light hero temperature (`clamp(5rem, 14vw, 8.5rem)`) and observation timestamp. |
| **5-Day Visual Outlook** | Continuous temperature range gradient bars showing normalized weekly spreads, current temperature dot indicator, and rain probability meters. |
| **Circular Metric Gauges** | SVG humidity gauge, rotating compass wind dial, UV index spectrum bar with risk categories, and vertical precipitation gauges. |
| **Sun Schedule Arc** | Parabolic solar trajectory arc visualizing daylight progression from sunrise to sunset. |
| **Destination Map & Modal** | Embedded OpenStreetMap with floating GPS coordinate chip, plus an **"Expand Map"** full-screen modal with interactive `+` / `−` zoom controls (`3x` to `18x`). |
| **YouTube Travel Guides** | Live streaming of top 4 curated video travel guides, walking tours, and itineraries with one-click direct YouTube playback. |
| **Trip Planner CRUD & History** | Itinerary creator supporting trips up to 31 days with automatic weather persistence in SQLite and export to **JSON**, **CSV**, **XML**, and **Markdown**. |
| **Floating Mobile Action Bar** | Mobile-first bottom action bar providing quick single-thumb access to Search, GPS Geolocation, and Trip Creation. |

---

## 🏛️ System Architecture

```
                          ┌────────────────────────────────────────────────────────┐
                          │            Vite + React 19 Client (Port 5173)          │
                          │  - Apple HIG / visionOS Bento Layout                   │
                          │  - Inter Variable Typography & Fluid Clamps            │
                          │  - Spotlight Search & Geolocation Watcher              │
                          │  - Dynamic Weather Gradients & Metric Gauges           │
                          │  - Full-Screen Interactive Map Modal with Zoom         │
                          │  - Live YouTube Travel Video Carousel                  │
                          │  - Trip Planner CRUD & Multi-Format Downloader         │
                          │  - Error Boundary & Safe Storage Fallbacks             │
                          │  - Candidate Attribution (Marimuthu · PM Accelerator)  │
                          └───────────────────────────┬────────────────────────────┘
                                                      │ HTTP / JSON REST API
                                                      ▼
                          ┌────────────────────────────────────────────────────────┐
                          │            FastAPI Backend Service (Port 8000)         │
                          │  ├── CORS Middleware (Cross-Origin Protection)         │
                          │  ├── /api/health     -> Health Check Endpoint          │
                          │  ├── /api/locations  -> Geocoding & Coordinate Parser  │
                          │  ├── /api/weather    -> Current & 5-Day Forecasts      │
                          │  ├── /api/records    -> Trip CRUD (1-31 Day Validation)│
                          │  ├── /api/records/export -> JSON, CSV, XML, Markdown   │
                          │  └── /api/media      -> OpenStreetMap & YouTube API v3 │
                          └─────────────────┬──────────────────────┬───────────────┘
                                            │                      │
                   HTTP Async (Timeouts & Fallbacks)               │ SQLAlchemy 2.0 ORM
                                            │                      ▼
                         ┌──────────────────┴─────────┐    ┌──────────────────────┐
                         │       External APIs        │    │    SQLite Database   │
                         │ 1. Open-Meteo Geocoding    │    │     (weather.db)     │
                         │ 2. Open-Meteo Forecast     │    └──────────────────────┘
                         │ 3. Open-Meteo Archive      │
                         │ 4. OpenStreetMap (Embed)   │
                         │ 5. YouTube Data API v3     │
                         └────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend (Client)
* **Framework**: React 19 (Hooks, Context, ErrorBoundary)
* **Build Tool**: Vite 8 with Hot Module Replacement (HMR)
* **Typography**: `@fontsource/inter` (Weights: 200, 400, 500, 600) + Apple System Stack (`-apple-system`, `SF Pro Display`, `SF Pro Text`)
* **Icons**: `lucide-react` (1.5 thin stroke SF-Symbols aesthetic)
* **Design & Styling**: Pure modern CSS with CSS variables, Bento Grid layout, container queries, `100dvh` viewport resilience, and WCAG AA contrast compliance
* **Restrictions Compliance**: **Zero Python or Java frameworks on the frontend**

### Backend (Server)
* **Framework**: FastAPI (Python 3.10+ / 3.11+)
* **Server**: Uvicorn ASGI
* **ORM & Database**: SQLAlchemy 2.0 with SQLite 3 (auto-migrating schema)
* **Data Validation**: Pydantic v2 schemas with regex and date constraints
* **HTTP Client**: `httpx` async client with timeout handlers
* **Environment Management**: `python-dotenv`

### External Integrations
* **Open-Meteo Geocoding API**: Fast city name, postal code, and coordinate lookups
* **Open-Meteo Forecast & Archive API**: Hourly and daily weather variables (temperature, humidity, wind, precipitation probability, UV index, sunrise/sunset)
* **OpenStreetMap (OSM)**: Open-source mapping tiles with dynamic bounding box derivation and interactive modal controls
* **Google YouTube Data API v3**: Curated travel video queries with graceful degradation when unconfigured

---

## 📁 Repository Structure

```
WeatherMind/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py              # Environment configuration & variables
│   │   ├── database.py            # SQLite engine & SQLAlchemy session factory
│   │   ├── main.py                # FastAPI entry point & CORS configuration
│   │   ├── models.py              # Database models (TripRecord, DailyWeather)
│   │   ├── schemas.py             # Pydantic validation schemas
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── locations.py       # Geocoding & coordinate search endpoints
│   │   │   ├── media.py           # OSM maps & YouTube video proxy routes
│   │   │   ├── records.py         # Trip CRUD & multi-format export routes
│   │   │   └── weather.py         # Current, forecast, & overview weather routes
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── geocoding.py       # Open-Meteo geocoding & coordinate parser
│   │       ├── weather.py         # Weather fetching & WMO code mapper
│   │       └── youtube.py         # YouTube Data API v3 async search client
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── test_geocoding.py      # Geocoding & coordinate parsing tests
│   │   ├── test_media.py          # Map bounds & YouTube fallback tests
│   │   ├── test_records.py        # Trip CRUD & 4-format export tests
│   │   └── test_weather.py        # Weather forecast & unit transformation tests
│   ├── requirements.txt           # Backend dependencies
│   ├── .env.example               # Template environment configuration
│   └── weather.db                 # SQLite database (auto-generated at runtime)
├── frontend/
│   ├── public/
│   │   ├── favicon.svg            # Custom weather mark
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                # Functional visual assets
│   │   ├── components/
│   │   │   ├── AlertBanner.jsx    # System notifications & offline monitor
│   │   │   ├── CurrentWeatherCard.jsx # Hero weather centerpiece widget
│   │   │   ├── ErrorBoundary.jsx  # React 19 error catching boundary
│   │   │   ├── ForecastGrid.jsx   # 5-day continuous range outlook
│   │   │   ├── Header.jsx         # App navigation, unit toggle, live clock
│   │   │   ├── LocationMap.jsx    # Fluid map widget & full-screen modal
│   │   │   ├── MetricWidgets.jsx  # Humidity, Wind, UV, Rain, Sun Arc
│   │   │   ├── MobileActionBar.jsx# Floating mobile bottom navigation bar
│   │   │   ├── PmaInfoSection.jsx # Candidate attribution card
│   │   │   ├── SearchBar.jsx      # Spotlight search & GPS geolocation
│   │   │   ├── TravelVideos.jsx   # YouTube video cards carousel
│   │   │   └── TripPlannerSection.jsx # Trip CRUD modal & history table
│   │   ├── config/
│   │   │   └── attribution.ts     # Candidate & PM Accelerator configuration
│   │   ├── services/
│   │   │   └── api.js             # Centralized fetch client for backend endpoints
│   │   ├── utils/
│   │   │   ├── formatters.js      # Unit conversions & gradient mappers
│   │   │   └── weatherIcons.jsx   # WMO weather code glyph mapper
│   │   ├── App.css                # Apple Bento Grid & responsive rules
│   │   ├── App.jsx                # Application root state & layout
│   │   ├── index.css              # System reset & Inter typography
│   │   ├── main.jsx               # React 19 DOM bootstrap
│   │   └── theme.css              # Apple palette CSS variables
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── TESTING.md                     # QA test matrices and edge-case verifications
└── README.md                      # Comprehensive project documentation
```

---

## ⚡ Quickstart & Installation

### Prerequisites
* **Python**: 3.10 or newer (`python --version`)
* **Node.js**: 18.0 or newer (`node --version`)
* **Git**: 2.x (`git --version`)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/lengendzhub/WeatherMind.git
cd WeatherMind
```

---

### Step 2: Configure & Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create your `.env` configuration file:
   ```bash
   # Windows
   copy .env.example .env

   # macOS / Linux
   cp .env.example .env
   ```

5. *(Optional)* Add your YouTube API Key to `backend/.env`:
   ```env
   FRONTEND_ORIGIN=http://localhost:5173
   DATABASE_URL=sqlite:///./weather.db
   YOUTUBE_API_KEY=AIzaSy...your_key_here
   ```
   > **Note**: If you don't configure a YouTube key, the app gracefully displays an informative empty state without errors.

6. Launch the FastAPI server:
   ```bash
   uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   * Backend API: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   * Interactive Swagger Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Step 3: Start the Frontend Client

1. Open a **second terminal** and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## 🧪 Testing & Verification

The project includes an automated test suite covering geocoding logic, forecast serialization, trip CRUD operations, 31-day boundary validation, and export formats.

To execute all unit and integration tests:

```bash
cd backend
# Make sure your virtual environment is active
pytest tests/ -v
```

### Test Suite Summary:
```
============================= test session starts =============================
platform win32 -- Python 3.11.x, pytest-9.2.0, pluggy-1.6.0
rootdir: D:\PMA\pma-weather-app\backend
plugins: anyio-4.12.1, asyncio-1.3.0
collected 16 items

tests/test_geocoding.py::test_parse_coordinates_valid PASSED             [  6%]
tests/test_geocoding.py::test_parse_coordinates_invalid PASSED           [ 12%]
tests/test_geocoding.py::test_search_locations_mock PASSED              [ 18%]
tests/test_media.py::test_get_map_info PASSED                           [ 25%]
tests/test_media.py::test_get_videos_without_key PASSED                 [ 31%]
tests/test_records.py::test_create_trip_record_valid PASSED             [ 37%]
tests/test_records.py::test_create_trip_record_exceeds_31_days PASSED   [ 43%]
tests/test_records.py::test_create_trip_record_inverted_dates PASSED    [ 50%]
tests/test_records.py::test_list_trip_records PASSED                    [ 56%]
tests/test_records.py::test_get_single_record PASSED                    [ 62%]
tests/test_records.py::test_update_record PASSED                        [ 68%]
tests/test_records.py::test_delete_record PASSED                        [ 75%]
tests/test_records.py::test_export_json PASSED                          [ 81%]
tests/test_records.py::test_export_csv PASSED                           [ 87%]
tests/test_records.py::test_export_xml PASSED                           [ 93%]
tests/test_records.py::test_export_markdown PASSED                      [100%]

============================= 16 passed in 1.42s =============================
```

---

## 📡 REST API Documentation

### Base URL: `http://127.0.0.1:8000/api`

| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health status | None |
| `GET` | `/locations/search` | Search locations by name, postal code, or coordinates | `q` (string, min 2 chars) |
| `GET` | `/weather/overview` | Unified current weather + N-day forecast | `latitude`, `longitude`, `days` (default 5) |
| `GET` | `/weather/current` | Real-time weather observation | `latitude`, `longitude` |
| `GET` | `/weather/forecast` | N-day forecast | `latitude`, `longitude`, `days` |
| `GET` | `/records` | List all saved trip records | None |
| `POST` | `/records` | Create a new trip (fetches weather & saves) | `location_name`, `start_date`, `end_date`, `notes` |
| `GET` | `/records/{id}` | Retrieve trip record by ID | `id` (integer) |
| `PUT` | `/records/{id}` | Update trip dates, notes, or recalculate | `start_date`, `end_date`, `notes` |
| `DELETE` | `/records/{id}` | Delete a trip record | `id` (integer) |
| `GET` | `/records/export` | Export all trips in specified format | `format` (`json`, `csv`, `xml`, `md`) |
| `GET` | `/records/{id}/export` | Export individual trip record | `id` (int), `format` (`json`, `csv`, `xml`, `md`) |
| `GET` | `/media/map` | Generate OpenStreetMap embed & coordinates | `latitude`, `longitude`, `zoom` (1–19) |
| `GET` | `/media/videos` | Fetch curated YouTube travel guides | `q` (city name) |

---

## 📊 Export Formats Showcase

Trip records can be exported directly via the UI or the `/api/records/export` endpoint in 4 standard formats:

1. **JSON (`application/json`)**: Full nested object structure with daily weather breakdowns.
2. **CSV (`text/csv`)**: Tabular format with headers for spreadsheet analysis in Excel or Google Sheets.
3. **XML (`application/xml`)**: Strict hierarchical `<trips>` and `<trip>` schema with attribute keys.
4. **Markdown (`text/markdown`)**: Clean GFM tables and headers formatted for documentation or GitHub.

---

## 📱 Responsive Breakpoints & Viewport Testing

The frontend is engineered mobile-first and tested rigorously across diverse form factors:

* **320px – 390px**: Compact mobile (iPhone SE / iPhone 15 Pro) with single-column stack and floating bottom action bar.
* **640px – 820px**: Tablets and foldables with 2-column bento structure.
* **1024px – 1280px**: Desktop displays with 4-column balanced bento grid.
* **1440px – 2560px+**: 4K and ultra-wide screens with automatic max-width constraint (`1280px` – `1440px`) and zero horizontal scrolling (`overflow-x: clip`).

---

## 👤 Candidate & Program Attribution

This project was engineered by **Marimuthu** as part of the **Product Manager Accelerator (PM Accelerator)** AI Engineer Intern technical evaluation.

* **Candidate**: Marimuthu
* **Program**: AI Engineer Intern Technical Assessment
* **Organization**: Product Manager Accelerator
* **Attribution Configuration**: [frontend/src/config/attribution.ts](frontend/src/config/attribution.ts)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
