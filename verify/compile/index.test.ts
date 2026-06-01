import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

import { parseCompileErrors, compileCheck } from "./index.ts";

const here = dirname(fileURLToPath(import.meta.url));
const fixtureProject = join(here, "..", "..", "fixtures", "sample-game");

test("parseCompileErrors: clean log yields no errors", () => {
  const log = [
    "Refreshing native plugins compatible for Editor in 0.00 ms",
    "- Finished compile Library/ScriptAssemblies/SampleGame.dll",
    "Exiting batchmode successfully now!",
  ].join("\n");
  assert.deepEqual(parseCompileErrors(log), []);
});

test("parseCompileErrors: parses and dedupes compiler errors", () => {
  // Unity emits each error several times; the parser must collapse duplicates.
  const log = [
    "Assets/Scripts/Combat/Health.cs(12,9): error CS1002: ; expected",
    "Assets/Scripts/Combat/Health.cs(12,9): error CS1002: ; expected",
    "Assets/Scripts/Inventory/Item.cs(3,5): error CS0246: type or namespace not found",
    "some unrelated line",
  ].join("\n");

  const errors = parseCompileErrors(log);
  assert.equal(errors.length, 2);
  assert.deepEqual(errors[0], {
    file: "Assets/Scripts/Combat/Health.cs",
    line: 12,
    column: 9,
    code: "CS1002",
    message: "; expected",
  });
  assert.equal(errors[1]?.code, "CS0246");
});

// Real-Unity integration check (A3 acceptance). Heavy + needs a licensed editor,
// so it is opt-in: run with `UAB_RUN_UNITY=1 npm test`.
test(
  "compileCheck: clean fixture compiles green",
  { skip: process.env.UAB_RUN_UNITY !== "1" },
  () => {
    const result = compileCheck(fixtureProject);
    assert.equal(result.ok, true, `expected clean compile, got errors: ${JSON.stringify(result.errors)}`);
    assert.deepEqual(result.errors, []);
  },
);
