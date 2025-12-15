/**
 * Other Operations Module
 * Handles upgrade, update check, and uninstall operations
 */

const fs = require('fs');
const path = require('path');
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
const { t } = require('../utils/i18n');

/**
 * Upgrade membership (placeholder)
 */
async function upgradeMembership(lang) {
  const indent = '  ';

  showSubMenuTitle(t('upgrade.title', lang), lang, indent);

  showInfo(t('upgrade.benefits', lang));
  console.log(t('upgrade.benefit1', lang));
  console.log(t('upgrade.benefit2', lang));
  console.log(t('upgrade.benefit3', lang));
  console.log(t('upgrade.benefit4', lang));
  console.log();

  showWarning(t('upgrade.comingSoon', lang));
  console.log();
  showInfo(t('upgrade.willSupport', lang));
  console.log(t('upgrade.method1', lang));
  console.log(t('upgrade.method2', lang));
  console.log();
}

/**
 * Check for package updates
 */
async function checkUpdate(lang) {
  const indent = '  ';

  showSubMenuTitle(t('checkUpdate.title', lang), lang, indent);

  const packageName = '@waoooo/genkicap-workflow';

  // Define tasks for progress display
  const checkTasks = lang === 'zh'
    ? ['读取当前版本', '查询最新版本', '对比版本信息']
    : ['Read current version', 'Query latest version', 'Compare versions'];

  // Track task completion states
  const taskStates = [false, false, false];

  // Function to render tasks
  const renderTasks = () => {
    if (taskStates.some(state => state)) {
      // Move cursor up to first task
      process.stdout.write(`\x1b[${checkTasks.length}A`);
    }

    // Render all tasks
    checkTasks.forEach((task, index) => {
      process.stdout.write(`\r${indent}`); // Clear line
      if (taskStates[index]) {
        process.stdout.write(`${colors.green}✓ ${task}${colors.reset}\n`);
      } else {
        process.stdout.write(`${theme.muted}○ ${task}${colors.reset}\n`);
      }
    });
  };

  // Initial render
  renderTasks();

  // Helper function to update task status with delay
  const updateTaskStatus = async (taskIndex, delay = 300) => {
    await new Promise(resolve => setTimeout(resolve, delay));
    taskStates[taskIndex] = true;
    renderTasks();
  };

  try {
    // Task 1: Read current version
    const packageJsonPath = path.join(__dirname, '../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    await updateTaskStatus(0);

    // Task 2: Query latest version from npm
    let latestVersion;
    try {
      const result = execSync(`npm view ${packageName} version 2>&1`, { encoding: 'utf8' });

      // Check if result contains error messages
      if (result.includes('404') || result.includes('Not Found') || result.includes('E404')) {
        throw new Error(lang === 'zh' ? '包未发布到 npm' : 'Package not published to npm');
      }

      latestVersion = result.trim();
      await updateTaskStatus(1);
    } catch (err) {
      // Show error for Task 2
      taskStates[1] = true;
      process.stdout.write(`\x1b[${checkTasks.length}A`);
      checkTasks.forEach((task, index) => {
        process.stdout.write(`\r${indent}`);
        if (index === 1) {
          process.stdout.write(`${colors.red}✗ ${task}${colors.reset}\n`);
        } else if (taskStates[index]) {
          process.stdout.write(`${colors.green}✓ ${task}${colors.reset}\n`);
        } else {
          process.stdout.write(`${theme.muted}○ ${task}${colors.reset}\n`);
        }
      });

      console.log();
      showWarning(lang === 'zh' ? '无法查询最新版本（包未发布或网络错误）' : 'Cannot query latest version (package not published or network error)', indent);
      console.log();

      // Wait for user to acknowledge
      const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
      await askInput(continuePrompt, '', indent);
      console.log();
      return;
    }

    // Task 3: Compare versions
    await updateTaskStatus(2);

    // Show results
    console.log();
    console.log(`${indent}${theme.primary}当前版本:${colors.reset} ${currentVersion}`);
    console.log(`${indent}${theme.primary}最新版本:${colors.reset} ${latestVersion}`);
    console.log();

    // Compare versions
    if (currentVersion === latestVersion) {
      showSuccess(lang === 'zh' ? '✓ 已是最新版本！' : '✓ Already up to date!', indent);
      console.log();
    } else {
      showWarning(lang === 'zh' ? `发现新版本: ${latestVersion}` : `New version available: ${latestVersion}`, indent);
      console.log();

      showInfo(lang === 'zh' ? '更新方法：' : 'Update method:', indent);
      console.log(`${indent}${theme.primary}npm update -g ${packageName}${colors.reset}`);
      console.log();
      console.log(`${indent}${lang === 'zh' ? '或者' : 'or'}`);
      console.log();
      console.log(`${indent}${theme.primary}npm install -g ${packageName}@latest${colors.reset}`);
      console.log();
    }
  } catch (error) {
    console.log();
    showError(`${lang === 'zh' ? '检查更新失败' : 'Update check failed'}: ${error.message}`, indent);
    console.log();
  }

  // Wait for user to acknowledge
  const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Uninstall npm package
 */
async function uninstall(lang) {
  const indent = '  ';

  showSubMenuTitle(t('uninstall.title', lang), lang, indent);

  const packageName = '@waoooo/genkicap-workflow';

  showWarning(lang === 'zh' ? '此操作将卸载 npm 包' : 'This will uninstall the npm package');
  console.log();
  console.log(`${indent}${theme.primary}包名:${colors.reset} ${packageName}`);
  console.log();
  showInfo(lang === 'zh' ? '工作空间目录和项目文件不会被删除' : 'Workspace directories and project files will NOT be deleted');
  console.log(`${indent}${lang === 'zh' ? '如需删除工作空间文件，请手动删除对应目录' : 'To delete workspace files, please manually delete the directories'}`);
  console.log();

  // Ask for confirmation
  const confirmed = await askYesNo(
    lang === 'zh' ? '确认卸载 npm 包？' : 'Confirm uninstall npm package?',
    lang,
    false
  );

  if (!confirmed) {
    console.log();
    showInfo(lang === 'zh' ? '已取消' : 'Cancelled');
    console.log();

    // Wait for user to acknowledge
    const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  console.log();

  // Define tasks for progress display
  const uninstallTasks = lang === 'zh'
    ? ['执行卸载命令', '清理全局链接', '完成卸载']
    : ['Execute uninstall command', 'Clean global links', 'Complete uninstall'];

  // Track task completion states
  const taskStates = [false, false, false];

  // Function to render tasks
  const renderTasks = () => {
    if (taskStates.some(state => state)) {
      // Move cursor up to first task
      process.stdout.write(`\x1b[${uninstallTasks.length}A`);
    }

    // Render all tasks
    uninstallTasks.forEach((task, index) => {
      process.stdout.write(`\r${indent}`); // Clear line
      if (taskStates[index]) {
        process.stdout.write(`${colors.green}✓ ${task}${colors.reset}\n`);
      } else {
        process.stdout.write(`${theme.muted}○ ${task}${colors.reset}\n`);
      }
    });
  };

  // Initial render
  renderTasks();

  // Helper function to update task status with delay
  const updateTaskStatus = async (taskIndex, delay = 300) => {
    await new Promise(resolve => setTimeout(resolve, delay));
    taskStates[taskIndex] = true;
    renderTasks();
  };

  try {
    // Task 1: Execute npm uninstall
    execSync(`npm uninstall -g ${packageName}`, { stdio: 'pipe' });
    await updateTaskStatus(0);

    // Task 2: Clean global links (automatic by npm)
    await updateTaskStatus(1);

    // Task 3: Complete uninstall
    await updateTaskStatus(2);

    console.log();
    showSuccess(lang === 'zh' ? '✓ 卸载完成！' : '✓ Uninstall complete!');
    console.log();
    showInfo(lang === 'zh' ? '感谢使用 Video Workflow！' : 'Thank you for using Video Workflow!');
    console.log();

    // Exit after uninstall
    process.exit(0);
  } catch (error) {
    // Show error
    console.log();
    showError(`${lang === 'zh' ? '卸载失败' : 'Uninstall failed'}: ${error.message}`);
    console.log();

    // Wait for user to acknowledge
    const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
    await askInput(continuePrompt, '', indent);
    console.log();
  }
}

module.exports = {
  upgradeMembership,
  checkUpdate,
  uninstall,
};
