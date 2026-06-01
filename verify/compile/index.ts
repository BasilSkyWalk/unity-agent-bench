import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { resolveUnityEditor } from "../unity.ts";

/**
 * Compile-check verifier (SPEC.md §6). Runs Unity batch-mode import on a project
 * path and reports pass/fail plus parsed C# compiler errors. Stack-agnostic and
 * offline: it shells out to a locally installed Unity editor, nothing networked.
 */

export interface CompileError {
  file: string;
  line: number;
  column: number;
  code: string;
  message: string;
}

export interface CompileResult {
  /** True only if Unity exited 0 and no compiler errors were parsed. */
  ok: boolean;
  errors: CompileError[];
  unityExitCode: number;
  unityEditorPath: string;
  logPath: string;
  durationMs: number;
}

export interface CompileOptions {
  /** Override the resolved editor binary (else derived from ProjectVersion.txt). */
  unityEditorPath?: string;
  /** Hard timeout for the Unity process. Default 10 minutes. */
  timeoutMs?: number;
}

// e.g. "Assets/Scripts/Combat/Health.cs(12,9): error CS1002: ; expected"
const COMPILER_ERROR_RE = /^(.*?)\((\d+),(\d+)\):\s+error\s+(CS\d+):\s+(.*?)\s*$/;

/**
 * Parse Unity/MSBuild-style C# compiler errors out of an editor log. Pure and
 * deterministic; Unity logs each error multiple times, so duplicates are collapsed.
 */
export function parseCompileErrors(log: string): CompileError[] {
  const seen = new Set<string>();
  const errors: CompileError[] = [];
  for (const line of log.split(/\r?\n/)) {
    const m = COMPILER_ERROR_RE.exec(line.trim());
    if (!m) continue;
    const [, file, lineNo, column, code, message] = m;
    const key = `${file}|${lineNo}|${column}|${code}|${message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    errors.push({
      file: file ?? "",
      line: Number(lineNo),
      column: Number(column),
      code: code ?? "",
      message: message ?? "",
    });
  }
  return errors;
}

/** Run a batch-mode compile on the given Unity project path. */
export function compileCheck(projectPath: string, options: CompileOptions = {}): CompileResult {
  const unityEditorPath = options.unityEditorPath ?? resolveUnityEditor(projectPath);
  const logPath = join(mkdtempSync(join(tmpdir(), "uab-compile-")), "unity.log");

  const start = Date.now();
  const proc = spawnSync(
    unityEditorPath,
    ["-batchmode", "-quit", "-nographics", "-logFile", logPath, "-projectPath", projectPath],
    { timeout: options.timeoutMs ?? 600_000, encoding: "utf8" },
  );
  const durationMs = Date.now() - start;

  const log = readFileSync(logPath, "utf8");
  const errors = parseCompileErrors(log);

  return {
    ok: errors.length === 0 && proc.status === 0,
    errors,
    unityExitCode: proc.status ?? -1,
    unityEditorPath,
    logPath,
    durationMs,
  };
}
