// Initializer script for Node.js Scripts

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const print = require('../print');

const exec = (command, print) => {
  return execSync(command, (
    print
      ? {stdio: 'inherit'}
      : undefined
  ));
};

const currDir = process.env.PWD;

module.exports = (prompt, packageJSON) => {
  /*------------------------------------------------------------------------*/
  /*                               Preparation                              */
  /*------------------------------------------------------------------------*/

  // Access token
  console.log('');
  print.subtitle('What\'s your Canvas access token?');
  console.log('Recommendation: add a "fake" user to your course and do the following as that user. You may have more privileges than typical users (the app can do more damage with your token). Using a "fake" user limits this risk.');
  console.log('');
  console.log('1. Log into Canvas, click the user picture (top left), click "Settings"');
  console.log('2. Scroll down and click "+ New Access Token"');
  console.log('3. Set purpose to "Dev Environment for <App Name>", leave expiry blank');
  console.log('4. Click "Generate Token"');
  console.log('');
  const accessToken = prompt('accessToken: ');
  console.log('');
  if (!accessToken || accessToken.trim().length === 0) {
    print.fatalError('Invalid accessToken. Now quitting.');
  }

  // Get Canvas host
  print.subtitle('Which Canvas host should your app connect to by default?');
  print.centered('e.g. canvas.harvard.edu or canvas.instructure.com');
  const canvasHost = prompt('canvasHost: ').trim();
  console.log('\n\n');
  if (canvasHost.length === 0) {
    print.fatalError('No Canvas host provided. Now quitting.');
  }
  console.log('');

  // Ask before continuing
  print.subtitle('We are about to:');
  console.log('- Create/overwrite index.js');
  console.log('- Create/overwrite script.js');
  console.log('- Create a config/ folder and populate it with files:');
  console.log('   > "accessToken.js"');
  console.log('   > "canvasDefaults.js"');
  console.log('- Add config/ and node_modules/ to the .gitignore');
  console.log('- Add/replace npm scripts:');
  console.log('   > "start"');
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

  // 2. Installing caccl
  stepTitle('Installing CACCL');
  exec('npm i --save caccl', true);

  // 3. Installing other dependencies
  stepTitle('Installing other dependencies');
  exec('npm i --save fs', true);

  // 4. Adding scripts
  stepTitle('Adding scripts to package.json');
  const newPackageData = packageJSON.data;
  if (!newPackageData.scripts) {
    newPackageData.scripts = {};
  }
  newPackageData.scripts.start = 'node index.js';
  fs.writeFileSync(packageJSON.filename, JSON.stringify(newPackageData, null, '\t'), 'utf-8');

  // 5. Create config files
  stepTitle('Adding config files');

  // Make a new config directory
  exec('mkdir -p config');

  // Create all config files
  [
    {
      filename: 'accessToken.js',
      data: accessToken,
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
  const indexBody = (
`const initCACCL = require('caccl/script');
const fs = require('fs');
const path = require('path');

// Import configuration files
const canvasDefaults = require('./config/canvasDefaults');

// Import script
const script = require('./script');

// Get access token
const accessTokenPath = path.join(__dirname, 'config', 'accessToken.js');
const accessToken = fs.readFileSync(accessTokenPath, 'utf-8');

// Initialize CACCL
const api = initCACCL({
  accessToken,
  canvasHost: canvasDefaults.canvasHost,
});

// Run the script
script(api);
`
  );
  fs.writeFileSync(path.join(currDir, 'index.js'), indexBody, 'utf-8');

  // 7. Create script.js
  const scriptBody = (
`
module.exports = async (api) => {
  try {
    // Get user's profile from Canvas
    const profile = await api.user.self.getProfile();

    // Print hello world message
    console.log(\`Hi \${profile.name}, it's a pleasure to meet you.\`);
    console.log('This is your CACCL hello world app!\n');
    console.log('Edit "index.js" and run "npm start"');
  } catch (err) {
    console.log('Oops! An error occurred:', err.message, err.code);
  }
};
`
  );
  fs.writeFileSync(path.join(currDir, 'script.js'), scriptBody, 'utf-8');

  // Print finish message
  console.log('\n\n');
  print.title('Done! Node.js Basic Script Project Created');
  console.log('\n');

  print.subtitle('Creating your script:');
  console.log('- Edit index.js');
  console.log('- Visit the caccl-api project on npm for api documentation');
  console.log('');

  print.subtitle('Running your script:');
  console.log('From the root directory of your project, run: "npm start"');
  console.log('');

  console.log('Try running "npm start"! Enjoy!');
};
