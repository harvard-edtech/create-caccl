const fs = require('fs');

module.exports = (path, dest) => {
  const body = fs.readFileSync(path, 'utf-8');
  fs.writeFileSync(dest, body, 'utf-8');
};
