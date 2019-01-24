// Initializer script for Node.js Scripts

const basic = require('./basic');
const smart = require('./smart');

const print = require('../helpers/print');

module.exports = (prompt, packageJSON) => {
  /*------------------------------------------------------------------------*/
  /*                           Ask for script type                          */
  /*------------------------------------------------------------------------*/

  print.subtitle('Choose a script type:');
  console.log('1 - Basic: credentials stored in config and must be changed manually');
  console.log('2 - Smart: wizard asks user for credentials on first launch, stores credentials, and confirms credentials on subsequent launches');
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
