export const normalizeEventPayload = (payload = {}) => {
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const description = typeof payload.description === "string" ? payload.description.trim() : "";
  const location = typeof payload.location === "string" ? payload.location.trim() : "";
  const status = payload.status || "draft";

  const normalizeOptionalDate = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    return value;
  };

  const normalizeOptionalNumber = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  return {
    title,
    description: description || null,
    category_id: payload.category_id || null,
    organizer_id: payload.organizer_id || null,
    status,
    start_date: normalizeOptionalDate(payload.start_date),
    end_date: normalizeOptionalDate(payload.end_date),
    location: location || null,
    max_attendees: normalizeOptionalNumber(payload.max_attendees),
    image_url: payload.image_url || null,
  };
};
