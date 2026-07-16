import test from "node:test";
import assert from "node:assert/strict";
import { buildRecipientBatches } from "../services/communicationsService.js";

test("buildRecipientBatches chunks recipients into groups of ten", () => {
  const recipients = Array.from({ length: 25 }, (_, index) => `user${index}@example.com`);

  const batches = buildRecipientBatches(recipients, 10);

  assert.equal(batches.length, 3);
  assert.deepEqual(batches[0], recipients.slice(0, 10));
  assert.deepEqual(batches[1], recipients.slice(10, 20));
  assert.deepEqual(batches[2], recipients.slice(20, 25));
});

test("buildRecipientBatches returns one batch for empty input", () => {
  assert.deepEqual(buildRecipientBatches([], 10), []);
});
