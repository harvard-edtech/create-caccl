// Initializer script for EJS-based server-side apps

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import helpers
const getCanvasHost = require('../helpers/getCanvasHost');
const getAccessToken = require('../helpers/getAccessToken');
const copyTo = require('../helpers/copyTo');
const print = require('../helpers/print');

// Create function to execute a terminal command
const exec = (command, forwardStdio) => {
  return execSync(command, (
    forwardStdio
      ? { stdio: 'inherit' }
      : undefined
  ));
};

/* eslint-disable no-console */

// Get current directory so we can write files to it
const currDir = process.env.PWD;

/*------------------------------------------------------------------------*/
/*                            Helper Functions                            */
/*------------------------------------------------------------------------*/

/* Prints a final instructional message */
const printEndMessage = () => {
  print.subtitle('Starting Production Environment:');
  console.log('In the root directory of the project:');
  console.log('1. Start using "npm start"');
  console.log('');

  print.subtitle('Starting Development Environment:');
  console.log('After setting up your dev environment,');
  console.log('1. Open 2 terminal windows, go to the root directory of the project in each');
  console.log('2. Run "npm run dev:canvas" in the first window');
  console.log('3. Run "npm run dev:server" in the second window');
  console.log('To launch your app, read instructions in the first window (Canvas)');
  console.log('');
};

/* Walks user through process of setting up the development environment */
const setUpDevEnvironment = (canvasHost, prompt) => {
  console.log('\n\n');
  print.title('Let\'s set up your dev environment.');
  console.log('');

  // Get Canvas host and course id
  print.subtitle('Do you have a sandbox Canvas course?');
  console.log('> If no, hit ctrl+c, get one from your Canvas admin, then re-run this tool');
  console.log('> If yes, paste the link to it below');
  console.log(`Example: https://${canvasHost}/courses/538209`);
  console.log('');

  let courseId;
  while (!courseId) {
    const link = prompt('course link: ');
    try {
      const parts = link.split('/');
      courseId = parseInt(parts[4], 10);
    } catch (err) {
      courseId = null;
      console.log('Invalid course link. Please try again\n');
    }
  }
  console.log('');

  // Get access token
  const accessToken = getAccessToken(prompt);

  const devEnvironment = (
    'module.exports = {\n'
    + `  canvasHost: '${canvasHost}',\n`
    + `  courseId: '${courseId}',\n`
    + `  accessToken: '${accessToken}',\n`
    + '};'
  );
  fs.writeFileSync(
    path.join(currDir, 'config', 'devEnvironment.js'),
    devEnvironment,
    'utf-8'
  );

  console.log('\n\n');
  print.title('Done! Development Environment Set Up');
  console.log('\n');
  printEndMessage();
  console.log('Have fun!');
};

/*------------------------------------------------------------------------*/
/*                         Main: Create an EJS app                        */
/*------------------------------------------------------------------------*/

