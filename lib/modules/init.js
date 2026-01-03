/**
 * Initialization Module
 * Handles full workspace initialization and modification mode
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import UI components
const {
  colors,
  theme,
  showSubMenuTitle,
  showProgress,
  showInfo,
  showStageHeader,
  showStageSeparator,
  showSuccess,
  showError,
  showWarning,
} = require('../ui/components');

// Import input components
const {
  askInput,
  askLanguage,
  askYesNo,
  askModifyField,
} = require('../ui/input');

// Import utilities
const { t } = require('../utils/i18n');
const {
  isWorkspaceInitialized,
  createWorkspaceMarker,
  ensureAsciiArtConfig,
} = require('../utils/config');
const {
  getPackageRoot,
  copyDir,
} = require('../utils/file');

/**
 * Show configuration summary after initialization or modification
 */
function showConfigSummary(config, lang, indent = '  ', isModifyMode = false, customPath = null) {
  const currentDir = customPath || process.cwd();
  const dirName = path.basename(currentDir);

  // Show success message first
  if (isModifyMode) {
    showSuccess(lang === 'zh' ? '配置已更新！' : 'Configuration updated!', indent);
  } else {
    showSuccess(lang === 'zh' ? '初始化完成！' : 'Initialization complete!', indent);
  }
  console.log();

  // Print basic info
  console.log(`${indent}${theme.primary}目录名称:${colors.reset} ${dirName}`);
  console.log(`${indent}${theme.primary}工作路径:${colors.reset} ${currentDir}`);
  console.log();

  // Show system settings
  const dirLangValue = config.dirLang === 'zh' ? '简体中文' : 'English';
  const aiLangValue = config.aiLang === 'zh' ? '简体中文' : 'English';
  console.log(`${indent}${theme.primary}目录语言:${colors.reset} ${dirLangValue}`);
  console.log(`${indent}${theme.primary}AI 输出语言:${colors.reset} ${aiLangValue}`);
  console.log();

  // Check personal settings status
  const personalFields = [
    { key: 'niche', label: lang === 'zh' ? '细分领域' : 'Niche', value: config.niche },
    { key: 'platform', label: lang === 'zh' ? '目标平台' : 'Platform', value: config.platform },
    { key: 'audience', label: lang === 'zh' ? '目标受众' : 'Audience', value: config.audience },
    { key: 'defaultDuration', label: lang === 'zh' ? '默认时长' : 'Duration', value: config.defaultDuration },
    { key: 'accountName', label: lang === 'zh' ? '账号名称' : 'Account', value: config.accountName }
  ];

  const filledCount = personalFields.filter(f => f.value && f.value.trim()).length;
  const totalCount = personalFields.length;

  if (filledCount === totalCount) {
    // All filled
    console.log(`${indent}${theme.primary}个人设置:${colors.reset} ${colors.green}已配置${colors.reset}`);
    personalFields.forEach(field => {
      console.log(`${indent}${theme.primary}${field.label}:${colors.reset} ${field.value}`);
    });
    console.log();
  } else if (filledCount > 0) {
    // Partially filled
    console.log(`${indent}${theme.primary}个人设置:${colors.reset} ${colors.yellow}部分缺失${colors.reset}`);
    personalFields.forEach(field => {
      if (field.value && field.value.trim()) {
        console.log(`${indent}${theme.primary}${field.label}:${colors.reset} ${field.value}`);
      } else {
        console.log(`${indent}${theme.primary}${field.label}:${colors.reset} ${theme.muted}未填写${colors.reset}`);
      }
    });
    console.log();
    showWarning(lang === 'zh' ? '部分个人设置缺失，建议前往主菜单 "5. 配置" 完善设置' : 'Some personal settings are missing, please go to Main Menu "5. Config" to complete', indent);
    console.log();
  } else {
    // All empty
    console.log(`${indent}${theme.primary}个人设置:${colors.reset} ${theme.error}未配置${colors.reset}`);
    console.log();
    showWarning(lang === 'zh' ? '个人设置未配置，请前往主菜单 "5. 配置" 完成设置' : 'Personal settings not configured, please go to Main Menu "5. Config" to complete', indent);
    console.log();
  }
}

