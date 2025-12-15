/**
 * Internationalization (i18n) Module
 * Handles all language translations and text localization
 */

// Translation data
const i18n = {
  zh: {
    langSelect: {
      title: '🌐 语言选择 / Language Selection',
      option1: '1. 中文',
      option2: '2. English',
      prompt: '请选择'
    },
    firstRun: {
      welcome: '👋 欢迎使用视频工作流！',
      guide: '首次运行引导',
      askInit: '是否立即初始化工作环境？',
      option1: '1. 是 - 立即初始化',
      option2: '2. 跳过 - 稍后手动配置',
      saved: '✓ 设置已保存'
    },
    mainMenu: {
      title: '视频工作流 CLI 工具',
      section1: '视频工作流',
      init: '1. 完整初始化 - 配置工作环境并安装模板',
      import: '2. 导入/更新 - 更新 .claude/ 配置（保留项目）',
      project: '3. 新增项目 - 在 scripts/ 创建新项目',
      upgrade: '4. 升级会员 - 解锁 15+ 付费模板 (Coming Soon)',
      config: '5. 配置 - 编辑工作环境参数',
      section2: '其他',
      lang: 'L. 切换语言 - 界面语言切换',
      update: 'U. 检查更新 - 检查最新版本',
      uninstall: 'X. 卸载 - 删除工作环境配置',
      exit: 'Q. 退出',
      prompt: '请选择'
    },
    init: {
      title: '完整初始化',
      askDir: '工作空间名称',
      askDirLang: '目录语言',
      askAILang: 'AI 输出语言',
      askNiche: '细分领域 (例: 科技/美食/职场)',
      askPlatform: '目标平台 (例: YouTube/B站/抖音/小红书)',
      askAudience: '目标受众 (例: 职场人士/学生)',
      askDuration: '默认视频时长 (例: 5分钟/3-5分钟/30秒)',
      askAccountName: '账号名称 (例: @username 或账号链接)',
      workspaceStep: '工作空间设置',
      systemStep: '系统设置',
      personalStep: '个人设置',
      initStep: '初始化',
      dirStep: '创建目录结构',
      templateStep: '安装免费模板',
      success: '初始化完成！',
      next: '下一步：',
      step1: '1. cd {dir}',
      step2: '2. 使用 Claude Code 打开此目录',
      step3: '3. 开始创作！',
      dirExists: '目录已存在',
      upgradeHint: '运行 "4. 升级会员" 解锁 15+ 付费模板'
    },
    import: {
      title: '导入/更新工作流',
      warning: '此操作会更新以下文件：',
      file1: '  - .claude/ (Agent 配置)',
      file2: '  - .claude/template/ (模板库)',
      file3: '  - README.md, QUICKSTART.md',
      safe: '✓ 不会影响 scripts/ 中的现有项目',
      confirm: '确认继续? [y/N]',
      cancelled: '已取消',
      askDir: '工作目录路径',
      notFound: '未找到工作目录',
      updating: '正在更新...',
      success: '更新完成！'
    },
    project: {
      title: '新增脚本项目',
      askName: '项目名称 (支持中文)',
      askDesc: '项目描述 (可选)',
      nameRequired: '项目名称不能为空',
      notInitialized: '工作空间未初始化',
      initFirst: '请先运行 "1. 完整初始化" 来设置工作环境',
      notInWorkspace: '请在 video-workflow 工作目录中运行此命令',
      creating: '正在创建项目结构...',
      created: '项目创建成功！',
      createFailed: '项目创建失败',
      cleanedUp: '已清理未完成的项目',
      path: '项目路径',
      exists: '项目已存在'
    },
    config: {
      title: '配置',
      notFound: '未找到 config.json，请先初始化',
      current: '当前配置：',
      niche: '细分领域',
      platform: '目标平台',
      audience: '目标受众',
      duration: '默认时长',
      edit: '编辑配置（直接回车保持不变）：',
      updated: '✓ 配置已更新'
    },
    upgrade: {
      title: '升级会员',
      benefits: '会员权益：',
      benefit1: '  ✓ 15+ 专业脚本模板',
      benefit2: '    - 教学、评测、科普解读、故事、评论',
      benefit3: '    - 纪录片、合集、销售、灵活版',
      benefit4: '    - shorts 系列（5个）',
      comingSoon: '功能开发中...',
      willSupport: '即将支持：',
      method1: '  1. 在线授权登录',
      method2: '  2. 输入激活码'
    },
    uninstall: {
      title: '卸载清理',
      warning: '⚠️  警告：此操作将删除以下内容：',
      item1: '  - .claude/ (Agent 配置)',
      item2: '  - .claude/template/ (所有模板)',
      item3: '  - config.json',
      item4: '  - README.md, QUICKSTART.md',
      safe: '✓ scripts/ 中的项目不会被删除',
      confirm: '确认删除? 输入 YES 继续',
      cancelled: '已取消',
      askDir: '工作目录路径',
      notFound: '未找到工作目录',
      success: '清理完成！'
    },
    checkUpdate: {
      title: '检查更新',
      checking: '正在检查更新...',
      comingSoon: '功能开发中...'
    }
  },
  en: {
    langSelect: {
      title: '🌐 Language Selection / 语言选择',
      option1: '1. English',
      option2: '2. 中文',
      prompt: 'Please select'
    },
    firstRun: {
      welcome: '👋 Welcome to Video Workflow!',
      guide: 'First Run Guide',
      askInit: 'Initialize workspace now?',
      option1: '1. Yes - Initialize now',
      option2: '2. Skip - Configure later',
      saved: '✓ Settings saved'
    },
    mainMenu: {
      title: 'Video Workflow CLI Tool',
      section1: 'Video Workflow',
      init: '1. Full Init - Configure workspace and install templates',
      import: '2. Import/Update - Update .claude/ config (keep projects)',
      project: '3. New Project - Create new project in scripts/',
      upgrade: '4. Upgrade - Unlock 15+ premium templates (Coming Soon)',
      config: '5. Config - Edit workspace parameters',
      section2: 'Other',
      lang: 'L. Language - Switch interface language',
      update: 'U. Update - Check latest version',
      uninstall: 'X. Uninstall - Remove workspace config',
      exit: 'Q. Exit',
      prompt: 'Select'
    },
    init: {
      title: 'Full Initialization',
      askDir: 'Workspace name',
      askDirLang: 'Directory language',
      askAILang: 'AI output language',
      askNiche: 'Niche (e.g: Tech/Food/Career)',
      askPlatform: 'Target Platform (e.g: YouTube/Bilibili/TikTok/RedNote)',
      askAudience: 'Target Audience (e.g: Professionals/Students)',
      askDuration: 'Default Video Duration (e.g: 5min/3-5min/30sec)',
      askAccountName: 'Account name (e.g: @username or account URL)',
      workspaceStep: 'Workspace Setup',
      systemStep: 'System Setup',
      personalStep: 'Personal Setup',
      initStep: 'Initialize',
      dirStep: 'Creating directory structure',
      templateStep: 'Installing free templates',
      success: 'Initialization complete!',
      next: 'Next steps:',
      step1: '1. cd {dir}',
      step2: '2. Open this directory in Claude Code',
      step3: '3. Start creating!',
      dirExists: 'Directory already exists',
      upgradeHint: 'Run "4. Upgrade Membership" to unlock 15+ premium templates'
    },
    import: {
      title: 'Import/Update Workflow',
      warning: 'This will update the following files:',
      file1: '  - .claude/ (Agent config)',
      file2: '  - .claude/template/ (Templates)',
      file3: '  - README.md, QUICKSTART.md',
      safe: '✓ Will not affect existing projects in scripts/',
      confirm: 'Confirm? [y/N]',
      cancelled: 'Cancelled',
      askDir: 'Workspace directory path',
      notFound: 'Workspace directory not found',
      updating: 'Updating...',
      success: 'Update complete!'
    },
    project: {
      title: 'Create New Project',
      askName: 'Project name (supports Chinese)',
      askDesc: 'Project description (optional)',
      nameRequired: 'Project name is required',
      notInitialized: 'Workspace not initialized',
      initFirst: 'Please run "1. Full Init" to set up workspace first',
      notInWorkspace: 'Please run this command in a video-workflow workspace',
      creating: 'Creating project structure...',
      created: 'Project created!',
      createFailed: 'Project creation failed',
      cleanedUp: 'Cleaned up incomplete project',
      path: 'Project path',
      exists: 'Project already exists'
    },
    config: {
      title: 'Configuration',
      notFound: 'config.json not found, please initialize first',
      current: 'Current configuration:',
      niche: 'Niche',
      platform: 'Platform',
      audience: 'Audience',
      duration: 'Duration',
      edit: 'Edit configuration (press Enter to keep):',
      updated: '✓ Configuration updated'
    },
    upgrade: {
      title: 'Upgrade Membership',
      benefits: 'Membership Benefits:',
      benefit1: '  ✓ 15+ Professional Script Templates',
      benefit2: '    - Tutorial, Review, Science, Story, Commentary',
      benefit3: '    - Documentary, Collection, Sales, Flexible',
      benefit4: '    - Shorts series (5 templates)',
      comingSoon: 'Coming soon...',
      willSupport: 'Will support:',
      method1: '  1. Online authorization',
      method2: '  2. Activation code'
    },
    uninstall: {
      title: 'Uninstall',
      warning: '⚠️  Warning: This will delete:',
      item1: '  - .claude/ (Agent config)',
      item2: '  - .claude/template/ (All templates)',
      item3: '  - config.json',
      item4: '  - README.md, QUICKSTART.md',
      safe: '✓ Projects in scripts/ will not be deleted',
      confirm: 'Confirm? Type YES to continue',
      cancelled: 'Cancelled',
      askDir: 'Workspace directory path',
      notFound: 'Workspace directory not found',
      success: 'Cleanup complete!'
    },
    checkUpdate: {
      title: 'Check Update',
      checking: 'Checking for updates...',
      comingSoon: 'Coming soon...'
    }
  },
};

