"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var print_1 = __importDefault(require("./print"));
/* eslint-disable no-console */
/**
 * Write a package json file
 * @author Gabe Abrams
 * @param filename filename for the package.json
 * @param contents contents of the package.json
 */
var writePackageJSON = function (filename, contents) {
    // Write to package.json
    try {
        var jsonContents = JSON.stringify(contents, null, '\t');
        fs_1.default.writeFileSync(filename, jsonContents, 'utf-8');
    }
    catch (err) {
        console.log(err);
        print_1.default.fatalError('\nOops! We ran into an error while writing to your package.json file. Now quitting.');
    }
};
exports.default = writePackageJSON;
//# sourceMappingURL=writePackageJSON.js.map