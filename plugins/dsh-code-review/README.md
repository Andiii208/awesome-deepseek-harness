# dsh-code-review

Code review assistant plugin for DeepSeek Harness. Two halves:

- **Tool `code_review_context`** — deterministically collects the change set from the workspace git repo (`worktree` / `staged` / `range` scopes): name-status, `--stat`, and bounded patch text. Read-only, no shell interpolation, diff size capped.
- **Skill `code-review`** (`skills/code-review/SKILL.md`) — the review methodology: fix the diff snapshot first, then a severity-ordered correctness → security → tests → maintainability checklist with an actionable output format.

> Status: **example / reference skeleton** from [awesome-deepseek-harness](../../). Structure follows observed community plugin conventions (see [`plugins/README.md`](../README.md)); not yet verified against a live DSH instance.

## Install

```sh
pnpm install && pnpm build
dsh plugin --profile <name> add file:/absolute/path/to/plugins/dsh-code-review
```

Then restart that profile.

## Tool: `code_review_context`

| Parameter | Type | Notes |
| --- | --- | --- |
| `scope` | string | `worktree` (uncommitted vs HEAD) \| `staged` (index vs HEAD) \| `range` |
| `range` | string | required for `range` scope, e.g. `main..HEAD`; plain revisions only (flags rejected) |
| `paths` | json | optional path filters (passed after `--`) |

Returns `{ scope, filesChanged, stat, diff, truncated }`. Diffs larger than `maxDiffBytes` are truncated with an explicit marker so the model re-collects per directory instead of guessing.

## Configuration

```yaml
- id: dsh-code-review
  name: dsh-code-review
  config:
    maxDiffBytes: 120000
```

## Model experience

| Aspect | Effect |
| --- | --- |
| Tool calls | One new read-only tool: `code_review_context`. |
| Prompt | No system-prompt section; methodology ships as a skill. |
| Side effects | None — runs `git diff` only, never mutates the repository. |
