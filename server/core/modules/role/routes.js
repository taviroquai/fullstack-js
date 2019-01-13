const fs = require('fs');
const Authorization = use('core/Authorization');

/*
 * Routes loader
 */
module.exports = (app, router) => {

  // Get cached permissions
  router.get('/core/authorization', async (ctx, next) => {
    const data = {};
    let filename = '';

    // Get permissions
    filename = Authorization.getCacheFilename('permissions');
    data['permissions'] = JSON.parse(fs.readFileSync(filename));
    
    // Get resource hooks
    filename = Authorization.getCacheFilename('resourcehooks');
    data['resourcehooks'] = JSON.parse(fs.readFileSync(filename));
    
    // Get role hooks
    filename = Authorization.getCacheFilename('rolehooks');
    data['rolehooks'] = JSON.parse(fs.readFileSync(filename));
    
    // Set response
    ctx.set('Access-Control-Allow-Headers', 'content-type');
    ctx.set('Access-Control-Allow-Methods', 'GET');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.response.type = 'json';
    ctx.body = JSON.stringify(data);
  });
}
