import { parseISO, addDays, format } from "date-fns";

export const generateTimetableSessions = ({
  durationWeeks,
  sessionsPerWeek,
  startDate,
  daysOfWeek,
  startTime,
  endTime,
}) => {
  const totalSessions = Math.max(1, Number(durationWeeks || 0) * Math.max(1, Number(sessionsPerWeek || 1)));
  const dayNames = Array.isArray(daysOfWeek) && daysOfWeek.length ? daysOfWeek : ["Monday"];
  const start = parseISO(startDate);

  const sessions = [];
  for (let index = 0; index < totalSessions; index += 1) {
    const dayIndex = index % dayNames.length;
    const sessionDate = addDays(start, Math.floor(index / dayNames.length));
    sessions.push({
      sessionNumber: index + 1,
      startDate: format(sessionDate, "yyyy-MM-dd"),
      endDate: format(sessionDate, "yyyy-MM-dd"),
      startTime,
      endTime,
      dayOfWeek: dayNames[dayIndex],
      title: `Session ${index + 1}`,
    });
  }

  return sessions;
};
