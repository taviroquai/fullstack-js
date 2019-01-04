const serve = require('koa-static');

/*
 * Routes loader
 */
module.exports = (app, router) => {
  if (!app) return;

  // Serve static files in public directory
  app.use(serve('./public'));
}

