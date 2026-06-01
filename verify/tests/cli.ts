import { runTests, type TestPlatform } from "./index.ts";

/** Manual entry point: `tsx verify/tests/cli.ts <unity-project-path> [EditMode|PlayMode]`. */
const projectPath = process.argv[2];
if (!projectPath) {
  console.error("usage: tsx verify/tests/cli.ts <unity-project-path> [EditMode|PlayMode]");
  process.exit(2);
}
const testPlatform = (process.argv[3] as TestPlatform | undefined) ?? "EditMode";

const result = runTests(projectPath, { testPlatform });
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 1);
