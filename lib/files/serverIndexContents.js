"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Contents of the server index.ts file
 * @author Gabe Abrams
 */
var serverIndexContents = ("import initCACCL from 'caccl/server';\n\n/**\n * Initialize app server\n */\nconst initServer = async () => {\n  // Initialize CACCL\n  const app = await initCACCL({\n    // TODO: configure CACCL\n  });\n};\n\n// Init server and display errors\ninitServer();\n");
exports.default = serverIndexContents;
//# sourceMappingURL=serverIndexContents.js.map