/**
 * First configuration mode - create config.json in existing workspace
 * Used when .workspace exists but config.json doesn't
 */
async function firstConfigurationMode(lang, indent) {
  showSubMenuTitle(lang === 'zh' ? '工作空间配置' : 'Workspace Configuration', lang, indent);

  // Show notice
  const noticeText = lang === 'zh'
    ? '检测到工作空间标记，开始配置工作环境'
    : 'Workspace marker detected, starting workspace configuration';
  showInfo(noticeText);
  console.log();

  // ============================================
  // 1. 系统设置
  // ============================================
  showStageHeader(1, t('init.systemStep', lang), lang, indent);

  // Directory language - for reference only (workspace already exists)
  const dirLangLabel = lang === 'zh' ? '目录语言' : 'Directory Language';
  const dirLangNote = lang === 'zh' ? '(已存在工作空间目录)' : '(Workspace directory exists)';
  console.log(`${indent}${theme.muted}${dirLangLabel}:${colors.reset} ${colors.bright}${lang === 'zh' ? '简体中文' : 'English'}${colors.reset} ${theme.muted}${dirLangNote}${colors.reset}`);
  console.log();

  // AI output language
  const aiLang = await askLanguage(t('init.askAILang', lang), lang);

  showStageSeparator(indent);

  // ============================================
  // 2. 个人设置
  // ============================================
  showStageHeader(2, t('init.personalStep', lang), lang, indent);

  const niche = await askInput(t('init.askNiche', lang), '', indent);
  const platform = await askInput(t('init.askPlatform', lang), '', indent);
  const audience = await askInput(t('init.askAudience', lang), '', indent);
  const defaultDuration = await askInput(t('init.askDuration', lang), '', indent);
  const accountName = await askInput(t('init.askAccountName', lang), '', indent);

  showStageSeparator(indent);

  // Get directory and file name mappings
  const { getAllDirNames, getAllFileNames } = require('../utils/i18n');
  const dirNames = getAllDirNames(lang);
  const fileNames = getAllFileNames(lang);

  // Create config
  const config = {
    mode: 1, // Mode 1: 选题驱动
    niche,
    platform,
    audience,
    defaultDuration,
    accountName,
    dirLang: lang, // Use current CLI language as directory language
    aiLang,
    language: lang,
    dirNames,     // Directory name mappings
    fileNames,    // File name mappings
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Save config.json
  fs.writeFileSync(
    path.join(process.cwd(), 'config.json'),
    JSON.stringify(config, null, 2)
  );

  console.log();

  // Show configuration summary
  showConfigSummary(config, lang, indent, false);

  // Wait for user to acknowledge before returning to main menu
  console.log();
  const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Modification mode - update existing workspace configuration
 */
async function modificationMode(lang, indent) {
  showSubMenuTitle(lang === 'zh' ? '修改配置' : 'Modify Configuration', lang, indent);

  // Show notice
  const noticeText = lang === 'zh'
    ? '该目录已完成初始化，进入修改模式'
    : 'This directory is already initialized, entering modification mode';
  showInfo(noticeText);
  console.log();

  // Load existing config
  const configPath = path.join(process.cwd(), 'config.json');
  const existingConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // ============================================
  // 1. 工作空间设置
  // ============================================
  showStageHeader(1, t('init.workspaceStep', lang), lang, indent);

  // Get current directory name
  const currentDirName = path.basename(process.cwd());
  const dirName = await askModifyField(t('init.askDir', lang), currentDirName, lang, indent);
  console.log();

  // If directory name changed, need to rename
  let needRename = false;
  if (dirName !== currentDirName) {
    needRename = true;
    const renamePrompt = lang === 'zh'
      ? `工作空间名称已修改，需要重命名目录。是否继续？`
      : `Workspace name changed, directory needs to be renamed. Continue?`;
    const confirmRename = await askYesNo(renamePrompt, lang);
    if (!confirmRename) {
      showWarning(lang === 'zh' ? '已取消修改' : 'Modification cancelled', indent);
      console.log();
      return;
    }
  }

  showStageSeparator(indent);

  // ============================================
  // 2. 系统设置
  // ============================================
  showStageHeader(2, t('init.systemStep', lang), lang, indent);

  // Directory language - can modify (will rename directories)
  const dirLangLabel = lang === 'zh' ? '目录语言' : 'Directory Language';
  const currentDirLang = existingConfig.dirLang === 'zh' ? '简体中文' : 'English';
  console.log(`${indent}${theme.muted}当前${dirLangLabel}:${colors.reset} ${colors.bright}${currentDirLang}${colors.reset}`);
  const modifyDirLang = await askYesNo(lang === 'zh' ? `是否修改${dirLangLabel}? (会重命名 scripts/ 等目录)` : `Modify ${dirLangLabel}? (will rename scripts/ etc.)`, lang, false);
  let dirLang = existingConfig.dirLang;
  if (modifyDirLang) {
    dirLang = await askLanguage(t('init.askDirLang', lang), lang);
  }
  console.log();

  // AI output language - can modify
  const aiLangLabel = lang === 'zh' ? 'AI 输出语言' : 'AI Output Language';
  const currentAiLang = existingConfig.aiLang === 'zh' ? '简体中文' : 'English';
  console.log(`${indent}${theme.muted}当前${aiLangLabel}:${colors.reset} ${colors.bright}${currentAiLang}${colors.reset}`);
  const modifyAiLang = await askYesNo(lang === 'zh' ? `是否修改${aiLangLabel}?` : `Modify ${aiLangLabel}?`, lang, false);
  let aiLang = existingConfig.aiLang;
  if (modifyAiLang) {
    aiLang = await askLanguage(t('init.askAILang', lang), lang);
  }
  console.log();

  showStageSeparator(indent);

  // ============================================
  // 3. 个人设置
  // ============================================
  showStageHeader(3, t('init.personalStep', lang), lang, indent);

  // Ask for each personal setting field
  const niche = await askModifyField(t('init.askNiche', lang).replace(/ \(.+\)/, ''), existingConfig.niche || '', lang, indent);
  console.log();

  const platform = await askModifyField(t('init.askPlatform', lang).replace(/ \(.+\)/, ''), existingConfig.platform || '', lang, indent);
  console.log();

  const audience = await askModifyField(t('init.askAudience', lang).replace(/ \(.+\)/, ''), existingConfig.audience || '', lang, indent);
  console.log();

  const defaultDuration = await askModifyField(t('init.askDuration', lang).replace(/ \(.+\)/, ''), existingConfig.defaultDuration || '', lang, indent);
  console.log();

  const accountName = await askModifyField(t('init.askAccountName', lang).replace(/ \(.+\)/, ''), existingConfig.accountName || '', lang, indent);
  console.log();

  showStageSeparator(indent);

  // Get directory and file name mappings (regenerate if dirLang changed)
  const { getAllDirNames, getAllFileNames } = require('../utils/i18n');
  const dirNames = getAllDirNames(dirLang);
  const fileNames = getAllFileNames(dirLang);

  // Update config
  const updatedConfig = {
    ...existingConfig,
    dirLang,
    aiLang,
    niche,
    platform,
    audience,
    defaultDuration,
    accountName,
    dirNames,     // Update directory name mappings
    fileNames,    // Update file name mappings
    updatedAt: new Date().toISOString()
  };

  // Save updated config
  fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));

  // Rename workspace directory if needed
  if (needRename) {
    const parentDir = path.dirname(process.cwd());
    const newPath = path.join(parentDir, dirName);

    try {
      fs.renameSync(process.cwd(), newPath);
      console.log();
      showSuccess(lang === 'zh' ? `目录已重命名为: ${dirName}` : `Directory renamed to: ${dirName}`, indent);
    } catch (err) {
      console.log();
      showError(lang === 'zh' ? `目录重命名失败: ${err.message}` : `Failed to rename directory: ${err.message}`, indent);
    }
  }

  // Rename subdirectories if dirLang changed
  if (dirLang !== existingConfig.dirLang) {
    console.log();
    showInfo(lang === 'zh' ? '正在重命名子目录...' : 'Renaming subdirectories...', indent);
    console.log();

    const { getDirName } = require('../utils/i18n');
    const oldDirNames = require('../utils/i18n').getAllDirNames(existingConfig.dirLang);
    const newDirNames = require('../utils/i18n').getAllDirNames(dirLang);

    // Rename scripts/ directory if it exists
    const oldScriptsDir = path.join(process.cwd(), oldDirNames.scripts);
    const newScriptsDir = path.join(process.cwd(), newDirNames.scripts);
    if (fs.existsSync(oldScriptsDir) && oldScriptsDir !== newScriptsDir) {
      try {
        fs.renameSync(oldScriptsDir, newScriptsDir);
        showSuccess(lang === 'zh' ? `${oldDirNames.scripts}/ → ${newDirNames.scripts}/` : `${oldDirNames.scripts}/ → ${newDirNames.scripts}/`, indent);
      } catch (err) {
        showError(lang === 'zh' ? `重命名失败: ${err.message}` : `Rename failed: ${err.message}`, indent);
      }
    }

    // Rename references/ directory if it exists
    const oldReferencesDir = path.join(process.cwd(), oldDirNames.references);
    const newReferencesDir = path.join(process.cwd(), newDirNames.references);
    if (fs.existsSync(oldReferencesDir) && oldReferencesDir !== newReferencesDir) {
      try {
        fs.renameSync(oldReferencesDir, newReferencesDir);
        showSuccess(lang === 'zh' ? `${oldDirNames.references}/ → ${newDirNames.references}/` : `${oldDirNames.references}/ → ${newDirNames.references}/`, indent);
      } catch (err) {
        showError(lang === 'zh' ? `重命名失败: ${err.message}` : `Rename failed: ${err.message}`, indent);
      }
    }

    console.log();
  }

  console.log();

  // Show configuration summary
  showConfigSummary(updatedConfig, lang, indent, true);

  // Wait for user to acknowledge before returning to main menu
  console.log();
  const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Normal initialization mode - create new workspace
 */
async function initializationMode(lang, indent) {
  // Ensure global ASCII Art configuration exists
  ensureAsciiArtConfig();

  // Define steps (including "完成配置" for progress bar)
  const steps = lang === 'zh'
    ? ['工作空间设置', '系统设置', '个人设置', '初始化', '完成配置']
    : ['Workspace Setup', 'System Setup', 'Personal Setup', 'Initialize', 'Complete'];

  // Show title
  showSubMenuTitle(t('init.title', lang), lang, indent);

  // ============================================
  // Step 1: Workspace Setup - Ask for workspace name
  // ============================================
  showProgress(steps, 0, lang, indent);
  showStageHeader(1, t('init.workspaceStep', lang), lang, indent);

  const defaultDir = 'video-workflow';
  const dirName = await askInput(t('init.askDir', lang), defaultDir, indent);

  // Show confirmed workspace name
  console.log();
  console.log(`${indent}${theme.primary}工作空间名称:${colors.reset} ${dirName}`);
  console.log();

  const targetDir = path.join(process.cwd(), dirName);

  if (fs.existsSync(targetDir)) {
    showError(t('init.dirExists', lang), indent);
    console.log();

    // Wait for user to acknowledge before returning
    const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  // Stage 1 complete - show separator
  showStageSeparator(indent);

  // ============================================
  // Step 2: System Setup - Directory language & AI language
  // ============================================
  showProgress(steps, 1, lang, indent);
  showStageHeader(2, t('init.systemStep', lang), lang, indent);

  // Directory language selection (for folder/file names)
  const dirLang = await askLanguage(t('init.askDirLang', lang), lang);

  // AI output language selection
  const aiLang = await askLanguage(t('init.askAILang', lang), lang);

  // Stage 2 complete - show separator
  showStageSeparator(indent);

  // ============================================
  // Step 3: Personal Setup - Account settings
  // ============================================
  showProgress(steps, 2, lang, indent);
  showStageHeader(3, t('init.personalStep', lang), lang, indent);

  const niche = await askInput(t('init.askNiche', lang), '', indent);
  const platform = await askInput(t('init.askPlatform', lang), '', indent);
  const audience = await askInput(t('init.askAudience', lang), '', indent);
  const defaultDuration = await askInput(t('init.askDuration', lang), '', indent);
  const accountName = await askInput(t('init.askAccountName', lang), '', indent);

  // Stage 3 complete - show separator
  showStageSeparator(indent);

  // Get directory and file name mappings
  const { getAllDirNames, getAllFileNames } = require('../utils/i18n');
  const dirNames = getAllDirNames(dirLang);
  const fileNames = getAllFileNames(dirLang);

  const config = {
    mode: 1, // Mode 1: 选题驱动
    niche,
    platform,
    audience,
    defaultDuration,
    accountName,
    dirLang,      // Directory/file language
    aiLang,       // AI output language
    language: lang, // CLI interface language (from global config)
    membership: 'free',
    templates: {
      free: ['通用版.md'],
      premium: []
    },
    dirNames,     // Directory name mappings
    fileNames,    // File name mappings
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // ============================================
  // Step 4: Initialize - Create directory & install templates
  // ============================================
  showProgress(steps, 3, lang, indent);
  showStageHeader(4, t('init.initStep', lang), lang, indent);

  // Define initialization tasks
  const initTasks = lang === 'zh'
    ? ['创建目录结构', '安装免费模板', '配置 Claude Code 工作流', '保存配置文件', '校验初始化', '完成初始化']
    : ['Create directory structure', 'Install free templates', 'Configure Claude Code workflow', 'Save config file', 'Verify initialization', 'Complete initialization'];

  // Show all tasks in gray first
  const taskStates = initTasks.map(() => false); // Track completion state

  const renderTasks = () => {
    // Move cursor to start of task list
    if (taskStates.some(s => s)) {
      process.stdout.write(`\x1b[${initTasks.length}A`); // Move up to first task
    }

    // Render all tasks
    initTasks.forEach((task, index) => {
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
    // Task 1: Create directory structure
    const packageRoot = getPackageRoot();

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Only copy necessary directories and files for user workspace
    const { getDirName } = require('../utils/i18n');

    // .claude/ - Agent configuration and templates
    const claudeDir = path.join(targetDir, '.claude');
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

    // references/ - Reference materials (create empty with subdirectories) - use localized name
    const referencesDir = getDirName('references', dirLang);
    const referencesPath = path.join(targetDir, referencesDir);
    fs.mkdirSync(referencesPath, { recursive: true });

    // Create language-specific subdirectories based on dirLang
    if (dirLang === 'zh') {
      // Chinese subdirectories
      fs.mkdirSync(path.join(referencesPath, '视频'), { recursive: true });
      fs.mkdirSync(path.join(referencesPath, '账号'), { recursive: true });
      fs.mkdirSync(path.join(referencesPath, '调研'), { recursive: true });
    } else {
      // English subdirectories
      fs.mkdirSync(path.join(referencesPath, 'videos'), { recursive: true });
      fs.mkdirSync(path.join(referencesPath, 'accounts'), { recursive: true });
      fs.mkdirSync(path.join(referencesPath, 'research'), { recursive: true });
    }

    // Copy reference guide file to workspace (根据目录语言选择对应版本)
    const refGuideSrc = dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'references', '_GUIDE_CN.md')) ? '_GUIDE_CN.md' : '_GUIDE.md')
      : '_GUIDE.md';
    if (fs.existsSync(path.join(packageRoot, 'references', refGuideSrc))) {
      fs.copyFileSync(
        path.join(packageRoot, 'references', refGuideSrc),
        path.join(referencesPath, '_GUIDE.md')  // 统一复制为 _GUIDE.md
      );
    }

    // scripts/ - User projects directory (create empty) - use localized name
    const scriptsDir = getDirName('scripts', dirLang);
    const scriptsPath = path.join(targetDir, scriptsDir);
    fs.mkdirSync(scriptsPath, { recursive: true });

    // Create scripts/_meta.json (项目索引文件)
    // Format follows the specification in v1.0/.claude/skills/project-manager/references/meta-format.md
    const scriptsMeta = {
      version: '1.0',
      last_updated: new Date().toISOString(),
      total_projects: 0,
      projects: [] // Array of project entries: { project_id, name, status, stage, updated_at }
    };
    fs.writeFileSync(
      path.join(scriptsPath, '_meta.json'),
      JSON.stringify(scriptsMeta, null, 2)
    );

    // Copy scripts guide file to workspace (根据目录语言选择对应版本)
    const scriptsGuideSrc = dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'scripts', '_GUIDE_CN.md')) ? '_GUIDE_CN.md' : '_GUIDE.md')
      : '_GUIDE.md';
    if (fs.existsSync(path.join(packageRoot, 'scripts', scriptsGuideSrc))) {
      fs.copyFileSync(
        path.join(packageRoot, 'scripts', scriptsGuideSrc),
        path.join(scriptsPath, '_GUIDE.md')  // 统一复制为 _GUIDE.md
      );
    }

    // Copy documentation files (根据目录语言选择对应版本)
    const readmeSrc = config.dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'docs/zh-CN/README.md')) ? 'docs/zh-CN/README.md' : 'README.md')
      : 'README.md';
    const quickstartSrc = config.dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'docs/zh-CN/QUICKSTART.md')) ? 'docs/zh-CN/QUICKSTART.md' : 'QUICKSTART.md')
      : 'QUICKSTART.md';

    // 中文工作空间使用中文文件名
    const readmeDest = config.dirLang === 'zh' ? '说明.md' : 'README.md';
    const quickstartDest = config.dirLang === 'zh' ? '快速开始.md' : 'QUICKSTART.md';

    if (fs.existsSync(path.join(packageRoot, readmeSrc))) {
      fs.copyFileSync(path.join(packageRoot, readmeSrc), path.join(targetDir, readmeDest));
    }
    if (fs.existsSync(path.join(packageRoot, quickstartSrc))) {
      fs.copyFileSync(path.join(packageRoot, quickstartSrc), path.join(targetDir, quickstartDest));
    }

    // Copy LICENSE file (根据目录语言选择对应版本)
    const licenseSrc = config.dirLang === 'zh'
      ? (fs.existsSync(path.join(packageRoot, 'docs/zh-CN/LICENSE')) ? 'docs/zh-CN/LICENSE' : 'LICENSE')
      : 'LICENSE';
    if (fs.existsSync(path.join(packageRoot, licenseSrc))) {
      fs.copyFileSync(path.join(packageRoot, licenseSrc), path.join(targetDir, 'LICENSE'));
    }

    // Verify directory was created
    if (!fs.existsSync(targetDir)) {
      throw new Error(lang === 'zh' ? '创建目录失败' : 'Failed to create directory');
    }

    // Create .workspace marker file
    createWorkspaceMarker(targetDir);

    await updateTaskStatus(0);

    // Task 2: Install free templates
    // (Free templates are already controlled by package.json, no need to delete here)
    await updateTaskStatus(1);

    // Task 3: Configure Claude Code workflow
    // (Already copied via copyDir, just mark as done)
    await updateTaskStatus(2);

    // Task 4: Save config.json
    // Check personal settings status
    const personalSettingsArray = [niche, platform, audience, defaultDuration, accountName];
    const filledCount = personalSettingsArray.filter(v => v && v.trim()).length;
    const totalCount = personalSettingsArray.length;

    let settingsStatus = 'empty'; // empty | partial | complete
    if (filledCount === totalCount) {
      settingsStatus = 'complete';
    } else if (filledCount > 0) {
      settingsStatus = 'partial';
    }

    let savedConfig;
    if (settingsStatus === 'complete') {
      // All personal settings filled - save full config
      savedConfig = config;
      fs.writeFileSync(
        path.join(targetDir, 'config.json'),
        JSON.stringify(config, null, 2)
      );
    } else {
      // Personal settings incomplete or empty - save partial config
      const partialConfig = {
        mode: 1, // Mode 1: 选题驱动
        dirLang,
        aiLang,
        language: lang,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add filled personal settings to config
      if (niche && niche.trim()) partialConfig.niche = niche;
      if (platform && platform.trim()) partialConfig.platform = platform;
      if (audience && audience.trim()) partialConfig.audience = audience;
      if (defaultDuration && defaultDuration.trim()) partialConfig.defaultDuration = defaultDuration;
      if (accountName && accountName.trim()) partialConfig.accountName = accountName;

      savedConfig = partialConfig;
      fs.writeFileSync(
        path.join(targetDir, 'config.json'),
        JSON.stringify(partialConfig, null, 2)
      );
    }

    await updateTaskStatus(3);

    // Task 5: Verify initialization
    if (!fs.existsSync(path.join(targetDir, 'config.json'))) {
      throw new Error(lang === 'zh' ? '创建配置文件失败' : 'Failed to create config file');
    }
    await updateTaskStatus(4);

    // Task 6: Complete initialization
    await updateTaskStatus(5);

    console.log();

    // Show configuration summary
    showConfigSummary(savedConfig, lang, indent, false, targetDir);

    // Wait for user to acknowledge before returning to main menu
    console.log();
    const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
    await askInput(continuePrompt, '', indent);
    console.log();
  } catch (error) {
    // Show error if initialization fails
    console.log();
    showError(lang === 'zh' ? `初始化失败: ${error.message}` : `Initialization failed: ${error.message}`, indent);
    console.log();

    // Clean up partial installation if exists
    if (fs.existsSync(targetDir)) {
      try {
        fs.rmSync(targetDir, { recursive: true, force: true });
        showInfo(lang === 'zh' ? '已清理未完成的安装' : 'Cleaned up incomplete installation', indent);
        console.log();
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }

    // Wait for user to acknowledge before returning
    const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
    await askInput(continuePrompt, '', indent);
    console.log();
  }
}

