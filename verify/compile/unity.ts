import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Resolving the Unity editor binary is shared verification infrastructure. It is
 * deliberately stack-agnostic and never imports from adapters/ (see CLAUDE.md).
 */

/** Read the pinned editor version from a Unity project's ProjectVersion.txt. */
export function readProjectEditorVersion(projectPath: string): string {
  const file = join(projectPath, "ProjectSettings", "ProjectVersion.txt");
  const text = readFileSync(file, "utf8");
  const match = text.match(/m_EditorVersion:\s*(\S+)/);
  if (!match || !match[1]) {
    throw new Error(`Could not read m_EditorVersion from ${file}`);
  }
  return match[1];
}

/**
 * Locate the Unity editor binary for a project. Precedence:
 *   1. UNITY_EDITOR_PATH env (explicit override; also how CI / GameCI points at its editor)
 *   2. macOS Unity Hub default install for the project's pinned version
 * Throws an actionable error if neither resolves.
 */
export function resolveUnityEditor(projectPath: string): string {
  const override = process.env.UNITY_EDITOR_PATH;
  if (override) {
    if (!existsSync(override)) {
      throw new Error(`UNITY_EDITOR_PATH is set but does not exist: ${override}`);
    }
    return override;
  }

  const version = readProjectEditorVersion(projectPath);
  const macHubPath = `/Applications/Unity/Hub/Editor/${version}/Unity.app/Contents/MacOS/Unity`;
  if (existsSync(macHubPath)) {
    return macHubPath;
  }

  throw new Error(
    `Unity ${version} not found at ${macHubPath}. ` +
      `Install it via Unity Hub, or set UNITY_EDITOR_PATH to the editor binary. ` +
      `See scripts/unity-license.md.`,
  );
}
