# scripts/_meta.json 格式说明

## 核心设计理念

**轻量级项目索引**: 仅存储项目列表和基本信息,用于快速查询和状态筛选。

## 完整结构

```json
{
  "version": "1.0",
  "last_updated": "2025-12-14T10:22:00.000Z",
  "total_projects": 3,
  "projects": [
    {
      "project_id": "20251214-AI工具测评",
      "name": "AI工具测评",
      "status": "explore",
      "stage": "idea",
      "updated_at": "2025-12-14T10:22:00.000Z"
    },
    {
      "project_id": "20251213-短视频运营策略",
      "name": "短视频运营策略",
      "status": "active",
      "stage": "draft",
      "updated_at": "2025-12-13T15:30:00.000Z"
    },
    {
      "project_id": "20251210-技术分享",
      "name": "技术分享",
      "status": "completed",
      "stage": "publish",
      "updated_at": "2025-12-10T09:00:00.000Z"
    }
  ]
}
```

## 字段说明

### 顶层字段

- **version**: 元数据版本 (当前为 "1.0")
- **last_updated**: 索引最后更新时间 (ISO 8601 格式)
- **total_projects**: 项目总数
- **projects**: 项目列表数组

### 项目对象字段

每个项目对象包含 5 个核心字段:

- **project_id**: 项目唯一标识符 (格式: `YYYYMMDD-项目名`)
- **name**: 项目名称 (用户友好的显示名称)
- **status**: 项目状态
  - `"explore"`: 探索阶段 (刚创建,正在选题)
  - `"active"`: 活跃状态 (正在进行中)
  - `"completed"`: 已完成
  - `"archived"`: 已归档 (trash 的软删除状态)
- **stage**: 当前阶段标识符
  - `"idea"`: 选题沟通
  - `"frame"`: 框架搭建
  - `"research"`: 内容调研
  - `"outline"`: 大纲确认
  - `"draft"`: 脚本撰写
  - `"optimize"`: 优化编辑
  - `"publish"`: 最终输出
- **updated_at**: 项目最后更新时间 (ISO 8601 格式)

## 设计原则

### 1. 最小化存储

**只存储必要信息**:
- ✅ 项目 ID、名称、状态、阶段、更新时间
- ❌ 不存储完整的 stages 数组
- ❌ 不存储详细的 metadata
- ❌ 不存储项目描述

**原因**: 详细信息存储在各项目的 `_meta.json` 中,避免数据冗余和同步问题。

### 2. 快速查询

**支持的查询场景**:
```bash
# 1. 查找 in_progress 项目 (status = "explore" or "active")
grep -E '"status": "(explore|active)"' scripts/_meta.json

# 2. 根据 project_id 查找项目
grep '"project_id": "20251214-AI工具测评"' scripts/_meta.json

# 3. 按状态筛选
grep '"status": "completed"' scripts/_meta.json
```

### 3. 状态定义

| 状态 | 含义 | 使用场景 |
|------|------|---------|
| `explore` | 探索阶段 | 刚创建项目,正在选题沟通 |
| `active` | 活跃状态 | 框架确认后,正在内容调研/撰写 |
| `completed` | 已完成 | 脚本已输出,项目结束 |
| `archived` | 已归档 | 软删除,不显示在列表中 |

**状态转换**:
```
explore → active (完成选题沟通后)
active → completed (输出最终脚本后)
completed → archived (用户手动归档)
explore/active → archived (用户放弃项目)
```

## 文件操作规范

### 创建 scripts/_meta.json

**首次创建** (scripts 目录为空时):
```json
{
  "version": "1.0",
  "last_updated": "2025-12-14T10:22:00.000Z",
  "total_projects": 0,
  "projects": []
}
```

### 添加新项目

**步骤**:
1. 读取 `scripts/_meta.json`
2. 在 `projects` 数组末尾添加新项目对象
3. 更新 `total_projects` (+1)
4. 更新 `last_updated` 为当前时间
5. 写回文件

### 更新项目状态

**步骤**:
1. 读取 `scripts/_meta.json`
2. 找到对应 `project_id` 的项目
3. 更新 `status`, `stage`, `updated_at` 字段
4. 更新顶层 `last_updated`
5. 写回文件

### 删除项目 (软删除)

**步骤**:
1. 读取 `scripts/_meta.json`
2. 找到对应 `project_id` 的项目
3. 将 `status` 改为 `"archived"`
4. 更新顶层 `last_updated`
5. 写回文件

**注意**: 不实际删除项目对象,只改变状态。

## 与项目 _meta.json 的关系

**scripts/_meta.json** (轻量级索引):
- 存储所有项目的列表
- 用于快速查询和状态筛选
- 由 project-manager skill 维护

**{project-id}/_meta.json** (详细信息):
- 存储单个项目的完整信息
- 包含 stages 数组、metadata、description 等
- 由工作流各阶段更新

**同步规则**:
- 创建项目时: 同时创建两个 _meta.json
- 更新阶段时: 更新项目 _meta.json,同时同步到 scripts/_meta.json
- 查询项目时: 先查 scripts/_meta.json (快速),再读项目 _meta.json (详细)

## 使用示例

### 检查是否有进行中的项目

```bash
# 读取 scripts/_meta.json
cat scripts/_meta.json

# 提取 status 为 explore 或 active 的项目
# 如果有,返回项目信息
# 如果没有,返回空
```

### 创建新项目后更新索引

```bash
# 1. 读取现有 scripts/_meta.json
# 2. 添加新项目到 projects 数组
# 3. 更新 total_projects 和 last_updated
# 4. 写回文件
```

### 切换到现有项目

```bash
# 1. 读取 scripts/_meta.json
# 2. 展示项目列表给用户
# 3. 用户选择项目
# 4. 返回 project_id
```

## 重要注意事项

### 文件不存在处理

**首次运行** (scripts/_meta.json 不存在):
```bash
# 检查文件是否存在
ls scripts/_meta.json 2>&1

# 如果输出包含 "No such file"
# → 创建空的 scripts/_meta.json
# → 继续后续流程
```

### JSON 格式规范

- **时间戳**: 必须使用 ISO 8601 格式 (`2025-12-14T10:22:00.000Z`)
- **字段命名**: 统一使用 snake_case (`project_id`, `updated_at`)
- **数组**: 即使为空也保留 (`"projects": []`)

### 错误处理

**文件损坏**:
- 备份损坏的文件为 `_meta.json.backup`
- 重新创建空的 scripts/_meta.json
- 从各项目目录的 _meta.json 重建索引

**项目不存在**:
- scripts/_meta.json 中有记录,但项目目录不存在
- 标记为 `"archived"` 状态
- 提示用户清理索引

---

**版本**: v1.0
**最后更新**: 2025-12-14
**设计目标**: 轻量级、快速查询、易于维护
