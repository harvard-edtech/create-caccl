// Initializer script for Node.js Scripts

const basic = require('./basic');
const smart = require('./smart');

const print = require('../helpers/print');

module.exports = (prompt, packageJSON) => {
  /*------------------------------------------------------------------------*/
  /*                           Ask for script type                          */
  /*------------------------------------------------------------------------*/

  print.subtitle('Choose a script type:');
  console.log('\n1 - Basic: user manually adds their credentials to a config file');
  console.log('\n2 - Smart: wizard walks user through the process:');
  console.log('    - First launch: we help user get credentials and we store them in config');
  console.log('    - Subsequent launches: user verifies or changes their stored credentials');
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
