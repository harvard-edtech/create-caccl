const initCACCL = require('caccl/server');

// Import routes
const initRoutes = require('./routes');

// Initialize CACCL
const app = initCACCL();

// Set EJS as the view manager
app.set('view engine', 'ejs');

// Initialize routes
initRoutes(app);
