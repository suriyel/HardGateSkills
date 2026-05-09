#!/usr/bin/env node
// v9.0 Hard Gate demo 脚本 — 由蓝图引擎在 kind='script' 节点 spawn.
//
// Stdin/Stdout 契约: 见 server-blueprint/script-io-schema.js (schemaVersion=2)
// hardgate 引擎 / 本脚本 / 测试 / DESIGN §20.2 字段表 都从那个文件派生.
//
// 业务责任划分 (DESIGN §20.6):
//   emit(pass=false, message)  - 业务失败, 走 ticket 折返 onFail.rewindTo
//                                (上游 LLM 真能整改的事, 如代码不够 / 文件不存在)
//   process.exit(2)            - schema/IO 工程异常, 引擎 halted (dev 修不了的事,
//                                如 schema 不识别 / 路径是目录 / 权限问题)
//
// 本脚本逻辑 (演示用):
//   1. 读 stdin 拿到当前 task (含 task.output 文件名)
//   2. 检查 task.output 文件是否存在于 cwd
//   3. 如果不存在 → emit(pass=false, message="未找到产出文件 ...")
//   4. 如果存在 → 简单基于行数估"覆盖率" (行数 >= 10 即视为达标)
//   5. 如果 attempt >= 2 强制 pass (演示用; 真实场景应严格判定)

'use strict';

const fs = require('fs');
const path = require('path');

// ---- 1. 读 stdin + schema 防御 ----
let input = '';
try { input = fs.readFileSync(0, 'utf8'); } catch (_) {}
let ctx;
try { ctx = JSON.parse(input); }
catch (e) { exitFatal('schema_error: invalid stdin JSON: ' + e.message); }
if (ctx.schemaVersion !== 2) {
  exitFatal('schema_error: unsupported script-input schemaVersion='
    + ctx.schemaVersion + ' (this script supports 2; see DESIGN §20.11)');
}

function exitFatal(msg) {
  process.stderr.write(msg + '\n');
  process.exit(2);
}

function emit(pass, message) {
  process.stdout.write(JSON.stringify({ pass: !!pass, message: String(message || '') }));
  process.exit(0);
}

// ---- 2. 取 task.output (走 v9.2+ loopStack, 不读已删的 .loop) ----
const cwd = ctx.cwd || process.cwd();
const minCov = parseFloat(process.env.MIN_COVERAGE || '80');
const attempt = ctx.attempt || 1;

const topFrame = (Array.isArray(ctx.loopStack) && ctx.loopStack.length > 0)
  ? ctx.loopStack[ctx.loopStack.length - 1]
  : null;
const task = topFrame && topFrame.task;
if (!task || !task.output) {
  // 上游 decompose 漏 task.output —— §20.6 schema 异常, dev 修不了 → exit 2
  // (而非 ticket 折返死循环). 用户应排查 decompose skill 输出, 或修 task
  // schema 把 output 升级为 requiredField.
  exitFatal('schema_error: task.output missing on current task '
    + JSON.stringify(task && task.id));
}
const taskOutput = task.output;

// ---- 3. 检查产出文件存在 (业务校验, 失败 → ticket 折返 dev) ----
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

// ---- 4. 读文件 + 估覆盖率 ----
let lineCount = 0;
try {
  const content = fs.readFileSync(fullPath, 'utf8');
  lineCount = content.split(/\r?\n/).filter((l) => l.trim()).length;
} catch (e) {
  // EISDIR / EACCES 等 IO 工程异常 → exit 2 让引擎 halted (而非 ticket 折返).
  // 例: task.output 指向目录而非文件 → readFileSync 抛 EISDIR. dev 改不了
  // 这种类型的事, 操作员要查 task 元数据或文件系统状态.
  exitFatal('io_error: read ' + fullPath + ': ' + e.message);
}

// "覆盖率" 占位符 — 真实场景应跑 c8 / pytest --cov 等
const fakeCoverage = Math.min(100, lineCount * 8);

// Demo: attempt >= 2 自动通过 (让用户能看到完整 fail → 整改 → pass 闭环)
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
