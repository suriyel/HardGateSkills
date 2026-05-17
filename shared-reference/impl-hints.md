# Hello World 实现要点

写真实可运行代码到 `task.output` 路径（相对 cwd 根）。下列是常见 task 类型的关键点。

## HTML 骨架（如 `hello-world.html`）

- 第一行 `<!DOCTYPE html>`
- `<html lang="zh-CN">`（或与项目语言一致）
- `<head>` 至少含：
  - `<meta charset="UTF-8">`
  - `<meta name="viewport" content="width=device-width, initial-scale=1">`
  - `<title>...</title>`
- `<body>` 内放可见内容（如 `<h1>Hello World</h1>` 或 `<p>...</p>`）
- 若后续 task 要写独立 CSS / JS，预留 `<link rel="stylesheet" href="styles.css">` / `<script src="app.js" defer></script>`

## CSS（如 `styles.css`）

- 选择器 + 完整属性块，避免空白文件
- 居中常用：
  ```css
  body { display: flex; min-height: 100vh; align-items: center; justify-content: center; margin: 0; font-family: system-ui, sans-serif; }
  h1 { color: #333; }
  ```
- 不依赖外部字体 / 图片资源

## JS（如 `app.js`）

- 使用 ES6+，无需 build 步骤
- 操作 DOM 前用 `DOMContentLoaded` 守一次：
  ```js
  document.addEventListener('DOMContentLoaded', () => { /* ... */ });
  ```

## 多 task 共写同一文件时

- 先 Read 当前内容，编辑后再 Write，**不要直接覆盖**（会冲掉前一个 task 的产出）
- 增量加节点 / 加 `<link>` / 加 `<script>` 都属于 Read → 编辑 → Write

## 自检（可选写进 dev-task-<id>.md）

- [ ] `task.output` 文件已生成且非空
- [ ] HTML 文件浏览器 file:// 直接打开能正常渲染
- [ ] 没有未替换的占位符（`<TODO>` / `xxx`）
