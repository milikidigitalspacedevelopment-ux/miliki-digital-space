import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

function EventCard({ event }) {
  return (
    <div className="card shadow-sm h-100 border-0">

      <img
        src={event.image || "/images/event.jpg"}
        alt={event.title}
        className="card-img-top"
        style={{ height: "220px", objectFit: "cover" }}
      />

      <div className="card-body">

        <h5>{event.title}</h5>

        <p>
          <FaCalendarAlt className="me-2" />
          {event.event_date}
        </p>

        <p>
          <FaMapMarkerAlt className="me-2" />
          {event.location}
        </p>

      </div>

      <div className="card-footer bg-white border-0">

        <Link
          className="btn btn-outline-success w-100"
          to={`/events/${event.id || event.slug}`}
        >
          Event Details
        </Link>

      </div>

    </div>
  );
}

export default EventCard;