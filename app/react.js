// Initializer script for React apps
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const rimraf = require('rimraf').sync;

// Import helpers
const setUpDevEnvironment = require('../helpers/setUpDevEnvironment');
const copyTo = require('../helpers/copyTo');
const print = require('../helpers/print');
const getPackageJSON = require('../helpers/getPackageJSON');
const writePackageJSON = require('../helpers/writePackageJSON');

// Set up bash command execution
const exec = (command, forwardStdio) => {
  return execSync(command, (
    forwardStdio
      ? { stdio: 'inherit' }
      : undefined
  ));
};

// Determine current working directory
const currDir = process.env.PWD;

/* eslint-disable no-console */

/*------------------------------------------------------------------------*/
/*                                 Helpers                                */
/*------------------------------------------------------------------------*/

/* Prints a final instructional message */
const printEndMessage = () => {
  print.subtitle('Starting Development Environment:');
  console.log('After setting up your dev environment,');
  console.log('1. Open 3 terminal windows, go to the root directory of the project in each');
  console.log('2. Run "npm run dev:canvas" in the first window');
  console.log('3. Run "npm run dev:server" in the second window');
  console.log('4. Run "npm run dev:client" in the third window');
  console.log('To launch your app, read instructions in the first window (Canvas)');
  console.log('');

  print.subtitle('Deploying your App:');
  console.log('See the docs at https://harvard-edtech.github.io/caccl/#deploying-your-app');
  console.log('');
};

/*------------------------------------------------------------------------*/
/*                         Main: Create React app                         */
/*------------------------------------------------------------------------*/

module.exports = (prompt) => {
  /*------------------------------------------------------------------------*/
  /*                               Preparation                              */
  /*------------------------------------------------------------------------*/

  // Verify that /client is not already created
  const projectInitialized = fs.existsSync(path.join(currDir, 'client'));
  if (projectInitialized) {
    // Already initialized
    const devEnvironmentExists = fs.existsSync(
      path.join(currDir, 'config', 'devEnvironment.js')
    );
    let needToSetUp;
    if (!devEnvironmentExists) {
      needToSetUp = true;
    } else {
      // Read in the dev environment
      /* eslint-disable import/no-dynamic-require */
      /* eslint-disable global-require */
      let devEnvironment;
      try {
        devEnvironment = require(
          path.join(currDir, 'config', 'devEnvironment.js')
        );
      } catch (err) {
        devEnvironment = null;
      }

      // Verify dev environment
      needToSetUp = (
        !devEnvironment
        || !devEnvironment.canvasHost
        || !devEnvironment.accessToken
        || !devEnvironment.courseId
      );
    }

    if (!needToSetUp) {
      // Everything already set up
      print.fatalError('Project all set up!');
    }

    // Need to set up dev environment
    print.subtitle('Project partially set up');
    print.centered('You still need to set up your dev environment. Do that now?');
    const setUpDev = prompt('y/n: ');
    if (setUpDev === 'y') {
      setUpDevEnvironment(prompt);
    }
    process.exit(0);
  }

  // Ask before continuing
  print.subtitle('Ready to continue?');
  console.log('We\'re about to install dependencies, add scripts to package.json, update .gitignore, and more. Consider backing up your project before continuing.');
  print.enterToContinue();

  /*------------------------------------------------------------------------*/
  /*                                  Begin                                 */
  /*------------------------------------------------------------------------*/

  // Title printer
  const numSteps = 7;
  let stepIndex = 1;
  const stepTitle = (title) => {
    const progressBar = (
      '\u2588\u2588\u2588'.repeat(stepIndex)
      + '   '.repeat(numSteps - stepIndex)
    );
    console.log(`\nStep ${stepIndex}/${numSteps}: [${progressBar}]`);
    console.log(`${title}\n`);
    stepIndex += 1;
  };

  // 1. Update .gitignore
  stepTitle('Updating .gitignore');
  const gitignoreFilename = path.join(currDir, '.gitignore');
  let gitignore = (
    fs.existsSync(gitignoreFilename)
      ? fs.readFileSync(gitignoreFilename, 'utf-8')
      : ''
  );
  gitignore += (gitignore.length > 0 ? '\n' : '');
  gitignore += '# Ignore node modules\nnode_modules/';
  gitignore += '\n\n# Ignore configuration files\nconfig/';
  fs.writeFileSync(gitignoreFilename, gitignore, 'utf-8');

  // 2. Initialize React
  stepTitle('Creating React client in client/');
  exec('npx create-react-app client', true);

  // 3. Installing caccl
  stepTitle('Installing CACCL');
  exec('npm i --save caccl', true);
  exec('cd client;npm i --save caccl', true);

  // 4. Adding scripts
  stepTitle('Adding scripts to package.json');
  const newPackageJSON = getPackageJSON();
  if (!newPackageJSON.scripts) {
    newPackageJSON.scripts = {};
  }
  newPackageJSON.scripts.start = 'node index.js';
  newPackageJSON.scripts.build = 'cd ./client;npm install;npm run build';
  newPackageJSON.scripts['dev:canvas'] = 'node ./node_modules/caccl/canvas/startPartialSimulation';
  newPackageJSON.scripts['dev:server'] = 'export DEV=true;npm start';
  newPackageJSON.scripts['dev:client'] = 'export DEV=true;cd client;npm start';
  writePackageJSON(newPackageJSON);

  // 5. Create index.js
  stepTitle('Creating index.js');
  copyTo(
    path.join(__dirname, 'reactFiles', 'index.js'),
    path.join(currDir, 'index.js')
  );

  // 6. Replace App.js
  stepTitle('Replacing client/src/App.js with "hello world" app');
  // Read in App.js
  copyTo(
    path.join(__dirname, 'reactFiles', 'App.js'),
    path.join(currDir, 'client', 'src', 'App.js')
  );

  // 7. Clean up git
  stepTitle('Cleaning up .git folder');
  rimraf(path.join(currDir, 'client', '.git'));

  // Print finish message
  console.log('\n\n');
  print.title('Done! React + Express Project Created');
  console.log('');
  console.log('You need to set up your dev environment. Do that now?');
  const setUpDev = prompt('y/n: ', true);

  if (setUpDev === 'y') {
    setUpDevEnvironment(prompt);
    printEndMessage();
  } else {
    print.subtitle('Setting up Dev Environment:');
    console.log('1. Create a new file: config/devEnvironment.js');
    console.log('2. Set its contents as follows:');
    console.log('module.exports = {');
    console.log('  canvasHost: /* an actual Canvas instance */,');
    console.log('  courseId: /* a test course in that instance */,');
    console.log('  accessToken: /* token for user with access to test course */,');
    console.log('};');
    console.log('');
    printEndMessage();
  }
};
