/**
 * Contents of the server index.ts file
 * @author Gabe Abrams
 */
declare const serverIndexContents = "import initCACCL from 'caccl/server';\n\n/**\n * Initialize app server\n */\nconst initServer = async () => {\n  // Initialize CACCL\n  const app = await initCACCL({\n    // TODO: configure CACCL\n  });\n};\n\n// Init server and display errors\ninitServer();\n";
export default serverIndexContents;
