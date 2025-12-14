/**
 * Configuration Management Module
 * Handles global and workspace configuration operations
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Global config path
const GLOBAL_CONFIG_PATH = path.join(os.homedir(), '.video-workflow-config.json');

// Global Claude CLAUDE.md path
const GLOBAL_CLAUDE_MD_PATH = path.join(os.homedir(), '.claude', 'CLAUDE.md');

/**
 * Load global configuration from user home directory
 * @returns {Object|null} Global config object or null if not exists
 */
function loadGlobalConfig() {
  if (fs.existsSync(GLOBAL_CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, 'utf8'));
  }
  return null;
}

/**
 * Save global configuration to user home directory
 * @param {Object} config - Configuration object to save
 */
function saveGlobalConfig(config) {
  fs.writeFileSync(GLOBAL_CONFIG_PATH, JSON.stringify(config, null, 2));
}

/**
 * Check if global config exists
 * @returns {boolean} True if global config exists
 */
function hasGlobalConfig() {
  return fs.existsSync(GLOBAL_CONFIG_PATH);
}

/**
 * Check if current directory is a workspace
 * Checks for existence of .workspace marker file
 * @returns {boolean} True if current directory is a workspace
 */
function isWorkspaceInitialized() {
  return fs.existsSync(path.join(process.cwd(), '.workspace'));
}

/**
 * Create workspace marker file
 * @param {string} targetDir - Target directory path (optional, defaults to current directory)
 */
function createWorkspaceMarker(targetDir = process.cwd()) {
  const marker = {
    type: 'video-workflow',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    createdBy: 'video-workflow-cli'
  };
  fs.writeFileSync(
    path.join(targetDir, '.workspace'),
    JSON.stringify(marker, null, 2)
  );
}

/**
 * Check if current directory is in a workspace
 * Searches for config.json in current and parent directories
 * @returns {boolean} True if in a workspace
 */
function isInWorkspace() {
  let current = process.cwd();

  while (current !== path.dirname(current)) {
    const configPath = path.join(current, 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        // Check if it's a video-workflow config
        if (config.niche || config.platform || config.templates) {
          return true;
        }
      } catch (e) {
        // Ignore invalid JSON
      }
    }
    current = path.dirname(current);
  }

  return false;
}

/**
 * Find config.json in current or parent directories
 * @returns {string|null} Path to config.json or null if not found
 */
function findConfigFile() {
  let current = process.cwd();

  while (current !== path.dirname(current)) {
    const configPath = path.join(current, 'config.json');
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    current = path.dirname(current);
  }

  return null;
}

/**
 * Find scripts directory in current or parent directories
 * Supports both English ('scripts') and Chinese ('脚本') directory names
 * @returns {string|null} Path to scripts directory or null if not found
 */
function findScriptsDir() {
  let current = process.cwd();

  while (current !== path.dirname(current)) {
    // Try English name first
    const scriptsPathEn = path.join(current, 'scripts');
    if (fs.existsSync(scriptsPathEn)) {
      return scriptsPathEn;
    }

    // Try Chinese name
    const scriptsPathZh = path.join(current, '脚本');
    if (fs.existsSync(scriptsPathZh)) {
      return scriptsPathZh;
    }

    current = path.dirname(current);
  }

  return null;
}

/**
 * Get workspace configuration from config.json
 * @returns {Object|null} Workspace config object or null if not found
 */
function getWorkspaceConfig() {
  const configPath = findConfigFile();
  if (!configPath) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    return null;
  }
}

/**
 * ASCII Art configuration template for global CLAUDE.md
 */
