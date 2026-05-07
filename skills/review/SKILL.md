---
name: review
description: Body skill of v8.5 demo blueprint loop "iter" (after dev). Validate dev's plan against scripts + reference; write a review note; always advance OK.
---

# 迭代开发 · 简易 Review

本 skill 是 loop `iter` 的 body 第二步，跟在 `dev` 之后跑。验证 dev 写的 plan 是否合规，写一份 review 摘要。**始终 ADVANCE_OK**（demo 顺畅，不阻塞 loop）。

## 步骤

1. Bash：{{TASK_GET}} —— 输出 JSON 到 stdout，从中解析 `task.id` 与 `task.title`。
2. Read `{{REFERENCE}}/review-checklist.md` —— 把准则记在 prompt 里，作为评审依据。
3. Bash：`node {{SCRIPTS}}/check-task-md.js {{HARNESS_MEMORY_DIR}}/plans/dev-task-<id>.md`
   —— 用第 1 步取到的真实 task.id 替换 `<id>`。捕获 stdout 第一行：`PASS` 或 `WARN: missing …`。
   - 若 bash 返回非空 stderr，简短记下，不阻塞。
4. Write `{{HARNESS_MEMORY_DIR}}/plans/review-task-<id>.md`，含：
   - 一级标题：`# Review of task <id> — <title>`
   - "脚本结果"：贴第 3 步 stdout 第一行
   - "Checklist 对比"：从 checklist 中挑 1-2 条最相关的，写一行简评
   - "结论"：`ok` 或 `warn (informational)`（始终不算 fail）
5. 写完后按 banner 指令上报 ok（{{ADVANCE_OK artifact={{HARNESS_MEMORY_DIR}}/plans/review-task-<id>.md}}）。

> 提示：本 skill 是 demo 形态，不做真正的代码评审；只演示 `{{SCRIPTS}}` / `{{REFERENCE}}` 两个 placeholder 的用法。任何检查失败都只产生 informational warning，绝不阻塞 loop。
