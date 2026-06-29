import { useEffect, useState } from "react";
import EventCard from "../cards/EventCard";
import eventService from "../../services/eventService";

function EventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await eventService.getEvents();
      setEvents(Array.isArray(response) ? response : response?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="py-5">

      <div className="container">

        <h2 className="fw-bold mb-4">
          Upcoming Events
        </h2>

        <div className="row">

          {events.slice(0, 3).map((event) => (
            <div
              className="col-lg-4 mb-4"
              key={event.id}
            >
              <EventCard event={event} />
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default EventsSection;