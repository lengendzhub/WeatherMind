# 1-to-2 Minute Technical Demo Script
*Travel Weather Planner • AI Engineer Intern Assessment*

Use this script during your video recording or live technical interview review. It guides you smoothly through both code highlights and live functionality within 90–120 seconds.

---

## ⏱️ Video Demo Timeline (Total: 100 seconds)

### Part 1: Introduction & Architecture (0:00 - 0:25)
**Visual**: Show your IDE workspace with both frontend and backend directories visible.
> "Hello everyone! My name is **[YOUR NAME]**, and this is my submission for the PM Accelerator AI Engineer Intern assessment: the **Travel Weather Planner**.
>
> To deliver a robust full-stack solution, I designed a clean, modular architecture:
> - On the backend, we have **FastAPI** with **SQLAlchemy 2.0** and **SQLite**, interfacing with **Open-Meteo** for zero-API-key weather forecasts and geocoding.
> - On the frontend, we built a modern, responsive single-page application in **React with Vite**, avoiding Python frontend frameworks to strictly comply with the brief."

---

### Part 2: Live Feature Walkthrough (0:25 - 0:55)
**Visual**: Switch to browser at `http://localhost:5173`.
> "Here in the live application:
> 1. In the search bar, I can type any city like *Tokyo*, a postal code like *10001*, a landmark like the *Eiffel Tower*, or raw GPS coordinates like *40.71,-74.00*.
> 2. Clicking **Search** displays our real-time weather hero card: showing temperature, feels-like, WMO-decoded condition with custom day/night icons, humidity, wind, and UV index.
> 3. We also have a 5-day forecast with daily rain probabilities, and an instant **°C / °F toggle** that persists across page refreshes.
> 4. Below, we embed an interactive **OpenStreetMap** with pinpoint coordinates and optional travel guide videos."

---

### Part 3: Backend CRUD & Export Demonstration (0:55 - 1:20)
**Visual**: Scroll down to the "Travel Weather Planner (CRUD & History)" section.
> "Now let's examine the Trip Planner CRUD feature:
> 1. I can select a date range—such as the next 4 days—add packing notes, and click **Save Trip Weather Record**.
> 2. The backend validates the 31-day constraint, calls Open-Meteo's range API, and commits the daily data into our SQLite database.
> 3. We can edit existing trips, triggering automatic weather recalculation, or delete them.
> 4. Best of all, we provide native multi-format exports: with one click, I can download this report as **JSON**, a **CSV** spreadsheet, an **XML** tree, or formatted **Markdown**."

---

### Part 4: Code Quality, Testing & Wrap-Up (1:20 - 1:40)
**Visual**: Switch terminal and run `pytest tests/ -v`.
> "Behind the scenes, the code adheres to production best practices: strict Pydantic schemas, 10-second outbound HTTP timeouts, and graceful fallbacks.
> Running `pytest` shows all **16 automated tests passing** with 100% mocked external API isolation.
>
> Thank you for reviewing my project, and I look forward to contributing to PM Accelerator!"