const ASCII_ART_CONFIG = `## ASCII 艺术字效果

### 工作空间对话开始标识
在 Genkicap Video Workflow 工作空间中开始新对话时，为我生成 "GENKICAP" 这个词的 ASCII 艺术字，要求如下：

  1. 使用 Box Drawing 字符（如 ██ ╗ ╔ ═ ║ ╚ ╝ 等）创建
  2. 全部使用大写字母：G-E-N-K-I-C-A-P
  3. 字体风格：粗体、实心填充
  4. 每个字母高度为 6 行
  5. 字母之间保持适当间距
  6. 使用 UTF-8 字符，确保在终端和文本编辑器中正确显示
  7. 风格参考：类似 figlet 的 "ANSI Shadow" 或 "Big" 字体风格

  示例格式：
  ██╗    ██╗ █████╗  ██████╗  ██████╗  ██████╗  ██████╗
  ██║    ██║██╔══██╗██╔═══██╗██╔═══██╗██╔═══██╗██╔═══██╗
  ██║ █╗ ██║███████║██║   ██║██║   ██║██║   ██║██║   ██║
  ██║███╗██║██╔══██║██║   ██║██║   ██║██║   ██║██║   ██║
  ╚███╔███╔╝██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝╚██████╔╝
   ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝  ╚═════╝

  触发时机：
  - 在 Genkicap Video Workflow 工作空间（检测到 .claude/CLAUDE.md 包含视频脚本创作助手配置）开始新对话时，自动显示 "GENKICAP"
  - 输入 "/genkicap" 时显示 "GENKICAP"

### 通用欢迎标识（可选）
如果不在特定工作空间，或用户主动触发欢迎，生成 "WAOOOO" 艺术字：
  - 输入 "/waoooo" 时显示
  - 输入 "你好，hello，hi, waoooo, WAOOOO, wao, hey, what's up, 你好啊, 嘿, 哈喽, 你好呀, 嘿嘿" 时显示
`;

/**
 * Check if global CLAUDE.md has ASCII Art configuration
 * @returns {boolean} True if ASCII Art configuration exists
 */
function hasAsciiArtConfig() {
  if (!fs.existsSync(GLOBAL_CLAUDE_MD_PATH)) {
    return false;
  }

  const content = fs.readFileSync(GLOBAL_CLAUDE_MD_PATH, 'utf8');
  return content.includes('## ASCII 艺术字效果');
}

/**
 * Ensure global CLAUDE.md has ASCII Art configuration
 * Creates .claude directory and CLAUDE.md if needed, or appends config if missing
 */
function ensureAsciiArtConfig() {
  const claudeDir = path.dirname(GLOBAL_CLAUDE_MD_PATH);

  // Create .claude directory if it doesn't exist
  if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
  }

  // Check if CLAUDE.md exists
  if (!fs.existsSync(GLOBAL_CLAUDE_MD_PATH)) {
    // Create new CLAUDE.md with ASCII Art config
    const initialContent = `# Claude Code 全局配置

${ASCII_ART_CONFIG}
`;
    fs.writeFileSync(GLOBAL_CLAUDE_MD_PATH, initialContent, 'utf8');
    return true;
  }

  // Check if ASCII Art config exists
  if (!hasAsciiArtConfig()) {
    // Append ASCII Art config to existing CLAUDE.md
    let content = fs.readFileSync(GLOBAL_CLAUDE_MD_PATH, 'utf8');

    // Add two newlines before appending if content doesn't end with newlines
    if (!content.endsWith('\n\n')) {
      if (content.endsWith('\n')) {
        content += '\n';
      } else {
        content += '\n\n';
      }
    }

    content += ASCII_ART_CONFIG;
    fs.writeFileSync(GLOBAL_CLAUDE_MD_PATH, content, 'utf8');
    return true;
  }

  return false;
}

module.exports = {
  GLOBAL_CONFIG_PATH,
  GLOBAL_CLAUDE_MD_PATH,
  loadGlobalConfig,
  saveGlobalConfig,
  hasGlobalConfig,
  isWorkspaceInitialized,
  createWorkspaceMarker,
  isInWorkspace,
  findConfigFile,
  findScriptsDir,
  getWorkspaceConfig,
  hasAsciiArtConfig,
  ensureAsciiArtConfig,
};
