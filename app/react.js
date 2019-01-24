// Initializer script for React apps

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const print = require('../print');

// Set up bash command execution
const exec = (command, print) => {
  return execSync(command, (
    print
      ? {stdio: 'inherit'}
      : undefined
  ));
};

// Determine current working directory
const currDir = process.env.PWD;

// Read in App.js
const appJsResourcePath = path.join(__dirname, 'resources', 'App.js');
const appJsContents = fs.readFileSync(appJsResourcePath, 'utf-8');

module.exports = (prompt, packageJSON) => {
  /*------------------------------------------------------------------------*/
  /*                               Preparation                              */
  /*------------------------------------------------------------------------*/

  // Verify that /client is not already created
  if (fs.existsSync(path.join(currDir, 'client'))) {
    // Already initialized
    if (fs.existsSync(path.join(currDir, 'config', 'devEnvironment.js'))) {
      // Everything already set up
      print.fatalError('Project already set up! To re-init, remove client/');
    }
    // We can try setting up dev environment now
    print.subtitle('Project already set up!');
    print.centered('...but you haven\'t set up your dev environment. Do that now?');
    const setUpDev = prompt('y/n: ');
    if (setUpDev === 'y') {
      setUpDevEnvironment(prompt);
    }
    process.exit(0);
  }

  // Get Canvas host
  print.subtitle('Which Canvas host should your app connect to by default?');
  print.centered('e.g., canvas.harvard.edu or canvas.instructure.com');
  const canvasHost = prompt('canvasHost: ').trim();
  console.log('\n\n');
  if (canvasHost.length === 0) {
    print.fatalError('No Canvas host provided. Now quitting.');
  }

  // Ask before continuing
  print.subtitle('We are about to:');
  console.log('- Create/overwrite index.js');
  console.log('- Create a new React project in a client/ subdirectory');
  console.log('- Replace client/src/App.js with a hello world app');
  console.log('- Create a config/ folder and populate it with files:');
  console.log('   > "developerCredentials.js"');
  console.log('   > "installationCredentials.js"');
  console.log('   > "canvasDefaults.js"');
  console.log('- Add config/ and node_modules/ to the .gitignore');
  console.log('- Add/replace npm scripts:');
  console.log('   > "start"');
  console.log('   > "build"');
  console.log('   > "dev:canvas"');
  console.log('   > "dev:client"');
  console.log('   > "dev:server"');
  print.enterToContinue();

  if (fs.existsSync(path.join(currDir, 'index.js'))) {
    console.log('\nJust to reconfirm: we are going to *overwrite* your index.js file!');
    console.log('');
    print.enterToContinue();
  }

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
  stepTitle('Updating .gitignore')
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
  const newPackageData = packageJSON.data;
  if (!newPackageData.scripts) {
    newPackageData.scripts = {};
  }
  newPackageData.scripts.start = 'node index.js';
  newPackageData.scripts.build = 'cd ./client;npm run build';
  newPackageData.scripts['dev:canvas'] = 'node ./node_modules/caccl/canvas/startPartialSimulation';
  newPackageData.scripts['dev:server'] = 'export DEV=true;npm start';
  newPackageData.scripts['dev:client'] = 'export DEV=true;cd client;npm start';

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
  stepTitle('Creating index.js')
  fs.writeFileSync(path.join(currDir, 'index.js'), (
`// Import CACCL
const initCACCL = require('caccl/server/react');

// Import configuration files
const developerCredentials = require('./config/developerCredentials');
const installationCredentials = require('./config/installationCredentials');
const canvasDefaults = require('./config/canvasDefaults');

// Initialize CACCL
const app = initCACCL({
  developerCredentials,
  installationCredentials,
  canvasHost: canvasDefaults.canvasHost,
});`
  ), 'utf-8');

  // 7. Replace App.js
  stepTitle('Replacing client/src/App.js with "hello world" app');
  const appJsPath = path.join(currDir, 'client', 'src', 'App.js');
  fs.writeFileSync(appJsPath, appJsContents, 'utf-8');

  // Print finish message
  console.log('\n\n');
  print.title('Done! React + Express Project Created');
  console.log('\n');

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
    console.log('\nOkay. Re-run this tool if you ever need help setting up your dev environment.\n\nHave fun!');
  }
};

const setUpDevEnvironment = (canvasHost, prompt) => {
  console.log('\n\n');
  print.title('Let\'s set up your dev environment.');
  console.log('');

  // Get Canvas host and course id
  print.subtitle('1. Get a Canvas test course');
  console.log('');

  print.subtitle('Do you have a sandbox Canvas course?');
  console.log('> If no, get one from your Canvas admin, press ctrl+c, re-run this tool when you have one');
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

  // Get access token
  print.subtitle('2. Get a Canvas access token');
  console.log('Recommendation: create a "fake" user, add them to your course, then perform the following steps as that user. Your personal token may have higher privileges than a typical user (with your token, the app can do more damage). Using a "fake" user limits this risk.');
  console.log('');
  console.log('a. Log into Canvas, click the user picture (top left)');
  console.log('b. Click "Settings"');
  console.log('c. Scroll down and click "+ New Access Token"');
  console.log('d. Set the purpose to: "Dev Environment for <App Name>"');
  console.log('e. Leave the expiry blank');
  console.log('f. Click "Generate Token"');
  console.log('g. Save the token in a secure location and paste it below:');
  console.log('');
  const accessToken = prompt('access token: ');
  console.log('');

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

const printEndMessage = () => {
  print.subtitle('Starting Production Environment:');
  console.log('In the root directory of the project:')
  console.log('1. Build using "npm run build"');
  console.log('2. Start using "npm start"');
  console.log('');

  print.subtitle('Starting Development Environment:');
  console.log('After setting up your dev environment,');
  console.log('1. Open 3 terminal windows, go to the root directory of the project in each');
  console.log('2. Run "npm run dev:canvas" in the first window');
  console.log('3. Run "npm run dev:server" in the second window');
  console.log('4. Run "npm run dev:client" in the third window');
  console.log('To launch your app, read instructions in the first window (Canvas)');
  console.log('');
};