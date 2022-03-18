"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import libs
var prompt_sync_1 = __importDefault(require("prompt-sync"));
var child_process_1 = require("child_process");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var clear_1 = __importDefault(require("clear"));
var rimraf_1 = __importDefault(require("rimraf"));
// Import local helpers
var print_1 = __importDefault(require("./helpers/print"));
var getPackageJSON_1 = __importDefault(require("./helpers/getPackageJSON"));
var writePackageJSON_1 = __importDefault(require("./helpers/writePackageJSON"));
// Import file content variables
var serverIndexContents_1 = __importDefault(require("./files/serverIndexContents"));
var tsconfigContents_1 = __importDefault(require("./files/tsconfigContents"));
// Get project directory
var currDir = (process.env.PWD || process.env.CWD);
/*------------------------------------------------------------------------*/
/*                           Initialize Helpers                           */
/*------------------------------------------------------------------------*/
/* eslint-disable no-console */
// Sync prompt
var promptSync = (0, prompt_sync_1.default)();
/**
 * Ask the user a question
 * @param title title of the question
 * @param notRequired true if question is not required
 * @returns response
 */
var prompt = function (title, notRequired) {
    var val = promptSync(title);
    if (val === null || (!notRequired && !val)) {
        process.exit(0);
    }
    return val;
};
// Save the prompt for use later
print_1.default.savePrompt(prompt);
/**
 * Execute a command
 * @author Gabe Abrams
 * @param command the command to execute
 */
var exec = function (command) {
    return (0, child_process_1.execSync)(command, { stdio: 'inherit' });
};
/*------------------------------------------------------------------------*/
/*                                  Main                                  */
/*------------------------------------------------------------------------*/
/**
 * Create a new CACCL project based on our template
 * @author Gabe Abrams
 */
