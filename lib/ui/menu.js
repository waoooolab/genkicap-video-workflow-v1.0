/**
 * Menu Components Module
 * Handles all menu-related interactions (selectMenu, showMainMenu, etc.)
 */

const { colors, theme, symbols, buildHint, showGoodbye } = require('./components');

/**
 * Interactive menu selection with BOTH arrow keys AND number input
 *
 * Features:
 * - Arrow keys (↑/↓) to navigate with live highlight
 * - Number/letter keys to directly jump and select
 * - Enter key (⏎) to confirm selection
 * - Input indicator at top shows current input
 *
 * @param {Array<string|{label:string, value?:any}>} options - Menu options
 * @param {object} config - Configuration object
 * @param {string} config.type - Menu type: 'main' (default), 'sub', 'firstRun'
 * @param {string} config.lang - Language ('zh' or 'en') for default hint (optional)
 * @returns {Promise<number>} Selected index (0-based)
 */
const selectMenu = (options, config = {}) => {
  const { lang = 'zh', type = 'main' } = config;
  const inputPrompt = lang === 'zh'
    ? `${symbols.success.color}${symbols.success.icon}${colors.reset} 输入选项或用↑↓选择,回车确认: `
    : `${symbols.success.color}${symbols.success.icon}${colors.reset} Type option or use ↑↓ to select, Enter to confirm: `;

  // Choose hint keys based on menu type
  let hintKeys;
  if (type === 'main') {
    // Main menu: has letter shortcuts (L, U, X, Q)
    hintKeys = ['arrows', 'number', 'letter', 'enter'];
  } else if (type === 'firstRun') {
    // First run guide: simple selection with esc
    hintKeys = ['arrows', 'number', 'enter', 'esc'];
  } else {
    // Sub menu: regular selection
    hintKeys = ['arrows', 'number', 'enter'];
  }

  const hintText = buildHint(hintKeys, lang);

  // Calculate hint text lines dynamically
  const hintLines = (hintText.match(/\n/g) || []).length + 1;

  return new Promise((resolve) => {
    let selectedIndex = 0;
    let isFirstRender = true;
    let renderedLines = 0; // Track actual rendered lines

    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    // Hide cursor in menu area only
    process.stdout.write('\x1b[?25l');

    const cleanup = (finalIndex) => {
      stdin.setRawMode(false);
      stdin.removeListener('data', onKeyPress);

      // Clear all menu content using actual rendered lines
      if (renderedLines > 0) {
        process.stdout.write(`\x1b[${renderedLines}A`); // Move to top
        process.stdout.write('\x1b[J'); // Clear from cursor down
      }

      process.stdout.write('\x1b[?25h'); // Show cursor

      resolve(finalIndex);
    };

    const render = () => {
      // Calculate total lines dynamically:
      // 1 line: input prompt
      // 1 line: blank after input
      // N lines: menu options
      // 1 line: blank before hint
      // M lines: hint text (calculated from newlines)
      const totalLines = 1 + 1 + options.length + 1 + hintLines;

      if (!isFirstRender) {
        // Move cursor up to the beginning
        process.stdout.write(`\x1b[${renderedLines}A`);
        // Clear everything from cursor down
        process.stdout.write('\x1b[J');
      }
      isFirstRender = false;

      // Render input line at top - show selected menu number
      process.stdout.write('\x1b[2K\r'); // Clear entire line
      process.stdout.write(`${theme.muted}${inputPrompt}${colors.reset}`);

      // Display the current selected option's number/letter
      let displayValue = '';
      if (options[selectedIndex]) {
        const option = options[selectedIndex];
        if (typeof option === 'string') {
          displayValue = String(selectedIndex + 1);
        } else if (option.label) {
          const match = option.label.match(/^([^.]+)\./);
          if (match) {
            displayValue = match[1];
          } else {
            displayValue = String(selectedIndex + 1);
          }
        }
      }
      process.stdout.write(`${theme.active}${displayValue}${colors.reset}`);
      console.log();
      console.log();

      // Render menu options - highlight based on selectedIndex
      options.forEach((option, index) => {
        const isSelected = index === selectedIndex;
        const prefix = isSelected ? `${theme.active}❯ ` : '  ';
        const numColor = isSelected ? theme.active : theme.primary;
        const titleColor = isSelected ? theme.active : theme.title;

        if (typeof option === 'string') {
          // Check if string has " - " pattern for description
          const match = option.match(/^([^-]+)(\s*-\s*.+)?$/);
          if (match && match[2]) {
            const title = match[1];
            const desc = match[2];
            console.log(`${prefix}${numColor}${index + 1}.${colors.reset} ${titleColor}${title}${theme.muted}${desc}${colors.reset}`);
          } else {
            console.log(`${prefix}${numColor}${index + 1}.${colors.reset} ${titleColor}${option}${colors.reset}`);
          }
        } else if (option.label) {
          const match = option.label.match(/^([^.]+\.\s*)([^-]+)(\s*-\s*.+)?$/);
          if (match) {
            const num = match[1];
            const title = match[2];
            const desc = match[3] || '';
            console.log(`${prefix}${numColor}${num}${titleColor}${title}${theme.muted}${desc}${colors.reset}`);
          } else {
            console.log(`${prefix}${numColor}${index + 1}.${colors.reset} ${titleColor}${option.label}${colors.reset}`);
          }
        }
      });

      console.log();
      // Add indent to hint text to align with menu items
      const indent = '  ';
      const indentedHint = hintText.split('\n').map(line => indent + line).join('\n');
      console.log(indentedHint);

      // Store rendered lines for next iteration
      renderedLines = totalLines;
    };

    const onKeyPress = (key) => {
      if (key === '\u001b[A') { // Up arrow
        selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
        render();
      } else if (key === '\u001b[B') { // Down arrow
        selectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        render();
      } else if (key === '\r') { // Enter - confirm selection
        cleanup(selectedIndex);
      } else if (key === '\u001b' || key === '\u001b[') { // Esc key
        // Only handle Esc in firstRun menu, ignore in other menus
        if (type === 'firstRun') {
          stdin.setRawMode(false);
          stdin.removeListener('data', onKeyPress);
          process.stdout.write('\x1b[?25h');
          showGoodbye(lang);
          process.exit(0);
        }
        // Ignore Esc in main/sub menus
      } else if (key === '\u0003') { // Ctrl+C
        stdin.setRawMode(false);
        stdin.removeListener('data', onKeyPress);
        process.stdout.write('\x1b[?25h');
        showGoodbye(lang);
        process.exit(0);
      } else if (key.match(/^[0-9]$/)) { // Number key
        const num = parseInt(key);
        if (num >= 1 && num <= options.length) {
          selectedIndex = num - 1;
          render();
        }
        // Ignore invalid numbers silently
      } else if (key.match(/^[a-zA-Z]$/)) { // Letter key
        const letter = key.toUpperCase();
        // Check letter options (L, U, X, Q, etc.)
        options.forEach((option, index) => {
          if (option.label) {
            const match = option.label.match(/^([A-Z])\./);
            if (match && match[1] === letter) {
              selectedIndex = index;
            }
          }
        });
        render();
      }
      // Ignore all other keys (backspace, etc.) silently
    };

    stdin.on('data', onKeyPress);
    render();
  });
};

