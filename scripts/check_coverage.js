#!/usr/bin/env node
// v9.0 Hard Gate demo 脚本 — 由蓝图引擎在 kind='script' 节点 spawn。
//
// 契约（与 §1.4 plan 对齐）：
//   stdin: JSON {schemaVersion, kind:'script-input', cwd, harnessRoot,
//                blueprintId, runId, scriptNodeId, rewindTarget, attempt,
//                previousAttempts, lastEnvelope, variables, loop}
//   stdout: 单行 JSON {pass:bool, message:string}  ← 多余字段允许但忽略
//   exit: 0 = 脚本本身正常（pass/fail 由 stdout.pass 决定）；非 0 = 错误
//
// 本脚本逻辑（演示用）：
//   1. 读 stdin 拿到当前 task（含 task.output 文件名）
//   2. 检查 task.output 文件是否存在于 cwd
//   3. 如果不存在 → pass=false, message="未找到产出文件 ..."
//   4. 如果存在 → 简单基于行数估"覆盖率"（行数 >= 10 即视为达标）
//   5. 如果 attempt >= 2 强制 pass（演示用；真实场景应严格判定）
//      —— 这让 demo 在 review 软打回后 + dev 整改 + gate 二次判定通过的故事完整

'use strict';

const fs = require('fs');
const path = require('path');

let input = '';
try { input = fs.readFileSync(0, 'utf8'); } catch (_) {}
let ctx = {};
try { ctx = JSON.parse(input); } catch (_) {}

const minCov = parseFloat(process.env.MIN_COVERAGE || '80');
const cwd = ctx.cwd || process.cwd();
const task = ctx.loop && ctx.loop.task;
const taskOutput = task && task.output;
const attempt = ctx.attempt || 1;

function emit(pass, message) {
  process.stdout.write(JSON.stringify({ pass: !!pass, message: String(message || '') }));
  process.exit(0);
}

if (!taskOutput) {
  emit(false, '当前 task 缺少 output 字段。请在 decompose 阶段为 task 显式声明 output（产出文件名）。');
}

const fullPath = path.join(cwd, taskOutput);
if (!fs.existsSync(fullPath)) {
  emit(false,
    '**产出文件未找到**：\`' + taskOutput + '\`\n\n'
    + '当前 task：' + (task.title || task.id) + '\n'
    + '期望路径：' + fullPath + '\n\n'
    + '### 整改建议\n'
    + '1. 确认 dev 真的把代码写到了 \`' + taskOutput + '\` 这个相对路径\n'
    + '2. 检查路径拼写是否与 task.output 字段一致\n'
    + '3. 写完后调 \`bp-advance ok\` 重新进入下一轮 review + gate'
  );
}

let lineCount = 0;
try {
  const content = fs.readFileSync(fullPath, 'utf8');
  lineCount = content.split(/\r?\n/).filter((l) => l.trim()).length;
} catch (e) {
  emit(false, '读取产出文件失败: ' + e.message);
}

// "覆盖率"占位符 — 真实场景应跑 c8 / pytest --cov 等
const fakeCoverage = Math.min(100, lineCount * 8);

// Demo: attempt >= 2 自动通过（让用户能看到完整 fail → 整改 → pass 闭环）
if (attempt >= 2) {
  emit(true, 'coverage ' + fakeCoverage + '% (attempt=' + attempt + ' demo: 强制通过)');
}

if (fakeCoverage < minCov) {
  emit(false,
    '**" 覆盖率 "不达标**：当前 ' + fakeCoverage + '% < 目标 ' + minCov + '%\n\n'
    + '产出文件：\`' + taskOutput + '\` (有效行 ' + lineCount + ' 行)\n'
    + 'attempt: ' + attempt + ' / 3\n\n'
    + '### 整改建议\n'
    + '1. 文件内容过少 — 补充实质性代码（demo 阈值：≥10 有效行）\n'
    + '2. 真实业务中应跑 \`npx c8 ...\` 算覆盖率；本 demo 用行数估算演示流程\n'
    + '3. 整改后调 \`bp-advance ok\` 进入下一轮 review + gate'
  );
}

emit(true, 'coverage ' + fakeCoverage + '% ≥ ' + minCov + '%');
