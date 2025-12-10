/**
 * Input Components Module
 * Handles all user input interactions (askInput, askYesNo, askLanguage)
 */

const { colors, theme, symbols, showGoodbye } = require('./components');

/**
 * Ask for user input with default value
 * @param {string} prompt - Prompt text
 * @param {string} defaultValue - Default value
 * @param {string} indent - Indentation string
 * @returns {Promise<string>} User input or default value
 */
async function askInput(prompt, defaultValue, indent = '  ') {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    const stdout = process.stdout;

    // Show prompt with grayed default value hint (if default value exists)
    const promptLine = `${indent}${prompt}: `;
    const defaultHint = defaultValue ? `${theme.muted}(默认: ${defaultValue})${colors.reset} ` : '';

    stdout.write(promptLine);
    stdout.write(defaultHint);

    // Hide cursor to avoid visual artifacts
    stdout.write('\x1b[?25l');

    let input = '';

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const onData = (key) => {
      // Ctrl+C
      if (key === '\u0003') {
        stdin.setRawMode(false);
        stdin.removeListener('data', onData);
        stdout.write('\x1b[?25h');
        showGoodbye('zh');
        process.exit(0);
      }

      // Enter
      if (key === '\r' || key === '\n') {
        stdin.setRawMode(false);
        stdin.removeListener('data', onData);

        const result = input.trim() || defaultValue;

        // Clear the entire input line
        stdout.write('\r\x1b[K');

        // Show cursor
        stdout.write('\x1b[?25h');

        resolve(result);
        return;
      }

      // Backspace / Delete
      if (key === '\u007F' || key === '\b') {
        if (input.length > 0) {
          input = input.slice(0, -1);
          // Clear line and redraw
          stdout.write('\r\x1b[K');
          stdout.write(promptLine);
          stdout.write(defaultHint);
          stdout.write(' ');
          stdout.write(input);
        }
        return;
      }

      // Ignore escape sequences (arrow keys, etc.)
      if (key.charCodeAt(0) === 27) {
        return;
      }

      // Normal character input
      if (key.charCodeAt(0) >= 32) {
        input += key;
        // Clear line and redraw to handle Chinese characters properly
        stdout.write('\r\x1b[K');
        stdout.write(promptLine);
        stdout.write(defaultHint);
        stdout.write(' ');
        stdout.write(input);
      }
    };

    stdin.on('data', onData);
  });
}

/**
 * Ask language selection with interactive horizontal selection (left/right arrow keys)
 * @param {string} prompt - Question prompt
 * @param {string} lang - Language code
 * @returns {Promise<string>} 'zh' or 'en'
 */
async function askLanguage(prompt, lang = 'zh') {
  const options = ['简体中文', 'English'];

  return new Promise((resolve) => {
    let selectedIndex = 0;
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    // Hide cursor
    process.stdout.write('\x1b[?25l');

    const render = () => {
      // Clear current line
      process.stdout.write('\r\x1b[K');

      // Render prompt with question symbol
      process.stdout.write(`${symbols.question.color}${symbols.question.icon} ${colors.reset}${prompt} `);

      // Render options
      options.forEach((option, index) => {
        const isSelected = index === selectedIndex;
        if (isSelected) {
          process.stdout.write(`${theme.active}${option}${colors.reset}`);
        } else {
          process.stdout.write(`${theme.muted}${option}${colors.reset}`);
        }

        if (index < options.length - 1) {
          process.stdout.write(` ${theme.muted}|${colors.reset} `);
        }
      });
    };

    const cleanup = (result) => {
      stdin.setRawMode(false);
      stdin.removeListener('data', onKeyPress);
      process.stdout.write('\r\x1b[K'); // Clear current line
      process.stdout.write('\x1b[?25h'); // Show cursor
      resolve(result);
    };

    const onKeyPress = (key) => {
      if (key === '\u001b[C') { // Right arrow
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
      } else if (key === '\u001b[D') { // Left arrow
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
      } else if (key === '\r') { // Enter
        cleanup(selectedIndex === 0 ? 'zh' : 'en'); // 0 = 简体中文, 1 = English
      } else if (key === '\u001b' || key === '\u001b[') { // Esc
        cleanup('zh'); // Default to zh on Esc
      } else if (key === '\u0003') { // Ctrl+C
        stdin.setRawMode(false);
        stdin.removeListener('data', onKeyPress);
        process.stdout.write('\x1b[?25h');
        showGoodbye(lang);
        process.exit(0);
      } else {
        // Ignore all other keys (numbers, letters, etc.) - re-render to clear any echo
        render();
      }
    };

    stdin.on('data', onKeyPress);
    render();
  });
}

