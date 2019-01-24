// Import modules
const fs = require('fs');
const path = require('path');
const initCACCL = require('caccl/script');

// Import helpers
const prompt = require('./prompt');
const print = require('./print');

module.exports = () => {
  // Create config folder if it doesn't exist
  const configFolder = path.join(__dirname, '..', 'config');
  if (!fs.existsSync(configFolder)) {
    fs.mkdirSync(configFolder);
  }

  // Attempt to read in canvas host
  const hostConfigFilename = path.join(
    __dirname,
    '..',
    'config',
    'canvasHost.txt'
  );
  const savedCanvasHost = (
    fs.existsSync(hostConfigFilename)
      ? fs.readFileSync(hostConfigFilename, 'utf-8')
      : null
  );

  // Verify saved Canvas host (if applicable)
  if (savedCanvasHost && savedCanvasHost.trim().length > 0) {
    // Verify with user
    print.subtitle(`Is ${savedCanvasHost} your Canvas host?`);
    console.log('If this looks right, press enter.');
    console.log(`If ${savedCanvasHost} isn't your Canvas host, type "n" then press enter.`);
    const option = prompt('').trim();
    if (option !== 'n') {
      return savedCanvasHost;
    }
  }

  // Need to ask user for a Canvas host
  while (true) {
    console.log('\n\n');
    print.title('Enter a Canvas Host');
    print.centered('example: canvas.harvard.edu');
    console.log('');
    const canvasHost = prompt('canvasHost: ').trim();

    // Show error if no host was given
    if (canvasHost.length === 0) {
      console.log('\n');
      print.error('That host doesn\'t look valid. Try again.');
    } else {
      // Valid host! Save and return
      fs.writeFileSync(hostConfigFilename, canvasHost, 'utf-8');
      return canvasHost;
    }
  }
};
