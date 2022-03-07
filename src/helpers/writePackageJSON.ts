import fs from 'fs';

import print from './print';

/* eslint-disable no-console */

/**
 * Write a package json file
 * @author Gabe Abrams
 * @param filename filename for the package.json
 * @param contents contents of the package.json
 */
const writePackageJSON = (filename: string, contents: any) => {
  // Write to package.json
  try {
    const jsonContents = JSON.stringify(contents, null, '\t');
    fs.writeFileSync(filename, jsonContents, 'utf-8');
  } catch (err) {
    console.log(err);
    print.fatalError('\nOops! We ran into an error while writing to your package.json file. Now quitting.');
  }
};

export default writePackageJSON;
