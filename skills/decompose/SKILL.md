---
name: decompose
description: Stage 3 of v8.5 demo blueprint. Read design.md, decompose into a tasks JSON array, seed the downstream loop via bp-tasks.
---

# 需求拆解

## 输入

`/plans/design.md`。

## Tasks schema


<!-- tasks-schema: default -->
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

{{TASKS_SET loop=iter file=.harness/blueprint/tasks/iter.json}}

> 未声明字段透传，body skill 可用 `{{loop.task.<field>}}` 引用。
