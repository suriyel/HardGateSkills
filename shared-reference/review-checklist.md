# Review Checklist

review 是 informational 性质，永远 ADVANCE_OK，不阻塞 loop。仅按下面几条判断状态：

- [ ] `task.output` 文件存在
- [ ] `task.output` 文件非空（size > 0）
- [ ] 文件后缀与 task title 描述匹配（HTML 任务产 `.html`、CSS 任务产 `.css`、JS 任务产 `.js`）
- [ ] 文件内容看起来不是占位符（不是只含 `<TODO>` / `xxx` 这类残留）
- [ ] HTML 文件至少含 `<!DOCTYPE html>` 行（如适用）

以上任意条不满足 → 在 review 摘要里记 `warn (informational)`，但仍 ADVANCE_OK。
