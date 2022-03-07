"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
var W = process.stdout.columns;
/**
 * Get the left buffer for a centered message
 * @author Gabe Abrams
 * @param message message to print
 * @param padding amount of padding to add
 * @returns number of chars in the buffer
 */
var leftBuffer = function (message, padding) {
    return (Math.floor(W / 2) - padding - Math.ceil(message.length / 2));
};
/**
 * Get the right buffer for a centered message
 * @author Gabe Abrams
 * @param message message to print
 * @param padding amount of padding to add
 * @returns number of chars in the buffer
 */
var rightBuffer = function (message, padding) {
    return (Math.ceil(W / 2) - padding - Math.floor(message.length / 2));
};
/**
 * Surround text with a border and spaces
 * @author Gabe Abrams
 * @param str text to print
 * @param border single character to use as a border
 * @returns text to print
 */
var surroundWithBuffer = function (str, border) {
    return (border
        + ' '.repeat(leftBuffer(str, border.length))
        + str
        + ' '.repeat(rightBuffer(str, border.length))
        + border);
};
/**
 * Surround text with a character as the buffer
 * @author Gabe Abrams
 * @param str text to print
 * @param char character to place as the buffer
 * @returns text to print
 */
var surroundWithChars = function (str, char) {
    if (str.length > W) {
        return str;
    }
    if (str.length === W - 1) {
        return char + str;
    }
    if (str.length === W - 2) {
        return char + str + char;
    }
    return (char.repeat(leftBuffer(str, 1))
        + ' '
        + str
        + ' '
        + char.repeat(rightBuffer(str, 1)));
};
// Prompt instance
var cachedPrompt;
var print = {
    /**
     * Print a title
     * @author Gabe Abrams
     * @param str text to print
     */
    title: function (str) {
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
    subtitle: function (str) {
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
    centered: function (str) {
        var lines = [];
        var index = 0;
        while (index < str.length) {
            lines.push(str.substring(index, Math.min(index + W, str.length)));
            index += W;
        }
        lines.forEach(function (line, lineIndex) {
            if (lineIndex !== lines.length - 1) {
                // No need to center: fills whole line
                console.log(line);
            }
            else {
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
    fatalError: function (err) {
        console.log('\n');
        var errLine1 = err.substring(0, W - 6);
        var errLine2 = err.substring(W - 6);
        console.log('\u2554' + '\u2550'.repeat(3) + '\u2557 ');
        console.log("\u2551 ! \u2551 ".concat(errLine1));
        console.log('\u255A' + '\u2550'.repeat(3) + '\u255D ' + errLine2);
        process.exit(0);
    },
    /**
     * Save a copy of the prompt instance
     * @author Gabe Abrams
     * @param promptInstance instance of prompt-sync
     */
    savePrompt: function (promptInstance) {
        cachedPrompt = promptInstance;
    },
    /**
     * Ask the user to press enter before continuing
     * @author Gabe Abrams
     */
    enterToContinue: function () {
        var res = cachedPrompt(surroundWithChars('enter to continue, ctrl+c to quit', '\u257C'), true);
        if (res === null) {
            process.exit(0);
        }
    },
};
exports.default = print;
//# sourceMappingURL=print.js.map