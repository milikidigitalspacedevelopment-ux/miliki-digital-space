export const formatDate = (
  date,
  locale = "en-GB"
) => {

  if (!date) return "-";

  return new Date(date).toLocaleDateString(
    locale,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
};


export const formatDateTime = (
  date,
  locale = "en-GB"
) => {

  if (!date) return "-";

  return new Date(date).toLocaleString(
    locale,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  );
};


export const timeAgo = (date) => {

  const now = Date.now();

  const seconds =
    Math.floor(
      (now - new Date(date)) / 1000
    );

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60)
    return `${minutes} min ago`;

  const hours =
    Math.floor(minutes / 60);

  if (hours < 24)
    return `${hours} hrs ago`;

  const days =
    Math.floor(hours / 24);

  return `${days} days ago`;
};