# 安装和配置指南

## 快速开始

### 方式1: 使用 npx (推荐)

无需安装,直接运行:

```bash
npx @genkicap/genkicap-workflow
```

这会自动:
1. 显示交互式配置界面
2. 收集你的基础信息(领域、平台、受众等)
3. 创建项目结构
4. 生成配置文件和快速启动模板

### 方式2: 全局安装

```bash
npm install -g @genkicap/genkicap-workflow
```

然后在任意项目目录中运行:

```bash
genkicap-workflow
# 或
gw
```

### 方式3: 本地安装

```bash
npm install @genkicap/genkicap-workflow
```

安装后会自动运行配置向导。

---

## 配置流程

运行配置命令后,你会看到交互式界面:

```
═══════════════════════════════════════════════
   Video-workflow 视频脚本工作流 - v1.0
   选题梳理驱动 (Content-Driven)
═══════════════════════════════════════════════

📝 基础配置
请填写以下信息,这些信息会被保存,避免每次重复输入。
```

### 配置项说明

**1. 内容领域 (niche)**
- 示例: 科技数码、美食、教育、职场技能
- 用途: 帮助Agent理解你的创作方向

**2. 发布平台 (platform)**
- 选项: YouTube、B站、抖音、小红书
- 用途: 自动适配平台特性(时长、语言风格、CTA等)

**3. 目标受众 (audience)**
- 示例: 技术从业者、学生、职场新人、宝妈
- 用途: 调整内容深度和表达方式

**4. 视频时长 (duration)**
- 示例: 3分钟、10分钟、30分钟
- 用途: 规划内容密度和结构

**5. 脚本语言 (language)**
- 选项: 中文、英文
- 用途: 选择对应的脚本模板

---

## 生成的文件结构

配置完成后,会生成以下结构:

```
your-project/
├── stages/              # 工作流各阶段输出
│   ├── idea.md         # 阶段1: 选题沟通
│   ├── frame.md        # 阶段2: 框架搭建
│   ├── research.md     # 阶段3: 内容调研
│   ├── outline.md      # 阶段4: 大纲确认
│   └── draft.md        # 阶段5: 脚本撰写
├── _archive/           # 历史版本归档
├── contexts/           # 用户添加的补充资料
├── config.json         # 配置文件
├── QUICKSTART.md       # 快速启动模板
└── .gitignore         # Git忽略文件
```

---

## 配置文件说明

`config.json` 包含:

```json
{
  "version": "1.0.0",
  "createdAt": "2025-12-08T...",
  "userProfile": {
    "niche": "科技数码",
    "platform": "B站",
    "audience": "技术从业者",
    "duration": "10分钟",
    "language": "中文"
  },
  "workflow": {
    "currentStage": 0,
    "stages": [...]
  }
}
```

你可以随时编辑此文件来更新配置。

---

## 快速启动模板

`QUICKSTART.md` 包含基于你的配置预填充的选题模板:

```markdown
## 你的配置信息
- 内容领域: 科技数码
- 发布平台: B站
- 目标受众: 技术从业者
...

## 选题模板
### 示例1: 教程类
我想制作一个关于 [主题] 的视频...
```

直接复制使用,或根据需要修改。

---

## 开始使用

配置完成后:

1. **在 Claude Code 中打开项目**
   ```bash
   code .
   ```

2. **开始创作流程**
   - 打开 `QUICKSTART.md` 选择或编写选题
   - 在 Claude Code 中说: "我有一个选题想法..."
   - 粘贴你的选题描述
   - Agent会自动读取 `config.json` 中的配置
   - 开始7个阶段的创作流程!

---

## 重新配置

如果需要重新配置:

```bash
# 使用 npx
npx @genkicap/genkicap-workflow

# 或全局命令
genkicap-workflow

# 或 npm script
npm run setup
```

这会覆盖现有的 `config.json`。

---

## 常见问题

**Q: 配置信息存在哪里?**
A: `config.json` 文件中,可随时手动编辑。

**Q: 可以为不同项目使用不同配置吗?**
A: 可以!在每个项目目录中运行配置命令即可。

**Q: 如何跳过某些配置项?**
A: 直接回车使用默认值。

**Q: 如何删除配置?**
A: 删除 `config.json` 文件,下次使用时会重新配置。

**Q: 配置会影响什么?**
A: Agent会读取配置来:
   - 自动适配平台特性
   - 调整内容深度和风格
   - 预填充选题模板
   - 选择合适的脚本模板

---

## 下一步

查看完整工作流程: [README.md](./README.md)

查看快速开始: [QUICKSTART.md](./QUICKSTART.md)
