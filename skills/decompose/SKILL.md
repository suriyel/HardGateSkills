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
    "title": "实现登录页", // L2 optional: string
    "description": "构造一个简单的 HTML 登录表单" // L2 optional: string
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
2. 派生 items[] 数组（3-5 项；id 从 1 起；title 简短；description 1-2 句；status 留 `"pending"`）
3. Write 数组为 JSON：`{{HARNESS_MEMORY_DIR}}/plans/tasks.json`
4. 调 bp-tasks 把 items 注入下游 loop（**必须做，且必须在按 banner 指令上报 advance 之前**）：
   {{TASKS_SET loop=iter file={{HARNESS_MEMORY_DIR}}/plans/tasks.json}}

写完按 banner 指令上报。