/**
 * Stage name translations
 */
const STAGE_NAMES = {
  zh: {
    'Idea Communication': '选题沟通',
    'Framework Building': '框架搭建',
    'Content Research': '内容调研',
    'Outline Confirmation': '大纲确认',
    'Script Writing': '脚本撰写',
    'Optimization': '优化编辑',
    'Final Output': '最终输出',
  },
  en: {
    'Idea Communication': 'Idea Communication',
    'Framework Building': 'Framework Building',
    'Content Research': 'Content Research',
    'Outline Confirmation': 'Outline Confirmation',
    'Script Writing': 'Script Writing',
    'Optimization': 'Optimization',
    'Final Output': 'Final Output',
  }
};

/**
 * Get stage name by key and language
 * @param {string} stageName - Stage name in English
 * @param {string} lang - Language code ('zh' or 'en')
 * @returns {string} Localized stage name
 */
function getStageName(stageName, lang = 'zh') {
  return STAGE_NAMES[lang]?.[stageName] || stageName;
}

/**
 * Directory name mappings for different languages
 * Used for workspace directory structure localization
 */
const DIR_NAMES = {
  zh: {
    scripts: '脚本',
    references: '参考资料',
    stages: '阶段输出',
    contexts: '补充资料',
    research: '调研',
    videos: '视频',
    channels: '账号',
    outputs: '输出',
    drafts: '草稿',
    archives: '历史版本',
  },
  en: {
    scripts: 'scripts',
    references: 'references',
    stages: 'stages',
    contexts: 'contexts',
    research: 'research',
    videos: 'videos',
    channels: 'channels',
    outputs: 'outputs',
    drafts: 'drafts',
    archives: 'archives',
  }
};

