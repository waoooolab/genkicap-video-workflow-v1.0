# Video-workflow v1.0 - Quick Start

> Create your first video script in 5 minutes

[中文文档](QUICKSTART_CN.md)

---

## 📦 Installation

### Option 1: npx (Recommended, no installation needed)

```bash
npx @genkicap/genkicap-workflow
```

### Option 2: Global Installation

```bash
npm install -g @genkicap/genkicap-workflow
genkicap-workflow
```

---

## 🚀 Quick Start

### 1. Initialize Workspace

After running the CLI tool, select **"1. Complete Initialization"**:

```bash
npx @genkicap/genkicap-workflow
# or
genkicap-workflow
```

**Configuration Required**:
- Workspace name (e.g., `my-videos`)
- Directory language (Chinese/English)
- AI output language (Chinese/English)
- Niche (e.g., Tech & Digital)
- Target platform (e.g., YouTube)
- Target audience (e.g., Tech professionals)
- Default video duration (e.g., 10 minutes)

A complete workspace structure will be created after initialization.

---

### 2. Enter Workspace

```bash
cd my-videos  # Your workspace name
```

Open Claude Code or supported AI editor.

---

### 3. Start Creating

Simply tell the AI your content idea:

```
You: I want to make a video comparing AI drawing tools
```

The AI will automatically guide you through **7 stages**:

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

## 📁 Generated File Structure

After creation, you'll see in the `scripts/` directory:

```
my-videos/
├── scripts/
│   └── ai-art-tools-20251210/     # Project directory (auto-generated date)
│       ├── stages/                # Stage outputs
│       │   ├── idea.md            # Topic description
│       │   ├── frame.md           # Framework design
│       │   ├── research.md        # Research report
│       │   ├── outline.md         # Outline confirmation
│       │   └── draft.md           # Script draft
│       ├── contexts/              # Supplementary materials (optional)
│       ├── _archive/              # Historical versions
│       └── script.md              # Final script ⭐
├── references/                     # Reference materials
├── config.json                     # Workspace configuration
└── .claude/                        # Agent config and templates
```

---

## 💡 Usage Tips

### Tip 1: Use Config for Quick Start

If `config.json` exists, the AI will ask you:

```
I detected your workspace configuration:
- Niche: Tech & Digital
- Platform: YouTube
- Audience: Tech professionals
- Duration: 10 minutes
- AI Language: English

For this creation, do you want to:
1. Use these settings (Recommended) - Quick start
2. Customize for this project - For special scenarios

Your choice:
```

**Recommendation**: Choose option 1 for quick start.

---

### Tip 2: Progressive Creation

You don't need to complete all stages at once:

```
You: I just want to brainstorm some topic ideas first

AI: No problem! I'll help you with Stage 1: Idea Communication.
    We can continue with the framework design later.
```

Each stage can be paused and resumed anytime.

---

### Tip 3: Multiple Projects

Create multiple video projects in the same workspace:

```bash
# First project
You: I want to make a video about AI drawing tools

# Second project
You: I want to start a new project about video editing software
```

Each project has independent directories and doesn't interfere with others.

---

## 🎯 Complete Example

### Example: "5 AI Drawing Tools Comparison"

**Stage 1: Idea Communication**
```
You: I want to compare 5 mainstream AI drawing tools

AI: [Generates idea.md]
- Core topic: Horizontal comparison of 5 AI drawing tools
- Perspective: Price, ease of use, generation quality
- Target audience: Designers and creators
- Search keywords: AI drawing tools comparison, Midjourney vs Stable Diffusion
```

**Stage 2: Framework Design**
```
AI: [Generates frame.md]
- Total duration: 8 minutes
- Timeline: Hook (10s) → Problem intro (20s) → Testing standards (1m30s) →
           Individual tests (4m) → Comparison (1m30s) → Summary (30s)
- Hook: "Spent $500 testing 5 AI tools, the 3rd result was unexpected..."
- Recommended template: Review.md
```

**Stage 3: Content Research**
```
AI: [Uses WebSearch, generates research.md]
- Found 3 angles: Hands-on comparison / Beginner tutorial / Cost-benefit analysis
- Recommended: Hands-on comparison (high data support, clear differentiation)
- Reference: Similar videos avg 500K+ views
```

**Stage 4-7: Continue Creation**
```
AI: [Generates outline.md → draft.md → optimizes → script.md]
```

**Final Result**: Executable `script.md` with complete narration and visual suggestions! 🎉

---

## 📚 Further Learning

- 📖 [Full Documentation](README.md) - Detailed feature explanation
- 🔧 [CLI Commands](CLI_COMMANDS.md) - Complete command reference
- 💬 [FAQ](README.md#faq) - Common questions

---

## ❓ Quick Q&A

**Q: Do I need to install Node.js?**
A: Yes, requires Node.js 14.0.0 or higher.

**Q: Can I use it without Claude Code?**
A: The workflow is designed for Claude Code, but you can manually follow the stages in any editor.

**Q: Will my data be uploaded to the cloud?**
A: No, all data stays local. The workflow doesn't require a database or cloud storage.

**Q: Is it free?**
A: v1.0 basic features are free. Premium templates require upgrade (coming in v1.1.0).

**Q: Which languages are supported?**
A: Both Chinese and English are supported for interface and output content.

---

**Start your video script creation journey now! 🚀**

```bash
npx @genkicap/genkicap-workflow
```
