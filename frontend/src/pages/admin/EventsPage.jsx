import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Clock,
} from "lucide-react";
import eventService from "../../services/eventService";

const emptyForm = {
  title: "",
  description: "",
  location: "",
  status: "draft",
  start_date: "",
  end_date: "",
  max_attendees: "",
  image_url: "",
};

function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      setEvents(Array.isArray(data) ? data : data?.data || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return events.filter((event) => {
      const title = (event.title || "").toLowerCase();
      const venue = (event.location || event.venue || "").toLowerCase();
      return title.includes(term) || venue.includes(term);
    });
  }, [events, searchTerm]);

  const resetModal = () => {
    setIsModalOpen(false);
    setModalMode("create");
    setSelectedEvent(null);
    setForm(emptyForm);
    setError("");
    setSuccessMessage("");
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedEvent(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setModalMode("edit");
    setSelectedEvent(event);
    setForm({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      status: event.status || "draft",
      start_date: event.start_date || "",
      end_date: event.end_date || "",
      max_attendees: event.max_attendees ?? "",
      image_url: event.image_url || "",
    });
    setIsModalOpen(true);
  };

  const openViewModal = (event) => {
    setModalMode("view");
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const response = await eventService.uploadEventImage(file);
      const uploadedUrl = response?.url || response?.secure_url || response?.data?.url || "";
      setForm((prev) => ({ ...prev, image_url: uploadedUrl }));
      setSuccessMessage("Image uploaded successfully.");
    } catch (err) {
      console.error(err);
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("A title is required.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim() || null,
        status: form.status,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        max_attendees: form.max_attendees === "" ? null : Number(form.max_attendees),
        image_url: form.image_url || null,
      };

      if (modalMode === "edit" && selectedEvent?.id) {
        const updated = await eventService.updateEvent(selectedEvent.id, payload);
        setEvents((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        setSuccessMessage("Event updated successfully.");
      } else {
        const created = await eventService.createEvent(payload);
        setEvents((prev) => [created, ...prev]);
        setSuccessMessage("Event created successfully.");
      }

      resetModal();
      await loadEvents();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Unable to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
      setSuccessMessage("Event deleted successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete event.");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Events Management</h2>
          <p className="text-muted mb-0">Organize workshops, seminars and outreach events.</p>
        </div>

        <button className="btn btn-success rounded-pill px-4" onClick={openCreateModal}>
          <Plus size={18} className="me-2" />
          Create Event
        </button>
      </div>

      {error ? <div className="alert alert-danger rounded-4" role="alert">{error}</div> : null}
      {successMessage ? <div className="alert alert-success rounded-4" role="alert">{successMessage}</div> : null}

      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <CalendarDays size={28} />
                </div>
                <div>
                  <small className="text-muted">Total Events</small>
                  <h3 className="fw-bold mb-0">{events.length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <Clock size={28} />
                </div>
                <div>
                  <small className="text-muted">Upcoming</small>
                  <h3 className="fw-bold mb-0">{events.filter((event) => (event.status || "").toLowerCase() === "upcoming").length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <CalendarDays size={28} />
                </div>
                <div>
                  <small className="text-muted">Ongoing</small>
                  <h3 className="fw-bold mb-0">{events.filter((event) => (event.status || "").toLowerCase() === "ongoing").length}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6">
          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-info text-white rounded-circle d-flex justify-content-center align-items-center me-3" style={{ width: 60, height: 60 }}>
                  <Users size={28} />
                </div>
                <div>
                  <small className="text-muted">Registrations</small>
                  <h3 className="fw-bold mb-0">{events.reduce((sum, event) => sum + Number(event.max_attendees || 0), 0).toLocaleString()}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-8">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </div>

            <div className="col-lg-4">
              <button className="btn btn-outline-secondary rounded-pill w-100">
                <Filter size={18} className="me-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-5">
        <div className="card-body table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Event</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Capacity</th>
                <th>Status</th>
                <th width="180">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading events...</td>
                </tr>
              )}

              {!loading && !error && filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td className="fw-semibold">{event.title}</td>
                  <td>
                    <MapPin size={15} className="me-1" />
                    {event.location || "—"}
                  </td>
                  <td>{event.start_date || "—"}</td>
                  <td>{event.max_attendees || 0}</td>
                  <td>
                    <span className={`badge ${(event.status || "").toLowerCase() === "upcoming" ? "bg-success" : event.status === "Ongoing" ? "bg-warning text-dark" : "bg-secondary"}`}>
                      {event.status || "Upcoming"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2 flex-wrap">
                      <button className="btn btn-sm btn-outline-primary rounded-pill" onClick={() => openViewModal(event)}>
                        <Eye size={15} />
                      </button>
                      <button className="btn btn-sm btn-outline-success rounded-pill" onClick={() => openEditModal(event)}>
                        <Pencil size={15} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={() => handleDelete(event.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEvents.length === 0 && <div className="text-center py-5 text-muted">No events found.</div>}
        </div>
      </div>

      {isModalOpen ? (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  {modalMode === "view"
                    ? selectedEvent?.title || "Event details"
                    : modalMode === "edit"
                      ? "Edit Event"
                      : "Create Event"}
                </h5>
                <button type="button" className="btn-close" onClick={resetModal}></button>
              </div>

              {modalMode === "view" && selectedEvent ? (
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12">
                      {selectedEvent.image_url ? <img src={selectedEvent.image_url} alt={selectedEvent.title} className="img-fluid rounded-4 mb-3" style={{ maxHeight: 220, objectFit: "cover" }} /> : null}
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Title</h6>
                      <p>{selectedEvent.title}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Description</h6>
                      <p>{selectedEvent.description || "No description provided."}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Location</h6>
                      <p>{selectedEvent.location || "—"}</p>
                    </div>
                    <div className="col-12">
                      <h6 className="fw-bold">Dates</h6>
                      <p>{selectedEvent.start_date || "—"} {selectedEvent.end_date ? `to ${selectedEvent.end_date}` : ""}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" name="title" value={form.title} onChange={handleFieldChange} required />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="4" name="description" value={form.description} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control" name="location" value={form.location} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Status</label>
                        <select className="form-select" name="status" value={form.status} onChange={handleFieldChange}>
                          <option value="draft">Draft</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Start Date</label>
                        <input type="date" className="form-control" name="start_date" value={form.start_date} onChange={handleFieldChange} />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">End Date</label>
                        <input type="date" className="form-control" name="end_date" value={form.end_date} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Maximum Attendees</label>
                        <input type="number" min="0" className="form-control" name="max_attendees" value={form.max_attendees} onChange={handleFieldChange} />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Event Image</label>
                        <div className="border rounded-4 p-3">
                          <input type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
                          <div className="mt-2 text-muted small">
                            {uploadingImage ? "Uploading image..." : "Upload an image to Cloudinary and attach it to this event."}
                          </div>
                          {form.image_url ? <div className="mt-3"><img src={form.image_url} alt="Event preview" className="img-fluid rounded-3" style={{ maxHeight: 180, objectFit: "cover" }} /></div> : null}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-outline-secondary" onClick={resetModal}>Cancel</button>
                    <button type="submit" className="btn btn-success" disabled={saving || uploadingImage}>
                      {saving ? "Saving..." : modalMode === "edit" ? "Save Changes" : "Create Event"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default EventsPage;