/**
 * Interactive multi-select menu with checkboxes
 *
 * Features:
 * - Arrow keys (↑/↓) to navigate
 * - Space to toggle selection
 * - A to select all
 * - I to invert selection
 * - Enter to confirm
 * - Shows ◉ for selected items, ○ for unselected items
 *
 * @param {Array<string>} options - Menu options
 * @param {object} config - Configuration object
 * @param {string} config.lang - Language ('zh' or 'en')
 * @param {Array<number>} config.defaultSelected - Default selected indices (optional)
 * @returns {Promise<Array<number>>} Array of selected indices
 */
const selectMultiMenu = (options, config = {}) => {
  const { lang = 'zh', defaultSelected = [] } = config;

  const inputPrompt = lang === 'zh'
    ? `${symbols.success.color}${symbols.success.icon}${colors.reset} 空格选中/取消,回车确认: `
    : `${symbols.success.color}${symbols.success.icon}${colors.reset} Space to toggle, Enter to confirm: `;

  // Use buildHint for configurable hint text
  const hintText = buildHint(['arrows', 'space', 'all', 'invert', 'enter'], lang);

  const hintLines = (hintText.match(/\n/g) || []).length + 1;

  return new Promise((resolve) => {
    let selectedIndex = 0;
    let selectedItems = new Set(defaultSelected);
    let isFirstRender = true;
    let renderedLines = 0;

    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    process.stdout.write('\x1b[?25l'); // Hide cursor

    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.removeListener('data', onKeyPress);

      if (renderedLines > 0) {
        process.stdout.write(`\x1b[${renderedLines}A`);
        process.stdout.write('\x1b[J');
      }

      process.stdout.write('\x1b[?25h'); // Show cursor

      resolve(Array.from(selectedItems).sort((a, b) => a - b));
    };

    const render = () => {
      const totalLines = 1 + 1 + options.length + 1 + hintLines;

      if (!isFirstRender) {
        process.stdout.write(`\x1b[${renderedLines}A`);
        process.stdout.write('\x1b[J');
      }
      isFirstRender = false;

      // Render input line - show selected count
      process.stdout.write('\x1b[2K\r');
      process.stdout.write(`${theme.muted}${inputPrompt}${colors.reset}`);
      process.stdout.write(`${theme.active}${selectedItems.size} 项已选${colors.reset}`);
      console.log();
      console.log();

      // Render options with checkboxes
      options.forEach((option, index) => {
        const isCurrentLine = index === selectedIndex;
        const isChecked = selectedItems.has(index);

        const prefix = isCurrentLine ? `${theme.active}❯ ` : '  ';
        const checkbox = isChecked ? `${theme.success}◉` : `${theme.muted}○`; // Use circle symbols
        const textColor = isCurrentLine ? theme.active : (isChecked ? theme.title : colors.reset);

        console.log(`${prefix}${checkbox} ${textColor}${option}${colors.reset}`);
      });

      console.log();
      const indent = '  ';
      const indentedHint = hintText.split('\n').map(line => indent + line).join('\n');
      console.log(indentedHint);

      renderedLines = totalLines;
    };

    const onKeyPress = (key) => {
      if (key === '\u001b[A') { // Up arrow
        selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
        render();
      } else if (key === '\u001b[B') { // Down arrow
        selectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
        render();
      } else if (key === ' ') { // Space - toggle selection
        if (selectedItems.has(selectedIndex)) {
          selectedItems.delete(selectedIndex);
        } else {
          selectedItems.add(selectedIndex);
        }
        render();
      } else if (key.toUpperCase() === 'A') { // A - select all
        selectedItems.clear();
        for (let i = 0; i < options.length; i++) {
          selectedItems.add(i);
        }
        render();
      } else if (key.toUpperCase() === 'I') { // I - invert selection
        const newSelected = new Set();
        for (let i = 0; i < options.length; i++) {
          if (!selectedItems.has(i)) {
            newSelected.add(i);
          }
        }
        selectedItems = newSelected;
        render();
      } else if (key === '\r') { // Enter - confirm
        cleanup();
      } else if (key === '\u001b' || key === '\u001b[') { // Esc
        // Multi-select menu is only used in sub-menus, no Esc support
        // User should use Enter to confirm or go back via menu option
        // Ignore Esc key
      } else if (key === '\u0003') { // Ctrl+C
        stdin.setRawMode(false);
        stdin.removeListener('data', onKeyPress);
        process.stdout.write('\x1b[?25h');
        showGoodbye(lang);
        process.exit(0);
      }
    };

    stdin.on('data', onKeyPress);
    render();
  });
};

module.exports = {
  selectMenu,
  selectMultiMenu,
};
