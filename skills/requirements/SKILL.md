---
name: requirements
description: Stage 1 of v8.5 demo blueprint. Extract a brief requirements doc from the user prompt and write it to {{HARNESS_MEMORY_DIR}}/plans/requirements.md.
---

# 需求分析

从用户最新消息中识别核心需求，产出 **1 页 markdown** 作为下游 design 阶段的输入。

## 步骤

1. Bash：`mkdir -p {{HARNESS_MEMORY_DIR}}/plans/`
2. Write `{{HARNESS_MEMORY_DIR}}/plans/requirements.md`，含：
   - **项目目标**（1-2 句）
   - **核心功能**（3-5 条）
   - **非功能要求**（性能/安全/兼容性，可省）

写完即按 banner 指令上报。
