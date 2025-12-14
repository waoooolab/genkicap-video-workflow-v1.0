# Scripts Directory

## Purpose
This directory stores all your video script projects. Each project is a complete workflow from topic ideation to final script.

## Structure
```
scripts/
└── {project-name}-{date}/          # Individual project directory
    ├── _meta.json                  # Project metadata (unified format)
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

## _meta.json Format (Unified with videos/channels/accounts)

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

**Key Features:**
- ✅ Snake_case naming (consistent with videos/channels/accounts)
- ✅ ISO8601 timestamps
- ✅ Unified `project_id` format (like `channel_id`, `video_id`)
- ✅ Simplified status management (`status` + `stage`)
- ✅ Nested `metadata` object for extensibility

## Usage
1. Create a new project: Run `genkicap-workflow` and select "New Project"
2. Or manually create: `mkdir scripts/my-project-20251210`
3. Start workflow in Claude Code and work in the project directory
