# v1.0 Sub-Repository

This directory is a **separate Git repository** managed independently from the main repository.

## Repository Information

- **Sub-repo URL**: https://github.com/waoooolab/genkicap-video-workflow-v1.0.git
- **npm Package**: [@waoooo/genkicap-workflow](https://www.npmjs.com/package/@waoooo/genkicap-workflow)
- **Current Version**: 1.0.5

## Git Workflow

### Making Changes

```bash
cd v1.0

# Make your changes...

# Stage and commit
git add .
git commit -m "v1.0.x: Brief description of changes"

# Push to sub-repository
git push origin main
```

### Creating a New Release

```bash
cd v1.0

# 1. Update version in package.json
# 2. Update CHANGELOG.md and docs/zh-CN/CHANGELOG.md
# 3. Commit changes
git add .
git commit -m "v1.0.x: Release description"

# 4. Create and push tag
git tag -a v1.0.x -m "Release v1.0.x: Description"
git push origin main --tags

# 5. Publish to npm
npm publish
```

## Commit Message Format

Use English commit messages with version numbers:

```
v1.0.x: Brief summary

Detailed description:
- Change 1
- Change 2
- Change 3

Version: 1.0.y → 1.0.x
```

## Important Notes

1. **Independent Repository**: v1.0 has its own Git history separate from the main repo
2. **Ignored by Main Repo**: The main repository ignores v1.0/ via .gitignore
3. **Version Management**: Version numbers and releases are managed independently
4. **npm Publishing**: Published directly from this sub-repository

## Directory Structure

```
v1.0/                          # Sub-repository root
├── .git/                      # Independent Git repository
├── bin/                       # CLI entry points
├── lib/                       # Core modules
│   ├── modules/              # Feature modules
│   ├── ui/                   # UI components
│   └── utils/                # Utility functions
├── .claude/                   # Claude AI templates
├── docs/                      # Documentation
├── package.json              # npm package config
└── CHANGELOG.md              # Version history
```

## Related Repositories

- **Main Repository**: https://github.com/daniellee2015/Video-workflow.git
- **v1.0 Sub-Repository**: https://github.com/waoooolab/genkicap-video-workflow-v1.0.git
