/**
 * Workspace Migration Module
 * Automatically detect and fix workspace structure inconsistencies
 */

const fs = require('fs');
const path = require('path');
const { DIR_NAMES, FILE_NAMES, getAllDirNames, getAllFileNames } = require('../utils/i18n');

/**
 * Historical name mappings - old names that should be migrated to current standard
 * Format: { old: string, new: string (key in i18n) }
 */
const LEGACY_DIR_NAMES = {
  zh: {
    '上下文': 'contexts',      // → _补充资料
    '补充资料': 'contexts',    // → _补充资料 (add underscore)
    '阶段': 'stages',          // → 阶段输出
    '历史版本': 'archives',    // → _历史版本 (add underscore)
    '_context': 'contexts',    // English name in zh workspace → _补充资料
    'contexts': 'contexts',    // English name in zh workspace → _补充资料
    '_archive': 'archives',    // English name in zh workspace → _历史版本
    'stages': 'stages',        // English name in zh workspace → 阶段输出
    'scripts': 'scripts',      // → 脚本
    'references': 'references', // → 参考资料
  },
  en: {
    'contexts': 'contexts',    // → _context (add underscore)
    'archives': 'archives',    // → _archive (add underscore)
  }
};

const LEGACY_FILE_NAMES = {
  zh: {
    // Numbered stage files → non-numbered
    '01_选题沟通.md': 'idea',
    '02_框架搭建.md': 'frame',
    '03_内容调研.md': 'research',
    '04_大纲确认.md': 'outline',
    '05_脚本草稿.md': 'draft',
    // English names in zh workspace
    'idea.md': 'idea',
    'frame.md': 'frame',
    'research.md': 'research',
    'outline.md': 'outline',
    'draft.md': 'draft',
    'script.md': 'script',
  }
};

const WORKSPACE_FILES = {
  zh: {
    'README.md': '说明.md',
    'QUICKSTART.md': '快速开始.md',
  }
};

/**
 * Migrate workspace structure
 * @param {string} dirLang - Directory language ('zh' or 'en')
 * @param {string} workspacePath - Workspace root path
 * @returns {object} { migrated: string[], skipped: string[] }
 */
function migrateWorkspace(dirLang, workspacePath = process.cwd()) {
  const result = { migrated: [], skipped: [] };
  if (dirLang !== 'zh') return result;

  const currentDirNames = getAllDirNames(dirLang);
  const currentFileNames = getAllFileNames(dirLang);

  // 1. Workspace-level files
  for (const [oldName, newName] of Object.entries(WORKSPACE_FILES.zh)) {
    migrateItem(workspacePath, oldName, newName, result);
  }

  // 2. Workspace-level directories
  for (const [legacyName, key] of Object.entries(LEGACY_DIR_NAMES.zh)) {
    const newName = currentDirNames[key];
    if (legacyName !== newName) {
      migrateItem(workspacePath, legacyName, newName, result);
    }
  }

  // 3. Project-level migrations (inside scripts directory)
  const scriptsDir = path.join(workspacePath, currentDirNames.scripts);
  if (!fs.existsSync(scriptsDir)) return result;

  const projects = fs.readdirSync(scriptsDir).filter(name => {
    const p = path.join(scriptsDir, name);
    return fs.statSync(p).isDirectory() && !name.startsWith('.') && name !== '_meta.json';
  });

  for (const project of projects) {
    const projectPath = path.join(scriptsDir, project);

    // 3a. Project directories
    for (const [legacyName, key] of Object.entries(LEGACY_DIR_NAMES.zh)) {
      const newName = currentDirNames[key];
      if (legacyName !== newName) {
        migrateItem(projectPath, legacyName, newName, result, `${project}/`);
      }
    }

    // 3b. Stage files (inside stages directory)
    const stagesDir = path.join(projectPath, currentDirNames.stages);
    if (fs.existsSync(stagesDir)) {
      for (const [legacyName, key] of Object.entries(LEGACY_FILE_NAMES.zh)) {
        const newName = currentFileNames[key];
        if (legacyName !== newName) {
          migrateItem(stagesDir, legacyName, newName, result, `${project}/${currentDirNames.stages}/`);
        }
      }
    }

    // Also check legacy stages directory name
    const legacyStagesDir = path.join(projectPath, '阶段');
    if (fs.existsSync(legacyStagesDir)) {
      for (const [legacyName, key] of Object.entries(LEGACY_FILE_NAMES.zh)) {
        const newName = currentFileNames[key];
        if (legacyName !== newName) {
          migrateItem(legacyStagesDir, legacyName, newName, result, `${project}/阶段/`);
        }
      }
    }

    // 3c. Archive files (inside archives directory)
    const archivesDir = path.join(projectPath, currentDirNames.archives);
    if (fs.existsSync(archivesDir)) {
      migrateArchiveFiles(archivesDir, currentFileNames, result, `${project}/${currentDirNames.archives}/`);
    }

    // Also check legacy archives directory names
    const legacyArchivesDirs = ['历史版本', '_archive', 'archives'];
    for (const legacyArchivesName of legacyArchivesDirs) {
      const legacyArchivesDir = path.join(projectPath, legacyArchivesName);
      if (fs.existsSync(legacyArchivesDir) && legacyArchivesName !== currentDirNames.archives) {
        migrateArchiveFiles(legacyArchivesDir, currentFileNames, result, `${project}/${legacyArchivesName}/`);
      }
    }
  }

  return result;
}

