import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageBanner from "../../components/common/PageBanner";
import SearchBar from "../../components/filters/SearchBar";
import EventCard from "../../components/cards/EventCard";
import CTASection from "../../components/sections/CTASection";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";

import eventService from "../../services/eventService";

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventService.getEvents();
      setEvents(Array.isArray(response) ? response : response?.data || []);
    } catch {
      setEvents([
        {
          id: 1,
          title: "Youth Empowerment Workshop",
          date: "August 15, 2026",
          location: "Nairobi",
        },
        {
          id: 2,
          title: "Digital Skills Bootcamp",
          date: "September 5, 2026",
          location: "Kisumu",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageBanner
        title="Events"
        subtitle="Join our upcoming community events and workshops."
      />

      <section className="container py-5">

        <div className="mb-5">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search events..."
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            title="No Events Found"
            message="No matching events available."
          />
        ) : (
          <div className="row g-4">

            {filteredEvents.map((event) => (
              <div
                className="col-md-6 col-xl-4"
                key={event.id}
              >
                <EventCard event={event} />

                <div className="mt-3">
                  <Link
                    className="btn btn-success rounded-pill"
                    to={`/events/${event.id}`}
                  >
                    View Details
                  </Link>
                </div>

              </div>
            ))}

          </div>
        )}

      </section>

      <CTASection />
    </>
  );
}

export default EventsPage;