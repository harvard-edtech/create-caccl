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

  // Canvas host
  print.subtitle('Add Canvas Host:');
  console.log('Which Canvas host should your app connect with by default?');
  console.log('Example: canvas.harvard.edu')
  console.log('');
  const canvasHost = prompt('canvasHost (optional): ');

  // Ask before continuing
  console.log('\n');
  print.subtitle('We are about to:');
  console.log('- Create/overwrite index.js');
  console.log('- Create/overwrite script.js');
  console.log('- Create a helpers/ folder and populate it with files:');
  console.log('   > "getAccessToken.js"');
  console.log('   > "getCanvasHost.js"');
  console.log('   > "print.js"');
  console.log('   > "prompt.js"');
  console.log('- Create a config/ folder and populate it with files:');
  console.log('   > "canvasDefaults.js"');
  console.log('- Add config/ and node_modules/ to the .gitignore');
  console.log('- Add/replace npm scripts:');
  console.log('   > "start"');
  print.enterToContinue();

  if (fs.existsSync(path.join(currDir, 'script.js'))) {
    console.log('\nJust to reconfirm: we are going to *overwrite* your script.js file!');
    console.log('');
    print.enterToContinue();
  }

  if (fs.existsSync(path.join(currDir, 'init.js'))) {
    console.log('\nJust to reconfirm: we are going to *overwrite* your init.js file!');
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
  exec('npm i --save fs prompt-sync', true);

  // 4. Adding scripts
  stepTitle('Adding scripts to package.json');
  const newPackageData = packageJSON.data;
  if (!newPackageData.scripts) {
    newPackageData.scripts = {};
  }
  newPackageData.main = 'index.js';
  newPackageData.scripts.start = 'node index.js';
  fs.writeFileSync(packageJSON.filename, JSON.stringify(newPackageData, null, '\t'), 'utf-8');

  // 5. Create config files
  stepTitle('Adding config files');

  // Make a new config directory
  exec('mkdir -p config');

  // Create all config files
  [
    {
      filename: 'canvasHost.txt',
      data: canvasHost,
    },
  ].forEach((file) => {
    const filename = path.join(currDir, 'config', file.filename);
    fs.writeFileSync(filename, file.data, 'utf-8');
  });

  // 6. Create helpers
  stepTitle('Creating helpers/');
  exec('mkdir -p helpers');

  // Create scripts
  [
    {
      filename: 'getAccessToken.js',
      data: fs.readFileSync(
        path.join(__dirname, 'smartFiles', 'getAccessToken.js'),
        'utf-8'
      ),
    },
    {
      filename: 'getCanvasHost.js',
      data: fs.readFileSync(
        path.join(__dirname, 'smartFiles', 'getCanvasHost.js'),
        'utf-8'
      ),
    },
    {
      filename: 'print.js',
      data: fs.readFileSync(
        path.join(__dirname, 'smartFiles', 'print.js'),
        'utf-8'
      )
    },
    {
      filename: 'prompt.js',
      data: fs.readFileSync(
        path.join(__dirname, 'smartFiles', 'prompt.js'),
        'utf-8'
      )
    },
  ].forEach((file) => {
    const filename = path.join(currDir, 'helpers', file.filename);
    fs.writeFileSync(filename, file.data, 'utf-8');
  });

  // 7. Create init.js
  stepTitle('Creating index.js')
  const initBody = fs.readFileSync(
    path.join(__dirname, 'smartFiles', 'index.js'),
    'utf-8'
  );
  fs.writeFileSync(path.join(currDir, 'index.js'), initBody, 'utf-8');

  // 8. Create script.js
  stepTitle('Creating script.js')
  const scriptBody = fs.readFileSync(
    path.join(__dirname, 'smartFiles', 'script.js'),
    'utf-8'
  );
  fs.writeFileSync(path.join(currDir, 'script.js'), scriptBody, 'utf-8');

  // Print finish message
  console.log('\n\n');
  print.title('Done! Node.js Basic Script Project Created');
  console.log('\n');

  print.subtitle('Creating your script:');
  console.log('- Edit script.js');
  console.log('- Visit the caccl-api project on npm for api documentation');
  console.log('');

  print.subtitle('Running your script:');
  console.log('From the root directory of your project, run: "npm start"');
  console.log('');

  console.log('Try running "npm start"! Enjoy!');
};
