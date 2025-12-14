# 脚本目录

## 用途
此目录存放你的所有视频脚本项目。每个项目是一个从选题到成稿的完整工作流。

## 目录结构
```
scripts/
└── {项目名称}-{日期}/              # 单个项目目录
    ├── _meta.json                  # 项目元数据（统一格式）
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

## _meta.json 格式（与 videos/channels/accounts 统一）

```json
{
  "version": "1.0",
  "project_id": "20251212-科技测评",
  "name": "科技测评",
  "description": "项目描述",
  "status": "explore",
  "stage": "idea",
  "progress": 0,
  "created_at": "2025-12-12T10:00:00Z",
  "updated_at": "2025-12-12T10:00:00Z",
  "metadata": {
    "workflow_type": null,
    "duration": "5分钟",
    "platform": "B站",
    "audience": "职场人士"
  },
  "stages": [
    {
      "id": 1,
      "name": "idea",
      "display_name": "选题沟通",
      "file": "stages/idea.md",
      "completed": false
    }
  ]
}
```

**核心特性：**
- ✅ 下划线命名（与 videos/channels/accounts 保持一致）
- ✅ ISO8601 时间戳格式
- ✅ 统一的 `project_id` 格式（类似 `channel_id`, `video_id`）
- ✅ 简化的状态管理（`status` + `stage`）
- ✅ 嵌套的 `metadata` 对象，便于扩展

## 使用方法
1. 创建新项目：运行 `genkicap-workflow` 并选择"新增项目"
2. 或手动创建：`mkdir scripts/my-project-20251210`
3. 在 Claude Code 中启动工作流，在项目目录下工作
