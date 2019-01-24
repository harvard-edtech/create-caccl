const fs = require('fs');
const path = require('path');
const promptSync = require('prompt-sync')();
const execSync = require('child_process').execSync;

// Prep command executor
const exec = (command) => {
  return execSync(command, {stdio: 'inherit'});
};

// Import helpers
const print = require('./print');
const react = require('./app/react');
const ejs = require('./app/ejs');
const script = require('./script');

// Create helpers and contstants
const currDir = process.env.PWD;

const prompt = (title, notRequired) => {
  const val = promptSync(title);
  if (val === null || (!notRequired && !val)) {
    process.exit(0);
  }
  return val;
};
print.savePrompt(prompt);

// Initializer script
module.exports = () => {
  // Check if the current directory is an NPM project
  const packageFilename = path.join(currDir, 'package.json');
  if (!fs.existsSync(packageFilename)) {
    // Initialize npm project
    print.title('Initialize NPM Project');
    console.log('');
    console.log('Before initializing CACCL, you need to initialize your npm project.');
    console.log('');
    print.enterToContinue();
    console.log('');
    console.log('NPM Project Init Wizard:');
    console.log('');

    try {
      exec('npm init');
    } catch (err) {
      // Fail if initialization was aborted
      print.fatalError('NPM project initialization was unsuccessful. Now quitting.');
    }

    // Fail if wizard was quit
    if (!fs.existsSync(packageFilename)) {
      print.fatalError('NPM project initialization was cancelled. Now quitting.');
    }

    console.log('\n');
    console.log('Great! Now we can initialize CACCL.\n\n');
  }

  // Read in current package.json file
  const packageStringContents = fs.readFileSync(packageFilename, 'utf-8');
  let packageJSONData;
  try {
    packageJSONData = JSON.parse(packageStringContents);
  } catch (err) {
    console.log('\nOops! Your package.json file seems to be corrupted. Please fix it before continuing');
    process.exit(0);
  }
  const packageJSON = {
    data: packageJSONData,
    filename: packageFilename,
  };

  print.title('CACCL Init');
  console.log('\n');

  // Prompt for project type
  print.subtitle('Choose a CACCL project type:');
  console.log('1 - React + Express');
  console.log('2 - Node.js Script');
  console.log('3 - EJS + Express server-side app');
  console.log('');
  const type = prompt('project type: ').toLowerCase();

  // Handle each type appropriately
  console.log('\n\n');
  if (
    type === '1'
    || type === 'react'
    || type === 'r'
    || type === 'react+express'
    || type === 'react + express'
  ) {
    print.title('Initializing CACCL React + Express Project');
    console.log('\n');
    return react(prompt, packageJSON);
  } else if (
    type === '2'
    || type === 's'
    || type === 'node script'
    || type === 'node.js script'
    || type === 'nodejs script'
  ) {
    print.title('Initializing Node.js Script Project');
    console.log('\n');
    return script(prompt, packageJSON);
  } else if (
    type === '3'
    || type === 'e'
    || type === 'ejs'
    || type === 'ejs+express'
  ) {
    print.title('Initializing EJS + Express server-side app project');
    console.log('\n');
    return ejs(prompt, packageJSON);
  } else {
    // Invalid type
    print.fatalError('Invalid project type');
  }
};
