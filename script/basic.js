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
  print.subtitle('Add Access Token:')
  console.log('To interact with Canvas, your script needs an access token.');
  console.log('- How to generate one:');
  console.log('   1. In Canvas, click: your picture (top left)');
  console.log('   2. Click "Settings"');
  console.log('   3. Click "+ New Access Token"');
  console.log('- You can always change this token by editing config/accessToken.txt');
  console.log('');
  const accessToken = prompt('accessToken: ');
  if (!accessToken || accessToken.trim().length === 0) {
    print.fatalError('Invalid accessToken. Now quitting.');
  }

  // Canvas host
  print.subtitle('Add Canvas Host:');
  console.log('Which Canvas host should your app connect with by default?');
  console.log('Example: canvas.harvard.edu')
  console.log('');
  const canvasHost = prompt('canvasHost: ');
  if (!canvasHost || canvasHost.trim().length === 0) {
    print.fatalError('Invalid canvasHost. Now quitting.');
  }
  console.log('');

  // Ask before continuing
  print.subtitle('We are about to:');
  console.log('- Create/overwrite index.js');
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
  const numSteps = 6;
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
  const body = (
`const initCACCL = require('caccl/script');
const fs = require('fs');
const path = require('path');

// Import configuration files
const canvasDefaults = require('./config/canvasDefaults');

// Get access token
const accessTokenPath = path.join(__dirname, 'config', 'accessToken.js');
const accessToken = fs.readFileSync(accessTokenPath, 'utf-8');

// Initialize CACCL
const api = initCACCL({
  accessToken,
  canvasHost: canvasDefaults.canvasHost,
});

// TODO: Replace example content:
api.user.self.getProfile()
  .then((profile) => {
    console.log(\`Hi \${profile.name}, it's a pleasure to meet you.\`);
  })
  .catch((err) => {
    console.log('Oops! An error occurred!', err.message);
  });
`
  );
  fs.writeFileSync(path.join(currDir, 'index.js'), body, 'utf-8');

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
