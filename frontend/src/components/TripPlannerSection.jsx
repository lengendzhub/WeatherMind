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
  X,
  ArrowUp,
  ArrowDown,
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
  const [toastMsg, setToastMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modal / Sheet State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formLocation, setFormLocation] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast timer
  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(null), 3500);
    return () => clearTimeout(t);
  }, [toastMsg]);

  // Load records
  const loadRecords = async () => {
    setLoading(true);
    try {
      const data = await listRecords();
      setRecords(data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch saved trips.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Default dates: tomorrow to +4 days
  const initDefaultDates = () => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 1);
    const end = new Date(today);
    end.setDate(today.getDate() + 5);

    setFormStart(start.toISOString().split('T')[0]);
    setFormEnd(end.toISOString().split('T')[0]);
  };

  const handleOpenNewTrip = () => {
    setEditingRecord(null);
    setFormLocation(activeLocation?.name || '');
    initDefaultDates();
    setFormNotes('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setEditingRecord(record);
    setFormLocation(record.location_name);
    setFormStart(record.start_date);
    setFormEnd(record.end_date);
    setFormNotes(record.notes || '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    const start = new Date(formStart);
    const end = new Date(formEnd);
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      setErrorMsg('Start date cannot be after end date.');
      return;
    }
    if (diffDays > 31) {
      setErrorMsg(`Trip duration (${diffDays} days) exceeds 31-day limit.`);
      return;
    }

    setSubmitting(true);
    try {
      if (editingRecord) {
        await updateRecord(editingRecord.id, {
          start_date: formStart,
          end_date: formEnd,
          notes: formNotes.trim() || null,
        });
        setToastMsg(`Trip to "${editingRecord.location_name}" updated!`);
      } else {
        await createRecord({
          location_name: formLocation.trim(),
          country: activeLocation?.country || null,
          latitude: activeLocation?.latitude || null,
          longitude: activeLocation?.longitude || null,
          start_date: formStart,
          end_date: formEnd,
          notes: formNotes.trim() || null,
        });
        setToastMsg(`Trip to "${formLocation}" saved to database!`);
      }
      setIsModalOpen(false);
      await loadRecords();
    } catch (err) {
      setErrorMsg(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRecord(deleteTarget.id);
      setToastMsg(`Trip to "${deleteTarget.location_name}" deleted.`);
      setDeleteTarget(null);
      await loadRecords();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete record.');
    } finally {
      setDeleting(false);
    }
  };

  const triggerExport = (recordId, format) => {
    const url = getExportUrl(recordId, format);
    window.location.href = url;
    setToastMsg(`Exporting as ${format.toUpperCase()}...`);
  };

  return (
    <section className="widget planner-widget" role="region" aria-label="Trip Planner">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="glass-toast" role="status">
          <Check size={14} color="var(--green)" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="planner-top-bar">
        <div className="planner-title-group">
          <Compass size={16} strokeWidth={1.5} color="var(--blue)" />
          <h3 className="planner-heading">My Trips</h3>
          <span className="planner-count-badge tabular-nums">{records.length}</span>
        </div>

        <div className="planner-top-actions">
          {/* Export Segmented Control */}
          <div className="glass-capsule export-segmented-control" title="Export All Records">
            <span className="widget-label export-label">Export:</span>
            {['json', 'csv', 'xml', 'markdown'].map((fmt) => (
              <button
                key={fmt}
                type="button"
                className="export-segment-btn"
                onClick={() => triggerExport(null, fmt)}
                disabled={records.length === 0}
              >
                {fmt === 'markdown' ? 'MD' : fmt.toUpperCase()}
              </button>
            ))}
          </div>

          {/* New Trip Pill */}
          <button
            type="button"
            className="action-pill-btn new-trip-btn"
            onClick={handleOpenNewTrip}
          >
            <Plus size={15} strokeWidth={1.75} />
            <span>New Trip</span>
          </button>
        </div>
      </div>

      {/* Trips Content */}
      {loading ? (
        <div className="trips-grid-layout">
          {[1, 2].map((i) => (
            <div key={i} className="trip-card-shimmer skeleton" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="trips-empty-box">
          <div className="empty-symbol-disc">
            <Calendar size={22} strokeWidth={1.5} color="var(--blue)" />
          </div>
          <p className="empty-headline">No Travel Records Yet</p>
          <p className="empty-subtext">
            Plan your next journey with weather forecasts for up to 31 days.
          </p>
        </div>
      ) : (
        <div className="trips-grid-layout">
          {records.map((r) => {
            const daily = r.daily_data || [];
            const maxTemps = daily.map((d) => d.temp_max).filter((t) => typeof t === 'number');
            const minTemps = daily.map((d) => d.temp_min).filter((t) => typeof t === 'number');
            const highVal = maxTemps.length ? Math.max(...maxTemps) : null;
            const lowVal = minTemps.length ? Math.min(...minTemps) : null;

            return (
              <div key={r.id} className="trip-glass-card">
                <div className="trip-card-header">
                  <div>
                    <h4 className="trip-dest-name">{r.location_name}</h4>
                    <span className="trip-date-range">
                      {r.start_date} → {r.end_date}
                    </span>
                  </div>

                  <div className="trip-card-actions">
                    <button
                      type="button"
                      className="trip-icon-btn"
                      onClick={() => handleOpenEdit(r)}
                      title="Edit trip dates or notes"
                      aria-label="Edit trip"
                    >
                      <Edit3 size={14} strokeWidth={1.5} />
                    </button>
                    <button
                      type="button"
                      className="trip-icon-btn btn-danger-icon"
                      onClick={() => setDeleteTarget(r)}
                      title="Delete trip record"
                      aria-label="Delete trip"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>

                {/* Weather Summary Chips */}
                <div className="trip-metrics-row">
                  <div className="trip-stat-chip">
                    <ArrowUp size={11} strokeWidth={2} color="var(--orange)" />
                    <span className="tabular-nums">{formatTemp(highVal, unit)}</span>
                  </div>
                  <div className="trip-stat-chip">
                    <ArrowDown size={11} strokeWidth={2} color="var(--sky)" />
                    <span className="tabular-nums">{formatTemp(lowVal, unit)}</span>
                  </div>
                  <div className="trip-stat-chip days-chip">
                    <span>{daily.length} days</span>
                  </div>
                </div>

                {/* Notes preview */}
                {r.notes && (
                  <p className="trip-notes-preview">
                    <FileText size={12} strokeWidth={1.5} />
                    <span>{r.notes}</span>
                  </p>
                )}

                {/* Single Trip Export Links */}
                <div className="trip-export-footer">
                  <span className="widget-label">Download:</span>
                  <div className="trip-export-links">
                    {['json', 'csv', 'xml', 'markdown'].map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        className="trip-export-link-btn"
                        onClick={() => triggerExport(r.id, fmt)}
                      >
                        {fmt === 'markdown' ? 'MD' : fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Bottom Sheet Modal */}
      {isModalOpen && (
        <div className="glass-modal-scrim" onClick={() => setIsModalOpen(false)}>
          <div className="glass-modal-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="modal-drag-pill" />

            <div className="modal-top-bar">
              <h4 className="modal-title">
                {editingRecord ? `Edit Trip: ${editingRecord.location_name}` : 'Plan a New Trip'}
              </h4>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {errorMsg && (
              <div className="modal-error-pill">
                <AlertCircle size={14} color="var(--red-alert)" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="modal-form-body">
              {!editingRecord && (
                <div className="modal-field">
                  <label className="widget-label">Destination</label>
                  <input
                    type="text"
                    className="modal-input"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Rome, Tokyo, or Eiffel Tower"
                    required
                  />
                </div>
              )}

              <div className="modal-date-grid">
                <div className="modal-field">
                  <label className="widget-label">Start Date</label>
                  <input
                    type="date"
                    className="modal-input"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-field">
                  <label className="widget-label">End Date (Max 31 Days)</label>
                  <input
                    type="date"
                    className="modal-input"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-field">
                <label className="widget-label">Packing & Travel Notes</label>
                <textarea
                  className="modal-input modal-textarea"
                  rows="3"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Hiking shoes, light jacket, camera gear..."
                />
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="action-pill-btn secondary-pill"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="action-pill-btn primary-pill"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={15} strokeWidth={1.5} className="spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingRecord ? 'Update Trip' : 'Save Trip'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Sheet */}
      {deleteTarget && (
        <div className="glass-modal-scrim" onClick={() => setDeleteTarget(null)}>
          <div className="glass-modal-sheet delete-sheet" onClick={(e) => e.stopPropagation()} role="alertdialog">
            <div className="modal-drag-pill" />
            <h4 className="modal-title">Delete Trip Record?</h4>
            <p className="delete-prompt-copy">
              Are you sure you want to delete your trip to <strong>{deleteTarget.location_name}</strong>? This action cannot be undone.
            </p>

            <div className="modal-actions-row">
              <button
                type="button"
                className="action-pill-btn secondary-pill"
                onClick={() => setDeleteTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="action-pill-btn delete-destructive-pill"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 size={15} strokeWidth={1.5} className="spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Trip</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
