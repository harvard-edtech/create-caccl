/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

// Create helpers and contstants
const currDir = process.env.PWD;
const packageFilename = path.join(currDir, 'package.json');

module.exports = () => {
  if (!fs.existsSync(packageFilename)) {
    return null;
  }

  // Read in current package.json fil
  try {
    const stringContents = fs.readFileSync(packageFilename, 'utf-8');
    return JSON.parse(stringContents);
  } catch (err) {
    console.log('\nOops! Your package.json file seems to be corrupted. Please fix it before continuing');
    process.exit(0);
  }
};
