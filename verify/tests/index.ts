import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { resolveUnityEditor } from "../unity.ts";

/**
 * Test-runner verifier (SPEC.md §6). Runs Unity Test Framework tests in batch mode
 * and parses the NUnit3 XML result into pass/fail. Stack-agnostic and offline.
 */

export type TestPlatform = "EditMode" | "PlayMode";

export interface TestCaseResult {
  name: string;
  fullName: string;
  result: string; // NUnit: Passed | Failed | Skipped | Inconclusive
  durationMs?: number;
}

export interface ParsedRun {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  inconclusive: number;
  result: string; // run-level NUnit result
  cases: TestCaseResult[];
}

export interface TestRunResult extends ParsedRun {
  /** True only if results XML was produced, at least one test ran, and none failed. */
  ok: boolean;
  resultsXmlPath: string;
  logPath: string;
  unityExitCode: number;
  durationMs: number;
}

export interface TestRunOptions {
  testPlatform?: TestPlatform;
  /** UTF -testFilter entries (test/fixture full names); omit to run all. */
  testFilter?: string[];
  unityEditorPath?: string;
  timeoutMs?: number;
}

function attr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\b${name}="([^"]*)"`));
  return m?.[1];
}

/** Parse NUnit3 XML (UTF output) into run totals and per-case results. Pure. */
export function parseNUnitResults(xml: string): ParsedRun {
  const runTag = xml.match(/<test-run\b[^>]*>/)?.[0] ?? "";
  const cases: TestCaseResult[] = [];
  const caseRe = /<test-case\b[^>]*>/g;
  let m: RegExpExecArray | null;
  while ((m = caseRe.exec(xml)) !== null) {
    const tag = m[0];
    const duration = attr(tag, "duration");
    cases.push({
      name: attr(tag, "name") ?? "",
      fullName: attr(tag, "fullname") ?? "",
      result: attr(tag, "result") ?? "",
      durationMs: duration ? Math.round(Number(duration) * 1000) : undefined,
    });
  }
  return {
    total: Number(attr(runTag, "total") ?? 0),
    passed: Number(attr(runTag, "passed") ?? 0),
    failed: Number(attr(runTag, "failed") ?? 0),
    skipped: Number(attr(runTag, "skipped") ?? 0),
    inconclusive: Number(attr(runTag, "inconclusive") ?? 0),
    result: attr(runTag, "result") ?? "",
    cases,
  };
}

/** Run Unity Test Framework tests in batch mode and return parsed results. */
export function runTests(projectPath: string, options: TestRunOptions = {}): TestRunResult {
  const unityEditorPath = options.unityEditorPath ?? resolveUnityEditor(projectPath);
  const dir = mkdtempSync(join(tmpdir(), "uab-tests-"));
  const resultsXmlPath = join(dir, "results.xml");
  const logPath = join(dir, "unity.log");

  const args = [
    "-batchmode",
    "-runTests",
    "-nographics",
    "-testPlatform",
    options.testPlatform ?? "EditMode",
    "-testResults",
    resultsXmlPath,
    "-projectPath",
    projectPath,
    "-logFile",
    logPath,
  ];
  // -runTests must NOT be combined with -quit; UTF controls process exit.
  if (options.testFilter && options.testFilter.length > 0) {
    args.push("-testFilter", options.testFilter.join(";"));
  }

  const start = Date.now();
  const proc = spawnSync(unityEditorPath, args, {
    timeout: options.timeoutMs ?? 600_000,
    encoding: "utf8",
  });
  const durationMs = Date.now() - start;

  const xmlExists = existsSync(resultsXmlPath);
  const parsed = parseNUnitResults(xmlExists ? readFileSync(resultsXmlPath, "utf8") : "");

  return {
    ...parsed,
    ok: xmlExists && parsed.total > 0 && parsed.failed === 0,
    resultsXmlPath,
    logPath,
    unityExitCode: proc.status ?? -1,
    durationMs,
  };
}
