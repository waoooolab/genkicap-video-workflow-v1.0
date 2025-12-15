# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.17] - 2025-12-16

### Added
- **Project Management Submenu**: New submenu for option 3 with create/view/delete/repair index features
- **Global Configuration Management**: New "G" option in main menu for managing global settings
- **Project Index Repair**: Automatically scan and rebuild project index from filesystem

### Changed
- Main menu option 3 upgraded from "New Project" to "Project Management"

---

## [1.0.5] - 2025-12-11

### Fixed
- **Bug #4**: Fixed missing `mode` and `membership` fields in configuration management
  - `lib/modules/config.js`: `createConfiguration()` now includes all required fields (`mode`, `membership`, `templates`)
  - Ensures consistency between full initialization and configuration recreation

---

## [1.0.4] - 2025-12-11

### Fixed
- **Bug #1**: Fixed missing `mode: 1` field when personal settings are skipped during initialization
  - `lib/modules/init.js`: Ensured `mode: 1` is always saved in both complete and partial configurations

- **Bug #2**: Fixed multi-language directory detection for Chinese workspaces
  - `lib/utils/config.js`: `findScriptsDir()` now supports both `scripts/` and `脚本/` directory names
  - `lib/modules/project.js`: Project path display now shows actual directory name instead of hardcoded `scripts/`

- **Bug #3**: Fixed project creation logic to work from anywhere within workspace
  - `lib/modules/project.js`: Removed duplicate workspace checks
  - Now correctly searches up the directory tree to find workspace root
  - Works from both workspace root and subdirectories

### Improved
- Project creation now works seamlessly regardless of current working directory within workspace
- Better error messages for workspace detection failures

---

## [1.0.3] - 2025-12-11

### Added
- **Multi-language directory support**: Added `dirLang` configuration for Chinese/English directory names
  - English: `scripts/`, `references/`
  - Chinese: `脚本/`, `参考资料/`

- **Mode field**: Added `mode` field in `config.json`
  - `mode: 1` = Mode 1 (Topic Selection Driven / 选题驱动)

- **Workflow type**: Added `workflowType` field in project `_meta.json`
  - Initial value: `null` (determined by Agent based on context)
  - Supported values: `"content-driven"`, `"structure-driven"`, `"data-driven"`

### Fixed
- Fixed missing `mode` field in `config.json` during initialization
- Fixed configuration structure: `mode` now correctly saved in `config.json`, `workflowType` in `_meta.json`

### Changed
- Optimized initialization process to ensure all required config fields are created
- Unified terminology for Mode 1/2/3:
  - Mode 1: 选题驱动 (Topic Selection Driven)
  - Mode 2: 结构驱动 (Structure Driven)
  - Mode 3: 数据驱动 (Data Driven)

---

## [1.0.2] - 2025-12-10

### Fixed
- Fixed npm package publishing format issues
- Improved package.json configuration

---

## [1.0.1] - 2025-12-09

### Added
- Initial release
- Complete Mode 1 (Topic Selection Driven) workflow
- 7-stage script creation process
- Bilingual support (Chinese/English)
- Interactive CLI interface

---

[1.0.3]: https://github.com/waoooolab/genkicap-video-workflow-v1.0/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/waoooolab/genkicap-video-workflow-v1.0/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/waoooolab/genkicap-video-workflow-v1.0/releases/tag/v1.0.1
