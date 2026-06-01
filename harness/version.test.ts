import { test } from "node:test";
import assert from "node:assert/strict";

import { BENCH_VERSION } from "./version.ts";

test("scaffold builds and tests run", () => {
  assert.equal(BENCH_VERSION, "0.1.0");
});
