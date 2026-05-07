---
name: decompose
description: Stage 3 of v8.5 demo blueprint. Read design.md, decompose into a tasks JSON array, seed the downstream loop via bp-tasks.
---

# 需求拆解

## 输入

`{{HARNESS_MEMORY_DIR}}/plans/design.md`。

## Tasks schema

<!-- SCHEMA START: default -->
### Tasks schema "default" — items[] for `bp-tasks set iter`

```json
// items[] 结构（注释即字段语义）
[
  {
    "id": 1, // L1 必填: string | number
    "status": "pending", // L1 必填: string; default "pending"; doneValues=["done"] 时该 task 视为完成
    "title": "实现 HTML 骨架", // L2 optional: string
    "description": "包含 DOCTYPE / head meta / body / Hello World 文本", // L2 optional: string
    "output": "hello-world.html" // L2 optional: string
  }
]
```

**步骤**（在 bp-advance 之前**必须**执行）：
1. 把派生的 items 数组持久化到 `{{HARNESS_MEMORY_DIR}}/plans/<topic>-iter-tasks.json`（`<topic>` 与本 skill 已产出的 srs/design 等 doc 同主题；文件名 LLM 自行匹配填入）
2. 用 `--items-file` 调用 bp-tasks（避免长 JSON 拼 bash 转义问题）：

{{TASKS_SET loop=iter file=<path>}}
（触发条件：`status == "ok"`）

> 未声明字段透传，body skill 可用 `{{loop.task.<field>}}` 引用。
<!-- SCHEMA END: default -->

## 步骤

1. Read `{{HARNESS_MEMORY_DIR}}/plans/design.md`
2. 派生 items[] 数组（3-5 项；id 从 1 起；title 简短；description 1-2 句说"这步要实现什么"；status 留 `"pending"`；**`output` 字段填该 task 要产出的文件相对路径，相对 cwd 根，例如 `hello-world.html`、`styles.css`、`app.js`**）
   - 若多个 task 共写同一文件（增量加内容到同一 HTML），它们的 `output` 字段填同一路径，下游 dev skill 会用 Read → 编辑 → Write 而不是覆盖
3. Write 数组为 JSON：`{{HARNESS_MEMORY_DIR}}/plans/tasks.json`
4. 调 bp-tasks 把 items 注入下游 loop（**必须做，且必须在按 banner 指令上报 advance 之前**）：
   {{TASKS_SET loop=iter file={{HARNESS_MEMORY_DIR}}/plans/tasks.json}}

写完按 banner 指令上报。
