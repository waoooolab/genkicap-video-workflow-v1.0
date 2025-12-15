/**
 * Global Configuration Management Module
 * Manages ~/.claude/CLAUDE.md
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const {
  showSubMenuTitle,
  showInfo,
  showSuccess,
  showError,
  showWarning,
  colors,
  theme,
} = require('../ui/components');

const { askInput, askYesNo } = require('../ui/input');
const { selectMenu } = require('../ui/menu');
const { t } = require('../utils/i18n');

const GLOBAL_CLAUDE_DIR = path.join(os.homedir(), '.claude');
const GLOBAL_CLAUDE_MD = path.join(GLOBAL_CLAUDE_DIR, 'CLAUDE.md');

/**
 * Generate default global config based on language
 */
function getDefaultGlobalConfig(lang) {
  if (lang === 'zh') {
    return `# Claude Code 全局配置

Always respond in Chinese-simplified

## ASCII 艺术字效果
请在新对话开始，为我生成 "GENKICAP" 这个词的 ASCII 艺术字，要求如下：

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

  触发条件：
  - 每次新对话开始时自动显示
  - 输入 "/genkicap" 时显示
  - 输入 "你好，hello，hi, genkicap, GENKICAP, hey, what's up, 你好啊, 嘿, 哈喽, 你好呀, 嘿嘿" 时显示
`;
  } else {
    return `# Claude Code Global Configuration

Always respond in English

## ASCII Art Effect
At the start of a new conversation, generate ASCII art for the word "GENKICAP" with the following requirements:

  1. Use Box Drawing characters (such as ██ ╗ ╔ ═ ║ ╚ ╝)
  2. All uppercase letters: G-E-N-K-I-C-A-P
  3. Font style: Bold, solid fill
  4. Each letter height: 6 lines
  5. Maintain appropriate spacing between letters
  6. Use UTF-8 characters to ensure correct display in terminals and text editors
  7. Style reference: Similar to figlet's "ANSI Shadow" or "Big" font style

  Example format:
  ██╗    ██╗ █████╗  ██████╗  ██████╗  ██████╗  ██████╗
  ██║    ██║██╔══██╗██╔═══██╗██╔═══██╗██╔═══██╗██╔═══██╗
  ██║ █╗ ██║███████║██║   ██║██║   ██║██║   ██║██║   ██║
  ██║███╗██║██╔══██║██║   ██║██║   ██║██║   ██║██║   ██║
  ╚███╔███╔╝██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝╚██████╔╝
   ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝  ╚═════╝

  Trigger conditions:
  - Automatically display at the start of each new conversation
  - Display when "/genkicap" is entered
  - Display when "hello, hi, genkicap, GENKICAP, hey, what's up" is entered
`;
  }
}

/**
 * Global configuration management menu
 */
async function globalConfigMenu(lang) {
  const indent = '  ';

  while (true) {
    console.clear();
    showSubMenuTitle(t('globalConfig.title', lang), lang, indent);

    const options = [
      t('globalConfig.view', lang),
      t('globalConfig.edit', lang),
      t('globalConfig.reset', lang),
      t('globalConfig.back', lang)
    ];

    const selected = await selectMenu(options, { lang, type: 'sub' });

    if (selected === 0) {
      await viewGlobalConfig(lang);
    } else if (selected === 1) {
      await editGlobalConfig(lang);
    } else if (selected === 2) {
      await resetGlobalConfig(lang);
    } else if (selected === 3) {
      break;
    }
  }
}

/**
 * View global configuration
 */
