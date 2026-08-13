<p align="center">
  <img src="./assets/deepseek-logo.svg" alt="DeepSeek" height="48">
</p>

# Awesome DeepSeek Harness [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A curated list of **plugins, skills, MCP servers, orchestrators, aggregators & UIs** for **DeepSeek Harness (DSH)** — DeepSeek's official agent runtime built around the idea **`Model + Harness = Agent`**.

**English** | [简体中文](./README.zh-CN.md)

DeepSeek Harness ("DSH") is DeepSeek's agent runtime / harness layer — the "hands" that turn the model's reasoning into real actions (context management, tool-call orchestration, execution sandbox, feedback loop, session persistence). Its defining feature is an **open plugin ecosystem**: the community contributes plugins, skills, MCP servers, orchestrators, aggregators, and UIs.

This list collects the best of that ecosystem. Contributions welcome — see [Contributing](#contributing).

> **Tip for authors:** DeepSeek asks plugin repositories to carry the **`#dsh`** GitHub topic so they can be discovered. Add it to your repo, then open a PR here.

## Contents

- [Official](#official)
- [Harnesses & Runtimes](#harnesses--runtimes)
- [Visualization](#visualization)
- [Slides / PPT](#slides--ppt)
- [Coding](#coding)
- [Agents](#agents)
- [Loops (Auto-Research, Self-Improve, etc.)](#loops-auto-research-self-improve-etc)
- [MCP Servers](#mcp-servers)
- [Orchestrators & Aggregators](#orchestrators--aggregators)
- [UI / Clients](#ui--clients)
- [Skills](#skills)
- [Resources](#resources)
- [Contributing](#contributing)

---

## Official

- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) — DeepSeek's official agent runtime framework (`Model + Harness = Agent`); an "everything is a plugin" architecture built on Cordis (TypeScript, MIT).
- [deepseek-ai/awesome-deepseek-integration](https://github.com/deepseek-ai/awesome-deepseek-integration) — Official curated list of DeepSeek API integrations.
- [deepseek-ai/awesome-deepseek-agent](https://github.com/deepseek-ai/awesome-deepseek-agent) — Official list of agents/harnesses with DeepSeek support.

## Harnesses & Runtimes

_DeepSeek-native or DeepSeek-first agent harnesses / coding agents, plus runtime-level infrastructure (diagnostics, ops, session management, approval policies)._

- [hxs996-beep/deepAct](https://github.com/hxs996-beep/deepAct) — Terminal AI coding agent built for DeepSeek that guards every action: ambiguity check, design review, scope control, team mode, parallel sub-agents, and MCP support.
- [LaplaceYoung/oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) — Large plugin collection (700+) for DSH that registers only through extension seams, without modifying the agent-loop core.
- [omdsh-dev/fabric](https://github.com/omdsh-dev/fabric) — Minecraft-Fabric-style hook processor for DSH.
- [omdsh-dev/dsh-session-health](https://github.com/omdsh-dev/dsh-session-health) — Read-only, zero-dependency session health check: frame-level scanning of multi-frame zstd session files to detect torn/corrupted/empty sessions; registers a `session_health` tool.
- [omdsh-dev/dsh-security-audit](https://github.com/omdsh-dev/dsh-security-audit) — Local security audit plugin: read-only, redacted risk report covering config, plugin sources, sessions, and network exposure.
- [Zhenyu98/dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) — Context-injection audit: measures the token cost of the AGENTS.md instruction chain, skill catalog, and tool schemas, and detects duplication and conflicts; Web UI ring panel plus a `context_audit` tool.
- [coppynight/dsh-doctor](https://github.com/coppynight/dsh-doctor) — flutter-doctor-style diagnostics and repair covering install-level and in-harness checks, with safe auto-fixes; repository-plugin format.
- [lhh010/dsh-bash-encoding](https://github.com/lhh010/dsh-bash-encoding) — Auto-detects bash output encoding (UTF-16LE/UTF-8/GBK, etc.) and decodes it correctly, fixing garbled non-ASCII output on WSL/Windows.
- [vlln/plugin-registry](https://github.com/vlln/plugin-registry) — Ecosystem infrastructure: a thin browser console for managing repository plugins (zero patches) plus a `make-dsh-plugin` skill guiding plugin development.
- [Andy8647/dsh-auto-approval](https://github.com/Andy8647/dsh-auto-approval) — Automated tool-call approval: an `auto` tier that classifies every tool call as allow/deny via rules plus an LLM classifier, with a status chip beside the composer.
- [zzh-newlearner/dsh-postmortem](https://github.com/zzh-newlearner/dsh-postmortem) — Local-first failure postmortems for DeepSeek Harness sessions.
- [vibeinging/dsh-trace](https://github.com/vibeinging/dsh-trace) — Telemetry backend that exports turns, model steps, and tool calls to yiTrace over HTTP.
- [omdsh-dev/dsh-hub](https://github.com/omdsh-dev/dsh-hub) — Community extension catalog and profile-generation manager, adding transactional installation, recovery, catalog browsing, and a settings UI on top of official contracts.
- [fakechris/dsh-harness-ops](https://github.com/fakechris/dsh-harness-ops) — Ops toolbox: A/B dual-slot snapshot upgrades with atomic switch and one-click rollback, a watchdog that auto-restarts web/agent, and a self-rescue doctor command.
- [omdsh-dev/session-teleport](https://github.com/omdsh-dev/session-teleport) — Multi-device session handoff with PostgreSQL as the single online authority; only one device holds write credentials at a time.
- [Tieboyh/dsh-session-search](https://github.com/Tieboyh/dsh-session-search) — Index-free cross-agent session search for DeepSeek Harness.
- [ilharp/dsh-tool-approval](https://github.com/ilharp/dsh-tool-approval) — Manual approval for tool calls (a "manual mode" / "ask mode" for DSH).
- [blissito/ghostycode](https://github.com/blissito/ghostycode) — DeepSeek V4 terminal coding agent and constitutional harness (Rust TUI with MCP and sub-agents).
- [didclawapp-ai/zagens](https://github.com/didclawapp-ai/zagens) — Open-source agent harness for DeepSeek V4.
- [liubf21/ds-forge](https://github.com/liubf21/ds-forge) — Lightweight agent harness for DeepSeek V4.
- [Owen718/FlashCoder](https://github.com/Owen718/FlashCoder) — Simple harness for DeepSeek models.

## Visualization

_Plugins that turn data / results into charts, diagrams, dashboards._

- [ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) — OpenPencil design preview and editing plugin for DSH.
- [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) — Vision tasks for text-only models: intent-driven image Q&A, long-screenshot OCR, UI restoration, pixel diff.
- [william-jin-cmu/dsh-vision](https://github.com/william-jin-cmu/dsh-vision) — `view_image` tool bridging any OpenAI-compatible VLM to text-only models.
- [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) — Interactive UI components rendered inline in assistant replies via a `dsh-ui` fence — layout, charts, plots, forms, quizzes, mermaid, 3D scenes — with an action event loop back to the model.

## Slides / PPT

_Generate presentations, decks, slide exports._

- [THU-MAIC/dsh-openmaic](https://github.com/THU-MAIC/dsh-openmaic) — OpenMAIC for DeepSeek Harness: classrooms, slides, interactive widgets, and Socratic teaching.

## Coding

_Code generation, refactoring, review, repo-level engineering plugins._

- [omdsh-dev/dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) — Open DSH workspace directories in VS Code directly from the web GUI.
- [omdsh-dev/dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) — Create and manage sandboxed JavaScript tools with a Monaco editor and a model-driven tool lifecycle.
- [CanglongCl/dsh-web-review](https://github.com/CanglongCl/dsh-web-review) — Web preview and element annotation for the DSH Web GUI, letting the AI edit front-end source code from visual feedback.
- [omdsh-dev/dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) — Plugin health check: scans plugin repos for manifest protocol, patch format, build pitfalls, and hub listing status; zero-dependency, read-only, registers a `plugin_check` tool.
- [omdsh-dev/plugin-template](https://github.com/omdsh-dev/plugin-template) — Plugin template repository based on the official turtle-ui plugin repo.

## Agents

_Reusable sub-agents / specialized agent packs runnable inside DSH._

- [hewzhew/dsh-agent-rp](https://github.com/hewzhew/dsh-agent-rp) — SillyTavern migration and next-generation agent role-play for DSH.
- [whiteguo233/dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) — Embeds OpenBiliClaw, a local personalized content-recommendation agent, as a fourth panel in DSH with 22 agent-bridge tools for reading recommendations and closed-loop learning.
- [omdsh-dev/dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) — Lets the agent connect to databases and write SQL for you.
- [omdsh-dev/dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) — Deep Mnemon integration providing a three-layer local memory: runtime memory, retrievable documents, and supervised memory spaces.
- [nowledge-co/nowledge-mem-deepseek-harness](https://github.com/nowledge-co/nowledge-mem-deepseek-harness) — Nowledge Mem community plugin bundle for DeepSeek Harness.

## Loops (Auto-Research, Self-Improve, etc.)

_Long-running loop workflows: auto-research, deep-research, self-refine, iterative build._

- [btspoony/mstar-harness](https://github.com/btspoony/mstar-harness) — Skill-driven harness/loop engineering workflow agent plugin.
- [csyangwen/dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) — Plugin-only cross-session long-term memory with background self-evolution: five memory tracks, in-turn self-review, skill self-evolution and a skill manager, todo tracks, and session search — zero core modifications.
- [vlln/dsh-loop](https://github.com/vlln/dsh-loop) — Timed loop plugin (`/loop` command + loop tool + activity status bar).
- [william-jin-cmu/dsh-evolve](https://github.com/william-jin-cmu/dsh-evolve) — Self-evolving plugin: hot-mount/unmount Cordis plugins inside a session.

## MCP Servers

_Model Context Protocol servers that contribute tools / prompts / resources to DSH._

<!-- Add entries here. -->

## Orchestrators & Aggregators

_Multi-step / multi-agent schedulers and output aggregators._

- [icetomoyo/dsh_workflow](https://github.com/icetomoyo/dsh_workflow) — Upgrades DSH's one-shot multi-agent dispatch into a workflow layer that can be generated, saved, governed, observed, and resumed (UltraCode-style).
- [NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) — AgentTeams plugin for DeepSeek Harness.
- [Chinesezjc/dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) — Cross-instance message/event handoff plugins for DSH (interconnect service + tools).
- [titanwings/dsh-automation](https://github.com/titanwings/dsh-automation) — Runs coding tasks on a schedule in fresh agent sessions; schedules are managed from the DSH Web UI or by the agent itself.
- [Buyi-wsgzg/dsh-sidechain](https://github.com/Buyi-wsgzg/dsh-sidechain) — Side sessions: persistent `/side` sessions (Codex-style) and one-shot `/btw` questions (Claude-style) that run in a temporary fork without touching main-session history, with an embedded side panel.

## UI / Clients

_Desktop, web, terminal, or editor front-ends for DSH._

- [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) — Plugin and skin collection for the DSH Web UI: task board, git graph, right-side panel, remote mobile UI, pet, live token stats, and a skin center.
- [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) — Terminal UI for DeepSeek Harness.
- [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) — Full sidebar workbench: third-party tab registration, built-in file rendering/editing, terminal, Git, and sub-agents.
- [ccch1mneyyy/dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui) — Claude-Code-style full-screen interactive terminal: streaming thought expansion, double-Esc rollback, context progress bar, and a TPS gauge.
- [Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) — Whale-girl skin series for the DSH Web UI (maid-atelier), CC BY-NC-SA 4.0.
- [hust-open-atom-club/oh-dsh-desktop](https://github.com/hust-open-atom-club/oh-dsh-desktop) — Extensible macOS workbench with a native PTY, workspace tools, live bilingual plugins, and an isolated-preview plugin marketplace.
- [omdsh-dev/dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) — Codex-style `@file` mentions: search workspace files in the composer and attach their contents to prompts.
- [omdsh-dev/dsh-notification](https://github.com/omdsh-dev/dsh-notification) — Desktop notifications for turn completions, with per-outcome controls and include/exclude keyword rules.
- [alingalingling/ui-status-label](https://github.com/alingalingling/ui-status-label) — Customize the "deep diving" thinking status label into anything you like.
- [Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) — Rewind conversation and workspace state, powered by a persistent change ledger.
- [bobleer/dsh-acp-for-bitfun](https://github.com/bobleer/dsh-acp-for-bitfun) — ACP bridge plugin connecting BitFun with DSH.
- [Moeblack/dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) — Branch-based message editing, reroll, retry, and a version timeline.
- [Lum1104/dsh-browser](https://github.com/Lum1104/dsh-browser) — Chrome side-panel extension for driving the browser directly with DSH, with zero vision-model dependency.
- [hellodigua/dsh-share](https://github.com/hellodigua/dsh-share) — One-click conversation sharing.
- [chen-001/dsh-grok-tui](https://github.com/chen-001/dsh-grok-tui) — Use DSH through grok-build's TUI.
- [ccq1/dsh-side-panel](https://github.com/ccq1/dsh-side-panel) — Side panel integrating a file browser, terminal, and Git review for quick file preview.
- [lhh010/dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) — Hand-drawn pixel whale companion living in the session title bar: blinks and swims while idle, animates while thinking, sprays water on turn completion; zero core changes.
- [lhh010/dsh-ui-progress](https://github.com/lhh010/dsh-ui-progress) — Session progress bar docked at the composer: real todo progress, live token generation rate, interrupt state, and todo reminders; zero core changes.
- [omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) — Select text, annotate, and send annotations along with your message; replies map back to each annotation one by one.
- [Ruler4396/dsh-launcher](https://github.com/Ruler4396/dsh-launcher) — Lightweight Windows launcher: silent autostart at logon plus a minimal WebView2 window instead of a full browser.
- [renat3u/dsh-web-archive](https://github.com/renat3u/dsh-web-archive) — Collapses noisy messages (thinking, bash output, etc.) in the conversation.
- [renat3u/dsh-paseo](https://github.com/renat3u/dsh-paseo) — Registers DSH as a Paseo ACP provider: run and manage multiple parallel DSH agents from Paseo's desktop/web/mobile clients.
- [Small-tailqwq/dsh-deepcel](https://github.com/Small-tailqwq/dsh-deepcel) — An Excel-style skin for DSH.
- [titanwings/dsh-plannotator](https://github.com/titanwings/dsh-plannotator) — Plan-review plugin: select plan text, add anchored annotations, and send structured feedback back to the agent.
- [vibeinging/dsh-work](https://github.com/vibeinging/dsh-work) — Local-first Electron workbench combining agent sessions, project files, data analysis, web research, MCP, and Office artifacts.
- [whiteguo233/dsh-cc-connect](https://github.com/whiteguo233/dsh-cc-connect) — Use DSH remotely through CC Connect.
- [dbydd/dsh-onlyne](https://github.com/dbydd/dsh-onlyne) — Gives DSH agents a real IM inbox/outbox (Telegram, Feishu/Lark, QQ Bot, WeChat) through the Onlyne workspace-local channel daemon.
- [LaplaceYoung/dsh-qq2006](https://github.com/LaplaceYoung/dsh-qq2006) — QQ2006 skin: registers a `qq2006` theme with a full global skin table and assets.
- [vlln/whale-girl](https://github.com/vlln/whale-girl) — Desktop-pet plugin for the Web GUI (QQ-pet style): a draggable floating companion you can feed and play with.
- [ccch1mneyyy/dsh-working-activity](https://github.com/ccch1mneyyy/dsh-working-activity) — Live model working-status line for the TUI prompt bar and Web UI: playful thinking copy, running tools, turn summaries, and self-narration.
- [orriduck/dsh-tui](https://github.com/orriduck/dsh-tui) — A small, session-aware terminal UI for DeepSeek Harness.

## Skills

_Packaged task capabilities (markdown-based skills, tool packs)._

- [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) — Vision tools for text-only models: intent-aware image Q&A, long-screenshot OCR, UI restoration, grounding, pixel diff, artifacts, and a Web UI.
- [omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit) — Zero-dependency deterministic tool pack — time, encoding, JSON, calculator, CSV, regex, markdown, diff, stats, and schema — with a unified one-command install.
- [Anionex/dsh-computer-use](https://github.com/Anionex/dsh-computer-use) — Accessibility-first macOS computer-use bundle with fresh observations, stale-state rejection, scoped permissions, and safe input.
- [omdsh-dev/dsh-plugin-dev](https://github.com/omdsh-dev/dsh-plugin-dev) — Field notes on DSH plugin development (skill + docs): cordis dual copies, tsconfig setup, Windows junctions, multi-frame zstd, and other tested findings.
- [omdsh-dev/dsh-tool-csv](https://github.com/omdsh-dev/dsh-tool-csv) — CSV data tool (RFC 4180): parse, query, aggregate, and convert CSV text with a zero-dependency state-machine parser.
- [emredeveloper/deepseek-harness-huggingface](https://github.com/emredeveloper/deepseek-harness-huggingface) — Read-only Hugging Face Hub model discovery; registers an `hf_search_models` tool that needs no API key.
- [omdsh-dev/dsh-plugin-skills](https://github.com/omdsh-dev/dsh-plugin-skills) — Agent skills for building and testing DSH plugins — from scaffolding a new package to choosing test tiers — entirely inside an agent session.

## Resources

- [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) — Official source repo.
- [DeepSeek Harness overview (ai-bot.cn)](https://ai-bot.cn/deepseek-harness) — Third-party writeup.
- [Finding the Best Harness for DeepSeek V4 Flash (Composio)](https://composio.dev/content/best-agent-harness-deepseek-v4-flash)

## Contributing

PRs welcome! To add a plugin:

1. Make sure your repo carries the **`#dsh`** GitHub topic.
2. Add one entry under the most fitting category, format:
   `- [Name](https://link) — Concise one-line description.`
3. Keep the list alphabetical within each section where practical.
4. One PR per logical change; keep descriptions factual and hype-free.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, the contributors have waived all copyright and related or neighboring rights to this work.
