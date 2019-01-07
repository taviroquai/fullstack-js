// Load enviroment variables
require('dotenv').config();

// Require framework
const Framework = require('./core/Framework');
const fw = new Framework();

// Create HTTP Server
fw.getHTTPSServer();

// Get app
const app = fw.getKoa();

// Load middleware (inc. Apollo server)
const middleware = fw.requireMiddleware();
for (let name in middleware) middleware[name](app);

// Add module routes
const router = fw.getHTTPRouter();
fw.addRoutes(app, router);

// Start app
const port = process.env.FSTACK_HTTP_PORT || 4000;
app.listen({ port }, () =>
  console.log('Server ready at http://localhost:' + port),
);
