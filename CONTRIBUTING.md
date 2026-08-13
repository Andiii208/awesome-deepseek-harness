# Contributing to Awesome DeepSeek Harness

Thanks for helping build the DeepSeek Harness (DSH) plugin ecosystem!

## What belongs here

Anything that extends or works with **DeepSeek Harness**:

- **Plugins** — tools/capabilities that extend the harness (visualization, PPT, coding, etc.)
- **Skills** — packaged, markdown-based task capabilities
- **MCP servers** — Model Context Protocol servers usable from DSH
- **Orchestrators / Aggregators** — multi-step or multi-agent controllers
- **UIs / Clients** — desktop, web, terminal, editor front-ends
- **Harnesses / Runtimes** — DeepSeek-native or DeepSeek-first agent harnesses
- **Loops** — auto-research, deep-research, self-improve, iterative build workflows

## How to add an entry

1. **Tag your repo** with the **`#dsh`** GitHub topic (DeepSeek's discovery convention).
2. Fork this repo and edit **both** `README.md` and `README.zh-CN.md` (keep the two in sync).
3. Add your entry under the most fitting category, using this exact format:

   ```
   - [Name](https://link) — Concise one-line description.
   ```

   (Chinese file uses ` —— ` as the separator.)

4. Keep entries alphabetical within a section where practical.
5. Open one Pull Request per logical change.

## Quality bar

- The project must be real, working, and publicly accessible.
- Descriptions must be **factual and hype-free** — no "revolutionary", "best-ever", etc.
- Prefer the canonical source repo over mirrors or blog posts.
- Dead links / abandoned projects may be removed.

## Not sure which category?

Open an issue and ask, or pick the closest fit — a maintainer can recategorize during review.
