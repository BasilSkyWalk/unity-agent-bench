import { compileCheck } from "./index.ts";

/** Manual entry point: `tsx verify/compile/cli.ts <unity-project-path>`. */
const projectPath = process.argv[2];
if (!projectPath) {
  console.error("usage: tsx verify/compile/cli.ts <unity-project-path>");
  process.exit(2);
}

const result = compileCheck(projectPath);
console.log(JSON.stringify(result, null, 2));
process.exit(result.ok ? 0 : 1);
