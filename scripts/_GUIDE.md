# Scripts Directory

## Purpose
This directory stores all your video script projects. Each project is a complete workflow from topic ideation to final script.

## Structure
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

## Usage
1. Create a new project: Run `genkicap-workflow` and select "New Project"
2. Or manually create: `mkdir scripts/my-project-20251210`
3. Start workflow in Claude Code and work in the project directory