var createCACCL = function () {
    var _a, _b;
    // Check if the current directory is an NPM project
    var topPackageFilename = path_1.default.join(currDir, 'package.json');
    if (!fs_1.default.existsSync(topPackageFilename)) {
        // Initialize npm project
        print_1.default.title('NPM Project Not Found');
        console.log('');
        console.log('Before initializing CACCL, you need to initialize your npm project. Make sure you\'re in the correct directory. If you are, try running "npm init"');
        console.log('');
        process.exit(0);
    }
    print_1.default.title('New CACCL Project');
    console.log('\n');
    // Get the name of the app
    print_1.default.subtitle('What is the name of your app?');
    var appNameFull = prompt('App Name: ');
    var appName = (appNameFull
        .toLowerCase()
        .split(' ')
        .map(function (part) {
        return part.replace(/[^A-Za-z]+/g, '');
    })
        .join('-'));
    console.log('\n');
    // Print warning
    print_1.default.subtitle('Ready to continue?');
    console.log('We are about to create and/or overwrite content in this project. Back up your code before continuing.');
    print_1.default.enterToContinue();
    /*------------------------------------------------------------------------*/
    /*                                  Begin                                 */
    /*------------------------------------------------------------------------*/
    (0, clear_1.default)();
    // Title printer
    var numSteps = 10;
    var stepIndex = 1;
    var stepWidth = Math.ceil(process.stdout.columns / (numSteps * 2));
    /**
     * Print the next step
     * @param title title of the step
     */
    var stepTitle = function (title) {
        var progressBar = ('\u2588'.repeat(stepIndex * stepWidth)
            + ' '.repeat((numSteps - stepIndex) * stepWidth));
        console.log("\nStep ".concat(stepIndex, "/").concat(numSteps, ": ").concat(title));
        console.log("[".concat(progressBar, "]"));
        stepIndex += 1;
    };
    /*------------------------------------------------------------------------*/
    /*                                Top-level                               */
    /*------------------------------------------------------------------------*/
    /*----------------------------------------*/
    /*          Remove Previous Files         */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Preparing Project');
    // Perform update
    rimraf_1.default.sync(path_1.default.join(currDir, 'client'));
    rimraf_1.default.sync(path_1.default.join(currDir, 'server'));
    // Add dependency
    exec('npm i --save-dev caccl-canvas-partial-simulator');
    /*----------------------------------------*/
    /*                Gitignore               */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Updating .gitignore');
    // Perform update
    var gitignoreFilename = path_1.default.join(currDir, '.gitignore');
    var gitignore = (fs_1.default.existsSync(gitignoreFilename)
        ? fs_1.default.readFileSync(gitignoreFilename, 'utf-8')
        : '');
    gitignore += (gitignore.length > 0 ? '\n' : '');
    gitignore += '# Ignore node modules\n**/node_modules/';
    gitignore += '\n\n# Ignore configuration files\nconfig/';
    fs_1.default.writeFileSync(gitignoreFilename, gitignore, 'utf-8');
    /*----------------------------------------*/
    /*              Package JSON              */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Update Project Setup');
    // Perform update
    var topPackageJSON = (0, getPackageJSON_1.default)(topPackageFilename);
    topPackageJSON.scripts = ((_a = topPackageJSON.scripts) !== null && _a !== void 0 ? _a : {});
    // Settings
    topPackageJSON.private = 'true';
    // Prod
    topPackageJSON.scripts.start = 'node ./server/build/index.js';
    topPackageJSON.scripts.postinstall = 'cd client && npm install && cd ../server && npm install';
    topPackageJSON.scripts.build = 'cd client && npm run build && cd ../server && npm run build';
    // Dev
    topPackageJSON.scripts['dev:canvas'] = 'node ./node_modules/caccl-canvas-partial-simulator/lib/index.js';
    topPackageJSON.scripts['dev:server'] = 'cd server && npm run dev:server';
    topPackageJSON.scripts['dev:client'] = 'cd client && npm run dev:client';
    // Write
    (0, writePackageJSON_1.default)(topPackageFilename, topPackageJSON);
    /*------------------------------------------------------------------------*/
    /*                                 Client                                 */
    /*------------------------------------------------------------------------*/
    /*----------------------------------------*/
    /*                  React                 */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Initializing React');
    // Create react app
    exec('npx create-react-app --template typescript client');
    // Clean up nested git folder
    rimraf_1.default.sync(path_1.default.join(currDir, 'client', '.git'));
    /*----------------------------------------*/
    /*              Package JSON              */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Update Client Project Setup');
    // Perform update
    var clientPackageFilename = path_1.default.join(currDir, 'client/package.json');
    var clientPackageJSON = (0, getPackageJSON_1.default)(clientPackageFilename);
    // Settings
    clientPackageJSON.name = "client-for-".concat(appName);
    clientPackageJSON.private = 'true';
    // Dev
    clientPackageJSON.scripts['dev:client'] = 'cross-env NODE_ENV=development BROWSER=none npm start';
    // Write
    (0, writePackageJSON_1.default)(clientPackageFilename, clientPackageJSON);
    // Add env
    exec('cd client && npm i --save-dev cross-env');
    /*----------------------------------------*/
    /*                  CACCL                 */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Installing CACCL on the Client');
    // Perform update
    exec('cd client && npm i --save caccl');
    /*------------------------------------------------------------------------*/
    /*                                 Server                                 */
    /*------------------------------------------------------------------------*/
    /*----------------------------------------*/
    /*           New Server Project           */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Initializing Server Project');
    // Perform update
    exec('mkdir server');
    exec('cd server && npm init -y');
    exec('mkdir server/src');
    exec('npm i --save-dev cross-env nodemon @types/express @types/express-session');
    // Perform update
    var serverPackageFilename = path_1.default.join(currDir, 'server/package.json');
    var serverPackageJSON = (0, getPackageJSON_1.default)(serverPackageFilename);
    serverPackageJSON.scripts = ((_b = serverPackageJSON.scripts) !== null && _b !== void 0 ? _b : {});
    // Settings
    serverPackageJSON.name = "server-for-".concat(appName);
    serverPackageJSON.private = 'true';
    // Prod
    serverPackageJSON.scripts.start = 'node ./server/build/index.js';
    serverPackageJSON.scripts.build = 'tsc --project ./tsconfig.json';
    // Dev
    serverPackageJSON.scripts['dev:server'] = 'cross-env NODE_ENV=development nodemon --watch \'./**/*.ts\' --exec \'ts-node\' src/index.ts';
    // Write
    (0, writePackageJSON_1.default)(serverPackageFilename, serverPackageJSON);
    /*----------------------------------------*/
    /*                  CACCL                 */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Adding CACCL to Server');
    // Perform update
    exec("cd server && npm i --save caccl");
    exec("cd server && npm i --save-dev caccl-dev-server");
    /*----------------------------------------*/
    /*               Typescript               */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Adding Typescript to Server');
    // Perform update
    exec('cd server && npm i --save-dev ts-node typescript');
    fs_1.default.writeFileSync(path_1.default.join(currDir, 'server/tsconfig.json'), tsconfigContents_1.default, 'utf-8');
    /*----------------------------------------*/
    /*             Starter Script             */
    /*----------------------------------------*/
    // Print step title
    stepTitle('Adding Starter Server');
    // Perform update
    fs_1.default.writeFileSync(path_1.default.join(currDir, 'server/src/index.ts'), serverIndexContents_1.default, 'utf-8');
};
/*------------------------------------------------------------------------*/
/*                                 Wrap Up                                */
/*------------------------------------------------------------------------*/
exports.default = createCACCL;
//# sourceMappingURL=index.js.map