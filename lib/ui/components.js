/**
 * UI Components Module
 * Handles all display-related UI components (no input handling)
 */

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

// Theme colors
const theme = {
  active: `${colors.bright}${colors.cyan}`,  // 选中项颜色 - 亮青色
  primary: colors.cyan,                       // 标准色 - 青色 (序号、分隔符)
  title: colors.reset,                        // 标题色 - 白色 (菜单标题)
  muted: colors.gray,                         // 辅助色 - 灰色 (描述、提示文字)
  success: colors.green,                      // 成功 - 绿色
  warning: colors.yellow,                     // 警告 - 黄色
  error: colors.red,                          // 错误 - 红色
  info: colors.blue,                          // 信息 - 蓝色
};

// Message symbols with colors
const symbols = {
  success: { icon: '✓', color: colors.green },   // 成功 - 绿色勾
  error: { icon: 'x', color: colors.red },       // 错误 - 红色x
  warning: { icon: '!', color: colors.yellow },  // 警告 - 黄色感叹号
  question: { icon: '?', color: colors.yellow }, // 问题 - 黄色问号
  info: { icon: 'ℹ', color: colors.blue },       // 信息 - 蓝色i
};

/**
 * Format section title with separator (e.g. "────── 完整初始化 ──────")
 */
function formatSection(text) {
  const separator = '─'.repeat(10);
  return `${separator} ${text} ${separator}`;
}

/**
 * Build hint text for interactive menus
 * @param {Array<string>} keys - Array of keys to show: 'arrows', 'space', 'number', 'letter', 'all', 'invert', 'enter', 'esc'
 * @param {string} lang - Language ('zh' or 'en')
 * @returns {string} Formatted hint text
 */
function buildHint(keys, lang = 'zh') {
  const hints = {
    zh: {
      arrows: `${colors.reset}↑↓${theme.muted} 方向键`,
      space: `${colors.reset}空格${theme.muted} 选中/取消`,
      number: `${colors.reset}0-9${theme.muted} 输入序号`,
      letter: `${colors.reset}字母${theme.muted} 快捷键`,
      all: `${colors.reset}A${theme.muted} 全选`,
      invert: `${colors.reset}I${theme.muted} 反选`,
      enter: `${colors.reset}⏎${theme.muted} 确认`,
      esc: `${colors.reset}Esc${theme.muted} 退出`,
    },
    en: {
      arrows: `${colors.reset}↑↓${theme.muted} Navigate`,
      space: `${colors.reset}Space${theme.muted} Select`,
      number: `${colors.reset}0-9${theme.muted} Type number`,
      letter: `${colors.reset}Letter${theme.muted} Shortcut`,
      all: `${colors.reset}A${theme.muted} All`,
      invert: `${colors.reset}I${theme.muted} Invert`,
      enter: `${colors.reset}⏎${theme.muted} Submit`,
      esc: `${colors.reset}Esc${theme.muted} Exit`,
    }
  };

  const langHints = hints[lang] || hints.zh;
  const parts = keys.map(key => langHints[key]).filter(Boolean);

  return parts.join(` ${theme.muted}•${colors.reset} `) + colors.reset;
}

/**
 * Show submenu title with section format
 */
function showSubMenuTitle(title, lang, indent = '  ') {
  console.log();
  console.log(`${indent}${theme.primary}${formatSection(title)}${colors.reset}`);
  console.log();
}

/**
 * Show progress indicator (e.g. "Step1 → Step2 → Step3")
 * @param {Array<string>} steps - Step names array
 * @param {number} currentStep - Current step index (0-based)
 * @param {string} lang - Language code
 * @param {string} indent - Indentation string
 */
function showProgress(steps, currentStep, lang, indent = '  ') {
  const progress = steps.map((step, index) => {
    if (index <= currentStep) {
      return `${colors.reset}${step}${colors.reset}`; // Completed/Current: white
    } else {
      return `${theme.muted}${step}${colors.reset}`; // Not started: gray
    }
  }).join(` ${theme.muted}→${colors.reset} `);

  console.log(`${indent}${progress}`);
  console.log();
}

/**
 * Show info message (blue with ℹ)
 */
function showInfo(message, indent = '') {
  console.log(`${indent}${symbols.info.color}${symbols.info.icon} ${message}${colors.reset}`);
}

/**
 * Show stage header with step number (no icon)
 * @param {number} stepNum - Step number (1-based)
 * @param {string} stepName - Step name
 * @param {string} lang - Language code
 * @param {string} indent - Indentation string
 */
