export const normalizeStoryPayload = (payload = {}) => {
  const title = typeof payload.title === "string" ? payload.title.trim() : "";
  const content = typeof payload.content === "string" ? payload.content.trim() : "";
  const status = payload.status || "draft";

  return {
    title,
    content: content || null,
    author_id: payload.author_id || null,
    category_id: payload.category_id || null,
    image_url: payload.image_url || null,
    status,
    published_at: payload.published_at || null,
  };
};
