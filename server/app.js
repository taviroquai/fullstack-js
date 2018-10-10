// Load enviroment variables
require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const apolloServer = require('./graphql/server');

// Load models from enviroment
const modelsList = process.env.FSTACK_MODELS.split(',');

// Create koa app
const app = new Koa();

// Load middleware
const middlewareList = process.env.FSTACK_MIDDLEWARE.split(',');
const middleware = {};
for (let name of middlewareList) middleware[name] = require('./middleware/' + name);

// Apply middleware
for (let name in middleware) app.use(middleware[name]);
apolloServer.applyMiddleware({ app });

// Load routes
const router = new Router();
const routes = {};
for (let name of modelsList) routes[name] = require('./models/' + name + '/routes');
for (let name in routes) routes[name](app, router);
app.use(router.routes()).use(router.allowedMethods());

// Finally, listen to HTTP
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`),
);
