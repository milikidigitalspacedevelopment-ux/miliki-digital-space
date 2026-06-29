import { useState } from "react";
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

function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const events = [
    {
      id: 1,
      title: "Digital Skills Bootcamp",
      venue: "Nairobi Innovation Hub",
      date: "2026-08-15",
      participants: 180,
      status: "Upcoming",
    },
    {
      id: 2,
      title: "Women Leadership Summit",
      venue: "Kisumu Conference Centre",
      date: "2026-07-28",
      participants: 320,
      status: "Ongoing",
    },
    {
      id: 3,
      title: "Youth Entrepreneurship Workshop",
      venue: "Mombasa Training Centre",
      date: "2026-06-10",
      participants: 140,
      status: "Completed",
    },
    {
      id: 4,
      title: "Community Outreach Program",
      venue: "Nakuru Community Hall",
      date: "2026-09-05",
      participants: 220,
      status: "Upcoming",
    },
  ];

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    48
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
                    14
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
                    3
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
                    5,860
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

              {filteredEvents.map((event) => (
                <tr key={event.id}>

                  <td className="fw-semibold">
                    {event.title}
                  </td>

                  <td>
                    <MapPin
                      size={15}
                      className="me-1"
                    />
                    {event.venue}
                  </td>

                  <td>
                    {event.date}
                  </td>

                  <td>
                    {event.participants}
                  </td>

                  <td>

                    <span
                      className={`badge ${
                        event.status === "Upcoming"
                          ? "bg-success"
                          : event.status === "Ongoing"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {event.status}
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