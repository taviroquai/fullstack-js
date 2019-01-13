const Role = require('./Role');
const RoleHook = require('./RoleHook');
const RoleUser = require('./RoleUser');
const Permission = require('./Permission');
const errors = use('core/errors.json');

/**
 * Graphql resolvers
 */
const resolvers = {
  Query: {

    /**
     * Get roles list
     */
    getRoles: async (root, args, context) => {
      const query = Role.query();
      const limit = args.limit || 25;
      const page = args.page || 0;

      // Filter by query
      if (args.query) {
        query.where('label', 'ilike', '%' + args.query + '%')
      }

      // Get results
      const result = await query.page(page, limit);
      return result;
    },

    /**
     * Get role by id
     */
    getRoleById: async (root, args, context) => {
      const role = await Role.query().findById(args.id);
      if (!role) throw new Error(errors['010']);
      return role;
    },

    /**
     * Get permissions list
     */
    getPermissions: async (root, args, context) => {
      const query = Permission.query();
      const limit = args.limit || 999;
      const page = args.page || 0;

      // Load relations
      query.eager('role');

      // Filter by role
      if (args.role_id) query.where('role_id', args.role_id)

      // Filter by resource
      if (args.resource) query.where('resource', args.resource)

      // Filter by access
      if (args.access) {
        query.where('access', args.access)
      }

      // Order
      query.orderBy('id', 'desc')

      // Get results
      const result = await query.page(page, limit);
      return result;
    },

    /**
     * Get rolehooks list
     */
    getRoleHooks: async (root, args, context) => {
      const query = RoleHook.query();
      const limit = args.limit || 999;
      const page = args.page || 0;

      // Load relations
      query.eager('role');

      // Filter by role
      if (args.role_id) query.where('role_id', args.role_id)

      // Filter by hook
      if (args.hook) query.where('hook', args.hook)

      // Filter by bypass
      if (args.bypass) query.where('bypass', args.bypass)

      // Order
      query.orderBy('id', 'desc')

      // Get results
      const result = await query.page(page, limit);
      return result;
    },

    /**
     * Get roleusers list
     */
    getRoleUsers: async (root, args, context) => {
      const query = RoleUser.query();
      const limit = args.limit || 999;
      const page = args.page || 0;

      // Load relations
      query.eager('[role, user]');

      // Filter by role
      if (args.role_id) query.where('role_id', args.role_id)

      // Filter by user
      if (args.user_id) query.where('user_id', args.user_id)

      // Filter by bypass
      if (args.active) query.where('active', args.active)

      // Order
      query.orderBy('id', 'desc')

      // Get results
      const result = await query.page(page, limit);
      return result;
    }
  },

  Mutation: {

    /**
     * Create role
     */
    createRole: async (root, args, context) => {
      const data = Role.filterInput(args);
      const role = await Role.query()
        .insert(data)
        .returning('id');
      return await Role.query().findById(role.id);
    },

    /**
     * Update role
     */
    updateRole: async (root, args, context) => {
      const data = Role.filterInput(args);
      await Role.query()
        .update(data)
        .where('id', args.id)
      return await Role.query().findById(args.id);
    },

    /**
     * Update permission
     */
    updatePermission: async (root, args, context) => {
      await Permission.query()
        .update({ access: args.access })
        .where('id', args.id)
      return await Permission.query().findById(args.id);
    },

    /**
     * Update rolehook
     */
    updateRoleHook: async (root, args, context) => {
      await RoleHook.query()
        .patch({ bypass: args.bypass })
        .where('id', args.id)
      return true;
    },

    /**
     * Update role user
     */
    updateRoleUser: async (root, args, context) => {
      await RoleUser.query()
        .update(args)
        .where('id', args.id);
      return true
    }
  }
}

module.exports = resolvers;
