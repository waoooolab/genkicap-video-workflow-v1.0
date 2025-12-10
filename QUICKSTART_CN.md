# Video-workflow v1.0 - 快速启动

> 5 分钟开始你的第一个视频脚本创作

---

## 📦 安装

### 方式1: npx (推荐，无需安装)

```bash
npx @genkicap/genkicap-workflow
```

### 方式2: 全局安装

```bash
npm install -g @genkicap/genkicap-workflow
genkicap-workflow
```

---

## 🚀 快速开始

### 1. 初始化工作空间

运行 CLI 工具后，选择 **"1. 完整初始化"**：

```bash
npx @genkicap/genkicap-workflow
# 或
genkicap-workflow
```

**需要配置的信息**：
- 工作空间名称 (例: `my-videos`)
- 目录语言 (中文/English)
- AI 输出语言 (中文/English)
- 细分领域 (例: 科技数码)
- 目标平台 (例: YouTube)
- 目标受众 (例: 技术从业者)
- 默认视频时长 (例: 10分钟)

初始化完成后会创建完整的工作空间结构。

---

### 2. 进入工作空间

```bash
cd my-videos  # 你的工作空间名称
```

打开 Claude Code 或支持的 AI 编辑器。

---

### 3. 开始创作

直接告诉 AI 你的选题想法：

```
你: 我想做一个关于 AI 绘画工具对比的视频
```

AI 会自动引导你完成 **7 个阶段**：

```
阶段1: 选题沟通 → idea.md
阶段2: 框架搭建 → frame.md
阶段3: 内容调研 → research.md
阶段4: 大纲确认 → outline.md
阶段5: 脚本撰写 → draft.md
阶段6: 优化编辑 → draft.md (更新)
阶段7: 最终输出 → script.md ⭐
```

---

## 📁 生成的文件结构

创作完成后，你会在 `scripts/` 目录看到：

```
my-videos/
├── scripts/
│   └── ai-art-tools-20251210/     # 项目目录 (自动生成日期)
│       ├── stages/                # 各阶段输出
│       │   ├── idea.md            # 选题描述
│       │   ├── frame.md           # 框架设计
│       │   ├── research.md        # 调研报告
│       │   ├── outline.md         # 大纲确认
│       │   └── draft.md           # 脚本草稿
│       ├── contexts/              # 补充资料 (可选)
│       ├── _archive/              # 历史版本
│       └── script.md              # 最终脚本 ⭐
├── references/                     # 参考资料目录
├── config.json                     # 工作空间配置
└── .claude/                        # Agent 配置和模板
```

---

## 🎯 常用 CLI 命令

### 创建新项目

```bash
genkicap-workflow
# 选择: 3. 新增项目
```

手动创建也可以：

```bash
cd scripts
mkdir my-new-project-20251210
cd my-new-project-20251210
```

---

### 更新工作流配置

```bash
genkicap-workflow
# 选择: 2. 导入/更新
```

更新内容可选：
- `.claude/` Agent 配置
- `README.md` 文档
- `QUICKSTART.md` 快速开始
- `references/_GUIDE.md` 引导文档

---

### 修改配置

```bash
genkicap-workflow
# 选择: 5. 配置
```

可修改：
- 细分领域 (niche)
- 目标平台 (platform)
- 目标受众 (audience)
- 默认时长 (duration)
- 账号名称 (accountName)

---

## 💡 使用技巧

### 技巧1: 从任意阶段开始

如果你已经有选题或草稿，直接告诉 AI：

```
你: 我已经有选题了："5款AI绘画工具横向对比"，帮我生成脚本
```

AI 会自动从对应阶段开始。

---

### 技巧2: 添加参考资料

在项目的 `contexts/` 目录添加参考资料：

```
scripts/my-project/
└── contexts/
    ├── videos/          # 参考视频分析
    ├── research/        # 市场调研资料
    └── accounts/        # 竞品账号分析
```

AI 会在调研和框架设计时自动读取。

---

### 技巧3: 多语言支持

在初始化时选择：
- **目录语言**: 控制目录名称 (`scripts/脚本` 或 `scripts`)
- **AI 输出语言**: 控制脚本内容语言 (中文/English)

可以创建中文界面 + 英文脚本，或英文界面+ 中文脚本。

---

### 技巧4: 平台适配

初始化时选择目标平台 (YouTube/B站/抖音/小红书)，AI 会：
- 自动搜索该平台的内容特点
- 生成符合该平台风格的脚本
- 调整时长、Hook、CTA 等细节

---

## ❓ 常见问题

**Q: 首次使用需要配置什么？**
A: 运行 `npx @genkicap/genkicap-workflow`，选择 "1. 完整初始化"，按提示填写即可。

**Q: 配置保存在哪里？**
A: `config.json` 文件，可随时用菜单 5 修改。

**Q: 可以同时创作多个项目吗？**
A: 可以！在 `scripts/` 下创建多个项目目录，互不影响。

**Q: 如何选择脚本模板？**
A: AI 会在阶段 5 根据你的 AI 输出语言自动选择：
- 中文 → `zh-CN/通用版.md`
- 英文 → `en-US/Base.md`

**Q: 会员模板什么时候上线？**
A: v1.1.0 版本 (预计 2-4 周后)，将支持 15+ 专业模板。

---

## 📚 进一步学习

- 📖 [完整文档](README.md) - 详细的功能说明和工作流程
- 💻 [CLI 命令参考](CLI_COMMANDS.md) - 完整的 npx 子命令文档
- ⚙️ [Agent 配置](.claude/CLAUDE.md) - 了解系统运作原理
- 🔧 [安装说明](INSTALL.md) - 其他安装方式

---

## 🎬 开始创作！

```bash
# 1. 运行 CLI
npx @genkicap/genkicap-workflow

# 2. 选择: 1. 完整初始化

# 3. 填写配置信息

# 4. cd 到工作空间
cd my-videos

# 5. 打开 Claude Code，开始创作
```

**Happy Creating! 🎥✨**
