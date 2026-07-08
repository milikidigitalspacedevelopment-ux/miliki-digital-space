import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import CTASection from "../../components/sections/CTASection";

import eventService from "../../services/eventService";

function EventDetailsPage() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const response = await eventService.getEventById(id);
      const eventData = response?.data ?? response;

      setEvent({
        ...eventData,
        title: eventData?.title || "Untitled event",
        image: eventData?.image || "/images/event.jpg",
        date: eventData?.date || eventData?.event_date || eventData?.start_date || "TBD",
        time: eventData?.time || eventData?.start_time || "To be announced",
        location: eventData?.location || eventData?.venue || "TBD",
        description: eventData?.description || eventData?.details || "Join us for this community event.",
      });
    } catch (error) {
      console.error(error);
      setEvent(null);
    }
  };

  if (!event) return null;

  return (
    <>
      <section className="container py-5">

        <Breadcrumbs
          items={[
            { label: "Home", path: "/" },
            { label: "Events", path: "/events" },
            { label: event.title },
          ]}
        />

        <div className="row g-5">

          <div className="col-lg-8">

            <img
              src={event.image}
              alt={event.title}
              className="img-fluid rounded-5 shadow mb-4"
            />

            <h1 className="fw-bold">
              {event.title}
            </h1>

            <div className="text-muted mb-4">
              {event.date} · {event.time}
            </div>

            <p className="lead">
              {event.description}
            </p>

          </div>

          <div className="col-lg-4">

            <div
              className="p-4 shadow"
              style={{
                borderRadius: "30px",
                position: "sticky",
                top: "100px",
                background: "rgba(255,255,255,.9)",
                backdropFilter: "blur(15px)",
              }}
            >
              <h5 className="fw-bold mb-4">
                Event Information
              </h5>

              <div className="mb-3">
                <strong>Date</strong>
                <div>{event.date}</div>
              </div>

              <div className="mb-3">
                <strong>Time</strong>
                <div>{event.time}</div>
              </div>

              <div className="mb-4">
                <strong>Location</strong>
                <div>{event.location}</div>
              </div>

              <button className="btn btn-success rounded-pill w-100">
                Register
              </button>

            </div>

          </div>

        </div>

      </section>

      <CTASection />
    </>
  );
}

export default EventDetailsPage;