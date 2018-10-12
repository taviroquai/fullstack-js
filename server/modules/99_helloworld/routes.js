const HelloWorld = require('./HelloWorld');

/*
 * Routes loader
 */
module.exports = (app, router) => {

  /**
   * You may want to do something using only Koa and not Graphql...
   */
  router.get('/hello/:name', async (ctx, next) => {
    ctx.body = 'Hello ' + name;
  });
}
