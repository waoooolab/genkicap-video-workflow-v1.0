# config.json 结构说明

工作空间级配置文件，位于工作空间根目录，由 `npx @waoooo/genkicap-workflow` 初始化时创建。

## 完整结构

```json
{
  "mode": 1,
  "niche": "Tech/AI",
  "platform": "YouTube",
  "audience": "Professionals",
  "defaultDuration": "10min",
  "accountName": "@myChannel",
  "dirLang": "en",
  "aiLang": "en",
  "dirNames": {
    "scripts": "scripts",
    "stages": "stages",
    "contexts": "contexts",
    "research": "research",
    "videos": "videos",
    "channels": "channels",
    "archive": "_archive"
  },
  "fileNames": {
    "meta": "_meta.json",
    "context": "_context.md",
    "idea": "idea.md",
    "frame": "frame.md",
    "research": "research.md",
    "outline": "outline.md",
    "draft": "draft.md",
    "script": "script.md"
  }
}
```

## 字段说明

### 工作空间设置

- **mode**: 工作空间版本/模式
  - `1`: Mode 1（选题驱动），仅支持 `content-driven` 工作流
  - `2`: Mode 2（结构驱动），支持 `content-driven` 或 `structure-driven` 工作流
  - `3`: Mode 3（数据驱动），支持 `content-driven`、`structure-driven` 或 `data-driven` 工作流

### 内容设置

- **niche**: 内容领域/垂直赛道（如："Tech/AI"、"美食"、"旅行"）
- **platform**: 目标平台（如："YouTube"、"Bilibili"、"Douyin"）
- **audience**: 目标受众（如："Professionals"、"科技从业者"）
- **defaultDuration**: 默认视频时长（如："10min"、"3分钟"）
- **accountName**: 账号名称（如："@myChannel"）

### 语言设置

- **dirLang**: 目录语言
  - `"en"`: 英文目录（scripts/、stages/）
  - `"zh"`: 中文目录（脚本/、阶段/）

- **aiLang**: AI 输出语言
  - `"en"`: 英文输出
  - `"zh"`: 中文输出

### 目录名称映射 (dirNames)

根据 dirLang 自动生成目录名称：

**dirLang = "en"**:
```json
{
  "scripts": "scripts",
  "stages": "stages",
  "contexts": "contexts",
  "research": "research",
  "videos": "videos",
  "channels": "channels",
  "archive": "_archive"
}
```

**dirLang = "zh"**:
```json
{
  "scripts": "脚本",
  "stages": "阶段",
  "contexts": "上下文",
  "research": "调研",
  "videos": "视频",
  "channels": "账号",
  "archive": "_归档"
}
```

### 文件名称映射 (fileNames)

根据 dirLang 自动生成文件名称：

**dirLang = "en"**:
```json
{
  "meta": "_meta.json",
  "context": "_context.md",
  "idea": "idea.md",
  "frame": "frame.md",
  "research": "research.md",
  "outline": "outline.md",
  "draft": "draft.md",
  "script": "script.md"
}
```

**dirLang = "zh"**:
```json
{
  "meta": "_meta.json",
  "context": "_context.md",
  "idea": "01.选题沟通.md",
  "frame": "02.框架搭建.md",
  "research": "03.内容调研.md",
  "outline": "04.大纲确认.md",
  "draft": "05.脚本草稿.md",
  "script": "最终脚本.md"
}
```

## 使用场景

### 读取项目目录名称

```bash
# 读取 config.json
cat config.json

# 提取 dirNames.scripts
# 如果 dirLang="zh" → "脚本"
# 如果 dirLang="en" → "scripts"
```

### 创建项目目录结构

```bash
# 从 config.json 读取 dirNames
mkdir -p "{dirNames.scripts}/{project_id}/{dirNames.stages}"
mkdir -p "{dirNames.scripts}/{project_id}/{dirNames.contexts}/{dirNames.research}"
mkdir -p "{dirNames.scripts}/{project_id}/{dirNames.contexts}/{dirNames.videos}"
mkdir -p "{dirNames.scripts}/{project_id}/{dirNames.contexts}/{dirNames.channels}"
mkdir -p "{dirNames.scripts}/{project_id}/{dirNames.archive}"
```

### 创建阶段文件

```bash
# 从 config.json 读取 fileNames
# 创建选题沟通文件
# dirLang="zh" → "阶段/选题沟通.md"
# dirLang="en" → "stages/idea.md"
```

## 兼容性说明

### Mode 字段

- **Mode 1 (v1.0)**: 仅支持 `content-driven` 工作流
  - Agent 不需要判断 workflowType，默认为 `content-driven`

- **Mode 2 (v2.0+)**: 支持 `content-driven` 或 `structure-driven` 工作流
  - Agent 需要根据上下文判断 workflowType

- **Mode 3 (v3.0+)**: 支持 `content-driven`、`structure-driven` 或 `data-driven` 工作流
  - Agent 需要根据上下文判断 workflowType

### workflowType 判断逻辑

Agent 根据以下信息判断 workflowType：
1. 用户明确指令（优先级最高）
2. 工作空间 mode（config.json mode 字段）
3. 项目数据检测（contexts/videos/、contexts/channels/）
4. 当前阶段推断

---

**说明**: 此文档描述工作空间配置文件的完整结构，由 CLI 工具自动生成和维护。
