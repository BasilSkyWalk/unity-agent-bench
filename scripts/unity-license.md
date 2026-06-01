# Unity license activation (local + CI)

Batch-mode Unity requires an activated license. This is the single biggest setup
hurdle for the benchmark (SPEC.md §6) — do it before running any `verify/` step.

## Which editor the verifier uses

`verify/compile` resolves the editor binary in this order:

1. `UNITY_EDITOR_PATH` — explicit path to the editor binary (overrides everything).
2. The macOS Unity Hub default for the version pinned in the project's
   `ProjectSettings/ProjectVersion.txt`:
   `/Applications/Unity/Hub/Editor/<version>/Unity.app/Contents/MacOS/Unity`

The v0.1 fixture pins **6000.0.51f1** (Unity 6 LTS).

## Local activation (macOS)

A Personal or Plus/Pro license signed in through **Unity Hub** is sufficient — the
license daemon (`LicensingClient`) serves it to batch-mode invocations
automatically. To verify activation works headlessly:

```sh
UNITY=/Applications/Unity/Hub/Editor/6000.0.51f1/Unity.app/Contents/MacOS/Unity
"$UNITY" -batchmode -quit -nographics -logFile - \
  -projectPath fixtures/sample-game | grep -i licens
```

A working setup logs `Successfully updated license` and exits 0. If you instead see
sign-in / activation prompts, open Unity Hub and sign in once.

For a manual command-line activation (e.g. headless box, no Hub GUI):

```sh
"$UNITY" -batchmode -quit -nographics -logFile - \
  -serial "$UNITY_SERIAL" -username "$UNITY_EMAIL" -password "$UNITY_PASSWORD"
# Return the seat when done:
"$UNITY" -batchmode -quit -nographics -returnlicense \
  -username "$UNITY_EMAIL" -password "$UNITY_PASSWORD"
```

## CI (GameCI)

CI targets [GameCI](https://game.ci). Provide the license via the standard secrets
and let `game-ci/unity-test-runner` / `unity-builder` handle activation:

- `UNITY_LICENSE` — contents of the `.ulf` activation file (Personal), or
- `UNITY_SERIAL` + `UNITY_EMAIL` + `UNITY_PASSWORD` (Plus/Pro).

Point the verifier at the editor GameCI provides via `UNITY_EDITOR_PATH`.
