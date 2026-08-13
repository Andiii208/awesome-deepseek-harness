/**
 * dsh-code-review host plugin: registers the `code_review_context` tool,
 * which deterministically collects git diff context (scope, stats, bounded
 * patch text) from the active workspace so the model reviews the SAME
 * snapshot it reports on. The review methodology itself lives in the
 * bundled `code-review` skill — the tool only gathers evidence.
 */
import { execFileSync } from 'node:child_process'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

/** Cordis plugin name (the Loader entry id). */
export const name = 'dsh-code-review'

/** Services required before load. */
export const inject = ['tools']

/** Deployment configuration. */
export interface Config {
  /** Hard cap on returned patch text, in bytes (larger diffs are truncated). */
  maxDiffBytes: number
}

/** Configuration schema: `Config({})` yields the defaults (Loader behavior). */
export const Config = z.object({
  maxDiffBytes: z.number().default(120_000),
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
    throw new Error('code_review_context requires an active session with a workspace; none was found')
  }
  return cwd
}

/** Run git with fixed args in the workspace; never through a shell. */
function git(cwd: string, args: string[]): string {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(`git ${args.join(' ')} failed in the workspace: ${message}`)
  }
}

/** Validate a user-supplied revision range so no flags sneak into git argv. */
function safeRange(range: string): string {
  if (!/^[A-Za-z0-9_./~^-]+(\.\.\.?[A-Za-z0-9_./~^-]+)?$/.test(range) || range.startsWith('-')) {
    throw new Error(`range "${range}" is not a plain revision range (flags are not allowed)`)
  }
  return range
}

/**
 * Mount the `code_review_context` tool.
 * @param ctx - host cordis context.
 * @param config - validated plugin configuration (schema defaults applied).
 */
export function apply(ctx: Context, config?: Config): void {
  const resolved = Config(config ?? {})

  ctx.tools.register(defineTool({
    name: 'code_review_context',
    description:
      'Collect the exact change set to review from the workspace git repository: file stats plus the patch text, '
      + 'bounded and deterministic. Call this FIRST when asked to review code, review a PR/commit, or check '
      + 'uncommitted work — then follow the code-review skill checklist against the returned diff instead of '
      + 're-reading files ad hoc. Scopes: "worktree" (uncommitted changes vs HEAD), "staged" (index vs HEAD), '
      + '"range" (a revision range like main..HEAD, requires the range parameter). Read-only: runs git diff only, '
      + 'never mutates the repository. Fails outside a git repository or on a malformed range.',
    parameters: {
      scope: {
        type: 'string',
        required: true,
        description: 'One of: worktree, staged, range.',
      },
      range: {
        type: 'string',
        required: false,
        description: 'Revision range for scope "range", e.g. "main..HEAD" or a single commit; plain revisions only.',
      },
      paths: {
        type: 'json',
        required: false,
        description: 'Optional array of path filters, passed to git after "--" to limit the diff.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          scope: { type: 'string', required: true },
          filesChanged: { type: 'integer', required: true },
          stat: { type: 'string', required: true },
          diff: { type: 'string', required: true },
          truncated: { type: 'boolean', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: `Collected ${value.scope} diff: ${value.filesChanged} file(s) changed${value.truncated ? ' (patch truncated)' : ''}.\n${value.stat}`,
      }],
    },
    async execute(args) {
      const cwd = workspaceRoot(ctx)
      const scope = String(args.scope)
      const base: string[] = []
      if (scope === 'worktree') base.push('HEAD')
      else if (scope === 'staged') base.push('--cached')
      else if (scope === 'range') {
        if (typeof args.range !== 'string' || args.range === '') {
          throw new Error('scope "range" requires the range parameter (e.g. "main..HEAD")')
        }
        base.push(safeRange(args.range))
      } else {
        throw new Error(`unsupported scope "${scope}"; use one of: worktree, staged, range`)
      }
      const pathFilters = Array.isArray(args.paths) ? args.paths.map(String) : []
      const tail = pathFilters.length > 0 ? ['--', ...pathFilters] : []
      const nameStatus = git(cwd, ['diff', '--name-status', ...base, ...tail]).trimEnd()
      const stat = git(cwd, ['diff', '--stat', ...base, ...tail]).trimEnd()
      const fullDiff = git(cwd, ['diff', ...base, ...tail])
      const truncated = Buffer.byteLength(fullDiff, 'utf8') > resolved.maxDiffBytes
      const diff = truncated
        ? Buffer.from(fullDiff, 'utf8').subarray(0, resolved.maxDiffBytes).toString('utf8')
          + '\n[... diff truncated at maxDiffBytes; narrow with the paths parameter ...]'
        : fullDiff
      const filesChanged = nameStatus === '' ? 0 : nameStatus.split('\n').length
      return { scope, filesChanged, stat, diff, truncated }
    },
  }))
}
