<p align="center">
  <img src="./assets/deepseek-logo.svg" alt="DeepSeek" height="48">
</p>

# Awesome DeepSeek Harness [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> 面向 **DeepSeek Harness（DSH）** 的 **插件 / Skill / MCP / 编排器 / 聚合器 / UI** 精选清单 —— DeepSeek 官方 agent 运行框架，核心理念 **`Model + Harness = Agent`**。

[English](./README.md) | **简体中文**

DeepSeek Harness（简称 "DSH"）是 DeepSeek 的 agent 运行框架 / harness 层 —— 把模型的推理变成真实行动的那双"手"（上下文管理、工具调用编排、执行沙箱、反馈循环、会话持久化）。它最大的特点是**开放的插件生态**：由社区贡献 plugin、Skill、MCP server、orchestrator、aggregator 和 UI。

本清单收录这个生态里最好的项目。欢迎贡献 —— 见 [贡献指南](#贡献指南)。

> **给作者的提示：** DeepSeek 要求插件仓库带上 **`#dsh`** GitHub topic 以便被发现。给你的仓库加上它，然后来这里提 PR。

## 目录

- [官方](#官方)
- [Harness 与运行时](#harness-与运行时)
- [可视化](#可视化)
- [幻灯片 / PPT](#幻灯片--ppt)
- [写代码](#写代码)
- [Agent](#agent)
- [循环（自动研究 / 自我改进等）](#循环自动研究--自我改进等)
- [MCP Server](#mcp-server)
- [编排器与聚合器](#编排器与聚合器)
- [UI / 客户端](#ui--客户端)
- [Skill](#skill)
- [资源](#资源)
- [贡献指南](#贡献指南)

---

## 官方

- [DeepSeek Harness](https://ai-bot.cn/deepseek-harness) —— DeepSeek 官方 agent 运行框架（`Model + Harness = Agent`），主攻编程与办公场景。
- [deepseek-ai/awesome-deepseek-integration](https://github.com/deepseek-ai/awesome-deepseek-integration) —— 官方 DeepSeek API 集成清单。
- [deepseek-ai/awesome-deepseek-agent](https://github.com/deepseek-ai/awesome-deepseek-agent) —— 官方支持 DeepSeek 的 agent / harness 清单。

## Harness 与运行时

_DeepSeek 原生 / DeepSeek 优先的 agent harness、coding agent，以及运行时级基建（诊断、运维、会话管理、审批策略）。_

- [hxs996-beep/deepAct](https://github.com/hxs996-beep/deepAct) —— 为 DeepSeek 打造的终端 AI 编码代理，为每步行动设守卫：歧义检查、设计评审、范围控制，支持团队协作、子代理并行与 MCP 扩展。
- [LaplaceYoung/oh-my-dsh](https://github.com/LaplaceYoung/oh-my-dsh) —— 面向 DSH 的大型插件合集（700+），只通过扩展接缝注册，不修改 agent-loop 骨架。
- [omdsh-dev/fabric](https://github.com/omdsh-dev/fabric) —— 类似 MC Fabric 的 hook 处理器。
- [omdsh-dev/dsh-session-health](https://github.com/omdsh-dev/dsh-session-health) —— 会话健康检查：对多帧 zstd 会话文件做帧级扫描诊断（torn / 损坏 / 空会话检测），零依赖只读，注册 `session_health` 工具。
- [omdsh-dev/dsh-security-audit](https://github.com/omdsh-dev/dsh-security-audit) —— 本机安全审计插件：覆盖配置、插件来源、会话与网络暴露面，输出只读脱敏风险报告。
- [Zhenyu98/dsh-context-doctor](https://github.com/Zhenyu98/dsh-context-doctor) —— 上下文注入审计：统计 AGENTS.md 指令链 / 技能目录 / 工具 schema 的 token 成本，检测重复与冲突；Web UI 圆环面板 + `context_audit` 工具。
- [coppynight/dsh-doctor](https://github.com/coppynight/dsh-doctor) —— flutter-doctor 风格的诊断与修复：覆盖安装级与 harness 内检查，支持安全的自动修复；repository-plugin 格式。
- [lhh010/dsh-bash-encoding](https://github.com/lhh010/dsh-bash-encoding) —— 自动识别 bash 输出编码（UTF-16LE / UTF-8 / GBK 等）并正确解码，修复 WSL / Windows 下 bash 工具的中文乱码。
- [vlln/plugin-registry](https://github.com/vlln/plugin-registry) —— 插件生态基建：管理 repository 插件的浏览器薄控制台（0 patch）+ 引导插件开发的 `make-dsh-plugin` skill。
- [Andy8647/dsh-auto-approval](https://github.com/Andy8647/dsh-auto-approval) —— 工具调用自动审批：新增 `auto` 审批档位，用规则 + LLM 分类器对每次工具调用判定放行 / 拒绝，输入框旁带状态芯片。
- [zzh-newlearner/dsh-postmortem](https://github.com/zzh-newlearner/dsh-postmortem) —— 面向 DSH 会话的本地优先故障复盘（postmortem）工具。
- [vibeinging/dsh-trace](https://github.com/vibeinging/dsh-trace) —— 遥测后端：把回合、模型步骤和工具调用通过 HTTP 导出到 yiTrace。
- [omdsh-dev/dsh-hub](https://github.com/omdsh-dev/dsh-hub) —— 社区扩展目录与 Profile 生成管理器：在官方契约之上增加事务式安装、恢复、目录浏览和设置 UI。
- [fakechris/dsh-harness-ops](https://github.com/fakechris/dsh-harness-ops) —— 运维工具箱：快照 A/B 双槽升级（原子切换、一键回滚）、守护进程自动拉起 web / agent、web 全挂时一条命令自救诊断。
- [omdsh-dev/session-teleport](https://github.com/omdsh-dev/session-teleport) —— 多设备 Session 接力：以 PostgreSQL 为唯一在线权威，同一时间只有一台设备持有写入凭据。
- [Tieboyh/dsh-session-search](https://github.com/Tieboyh/dsh-session-search) —— 免索引的跨 agent 会话搜索。
- [ilharp/dsh-tool-approval](https://github.com/ilharp/dsh-tool-approval) —— 工具调用手动审批（DSH 的"手动模式 / Ask 模式"）。

## 可视化

_把数据 / 结果变成图表、图形、看板的插件。_

- [ZSeven-W/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil) —— OpenPencil 设计稿预览与编辑插件。
- [omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui) —— 通过 `dsh-ui` 代码栅栏在回复中内联渲染可交互 UI 组件：布局、图表、绘图、表单、测验、mermaid、3D 场景，并把交互事件回传给模型。

## 幻灯片 / PPT

_生成演示文稿、幻灯片、导出 PPT。_

- [THU-MAIC/dsh-openmaic](https://github.com/THU-MAIC/dsh-openmaic) —— OpenMAIC for DSH：课堂、幻灯片、交互组件与苏格拉底式教学。

## 写代码

_代码生成、重构、审查、仓库级工程插件。_

- [omdsh-dev/dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode) —— 从 Web GUI 直接在 VS Code 中打开 DSH 工作区目录。
- [omdsh-dev/dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool) —— 用 Monaco 编辑器创建和管理沙箱化 JavaScript 工具，工具生命周期由模型驱动。
- [CanglongCl/dsh-web-review](https://github.com/CanglongCl/dsh-web-review) —— DSH Web GUI 的网页预览与元素批注插件，让 AI 根据可视化反馈直接修改前端源码。
- [omdsh-dev/dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check) —— 插件健康检查：扫描插件仓库的清单协议 / patch 格式 / 构建陷阱 / hub 收录状态，零依赖只读，注册 `plugin_check` 工具。
- [omdsh-dev/plugin-template](https://github.com/omdsh-dev/plugin-template) —— 基于官方 turtle-ui 插件仓库创建的插件模板。

## Agent

_可在 DSH 内运行的可复用子 agent / 专用 agent 包。_

- [hewzhew/dsh-agent-rp](https://github.com/hewzhew/dsh-agent-rp) —— SillyTavern 迁移与新一代 Agent 角色扮演（RP）。
- [whiteguo233/dsh-openbiliclaw](https://github.com/whiteguo233/dsh-openbiliclaw) —— 把本地个性化内容推荐 Agent OpenBiliClaw 装进 DSH：界面常驻第四栏，注册 22 个 Agent Bridge 工具，让 Agent 读推荐、答探测、闭环学习。
- [omdsh-dev/dsh-data-agent](https://github.com/omdsh-dev/dsh-data-agent) —— 让 AI 帮你连数据库、写 SQL 的插件。
- [omdsh-dev/dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon) —— Mnemon 深度集成插件：提供三层本地记忆能力 —— Runtime Memory、可检索 Documents 与受监督 Memory Spaces。
- [nowledge-co/nowledge-mem-deepseek-harness](https://github.com/nowledge-co/nowledge-mem-deepseek-harness) —— Nowledge Mem 社区插件包。

## 循环（自动研究 / 自我改进等）

_长时运行的循环工作流：自动研究、深度调研、自我精炼、迭代构建。_

- [btspoony/mstar-harness](https://github.com/btspoony/mstar-harness) —— Skill 驱动的 Harness / Loop 工程化工作流 agent 插件。
- [csyangwen/dsh-memory-evolve](https://github.com/csyangwen/dsh-memory-evolve) —— 纯插件实现的跨会话长期记忆 + 后台自我进化：五轨记忆、回合内自我审查、技能自我进化与技能管理器、四轨待办、会话搜索 —— 零核心修改、零运行时依赖。

## MCP Server

_向 DSH 贡献工具 / prompt / 资源的 Model Context Protocol server。_

<!-- 在此添加条目。 -->

## 编排器与聚合器

_多步 / 多 agent 调度器与输出聚合器。_

- [icetomoyo/dsh_workflow](https://github.com/icetomoyo/dsh_workflow) —— 把 DSH 的一次性多 Agent 调度升级为可生成、可保存、可治理、可观察、可恢复的 Workflow 层（UltraCode 风格）。
- [NanmiCoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams) —— AgentTeams 多 agent 团队插件。
- [Chinesezjc/dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect) —— DSH 跨实例消息 / 事件接力插件（互联服务 + 工具）。
- [titanwings/dsh-automation](https://github.com/titanwings/dsh-automation) —— 自动化插件：让 Coding 任务按计划在全新 Agent Session 中运行，定时任务可由用户或 Agent 创建和管理。
- [Buyi-wsgzg/dsh-sidechain](https://github.com/Buyi-wsgzg/dsh-sidechain) —— 侧会话插件：`/side` 持续性侧会话（Codex 风格）与 `/btw` 一次性侧问（Claude 风格），在临时 fork 中运行、不写入主会话历史，Web UI 右侧面板内嵌对话。

## UI / 客户端

_DSH 的桌面、网页、终端或编辑器前端。_

- [zhu1090093659/dsh-web-ui](https://github.com/zhu1090093659/dsh-web-ui) —— DSH Web UI 插件与皮肤合集：任务看板、git graph、右侧面板、远程移动端 UI、宠物、实时 token 统计与皮肤中心。
- [huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui) —— DeepSeek Harness 终端 UI（天枢 TUI）。
- [omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar) —— 侧边栏完整工作台：支持三方扩展注册新 Tab，内置文件渲染编辑 / 终端 / Git / 子代理。
- [ccch1mneyyy/dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui) —— Claude Code 风格全屏交互终端：像素鲸鱼顶栏、思考流式展开、双击 Esc 回滚、上下文进度条 + TPS 仪表。
- [Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale) —— DSH Web 鲸鱼娘皮肤系列（深海女仆工坊 maid-atelier），CC BY-NC-SA 4.0。
- [hust-open-atom-club/oh-dsh-desktop](https://github.com/hust-open-atom-club/oh-dsh-desktop) —— 可扩展的 macOS 工作台：原生 PTY、工作区工具、双语实时插件、隔离预览的插件市场。
- [omdsh-dev/dsh-at-file](https://github.com/omdsh-dev/dsh-at-file) —— Codex 风格 `@file` 引用：在输入框中搜索工作区文件并把内容附加到 prompt。
- [omdsh-dev/dsh-notification](https://github.com/omdsh-dev/dsh-notification) —— 回合完成桌面通知：按结果分别控制，支持关键词包含 / 排除规则。
- [alingalingling/ui-status-label](https://github.com/alingalingling/ui-status-label) —— 把思考时的 "deep diving" 状态文案自定义成任意你想要的样子。
- [Anionex/dsh-turn-rewind](https://github.com/Anionex/dsh-turn-rewind) —— 对话回退插件：回退对话与工作区状态，基于持久化 Change Ledger。
- [bobleer/dsh-acp-for-bitfun](https://github.com/bobleer/dsh-acp-for-bitfun) —— BitFun 与 DSH 的 ACP 交互对接插件。
- [Moeblack/dsh-message-edit](https://github.com/Moeblack/dsh-message-edit) —— 基于分支的消息编辑、重roll、重试与版本时间线。
- [Lum1104/dsh-browser](https://github.com/Lum1104/dsh-browser) —— Chrome 侧边栏扩展：用 DSH 直接操作浏览器，0 视觉能力依赖。
- [hellodigua/dsh-share](https://github.com/hellodigua/dsh-share) —— 对话分享插件，一键分享你的对话。
- [chen-001/dsh-grok-tui](https://github.com/chen-001/dsh-grok-tui) —— 通过 grok-build 的 TUI 使用 DSH。
- [ccq1/dsh-side-panel](https://github.com/ccq1/dsh-side-panel) —— DSH 侧边栏：集成文件浏览器、终端和 Git 审查，方便预览文件。
- [lhh010/dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) —— 全手绘像素鲸鱼伙伴：会话标题栏常驻，平时眨眼摆尾、思考时持续动起来、回合完成头顶喷水，零核心改动。
- [lhh010/dsh-ui-progress](https://github.com/lhh010/dsh-ui-progress) —— 会话进度插件：输入框停靠区常驻进度条（todos 真实进度 / 实时 token 生成速率 / 中断状态 / 待办提醒），零核心改动。
- [omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation) —— Web 选中批注插件：选文字 → 批注 → 随消息发送，回复按批注逐条对照。
- [Ruler4396/dsh-launcher](https://github.com/Ruler4396/dsh-launcher) —— 轻量 Windows 启动器：登录时静默自启 + 极简 WebView2 窗口，替代完整浏览器。
- [renat3u/dsh-web-archive](https://github.com/renat3u/dsh-web-archive) —— 折叠对话中的"无用消息"（如 Think、Bash 输出等）。
- [renat3u/dsh-paseo](https://github.com/renat3u/dsh-paseo) —— 把 DSH 注册为 Paseo 的 ACP provider：在 Paseo 桌面 / Web / 手机客户端里并行运行和管理多个 DSH agent。
- [Small-tailqwq/dsh-deepcel](https://github.com/Small-tailqwq/dsh-deepcel) —— 一款模仿 Excel 的 DSH 皮肤。
- [titanwings/dsh-plannotator](https://github.com/titanwings/dsh-plannotator) —— 计划批注插件：选中计划原文、逐条批注，并把结构化反馈送回 Agent。
- [vibeinging/dsh-work](https://github.com/vibeinging/dsh-work) —— 本地优先的 Electron 工作台：整合 Agent 会话、项目文件、数据分析、网络调研、MCP 与 Office 产物。
- [whiteguo233/dsh-cc-connect](https://github.com/whiteguo233/dsh-cc-connect) —— 通过 CC Connect 远程使用 DSH。
- [dbydd/dsh-onlyne](https://github.com/dbydd/dsh-onlyne) —— 通过 Onlyne（工作区本地 IM 通道守护进程）给 DSH agent 一个真正的 IM 收发件箱：Telegram、飞书、QQ 机器人、微信。
- [LaplaceYoung/dsh-qq2006](https://github.com/LaplaceYoung/dsh-qq2006) —— QQ2006 皮肤插件：注册 `qq2006` 主题、全局皮肤表与完整素材。
- [vlln/whale-girl](https://github.com/vlln/whale-girl) —— Web GUI 桌面宠物插件（QQ 宠物形态）：右下角悬浮、可拖拽 / 投喂 / 玩耍的积累型伙伴。
- [ccch1mneyyy/dsh-working-activity](https://github.com/ccch1mneyyy/dsh-working-activity) —— 实时模型工作状态行：俏皮思考文案、运行中的工具、回合总结、自我叙述，用于 TUI 提示栏与 Web UI。
- [orriduck/dsh-tui](https://github.com/orriduck/dsh-tui) —— 小巧的、会话感知的 DeepSeek Harness 终端 UI。

## Skill

_打包好的任务能力（基于 markdown 的 skill、工具包）。_

- [Anionex/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit) —— 让纯文本模型更好地做视觉任务：带意图的图片问答、长截图 OCR、UI 还原、grounding、像素 diff、Artifacts 与 Web UI。
- [omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit) —— 零依赖确定性工具包：time / encoding / json / calculator / csv / regex / markdown / diff / stat / schema 十个工具，统一入口一键安装。
- [Anionex/dsh-computer-use](https://github.com/Anionex/dsh-computer-use) —— 电脑控制插件（目前支持 macOS）：新鲜 Accessibility 观测、过期状态拒绝、作用域权限与安全输入。
- [omdsh-dev/dsh-plugin-dev](https://github.com/omdsh-dev/dsh-plugin-dev) —— DSH 插件开发踩坑与做法档案（skill + 文档）：cordis 双副本、tsconfig 三件套、Windows junction、多帧 zstd 等实测记录。
- [omdsh-dev/dsh-tool-csv](https://github.com/omdsh-dev/dsh-tool-csv) —— CSV 数据工具（RFC 4180）：解析 / 查询 / 统计 / 转换 CSV 文本，零依赖状态机解析器。
- [emredeveloper/deepseek-harness-huggingface](https://github.com/emredeveloper/deepseek-harness-huggingface) —— 只读的 Hugging Face Hub 模型检索插件：注册无需 API key 的 `hf_search_models` 工具。
- [omdsh-dev/dsh-plugin-skills](https://github.com/omdsh-dev/dsh-plugin-skills) —— 构建和测试 DSH 插件的 agent skill：从脚手架新插件包到选择测试层级，全程在 agent 会话内完成。

## 资源

- [DeepSeek Harness 概览（ai-bot.cn）](https://ai-bot.cn/deepseek-harness)

## 贡献指南

欢迎 PR！添加插件的步骤：

1. 确保你的仓库带有 **`#dsh`** GitHub topic。
2. 在最合适的分类下添加一条，格式：
   `- [名称](https://链接) —— 简洁的一句话描述。`
3. 每个分区内尽量按字母 / 拼音顺序排列。
4. 一次 PR 只做一件事；描述客观、不吹水。

详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

在法律允许的范围内，贡献者已放弃本作品的所有版权及相关权利。
