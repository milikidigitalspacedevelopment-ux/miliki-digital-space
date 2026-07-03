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

function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEvents();
        setEvents(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <div className="container-fluid py-4">

      {/* Header */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Events Management
          </h2>

          <p className="text-muted mb-0">
            Organize workshops, seminars and outreach events.
          </p>
        </div>

        <button className="btn btn-success rounded-pill px-4">
          <Plus size={18} className="me-2" />
          Create Event
        </button>

      </div>

      {/* Statistics */}

      <div className="row g-4 mb-4">

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <CalendarDays size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Total Events
                  </small>

                  <h3 className="fw-bold mb-0">
                    {events.length}
                  </h3>
                </div>

              </div>

            </div>
          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <Clock size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Upcoming
                  </small>

                  <h3 className="fw-bold mb-0">
                    {events.filter((event) => (event.status || "").toLowerCase() === "upcoming").length}
                  </h3>
                </div>

              </div>

            </div>
          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <CalendarDays size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Ongoing
                  </small>

                  <h3 className="fw-bold mb-0">
                    {events.filter((event) => (event.status || "").toLowerCase() === "ongoing").length}
                  </h3>
                </div>

              </div>

            </div>
          </div>

        </div>

        <div className="col-lg-3 col-md-6">

          <div className="card border-0 shadow-sm rounded-5 h-100">
            <div className="card-body">

              <div className="d-flex align-items-center">

                <div
                  className="bg-info text-white rounded-circle d-flex justify-content-center align-items-center me-3"
                  style={{ width: 60, height: 60 }}
                >
                  <Users size={28} />
                </div>

                <div>
                  <small className="text-muted">
                    Registrations
                  </small>

                  <h3 className="fw-bold mb-0">
                    {events.reduce((sum, event) => sum + Number(event.participants || 0), 0).toLocaleString()}
                  </h3>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Search */}

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
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
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

      {/* Events Table */}

      <div className="card border-0 shadow-sm rounded-5">

        <div className="card-body table-responsive">

          <table className="table align-middle">

            <thead>

              <tr>
                <th>Event</th>
                <th>Venue</th>
                <th>Date</th>
                <th>Participants</th>
                <th>Status</th>
                <th width="180">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-4">Loading events...</td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-danger">{error}</td>
                </tr>
              )}

              {!loading && !error && filteredEvents.map((event) => (
                <tr key={event.id}>

                  <td className="fw-semibold">
                    {event.title}
                  </td>

                  <td>
                    <MapPin
                      size={15}
                      className="me-1"
                    />
                    {event.location || event.venue || "—"}
                  </td>

                  <td>
                    {event.event_date || event.date || "—"}
                  </td>

                  <td>
                    {event.participants || 0}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        (event.status || "").toLowerCase() === "upcoming"
                          ? "bg-success"
                          : event.status === "Ongoing"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {event.status || "Upcoming"}
                    </span>

                  </td>

                  <td>

                    <div className="d-flex gap-2 flex-wrap">

                      <button className="btn btn-sm btn-outline-primary rounded-pill">
                        <Eye size={15} />
                      </button>

                      <button className="btn btn-sm btn-outline-success rounded-pill">
                        <Pencil size={15} />
                      </button>

                      <button className="btn btn-sm btn-outline-danger rounded-pill">
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

          {filteredEvents.length === 0 && (
            <div className="text-center py-5 text-muted">
              No events found.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default EventsPage;