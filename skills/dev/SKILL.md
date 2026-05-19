---
name: dev
description: Body skill of v8.5 demo blueprint loop "iter". Implement one task per iteration; write real code to task.output (cwd-relative).
---

# 迭代开发（单任务）

本 skill 是 loop `iter` 的 body。每次迭代调用 bp-context 拉取当前 task 数据，**写出真实可运行代码到 `task.output` 路径**（相对 cwd 根）。

## 步骤

1. Read `references/impl-hints.md`。
2. **写真实代码到 `<task.output>`（相对 cwd 根，例如 `hello-world.html`）**：
   - HTML：完整 DOCTYPE + `<html lang>` + head（charset/viewport/title）+ body
   - CSS：完整选择器 + 属性块，无空白文件
   - JS：ES6+，操作 DOM 前用 `DOMContentLoaded` 守一次
3. 若 `<task.output>` 文件已存在（多个 task 共写同一文件），改用 Read → 编辑 → Write，**不要直接覆盖**——会冲掉前一个 task 的产出。
4. （可选）顺便 Write `/plans/dev-task-<id>.md` 记录决策（标题、思路 1-2 句），不替代真实代码文件。
