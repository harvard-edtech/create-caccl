// Initializer script for React apps
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Import helpers
const getAccessTokens = require('./getAccessTokens');
const print = require('./print');

// Set up bash command execution
const exec = (command, forwardStdio) => {
  return execSync(command, (
    forwardStdio
      ? { stdio: 'inherit' }
      : undefined
  ));
};

// Determine current working directory
const currDir = process.env.PWD;

/* eslint-disable no-console */

/* Walks user through process of setting up the development environment */
module.exports = (prompt) => {
  console.log('\n\n');
  print.title('Let\'s set up your dev environment.');
  console.log('');

  // Get course id
  print.subtitle('Do you have a sandbox Canvas course?');
  console.log('> If no, hit ctrl+c, get one from your Canvas admin, then re-run this tool');
  console.log('> If yes, paste the link to it below');
  console.log('Example: https://canvas.harvard.edu/courses/538209');
  console.log('');

  let courseId;
  let canvasHost;
  while (!courseId || !canvasHost) {
    const link = prompt('course link: ');
    try {
      const parts = link.split('/');
      canvasHost = parts[2];
      courseId = parseInt(parts[4], 10);
    } catch (err) {
      courseId = null;
      canvasHost = null;
      console.log('Invalid course link. Please try again\n');
    }
  }
  console.log('');

  // Get access token
  const accessTokens = getAccessTokens(prompt);

  const students = accessTokens.students.length > 0
    ? `'${accessTokens.students.join("','")}'` : '';
  const tas = accessTokens.tas.length > 0
    ? `'${accessTokens.tas.join("','")}'` : '';

  const devEnvironment = (
    'module.exports = {\n'
    + `  canvasHost: '${canvasHost}',\n`
    + `  courseId: '${courseId}',\n`
    + `  accessToken: '${accessTokens.instructor}',\n`
    + `  students: [${students}],\n`
    + `  tas: [${tas}],\n`
    + '};'
  );

  // Create config folder
  exec('mkdir -p config');

  // Write the dev environment to file
  fs.writeFileSync(
    path.join(currDir, 'config', 'devEnvironment.js'),
    devEnvironment,
    'utf-8'
  );

  console.log('\n\n');
  print.title('Done! Development Environment Set Up');
  console.log('\n');
};
