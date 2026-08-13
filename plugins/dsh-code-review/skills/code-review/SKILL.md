---
name: code-review
description: 结构化代码审查执行清单：先用 code_review_context 固定审查对象（同一 diff 快照），再按正确性 → 安全 → 测试 → 可维护性四层给出可行动的评审意见。适用于"review 一下这个改动 / 这个 PR / 未提交的代码"类请求。
metadata:
  version: "0.1.0"
  reference: "https://github.com/Dominic789654/awesome-deepseek-harness"
---

# Code Review

执行清单，不是教材。目标：给出**可行动**的评审，而不是复述 diff。

## 1. 固定审查对象

1. 用 `code_review_context` 拿到 diff 快照：
   - 未提交改动 → `scope: worktree`
   - 已暂存改动 → `scope: staged`
   - 分支/PR → `scope: range`, `range: main..HEAD`（或用户给的范围）
2. `truncated: true` 时按目录用 `paths` 分批重新收集，不要凭截断的 diff 下结论。
3. 需要理解上下文时才读改动周边的源文件；不要全仓漫游。

## 2. 四层检查（按严重度排序输出）

1. **正确性**：边界条件、错误处理、并发/竞态、资源泄漏（未关闭/未 dispose）、破坏性 API 变更的调用点。
2. **安全**：注入（shell/SQL/路径穿越）、未验证的外部输入、secrets 入库、过宽的权限或网络面。
3. **测试**：改动是否被现有测试覆盖；新逻辑缺哪些最小测试；测试是否真的会失败（非恒真断言）。
4. **可维护性**：命名与意图偏差、重复逻辑、超长函数、遗漏的文档/注释更新。风格问题合并成一条，不逐行刷屏。

## 3. 输出格式

- 逐条给：`[严重度] 文件:行 — 问题 — 建议修复`（严重度：blocker / major / minor / nit）。
- 最后一段给整体结论：可合并 / 修复 blocker 后可合并 / 需要重做，并列出 blocker 清单。
- 没发现问题时明说"按上述四层未发现问题"，并指出覆盖不到的盲区（如未运行测试）。

## 4. 红线

- 只读：本 skill 不修改代码；用户要求修复时另起明确的编辑步骤。
- 不基于截断的 diff 断言"没有其他问题"。
- 引用行号必须来自本次 diff 快照，不要凭记忆。
