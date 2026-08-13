# dsh-viz

Visualization plugin for DeepSeek Harness: gives the model a `chart_render` tool that turns structured data into a self-contained [ECharts](https://echarts.apache.org/) HTML artifact inside the active workspace. Host-only — no client bundle; the artifact opens in any browser or file preview.

> Status: **example / reference skeleton** from [awesome-deepseek-harness](../../). Structure follows observed community plugin conventions (see [`plugins/README.md`](../README.md)); not yet verified against a live DSH instance.

## Install

```sh
pnpm install && pnpm build
dsh plugin --profile <name> add file:/absolute/path/to/plugins/dsh-viz
```

Then restart that profile.

## Tool: `chart_render`

| Parameter | Type | Notes |
| --- | --- | --- |
| `title` | string | chart title, also drives the default file name |
| `chart_type` | string | `line` \| `bar` \| `pie` \| `scatter` |
| `categories` | json | x-axis labels for line/bar |
| `series` | json | `[{ name?, data }]`; pie data items are `{ name, value }`, scatter items are `[x, y]` |
| `filename` | string | optional, relative to the chart directory; workspace-confined |

Returns `{ path, chartType, seriesCount }`. Writes are confined to the active workspace root (path-traversal is rejected).

## Configuration

Tunables live on the plugin row in your profile patch:

```yaml
- id: dsh-viz
  name: dsh-viz
  config:
    outputDir: artifacts/charts   # where charts land, relative to the workspace root
    echartsSrc: https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js
```

## Model experience

| Aspect | Effect |
| --- | --- |
| Tool calls | One new tool: `chart_render`. |
| Prompt | No system-prompt section; the tool description carries the usage contract. |
| Side effects | Writes HTML files under `<workspace>/<outputDir>/` only. |
