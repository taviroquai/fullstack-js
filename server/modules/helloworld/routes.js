/**
 * To do something only with Koa and not Graphql
 */
const loader = (app, router) => {
  router.get('/hello/:name', async (ctx, next) => {
    ctx.body = 'Hello ' + ctx.params.name;
  });
}

/**
 * Exports resource, resolver and loader
 */
module.exports = loader;