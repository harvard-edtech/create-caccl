"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Contents of a tsconfig file
 * @author Gabe Abrams
 */
var tsconfigContents = ("{\n  \"compilerOptions\": {\n    \"module\": \"commonjs\",\n    \"esModuleInterop\": true,\n    \"noImplicitAny\": true,\n    \"noEmitOnError\": true,\n    \"removeComments\": false,\n    \"declaration\": true,\n    \"sourceMap\": true,\n    \"target\": \"es5\",\n    \"lib\": [\"DOM\", \"ES5\"],\n    \"outDir\": \"./lib\"\n  },\n    \"include\": [\n    \"./src\"\n  ],\n  \"ts-node\": {\n    \"files\": true\n  }\n}");
exports.default = tsconfigContents;
//# sourceMappingURL=tsconfigContents.js.map