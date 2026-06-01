# UnityAgentBench

A **neutral, reproducible benchmark** for AI coding-agent *stacks* on real Unity / C# tasks — measuring **cost, turns, tokens, and correctness**, not vibes.

> Working name: `unity-agent-bench`. Alternatives if you want to rename: `GameAgentBench`, `UnityCodeBench`. Pick before first publish; it's load-bearing for the brand.

## Why this exists

Every public coding-agent benchmark (SWE-bench, Terminal-Bench, LiveCodeBench, the Artificial Analysis leaderboard) is general software engineering — overwhelmingly Python GitHub issues. **None cover Unity, C#, or game development.** Meanwhile the Unity-AI tooling market (Unity AI, Coplay/Aura, Code Maestro, Claude Code + MCP servers) is full of superiority claims with no neutral, runnable comparison behind any of them. Even Unity's own numbers are internal.

UnityAgentBench fills that gap: a SWE-bench-style harness for Unity that anyone can re-run.

## What it measures

Per task, per stack, across `n` runs:

- **Cost** (USD, pinned model + pinned pricing date)
- **Assistant turns** (round-trips to complete the task)
- **Tokens** (input / output / cache)
- **Correctness** (compile + Unity Test Framework pass + reference integrity — see `METHODOLOGY.md`)
- **Wall-clock time** (secondary)

## What a "stack" is

A stack = agent/IDE **+** tool augmentation. Examples:

- `claude-code-native` — Claude Code, native Grep/Read/Edit
- `claude-code-parecode` — Claude Code + the parecode MCP server
- `cursor-native`
- `unity-mcp` / `coplay` — editor-bridge stacks *(deferred to v0.2; see `ROADMAP.md`)*

## Neutrality (read this first)

This benchmark is authored by the author of **parecode**, which is one of the stacks under test. That conflict is handled the only way it can be — by **disclosure + reproducibility**, never concealment:

1. Authorship is stated up front, here and in every results post.
2. The full method, task set, and per-run transcripts are public.
3. Anyone can re-run the whole thing and reproduce the numbers.

A benchmark owned by a contestant is only trustworthy if it's verifiable. See `METHODOLOGY.md` for the full disclosure + fairness policy.

## Status

Pre-v0.1. See `ROADMAP.md` for scope and `PROGRESS.md` for the build plan.

## Docs

- `SPEC.md` — architecture, components, metrics, repo layout
- `METHODOLOGY.md` — fairness, reproducibility, scoring, disclosure, threats to validity
- `TASKS.md` — task schema, categories, verification, the v0.1 task set
- `ROADMAP.md` — phased scope
- `CLAUDE.md` — build conventions for agents working in this repo
- `PROGRESS.md` — sequenced build checklist + Claude Code handoff

## License

MIT (code) + CC-BY-4.0 (tasks & results data). Confirm before publish.
