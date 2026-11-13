import csv
import io
import json
import xml.etree.ElementTree as ET
from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import WeatherRecord
from app.schemas import (
    WeatherRecordCreate,
    WeatherRecordResponse,
    WeatherRecordUpdate,
)
from app.services.geocoding import LocationNotFound, search_locations
from app.services.weather import WeatherServiceError, fetch_range_weather

router = APIRouter(prefix="/api/records", tags=["weather_records"])

MAX_RANGE_DAYS = 31
EARLIEST_DATE = date(1950, 1, 1)


def validate_date_range(start_date: date, end_date: date) -> None:
    if start_date > end_date:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid date range: start_date ({start_date}) cannot be after end_date ({end_date}).",
        )
    delta_days = (end_date - start_date).days
    if delta_days > MAX_RANGE_DAYS:
        raise HTTPException(
            status_code=422,
            detail=f"Date range exceeds maximum allowed limit of {MAX_RANGE_DAYS} days (requested {delta_days} days).",
        )
    max_future_date = datetime.now().date() + timedelta(days=16)
    if end_date > max_future_date:
        raise HTTPException(
            status_code=422,
            detail=f"End date cannot exceed forecast window of 16 days in the future (max: {max_future_date}).",
        )
    if start_date < EARLIEST_DATE:
        raise HTTPException(
            status_code=422,
            detail=f"Start date cannot be earlier than {EARLIEST_DATE}.",
        )