module.exports = (prompt, packageJSON) => {
  // Get Canvas host
  const canvasHost = getCanvasHost(prompt);
  if (canvasHost.length === 0) {
    print.fatalError('No Canvas host provided. Now quitting.');
  }

  // Ask before continuing
  print.subtitle('We are about to:');
  console.log('- Create/overwrite index.js');
  console.log('- Create/overwrite routes.js');
  console.log('- Create a views/ folder and populate it with files:');
  console.log('   > "index.ejs"');
  console.log('- Create a config/ folder and populate it with files:');
  console.log('   > "developerCredentials.js"');
  console.log('   > "installationCredentials.js"');
  console.log('   > "canvasDefaults.js"');
  console.log('- Add config/ and node_modules/ to the .gitignore');
  console.log('- Add/replace npm scripts:');
  console.log('   > "start"');
  console.log('   > "build"');
  console.log('   > "dev"');
  print.enterToContinue();

  if (fs.existsSync(path.join(currDir, 'index.js'))) {
    console.log('\nJust to reconfirm: we are going to *overwrite* your index.js file!');
    console.log('');
    print.enterToContinue();
  }

  if (fs.existsSync(path.join(currDir, 'routes.js'))) {
    console.log('\nJust to reconfirm: we are going to *overwrite* your routes.js file!');
    console.log('');
    print.enterToContinue();
  }

  /*------------------------------------------------------------------------*/
  /*                                  Begin                                 */
  /*------------------------------------------------------------------------*/

  // Title printer
  const numSteps = 8;
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

  // 2. Installing caccl
  stepTitle('Installing CACCL');
  exec('npm i --save caccl', true);

  // 3. Install other dependencies
  stepTitle('Installing EJS');
  exec('npm i --save ejs', true);

  // 4. Adding scripts
  stepTitle('Adding scripts to package.json');
  const newPackageData = packageJSON.data;
  if (!newPackageData.scripts) {
    newPackageData.scripts = {};
  }
  newPackageData.scripts.start = 'node index.js';
  newPackageData.scripts.build = 'cd ./client;npm run build';
  newPackageData.scripts['dev:canvas'] = 'node ./node_modules/caccl/canvas/startPartialSimulation';
  newPackageData.scripts['dev:server'] = 'export DEV=true;npm start';

  fs.writeFileSync(packageJSON.filename, JSON.stringify(newPackageData, null, '\t'), 'utf-8');

  // 5. Create config files
  stepTitle('Adding config files');

  // Make a new config directory
  exec('mkdir -p config');

  // Create all config files
  [
    {
      filename: 'developerCredentials.js',
      data: (
        'module.exports = {\n'
        + '  client_id: \'client_id\',\n'
        + '  client_secret: \'client_secret\',\n'
        + '};'
      ),
    },
    {
      filename: 'installationCredentials.js',
      data: (
        'module.exports = {\n'
        + '  consumer_key: \'consumer_key\',\n'
        + '  consumer_secret: \'consumer_secret\',\n'
        + '};'
      ),
    },
    {
      filename: 'canvasDefaults.js',
      data: (
        'module.exports = {\n'
        + `  canvasHost: '${canvasHost}',\n`
        + '};'
      ),
    },
  ].forEach((file) => {
    const filename = path.join(currDir, 'config', file.filename);
    fs.writeFileSync(filename, file.data, 'utf-8');
  });

  // 6. Create index.js
  stepTitle('Creating index.js');
  copyTo(
    path.join(__dirname, 'ejsFiles', 'index.js'),
    path.join(currDir, 'index.js')
  );

  // 7. Create routes.js
  stepTitle('Creating routes.js');
  copyTo(
    path.join(__dirname, 'ejsFiles', 'routes.js'),
    path.join(currDir, 'routes.js')
  );

  // 8. Create views

  // Make a new views directory
  exec('mkdir -p views');

  // Create views/index.ejs
  copyTo(
    path.join(__dirname, 'ejsFiles', 'index.ejs'),
    path.join(currDir, 'views', 'index.ejs')
  );

  // Print finish message
  console.log('\n\n');
  print.title('Done! EJS + Express Project Created');
  console.log('');
  print.enterToContinue();
  console.log('');

  printEndMessage();

  print.subtitle('Setting up Dev Environment:');
  console.log('1. Create a new file: config/devEnvironment.js');
  console.log('2. Set its contents as follows:');
  console.log('module.exports = {');
  console.log('  canvasHost: /* an actual Canvas instance */,');
  console.log('  courseId: /* a test course in that instance */,');
  console.log('  accessToken: /* token for user with access to test course */,');
  console.log('};');
  console.log('');
  console.log('We can walk you through setting up the dev environment. Do that now?');
  const setUpDev = prompt('y/n: ', true);

  if (setUpDev === 'y') {
    setUpDevEnvironment(canvasHost, prompt);
  } else {
    console.log('\nOkay. Follow the instructions above to set up your dev environment.\n\nHave fun!');
  }
};
