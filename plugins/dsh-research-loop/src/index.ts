/**
 * dsh-research-loop host plugin: registers the `research_log` tool — a
 * durable, append-only JSONL log per research topic inside the workspace.
 * The loop discipline (plan → search → read → synthesize, with explicit
 * stop conditions) lives in the bundled `auto-research-loop` skill; the
 * tool gives the loop durable state that survives context compaction.
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join, resolve, sep } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

/** Cordis plugin name (the Loader entry id). */
export const name = 'dsh-research-loop'

/** Services required before load. */
export const inject = ['tools']

/** Deployment configuration. */
export interface Config {
  /** Directory (relative to the workspace root) holding per-topic logs. */
  logDir: string
  /** Hard cap on entries returned by a single read. */
  maxReadEntries: number
}

/** Configuration schema: `Config({})` yields the defaults (Loader behavior). */
export const Config = z.object({
  logDir: z.string().default('.dsh-research'),
  maxReadEntries: z.number().default(200),
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
    throw new Error('research_log requires an active session with a workspace; none was found')
  }
  return cwd
}

const PHASES = ['plan', 'search', 'read', 'synthesize', 'conclude'] as const

/** One durable log entry (a single JSONL line). */
interface LogEntry {
  at: string
  phase: (typeof PHASES)[number]
  note: string
  sources?: string[]
}

/** Map a topic to its log path, confined to the configured log directory. */
function topicPath(root: string, logDir: string, topic: string): string {
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (slug === '') throw new Error('topic must contain at least one alphanumeric character')
  const path = resolve(join(root, logDir, `${slug}.jsonl`))
  if (!path.startsWith(resolve(join(root, logDir)) + sep)) {
    throw new Error('refusing to touch a log outside the research log directory')
  }
  return path
}

/**
 * Mount the `research_log` tool.
 * @param ctx - host cordis context.
 * @param config - validated plugin configuration (schema defaults applied).
 */
export function apply(ctx: Context, config?: Config): void {
  const resolved = Config(config ?? {})

  ctx.tools.register(defineTool({
    name: 'research_log',
    description:
      'Durable research memory for multi-step investigations: append findings to (or read back) an append-only '
      + 'per-topic JSONL log stored in the workspace. Use it while following the auto-research-loop skill — append '
      + 'one entry after every completed phase step (phase: plan | search | read | synthesize | conclude) with a '
      + 'compact note and the source URLs it rests on; read the log back before planning the next iteration or '
      + 'after context compaction, instead of trusting recall. Actions: "append" (requires phase + note) and '
      + '"read" (returns the newest entries, oldest first). The log is never rewritten or deleted by this tool.',
    parameters: {
      action: {
        type: 'string',
        required: true,
        description: 'One of: append, read.',
      },
      topic: {
        type: 'string',
        required: true,
        description: 'Stable research topic label; entries with the same topic share one log file.',
      },
      phase: {
        type: 'string',
        required: false,
        description: 'For append: one of plan, search, read, synthesize, conclude.',
      },
      note: {
        type: 'string',
        required: false,
        description: 'For append: the finding or decision, compact and self-contained (readable without the chat context).',
      },
      sources: {
        type: 'json',
        required: false,
        description: 'For append: array of source URLs/identifiers this note rests on.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          action: { type: 'string', required: true },
          topic: { type: 'string', required: true },
          entryCount: { type: 'integer', required: true },
          entries: { type: 'json', required: false },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: value.action === 'append'
          ? `Logged entry #${value.entryCount} for topic "${value.topic}".`
          : `Research log "${value.topic}": ${value.entryCount} entr${value.entryCount === 1 ? 'y' : 'ies'}.`,
      }],
    },
    async execute(args) {
      const root = workspaceRoot(ctx)
      const topic = String(args.topic)
      const path = topicPath(root, resolved.logDir, topic)
      const action = String(args.action)

      const readEntries = (): LogEntry[] => {
        if (!existsSync(path)) return []
        return readFileSync(path, 'utf8')
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => JSON.parse(line) as LogEntry)
      }

      if (action === 'append') {
        const phase = String(args.phase ?? '')
        if (!(PHASES as readonly string[]).includes(phase)) {
          throw new Error(`phase must be one of: ${PHASES.join(', ')}`)
        }
        const note = String(args.note ?? '').trim()
        if (note === '') throw new Error('append requires a non-empty note')
        const entry: LogEntry = {
          at: new Date().toISOString(),
          phase: phase as LogEntry['phase'],
          note,
          ...(Array.isArray(args.sources) && args.sources.length > 0
            ? { sources: args.sources.map(String) }
            : {}),
        }
        mkdirSync(resolve(path, '..'), { recursive: true })
        appendFileSync(path, JSON.stringify(entry) + '\n', 'utf8')
        return { action, topic, entryCount: readEntries().length }
      }

      if (action === 'read') {
        const entries = readEntries()
        const tail = entries.slice(-resolved.maxReadEntries)
        return { action, topic, entryCount: entries.length, entries: tail }
      }

      throw new Error(`unsupported action "${action}"; use one of: append, read`)
    },
  }))
}
