export const normalizeVolunteerPayload = (payload = {}) => {
  const trimmedName = typeof payload.name === "string" ? payload.name.trim() : "";
  const trimmedEmail = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const trimmedPhone = typeof payload.phone === "string" && payload.phone.trim() ? payload.phone.trim() : null;
  const trimmedBio = typeof payload.bio === "string" && payload.bio.trim() ? payload.bio.trim() : null;
  const trimmedAvatar = typeof payload.avatar_url === "string" && payload.avatar_url.trim() ? payload.avatar_url.trim() : null;
  const trimmedSkills = typeof payload.skills === "string" && payload.skills.trim() ? payload.skills.trim() : null;
  const trimmedAvailability = typeof payload.availability === "string" && payload.availability.trim() ? payload.availability.trim() : null;

  return {
    name: trimmedName,
    email: trimmedEmail,
    phone: trimmedPhone,
    bio: trimmedBio,
    avatar_url: trimmedAvatar,
    skills: trimmedSkills,
    availability: trimmedAvailability,
    status: payload.status || "pending",
    is_active: payload.is_active === true || payload.is_active === "true" || payload.is_active === 1,
  };
};

export const normalizeVolunteerRow = (row = {}) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  bio: row.bio,
  avatar_url: row.avatar_url,
  skills: row.skills,
  availability: row.availability,
  status: row.status || "pending",
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at,
});
