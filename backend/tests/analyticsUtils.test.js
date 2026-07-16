import assert from "node:assert/strict";
import test from "node:test";
import { buildImpactStats } from "../utils/analyticsUtils.js";

test("buildImpactStats returns safe defaults when database queries fail", async () => {
  const queryFn = async () => {
    throw new Error("db unavailable");
  };

  const data = await buildImpactStats(queryFn);

  assert.deepEqual(data.stats, {
    years: 1,
    communities: 0,
    graduates: 0,
    livesImpacted: 0,
    jobsCreated: 0,
  });
  assert.deepEqual(data.growthOverTime, []);
});
