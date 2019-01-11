const User = use('user/User');
const send = require('koa-send');

/*
 * Routes loader
 */
module.exports = (app, router) => {

  // Route to user avatar
  router.get('/avatar/:id/:filename', async (ctx, next) => {
    const { id, filename } = ctx.params;
    const path = User.getAvatarPath(id, filename);
    await send(ctx, path);
  });

}
