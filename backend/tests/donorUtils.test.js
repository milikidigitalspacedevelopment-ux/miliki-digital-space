import assert from "node:assert/strict";
import test from "node:test";
import { normalizeDonorPayload, normalizeDonorRow } from "../utils/donorUtils.js";

test("normalizeDonorRow maps database values to the admin-friendly donor shape", () => {
  const row = {
    id: "123",
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "0722000000",
    bio: "Community champion",
    avatar_url: "https://example.com/avatar.png",
    role: "donor",
    is_verified: true,
    is_active: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  };

  const donor = normalizeDonorRow(row);

  assert.equal(donor.id, "123");
  assert.equal(donor.name, "Jane Doe");
  assert.equal(donor.role, "donor");
  assert.equal(donor.is_verified, true);
  assert.equal(donor.avatar_url, "https://example.com/avatar.png");
});

test("normalizeDonorPayload trims values and defaults booleans", () => {
  const payload = normalizeDonorPayload({
    name: "  Jane  ",
    email: "  JANE@example.com ",
    phone: "   ",
    bio: "  ",
    avatar_url: "   ",
    is_active: "false",
    is_verified: "true",
  });

  assert.equal(payload.name, "Jane");
  assert.equal(payload.email, "jane@example.com");
  assert.equal(payload.phone, null);
  assert.equal(payload.bio, null);
  assert.equal(payload.avatar_url, null);
  assert.equal(payload.is_active, false);
  assert.equal(payload.is_verified, true);
});