/**
 * Ask Yes/No question with interactive selection (left/right arrow keys)
 * @param {string} prompt - Question prompt
 * @param {string} lang - Language code
 * @param {boolean} defaultYes - Default to Yes (true) or No (false)
 * @returns {Promise<boolean>} true for Yes, false for No
 */
async function askYesNo(prompt, lang = 'zh', defaultYes = true) {
  const options = lang === 'zh'
    ? ['是', '否']
    : ['Yes', 'No'];

  return new Promise((resolve) => {
    let selectedIndex = defaultYes ? 0 : 1;
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    // Hide cursor
    process.stdout.write('\x1b[?25l');

    const render = () => {
      // Clear current line
      process.stdout.write('\r\x1b[K');

      // Render prompt with question symbol
      process.stdout.write(`${symbols.question.color}${symbols.question.icon} ${colors.reset}${prompt} `);

      // Render options
      options.forEach((option, index) => {
        const isSelected = index === selectedIndex;
        if (isSelected) {
          process.stdout.write(`${theme.active}${option}${colors.reset}`);
        } else {
          process.stdout.write(`${theme.muted}${option}${colors.reset}`);
        }

        if (index < options.length - 1) {
          process.stdout.write(` ${theme.muted}|${colors.reset} `);
        }
      });
    };

    const cleanup = (result) => {
      stdin.setRawMode(false);
      stdin.removeListener('data', onKeyPress);
      process.stdout.write('\r\x1b[K'); // Clear current line
      process.stdout.write('\x1b[?25h'); // Show cursor
      resolve(result);
    };

    const onKeyPress = (key) => {
      if (key === '\u001b[C') { // Right arrow
        selectedIndex = (selectedIndex + 1) % options.length;
        render();
      } else if (key === '\u001b[D') { // Left arrow
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        render();
      } else if (key === '\r') { // Enter
        cleanup(selectedIndex === 0); // 0 = Yes/是, 1 = No/否
      } else if (key === '\u001b' || key === '\u001b[') { // Esc
        cleanup(false); // Default to No on Esc
      } else if (key === '\u0003') { // Ctrl+C
        stdin.setRawMode(false);
        stdin.removeListener('data', onKeyPress);
        process.stdout.write('\x1b[?25h');
        showGoodbye(lang);
        process.exit(0);
      } else {
        // Ignore all other keys - re-render to clear any echo
        render();
      }
    };

    stdin.on('data', onKeyPress);
    render();
  });
}

/**
 * Ask if user wants to modify a field, showing current value
 * @param {string} fieldName - Name of the field
 * @param {string} currentValue - Current value of the field
 * @param {string} lang - Language code
 * @param {string} indent - Indentation string
 * @returns {Promise<string>} New value or current value if not modified
 */
async function askModifyField(fieldName, currentValue, lang = 'zh', indent = '  ') {
  const { colors, theme } = require('./components');

  // Show current value
  const currentLabel = lang === 'zh' ? '当前' : 'Current';
  console.log(`${indent}${theme.muted}${currentLabel}${fieldName}:${colors.reset} ${colors.bright}${currentValue || '(空)'}${colors.reset}`);

  // Ask if user wants to modify (default to No)
  const modifyPrompt = lang === 'zh' ? `是否修改${fieldName}?` : `Modify ${fieldName}?`;
  const shouldModify = await askYesNo(modifyPrompt, lang, false);

  if (shouldModify) {
    // Ask for new value, use current value as default
    return await askInput(fieldName, currentValue, indent);
  }

  return currentValue;
}

module.exports = {
  askInput,
  askLanguage,
  askYesNo,
  askModifyField,
};
