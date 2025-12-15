#!/usr/bin/env node

/**
 * Video-workflow Setup CLI
 * Simple menu-driven setup system
 */

const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const VERSION = packageJson.version;

// Import UI components
const {
  colors,
  theme,
  formatSection,
  showInfo,
  showSuccess,
  showGoodbye,
  print,
  printHeader,
} = require('../lib/ui/components');

// Import input components
// (No imports needed - input functions called from modules)

// Import menu components
const {
  selectMenu,
} = require('../lib/ui/menu');

// Import utilities
const {
  t,
} = require('../lib/utils/i18n');

const {
  loadGlobalConfig,
  saveGlobalConfig,
  hasGlobalConfig,
  isWorkspaceInitialized,
  isInWorkspace,
} = require('../lib/utils/config');

// Import business modules
const { fullInitialization } = require('../lib/modules/init');
const { importWorkflow } = require('../lib/modules/import');
const { projectManagementMenu } = require('../lib/modules/project');
const { configurationMenu } = require('../lib/modules/config');
const { globalConfigMenu } = require('../lib/modules/global-config');
const {
  upgradeMembership,
  checkUpdate,
  uninstall,
} = require('../lib/modules/other');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  showGoodbye('zh'); // Default to Chinese, will be updated if lang is available
  rl.close();
  process.exit(0);
});

// Language selection (for main menu - no clear screen)
async function selectLanguageInMenu(lang) {
  const indent = '  ';

  console.log();
  showInfo(lang === 'zh' ? '选择界面语言' : 'Select interface language');
  console.log();

  const options = lang === 'zh'
    ? ['简体中文', 'English']
    : ['English', '简体中文'];

  const selected = await selectMenu(options, { lang, type: 'sub' });

  return selected === 1 ? 'en' : 'zh';
}

// Language selection (for first run - with welcome header)
async function selectLanguageInWelcome() {
  const indent = '  ';

  console.log();
  showInfo('选择界面语言 / Select interface language');
  console.log();

  const options = ['简体中文', 'English'];
  const selected = await selectMenu(options, { lang: 'zh', type: 'sub' });

  return selected === 1 ? 'en' : 'zh';
}

// Main menu
async function showMainMenu(lang, shouldClear = true) {
  if (shouldClear) {
    console.clear();
  }

  const genkicapAscii = [
    ' ██████╗ ███████╗███╗   ██╗██╗  ██╗██╗ ██████╗ █████╗ ██████╗ ',
    '██╔════╝ ██╔════╝████╗  ██║██║ ██╔╝██║██╔════╝██╔══██╗██╔══██╗',
    '██║  ███╗█████╗  ██╔██╗ ██║█████╔╝ ██║██║     ███████║██████╔╝',
    '██║   ██║██╔══╝  ██║╚██╗██║██╔═██╗ ██║██║     ██╔══██║██╔═══╝ ',
    '╚██████╔╝███████╗██║ ╚████║██║  ██╗██║╚██████╗██║  ██║██║     ',
    ' ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝╚═╝     '
  ];

  const mainTitle = lang === 'zh'
    ? 'Genkicap 视频内容工作流'
    : 'Genkicap Video Content Workflow';

  printHeader({
    asciiArt: genkicapAscii,
    title: mainTitle,
    subtitle: 'for Claude Code',
    version: VERSION,
    github: 'https://github.com/waoooolab/genkicap-video-workflow-v1.0'
  });

  const indent = '  '; // Same indent as header

  // 视频工作流区
  console.log(`${indent}${theme.primary}${formatSection(t('mainMenu.section1', lang))}${colors.reset}`);
  print.menuItem(t('mainMenu.init', lang));
  print.menuItem(t('mainMenu.import', lang));
  print.menuItem(t('mainMenu.project', lang));
  print.menuItem(t('mainMenu.upgrade', lang));
  print.menuItem(t('mainMenu.config', lang));
  console.log();

  // 其他区
  console.log(`${indent}${theme.primary}${formatSection(t('mainMenu.section2', lang))}${colors.reset}`);
  print.menuItem(t('mainMenu.globalConfig', lang));
  print.menuItem(t('mainMenu.lang', lang));
  print.menuItem(t('mainMenu.update', lang));
  print.menuItem(t('mainMenu.uninstall', lang));
  print.menuItem(t('mainMenu.exit', lang));
  console.log();

  // Use askInput instead of readline to fix Chinese character deletion issue
  const { askInput } = require('../lib/ui/input');
  const answer = await askInput(t('mainMenu.prompt', lang), '', indent);

  return answer.trim().toUpperCase();
}