/**
 * Migrate a single item (file or directory)
 */
function migrateItem(basePath, oldName, newName, result, prefix = '') {
  const oldPath = path.join(basePath, oldName);
  const newPath = path.join(basePath, newName);

  if (!fs.existsSync(oldPath)) return;

  // If target already exists, we need to handle the conflict intelligently
  if (fs.existsSync(newPath)) {
    const oldStat = fs.statSync(oldPath);
    const newStat = fs.statSync(newPath);

    // If both are directories, check which one has content
    if (oldStat.isDirectory() && newStat.isDirectory()) {
      try {
        const oldEmpty = isDirectoryEmpty(oldPath);
        const newEmpty = isDirectoryEmpty(newPath);

        if (oldEmpty && newEmpty) {
          // Both empty, just remove old one
          fs.rmSync(oldPath, { recursive: true, force: true });
          result.migrated.push(`${prefix}${oldName} → ${newName} (both empty, removed old)`);
        } else if (oldEmpty) {
          // Old is empty, just remove it
          fs.rmSync(oldPath, { recursive: true, force: true });
          result.migrated.push(`${prefix}${oldName} → ${newName} (old empty, removed)`);
        } else if (newEmpty) {
          // New is empty, remove it and rename old to new
          fs.rmSync(newPath, { recursive: true, force: true });
          fs.renameSync(oldPath, newPath);
          result.migrated.push(`${prefix}${oldName} → ${newName} (new empty, replaced)`);
        } else {
          // Both have content, merge them
          mergeDirectories(oldPath, newPath);
          fs.rmSync(oldPath, { recursive: true, force: true });
          result.migrated.push(`${prefix}${oldName} → ${newName} (both have content, merged)`);
        }
      } catch (err) {
        result.skipped.push(`${prefix}${oldName} (migration failed: ${err.message})`);
      }
    } else {
      result.skipped.push(`${prefix}${oldName} (${newName} exists)`);
    }
    return;
  }

  try {
    fs.renameSync(oldPath, newPath);
    result.migrated.push(`${prefix}${oldName} → ${newName}`);
  } catch (err) {
    result.skipped.push(`${prefix}${oldName} (${err.message})`);
  }
}

/**
 * Check if a directory is empty (no files, only empty subdirectories allowed)
 */
function isDirectoryEmpty(dirPath) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    // Skip hidden files like .DS_Store
    if (item.startsWith('.')) continue;

    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isFile()) {
      return false; // Found a file, not empty
    } else if (stat.isDirectory()) {
      // Recursively check subdirectory
      if (!isDirectoryEmpty(itemPath)) {
        return false;
      }
    }
  }

  return true; // No files found
}

/**
 * Migrate archive files with version suffixes
 * Handles files like draft_v01.md, frame_v02.md, etc.
 */
function migrateArchiveFiles(archivesDir, currentFileNames, result, prefix = '') {
  const items = fs.readdirSync(archivesDir);

  // Pattern to match versioned files: {basename}_v{number}.{ext}
  const versionPattern = /^(.+)_v(\d+)(\.[^.]+)$/;

  for (const item of items) {
    // Skip hidden files
    if (item.startsWith('.')) continue;

    const itemPath = path.join(archivesDir, item);
    const stat = fs.statSync(itemPath);

    // Only process files, not directories
    if (!stat.isFile()) continue;

    const match = item.match(versionPattern);
    if (!match) continue;

    const [, basename, version, ext] = match;

    // Find the corresponding localized name
    let localizedBasename = null;
    for (const [legacyName, key] of Object.entries(LEGACY_FILE_NAMES.zh)) {
      // Remove extension from legacy name for comparison
      const legacyBasename = legacyName.replace(/\.[^.]+$/, '');
      if (basename === legacyBasename) {
        // Get the localized name and remove its extension
        const localizedName = currentFileNames[key];
        localizedBasename = localizedName.replace(/\.[^.]+$/, '');
        break;
      }
    }

    // If we found a localized name and it's different, migrate
    if (localizedBasename && localizedBasename !== basename) {
      const newName = `${localizedBasename}_v${version}${ext}`;
      migrateItem(archivesDir, item, newName, result, prefix);
    }
  }
}

/**
 * Merge contents from source directory to target directory
 */
function mergeDirectories(sourceDir, targetDir) {
  const items = fs.readdirSync(sourceDir);

  for (const item of items) {
    const sourcePath = path.join(sourceDir, item);
    const targetPath = path.join(targetDir, item);

    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      // Recursively merge subdirectories
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
      }
      mergeDirectories(sourcePath, targetPath);
    } else {
      // Copy file if it doesn't exist in target
      if (!fs.existsSync(targetPath)) {
        fs.copyFileSync(sourcePath, targetPath);
      }
      // If file exists in target, keep the target version (newer)
    }
  }
}

