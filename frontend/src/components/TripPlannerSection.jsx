import React, { useState, useEffect } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  Edit3,
  Download,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
  Check,
  ChevronDown,
} from 'lucide-react';
import {
  listRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getExportUrl,
} from '../services/api';
import { formatTemp } from '../utils/formatters';

export default function TripPlannerSection({ activeLocation, unit }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Form State
  const [locationName, setLocationName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Export dropdown states
  const [exportAllOpen, setExportAllOpen] = useState(false);
  const [activeExportId, setActiveExportId] = useState(null);

  // Sync active location from search
  useEffect(() => {
    if (activeLocation?.name) {
      setLocationName(activeLocation.name);
    }
  }, [activeLocation]);

  // Set default dates: tomorrow to +4 days
  useEffect(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 1);
    const end = new Date(today);
    end.setDate(today.getDate() + 5);

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listRecords();
      setRecords(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch saved trip records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!locationName.trim()) {
      setError('Please provide a destination name.');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please provide both start and end dates.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      setError('Start date cannot be after end date.');
      return;
    }
    if (diffDays > 31) {
      setError(`Date range (${diffDays} days) exceeds maximum limit of 31 days.`);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        location_name: locationName.trim(),
        country: activeLocation?.country || null,
        latitude: activeLocation?.latitude || null,
        longitude: activeLocation?.longitude || null,
        start_date: startDate,
        end_date: endDate,
        notes: notes.trim() || null,
      };

      await createRecord(payload);
      setSuccessMsg(`Trip to "${locationName}" saved successfully!`);
      setNotes('');
      await loadRecords();
    } catch (err) {
      setError(err.message || 'Failed to save trip weather record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRecord = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the trip record for "${name}"?`)) {
      return;
    }
    try {
      await deleteRecord(id);
      setSuccessMsg(`Trip record for "${name}" deleted.`);
      await loadRecords();
    } catch (err) {
      setError(err.message || 'Failed to delete record.');
    }
  };

  const handleStartEdit = (record) => {
    setEditingRecord(record);
    setEditStartDate(record.start_date);
    setEditEndDate(record.end_date);
    setEditNotes(record.notes || '');
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;

    const start = new Date(editStartDate);
    const end = new Date(editEndDate);
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      setError('Start date cannot be after end date.');
      return;
    }
    if (diffDays > 31) {
      setError(`Date range (${diffDays} days) exceeds maximum limit of 31 days.`);
      return;
    }

    setEditSubmitting(true);
    try {
      await updateRecord(editingRecord.id, {
        start_date: editStartDate,
        end_date: editEndDate,
        notes: editNotes.trim() || null,
      });
      setSuccessMsg(`Trip record #${editingRecord.id} updated!`);
      setEditingRecord(null);
      await loadRecords();
    } catch (err) {
      setError(err.message || 'Failed to update record.');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="card planner-section">
      <div className="planner-header">
        <div className="section-title-row">
          <Compass size={22} color="#38bdf8" />
          <h3 className="section-title">Travel Weather Planner (CRUD & History)</h3>
        </div>

        {/* Global Export Button */}
        <div className="export-all-wrapper">
          <button
            type="button"
            className="btn btn-secondary export-btn"
            onClick={() => setExportAllOpen(!exportAllOpen)}
            disabled={records.length === 0}
          >
            <Download size={16} /> Export All ({records.length}) <ChevronDown size={14} />
          </button>
          {exportAllOpen && (
            <div className="export-dropdown-menu">
              <a
                href={getExportUrl(null, 'json')}
                download="all_weather_records.json"
                className="export-opt"
                onClick={() => setExportAllOpen(false)}
              >
                JSON Format
              </a>
              <a
                href={getExportUrl(null, 'csv')}
                download="all_weather_records.csv"
                className="export-opt"
                onClick={() => setExportAllOpen(false)}
              >
                CSV Spreadsheet
              </a>
              <a
                href={getExportUrl(null, 'xml')}
                download="all_weather_records.xml"
                className="export-opt"
                onClick={() => setExportAllOpen(false)}
              >
                XML Document
              </a>
              <a
                href={getExportUrl(null, 'markdown')}
                download="all_weather_records.md"
                className="export-opt"
                onClick={() => setExportAllOpen(false)}
              >
                Markdown (.md)
              </a>
            </div>
          )}
        </div>
      </div>

      <p className="planner-desc">
        Save custom trip itineraries (up to 31 days) to fetch and store daily historical or forecasted weather in SQLite. Update trip dates or notes anytime, and export reports in JSON, CSV, XML, and Markdown.
      </p>

      {/* Notifications inside planner */}
      {error && (
        <div className="planner-alert planner-error">
          <AlertCircle size={16} /> <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="planner-alert planner-success">
          <Check size={16} /> <span>{successMsg}</span>
        </div>
      )}

      {/* Create Trip Form */}
      <form onSubmit={handleCreateRecord} className="planner-form">
        <div className="form-grid">
          <div className="form-field">
            <label>Destination Location</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Rome, Honolulu, or Eiffel Tower"
              required
            />
          </div>

          <div className="form-field">
            <label>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label>End Date (Max 31 Days)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-field full-width">
          <label>Packing & Travel Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Beach resort trip, remember sunscreen and hiking shoes..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={16} className="spin" /> Fetching Weather & Saving...
              </>
            ) : (
              <>
                <Plus size={16} /> Save Trip Weather Record
              </>
            )}
          </button>
        </div>
      </form>

      {/* Saved Records List */}
      <div className="saved-records-container">
        <h4 className="records-subtitle">Saved Trip Records ({records.length})</h4>

        {loading ? (
          <div className="records-loading">
            <Loader2 size={24} className="spin" /> Loading saved records...
          </div>
        ) : records.length === 0 ? (
          <div className="records-empty">
            <Calendar size={32} color="#94a3b8" />
            <p>No saved trips yet. Pick a destination and date range above to save your first travel plan.</p>
          </div>
        ) : (
          <div className="records-list">
            {records.map((r) => {
              const daily = r.daily_data || [];
              const maxTemps = daily.map((d) => d.temp_max).filter((t) => t !== undefined);
              const minTemps = daily.map((d) => d.temp_min).filter((t) => t !== undefined);
              const highOverall = maxTemps.length ? Math.max(...maxTemps) : null;
              const lowOverall = minTemps.length ? Math.min(...minTemps) : null;

              return (
                <div key={r.id} className="record-item-card">
                  <div className="record-top-row">
                    <div>
                      <span className="record-badge">Trip #{r.id}</span>
                      <h4 className="record-destination">
                        {r.location_name} {r.country ? `(${r.country})` : ''}
                      </h4>
                      <p className="record-dates">
                        <Calendar size={14} /> {r.start_date} → {r.end_date} ({daily.length} days)
                      </p>
                    </div>

                    <div className="record-actions">
                      {/* Export Dropdown */}
                      <div className="export-single-wrapper">
                        <button
                          type="button"
                          className="btn-icon"
                          title="Export this record"
                          onClick={() => setActiveExportId(activeExportId === r.id ? null : r.id)}
                        >
                          <Download size={16} />
                        </button>
                        {activeExportId === r.id && (
                          <div className="export-dropdown-menu single-dropdown">
                            <a
                              href={getExportUrl(r.id, 'json')}
                              download={`record_${r.id}.json`}
                              className="export-opt"
                              onClick={() => setActiveExportId(null)}
                            >
                              JSON
                            </a>
                            <a
                              href={getExportUrl(r.id, 'csv')}
                              download={`record_${r.id}.csv`}
                              className="export-opt"
                              onClick={() => setActiveExportId(null)}
                            >
                              CSV
                            </a>
                            <a
                              href={getExportUrl(r.id, 'xml')}
                              download={`record_${r.id}.xml`}
                              className="export-opt"
                              onClick={() => setActiveExportId(null)}
                            >
                              XML
                            </a>
                            <a
                              href={getExportUrl(r.id, 'markdown')}
                              download={`record_${r.id}.md`}
                              className="export-opt"
                              onClick={() => setActiveExportId(null)}
                            >
                              Markdown
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Edit */}
                      <button
                        type="button"
                        className="btn-icon"
                        title="Edit Dates / Notes"
                        onClick={() => handleStartEdit(r)}
                      >
                        <Edit3 size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="btn-icon btn-icon-danger"
                        title="Delete Trip"
                        onClick={() => handleDeleteRecord(r.id, r.location_name)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Temperature overview */}
                  <div className="record-weather-summary">
                    <span className="summary-pill">
                      Range High: <strong>{formatTemp(highOverall, unit)}</strong>
                    </span>
                    <span className="summary-pill">
                      Range Low: <strong>{formatTemp(lowOverall, unit)}</strong>
                    </span>
                    <span className="summary-pill coords-pill">
                      {r.latitude.toFixed(2)}°, {r.longitude.toFixed(2)}°
                    </span>
                  </div>

                  {/* Notes */}
                  {r.notes && (
                    <div className="record-notes">
                      <FileText size={14} /> <span>{r.notes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="modal-overlay" onClick={() => setEditingRecord(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h4 className="modal-title">Edit Trip #{editingRecord.id}: {editingRecord.location_name}</h4>
            <p className="modal-sub">
              Changing dates will re-validate and re-fetch daily weather from Open-Meteo.
            </p>

            <form onSubmit={handleUpdateRecord} className="modal-form">
              <div className="form-field">
                <label>Start Date</label>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>End Date (Max 31 Days)</label>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label>Notes</label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingRecord(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={editSubmitting}>
                  {editSubmitting ? <Loader2 size={16} className="spin" /> : 'Update & Re-fetch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