function showStageHeader(stepNum, stepName, lang = 'zh', indent = '  ') {
  const stepLabel = lang === 'zh' ? `步骤${stepNum}` : `Step ${stepNum}`;
  console.log(`${indent}${stepLabel}: ${stepName}`);
  console.log();
}

/**
 * Show stage separator (between stages) - same length as formatSection
 * @param {string} indent - Indentation string
 */
function showStageSeparator(indent = '  ') {
  const separator = '─'.repeat(10);
  console.log();
  console.log(`${indent}${theme.primary}${separator}${colors.reset}`);
  console.log();
}

/**
 * Show success message (green with ✓)
 */
function showSuccess(message, indent = '') {
  console.log(`${indent}${symbols.success.color}${symbols.success.icon} ${message}${colors.reset}`);
}

/**
 * Show error message (red with x)
 */
function showError(message, indent = '') {
  console.log(`${indent}${symbols.error.color}${symbols.error.icon} ${message}${colors.reset}`);
}

/**
 * Show warning message (yellow with !)
 */
function showWarning(message, indent = '') {
  console.log(`${indent}${symbols.warning.color}${symbols.warning.icon} ${message}${colors.reset}`);
}

/**
 * Show question message (yellow with ?)
 */
function showQuestion(message, indent = '') {
  console.log(`${indent}${symbols.question.color}${symbols.question.icon} ${message}${colors.reset}`);
}

/**
 * Show goodbye message and exit
 */
function showGoodbye(lang = 'zh') {
  console.log('\n');
  const message = lang === 'zh'
    ? '👋 感谢使用 Genkicap 再见！'
    : '👋 Thank you for using Genkicap. Goodbye!';
  console.log(`${theme.active}${message}${colors.reset}`);
  console.log();
}

// Print helpers (kept for backward compatibility)
const print = {
  title: (text) => console.log(`\n${theme.active}${text}${colors.reset}\n`),
  success: (text) => showSuccess(text),
  info: (text) => showInfo(text),
  warning: (text) => showWarning(text),
  error: (text) => showError(text),
  question: (text) => showQuestion(text),
  dim: (text) => console.log(`${colors.dim}${text}${colors.reset}`),
  // Format menu item: number in primary, title in title color, description in muted
  menuItem: (text, indent = '  ') => {
    const match = text.match(/^([^.]+\.\s*)([^-]+)(\s*-\s*.+)?$/);
    if (match) {
      const num = match[1];      // "1. " or "L. "
      const title = match[2];    // "完整初始化"
      const desc = match[3] || ''; // " - 配置工作环境并安装模板"

      // Special color for Q. Exit - use red
      const isExit = num.trim().toUpperCase().startsWith('Q');
      const numColor = isExit ? theme.error : theme.primary;
      const titleColor = isExit ? theme.error : theme.title;

      console.log(`${indent}${numColor}${num}${titleColor}${title}${theme.muted}${desc}${colors.reset}`);
    } else {
      console.log(`${indent}${text}`);
    }
  }
};

/**
 * Print header with ASCII art
 */
function printHeader(options) {
  const { asciiArt, title, subtitle, version, github } = options;
  const indent = '  '; // 2 spaces indent to align with menu numbers

  // Top separator - no indent
  console.log(`${theme.primary}${'═'.repeat(71)}${colors.reset}`);
  console.log();

  // ASCII art
  asciiArt.forEach(line => {
    console.log(`${indent}${theme.active}${line}${colors.reset}`);
  });
  console.log();

  // Title and subtitle
  console.log(`${indent}${colors.bright}${title}${colors.reset}${subtitle ? `  ${theme.muted}${subtitle}${colors.reset}` : ''}`);
  console.log();

  // Bottom separator - no indent
  console.log(`${theme.primary}${'═'.repeat(71)}${colors.reset}`);
  console.log();

  // Version info
  console.log(`${indent}${theme.muted}Version: ${colors.reset}${theme.primary}${version}${colors.reset}  ${theme.muted}|${colors.reset}  ${theme.primary}${github}${colors.reset}`);
  console.log();
}

module.exports = {
  colors,
  theme,
  symbols,
  formatSection,
  buildHint,
  showSubMenuTitle,
  showProgress,
  showInfo,
  showStageHeader,
  showStageSeparator,
  showSuccess,
  showError,
  showWarning,
  showQuestion,
  showGoodbye,
  print,
  printHeader,
};
