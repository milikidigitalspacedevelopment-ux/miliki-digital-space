const events = [
  {
    id: 1,
    title: "Youth Empowerment Workshop",
    slug: "youth-empowerment-workshop",
    description: "Hands-on sessions for young people to build practical skills.",
    image: "/images/event1.jpg",
    event_date: "2026-08-15",
    location: "Nairobi",
    category: "Workshop",
  },
  {
    id: 2,
    title: "Digital Skills Bootcamp",
    slug: "digital-skills-bootcamp",
    description: "A weekend bootcamp focused on digital literacy and entrepreneurship.",
    image: "/images/event2.jpg",
    event_date: "2026-09-05",
    location: "Kisumu",
    category: "Bootcamp",
  },
  {
    id: 3,
    title: "Community Outreach Day",
    slug: "community-outreach-day",
    description: "Join our outreach team to support local programs and donations.",
    image: "/images/event3.jpg",
    event_date: "2026-10-10",
    location: "Mombasa",
    category: "Outreach",
  },
];

export const getEvents = (req, res) => {
  res.json(events);
};

export const getEvent = (req, res) => {
  const event = events.find(
    (item) => item.id === Number(req.params.id) || item.slug === req.params.id
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  return res.json(event);
};

export const registerForEvent = (req, res) => {
  const event = events.find(
    (item) => item.id === Number(req.params.id) || item.slug === req.params.id
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  return res.json({
    success: true,
    message: "Registration received",
    eventId: event.id,
  });
};
