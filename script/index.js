// Initializer script for Node.js Scripts

const basic = require('./basic');
const smart = require('./smart');

const print = require('../print');

module.exports = (prompt, packageJSON) => {
  /*------------------------------------------------------------------------*/
  /*                           Ask for script type                          */
  /*------------------------------------------------------------------------*/

  print.subtitle('Choose a script type:');
  console.log('1 - Basic: credentials stored in config and must be changed manually');
  console.log('2 - Smart: script asks user for credentials, verifies user\'s identity, and automatically stores credentials in config');
  console.log('');
  const type = prompt('type: ');
  if (type !== '1' && type !== '2') {
    print.fatalError('Invalid type. Now quitting.');
  }
  const isBasic = (type === '1');

  console.log('\n');
  if (isBasic) {
    return basic(prompt, packageJSON);
  } else {
    return smart(prompt, packageJSON);
  }
};