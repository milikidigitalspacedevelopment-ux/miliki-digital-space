export const normalizeDonorPayload = (payload = {}) => {
  const trimmedName = typeof payload.name === "string" ? payload.name.trim() : "";
  const trimmedEmail = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const trimmedPhone = typeof payload.phone === "string" && payload.phone.trim() ? payload.phone.trim() : null;
  const trimmedBio = typeof payload.bio === "string" && payload.bio.trim() ? payload.bio.trim() : null;
  const trimmedAvatar = typeof payload.avatar_url === "string" && payload.avatar_url.trim() ? payload.avatar_url.trim() : null;

  return {
    name: trimmedName,
    email: trimmedEmail,
    phone: trimmedPhone,
    bio: trimmedBio,
    avatar_url: trimmedAvatar,
    is_active: payload.is_active === true || payload.is_active === "true" || payload.is_active === 1,
    is_verified: payload.is_verified === true || payload.is_verified === "true" || payload.is_verified === 1,
    password: payload.password || undefined,
  };
};

export const normalizeDonorRow = (row = {}) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  bio: row.bio,
  avatar_url: row.avatar_url,
  role: row.role || "donor",
  is_verified: row.is_verified,
  is_active: row.is_active,
  created_at: row.created_at,
  updated_at: row.updated_at,
});
