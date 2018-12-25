// Load enviroment variables
require('dotenv').config();

// Require framework
const Framework = require('./core/Framework');

// Create instance
const fullstack = new Framework();

// Create HTTP Server
fullstack.getHTTPSServer();

// Get app
const app = fullstack.getKoa();

// Load middleware (inc. Apollo server)
const middleware = fullstack.requireMiddleware();
for (let name in middleware) middleware[name](app);

// Add module routes
const router = fullstack.getHTTPRouter();
fullstack.addRoutes(app, router);

// Start app
const port = process.env.FSTACK_HTTP_PORT || 4000;
app.listen({ port }, () =>
  console.log('Server ready at http://localhost:' + port),
);
