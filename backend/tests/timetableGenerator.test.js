import test from "node:test";
import assert from "node:assert/strict";
import { generateTimetableSessions } from "../utils/timetableGenerator.js";

test("generateTimetableSessions creates weekly sessions from course duration and admin settings", () => {
  const sessions = generateTimetableSessions({
    durationWeeks: 4,
    sessionsPerWeek: 2,
    startDate: "2026-07-06",
    daysOfWeek: ["Monday", "Wednesday"],
    startTime: "09:00",
    endTime: "10:00",
  });

  assert.equal(sessions.length, 8);
  assert.deepEqual(sessions[0], {
    sessionNumber: 1,
    startDate: "2026-07-06",
    endDate: "2026-07-06",
    startTime: "09:00",
    endTime: "10:00",
    dayOfWeek: "Monday",
    title: "Session 1",
  });
  assert.equal(sessions[7].startDate, "2026-07-29");
  assert.equal(sessions[7].dayOfWeek, "Wednesday");
});
