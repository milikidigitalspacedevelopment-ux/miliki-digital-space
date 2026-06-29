import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  Eye,
} from "lucide-react";

import volunteerService from "../../services/volunteerService";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";

import TableSearch from "../../components/tables/TableSearch";
import TablePagination from "../../components/tables/TablePagination";

function EventsPage() {
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response =
        await volunteerService.getEvents?.();

      setEvents(response || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load volunteer events.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        event.location
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [events, search]);

  const totalPages = Math.ceil(
    filteredEvents.length / pageSize
  );

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorState
        title="Events Error"
        message={error}
        onRetry={fetchEvents}
      />
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}

      <div className="mb-5">
        <h2 className="fw-bold mb-2">
          Volunteer Events
        </h2>

        <p className="text-muted">
          View upcoming events and participation opportunities.
        </p>
      </div>

      {/* Search */}

      <div className="card border-0 shadow-sm rounded-5 mb-4">
        <div className="card-body">
          <TableSearch
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search events..."
          />
        </div>
      </div>

      {/* Empty State */}

      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={55} />}
          title="No Events Found"
          message="There are currently no volunteer events available."
        />
      ) : (
        <>
          {/* Table */}

          <div className="card border-0 shadow-sm rounded-5">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table align-middle">

                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Volunteers</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedEvents.map((event) => (
                      <tr key={event.id}>
                        <td>{event.title}</td>

                        <td>{event.date}</td>

                        <td>
                          <MapPin
                            size={15}
                            className="me-2 text-secondary"
                          />
                          {event.location}
                        </td>

                        <td>
                          <Users
                            size={15}
                            className="me-2 text-secondary"
                          />
                          {event.volunteers}
                        </td>

                        <td>
                          <span
                            className={`badge bg-${
                              event.status === "Open"
                                ? "success"
                                : "secondary"
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>

                        <td>
                          <button className="btn btn-outline-primary btn-sm rounded-pill">
                            <Eye
                              size={15}
                              className="me-1"
                            />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div>
          </div>

          {/* Pagination */}

          <div className="mt-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default EventsPage;