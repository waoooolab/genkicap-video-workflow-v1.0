/**
 * Project Management Module
 * Handles project creation and management
 */

const fs = require('fs');
const path = require('path');

const {
  showSubMenuTitle,
  showInfo,
  showSuccess,
  showError,
  colors,
  theme,
} = require('../ui/components');

const { askInput } = require('../ui/input');
const { t, getDirName, getStageName } = require('../utils/i18n');
const { findScriptsDir, isWorkspaceInitialized, getWorkspaceConfig } = require('../utils/config');

/**
 * Generate a safe English ID from project name
 * Converts Chinese characters to pinyin-like representation or removes them
 * @param {string} name - Project name (can be Chinese or English)
 * @returns {string} Safe English ID (lowercase, alphanumeric with hyphens)
 */
function generateProjectId(name) {
  // Remove special characters and convert to lowercase
  let id = name.toLowerCase()
    .replace(/[^\w\s-]/g, '')      // Keep only alphanumeric, spaces, underscores, and hyphens
    .replace(/[\s_]+/g, '-')       // Replace spaces and underscores with hyphens
    .replace(/[^\x00-\x7F]/g, '')  // Remove non-ASCII characters (including Chinese)
    .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens

  // If result is empty (all Chinese characters), generate a timestamp-based ID
  if (!id || id.length === 0) {
    const timestamp = Date.now().toString().slice(-8);
    id = `project-${timestamp}`;
  }

  return id;
}

/**
 * Create new project
 */
