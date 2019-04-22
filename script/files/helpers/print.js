/* eslint-disable no-console */

// Width of the terminal window
const W = process.stdout.columns;

// Returns the number of spaces on the left of a centered block
const leftBuffer = (message, padding) => {
  return (Math.floor(W / 2) - padding - Math.ceil(message.length / 2));
};

// Returns the number of spaces on the right of a centered block
const rightBuffer = (message, padding) => {
  return (Math.ceil(W / 2) - padding - Math.floor(message.length / 2));
};

// Creates a line of text: BORDER        str        BORDER
const surroundWithBuffer = (str, border) => {
  return (
    border
    + ' '.repeat(leftBuffer(str, border.length))
    + str
    + ' '.repeat(rightBuffer(str, border.length))
    + border
  );
};

// Creates a line of text: ccccccccc str ccccccccc
// where "c" is char
const surroundWithChars = (str, char) => {
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

module.exports = {
  // Prints a boxed-in title
  title: (str) => {
    if (str.length > W.length) {
      return console.log(str);
    }
    console.log('\u2554' + '\u2550'.repeat(W - 2) + '\u2557');
    console.log(surroundWithBuffer(str, '\u2551'));
    console.log('\u255A' + '\u2550'.repeat(W - 2) + '\u255D');
  },

  // Prints a centered subtitle
  subtitle: (str) => {
    if (str.length > W.length) {
      return console.log(str);
    }
    console.log(surroundWithChars(str, '\u257C'));
  },

  // Prints a block of centered text
  centered: (str) => {
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

  // Prints an error message
  error: (message) => {
    const errLine1 = message.substring(0, W - 6);
    const errLine2 = message.substring(W - 6);
    console.log('\u2554' + '\u2550'.repeat(3) + '\u2557 ');
    console.log(`\u2551 ! \u2551 ${errLine1}`);
    console.log('\u255A' + '\u2550'.repeat(3) + '\u255D ' + errLine2);
  },
};