@router.post("", response_model=WeatherRecordResponse, status_code=201)
async def create_record(
    payload: WeatherRecordCreate,
    db: Session = Depends(get_db),
):
    validate_date_range(payload.start_date, payload.end_date)

    lat = payload.latitude
    lon = payload.longitude
    loc_name = payload.location_name.strip()
    country = payload.country

    # If coordinates are missing, resolve them via geocoding service
    if lat is None or lon is None:
        try:
            matches = await search_locations(loc_name, count=1)
            if not matches:
                raise HTTPException(status_code=404, detail=f"Location '{loc_name}' could not be resolved.")
            best = matches[0]
            lat = best["latitude"]
            lon = best["longitude"]
            loc_name = best["name"]
            country = best.get("country") or country
        except LocationNotFound:
            raise HTTPException(status_code=404, detail=f"Location '{loc_name}' could not be resolved.")
        except Exception as exc:
            raise HTTPException(status_code=502, detail=f"Geocoding service error: {str(exc)}")

    # Fetch daily weather for the specified range
    try:
        daily_data = await fetch_range_weather(lat, lon, payload.start_date, payload.end_date)
    except WeatherServiceError as exc:
        raise HTTPException(status_code=502, detail=str(exc))

    record = WeatherRecord(
        location_name=loc_name,
        country=country,
        latitude=lat,
        longitude=lon,
        start_date=payload.start_date,
        end_date=payload.end_date,
        daily_data=daily_data,
        notes=payload.notes,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("", response_model=list[WeatherRecordResponse])
def list_records(db: Session = Depends(get_db)):
    stmt = select(WeatherRecord).order_by(desc(WeatherRecord.created_at))
    return db.scalars(stmt).all()


@router.get("/export")
def export_all_records(
    format: str = Query("json", pattern="^(json|csv|xml|markdown)$"),
    db: Session = Depends(get_db),
):
    stmt = select(WeatherRecord).order_by(desc(WeatherRecord.created_at))
    records = db.scalars(stmt).all()
    return generate_export_response(records, format, "all_weather_records")


@router.get("/{record_id}", response_model=WeatherRecordResponse)
def get_record(record_id: int, db: Session = Depends(get_db)):
    record = db.get(WeatherRecord, record_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Weather record with ID {record_id} not found.")
    return record


@router.put("/{record_id}", response_model=WeatherRecordResponse)
async def update_record(
    record_id: int,
    payload: WeatherRecordUpdate,
    db: Session = Depends(get_db),
):
    record = db.get(WeatherRecord, record_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Weather record with ID {record_id} not found.")

    new_start = payload.start_date or record.start_date
    new_end = payload.end_date or record.end_date
    dates_changed = (new_start != record.start_date) or (new_end != record.end_date)

    if dates_changed:
        validate_date_range(new_start, new_end)
        try:
            new_daily_data = await fetch_range_weather(
                record.latitude, record.longitude, new_start, new_end
            )
            record.start_date = new_start
            record.end_date = new_end
            record.daily_data = new_daily_data
        except WeatherServiceError as exc:
            raise HTTPException(status_code=502, detail=str(exc))

    if payload.notes is not None:
        record.notes = payload.notes

    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    record = db.get(WeatherRecord, record_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Weather record with ID {record_id} not found.")
    db.delete(record)
    db.commit()
    return {"status": "success", "message": f"Weather record {record_id} deleted."}


@router.get("/{record_id}/export")
def export_single_record(
    record_id: int,
    format: str = Query("json", pattern="^(json|csv|xml|markdown)$"),
    db: Session = Depends(get_db),
):
    record = db.get(WeatherRecord, record_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Weather record with ID {record_id} not found.")
    return generate_export_response([record], format, f"weather_record_{record_id}")


def generate_export_response(records: list[WeatherRecord], format_type: str, base_filename: str) -> Response:
    if format_type == "json":
        data = [
            {
                "id": r.id,
                "location_name": r.location_name,
                "country": r.country,
                "latitude": r.latitude,
                "longitude": r.longitude,
                "start_date": r.start_date.isoformat(),
                "end_date": r.end_date.isoformat(),
                "notes": r.notes,
                "daily_data": r.daily_data,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None,
            }
            for r in records
        ]
        content = json.dumps(data, indent=2)
        return Response(
            content=content,
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="{base_filename}.json"'},
        )

    elif format_type == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow([
            "Record ID",
            "Location",
            "Country",
            "Latitude",
            "Longitude",
            "Date",
            "Max Temp (°C)",
            "Min Temp (°C)",
            "Precipitation (mm)",
            "Condition",
            "Notes",
        ])
        for r in records:
            daily = r.daily_data or []
            if not daily:
                writer.writerow([
                    r.id,
                    r.location_name,
                    r.country or "",
                    r.latitude,
                    r.longitude,
                    "",
                    "",
                    "",
                    "",
                    "",
                    r.notes or "",
                ])
            for d in daily:
                writer.writerow([
                    r.id,
                    r.location_name,
                    r.country or "",
                    r.latitude,
                    r.longitude,
                    d.get("date", ""),
                    d.get("temp_max", ""),
                    d.get("temp_min", ""),
                    d.get("precipitation_sum", ""),
                    d.get("condition", ""),
                    r.notes or "",
                ])
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="{base_filename}.csv"'},
        )

    elif format_type == "xml":
        root = ET.Element("WeatherRecords")
        for r in records:
            rec_el = ET.SubElement(root, "WeatherRecord")
            ET.SubElement(rec_el, "Id").text = str(r.id)
            ET.SubElement(rec_el, "Location").text = r.location_name
            ET.SubElement(rec_el, "Country").text = r.country or ""
            ET.SubElement(rec_el, "Latitude").text = str(r.latitude)
            ET.SubElement(rec_el, "Longitude").text = str(r.longitude)
            ET.SubElement(rec_el, "StartDate").text = r.start_date.isoformat()
            ET.SubElement(rec_el, "EndDate").text = r.end_date.isoformat()
            ET.SubElement(rec_el, "Notes").text = r.notes or ""
            daily_el = ET.SubElement(rec_el, "DailyData")
            for d in r.daily_data or []:
                day_el = ET.SubElement(daily_el, "Day")
                ET.SubElement(day_el, "Date").text = str(d.get("date", ""))
                ET.SubElement(day_el, "TempMax").text = str(d.get("temp_max", ""))
                ET.SubElement(day_el, "TempMin").text = str(d.get("temp_min", ""))
                ET.SubElement(day_el, "Precipitation").text = str(d.get("precipitation_sum", ""))
                ET.SubElement(day_el, "Condition").text = str(d.get("condition", ""))
        content = ET.tostring(root, encoding="utf-8", xml_declaration=True).decode("utf-8")
        return Response(
            content=content,
            media_type="application/xml",
            headers={"Content-Disposition": f'attachment; filename="{base_filename}.xml"'},
        )

    elif format_type == "markdown":
        lines = [f"# Weather Records Report - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"]
        for r in records:
            lines.append(f"## Record #{r.id}: {r.location_name} ({r.country or 'N/A'})")
            lines.append(f"- **Coordinates:** {r.latitude:.4f}, {r.longitude:.4f}")
            lines.append(f"- **Range:** {r.start_date} to {r.end_date}")
            lines.append(f"- **Notes:** {r.notes or 'None'}")
            lines.append("\n| Date | Max Temp (°C) | Min Temp (°C) | Rain (mm) | Condition |")
            lines.append("| :--- | :--- | :--- | :--- | :--- |")
            for d in r.daily_data or []:
                lines.append(
                    f"| {d.get('date')} | {d.get('temp_max')}°C | {d.get('temp_min')}°C | {d.get('precipitation_sum')}mm | {d.get('condition')} |"
                )
            lines.append("\n---\n")
        content = "\n".join(lines)
        return Response(
            content=content,
            media_type="text/markdown",
            headers={"Content-Disposition": f'attachment; filename="{base_filename}.md"'},
        )

    raise HTTPException(status_code=400, detail=f"Unsupported format: {format_type}")
