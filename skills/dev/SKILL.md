---
name: dev
description: Body skill of v8.5 demo blueprint loop "iter". Implement one task per iteration; write real code to task.output (cwd-relative).
---

# 迭代开发（单任务）

本 skill 是 loop `iter` 的 body。每次迭代调用 bp-context 拉取当前 task 数据，**写出真实可运行代码到 `task.output` 路径**（相对 cwd 根）。

## 步骤

1. Read `{{REFERENCE}}/impl-hints.md` —— 看 hello world 的 HTML / CSS / JS 实现要点。
2. Bash：{{TASK_GET}} —— 输出 JSON 到 stdout，从中解析 `task.id` / `task.title` / `task.description` / `task.output`。
3. **写真实代码到 `<task.output>`（相对 cwd 根，例如 `hello-world.html`）**：
   - HTML：完整 DOCTYPE + `<html lang>` + head（charset/viewport/title）+ body
   - CSS：完整选择器 + 属性块，无空白文件
   - JS：ES6+，操作 DOM 前用 `DOMContentLoaded` 守一次
4. 若 `<task.output>` 文件已存在（多个 task 共写同一文件），改用 Read → 编辑 → Write，**不要直接覆盖**——会冲掉前一个 task 的产出。
5. （可选）顺便 Write `{{HARNESS_MEMORY_DIR}}/plans/dev-task-<id>.md` 记录决策（标题、思路 1-2 句），不替代真实代码文件。

> 契约假定：`task.output` 由上游 decompose 必填。dev 不做 schema 防御 —— 若上游真漏字段，下游 gate_coverage 会以 "产出文件未找到" 业务失败 ticket 折返本节点，按 ticket 整改即可。

写完按 banner 上报：{{ADVANCE_OK artifact=<task.output>}}（artifact 字段填真实文件路径，不带 `<>`）。

> 提示：如需查看全部 tasks 或全局变量，可调 {{TASKS_GET}} / {{VARS_GET}}；按字段路径取值用 {{CONTEXT_GET path=loop.task.<field>}}（例如 `loop.task.output`）。
