# dsh-research-loop

Auto-research loop plugin for DeepSeek Harness. Two halves:

- **Tool `research_log`** — durable research memory: an append-only JSONL log per topic (`.dsh-research/<topic>.jsonl` in the workspace) with `append` / `read` actions. Entries carry a phase (`plan | search | read | synthesize | conclude`), a self-contained note, and source URLs — so multi-step research survives context compaction and session restarts.
- **Skill `auto-research-loop`** (`skills/auto-research-loop/SKILL.md`) — the loop discipline: bounded plan → search → read → synthesize iterations, source-quality ordering, conflict recording, explicit stop conditions (evidence coverage / diminishing returns / iteration cap), resume-from-log.

> Status: **example / reference skeleton** from [awesome-deepseek-harness](../../). Structure follows observed community plugin conventions (see [`plugins/README.md`](../README.md)); not yet verified against a live DSH instance. Search/fetch tools themselves are assumed to come from the harness or other plugins — this plugin deliberately only contributes the durable-state + methodology layer.

## Install

```sh
pnpm install && pnpm build
dsh plugin --profile <name> add file:/absolute/path/to/plugins/dsh-research-loop
```

Then restart that profile.

## Tool: `research_log`

| Parameter | Type | Notes |
| --- | --- | --- |
| `action` | string | `append` \| `read` |
| `topic` | string | stable topic label; slugged into one log file per topic |
| `phase` | string | append only: `plan` \| `search` \| `read` \| `synthesize` \| `conclude` |
| `note` | string | append only: compact, self-contained finding/decision |
| `sources` | json | append only: array of source URLs the note rests on |

`read` returns the newest `maxReadEntries` entries (oldest first) plus the total count. The tool never rewrites or deletes log lines.

## Configuration

```yaml
- id: dsh-research-loop
  name: dsh-research-loop
  config:
    logDir: .dsh-research
    maxReadEntries: 200
```

## Model experience

| Aspect | Effect |
| --- | --- |
| Tool calls | One new tool: `research_log`. |
| Prompt | No system-prompt section; methodology ships as a skill. |
| Side effects | Appends JSONL files under `<workspace>/<logDir>/` only. |