async function createProject(lang) {
  const indent = '  ';

  showSubMenuTitle(t('project.title', lang), lang, indent);

  // Find scripts directory first (searches up the directory tree)
  const scriptsDir = findScriptsDir();
  if (!scriptsDir) {
    showError(t('project.notInWorkspace', lang));
    console.log();
    showInfo(t('project.initFirst', lang));
    console.log();

    // Wait for user to acknowledge before returning
    const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  // Ask for project name (supports Chinese)
  const projectName = await askInput(t('project.askName', lang), '', indent);
  if (!projectName.trim()) {
    showError(t('project.nameRequired', lang));
    console.log();

    // Wait for user to acknowledge before returning
    const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  // Ask for description
  const description = await askInput(t('project.askDesc', lang), '', indent);

  // Generate date prefix (YYYYMMDD)
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');

  // Generate full name with date first (supports Chinese project names)
  const fullName = `${date}-${projectName.trim()}`;

  // Generate English ID for system use
  const projectId = generateProjectId(projectName.trim());

  // Create project directory (scriptsDir already found at the beginning)
  const projectDir = path.join(scriptsDir, fullName);

  if (fs.existsSync(projectDir)) {
    showError(`${t('project.exists', lang)}: ${fullName}`);
    console.log();

    // Wait for user to acknowledge before returning
    const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
    await askInput(continuePrompt, '', indent);
    console.log();
    return;
  }

  console.log();

  // Define tasks for progress display
  const projectTasks = lang === 'zh'
    ? ['创建目录结构', '生成项目元数据', '更新项目索引', '创建上下文文件']
    : ['Create directory structure', 'Generate project metadata', 'Update project index', 'Create context file'];

  // Track task completion states
  const taskStates = [false, false, false, false];

  // Function to render tasks
  const renderTasks = () => {
    if (taskStates.some(state => state)) {
      // Move cursor up to first task
      process.stdout.write(`\x1b[${projectTasks.length}A`);
    }

    // Render all tasks
    projectTasks.forEach((task, index) => {
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
    // Get workspace config to determine directory language
    const config = getWorkspaceConfig();
    const dirLang = config?.dirLang || 'en';

    // Get directory and file name mappings from config (with fallback to i18n)
    const dirNames = config?.dirNames || require('../utils/i18n').getAllDirNames(dirLang);
    const fileNames = config?.fileNames || require('../utils/i18n').getAllFileNames(dirLang);

    // Task 1: Create directory structure with localized names
    fs.mkdirSync(projectDir, { recursive: true });
    fs.mkdirSync(path.join(projectDir, dirNames.stages), { recursive: true });
    fs.mkdirSync(path.join(projectDir, dirNames.contexts, dirNames.research), { recursive: true });
    fs.mkdirSync(path.join(projectDir, dirNames.contexts, dirNames.videos), { recursive: true });
    fs.mkdirSync(path.join(projectDir, dirNames.contexts, dirNames.channels), { recursive: true });
    fs.mkdirSync(path.join(projectDir, `_${dirNames.archives}`), { recursive: true });
    await updateTaskStatus(0);

    // Task 2: Create _meta.json with unified naming convention (snake_case)
    const timestamp = new Date().toISOString();

    const meta = {
      version: "1.0",
      project_id: fullName, // Unified ID format: "20251212-科技测评" (like channel_id, video_id)
      name: projectName.trim(), // Display name (supports Chinese)
      description: description.trim() || '',
      status: "explore", // explore | active | completed | archived
      stage: "idea", // Current stage name
      progress: 0, // Progress percentage (0-100)
      created_at: timestamp,
      updated_at: timestamp,

      metadata: {
        workflow_type: null, // Will be determined by Agent
        duration: config?.defaultDuration || '',
        platform: config?.platform || '',
        audience: config?.audience || ''
      },

      stages: [
        { id: 1, name: 'idea', display_name: getStageName('Idea Communication', dirLang), file: `${dirNames.stages}/${fileNames.idea}`, completed: false },
        { id: 2, name: 'frame', display_name: getStageName('Framework Building', dirLang), file: `${dirNames.stages}/${fileNames.frame}`, completed: false },
        { id: 3, name: 'research', display_name: getStageName('Content Research', dirLang), file: `${dirNames.stages}/${fileNames.research}`, completed: false },
        { id: 4, name: 'outline', display_name: getStageName('Outline Confirmation', dirLang), file: `${dirNames.stages}/${fileNames.outline}`, completed: false },
        { id: 5, name: 'draft', display_name: getStageName('Script Writing', dirLang), file: `${dirNames.stages}/${fileNames.draft}`, completed: false },
        { id: 6, name: 'optimize', display_name: getStageName('Optimization', dirLang), file: `${dirNames.stages}/${fileNames.draft}`, completed: false },
        { id: 7, name: 'publish', display_name: getStageName('Final Output', dirLang), file: fileNames.script, completed: false },
      ],
    };
    fs.writeFileSync(path.join(projectDir, '_meta.json'), JSON.stringify(meta, null, 2));
    await updateTaskStatus(1);

    // Task 3: Update scripts/_meta.json (project index)
    const scriptsMetaPath = path.join(scriptsDir, '_meta.json');
    let scriptsMeta = {
      version: '1.0',
      last_updated: timestamp,
      total_projects: 0,
      projects: []
    };

    // Read existing scripts/_meta.json if exists
    if (fs.existsSync(scriptsMetaPath)) {
      try {
        const scriptsMetaContent = fs.readFileSync(scriptsMetaPath, 'utf8');
        scriptsMeta = JSON.parse(scriptsMetaContent);
      } catch (error) {
        // If parse fails, backup corrupted file and use empty structure
        fs.copyFileSync(scriptsMetaPath, scriptsMetaPath + '.backup');
      }
    }

    // Add new project to index
    scriptsMeta.projects.push({
      project_id: fullName,
      name: projectName.trim(),
      status: "explore",
      stage: "idea",
      updated_at: timestamp
    });
    scriptsMeta.total_projects = scriptsMeta.projects.length;
    scriptsMeta.last_updated = timestamp;

    // Write updated index
    fs.writeFileSync(scriptsMetaPath, JSON.stringify(scriptsMeta, null, 2));
    await updateTaskStatus(2);

    // Task 4: Create _context.md
    const contextMd = `# ${fullName}

> ${description.trim() || 'Project context'}

## Overview

Project: ${projectName.trim()}
Created: ${new Date().toISOString()}

## Stages

- [ ] Stage 1: Idea Communication
- [ ] Stage 2: Framework Building
- [ ] Stage 3: Content Research
- [ ] Stage 4: Outline Confirmation
- [ ] Stage 5: Script Writing
- [ ] Stage 6: Optimization
- [ ] Stage 7: Final Output

## Notes

Add your notes here...
`;
    fs.writeFileSync(path.join(projectDir, '_context.md'), contextMd);
    await updateTaskStatus(3);

    // Show success message
    console.log();
    showSuccess(t('project.created', lang));
    console.log();

    // Get the actual scripts directory name from the path
    const scriptsDirName = path.basename(scriptsDir);
    showInfo(`${t('project.path', lang)}: ${scriptsDirName}/${fullName}`);
    console.log();
  } catch (error) {
    // Show error if creation fails
    console.log();
    showError(`${t('project.createFailed', lang)}: ${error.message}`);
    console.log();

    // Clean up partial project if exists
    if (fs.existsSync(projectDir)) {
      try {
        fs.rmSync(projectDir, { recursive: true, force: true });
        showInfo(t('project.cleanedUp', lang));
        console.log();
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
  }

  // Wait for user to acknowledge before returning
  const continuePrompt = lang === 'zh' ? '按 Enter 返回主菜单' : 'Press Enter to return to main menu';
  await askInput(continuePrompt, '', indent);
  console.log();
}

module.exports = {
  createProject,
};
