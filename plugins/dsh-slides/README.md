# dsh-slides

Slide-deck generation plugin for DeepSeek Harness: gives the model a `slides_generate` tool that turns a markdown outline into a self-contained [reveal.js](https://revealjs.com/) HTML deck inside the active workspace. Host-only — no client bundle; the deck opens in any browser (press `F` for fullscreen, arrow keys to navigate).

> Status: **example / reference skeleton** from [awesome-deepseek-harness](../../). Structure follows observed community plugin conventions (see [`plugins/README.md`](../README.md)); not yet verified against a live DSH instance.

## Install

```sh
pnpm install && pnpm build
dsh plugin --profile <name> add file:/absolute/path/to/plugins/dsh-slides
```

Then restart that profile.

## Tool: `slides_generate`

| Parameter | Type | Notes |
| --- | --- | --- |
| `title` | string | deck title, also drives the default file name |
| `markdown` | string | deck content; `---` on its own line = new slide, `--` = vertical sub-slide |
| `theme` | string | optional reveal.js theme (`black`, `white`, `league`, `sky`, `moon`, ...) |
| `filename` | string | optional, relative to the slides directory; workspace-confined |

Returns `{ path, slideCount, theme }`. Writes are confined to the active workspace root.

## Configuration

```yaml
- id: dsh-slides
  name: dsh-slides
  config:
    outputDir: artifacts/slides
    revealBase: https://cdn.jsdelivr.net/npm/reveal.js@5
    theme: white
```

## Model experience

| Aspect | Effect |
| --- | --- |
| Tool calls | One new tool: `slides_generate`. |
| Prompt | No system-prompt section; the tool description carries the outline format. |
| Side effects | Writes HTML files under `<workspace>/<outputDir>/` only. |
