"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var print_1 = __importDefault(require("./print"));
/* eslint-disable no-console */
/**
 * Read a package.json file
 * @param filename
 * @returns package json contents
 */
var getPackageJSON = function (filename) {
    if (!fs_1.default.existsSync(filename)) {
        print_1.default.fatalError("We expected ".concat(filename, " to exist but it did not. Fatal error. Now exiting."));
    }
    // Read in current package.json fil
    try {
        var stringContents = fs_1.default.readFileSync(filename, 'utf-8');
        return JSON.parse(stringContents);
    }
    catch (err) {
        print_1.default.fatalError('\nOops! Your package.json file seems to be corrupted. Please fix it before continuing');
    }
};
exports.default = getPackageJSON;
//# sourceMappingURL=getPackageJSON.js.map