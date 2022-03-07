import fs from 'fs';

import print from './print';

/* eslint-disable no-console */

/**
 * Read a package.json file
 * @param filename 
 * @returns package json contents
 */
const getPackageJSON = (filename: string): { [k: string]: any } => {
  if (!fs.existsSync(filename)) {
    print.fatalError(`We expected ${filename} to exist but it did not. Fatal error. Now exiting.`);
  }

  // Read in current package.json fil
  try {
    const stringContents = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(stringContents);
  } catch (err) {
    print.fatalError('\nOops! Your package.json file seems to be corrupted. Please fix it before continuing');
  }
};

export default getPackageJSON;
