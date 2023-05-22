// Import libs
import initPrompt from 'prompt-sync';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import clear from 'clear';
import rimraf from 'rimraf';

// Import local helpers
import print from './helpers/print';
import getPackageJSON from './helpers/getPackageJSON';
import writePackageJSON from './helpers/writePackageJSON';

// Import file content variables
import serverIndexContents from './files/serverIndexContents';
import tsconfigContents from './files/tsconfigContents';

// Get project directory
const currDir = (process.env.PWD || process.env.CWD);

/*------------------------------------------------------------------------*/
/*                           Initialize Helpers                           */
/*------------------------------------------------------------------------*/

/* eslint-disable no-console */

// Sync prompt
const promptSync = initPrompt();

/**
 * Ask the user a question
 * @param title title of the question
 * @param notRequired true if question is not required
 * @returns response
 */
const prompt = (title: string, notRequired?: boolean): string => {
  const val = promptSync(title);
  if (val === null || (!notRequired && !val)) {
    process.exit(0);
  }
  return val;
};

// Save the prompt for use later
print.savePrompt(prompt);

/**
 * Execute a command
 * @author Gabe Abrams
 * @param command the command to execute
 */
const exec = (command: string) => {
  return execSync(command, { stdio: 'inherit' });
};

/*------------------------------------------------------------------------*/
/*                                  Main                                  */
/*------------------------------------------------------------------------*/

/**
 * Create a new CACCL project based on our template
 * @author Gabe Abrams
 */
