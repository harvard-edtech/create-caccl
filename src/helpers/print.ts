/* eslint-disable no-console */

const W = process.stdout.columns;

/**
 * Get the left buffer for a centered message
 * @author Gabe Abrams
 * @param message message to print
 * @param padding amount of padding to add
 * @returns number of chars in the buffer
 */
const leftBuffer = (message: string, padding: number): number => {
  return (Math.floor(W / 2) - padding - Math.ceil(message.length / 2));
};

/**
 * Get the right buffer for a centered message
 * @author Gabe Abrams
 * @param message message to print
 * @param padding amount of padding to add
 * @returns number of chars in the buffer
 */
const rightBuffer = (message: string, padding: number): number => {
  return (Math.ceil(W / 2) - padding - Math.floor(message.length / 2));
};

/**
 * Surround text with a border and spaces
 * @author Gabe Abrams
 * @param str text to print
 * @param border single character to use as a border
 * @returns text to print
 */
const surroundWithBuffer = (str: string, border: string): string => {
  return (
    border
    + ' '.repeat(leftBuffer(str, border.length))
    + str
    + ' '.repeat(rightBuffer(str, border.length))
    + border
  );
};

/**
 * Surround text with a character as the buffer
 * @author Gabe Abrams
 * @param str text to print
 * @param char character to place as the buffer
 * @returns text to print
 */
const surroundWithChars = (str: string, char: string): string => {
  if (str.length > W) {
    return str;
  }
  if (str.length === W - 1) {
    return char + str;
  }
  if (str.length === W - 2) {
    return char + str + char;
  }
  return (
    char.repeat(leftBuffer(str, 1))
    + ' '
    + str
    + ' '
    + char.repeat(rightBuffer(str, 1))
  );
};

// Prompt instance
let cachedPrompt: any;

const print = {
  /**
   * Print a title
   * @author Gabe Abrams
   * @param str text to print
   */
  title: (str: string) => {
    if (str.length > W) {
      return console.log(str);
    }
    console.log('\u2554' + '\u2550'.repeat(W - 2) + '\u2557');
    console.log(surroundWithBuffer(str, '\u2551'));
    console.log('\u255A' + '\u2550'.repeat(W - 2) + '\u255D');
  },
  /**
   * Print a sub title (subheading)
   * @author Gabe Abrams
   * @param str text to print
   */
  subtitle: (str: string) => {
    if (str.length > W) {
      return console.log(str);
    }
    console.log(surroundWithChars(str, '\u257C'));
  },
  /**
   * Print centered text
   * @author Gabe Abrams
   * @param str text to print
   */
  centered: (str: string) => {
    const lines = [];
    let index = 0;
    while (index < str.length) {
      lines.push(str.substring(index, Math.min(index + W, str.length)));
      index += W;
    }
    lines.forEach((line, lineIndex) => {
      if (lineIndex !== lines.length - 1) {
        // No need to center: fills whole line
        console.log(line);
      } else {
        // This line needs to be centered
        console.log(surroundWithChars(line, ' '));
      }
    });
  },
  /**
   * Print a fatal error message
   * @author Gabe Abrams
   * @param err error message
   */
  fatalError: (err: string) => {
    console.log('\n');
    const errLine1 = err.substring(0, W - 6);
    const errLine2 = err.substring(W - 6);
    console.log('\u2554' + '\u2550'.repeat(3) + '\u2557 ');
    console.log(`\u2551 ! \u2551 ${errLine1}`);
    console.log('\u255A' + '\u2550'.repeat(3) + '\u255D ' + errLine2);
    process.exit(0);
  },
  /**
   * Save a copy of the prompt instance
   * @author Gabe Abrams
   * @param promptInstance instance of prompt-sync
   */
  savePrompt: (promptInstance: any) => {
    cachedPrompt = promptInstance;
  },
  /**
   * Ask the user to press enter before continuing
   * @author Gabe Abrams
   */
  enterToContinue: () => {
    const res = cachedPrompt(
      surroundWithChars('enter to continue, ctrl+c to quit', '\u257C'),
      true,
    );
    if (res === null) {
      process.exit(0);
    }
  },
};

export default print;
