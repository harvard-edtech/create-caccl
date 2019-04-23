/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

// Create helpers and contstants
const currDir = process.env.PWD;
const packageFilename = path.join(currDir, 'package.json');

module.exports = (contents) => {
  // Write to package.json
  try {
    const jsonContents = JSON.stringify(contents, null, '\t');
    fs.writeFileSync(packageFilename, jsonContents, 'utf-8');
  } catch (err) {
    console.log('\nOops! We ran into an error while writing to your package.json file. Now quitting.');
    console.log(err.message);
    process.exit(0);
  }
};
