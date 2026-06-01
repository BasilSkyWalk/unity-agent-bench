import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

import { parseNUnitResults, runTests } from "./index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const fixtureProject = join(here, "..", "..", "fixtures", "sample-game");

const PASSING_XML = `<?xml version="1.0" encoding="utf-8"?>
<test-run id="2" total="1" passed="1" failed="0" inconclusive="0" skipped="0" result="Passed">
  <test-suite type="TestSuite" name="SampleGame.Tests.EditMode">
    <test-case name="Health_resets_to_max" fullname="SampleGame.Tests.EditMode.SmokeTests.Health_resets_to_max" result="Passed" duration="0.012345" />
  </test-suite>
</test-run>`;

const FAILING_XML = `<?xml version="1.0" encoding="utf-8"?>
<test-run id="2" total="1" passed="0" failed="1" inconclusive="0" skipped="0" result="Failed">
  <test-suite type="TestSuite" name="SampleGame.Tests.EditMode">
    <test-case name="Health_resets_to_max" fullname="SampleGame.Tests.EditMode.SmokeTests.Health_resets_to_max" result="Failed" duration="0.01">
      <failure><message>Expected 100 but was 70</message></failure>
    </test-case>
  </test-suite>
</test-run>`;

test("parseNUnitResults: passing run", () => {
  const r = parseNUnitResults(PASSING_XML);
  assert.equal(r.total, 1);
  assert.equal(r.passed, 1);
  assert.equal(r.failed, 0);
  assert.equal(r.result, "Passed");
  assert.equal(r.cases.length, 1);
  assert.equal(r.cases[0]?.name, "Health_resets_to_max");
  assert.equal(r.cases[0]?.durationMs, 12);
});

test("parseNUnitResults: failing run", () => {
  const r = parseNUnitResults(FAILING_XML);
  assert.equal(r.failed, 1);
  assert.equal(r.result, "Failed");
  assert.equal(r.cases[0]?.result, "Failed");
});

test("parseNUnitResults: missing xml is treated as no tests run", () => {
  const r = parseNUnitResults("");
  assert.equal(r.total, 0);
  assert.equal(r.cases.length, 0);
});

// Real-Unity integration check (A4 acceptance). Opt-in: `UAB_RUN_UNITY=1 npm test`.
test(
  "runTests: EditMode smoke test passes on fixture",
  { skip: process.env.UAB_RUN_UNITY !== "1" },
  () => {
    const result = runTests(fixtureProject, { testPlatform: "EditMode" });
    assert.equal(result.ok, true, `expected green tests, got: ${JSON.stringify(result.cases)}`);
    assert.ok(result.total >= 1);
    assert.equal(result.failed, 0);
  },
);
