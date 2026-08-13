/**
 * dsh-slides host plugin: registers the `slides_generate` tool, which turns
 * a markdown outline into a self-contained reveal.js HTML deck inside the
 * active workspace. Host-only — no client bundle; the deck opens in any
 * browser or workspace file preview.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { isAbsolute, join, resolve, sep } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

/** Cordis plugin name (the Loader entry id). */
export const name = 'dsh-slides'

/** Services required before load. */
export const inject = ['tools']

/** Deployment configuration. */
export interface Config {
  /** Directory (relative to the workspace root) where decks are written. */
  outputDir: string
  /** Base URL of the reveal.js distribution embedded in each deck. */
  revealBase: string
  /** Default reveal.js theme (black, white, league, sky, moon, ...). */
  theme: string
}

/** Configuration schema: `Config({})` yields the defaults (Loader behavior). */
export const Config = z.object({
  outputDir: z.string().default('artifacts/slides'),
  revealBase: z.string().default('https://cdn.jsdelivr.net/npm/reveal.js@5'),
  theme: z.string().default('white'),
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
    throw new Error('slides_generate requires an active session with a workspace; none was found')
  }
  return cwd
}

/**
 * Render the deck: slides separated by `---` on its own line are fed to
 * reveal.js's markdown plugin verbatim (`--` splits vertical slides).
 */
function deckHtml(title: string, markdown: string, base: string, theme: string): string {
  // Keep the embedded template intact: escape a closing script tag inside
  // the user markdown so it cannot terminate the template element early.
  const safeMarkdown = markdown.replaceAll('</script>', '<\\/script>')
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `<title>${title.replaceAll('<', '&lt;')}</title>`,
    `<link rel="stylesheet" href="${base}/dist/reveal.css">`,
    `<link rel="stylesheet" href="${base}/dist/theme/${theme}.css">`,
    '</head>',
    '<body>',
    '<div class="reveal"><div class="slides">',
    '<section data-markdown data-separator="^\\n---\\n$" data-separator-vertical="^\\n--\\n$">',
    '<script type="text/template">',
    safeMarkdown,
    '</script>',
    '</section>',
    '</div></div>',
    `<script src="${base}/dist/reveal.js"></script>`,
    `<script src="${base}/plugin/markdown/markdown.js"></script>`,
    `<script src="${base}/plugin/highlight/highlight.js"></script>`,
    '<script>Reveal.initialize({ hash: true, plugins: [RevealMarkdown, RevealHighlight] });</script>',
    '</body>',
    '</html>',
    '',
  ].join('\n')
}

/**
 * Mount the `slides_generate` tool.
 * @param ctx - host cordis context.
 * @param config - validated plugin configuration (schema defaults applied).
 */
export function apply(ctx: Context, config?: Config): void {
  const resolved = Config(config ?? {})

  ctx.tools.register(defineTool({
    name: 'slides_generate',
    description:
      'Generate a presentation as a self-contained reveal.js HTML deck inside the current workspace, '
      + 'and tell the user where it landed. Use it whenever the user asks for slides, a deck, or a PPT-style '
      + 'summary — write the CONTENT as a markdown outline where "---" on its own line separates slides and '
      + '"--" separates vertical sub-slides; standard markdown (headers, lists, code fences, images) works inside '
      + 'each slide. Fails when there is no active workspace session or the markdown is empty.',
    parameters: {
      title: {
        type: 'string',
        required: true,
        description: 'Deck title, also used to derive the default file name.',
      },
      markdown: {
        type: 'string',
        required: true,
        description: 'Full deck content in markdown; "---" on its own line starts a new slide, "--" a vertical sub-slide.',
      },
      theme: {
        type: 'string',
        required: false,
        description: 'reveal.js theme name (black, white, league, sky, moon, solarized, ...); defaults to the configured theme.',
      },
      filename: {
        type: 'string',
        required: false,
        description: 'Output file name relative to the configured slides directory; defaults to a slug of the title. Must stay inside the workspace.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          path: { type: 'string', required: true },
          slideCount: { type: 'integer', required: true },
          theme: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `Deck (${value.slideCount} slides, theme ${value.theme}) written to ${value.path}`,
      }],
    },
    async execute(args) {
      const root = workspaceRoot(ctx)
      const markdown = String(args.markdown ?? '').trim()
      if (markdown === '') {
        throw new Error('markdown must be a non-empty deck outline')
      }
      const title = String(args.title)
      const theme = typeof args.theme === 'string' && args.theme !== '' ? args.theme : resolved.theme
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'deck'
      const fileArg = typeof args.filename === 'string' && args.filename !== '' ? args.filename : `${slug}.html`
      if (isAbsolute(fileArg)) {
        throw new Error('filename must be relative to the slides output directory, not absolute')
      }
      const outPath = resolve(join(root, resolved.outputDir, fileArg))
      if (outPath !== root && !outPath.startsWith(root + sep)) {
        throw new Error('refusing to write outside the active workspace root')
      }
      mkdirSync(resolve(outPath, '..'), { recursive: true })
      writeFileSync(outPath, deckHtml(title, markdown, resolved.revealBase, theme), 'utf8')
      const slideCount = markdown.split(/\n---\n/).length
      return { path: outPath, slideCount, theme }
    },
  }))
}
