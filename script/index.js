// Initializer script for Node.js Scripts

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import helpers
const copyTo = require('../helpers/copyTo');
const print = require('../helpers/print');
const getPackageJSON = require('../helpers/getPackageJSON');
const writePackageJSON = require('../helpers/writePackageJSON');

const exec = (command, verbose) => {
  return execSync(command, (
    verbose
      ? { stdio: 'inherit' }
      : undefined
  ));
};

const currDir = process.env.PWD;

module.exports = () => {
  /*------------------------------------------------------------------------*/
  /*                               Preparation                              */
  /*------------------------------------------------------------------------*/

  /* eslint-disable no-console */

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

  // 2. Installing caccl
  stepTitle('Installing CACCL');
  exec('npm i --save caccl', true);

  // 3. Installing other dependencies
  stepTitle('Installing other dependencies');
  exec('npm i --save fs prompt-sync', true);

  // 4. Adding scripts
  stepTitle('Adding scripts to package.json');
  const newPackageJSON = getPackageJSON();
  if (!newPackageJSON.scripts) {
    newPackageJSON.scripts = {};
  }
  newPackageJSON.main = 'index.js';
  newPackageJSON.scripts.start = 'node index.js';
  writePackageJSON(newPackageJSON);

  // 5. Create helpers
  stepTitle('Creating helpers/');
  exec('mkdir -p helpers');

  // Create scripts
  copyTo(
    path.join(__dirname, 'files', 'helpers', 'getCredentials.js'),
    path.join(currDir, 'helpers', 'getCredentials.js')
  );
  copyTo(
    path.join(__dirname, 'files', 'helpers', 'print.js'),
    path.join(currDir, 'helpers', 'print.js')
  );
  copyTo(
    path.join(__dirname, 'files', 'helpers', 'prompt.js'),
    path.join(currDir, 'helpers', 'prompt.js')
  );

  // 6. Create index.js
  stepTitle('Creating index.js');
  copyTo(
    path.join(__dirname, 'files', 'index.js'),
    path.join(currDir, 'index.js')
  );

  // 7. Create script.js
  stepTitle('Creating script.js');
  copyTo(
    path.join(__dirname, 'files', 'script.js'),
    path.join(currDir, 'script.js')
  );

  // Print finish message
  console.log('\n\n');
  print.title('Done! Node.js Basic Script Project Created');
  console.log('\n');

  print.subtitle('Editing your script:');
  console.log('- Edit script.js');
  console.log('- Visit the caccl-api project on npm for api documentation');
  console.log('');

  print.subtitle('Running your script:');
  console.log('From the root directory of your project, run: "npm start"');
  console.log('');

  console.log('Try running "npm start"! Enjoy!');
};
