const promptSync = require('prompt-sync')();

/**
 * Displays a prompt, exits with ctrl+c
 * @param text {string} - text to display before the cursor
 * @return {string} value typed by user
 */
module.exports = (text) => {
  const ret = promptSync(text);
  if (ret === null) {
    process.exit(0);
  }
  return ret;
};