async function viewGlobalConfig(lang) {
  const indent = '  ';

  console.log();
  showInfo(t('globalConfig.viewing', lang), indent);
  console.log();

  if (!fs.existsSync(GLOBAL_CLAUDE_MD)) {
    showWarning(t('globalConfig.notExists', lang), indent);
    console.log();
    console.log(`${indent}${theme.muted}${t('globalConfig.path', lang)}: ${GLOBAL_CLAUDE_MD}${colors.reset}`);
    console.log();
  } else {
    const content = fs.readFileSync(GLOBAL_CLAUDE_MD, 'utf8');
    const lines = content.split('\n');

    console.log(`${indent}${theme.muted}${t('globalConfig.path', lang)}: ${GLOBAL_CLAUDE_MD}${colors.reset}`);
    console.log(`${indent}${theme.muted}${t('globalConfig.totalLines', lang)}: ${lines.length}${colors.reset}`);
    console.log();

    // Show hint before asking
    const hint = lang === 'zh'
      ? '查看器操作 • q 退出 • ↑↓ 滚动 • Space 翻页'
      : 'Viewer controls • q quit • ↑↓ scroll • Space next page';
    console.log(`${indent}${theme.muted}${hint}${colors.reset}`);
    console.log();

    // Ask if user wants to view full content
    const viewFull = await askYesNo(
      lang === 'zh' ? '是否显示全部内容？' : 'View full content?',
      lang,
      false
    );
    console.log(); // Preserve the line after askYesNo

    if (viewFull) {
      const viewer = process.platform === 'win32' ? 'more' : 'less -R';
      try {
        execSync(`${viewer} "${GLOBAL_CLAUDE_MD}"`, { stdio: 'inherit' });
      } catch (err) {
        console.log();
        console.log(content);
      }
      console.log();
    } else {
      console.log();
      // Show preview only
      const previewLines = lines.slice(0, 20);
      console.log(`${indent}${theme.primary}${t('globalConfig.preview', lang)}:${colors.reset}`);
      console.log();
      previewLines.forEach(line => {
        console.log(`${indent}${theme.muted}${line}${colors.reset}`);
      });
      if (lines.length > 20) {
        console.log(`${indent}${theme.muted}...${colors.reset}`);
      }
    }
    console.log();
  }

  const continuePrompt = lang === 'zh' ? '按 Enter 返回' : 'Press Enter to return';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Edit global configuration
 */
async function editGlobalConfig(lang) {
  const indent = '  ';

  console.log();
  showInfo(t('globalConfig.editing', lang), indent);
  console.log();

  // Ensure directory exists
  if (!fs.existsSync(GLOBAL_CLAUDE_DIR)) {
    fs.mkdirSync(GLOBAL_CLAUDE_DIR, { recursive: true });
  }

  // Create default config if not exists
  if (!fs.existsSync(GLOBAL_CLAUDE_MD)) {
    fs.writeFileSync(GLOBAL_CLAUDE_MD, getDefaultGlobalConfig(lang), 'utf8');
    showSuccess(t('globalConfig.created', lang), indent);
    console.log();
  }

  console.log(`${indent}${theme.muted}${t('globalConfig.path', lang)}: ${GLOBAL_CLAUDE_MD}${colors.reset}`);
  console.log();

  // Detect editor
  const editor = process.env.EDITOR || process.env.VISUAL || (process.platform === 'win32' ? 'notepad' : 'nano');

  showInfo(lang === 'zh' ? `使用编辑器: ${editor}` : `Using editor: ${editor}`, indent);
  console.log();
  showInfo(lang === 'zh' ? '编辑完成后保存并退出编辑器' : 'Save and exit editor when done', indent);
  console.log();

  const continuePrompt = lang === 'zh' ? '按 Enter 打开编辑器' : 'Press Enter to open editor';
  await askInput(continuePrompt, '', indent);

  try {
    execSync(`${editor} "${GLOBAL_CLAUDE_MD}"`, { stdio: 'inherit' });
    console.log();
    showSuccess(t('globalConfig.saved', lang), indent);
    console.log();
  } catch (err) {
    console.log();
    showError(`${t('globalConfig.editFailed', lang)}: ${err.message}`, indent);
    console.log();
  }

  const returnPrompt = lang === 'zh' ? '按 Enter 返回' : 'Press Enter to return';
  await askInput(returnPrompt, '', indent);
  console.log();
}

/**
 * Reset global configuration to default
 */
async function resetGlobalConfig(lang) {
  const indent = '  ';

  console.log();
  console.log(`${indent}${theme.warning}${t('globalConfig.resetWarning', lang)}${colors.reset}`);
  console.log();

  if (fs.existsSync(GLOBAL_CLAUDE_MD)) {
    console.log(`${indent}${theme.muted}${t('globalConfig.currentPath', lang)}: ${GLOBAL_CLAUDE_MD}${colors.reset}`);
    console.log();
  }

  const confirmed = await askYesNo(
    t('globalConfig.confirmReset', lang),
    lang,
    false
  );

  if (!confirmed) {
    console.log();
    showInfo(t('globalConfig.cancelled', lang), indent);
    console.log();
    const continuePrompt = lang === 'zh' ? '按 Enter 返回' : 'Press Enter to return';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  console.log();

  try {
    // Backup existing config
    if (fs.existsSync(GLOBAL_CLAUDE_MD)) {
      const backupPath = `${GLOBAL_CLAUDE_MD}.backup.${Date.now()}`;
      fs.copyFileSync(GLOBAL_CLAUDE_MD, backupPath);
      showInfo(lang === 'zh' ? `已备份到: ${backupPath}` : `Backed up to: ${backupPath}`, indent);
      console.log();
    }

    // Ensure directory exists
    if (!fs.existsSync(GLOBAL_CLAUDE_DIR)) {
      fs.mkdirSync(GLOBAL_CLAUDE_DIR, { recursive: true });
    }

    // Write default config
    fs.writeFileSync(GLOBAL_CLAUDE_MD, getDefaultGlobalConfig(lang), 'utf8');
    showSuccess(t('globalConfig.resetSuccess', lang), indent);
    console.log();
  } catch (err) {
    showError(`${t('globalConfig.resetFailed', lang)}: ${err.message}`, indent);
    console.log();
  }

  const continuePrompt = lang === 'zh' ? '按 Enter 返回' : 'Press Enter to return';
  await askInput(continuePrompt, '', indent);
  console.log();
}

module.exports = {
  globalConfigMenu,
};
