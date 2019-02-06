// Initializer script for Node.js Scripts

const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

// Import helpers
const copyTo = require('../helpers/copyTo');
const print = require('../helpers/print');

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

  // Ask before continuing
  console.log('\n');
  print.subtitle('We are about to:');
  console.log('- Create/overwrite index.js');
  console.log('- Create/overwrite script.js');
  console.log('- Create a helpers/ folder and populate it with files:');
  console.log('   > "getCredentials.js"');
  console.log('   > "print.js"');
  console.log('   > "prompt.js"');
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

  // 5. Create helpers
  stepTitle('Creating helpers/');
  exec('mkdir -p helpers');

  // Create scripts
  copyTo(
    path.join(__dirname, 'smartFiles', 'getCredentials.js'),
    path.join(currDir, 'helpers', 'getCredentials.js')
  );
  copyTo(
    path.join(__dirname, 'smartFiles', 'print.js'),
    path.join(currDir, 'helpers', 'print.js')
  );
  copyTo(
    path.join(__dirname, 'smartFiles', 'prompt.js'),
    path.join(currDir, 'helpers', 'prompt.js')
  );

  // 6. Create index.js
  stepTitle('Creating index.js')
  copyTo(
    path.join(__dirname, 'smartFiles', 'index.js'),
    path.join(currDir, 'index.js')
  );

  // 7. Create script.js
  stepTitle('Creating script.js')
  copyTo(
    path.join(__dirname, 'smartFiles', 'script.js'),
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