/**
 * Check if workspace needs migration
 */
function needsMigration(dirLang, workspacePath = process.cwd()) {
  if (dirLang !== 'zh') return false;

  const currentDirNames = getAllDirNames(dirLang);
  const currentFileNames = getAllFileNames(dirLang);

  // Check workspace files
  for (const [oldName, newName] of Object.entries(WORKSPACE_FILES.zh)) {
    if (needsItemMigration(workspacePath, oldName, newName)) return true;
  }

  // Check workspace directories
  for (const [legacyName, key] of Object.entries(LEGACY_DIR_NAMES.zh)) {
    const newName = currentDirNames[key];
    if (legacyName !== newName && needsItemMigration(workspacePath, legacyName, newName)) {
      return true;
    }
  }

  // Check projects
  const scriptsDir = path.join(workspacePath, currentDirNames.scripts);
  if (!fs.existsSync(scriptsDir)) return false;

  const projects = fs.readdirSync(scriptsDir).filter(name => {
    const p = path.join(scriptsDir, name);
    return fs.statSync(p).isDirectory() && !name.startsWith('.');
  });

  for (const project of projects) {
    const projectPath = path.join(scriptsDir, project);

    // Check project directories
    for (const [legacyName, key] of Object.entries(LEGACY_DIR_NAMES.zh)) {
      const newName = currentDirNames[key];
      if (legacyName !== newName && needsItemMigration(projectPath, legacyName, newName)) {
        return true;
      }
    }

    // Check stage files
    const stagesDir = path.join(projectPath, currentDirNames.stages);
    if (fs.existsSync(stagesDir)) {
      for (const [legacyName, key] of Object.entries(LEGACY_FILE_NAMES.zh)) {
        const newName = currentFileNames[key];
        if (legacyName !== newName && needsItemMigration(stagesDir, legacyName, newName)) {
          return true;
        }
      }
    }

    // Check archive files
    const archivesDir = path.join(projectPath, currentDirNames.archives);
    if (fs.existsSync(archivesDir)) {
      if (needsArchiveFilesMigration(archivesDir, currentFileNames)) {
        return true;
      }
    }

    // Also check legacy archives directory names
    const legacyArchivesDirs = ['历史版本', '_archive', 'archives'];
    for (const legacyArchivesName of legacyArchivesDirs) {
      const legacyArchivesDir = path.join(projectPath, legacyArchivesName);
      if (fs.existsSync(legacyArchivesDir) && legacyArchivesName !== currentDirNames.archives) {
        if (needsArchiveFilesMigration(legacyArchivesDir, currentFileNames)) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Check if archive files need migration
 */
function needsArchiveFilesMigration(archivesDir, currentFileNames) {
  const items = fs.readdirSync(archivesDir);
  const versionPattern = /^(.+)_v(\d+)(\.[^.]+)$/;

  for (const item of items) {
    if (item.startsWith('.')) continue;

    const itemPath = path.join(archivesDir, item);
    const stat = fs.statSync(itemPath);
    if (!stat.isFile()) continue;

    const match = item.match(versionPattern);
    if (!match) continue;

    const [, basename, version, ext] = match;

    // Check if this file needs migration
    for (const [legacyName, key] of Object.entries(LEGACY_FILE_NAMES.zh)) {
      const legacyBasename = legacyName.replace(/\.[^.]+$/, '');
      if (basename === legacyBasename) {
        const localizedName = currentFileNames[key];
        const localizedBasename = localizedName.replace(/\.[^.]+$/, '');
        if (localizedBasename !== basename) {
          return true; // Found a file that needs migration
        }
      }
    }
  }

  return false;
}

function needsItemMigration(basePath, oldName, newName) {
  const oldPath = path.join(basePath, oldName);
  const newPath = path.join(basePath, newName);

  // If old doesn't exist, no migration needed
  if (!fs.existsSync(oldPath)) return false;

  // If old exists and new doesn't exist, migration needed
  if (!fs.existsSync(newPath)) return true;

  // If both exist and both are directories, check if old has content
  // If old is empty, no need to migrate (will be cleaned up)
  // If old has content, need to migrate (will merge or replace)
  try {
    const oldStat = fs.statSync(oldPath);
    const newStat = fs.statSync(newPath);

    if (oldStat.isDirectory() && newStat.isDirectory()) {
      return !isDirectoryEmpty(oldPath); // Only migrate if old has content
    }
  } catch (err) {
    // If error checking, assume migration needed to be safe
    return true;
  }

  // For files or mixed types, if both exist, assume already migrated
  return false;
}

module.exports = {
  migrateWorkspace,
  needsMigration,
  LEGACY_DIR_NAMES,
  LEGACY_FILE_NAMES,
  WORKSPACE_FILES,
};
