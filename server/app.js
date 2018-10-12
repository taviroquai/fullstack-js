
// Require framework
const Framework = require('./core/Framework');

// Create instance
const app = new Framework();
app.addMiddleware();
app.addRoutes();

// Start app
app.start();
