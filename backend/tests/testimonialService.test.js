import assert from "node:assert/strict";
import test from "node:test";
import { normalizeTestimonialPayload } from "../services/testimonialService.js";

test("normalizeTestimonialPayload keeps an uploaded image URL", () => {
  const payload = normalizeTestimonialPayload({
    quote: "  Miliki changed my life  ",
    name: "Amina",
    image_url: "https://example.com/testimonial.jpg",
  });

  assert.equal(payload.quote, "Miliki changed my life");
  assert.equal(payload.image_url, "https://example.com/testimonial.jpg");
});

test("normalizeTestimonialPayload falls back to pending status", () => {
  const payload = normalizeTestimonialPayload({ quote: "Great experience" });

  assert.equal(payload.status, "pending");
  assert.equal(payload.image_url, "");
});
