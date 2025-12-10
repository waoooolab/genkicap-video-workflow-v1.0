# Video-workflow v1.0 - Content-Driven Mode

> Professional video script creation workflow - From content ideas to executable scripts

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/waoooolab/genkicap-genkicap-workflow-v1.0)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Mode](https://img.shields.io/badge/mode-Content--Driven-orange.svg)](#)

[中文文档](README_CN.md)

---

## 📖 Table of Contents

- [Introduction](#introduction)
- [Core Features](#core-features)
- [Quick Start](#quick-start)
- [Complete Workflow](#complete-workflow)
- [Directory Structure](#directory-structure)
- [Template System](#template-system)
- [Usage Guide](#usage-guide)
- [CLI Commands](#cli-commands)
- [FAQ](#faq)
- [Version Roadmap](#version-roadmap)

---

## Introduction

**Video-workflow v1.0** is a content-driven video script creation workflow system. It helps creators transform a content idea into high-quality, executable video scripts through a systematic **7-stage process**.

### Core Philosophy

```
💡 "What content do I want to deliver" → 📝 Systematic script → 🎬 Ready for production
```

### Use Cases

- ✅ **Long-form videos** (10+ minutes)
- ✅ **In-depth content** (tutorials, explanations, reviews)
- ✅ **New creators** (no data accumulation required)
- ✅ **Individual creators** or **small teams**

---

## Core Features

### 🎯 Complete 7-Stage Workflow

```
Stage 1: Idea Communication → idea.md
    ↓
Stage 2: Framework Design → frame.md
    ↓
Stage 3: Content Research → research.md
    ↓
Stage 4: Outline Confirmation → outline.md
    ↓
Stage 5: Script Drafting → draft.md
    ↓
Stage 6: Edit & Optimize → draft.md (updated)
    ↓
Stage 7: Final Output → script.md (final script) ⭐
```

### 📚 Template System

#### Free Version (Multilingual Support)
- **2 Universal Templates**: One Chinese and one English base template
  - `zh-CN/通用版.md` - Chinese universal template
  - `en-US/Base.md` - English universal template
- **Smart Language Matching**: Auto-selects template based on your AI output language preference

#### Premium Version (Upgrade to unlock)
- **15+ Professional Templates**: Including teaching, review, documentary, short video, and more
- **Multilingual Support**: Each template available in both Chinese and English
- **Remote Access**: Templates updated in real-time
- **Usage Guides**: Detailed documentation and best practices

> 💡 **Upgrade to Premium**: Run `genkicap-workflow` and select **"4. Upgrade - Unlock premium templates"** (Coming Soon)

### 🔄 Progressive Interaction

- User confirmation after each stage
- Avoid overwhelming content dumps
- Support for adjustments at any stage

### 💾 Automatic Version Management

- Auto-archive historical versions
- Support for rollback and comparison
- Clear file organization

### 🚀 No Entry Barriers

- No database required
- No technical background needed
- Ready to use out of the box

---

## Quick Start

### Option 1: npx (Recommended, no installation needed)

```bash
# Run CLI tool directly
npx @genkicap/genkicap-workflow

# Select: 1. Complete Initialization
# Follow the prompts to configure

# Enter your workspace
cd your-workspace-name

# Open Claude Code and start creating
```

---

### Option 2: Global Installation

```bash
# Global install
npm install -g @genkicap/genkicap-workflow

# Run CLI
genkicap-workflow

# Select: 1. Complete Initialization
```

---

### Start Creating

In Claude Code or supported AI editors, simply tell the AI your content idea:

```
You: I want to make a video comparing AI drawing tools
```

The AI will automatically read your `config.json` configuration and guide you through the 7 stages:

```
Stage 1: Idea Communication → idea.md
Stage 2: Framework Design → frame.md
Stage 3: Content Research → research.md
Stage 4: Outline Confirmation → outline.md
Stage 5: Script Drafting → draft.md
Stage 6: Edit & Optimize → draft.md (updated)
Stage 7: Final Output → script.md ⭐
```

---

## Complete Workflow

### Stage 1: Idea Communication → `idea.md`

**Goal**: Transform scattered thoughts into structured topic descriptions

**Tasks**:
1. Check for `config.json` and ask user preference:
   - Use existing config (recommended for quick start)
   - Customize for this project (for special scenarios)
2. Collect core information: topic, angle, target audience, expected value
3. Generate search keywords

**Output**: `stages/idea.md`

---

### Stage 2: Framework Design → `frame.md`

**Goal**: Design video timeline, content hierarchy, hooks, and transitions

**Tasks**:
1. Design timeline and segment divisions
2. Plan primary arguments and supporting points
3. Design hook (opening)
4. Design transitions (maintain viewer interest)
5. Design ending CTA (call-to-action)
6. **Recommend appropriate template**

**Output**: `stages/frame.md`

---

### Stage 3: Content Research → `research.md`

**Goal**: Search related content, provide 3 different angles and title options

**Tasks**:
1. Use WebSearch based on keywords from `idea.md`
2. Analyze similar content angles and structures
3. Generate 3 different angles with 2-3 titles each
4. Recommend optimal approach

**Output**: `stages/research.md`

---

### Stage 4: Outline Confirmation → `outline.md`

**Goal**: Generate detailed outline based on framework

**Tasks**:
1. Create detailed section-by-section outline
2. Apply recommended template rules
3. Define each segment's narration points and visual suggestions

**Output**: `stages/outline.md`

---

### Stage 5: Script Drafting → `draft.md`

**Goal**: Generate detailed script draft based on outline

**Tasks**:
1. Write narration text for each segment
2. Provide visual/shot suggestions
3. Include design intent explanations

**Output**: `stages/draft.md`

---

### Stage 6: Edit & Optimize → `draft.md` (updated)

**Goal**: Optimize narration, refine visuals, adjust timing

**Tasks**:
1. Improve narration (naturalness, pacing, emotion)
2. Enhance visual suggestions (shots, angles, effects)
3. Adjust duration (cut redundancy, expand key points)

**Output**: `stages/draft.md` (updated version)

---

### Stage 7: Final Output → `script.md`

**Goal**: Generate final executable script

**Tasks**:
1. Compile optimized content
2. Format final script
3. Add production notes and considerations
4. Save to root directory as `script.md`

**Output**: `script.md` (final script) ⭐

---

## Directory Structure

Standard directory structure for each project:

```
workspace-name/
├── .claude/
│   ├── CLAUDE.md              # Mode 1 Agent configuration
│   └── template/
│       ├── script/
│       │   ├── en-US/         # English templates
│       │   │   └── Base.md
│       │   └── zh-CN/         # Chinese templates
│       │       └── 通用版.md
│       └── stage/             # Stage templates
├── references/
│   ├── _GUIDE.md              # Reference guide
│   └── templates/             # Additional templates
├── scripts/                    # User workspace
│   └── {project-name}/         # Specific project
│       ├── stages/             # Stage outputs
│       │   ├── idea.md         # Stage 1
│       │   ├── frame.md        # Stage 2
│       │   ├── research.md     # Stage 3
│       │   ├── outline.md      # Stage 4
│       │   └── draft.md        # Stage 5-6
│       ├── contexts/           # Supplementary materials (optional)
│       │   ├── videos/         # Reference videos
│       │   ├── research/       # Deep research
│       │   └── accounts/       # Competitor analysis
│       ├── _archive/           # Historical versions
│       └── script.md           # Final script ⭐
├── config.json                 # Workspace configuration
├── README.md                   # This document
├── QUICKSTART.md               # Quick start guide
└── LICENSE                     # Open source license
```

---

## Template System

### Free Templates (Multilingual Support)

v1.0 free version provides **2 universal templates**:

| Language | Template Name | Path | Use Cases |
|----------|--------------|------|-----------|
| Chinese | 通用版 | `zh-CN/通用版.md` | All Chinese video types |
| English | Base | `en-US/Base.md` | All English video types |

**Features**:
- ✅ Multilingual support (Chinese/English)
- ✅ Smart language matching - auto-selects based on output language preference
- ✅ Flexible structure framework
- ✅ Adapts to various video scenarios
- ✅ Complete script creation workflow

**How to Use**:
1. During Stage 1 idea communication, tell AI your preferred output language
2. AI auto-selects corresponding language template
3. Generated script content uses your chosen language

---

### Premium Templates (Upgrade to unlock)

Upgrade to unlock **15+ professional templates**:

| Category | Template List | Language Support | Use Cases |
|----------|--------------|------------------|-----------|
| **Long-form** | Educational, Review, Documentary, Explainer, Commentary, Compilation, Story, VSL, etc. | Chinese/English | 5-15 minutes |
| **Short-form** | Shorts-Educational, Shorts-Viral, Shorts-Review, Shorts-Ad, Shorts-Story, etc. | Chinese/English | 15 seconds-3 minutes |

**Premium Benefits**:
- 🎯 15+ professional vertical templates
- 🌐 Each template available in Chinese and English
- ⚡ Remote access, templates updated in real-time
- 📖 Detailed usage guides and best practices
- 🎁 Priority access to new templates
- 💬 Priority technical support

> 💡 **How to Upgrade**: Run `genkicap-workflow`, select **"4. Upgrade"** (Coming Soon in v1.1.0)

---

## Usage Guide

### Basic Usage

#### 1. Start from Scratch

```
You: I want to make a video about AI tool reviews

AI: ✅ Information confirmed!

**Project Overview**:
- Content field: Tech & Digital
- Current stage: Just starting (need topic)
- Target platform: [To be confirmed]
- Video duration: [To be confirmed]

Next I'll enter **Stage 1: Idea Communication** to help organize your topic idea.

Type **continue** to start, or tell me what needs adjustment.

You: continue

AI: [Enters Stage 1, starts organizing topic]
```

#### 2. Start with Existing Topic

```
You: I already have a topic: "Comparison review of 5 AI drawing tools",
    help me generate the script

AI: ✅ Information confirmed!

**Project Overview**:
- Content field: Tech & Digital
- Current stage: Have topic (need research and script)
- Topic: Comparison review of 5 AI drawing tools

Next I'll enter **Stage 2: Content Research** to search related content and provide angle recommendations.

Type **continue** to start.

You: continue

AI: [Enters Stage 2, starts research]
```

---

### Advanced Usage

#### Add Supplementary Materials

Add reference materials in the `contexts/` directory:

```
scripts/my-video/
├── contexts/
│   ├── videos/
│   │   └── reference-video-1.md  # Reference video analysis
│   ├── research/
│   │   └── market-analysis.md    # Market research
│   └── accounts/
│       └── competitor-1.md       # Competitor analysis
```

The system will automatically read these materials during research and framework design.

#### Version Rollback

To revert to a previous version:

```
You: I think the first version of the framework was better, can we go back?

AI: Of course! Let me read _archive/frame_v01.md ...
[Reads historical version, shows content]

You want to:
• Restore this version → Overwrite current frame.md
• Compare and reference → Keep current version, reference historical
```

---

## CLI Commands

### npx Execution (Recommended)

```bash
npx @genkicap/genkicap-workflow
```

No installation needed, run CLI tool directly.

### Global Installation

```bash
npm install -g @genkicap/genkicap-workflow
genkicap-workflow  # or gw
```

---

### Main Menu Features

#### 1. Complete Initialization

Create new workspace and configure basic parameters:

```bash
genkicap-workflow
# Select: 1. Complete Initialization
```

**Configuration Parameters**:
- Workspace name
- Directory language (Chinese/English)
- AI output language (Chinese/English)
- Niche (content field)
- Platform (target platform)
- Audience (target audience)
- Duration (default video length)
- Account name

---

#### 2. Import/Update Workflow

Update workflow configuration and templates (preserve existing projects):

```bash
genkicap-workflow
# Select: 2. Import/Update
```

**Updatable Content** (multi-select):
- `.claude/` - Agent configuration
- `README.md` - Workflow documentation
- `QUICKSTART.md` - Quick start guide
- `references/_GUIDE.md` - Reference guide

**Safety Features**:
- ✓ Preserve all projects in `scripts/`
- ✓ Preserve user materials in `references/`
- ✓ Only update guide docs, won't delete user content

---

#### 3. New Project

Create new project in `scripts/` directory:

```bash
genkicap-workflow
# Select: 3. New Project
```

**Creates**:
- Project directory: `scripts/{name}-{date}/`
- Standard structure: `stages/`, `contexts/`, `_archive/`
- Metadata files: `_meta.json`, `_context.md`

---

#### 4. Upgrade to Premium (Coming Soon)

Unlock 15+ professional templates:

```bash
genkicap-workflow
# Select: 4. Upgrade
```

**Will support in v1.1.0**:
- Activation code verification
- 15+ professional template unlock
- Remote template access

---

#### 5. Configuration Management

Modify workspace configuration:

```bash
genkicap-workflow
# Select: 5. Configuration
```

**Modifiable Parameters**:
- niche (content field)
- platform (target platform)
- audience (target audience)
- duration (default duration)
- accountName (account name)

---

#### L. Switch Language

Switch CLI interface language:

```bash
genkicap-workflow
# Select: L. Switch Language
```

Supports: Chinese / English

---

#### U. Check Updates

Check for latest npm package version:

```bash
genkicap-workflow
# Select: U. Check Updates
```

---

#### X. Uninstall

Uninstall npm package:

```bash
genkicap-workflow
# Select: X. Uninstall
```

Executes `npm uninstall -g @genkicap/genkicap-workflow`

---

## FAQ

### Q: Can I skip certain stages?

**A**: Yes. If you already have output from a certain stage (e.g., already have a topic), tell the AI your current stage and the system will jump to the corresponding position.

### Q: Can the generated script be used directly for shooting?

**A**: Yes! The `script.md` generated in Stage 7 is an executable script that includes:
- Complete narration text
- Detailed visual suggestions
- Shooting and post-production notes

You can directly follow the script for shooting and editing.

### Q: What if I'm not satisfied with a stage's output?

**A**: User confirmation is requested after each stage. If not satisfied, you can:
- Tell the AI what needs adjustment
- Regenerate that stage's output
- Go back to the previous stage and restart

### Q: Are templates mandatory?

**A**: No. Templates are recommendations. You can:
- Accept recommended template
- Choose a different template
- Don't use templates, fully customize

### Q: Which platforms are supported?

**A**: v1.0 supports all major platforms:
- Domestic: Bilibili, Douyin, Xiaohongshu
- International: YouTube, TikTok

The system provides differentiated suggestions based on target platform (title style, duration control, etc.).

### Q: Can I work on multiple video projects simultaneously?

**A**: Yes! Create multiple project directories under `scripts/`:

```
scripts/
├── project-1/
├── project-2/
└── project-3/
```

Each project is managed independently without interference.

### Q: How to update to v2.0 or v3.0?

**A**: v1.0, v2.0, v3.0 are independent versions that can coexist:

- **v1.0** (Mode 1 - Content-Driven): For long-form, in-depth content
- **v2.0** (Mode 2 - Structure-Driven): For short videos, rapid scaling
- **v3.0** (Mode 3 - Data-Driven): For data optimization, production at scale

You can choose different versions based on different scenarios.

---

## Version Roadmap

### v1.0 (Current Version) - Mode 1 (Content-Driven)

**Core Value**:
- ✅ Complete 7-stage workflow
- ✅ 2 universal templates (Chinese + English)
- ✅ No database required, beginner-friendly
- ✅ Suitable for long-form videos (10-30 minutes)

**Use Cases**:
- Long-form video creation (10+ minutes)
- In-depth content production
- New creators
- Accounts without data accumulation

---

### v2.0 (Planned) - Mode 2 (Structure-Driven)

**Core Value**:
- 🚀 Generate scripts in 2-5 minutes
- 🧩 Hook/Structure/Style combination creation
- 📚 .claude/vault/ resource library support
- ⚡ Common preset combinations, one-click generation

**Use Cases**:
- Short video creation (1-3 minutes)
- Quickly replicate viral structures
- Batch content production

---

### v3.0 (Planned) - Mode 3 (Data-Driven)

**Core Value**:
- 📊 Data-driven topic recommendations
- 🤖 AI auto-recommends Hook/Structure/Style combinations
- 📈 Estimate script performance (CTR, completion rate)
- 🎯 Maximize success rate

**Use Cases**:
- Data-driven operations
- Accounts with data accumulation
- Scaled content production

---

## Contributing

Welcome contributions of new templates, optimization suggestions, or bug reports!

### Contributing Templates

1. Fork this repository
2. Create new template under `references/templates/`
3. Reference format and structure of existing templates
4. Submit Pull Request

### Reporting Bugs

Please submit bug reports on [GitHub Issues](https://github.com/waoooolab/genkicap-genkicap-workflow-v1.0/issues) including:
- Reproduction steps
- Expected results
- Actual results
- Environment info (Node version, system, etc.)

---

## License

[MIT License](LICENSE)

---

## Contact

- GitHub: [waoooolab/genkicap-genkicap-workflow-v1.0](https://github.com/waoooolab/genkicap-genkicap-workflow-v1.0)
- Email: contact@waoooolab.com
- Community: Coming Soon

---

## Acknowledgments

Thanks to all creators who use and contribute to this project!

**Happy Creating! 🎬✨**