/**
 * Full initialization - Main entry point with sub-menu structure
 */
async function fullInitialization(lang) {
  const indent = '  ';

  // Check if current directory is a workspace
  const isWorkspace = isWorkspaceInitialized();

  // Loop to allow staying in this menu
  while (true) {
    showSubMenuTitle(
      lang === 'zh' ? '完整初始化' : 'Full Initialization',
      lang,
      indent
    );

    let options;
    if (!isWorkspace) {
      // Not a workspace - Show creation menu
      options = lang === 'zh'
        ? [
            '创建工作空间 - 完整初始化流程',
            '返回主菜单'
          ]
        : [
            'Create Workspace - Full initialization process',
            'Back to Main Menu'
          ];
    } else {
      // Is a workspace - Show modification menu
      options = lang === 'zh'
        ? [
            '修改配置 - 修改现有工作空间配置',
            '返回主菜单'
          ]
        : [
            'Modify Configuration - Modify existing workspace',
            'Back to Main Menu'
          ];
    }

    const { selectMenu } = require('../ui/menu');
    const selected = await selectMenu(options, { lang, type: 'sub' });

    console.log();

    if (!isWorkspace) {
      // Creation menu
      if (selected === 0) {
        await initializationMode(lang, indent);
        // After creation, workspace exists now, return to main menu to refresh state
        return;
      } else if (selected === 1) {
        // Back to main menu
        break;
      }
    } else {
      // Modification menu
      if (selected === 0) {
        // Check if config.json exists
        const hasConfig = fs.existsSync(path.join(process.cwd(), 'config.json'));

        if (hasConfig) {
          // Has config → Modification mode
          await modificationMode(lang, indent);
        } else {
          // No config → First configuration mode
          await firstConfigurationMode(lang, indent);
        }
        // After modification, stay in this menu or return to refresh
        // (internal functions handle return logic)
      } else if (selected === 1) {
        // Back to main menu
        break;
      }
    }
  }
}

module.exports = {
  fullInitialization,
};
