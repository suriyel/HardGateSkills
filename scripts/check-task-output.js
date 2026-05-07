#!/usr/bin/env node
// 用法: node check-task-output.js <path>
// 输出: stdout 一行 PASS / WARN: missing / WARN: empty; exit code 始终 0。
'use strict';
const fs = require('fs');
const p = process.argv[2];
if (!p) { console.log('WARN: missing'); process.exit(0); }
if (!fs.existsSync(p)) { console.log('WARN: missing'); process.exit(0); }
let st;
try { st = fs.statSync(p); } catch (_) { console.log('WARN: missing'); process.exit(0); }
if (!st.isFile() || st.size === 0) { console.log('WARN: empty'); process.exit(0); }
console.log('PASS');
