const Koa = require('koa');
const send = require('koa-send');
const Router = require('koa-router');
const apolloServer = require('./graphql/server');
const User = require('./models/user/User');

// Create koa app
const app = new Koa();

// Apply Apollo middleware
apolloServer.applyMiddleware({ app });

// Add non-Apollo routes
const router = new Router();
router.get('/avatar/:id/:filename', async (ctx, next) => {
  const { id, filename } = ctx.params;
  const path = User.getAvatarPath(id, filename);
  await send(ctx, path);
});
app.use(router.routes()).use(router.allowedMethods());

// Finally, listen to HTTP
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`),
);
