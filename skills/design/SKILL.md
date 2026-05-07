---
name: design
description: Stage 2 of v8.5 demo blueprint. Read requirements.md and produce a brief design.md describing structure / data flow.
---

> ## ⚠ MANDATORY end-of-task protocol (node: design)
> You **MUST** end this session with these two final actions:
> 1. Bash, run exactly ONE of these (substitute `<reason>` / `<path>` with real values; omit `--artifact` if no file produced):
>    - Success: {{ADVANCE_OK artifact=<path>}}
>    - Failure: {{ADVANCE_FAIL notes=<reason>}}
>    - Blocked: {{ADVANCE_BLOCKED notes=<reason>}}
> 2. Final msg: `## Node design Complete · <status> · <artifact>` then `[End of session — DO NOT proceed]`
> About to choose `blocked`? Call **AskUserQuestion** FIRST and let the user decide; report `blocked` only if the user explicitly wants to halt.
> All user questions MUST go through **AskUserQuestion** — never ask in plain text in your assistant output.

# 设计

## 输入

`{{HARNESS_MEMORY_DIR}}/plans/requirements.md`。

## 步骤

1. Read `{{HARNESS_MEMORY_DIR}}/plans/requirements.md`
2. Write `{{HARNESS_MEMORY_DIR}}/plans/design.md`，含：
   - **架构概览**（1-2 段，不必详细）
   - **关键模块**（3-5 条）
   - **数据流向**（简短句子）

写完按 banner 指令上报。
