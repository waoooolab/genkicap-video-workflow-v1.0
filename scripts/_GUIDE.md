# Scripts Directory | 脚本目录

## English

### Purpose
This directory stores all your video script projects. Each project is a complete workflow from topic ideation to final script.

### Structure
```
scripts/
└── {project-name}-{date}/          # Individual project directory
    ├── _meta.json                  # Project metadata
    ├── _context.md                 # Project context
    ├── stages/                     # Stage outputs
    │   ├── idea.md                 # Stage 1: Topic ideation
    │   ├── frame.md                # Stage 2: Framework design
    │   ├── research.md             # Stage 3: Content research (optional)
    │   ├── outline.md              # Stage 4: Outline confirmation
    │   └── draft.md                # Stage 5: Script draft
    ├── contexts/                   # Supplementary materials (optional)
    │   ├── videos/                 # Reference videos
    │   ├── research/               # Research materials
    │   └── accounts/               # Account analysis
    ├── _archive/                   # Historical versions
    │   ├── idea_v01.md
    │   ├── frame_v01.md
    │   └── ...
    └── script.md                   # Final script ⭐
```

### Usage
1. Create a new project: Run `video-workflow` and select "New Project"
2. Or manually create: `mkdir scripts/my-project-20251210`
3. Start workflow in Claude Code and work in the project directory

---

## 中文

### 用途
此目录存放你的所有视频脚本项目。每个项目是一个从选题到成稿的完整工作流。

### 目录结构
```
scripts/
└── {项目名称}-{日期}/              # 单个项目目录
    ├── _meta.json                  # 项目元数据
    ├── _context.md                 # 项目上下文
    ├── stages/                     # 阶段性输出
    │   ├── idea.md                 # 阶段1：选题沟通
    │   ├── frame.md                # 阶段2：框架搭建
    │   ├── research.md             # 阶段3：内容调研（可选）
    │   ├── outline.md              # 阶段4：大纲确认
    │   └── draft.md                # 阶段5：脚本撰写
    ├── contexts/                   # 补充资料（可选）
    │   ├── videos/                 # 参考视频
    │   ├── research/               # 调研资料
    │   └── accounts/               # 账号分析
    ├── _archive/                   # 历史版本
    │   ├── idea_v01.md
    │   ├── frame_v01.md
    │   └── ...
    └── script.md                   # 最终脚本 ⭐
```

### 使用方法
1. 创建新项目：运行 `video-workflow` 并选择"新增项目"
2. 或手动创建：`mkdir scripts/my-project-20251210`
3. 在 Claude Code 中启动工作流，在项目目录下工作