/**
 * File name mappings for different languages
 * Used for stage output files localization
 */
const FILE_NAMES = {
  zh: {
    idea: '选题沟通.md',
    frame: '框架搭建.md',
    research: '内容调研.md',
    outline: '大纲确认.md',
    draft: '脚本草稿.md',
    script: '最终脚本.md',
  },
  en: {
    idea: 'idea.md',
    frame: 'frame.md',
    research: 'research.md',
    outline: 'outline.md',
    draft: 'draft.md',
    script: 'script.md',
  }
};

/**
 * Get directory name by key and language
 * @param {string} key - Directory key (e.g., 'scripts', 'references')
 * @param {string} lang - Language code ('zh' or 'en')
 * @returns {string} Localized directory name
 */
function getDirName(key, lang = 'zh') {
  return DIR_NAMES[lang]?.[key] || key;
}

/**
 * Get all directory names for a language
 * @param {string} lang - Language code ('zh' or 'en')
 * @returns {Object} Object with all directory name mappings
 */
function getAllDirNames(lang = 'zh') {
  return DIR_NAMES[lang] || DIR_NAMES.en;
}

/**
 * Find directory key by name (reverse lookup)
 * @param {string} dirName - Directory name to find
 * @returns {string|null} Directory key or null if not found
 */
