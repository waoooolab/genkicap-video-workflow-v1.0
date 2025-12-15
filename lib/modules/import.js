/**
 * Import/Update Workflow Module
 * Handles workflow import, update, and removal operations
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

const {
  askInput,
  askYesNo,
} = require('../ui/input');

const { selectMenu, selectMultiMenu } = require('../ui/menu');
const { t } = require('../utils/i18n');
const { getPackageRoot, copyDir } = require('../utils/file');
const { isWorkspaceInitialized, createWorkspaceMarker } = require('../utils/config');

/**
 * Check if current directory has workflow
 */
function hasWorkflow() {
  return fs.existsSync('./.claude');
}

/**
 * Import workflow - Full import to current directory
 * Note: Workspace and workflow existence checks are done in main menu
 */
async function importNewWorkflow(lang) {
  const indent = '  ';

  showInfo(lang === 'zh' ? '导入工作流到当前工作空间' : 'Import Workflow to Current Workspace');
  console.log();

  const currentDir = process.cwd();
  console.log(`${indent}${lang === 'zh' ? '当前目录' : 'Current directory'}: ${currentDir}`);
  console.log();

  const confirmPrompt = lang === 'zh' ? '确认导入到当前目录？' : 'Confirm import to current directory?';
  const confirmed = await askYesNo(confirmPrompt, lang);
  if (!confirmed) {
    showInfo(lang === 'zh' ? '已取消' : 'Cancelled');
    console.log();

    // Wait for user to acknowledge before returning
    const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  console.log();

  // Define tasks for progress display
  const importTasks = lang === 'zh'
    ? ['创建目录结构', '复制 Agent 配置', '复制参考资料', '复制文档']
    : ['Create directory structure', 'Copy Agent config', 'Copy references', 'Copy documentation'];

  // Track task completion states
  const taskStates = [false, false, false, false];

  // Function to render tasks
  const renderTasks = () => {
    if (taskStates.some(state => state)) {
      // Move cursor up to first task
      process.stdout.write(`\x1b[${importTasks.length}A`);
    }

    // Render all tasks
    importTasks.forEach((task, index) => {
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

  const packageRoot = getPackageRoot();

  try {
    // Read config.json to get dirLang setting
    let dirLang = 'en'; // Default to English
    const configPath = path.join(process.cwd(), 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        dirLang = config.dirLang || 'en';
      } catch (err) {
        // Use default if config read fails
      }
    }

    const { getDirName } = require('../utils/i18n');

    // Task 1: Create directory structure with localized names
    const scriptsDir = getDirName('scripts', dirLang);
    const referencesDir = getDirName('references', dirLang);

    // Create scripts directory
    fs.mkdirSync(`./${scriptsDir}`, { recursive: true });

    // Copy scripts guide file (根据目录语言选择对应版本)
    const scriptsGuideSrc = dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'scripts', '_GUIDE_CN.md')) ? '_GUIDE_CN.md' : '_GUIDE.md')
      : '_GUIDE.md';
    if (fs.existsSync(path.join(packageRoot, 'scripts', scriptsGuideSrc))) {
      fs.copyFileSync(
        path.join(packageRoot, 'scripts', scriptsGuideSrc),
        path.join(`./${scriptsDir}`, '_GUIDE.md')  // 统一复制为 _GUIDE.md
      );
    }

    await updateTaskStatus(0);

    // Task 2: Copy .claude/ (根据目录语言选择对应版本的 CLAUDE.md)
    const claudeDir = './.claude';
    fs.mkdirSync(claudeDir, { recursive: true });

    // Copy CLAUDE.md based on dirLang
    const claudeSrc = dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, '.claude', 'CLAUDE_CN.md')) ? 'CLAUDE_CN.md' : 'CLAUDE.md')
      : 'CLAUDE.md';
    if (fs.existsSync(path.join(packageRoot, '.claude', claudeSrc))) {
      fs.copyFileSync(
        path.join(packageRoot, '.claude', claudeSrc),
        path.join(claudeDir, 'CLAUDE.md')  // 统一复制为 CLAUDE.md
      );
    }

    // Copy template directory
    if (fs.existsSync(path.join(packageRoot, '.claude', 'template'))) {
      copyDir(
        path.join(packageRoot, '.claude', 'template'),
        path.join(claudeDir, 'template'),
        []
      );
    }

    // Copy skills directory
    if (fs.existsSync(path.join(packageRoot, '.claude', 'skills'))) {
      copyDir(
        path.join(packageRoot, '.claude', 'skills'),
        path.join(claudeDir, 'skills'),
        []
      );
    }

    // Install skills to Claude Code
    try {
      const skillsPath = path.join(claudeDir, 'skills');
      if (fs.existsSync(skillsPath)) {
        const skillDirs = fs.readdirSync(skillsPath).filter(name => {
          const skillPath = path.join(skillsPath, name);
          return fs.statSync(skillPath).isDirectory();
        });

        for (const skillName of skillDirs) {
          const skillPath = path.join(skillsPath, skillName);
          execSync(`claude-code skill install "${skillPath}"`, { stdio: 'pipe' });
        }
      }
    } catch (err) {
      // Silently fail if Claude Code CLI not available
    }

    await updateTaskStatus(1);

    // Task 3: Create references/ with language-specific subdirectories
    fs.mkdirSync(`./${referencesDir}`, { recursive: true });

    // Create language-specific subdirectories
    if (dirLang === 'zh') {
      fs.mkdirSync(path.join(`./${referencesDir}`, '视频'), { recursive: true });
      fs.mkdirSync(path.join(`./${referencesDir}`, '账号'), { recursive: true });
      fs.mkdirSync(path.join(`./${referencesDir}`, '调研'), { recursive: true });
    } else {
      fs.mkdirSync(path.join(`./${referencesDir}`, 'videos'), { recursive: true });
      fs.mkdirSync(path.join(`./${referencesDir}`, 'accounts'), { recursive: true });
      fs.mkdirSync(path.join(`./${referencesDir}`, 'research'), { recursive: true });
    }

    // Copy references guide file (根据目录语言选择对应版本)
    const refGuideSrc = dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'references', '_GUIDE_CN.md')) ? '_GUIDE_CN.md' : '_GUIDE.md')
      : '_GUIDE.md';
    if (fs.existsSync(path.join(packageRoot, 'references', refGuideSrc))) {
      fs.copyFileSync(
        path.join(packageRoot, 'references', refGuideSrc),
        path.join(`./${referencesDir}`, '_GUIDE.md')  // 统一复制为 _GUIDE.md
      );
    }

    await updateTaskStatus(2);

    // Task 4: Copy README.md, QUICKSTART.md, LICENSE (根据目录语言选择对应版本)
    const readmeSrc = dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'docs/zh-CN/README.md')) ? 'docs/zh-CN/README.md' : 'README.md')
      : 'README.md';
    const quickstartSrc = dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'docs/zh-CN/QUICKSTART.md')) ? 'docs/zh-CN/QUICKSTART.md' : 'QUICKSTART.md')
      : 'QUICKSTART.md';
    const licenseSrc = dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'docs/zh-CN/LICENSE')) ? 'docs/zh-CN/LICENSE' : 'LICENSE')
      : 'LICENSE';

    if (fs.existsSync(path.join(packageRoot, readmeSrc))) {
      fs.copyFileSync(path.join(packageRoot, readmeSrc), './README.md');
    }
    if (fs.existsSync(path.join(packageRoot, quickstartSrc))) {
      fs.copyFileSync(path.join(packageRoot, quickstartSrc), './QUICKSTART.md');
    }
    if (fs.existsSync(path.join(packageRoot, licenseSrc))) {
      fs.copyFileSync(path.join(packageRoot, licenseSrc), './LICENSE');
    }
    await updateTaskStatus(3);

    // Show success message
    console.log();
    showSuccess(lang === 'zh' ? '全部导入完成！' : 'Full import complete!');
    console.log();
  } catch (error) {
    // Show error if import fails
    console.log();
    showError(`${lang === 'zh' ? '导入失败' : 'Import failed'}: ${error.message}`);
    console.log();
  }

  // Wait for user to acknowledge before returning
  const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Update workflow - Multi-select what to update
 * Note: Workspace and workflow existence checks are done in main menu
 */
