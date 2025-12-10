/**
 * File Operations Utility Module
 * Handles file and directory operations
 */

const fs = require('fs');
const path = require('path');

/**
 * Get package root directory (where v1.0 content is located)
 * Searches upward from current directory for package.json with specific name
 * @returns {string} Path to package root directory
 */
function getPackageRoot() {
  let current = __dirname;

  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'package.json'))) {
      const pkg = JSON.parse(fs.readFileSync(path.join(current, 'package.json'), 'utf8'));
      if (pkg.name === '@video-workflow/content-driven') {
        return current;
      }
    }
    current = path.dirname(current);
  }

  // Fallback: go up two levels from __dirname (utils -> lib -> v1.0)
  return path.resolve(__dirname, '..', '..');
}

/**
 * Copy directory recursively
 * @param {string} src - Source directory path
 * @param {string} dest - Destination directory path
 * @param {Array<string>} exclude - Array of file/folder names to exclude
 */
function copyDir(src, dest, exclude = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (exclude.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

module.exports = {
  getPackageRoot,
  copyDir,
};
