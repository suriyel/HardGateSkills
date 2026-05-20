#!/usr/bin/env node
// v10 Hard Gate demo 脚本 — 简化版: 只判断当前 task.output 文件是否存在.
//
// v10: 由 review skill 的 LLM 直接 `node` 运行（无框架 stdin）。从
// <cwd>/.harness/blueprint/state.json 读当前 loop 的 tasks[taskIndex] 拿 task.output。
// stdout 末行 JSON {pass, message}，由 review skill 读取后归一为 OK/FAIL/BLOCKED。
//
// 业务语义:
//   emit(pass=true)   task.output 文件存在 → 通过
//   emit(pass=false)  task.output 不存在 / 无法确定 task → review skill 报 failed 折返 dev

'use strict';

const fs = require('fs');
const path = require('path');

// ---- 1. 读框架 state（v10：由 review skill 的 LLM 直接运行，无 stdin）----
const cwd = process.cwd();

function emit(pass, message) {
  process.stdout.write(JSON.stringify({ pass: !!pass, message: String(message || '') }));
  process.exit(0);
}

let state = {};
try { state = JSON.parse(fs.readFileSync(path.join(cwd, '.harness', 'blueprint', 'state.json'), 'utf8')); }
catch (_) { /* state 不可读 */ }

// ---- 2. 取当前 task.output（state.loops 当前 loop 的 tasks[taskIndex]）----
const attempt = 1;
let task = null;
for (const lid of Object.keys(state.loops || {})) {
  const ls = state.loops[lid];
  if (ls && Array.isArray(ls.tasks) && ls.tasks.length) {
    const ti = typeof ls.taskIndex === 'number' ? ls.taskIndex : 0;
    task = ls.tasks[ti] || ls.tasks[0];
    if (task) break;
  }
}
if (!task || !task.output) {
  emit(false, '无法确定当前 task 或其 output 字段（state.loops 为空或 task 缺 output）。'
    + '请确认 decompose 已灌入含 output 的 tasks，且 dev 正处于某 task 迭代中。');
}
const taskOutput = task.output;

// ---- 3. 判断文件存在 ----
const fullPath = path.join(cwd, taskOutput);
if (!fs.existsSync(fullPath)) {
  emit(false,
    '**产出文件未找到**: `' + taskOutput + '`\n\n'
    + '当前 task: ' + (task.title || task.id) + '\n'
    + '期望路径: ' + fullPath + '\n'
    + 'attempt: ' + attempt + ' / 3\n\n'
    + '### 整改建议\n'
    + '1. 确认 dev 真的把代码写到了 `' + taskOutput + '` 这个相对路径\n'
    + '2. 检查路径拼写是否与 task.output 字段一致\n'
    + '3. 写完后调 `bp-advance ok` 重新进入下一轮 review + gate');
}

emit(true, '产出文件存在: `' + taskOutput + '`');
