// Load enviroment variables
require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const ModuleManager = require('./ModuleManager');
const GraphqlServer = require('./GraphqlServer');

// Create koa app
const app = new Koa();

// Load and use middleware
const middleware = ModuleManager.loadMiddleware();
for (let name in middleware) app.use(middleware[name]);

// Use apollo server middleware
const apolloServer = GraphqlServer.getApolloServer(); 
apolloServer.applyMiddleware({ app });

// Load routes
const router = new Router();
const routes = ModuleManager.loadRoutes();
for (let name in routes) routes[name](app, router);
app.use(router.routes()).use(router.allowedMethods());

// Finally, listen to HTTP
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`),
);
