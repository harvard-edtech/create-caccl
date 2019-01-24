const initCACCL = require('caccl/server');
const ejs = require('ejs');
const path = require('path');

// Import routes
const initRoutes = require('./routes');

// Import configuration files
const developerCredentials = require('./config/developerCredentials');
const installationCredentials = require('./config/installationCredentials');
const canvasDefaults = require('./config/canvasDefaults');

// Use Canvas simulation if running dev
const canvasHost = (
  process.env.DEV
    ? 'localhost:8088'
    : canvasDefaults.canvasHost
);

// Initialize CACCL
const app = initCACCL({
  developerCredentials,
  installationCredentials,
  canvasHost,
  port: process.env.PORT || 443,
});

// Set EJS as the view manager
app.set('view engine', 'ejs');

// Initialize routes
initRoutes(app);
