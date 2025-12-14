# 项目 _meta.json 格式说明

## 文件位置

`{SCRIPTS_DIR}/{project_id}/_meta.json`

示例:
- `scripts/20251214-AI工具测评/_meta.json`
- `脚本/20251214-AI工具测评/_meta.json`

## 核心作用

存储单个项目的完整信息:
- 项目基本信息 (名称、描述)
- 项目状态和进度
- 7 个阶段的详细信息
- 工作流元数据 (平台、时长、受众)

## 完整结构

```json
{
  "version": "1.0",
  "project_id": "20251214-AI工具测评",
  "name": "AI工具测评",
  "description": "对比主流AI写作工具的优劣",
  "status": "explore",
  "stage": "idea",
  "progress": 0,
  "created_at": "2025-12-14T10:22:00.000Z",
  "updated_at": "2025-12-14T10:22:00.000Z",

  "metadata": {
    "workflow_type": null,
    "duration": "",
    "platform": "",
    "audience": ""
  },

  "stages": [
    {
      "id": 1,
      "name": "idea",
      "display_name": "选题沟通",
      "file": "阶段/选题沟通.md",
      "completed": false
    },
    {
      "id": 2,
      "name": "frame",
      "display_name": "框架搭建",
      "file": "阶段/框架搭建.md",
      "completed": false
    },
    {
      "id": 3,
      "name": "research",
      "display_name": "内容调研",
      "file": "上下文/调研/调研报告.md",
      "completed": false
    },
    {
      "id": 4,
      "name": "outline",
      "display_name": "大纲确认",
      "file": "阶段/大纲确认.md",
      "completed": false
    },
    {
      "id": 5,
      "name": "draft",
      "display_name": "脚本撰写",
      "file": "阶段/脚本草稿.md",
      "completed": false
    },
    {
      "id": 6,
      "name": "optimize",
      "display_name": "优化编辑",
      "file": "阶段/脚本草稿.md",
      "completed": false
    },
    {
      "id": 7,
      "name": "publish",
      "display_name": "最终输出",
      "file": "最终脚本.md",
      "completed": false
    }
  ]
}
```

## 字段说明 (精简版)

### 基本信息
- **version**: "1.0" (固定)
- **project_id**: 项目唯一标识符 (YYYYMMDD-项目名)
- **name**: 项目名称
- **description**: 项目描述 (可选,默认 "")

### 状态字段
- **status**: "explore" / "active" / "completed" / "archived"
- **stage**: "idea" / "frame" / "research" / "outline" / "draft" / "optimize" / "publish"
- **progress**: 0-100 (整数)

### 时间戳
- **created_at**: 创建时间 (ISO 8601)
- **updated_at**: 最后更新时间 (ISO 8601)

### 元数据对象
- **workflow_type**: null / "content-driven" / "structure-driven" / "data-driven"
- **duration**: 预期时长 (如 "10min", "3分钟")
- **platform**: 目标平台 (如 "YouTube", "Bilibili")
- **audience**: 目标受众 (如 "科技从业者")

### 阶段数组
每个阶段包含:
- **id**: 1-7
- **name**: 英文标识符
- **display_name**: 显示名称 (根据 dirLang)
- **file**: 文件路径 (相对于项目目录)
- **completed**: true/false

## 创建时的默认值

**由 project-manager skill 创建时**:

```json
{
  "version": "1.0",
  "project_id": "{生成的 ID}",
  "name": "{从用户输入提取}",
  "description": "",
  "status": "explore",
  "stage": "idea",
  "progress": 0,
  "created_at": "{当前时间}",
  "updated_at": "{当前时间}",

  "metadata": {
    "workflow_type": null,
    "duration": "",
    "platform": "",
    "audience": ""
  },

  "stages": [
    // 7 个阶段,全部 completed: false
  ]
}
```

## 多语言支持

### dirLang = "zh" (中文)
```json
{
  "display_name": "选题沟通",
  "file": "阶段/选题沟通.md"
}
```

### dirLang = "en" (英文)
```json
{
  "display_name": "Idea Communication",
  "file": "stages/idea.md"
}
```

## 更新规则

### Stage 1 (选题沟通) 完成后
```json
{
  "stage": "frame",
  "progress": 14,
  "updated_at": "{当前时间}",
  "metadata": {
    "workflow_type": "content-driven",
    "duration": "10min",
    "platform": "YouTube",
    "audience": "Tech professionals"
  },
  "stages": [
    {
      "id": 1,
      "name": "idea",
      "completed": true  // ← 标记完成
    },
    ...
  ]
}
```

### 阶段转换规则
```
idea → frame       (progress: 0 → 14)
frame → research   (progress: 14 → 29)
research → outline (progress: 29 → 43)
outline → draft    (progress: 43 → 57)
draft → optimize   (progress: 57 → 71)
optimize → publish (progress: 71 → 86)
publish → 完成      (progress: 86 → 100, status: "explore/active" → "completed")
```

## 与 scripts/_meta.json 的同步

**创建项目时**:
1. 创建项目目录结构
2. 创建 `{project_id}/_meta.json` (详细信息)
3. 更新 `scripts/_meta.json` (添加到索引)

**更新阶段时**:
1. 更新 `{project_id}/_meta.json` (stage, progress, stages[].completed)
2. 同步更新 `scripts/_meta.json` (stage, updated_at)

**完成项目时**:
1. 更新 `{project_id}/_meta.json` (status: "completed", progress: 100)
2. 同步更新 `scripts/_meta.json` (status: "completed")

## 读写操作

### 读取当前阶段
```bash
# 读取项目 _meta.json
cat "{CURRENT_PROJECT}/_meta.json"

# 提取 stage 字段
# 输出: "idea" / "frame" / "research" 等
```

### 更新进度
```bash
# 使用 Edit 工具更新
# 将 "progress": 0 改为 "progress": 14
# 同时更新 "updated_at"
```

### 标记阶段完成
```bash
# 使用 Edit 工具更新
# 将对应阶段的 "completed": false 改为 "completed": true
# 同时更新 "stage" 为下一阶段
```

## 参考文档

**详细说明**: [meta-structure.md](meta-structure.md)

---

**版本**: v1.0
**最后更新**: 2025-12-14
**说明**: 精简版文档,详细内容见 meta-structure.md
