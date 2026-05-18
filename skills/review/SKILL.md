---
name: review
description: Body skill of v8.5 demo blueprint loop "iter" (after dev). Verify task.output file exists + non-empty; write a review note; always advance OK.
---

# 迭代开发 · 简易 Review

## 步骤

1. Read `/review-checklist.md` —— 把准则记在 prompt 里，作为评审依据。
3. Bash：`node script/check-task-output.js <task.output>`
   —— 用第 1 步取到的真实 task.output 替换 `<task.output>`。捕获 stdout 第一行：`PASS` / `WARN: missing` / `WARN: empty`。
   - 若 bash 返回非空 stderr，简短记下，不阻塞。
   - 契约假定 `task.output` 由上游 decompose 必填，本步不做缺字段防御。
4. Write `/plans/review-task-<id>.md`，含：
   - 一级标题：`# Review of task <id> — <title>`
   - "脚本结果"：贴第 3 步 stdout 第一行
   - "Checklist 对比"：从 checklist 中挑 1-2 条最相关的，写一行简评（如"HTML 文件含 DOCTYPE"）
   - "结论"：`ok` 或 `warn (informational)`（始终不算 fail）
