---
name: dev
description: Body skill of v8.5 demo blueprint loop "iter". Process one task per iteration; write a brief implementation note.
---

# 迭代开发（单任务）

本 skill 是 loop `iter` 的 body。每次迭代调用 bp-context 拉取当前 task 数据。

## 步骤

1. Read `{{REFERENCE}}/impl-hints.md` —— 写 plan 前先看一眼结构提示（蓝图自带的公共参考资料）。
2. Bash：{{TASK_GET}} —— 输出 JSON 到 stdout，含 task 完整字段（schema 必填 `id`/`status` + 推荐 `title`/`description` + 任意作者扩展字段）。从 stdout 解析。
3. Bash：`mkdir -p {{HARNESS_MEMORY_DIR}}/plans/`
4. Write `{{HARNESS_MEMORY_DIR}}/plans/dev-task-<id>.md`（用第 2 步取到的真实 task.id 替换 `<id>`），按 impl-hints 的结构写，含：
   - 任务 ID 与 title
   - 实现思路（2-3 句，不必写真实代码）
   - 自检清单（2 条 checkbox）

写完按 banner 指令上报（默认 ok 推进 loop；任务确实做不下去再 failed，loop 会跳过继续）。

> 提示：如需查看全部 tasks 或全局变量，可调 {{TASKS_GET}} / {{VARS_GET}}；按字段路径取值用 {{CONTEXT_GET path=loop.task.<field>}}。
