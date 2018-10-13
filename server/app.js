
// Require framework
const Framework = require('./core/Framework');

// Create instance
const app = new Framework();

// Add middleware (inc. Apollo server)
app.addMiddleware();

// Add module routes
app.addRoutes();

// Start app
app.start();
