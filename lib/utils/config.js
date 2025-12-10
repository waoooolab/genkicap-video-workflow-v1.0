/**
 * Configuration Management Module
 * Handles global and workspace configuration operations
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

// Global config path
const GLOBAL_CONFIG_PATH = path.join(os.homedir(), '.video-workflow-config.json');

/**
 * Load global configuration from user home directory
 * @returns {Object|null} Global config object or null if not exists
 */
function loadGlobalConfig() {
  if (fs.existsSync(GLOBAL_CONFIG_PATH)) {
    return JSON.parse(fs.readFileSync(GLOBAL_CONFIG_PATH, 'utf8'));
  }
  return null;
}

/**
 * Save global configuration to user home directory
 * @param {Object} config - Configuration object to save
 */
function saveGlobalConfig(config) {
  fs.writeFileSync(GLOBAL_CONFIG_PATH, JSON.stringify(config, null, 2));
}

/**
 * Check if global config exists
 * @returns {boolean} True if global config exists
 */
function hasGlobalConfig() {
  return fs.existsSync(GLOBAL_CONFIG_PATH);
}

/**
 * Check if current directory is a workspace
 * Checks for existence of .workspace marker file
 * @returns {boolean} True if current directory is a workspace
 */
function isWorkspaceInitialized() {
  return fs.existsSync(path.join(process.cwd(), '.workspace'));
}

/**
 * Create workspace marker file
 * @param {string} targetDir - Target directory path (optional, defaults to current directory)
 */
function createWorkspaceMarker(targetDir = process.cwd()) {
  const marker = {
    type: 'video-workflow',
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    createdBy: 'video-workflow-cli'
  };
  fs.writeFileSync(
    path.join(targetDir, '.workspace'),
    JSON.stringify(marker, null, 2)
  );
}

/**
 * Check if current directory is in a workspace
 * Searches for config.json in current and parent directories
 * @returns {boolean} True if in a workspace
 */
function isInWorkspace() {
  let current = process.cwd();

  while (current !== path.dirname(current)) {
    const configPath = path.join(current, 'config.json');
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        // Check if it's a video-workflow config
        if (config.niche || config.platform || config.templates) {
          return true;
        }
      } catch (e) {
        // Ignore invalid JSON
      }
    }
    current = path.dirname(current);
  }

  return false;
}

/**
 * Find config.json in current or parent directories
 * @returns {string|null} Path to config.json or null if not found
 */
function findConfigFile() {
  let current = process.cwd();

  while (current !== path.dirname(current)) {
    const configPath = path.join(current, 'config.json');
    if (fs.existsSync(configPath)) {
      return configPath;
    }
    current = path.dirname(current);
  }

  return null;
}

/**
 * Find scripts directory in current or parent directories
 * @returns {string|null} Path to scripts directory or null if not found
 */
function findScriptsDir() {
  let current = process.cwd();

  while (current !== path.dirname(current)) {
    const scriptsPath = path.join(current, 'scripts');
    if (fs.existsSync(scriptsPath)) {
      return scriptsPath;
    }
    current = path.dirname(current);
  }

  return null;
}

module.exports = {
  GLOBAL_CONFIG_PATH,
  loadGlobalConfig,
  saveGlobalConfig,
  hasGlobalConfig,
  isWorkspaceInitialized,
  createWorkspaceMarker,
  isInWorkspace,
  findConfigFile,
  findScriptsDir,
};