const createCACCL = () => {
  // Check if the current directory is an NPM project
  const topPackageFilename = path.join(currDir, 'package.json');
  if (!fs.existsSync(topPackageFilename)) {
    // Initialize npm project
    print.title('NPM Project Not Found');
    console.log('');
    console.log('Before initializing CACCL, you need to initialize your npm project. Make sure you\'re in the correct directory. If you are, try running "npm init"');
    console.log('');
    process.exit(0);
  }

  print.title('New CACCL Project');
  console.log('\n');

  // Get the name of the app
  print.subtitle('What is the name of your app?');
  const appNameFull = prompt('App Name: ');
  const appName = (
    appNameFull
      .toLowerCase()
      .split(' ')
      .map((part) => {
        return part.replace(/[^A-Za-z]+/g, '');
      })
      .join('-')
  );
  console.log('\n');

  // Print warning
  print.subtitle('Ready to continue?');
  console.log('We are about to create and/or overwrite content in this project. Back up your code before continuing.');
  print.enterToContinue();

  /*------------------------------------------------------------------------*/
  /*                                  Begin                                 */
  /*------------------------------------------------------------------------*/

  clear();

  // Title printer
  const numSteps = 10;
  let stepIndex = 1;
  const stepWidth = Math.ceil(process.stdout.columns / (numSteps * 2));

  /**
   * Print the next step
   * @param title title of the step
   */
  const stepTitle = (title: string) => {
    const progressBar = (
      '\u2588'.repeat(stepIndex * stepWidth)
      + ' '.repeat((numSteps - stepIndex) * stepWidth)
    );
    console.log(`\nStep ${stepIndex}/${numSteps}: ${title}`);
    console.log(`[${progressBar}]`);
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
  rimraf.sync(path.join(currDir, 'client'));
  rimraf.sync(path.join(currDir, 'server'));

  // Add dependency
  exec('npm i --save-dev caccl-canvas-partial-simulator');

  /*----------------------------------------*/
  /*                Gitignore               */
  /*----------------------------------------*/

  // Print step title
  stepTitle('Updating .gitignore');

  // Perform update
  const gitignoreFilename = path.join(currDir, '.gitignore');
  let gitignore = (
    fs.existsSync(gitignoreFilename)
      ? fs.readFileSync(gitignoreFilename, 'utf-8')
      : ''
  );
  gitignore += (gitignore.length > 0 ? '\n' : '');
  gitignore += '# Ignore node modules\n**/node_modules/';
  gitignore += '\n\n# Ignore configuration files\nconfig/';
  fs.writeFileSync(gitignoreFilename, gitignore, 'utf-8');

  /*----------------------------------------*/
  /*              Package JSON              */
  /*----------------------------------------*/

  // Print step title
  stepTitle('Update Project Setup');

  // Perform update
  const topPackageJSON = getPackageJSON(topPackageFilename);
  topPackageJSON.scripts = (topPackageJSON.scripts ?? {});
  // Settings
  topPackageJSON.private = 'true';
  // Prod
  topPackageJSON.scripts.start = 'node ./server/build/index.js';
  topPackageJSON.scripts.postinstall = 'cd client && npm install && cd ../server && npm install';
  topPackageJSON.scripts.build = 'cd client && npm run build && cd ../server && npm run build';
  // Dev
  topPackageJSON.scripts['dev:canvas'] = 'npx canvas-simulator-start';
  topPackageJSON.scripts['dev:server'] = 'cd server && npm run dev:server';
  topPackageJSON.scripts['dev:client'] = 'cd client && npm run dev:client';
  // Write
  writePackageJSON(topPackageFilename, topPackageJSON);

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
  rimraf.sync(path.join(currDir, 'client', '.git'));

  /*----------------------------------------*/
  /*              Package JSON              */
  /*----------------------------------------*/

  // Print step title
  stepTitle('Update Client Project Setup');

  // Perform update
  const clientPackageFilename = path.join(currDir, 'client/package.json');
  const clientPackageJSON = getPackageJSON(clientPackageFilename);
  // Settings
  clientPackageJSON.name = `client-for-${appName}`;
  clientPackageJSON.private = 'true';
  // Dev
  clientPackageJSON.scripts['dev:client'] = 'cross-env NODE_ENV=development BROWSER=none npm start';
  // Write
  writePackageJSON(clientPackageFilename, clientPackageJSON);

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
  exec('cd server && mkdir src');
  exec('cd server && npm i --save-dev cross-env nodemon @types/express @types/express-session');

  // Perform update
  const serverPackageFilename = path.join(currDir, 'server/package.json');
  const serverPackageJSON = getPackageJSON(serverPackageFilename);
  serverPackageJSON.scripts = (serverPackageJSON.scripts ?? {});
  // Settings
  serverPackageJSON.name = `server-for-${appName}`;
  serverPackageJSON.private = 'true';
  // Prod
  serverPackageJSON.scripts.start = 'node ./server/build/index.js';
  serverPackageJSON.scripts.build = 'npm i --production=false && tsc --project ./tsconfig.json';
  // Dev
  serverPackageJSON.scripts['dev:server'] = 'cross-env NODE_ENV=development nodemon --watch \'./**/*.ts\' --exec \'ts-node\' src/index.ts';
  // Write
  writePackageJSON(serverPackageFilename, serverPackageJSON);

  /*----------------------------------------*/
  /*                  CACCL                 */
  /*----------------------------------------*/

  // Print step title
  stepTitle('Adding CACCL to Server');

  // Perform update
  exec(`cd server && npm i --save caccl`);
  exec(`cd server && npm i --save-dev caccl-dev-server`);

  /*----------------------------------------*/
  /*               Typescript               */
  /*----------------------------------------*/

  // Print step title
  stepTitle('Adding Typescript to Server');

  // Perform update
  exec('cd server && npm i --save-dev ts-node typescript');
  fs.writeFileSync(
    path.join(currDir, 'server/tsconfig.json'),
    tsconfigContents,
    'utf-8',
  );

  /*----------------------------------------*/
  /*             Starter Script             */
  /*----------------------------------------*/

  // Print step title
  stepTitle('Adding Starter Server');

  // Perform update
  fs.writeFileSync(
    path.join(currDir, 'server/src/index.ts'),
    serverIndexContents,
    'utf-8',
  );
};

/*------------------------------------------------------------------------*/
/*                                 Wrap Up                                */
/*------------------------------------------------------------------------*/

export default createCACCL;
