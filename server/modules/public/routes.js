const serve = require('koa-static');

/*
 * Routes loader
 */
module.exports = (app, router) => {

  // Serve static files in public directory
  app.use(serve('./public'));
}

