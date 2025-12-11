# 更新日志

本文档记录项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [1.0.3] - 2025-12-11

### 新增
- **多语言目录支持**：新增 `dirLang` 配置，支持中英文目录和文件名
  - 英文目录：`scripts/`、`references/`
  - 中文目录：`脚本/`、`参考资料/`

- **模式字段**：在 `config.json` 中新增 `mode` 字段
  - `mode: 1` = Mode 1（选题驱动 / Topic Selection Driven）

- **工作流类型**：在项目的 `_meta.json` 中新增 `workflowType` 字段
  - 初始值：`null`（由 Agent 根据上下文动态判断）
  - 支持值：`"content-driven"`、`"structure-driven"`、`"data-driven"`

### 修复
- 修复初始化时 `config.json` 缺少 `mode` 字段的问题
- 修正配置结构：`mode` 字段现在正确保存在 `config.json` 中，`workflowType` 保存在 `_meta.json` 中

### 变更
- 优化初始化流程，确保所有必要的配置字段都被正确创建
- 统一术语：Mode 1/2/3 统一使用 4 字中文名称
  - Mode 1：选题驱动（Topic Selection Driven）
  - Mode 2：结构驱动（Structure Driven）
  - Mode 3：数据驱动（Data Driven）

---

## [1.0.2] - 2025-12-10

### 修复
- 修复 npm 发布格式问题
- 完善 package.json 配置

---

## [1.0.1] - 2025-12-09

### 新增
- 初始发布
- 完整的 Mode 1（选题驱动）工作流
- 7 阶段脚本创作流程
- 双语支持（中文/英文）
- CLI 交互式界面

---

[1.0.3]: https://github.com/waoooolab/genkicap-video-workflow-v1.0/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/waoooolab/genkicap-video-workflow-v1.0/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/waoooolab/genkicap-video-workflow-v1.0/releases/tag/v1.0.1
