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

  // Ask for project name
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

  // Generate full name with date
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const fullName = `${projectName.trim()}-${date}`;

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
    ? ['创建目录结构', '生成项目元数据', '创建上下文文件']
    : ['Create directory structure', 'Generate project metadata', 'Create context file'];

  // Track task completion states
  const taskStates = [false, false, false];

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

    // Task 1: Create directory structure with localized names
    fs.mkdirSync(projectDir, { recursive: true });
    fs.mkdirSync(path.join(projectDir, getDirName('stages', dirLang)), { recursive: true });
    fs.mkdirSync(path.join(projectDir, getDirName('contexts', dirLang), getDirName('research', dirLang)), { recursive: true });
    fs.mkdirSync(path.join(projectDir, getDirName('contexts', dirLang), getDirName('videos', dirLang)), { recursive: true });
    fs.mkdirSync(path.join(projectDir, getDirName('contexts', dirLang), getDirName('channels', dirLang)), { recursive: true });
    fs.mkdirSync(path.join(projectDir, `_${getDirName('archives', dirLang)}`), { recursive: true });
    await updateTaskStatus(0);

    // Task 2: Create _meta.json with localized paths and names
    const stagesDir = getDirName('stages', dirLang);
    const meta = {
      projectName: projectName.trim(),
      fullName: fullName,
      workflowType: null, // Will be determined by Agent based on project context and user choice
      description: description.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStage: 0,
      stages: [
        { id: 1, name: getStageName('Idea Communication', dirLang), file: `${stagesDir}/idea.md`, completed: false },
        { id: 2, name: getStageName('Framework Building', dirLang), file: `${stagesDir}/frame.md`, completed: false },
        { id: 3, name: getStageName('Content Research', dirLang), file: `${stagesDir}/research.md`, completed: false },
        { id: 4, name: getStageName('Outline Confirmation', dirLang), file: `${stagesDir}/outline.md`, completed: false },
        { id: 5, name: getStageName('Script Writing', dirLang), file: `${stagesDir}/draft.md`, completed: false },
        { id: 6, name: getStageName('Optimization', dirLang), file: `${stagesDir}/draft.md`, completed: false },
        { id: 7, name: getStageName('Final Output', dirLang), file: 'script.md', completed: false },
      ],
    };
    fs.writeFileSync(path.join(projectDir, '_meta.json'), JSON.stringify(meta, null, 2));
    await updateTaskStatus(1);

    // Task 3: Create _context.md
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
    await updateTaskStatus(2);

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