async function updateWorkflow(lang) {
  const indent = '  ';

  showInfo(lang === 'zh' ? '更新当前工作空间的工作流' : 'Update Workflow in Current Workspace');
  console.log();

  const currentDir = process.cwd();
  console.log(`${indent}${lang === 'zh' ? '当前目录' : 'Current directory'}: ${currentDir}`);
  console.log();

  showInfo(lang === 'zh' ? '选择要更新的内容' : 'Select Items to Update');
  console.log();

  const updateOptions = lang === 'zh'
    ? [
        '.claude/ - Agent 配置和模板',
        'README.md - 工作流说明文档',
        'QUICKSTART.md - 快速开始指南',
        'references/ - 参考资料库'
      ]
    : [
        '.claude/ - Agent config and templates',
        'README.md - Workflow documentation',
        'QUICKSTART.md - Quick start guide',
        'references/ - Reference library'
      ];

  // Default select all items
  const selected = await selectMultiMenu(updateOptions, {
    lang,
    defaultSelected: [0, 1, 2, 3]
  });

  if (selected.length === 0) {
    console.log();
    showInfo(lang === 'zh' ? '未选择任何项，已取消' : 'No items selected, cancelled');
    console.log();

    // Wait for user to acknowledge before returning
    const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  console.log();

  const packageRoot = getPackageRoot();

  // Read config.json to get dirLang setting
  let dirLang = 'en'; // Default to English
  const configPath = path.join(process.cwd(), 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      dirLang = config.dirLang || 'en';
    } catch (err) {
      // Use default if config read fails
    }
  }

  const { getDirName } = require('../utils/i18n');
  const referencesDir = getDirName('references', dirLang);

  // Build task list based on selection
  const updateTasks = [];
  const taskMapping = []; // Track which index in selected corresponds to which task

  selected.forEach(index => {
    const taskName = lang === 'zh'
      ? ['.claude/ 配置', 'README.md', 'QUICKSTART.md', `${referencesDir}/ 资料`][index]
      : ['.claude/ config', 'README.md', 'QUICKSTART.md', `${referencesDir}/`][index];
    updateTasks.push(taskName);
    taskMapping.push(index);
  });

  // Track task completion states
  const taskStates = new Array(updateTasks.length).fill(false);

  // Function to render tasks
  const renderTasks = () => {
    if (taskStates.some(state => state)) {
      // Move cursor up to first task
      process.stdout.write(`\x1b[${updateTasks.length}A`);
    }

    // Render all tasks
    updateTasks.forEach((task, index) => {
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
    // Update based on selection
    for (let i = 0; i < taskMapping.length; i++) {
      const index = taskMapping[i];

      if (index === 0) {
        // Update .claude/ (根据目录语言选择对应版本的 CLAUDE.md)
        if (fs.existsSync('./.claude')) {
          fs.rmSync('./.claude', { recursive: true, force: true });
        }

        const claudeDir = './.claude';
        fs.mkdirSync(claudeDir, { recursive: true });

        // Copy CLAUDE.md based on dirLang
        const claudeSrc = dirLang === 'zh'
          ? (fs.existsSync(path.join(packageRoot, '.claude', 'CLAUDE_CN.md')) ? 'CLAUDE_CN.md' : 'CLAUDE.md')
          : 'CLAUDE.md';
        if (fs.existsSync(path.join(packageRoot, '.claude', claudeSrc))) {
          fs.copyFileSync(
            path.join(packageRoot, '.claude', claudeSrc),
            path.join(claudeDir, 'CLAUDE.md')  // 统一复制为 CLAUDE.md
          );
        }

        // Copy template directory
        if (fs.existsSync(path.join(packageRoot, '.claude', 'template'))) {
          copyDir(
            path.join(packageRoot, '.claude', 'template'),
            path.join(claudeDir, 'template'),
            []
          );
        }

        // Copy skills directory
        if (fs.existsSync(path.join(packageRoot, '.claude', 'skills'))) {
          copyDir(
            path.join(packageRoot, '.claude', 'skills'),
            path.join(claudeDir, 'skills'),
            []
          );
        }

        // Install skills to Claude Code
        try {
          const skillsPath = path.join(claudeDir, 'skills');
          if (fs.existsSync(skillsPath)) {
            const skillDirs = fs.readdirSync(skillsPath).filter(name => {
              const skillPath = path.join(skillsPath, name);
              return fs.statSync(skillPath).isDirectory();
            });

            for (const skillName of skillDirs) {
              const skillPath = path.join(skillsPath, skillName);
              execSync(`claude-code skill install "${skillPath}"`, { stdio: 'pipe' });
            }
          }
        } catch (err) {
          // Silently fail if Claude Code CLI not available
        }
      } else if (index === 1) {
        // Update README.md (根据目录语言选择对应版本)
        const readmeSrc = dirLang === 'zh'
          ? (fs.existsSync(path.join(packageRoot, 'docs/zh-CN/README.md')) ? 'docs/zh-CN/README.md' : 'README.md')
          : 'README.md';
        if (fs.existsSync(path.join(packageRoot, readmeSrc))) {
          fs.copyFileSync(path.join(packageRoot, readmeSrc), './README.md');
        }
      } else if (index === 2) {
        // Update QUICKSTART.md (根据目录语言选择对应版本)
        const quickstartSrc = dirLang === 'zh'
          ? (fs.existsSync(path.join(packageRoot, 'docs/zh-CN/QUICKSTART.md')) ? 'docs/zh-CN/QUICKSTART.md' : 'QUICKSTART.md')
          : 'QUICKSTART.md';
        if (fs.existsSync(path.join(packageRoot, quickstartSrc))) {
          fs.copyFileSync(path.join(packageRoot, quickstartSrc), './QUICKSTART.md');
        }
      } else if (index === 3) {
        // Update references/ - Only update guide file, preserve user content
        const guideFileName = '_GUIDE.md';
        const refPath = `./${referencesDir}`;

        // Ensure references directory exists
        if (!fs.existsSync(refPath)) {
          fs.mkdirSync(refPath, { recursive: true });

          // Create language-specific subdirectories if they don't exist
          if (dirLang === 'zh') {
            fs.mkdirSync(path.join(refPath, '视频'), { recursive: true });
            fs.mkdirSync(path.join(refPath, '账号'), { recursive: true });
            fs.mkdirSync(path.join(refPath, '调研'), { recursive: true });
          } else {
            fs.mkdirSync(path.join(refPath, 'videos'), { recursive: true });
            fs.mkdirSync(path.join(refPath, 'accounts'), { recursive: true });
            fs.mkdirSync(path.join(refPath, 'research'), { recursive: true });
          }
        }

        // Update only the guide file (根据目录语言选择对应版本)
        const refGuideSrc = dirLang === 'zh'
          ? (fs.existsSync(path.join(packageRoot, 'references', '_GUIDE_CN.md')) ? '_GUIDE_CN.md' : '_GUIDE.md')
          : '_GUIDE.md';
        if (fs.existsSync(path.join(packageRoot, 'references', refGuideSrc))) {
          fs.copyFileSync(
            path.join(packageRoot, 'references', refGuideSrc),
            path.join(refPath, '_GUIDE.md')  // 统一复制为 _GUIDE.md
          );
        }
      }

      await updateTaskStatus(i);
    }

    // Show success message
    console.log();
    showSuccess(lang === 'zh' ? '更新完成！' : 'Update complete!');
    console.log();
  } catch (error) {
    // Show error if update fails
    console.log();
    showError(`${lang === 'zh' ? '更新失败' : 'Update failed'}: ${error.message}`);
    console.log();
  }

  // Wait for user to acknowledge before returning
  const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Delete workflow - Complete removal
 * Note: Workspace and workflow existence checks are done in main menu
 */
async function deleteWorkflow(lang) {
  const indent = '  ';

  showInfo(lang === 'zh' ? '删除当前工作空间的工作流' : 'Delete Workflow in Current Workspace');
  console.log();

  const currentDir = process.cwd();
  console.log(`${indent}${lang === 'zh' ? '当前目录' : 'Current directory'}: ${currentDir}`);
  console.log();

  showWarning(lang === 'zh' ? '将删除以下工作流文件：' : 'This will delete the following workflow files:');
  console.log(lang === 'zh' ? '  - .claude/ 目录' : '  - .claude/ directory');
  console.log(lang === 'zh' ? '  - README.md, QUICKSTART.md' : '  - README.md, QUICKSTART.md');
  console.log();
  showWarning(lang === 'zh' ? '⚠️  不会删除 config.json、references/ 和 scripts/' : '⚠️  Will NOT delete config.json, references/ and scripts/');
  console.log();

  // Ask for confirmation (require typing YES)
  const confirmPrompt = lang === 'zh' ? '确认彻底删除？(输入 YES 继续)' : 'Confirm complete deletion? (Type YES to continue)';
  const confirm = await askInput(confirmPrompt, '', indent);
  if (confirm.trim() !== 'YES') {
    showInfo(lang === 'zh' ? '已取消' : 'Cancelled');
    console.log();
    return;
  }

  console.log();

  // Define tasks for progress display
  const deleteTasks = lang === 'zh'
    ? ['删除 Agent 配置', '删除说明文档']
    : ['Delete Agent config', 'Delete documentation'];

  // Track task completion states
  const taskStates = [false, false];

  // Function to render tasks
  const renderTasks = () => {
    if (taskStates.some(state => state)) {
      // Move cursor up to first task
      process.stdout.write(`\x1b[${deleteTasks.length}A`);
    }

    // Render all tasks
    deleteTasks.forEach((task, index) => {
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
    // Task 1: Delete .claude/
    if (fs.existsSync('./.claude')) {
      fs.rmSync('./.claude', { recursive: true, force: true });
    }
    await updateTaskStatus(0);

    // Task 2: Delete README.md, QUICKSTART.md
    if (fs.existsSync('./README.md')) {
      fs.rmSync('./README.md', { force: true });
    }
    if (fs.existsSync('./QUICKSTART.md')) {
      fs.rmSync('./QUICKSTART.md', { force: true });
    }
    await updateTaskStatus(1);

    // Show success message
    console.log();
    showSuccess(lang === 'zh' ? '工作流删除完成！' : 'Workflow deletion complete!');
    console.log();
  } catch (error) {
    // Show error if deletion fails
    console.log();
    showError(`${lang === 'zh' ? '删除失败' : 'Deletion failed'}: ${error.message}`);
    console.log();
  }

  // Wait for user to acknowledge before returning
  const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Import/Update workflow menu - Main entry point with sub-menu structure
 */
async function importWorkflow(lang) {
  const indent = '  ';

  // Check if current directory is a workspace first
  if (!isWorkspaceInitialized()) {
    showSubMenuTitle(
      lang === 'zh' ? '导入/更新工作流' : 'Import/Update Workflow',
      lang,
      indent
    );
    showWarning(lang === 'zh' ? '当前目录不是工作空间' : 'Current directory is not a workspace');
    console.log();
    showInfo(lang === 'zh' ? '请先使用菜单1 "完整初始化" 创建工作空间' : 'Please use menu 1 "Full Initialization" to create workspace first');
    console.log();

    // Wait for user to acknowledge
    const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  // Loop to allow staying in this menu
  while (true) {
    showSubMenuTitle(
      lang === 'zh' ? '导入/更新工作流' : 'Import/Update Workflow',
      lang,
      indent
    );

    // Check if workflow files exist
    const workflowExists = hasWorkflow();

    let options;
    if (!workflowExists) {
      // No workflow files - Show import menu
      options = lang === 'zh'
        ? [
            '导入工作流 - 导入到当前工作空间',
            '返回主菜单'
          ]
        : [
            'Import Workflow - Import to current workspace',
            'Back to Main Menu'
          ];
    } else {
      // Has workflow files - Show management menu
      options = lang === 'zh'
        ? [
            '更新工作流 - 多选要更新的内容',
            '删除工作流 - 彻底删除工作流文件',
            '返回主菜单'
          ]
        : [
            'Update Workflow - Multi-select items to update',
            'Delete Workflow - Complete deletion',
            'Back to Main Menu'
          ];
    }

    const selected = await selectMenu(options, { lang, type: 'sub' });

    console.log();

    if (!workflowExists) {
      // Import menu
      if (selected === 0) {
        await importNewWorkflow(lang);
        // After import, return to main menu to refresh state
        return;
      } else if (selected === 1) {
        // Back to main menu
        break;
      }
    } else {
      // Management menu
      if (selected === 0) {
        await updateWorkflow(lang);
        // Stay in this menu after update
      } else if (selected === 1) {
        await deleteWorkflow(lang);
        // After deletion, check if workflow still exists
        if (!hasWorkflow()) {
          // Workflow deleted, return to main menu to refresh state
          return;
        }
      } else if (selected === 2) {
        // Back to main menu
        break;
      }
    }
  }
}

module.exports = {
  importWorkflow,
};
