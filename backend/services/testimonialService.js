export const normalizeTestimonialPayload = (payload = {}) => {
  const quote = String(payload.quote || payload.testimonial || "").trim();
  const name = String(payload.name || "").trim();
  const role = String(payload.role || payload.position || "").trim();
  const organization = String(payload.organization || "").trim();
  const email = String(payload.email || "").trim();
  const imageUrl = String(payload.image_url || payload.imageUrl || "").trim();
  const status = String(payload.status || "pending").trim().toLowerCase();

  return {
    name,
    role,
    organization,
    email,
    image_url: imageUrl,
    quote,
    status: ["approved", "pending", "rejected"].includes(status) ? status : "pending",
  };
};
