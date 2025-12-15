/**
 * Configuration Module
 * Handles workspace configuration management
 */

const fs = require('fs');
const path = require('path');

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
  askLanguage,
  askYesNo,
} = require('../ui/input');

const { selectMenu } = require('../ui/menu');
const { t } = require('../utils/i18n');
const { isWorkspaceInitialized } = require('../utils/config');

/**
 * Create new configuration
 */
async function createConfiguration(lang, indent) {
  showSubMenuTitle(lang === 'zh' ? '创建配置' : 'Create Configuration', lang, indent);

  showInfo(lang === 'zh' ? '开始配置工作环境' : 'Start workspace configuration');
  console.log();

  // System settings
  console.log(`${indent}${theme.primary}━━━ ${lang === 'zh' ? '系统设置' : 'System Settings'} ━━━${colors.reset}`);
  console.log();

  const aiLang = await askLanguage(lang === 'zh' ? 'AI 输出语言' : 'AI Output Language', lang);
  console.log();

  // Personal settings
  console.log(`${indent}${theme.primary}━━━ ${lang === 'zh' ? '个人参数' : 'Personal Parameters'} ━━━${colors.reset}`);
  console.log();

  const niche = await askInput(lang === 'zh' ? '细分领域 (例: 科技/美食/职场)' : 'Niche (e.g: Tech/Food/Career)', '', indent);
  const platform = await askInput(lang === 'zh' ? '目标平台 (例: YouTube/B站/抖音)' : 'Target Platform (e.g: YouTube/Bilibili/TikTok)', '', indent);
  const audience = await askInput(lang === 'zh' ? '目标受众 (例: 职场人士/学生)' : 'Target Audience (e.g: Professionals/Students)', '', indent);
  const defaultDuration = await askInput(lang === 'zh' ? '默认视频时长 (例: 5分钟/3-5分钟)' : 'Default Video Duration (e.g: 5min/3-5min)', '', indent);
  const accountName = await askInput(lang === 'zh' ? '账号名称 (例: @username)' : 'Account Name (e.g: @username)', '', indent);

  // Create config
  const config = {
    mode: 1, // Mode 1: 选题驱动
    niche,
    platform,
    audience,
    defaultDuration,
    accountName,
    dirLang: lang,
    aiLang,
    language: lang,
    membership: 'free',
    templates: {
      free: ['通用版.md'],
      premium: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Save config.json
  fs.writeFileSync(
    path.join(process.cwd(), 'config.json'),
    JSON.stringify(config, null, 2)
  );

  console.log();
  showSuccess(lang === 'zh' ? '配置创建成功！' : 'Configuration created successfully!');
  console.log();

  // Wait for user to acknowledge
  const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Modify system settings (AI output language)
 */
async function modifySystemSettings(lang, indent) {
  showSubMenuTitle(lang === 'zh' ? '系统设置' : 'System Settings', lang, indent);

  // Read config
  const configPath = path.join(process.cwd(), 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Show current settings
  showInfo(lang === 'zh' ? '当前系统设置：' : 'Current system settings:');
  console.log(`${indent}${theme.primary}AI 输出语言:${colors.reset} ${config.aiLang === 'zh' ? '简体中文' : 'English'}`);
  console.log();

  // Ask if modify
  const shouldModify = await askYesNo(lang === 'zh' ? '是否修改 AI 输出语言？' : 'Modify AI output language?', lang, false);
  if (!shouldModify) {
    console.log();
    showInfo(lang === 'zh' ? '未修改' : 'No changes made');
    console.log();

    const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  console.log();
  const newAiLang = await askLanguage(lang === 'zh' ? 'AI 输出语言' : 'AI Output Language', lang);

  // Update config
  config.aiLang = newAiLang;
  config.updatedAt = new Date().toISOString();

  // Save
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log();
  showSuccess(lang === 'zh' ? '系统设置已更新！' : 'System settings updated!');
  console.log();

  // Wait for user to acknowledge
  const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Modify personal parameters
 */
async function modifyPersonalParameters(lang, indent) {
  showSubMenuTitle(lang === 'zh' ? '个人参数' : 'Personal Parameters', lang, indent);

  // Read config
  const configPath = path.join(process.cwd(), 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Show current parameters
  showInfo(lang === 'zh' ? '当前个人参数：' : 'Current personal parameters:');
  console.log(`${indent}${theme.primary}细分领域:${colors.reset} ${config.niche || theme.muted + '未设置' + colors.reset}`);
  console.log(`${indent}${theme.primary}目标平台:${colors.reset} ${config.platform || theme.muted + '未设置' + colors.reset}`);
  console.log(`${indent}${theme.primary}目标受众:${colors.reset} ${config.audience || theme.muted + '未设置' + colors.reset}`);
  console.log(`${indent}${theme.primary}默认时长:${colors.reset} ${config.defaultDuration || theme.muted + '未设置' + colors.reset}`);
  console.log(`${indent}${theme.primary}账号名称:${colors.reset} ${config.accountName || theme.muted + '未设置' + colors.reset}`);
  console.log();

  showInfo(lang === 'zh' ? '输入新值修改，直接回车保持不变' : 'Enter new value to modify, press Enter to keep unchanged');
  console.log();

  // Ask for updates
  const niche = await askInput(lang === 'zh' ? '细分领域' : 'Niche', config.niche || '', indent);
  const platform = await askInput(lang === 'zh' ? '目标平台' : 'Platform', config.platform || '', indent);
  const audience = await askInput(lang === 'zh' ? '目标受众' : 'Audience', config.audience || '', indent);
  const defaultDuration = await askInput(lang === 'zh' ? '默认时长' : 'Duration', config.defaultDuration || '', indent);
  const accountName = await askInput(lang === 'zh' ? '账号名称' : 'Account', config.accountName || '', indent);

  // Update config
  config.niche = niche;
  config.platform = platform;
  config.audience = audience;
  config.defaultDuration = defaultDuration;
  config.accountName = accountName;
  config.updatedAt = new Date().toISOString();

  // Save
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log();
  showSuccess(lang === 'zh' ? '个人参数已更新！' : 'Personal parameters updated!');
  console.log();

  // Wait for user to acknowledge
  const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Delete configuration
 */
async function deleteConfiguration(lang, indent) {
  showSubMenuTitle(lang === 'zh' ? '删除配置' : 'Delete Configuration', lang, indent);

  showWarning(lang === 'zh' ? '将删除 config.json 配置文件' : 'This will delete config.json configuration file');
  console.log();
  showWarning(lang === 'zh' ? '工作空间标记(.workspace)和项目文件(scripts/)不会被删除' : 'Workspace marker (.workspace) and project files (scripts/) will NOT be deleted');
  console.log();

  // Ask for confirmation
  const confirmed = await askYesNo(lang === 'zh' ? '确认删除配置？' : 'Confirm delete configuration?', lang, false);
  if (!confirmed) {
    console.log();
    showInfo(lang === 'zh' ? '已取消' : 'Cancelled');
    console.log();

    const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  // Delete config.json
  const configPath = path.join(process.cwd(), 'config.json');
  try {
    fs.unlinkSync(configPath);
    console.log();
    showSuccess(lang === 'zh' ? '配置已删除！' : 'Configuration deleted!');
    console.log();
  } catch (error) {
    console.log();
    showError(`${lang === 'zh' ? '删除失败' : 'Deletion failed'}: ${error.message}`);
    console.log();
  }

  // Wait for user to acknowledge
  const continuePrompt = lang === 'zh' ? '按 Enter 返回上级菜单' : 'Press Enter to return to parent menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

/**
 * Configuration management menu - Main entry point
 */
async function configurationMenu(lang) {
  const indent = '  ';

  // Check if current directory is a workspace
  if (!isWorkspaceInitialized()) {
    showSubMenuTitle(lang === 'zh' ? '配置管理' : 'Configuration Management', lang, indent);
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

  // Check if config.json exists
  const configPath = path.join(process.cwd(), 'config.json');
  const hasConfig = fs.existsSync(configPath);

  // Loop to allow staying in this menu
  while (true) {
    showSubMenuTitle(
      lang === 'zh' ? '配置管理' : 'Configuration Management',
      lang,
      indent
    );

    let options;
    if (!hasConfig) {
      // No config.json - Show creation menu
      options = lang === 'zh'
        ? [
            '创建配置 - 配置系统设置和个人参数',
            '返回主菜单'
          ]
        : [
            'Create Configuration - Configure system and personal settings',
            'Back to Main Menu'
          ];
    } else {
      // Has config.json - Show management menu
      options = lang === 'zh'
        ? [
            '系统设置 - 修改 AI 输出语言',
            '个人参数 - 修改 niche/platform/audience 等',
            '删除配置 - 删除 config.json',
            '返回主菜单'
          ]
        : [
            'System Settings - Modify AI output language',
            'Personal Parameters - Modify niche/platform/audience etc.',
            'Delete Configuration - Delete config.json',
            'Back to Main Menu'
          ];
    }

    const selected = await selectMenu(options, { lang, type: 'sub' });

    console.log();

    if (!hasConfig) {
      // Creation menu
      if (selected === 0) {
        await createConfiguration(lang, indent);
        // After creation, config exists now
        if (fs.existsSync(configPath)) {
          // Update hasConfig flag but don't break - stay in this menu
          return; // Exit to main menu to refresh state
        }
      } else if (selected === 1) {
        // Back to main menu
        break;
      }
    } else {
      // Management menu
      if (selected === 0) {
        await modifySystemSettings(lang, indent);
      } else if (selected === 1) {
        await modifyPersonalParameters(lang, indent);
      } else if (selected === 2) {
        await deleteConfiguration(lang, indent);
        // After deletion, check if config still exists
        if (!fs.existsSync(configPath)) {
          // Config deleted, return to main menu to refresh state
          return;
        }
      } else if (selected === 3) {
        // Back to main menu
        break;
      }
    }
  }
}

module.exports = {
  configurationMenu,
};
