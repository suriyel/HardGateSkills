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
    "dependencies": [], // L1 必填: array; items: string | number; default []
    "title": "实现 HTML 骨架", // L2 optional: string
    "description": "包含 DOCTYPE / head meta / body / Hello World 文本", // L2 optional: string
    "output": "hello-world.html" // L2 optional: string
  }
]
```

## ⚠️ 灌入 `iter` loop（必须执行，否则 run 卡死）

**漏调后果**：下游 `iter` loop 入口检测 `state.loops.iter.tasks` 为空 → halt（reason: `loop_no_tasks_seeded`）。

**步骤**：
1. 根据上面 schema 结构和你的分析结果，构造 items JSON 数组（每条 task 的 id 必须唯一）
2. **在 `bp-advance` 之前**执行以下命令将 items JSON 直接灌入引擎 state：

{{TASKS_SET loop=iter}}

（触发条件：`status == "ok"`）

> 未声明字段透传，body skill 可用 `{{loop.task.<field>}}` 引用。
<!-- SCHEMA END: default -->


## 步骤

1. Read `{{HARNESS_MEMORY_DIR}}/plans/design.md`
2. 派生 items[] 数组（3-5 项；id 从 1 起；title 简短；description 1-2 句说"这步要实现什么"；status 留 `"pending"`；**`output` 字段必填，是下游 dev / gate_coverage 节点的硬契约，不可省略；填该 task 要产出的文件相对路径，相对 cwd 根，例如 `hello-world.html`、`styles.css`、`app.js`**）
   - 若多个 task 共写同一文件（增量加内容到同一 HTML），它们的 `output` 字段填同一路径，下游 dev skill 会用 Read → 编辑 → Write 而不是覆盖
3. Write 数组为 JSON：`{{HARNESS_MEMORY_DIR}}/plans/tasks.json`
4. 调 bp-tasks 把 items 注入下游 loop（**必须做，且必须在按 banner 指令上报 advance 之前**）：
   {{TASKS_SET loop=iter file={{HARNESS_MEMORY_DIR}}/plans/tasks.json}}

写完按 banner 指令上报。
