const fs = require('fs');
const promptSync = require('prompt-sync')();
const print = require('./print');

const react = require('./react');
const currDir = process.env.PWD;

const prompt = (title, notRequired) => {
  const val = promptSync(title);
  if (val === null || (!notRequired && !val)) {
    process.exit(0);
  }
  return val;
};

print.savePrompt(prompt);

module.exports = () => {
  // Check if the current directory is an NPM project
  const packageFilename = path.join(currDir, 'package.json');
  if (!fs.existsSync(packageFilename)) {
    console.log('\nOops! This is not an NPM project.\n');
    console.log('If you\'re sure you\'re in the right directory, run "npm init" to initialize your project first.\n');
    process.exit(0);
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
  console.log('');
  const type = prompt('project type: ');

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
  } else {
    // Invalid type
    print.fatalError('Invalid project type');
  }
};
