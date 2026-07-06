import assert from "node:assert/strict";
import test from "node:test";
import { normalizeEventPayload } from "../utils/eventUtils.js";

test("normalizeEventPayload maps form values into database-safe fields", () => {
  const payload = normalizeEventPayload({
    title: "  Community Camp  ",
    description: "  A welcoming event ",
    location: "Kisumu",
    status: "published",
    start_date: "2026-08-15",
    end_date: "2026-08-16",
    max_attendees: "50",
    image_url: "https://example.com/event.png",
  });

  assert.equal(payload.title, "Community Camp");
  assert.equal(payload.description, "A welcoming event");
  assert.equal(payload.location, "Kisumu");
  assert.equal(payload.status, "published");
  assert.equal(payload.start_date, "2026-08-15");
  assert.equal(payload.end_date, "2026-08-16");
  assert.equal(payload.max_attendees, 50);
  assert.equal(payload.image_url, "https://example.com/event.png");
});

test("normalizeEventPayload defaults empty values to null", () => {
  const payload = normalizeEventPayload({
    title: "",
    location: "   ",
    max_attendees: "",
  });

  assert.equal(payload.title, "");
  assert.equal(payload.location, null);
  assert.equal(payload.max_attendees, null);
  assert.equal(payload.status, "draft");
});
