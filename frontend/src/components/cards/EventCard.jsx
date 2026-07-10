import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

function EventCard({ event }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className="card shadow-sm h-100 border-0"
      style={{
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        transition: "box-shadow 0.3s ease"
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: "220px",
          backgroundColor: "#f0f0f0"
        }}
      >
        <img
          src={event.image || "/images/event.jpg"}
          alt={event.title}
          className="card-img-top"
          style={{
            height: "100%",
            objectFit: "cover",
            borderRadius: "15px",
            transform: isHovering ? "scale(1.08)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        />

        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)",
            pointerEvents: "none",
            borderRadius: "15px"
          }}
        />
      </div>

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