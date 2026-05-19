#!/usr/bin/env node
// 用法: node check-task-md.js <path-to-md>
// 输出: stdout 一行 PASS 或 WARN: missing <list>; exit code 始终 0。
const fs = require('fs');
const target = process.argv[2];
if (!target) {
  console.log('WARN: no input path');
  process.exit(0);
}
let txt = '';
try {
  txt = fs.readFileSync(target, 'utf8');
} catch (e) {
  console.log('WARN: cannot read ' + target);
  process.exit(0);
}
const checks = [
  { name: 'task-id', re: /(?:任务\s*ID|task\s*id)/i },
  { name: 'thinking', re: /(?:实现思路|思路|approach)/i },
  { name: 'checklist', re: /\[\s*[xX ]\s*\]/ },
];
const missing = checks.filter((c) => !c.re.test(txt)).map((c) => c.name);
console.log(missing.length === 0 ? 'PASS' : 'WARN: missing ' + missing.join(', '));
