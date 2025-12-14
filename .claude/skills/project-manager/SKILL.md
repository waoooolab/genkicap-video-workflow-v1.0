---
name: project-manager
description: 静默管理项目状态,返回 CURRENT_PROJECT 路径供工作流使用。用户开始描述选题时自动调用。
model: claude-sonnet-4-5
---

# Project Manager

静默检测和管理项目状态,确保工作流在正确的项目上下文中执行。

## 核心原则

1. **静默处理**: 后台处理项目,不打断用户
2. **自动决策**: 智能判断是否需要创建新项目
3. **简洁高效**: 核心逻辑 <50 行

## 调用时机

**用户开始描述选题时**,主 Agent 自动调用此 skill:
- 用户说:"我想做一个关于 AI 的视频"
- 用户说:"开始创作" / "新建项目"
- 对话开始时,主动检测项目状态

## 执行流程 (3 步)

### 步骤 1: 初始化检测

```bash
# 1. 检查 config.json 并读取 dirLang
if [ -f "config.json" ]; then
  dirLang=$(grep -o '"dirLang"[[:space:]]*:[[:space:]]*"[^"]*"' config.json | sed 's/.*"\([^"]*\)".*/\1/')
  [ "$dirLang" = "zh" ] && SCRIPTS_DIR="脚本" || SCRIPTS_DIR="scripts"
else
  [ -d "脚本" ] && SCRIPTS_DIR="脚本" || SCRIPTS_DIR="scripts"
fi

# 2. 检查 scripts/_meta.json 是否存在
ls "$SCRIPTS_DIR/_meta.json" 2>&1
```

**结果处理**:
- 文件不存在 → 创建空索引,继续
- 文件存在 → 继续步骤 2

### 步骤 2: 查找进行中的项目

```bash
# 读取 scripts/_meta.json
cat "$SCRIPTS_DIR/_meta.json"

# 提取 status = "explore" 或 "active" 的项目
# 只关注第一个进行中的项目
```

**智能决策**:
- **有进行中的项目** → 静默使用该项目
- **没有进行中的项目** → 静默创建新项目

### 步骤 3: 返回 CURRENT_PROJECT

```javascript
// 设置全局变量
CURRENT_PROJECT = "{SCRIPTS_DIR}/{project_id}"

// 示例:
// CURRENT_PROJECT = "scripts/20251214-AI工具测评"
// 或
// CURRENT_PROJECT = "脚本/20251214-AI工具测评"
```

## 创建新项目 (静默执行)

**触发条件**: 没有进行中的项目

**执行步骤**:

1. **生成项目 ID**:
   ```javascript
   // 从用户输入提取关键词
   const keywords = extractKeywords(userInput); // "AI工具测评"

   // 生成项目 ID: YYYYMMDD-关键词
   const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
   const project_id = `${date}-${keywords}`; // "20251214-AI工具测评"
   ```

2. **创建目录结构**:
   ```bash
   # 从 config.json 读取 dirNames 和 fileNames
   cat config.json

   # 使用动态映射创建目录
   mkdir -p "$SCRIPTS_DIR/$project_id/${dirNames.stages}"
   mkdir -p "$SCRIPTS_DIR/$project_id/${dirNames.contexts}/${dirNames.research}"
   mkdir -p "$SCRIPTS_DIR/$project_id/${dirNames.contexts}/${dirNames.videos}"
   mkdir -p "$SCRIPTS_DIR/$project_id/${dirNames.contexts}/${dirNames.channels}"
   mkdir -p "$SCRIPTS_DIR/$project_id/_归档"
   ```

3. **创建项目 _meta.json**:
   - 使用 Write 工具创建 `{SCRIPTS_DIR}/{project_id}/_meta.json`
   - 详见: [references/project-meta-format.md](references/project-meta-format.md)

4. **更新 scripts/_meta.json**:
   ```bash
   # 读取现有索引
   cat "$SCRIPTS_DIR/_meta.json"

   # 添加新项目到 projects 数组
   # 更新 total_projects 和 last_updated

   # 写回文件
   ```

5. **静默确认**:
   ```
   ✅ 已为你创建项目: {name} ({project_id})

   让我们开始选题沟通吧!
   ```

## 返回结果

**成功返回**:
```json
{
  "success": true,
  "project_id": "20251214-AI工具测评",
  "project_path": "scripts/20251214-AI工具测评",
  "scripts_dir": "scripts",
  "config": {
    "dirLang": "en",
    "dirNames": {...},
    "fileNames": {...}
  }
}
```

**主 Agent 使用方式**:
```javascript
// 调用 project-manager skill
const result = await callSkill("project-manager");

// 设置全局变量
CURRENT_PROJECT = result.project_path;

// 后续所有文件操作使用此前缀
// ✅ `${CURRENT_PROJECT}/stages/idea.md`
// ✅ `${CURRENT_PROJECT}/_meta.json`
// ❌ 绝对不要直接使用 `stages/idea.md`
```

## 项目命名规则

**格式**: `YYYYMMDD-项目名`

**提取项目名的规则**:
1. 从用户输入中提取 1-3 个关键词
2. 去除停用词 ("我想", "做一个", "关于" 等)
3. 保留核心主题词

**示例**:
- 用户输入: "我想做一个关于 AI 工具测评的视频"
- 提取关键词: "AI工具测评"
- 生成 ID: "20251214-AI工具测评"

## 参考文档

- [scripts/_meta.json 格式说明](references/meta-format.md)
- [项目 _meta.json 格式说明](references/project-meta-format.md)
- [config.json 配置说明](references/config-structure.md)

---

**版本**: v3.0
**最后更新**: 2025-12-14
**变更说明**: 重构为简洁版,静默处理项目,<100 行核心逻辑
