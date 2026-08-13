/**
 * dsh-viz host plugin: registers the `chart_render` tool, which turns
 * structured data into a self-contained ECharts HTML artifact inside the
 * active workspace. Host-only — no client bundle (the artifact opens in
 * any browser or in a workspace file preview).
 *
 * Entry contract follows the community DSH plugin convention:
 * exports `name`, `inject`, `Config` (schemastery) and `apply(ctx, config)`.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, resolve, sep } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

/** Cordis plugin name (the Loader entry id). */
export const name = 'dsh-viz'

/** Services required before load. */
export const inject = ['tools']

/** Deployment configuration. */
export interface Config {
  /** Directory (relative to the workspace root) where charts are written. */
  outputDir: string
  /** Script tag source for the ECharts runtime embedded in each artifact. */
  echartsSrc: string
}

/** Configuration schema: `Config({})` yields the defaults (Loader behavior). */
export const Config = z.object({
  outputDir: z.string().default('artifacts/charts'),
  echartsSrc: z.string().default('https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js'),
})

/** Minimal structural view of the `agents` service (current session cwd). */
interface AgentsLike {
  currentInitiator(): { session: { header: { cwd: string } } } | undefined
}

/** Resolve the active workspace root, failing closed without a session. */
function workspaceRoot(ctx: Context): string {
  const agents = ctx.get('agents') as AgentsLike | undefined
  const cwd = agents?.currentInitiator()?.session.header.cwd
  if (cwd === undefined || cwd === '') {
    throw new Error('chart_render requires an active session with a workspace; none was found')
  }
  return cwd
}

type SeriesInput = { name?: string; data: unknown[] }

/** Build an ECharts option object from the tool arguments. */
function buildOption(args: {
  title: string
  chart_type: string
  categories?: unknown
  series: unknown
}): Record<string, unknown> {
  const kind = args.chart_type
  if (!['line', 'bar', 'pie', 'scatter'].includes(kind)) {
    throw new Error(`unsupported chart_type "${kind}"; use one of: line, bar, pie, scatter`)
  }
  const rawSeries = Array.isArray(args.series) ? args.series as SeriesInput[] : []
  if (rawSeries.length === 0) {
    throw new Error('series must be a non-empty array of { name?, data } objects')
  }
  const option: Record<string, unknown> = {
    title: { text: args.title },
    tooltip: { trigger: kind === 'pie' ? 'item' : 'axis' },
    legend: {},
    series: rawSeries.map(s => ({ name: s.name, type: kind, data: s.data })),
  }
  if (kind !== 'pie') {
    const categories = Array.isArray(args.categories) ? args.categories : undefined
    option.xAxis = kind === 'scatter'
      ? { type: 'value' }
      : { type: 'category', data: categories ?? [] }
    option.yAxis = { type: 'value' }
  }
  return option
}

/** Render the self-contained HTML artifact around a serialized option. */
function chartHtml(title: string, option: Record<string, unknown>, echartsSrc: string): string {
  // </script> inside the JSON payload would terminate the tag early.
  const payload = JSON.stringify(option, null, 2).replaceAll('</script>', '<\\/script>')
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<title>${title.replaceAll('<', '&lt;')}</title>`,
    `<script src="${echartsSrc}"></script>`,
    '<style>html,body,#chart{margin:0;width:100%;height:100%;min-height:480px}</style>',
    '</head>',
    '<body>',
    '<div id="chart"></div>',
    '<script>',
    `const option = ${payload};`,
    "const chart = echarts.init(document.getElementById('chart'));",
    'chart.setOption(option);',
    "window.addEventListener('resize', () => chart.resize());",
    '</script>',
    '</body>',
    '</html>',
    '',
  ].join('\n')
}

/**
 * Mount the `chart_render` tool.
 * @param ctx - host cordis context.
 * @param config - validated plugin configuration (schema defaults applied).
 */
export function apply(ctx: Context, config?: Config): void {
  const resolved = Config(config ?? {})

  ctx.tools.register(defineTool({
    name: 'chart_render',
    description:
      'Render a chart from structured data into a self-contained HTML file inside the current workspace, '
      + 'and tell the user where it landed. Use it whenever the user asks to visualize data, compare series, '
      + 'or "make a chart" — do NOT hand-write chart HTML yourself. Supports line, bar, pie and scatter. '
      + 'Fails when there is no active workspace session, when chart_type is unsupported, or when series is empty.',
    parameters: {
      title: {
        type: 'string',
        required: true,
        description: 'Chart title, also used to derive the default file name.',
      },
      chart_type: {
        type: 'string',
        required: true,
        description: 'One of: line, bar, pie, scatter.',
      },
      categories: {
        type: 'json',
        required: false,
        description: 'X-axis category labels (array of strings) for line/bar charts; omit for pie and scatter.',
      },
      series: {
        type: 'json',
        required: true,
        description:
          'Array of { name?: string, data: array } series. For pie, data items are { name, value }. '
          + 'For scatter, data items are [x, y] pairs. For line/bar, data items are numbers aligned with categories.',
      },
      filename: {
        type: 'string',
        required: false,
        description: 'Output file name relative to the configured chart directory; defaults to a slug of the title. Must stay inside the workspace.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          path: { type: 'string', required: true },
          chartType: { type: 'string', required: true },
          seriesCount: { type: 'integer', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `Chart (${value.chartType}, ${value.seriesCount} series) written to ${value.path}`,
      }],
    },
    async execute(args) {
      const root = workspaceRoot(ctx)
      const option = buildOption(args as Parameters<typeof buildOption>[0])
      const title = String(args.title)
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'chart'
      const fileArg = typeof args.filename === 'string' && args.filename !== '' ? args.filename : `${slug}.html`
      if (isAbsolute(fileArg)) {
        throw new Error('filename must be relative to the chart output directory, not absolute')
      }
      const outPath = resolve(join(root, resolved.outputDir, fileArg))
      if (outPath !== root && !outPath.startsWith(root + sep)) {
        throw new Error('refusing to write outside the active workspace root')
      }
      mkdirSync(resolve(outPath, '..'), { recursive: true })
      writeFileSync(outPath, chartHtml(title, option, resolved.echartsSrc), 'utf8')
      const seriesCount = Array.isArray(args.series) ? args.series.length : 0
      return { path: outPath, chartType: String(args.chart_type), seriesCount }
    },
  }))
}