// First run guide - returns updated language if changed
async function firstRunGuide(currentLang, hasGlobalConfig) {
  // Check if current directory is already initialized
  if (isWorkspaceInitialized()) {
    // Already initialized, skip first run guide and go directly to main menu
    return currentLang;
  }

  console.clear();

  const welcomeAscii = [
    '██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗',
    '██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝',
    '██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗  ',
    '██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝  ',
    '╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗',
    ' ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝'
  ];

  const welcomeTitle = currentLang === 'zh'
    ? '欢迎使用，我们将进入首次运行引导'
    : 'Welcome, we will enter the first run guide';

  printHeader({
    asciiArt: welcomeAscii,
    title: welcomeTitle,
    subtitle: '',
    version: VERSION,
    github: 'https://github.com/waoooolab/genkicap-video-workflow-v1.0'
  });

  let lang = currentLang;

  // If no global config, ask for language selection first
  if (!hasGlobalConfig) {
    lang = await selectLanguageInWelcome();

    // Save global config with selected language
    saveGlobalConfig({
      language: lang,
      version: VERSION,
      createdAt: new Date().toISOString()
    });

    showSuccess(t('firstRun.saved', lang));
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log();
  }

  const indent = '  '; // Same indent as header

  // Warning in yellow (without icon, aligned)
  const warningText = lang === 'zh'
    ? '请确认是否在当前目录初始化工作流？'
    : 'Confirm to initialize workflow in current directory?';
  console.log(`${indent}${theme.warning}${warningText}${colors.reset}`);
  console.log();

  // Path in normal color
  const currentDir = process.cwd();
  console.log(`${indent}${colors.reset}${currentDir}${colors.reset}`);
  console.log();

  // Note in normal color
  const noteText = lang === 'zh'
    ? 'Video Workflow 可能会读取、写入或执行此目录中的文件。这可能会带来安全风险，因此请仅使用来自可信来源的文件。'
    : 'Video Workflow may read, write, or execute files contained in this directory. This can pose security risks, so only use files from trusted sources.';
  console.log(`${indent}${colors.reset}${noteText}${colors.reset}`);
  console.log();

  const options = [
    t('firstRun.option1', lang).replace(/^1\.\s*/, ''),
    t('firstRun.option2', lang).replace(/^2\.\s*/, '')
  ];

  const selected = await selectMenu(options, {
    lang,
    type: 'firstRun'
  });

  // If user chose to initialize
  if (selected === 0) {
    await fullInitialization(lang);
    // After initialization, automatically continue to main menu
  } else {
    // User chose to skip - show a brief message then continue to main menu
    console.log();
    showInfo(lang === 'zh' ? '已跳过初始化，进入主菜单...' : 'Skipped initialization, entering main menu...');
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  // Clear screen before entering main menu to ensure clean display
  // Use ANSI escape codes for more reliable clearing
  process.stdout.write('\x1b[2J'); // Clear entire screen
  process.stdout.write('\x1b[3J'); // Clear scrollback buffer
  process.stdout.write('\x1b[H');  // Move cursor to top-left

  return lang; // Return the (possibly updated) language
}

// Main function
async function main() {
  try {
    // Check if running in interactive terminal (e.g., npm link)
    // If stdin is not a TTY, skip interactive setup
    if (!process.stdin.isTTY) {
      console.log('📦 Package installed successfully!');
      console.log('Run "video-workflow" or "vw-setup" to start.');
      return;
    }

    let lang = 'zh';
    let globalConfig = loadGlobalConfig();
    const hasConfig = hasGlobalConfig();

    // Load language from global config if exists
    if (hasConfig) {
      lang = globalConfig.language || 'zh';
    }

    // 【检测】工作环境 - 当前目录
    let isFirstShow = true;
    if (!isInWorkspace()) {
      // 当前目录不在工作环境：显示首次引导
      // firstRunGuide will handle language selection if no config
      lang = await firstRunGuide(lang, hasConfig);
      // firstRunGuide already clears screen at the end, so don't clear again
      isFirstShow = false;
    }

    // Main loop
    while (true) {
      const choice = await showMainMenu(lang, isFirstShow);
      isFirstShow = false; // After first show, don't clear screen

      if (choice === '1') {
        await fullInitialization(lang);
        // Sub menu completed, automatically return to main menu
      } else if (choice === '2') {
        await importWorkflow(lang);
        // Sub menu completed, automatically return to main menu
      } else if (choice === '3') {
        await projectManagementMenu(lang);
        // Sub menu completed, automatically return to main menu
      } else if (choice === '4') {
        await upgradeMembership(lang);
        // Sub menu completed, automatically return to main menu
      } else if (choice === '5') {
        await configurationMenu(lang);
        // Sub menu completed, automatically return to main menu
      } else if (choice === 'G') {
        await globalConfigMenu(lang);
        // Sub menu completed, automatically return to main menu
      } else if (choice === 'L') {
        lang = await selectLanguageInMenu(lang);
        // Update global config language
        globalConfig = loadGlobalConfig() || {};
        globalConfig.language = lang;
        saveGlobalConfig(globalConfig);
        showSuccess(t('firstRun.saved', lang));
        await new Promise(resolve => setTimeout(resolve, 500));
        // Don't clear screen - stay in current position
      } else if (choice === 'U') {
        await checkUpdate(lang);
        // Sub menu completed, automatically return to main menu
      } else if (choice === 'X') {
        await uninstall(lang);
        // Sub menu completed, automatically return to main menu
      } else if (choice === 'Q') {
        showGoodbye(lang);
        break;
      }
    }

    rl.close();
  } catch (error) {
    console.error(`\n${colors.red}Error:${colors.reset}`, error.message);
    rl.close();
    process.exit(1);
  }
}

// Run
if (require.main === module) {
  main();
}

module.exports = { main };
