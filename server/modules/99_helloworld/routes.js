const HelloWorld = require('./HelloWorld');

/*
 * Routes loader
 */
module.exports = (app, router) => {

  /**
   * To do something only with Koa and not Graphql
   */
  router.get('/hello/:name', async (ctx, next) => {
    ctx.body = 'Hello ' + name;
  });
}
