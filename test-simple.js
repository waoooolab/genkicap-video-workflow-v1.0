#!/usr/bin/env node

/**
 * 简单的功能测试脚本
 */

const path = require('path');
const { findScriptsDir } = require('./lib/utils/config');

console.log('=========================================');
console.log('测试 v1.0.4 Bug 修复');
console.log('=========================================\n');

// 测试 2: 多语言目录查找
console.log('测试 #2: 多语言目录查找');
console.log('-----------------------------------------');

const fs = require('fs');
const testDir = path.join(__dirname, '.test-workspace');

// 清理旧测试
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true });
}

// 创建测试工作空间（中文目录）
fs.mkdirSync(testDir, { recursive: true });
fs.mkdirSync(path.join(testDir, '脚本'), { recursive: true });

// 模拟在工作空间根目录
const originalCwd = process.cwd();
process.chdir(testDir);

let scriptsDir = findScriptsDir();
if (scriptsDir && path.basename(scriptsDir) === '脚本') {
  console.log('✅ 在根目录找到中文脚本目录');
} else {
  console.log('❌ 未找到中文脚本目录');
  console.log('   找到的:', scriptsDir);
}

// 模拟在子目录
const subDir = path.join(testDir, 'references', 'videos');
fs.mkdirSync(subDir, { recursive: true });
process.chdir(subDir);

scriptsDir = findScriptsDir();
if (scriptsDir && path.basename(scriptsDir) === '脚本') {
  console.log('✅ 在子目录向上找到中文脚本目录');
} else {
  console.log('❌ 在子目录未找到中文脚本目录');
}

// 恢复目录
process.chdir(originalCwd);

// 测试英文目录
fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });
fs.mkdirSync(path.join(testDir, 'scripts'), { recursive: true });

process.chdir(testDir);
scriptsDir = findScriptsDir();
if (scriptsDir && path.basename(scriptsDir) === 'scripts') {
  console.log('✅ 找到英文脚本目录');
} else {
  console.log('❌ 未找到英文脚本目录');
}

// 清理
process.chdir(originalCwd);
fs.rmSync(testDir, { recursive: true });

console.log('\n=========================================');
console.log('✅ 测试完成！');
console.log('=========================================');