function findDirKey(dirName) {
  for (const lang of Object.keys(DIR_NAMES)) {
    const names = DIR_NAMES[lang];
    for (const [key, name] of Object.entries(names)) {
      if (name === dirName) {
        return key;
      }
    }
  }
  return null;
}

/**
 * Get translation by key path
 * @param {string} key - Dot-separated key path (e.g., 'mainMenu.title')
 * @param {string} lang - Language code ('zh' or 'en')
 * @returns {string} Translated text or key if not found
 */
function t(key, lang = 'zh') {
  const keys = key.split('.');
  let value = i18n[lang];
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return key;
  }
  return value;
}

/**
 * Get language-specific file path
 * @param {string} basePath - Base file path (e.g., 'docs', '.claude', 'references', 'scripts')
 * @param {string} fileName - File name (e.g., 'README.md', 'CLAUDE.md', '_GUIDE.md')
 * @param {string} dirLang - Directory language ('zh' or 'en')
 * @param {Object} packageRoot - Package root path from getPackageRoot()
 * @returns {string} Selected file path based on language
 */
function getLanguageFilePath(basePath, fileName, dirLang, packageRoot) {
  const fs = require('fs');
  const path = require('path');

  // File name mappings for different locations
  const fileMapping = {
    'README.md': {
      zh: 'docs/zh-CN/README.md',
      en: 'README.md'
    },
    'QUICKSTART.md': {
      zh: 'docs/zh-CN/QUICKSTART.md',
      en: 'QUICKSTART.md'
    },
    'LICENSE': {
      zh: 'docs/zh-CN/LICENSE',
      en: 'LICENSE'
    },
    'CLAUDE.md': {
      zh: '.claude/CLAUDE_CN.md',
      en: '.claude/CLAUDE.md'
    },
    '_GUIDE.md': {
      zh: `${basePath}/_GUIDE_CN.md`,
      en: `${basePath}/_GUIDE.md`
    }
  };

  // Get the file path for the specified language
  const langPath = fileMapping[fileName]?.[dirLang];
  if (!langPath) {
    // If not in mapping, use base path + file name
    return `${basePath}/${fileName}`;
  }

  // For _GUIDE.md, we already included basePath in the mapping
  if (fileName === '_GUIDE.md') {
    const fullPath = path.join(packageRoot, langPath);
    // Fallback to English version if Chinese version doesn't exist
    if (fs.existsSync(fullPath)) {
      return langPath;
    }
    return `${basePath}/_GUIDE.md`;
  }

  // Check if the file exists, fallback to English if not
  const fullPath = path.join(packageRoot, langPath);
  if (fs.existsSync(fullPath)) {
    return langPath;
  }

  // Fallback to English version
  return fileMapping[fileName].en;
}

/**
 * Get file name by key and language
 * @param {string} key - File key (e.g., 'idea', 'frame')
 * @param {string} lang - Language code ('zh' or 'en')
 * @returns {string} Localized file name
 */
function getFileName(key, lang = 'zh') {
  return FILE_NAMES[lang]?.[key] || `${key}.md`;
}

/**
 * Get all file names for a language
 * @param {string} lang - Language code ('zh' or 'en')
 * @returns {Object} Object with all file name mappings
 */
function getAllFileNames(lang = 'zh') {
  return FILE_NAMES[lang] || FILE_NAMES.en;
}

module.exports = {
  i18n,
  t,
  STAGE_NAMES,
  getStageName,
  DIR_NAMES,
  getDirName,
  getAllDirNames,
  findDirKey,
  FILE_NAMES,
  getFileName,
  getAllFileNames,
  getLanguageFilePath,
};
