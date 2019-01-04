const errors = require('../core/errors.json');
const User = require('../modules/enabled/user/User');
const Authorization = require('./Authorization');

/**
 * Graphql authorization
 */
class GraphqlAuthorization {

  /**
   * Wraps the resolver around authorization resolver
   * 
   * @param {String} resource
   * @param {Function} resolver 
   */
  static authorize(resource, resolver) {
    const fn = async (root, args, context) => {

      // Check permissions
      const user = context.ctx.state.user;
      const roles = await User.getRoles(user);
      const denied = await Authorization.getAccessDenied(roles, resource);
      
      // Debug message
      if (process.env.FSTACK_DEBUG) console.log(
        'Authorize?',
        user ? user.username : user,
        roles.map(r => r.role.system).join(','),
        resource,
        !denied,
        '(' + context.ctx.request.ip + ')'
      );

      // Access denied
      if (!!denied) throw new Error(errors['001']);

      // Wrap hooks in sequence (before and after)
      args = await Authorization.runHooks(roles, resource, 'before', context, args);
      let data = await resolver(root, args, context);
      data = await Authorization.runHooks(roles, resource, 'after', context, data);
      return data;
    }
    return fn;
  }
}

module.exports = GraphqlAuthorization;
