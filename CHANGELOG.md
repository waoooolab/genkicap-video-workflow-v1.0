# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
