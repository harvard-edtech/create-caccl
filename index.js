const promptSync = require('prompt-sync')();
const { execSync } = require('child_process');

/* eslint-disable no-console */

// Prep command executor
const exec = (command) => {
  return execSync(command, { stdio: 'inherit' });
};

// Import helpers
const print = require('./helpers/print');
const react = require('./app/react');
const ejs = require('./app/ejs');
const script = require('./script');
const getPackageJSON = require('./helpers/getPackageJSON');

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
  const packageJSON = getPackageJSON();
  if (!packageJSON) {
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
    const newPackageJSON = getPackageJSON();
    if (!newPackageJSON) {
      print.fatalError('NPM project initialization was cancelled. Now quitting.');
    }

    console.log('\n');
    console.log('Great! Now we can initialize CACCL.\n\n');
  }

  print.title('CACCL Init');
  console.log('\n');

  // Prompt for project type
  print.subtitle('Choose a CACCL project type:');
  console.log('1 - React + Express App');
  console.log('2 - Node.js Script');
  console.log('3 - EJS + Express Server-side App');
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
    return react(prompt);
  }
  if (
    type === '2'
    || type === 's'
    || type === 'node script'
    || type === 'node.js script'
    || type === 'nodejs script'
  ) {
    print.title('Initializing Node.js Script Project');
    console.log('\n');
    return script();
  }
  if (
    type === '3'
    || type === 'e'
    || type === 'ejs'
    || type === 'ejs+express'
  ) {
    print.title('Initializing EJS + Express Server-side App Project');
    console.log('\n');
    return ejs(prompt);
  }

  // Invalid type
  print.fatalError('Invalid project type');
};
