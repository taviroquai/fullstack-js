exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('resources').del()
    .then(function () {

      // Inserts seed entries
      return knex('resources').insert([
        {
          system: 'Query.getUsers',
          resolver: 'User'
        },
        {
          system: 'Query.getUserById',
          resolver: 'User'
        },
        {
          system: 'Query.getRoles',
          resolver: 'Role'
        },
        {
          system: 'Query.getRoleById',
          resolver: 'Role'
        },
        {
          system: 'Query.getResources',
          resolver: 'Resource'
        },
        {
          system: 'Query.getResourceById',
          resolver: 'Resource'
        },
        {
          system: 'Query.getHooks',
          resolver: 'Hook'
        },
        {
          system: 'Query.getHookById',
          resolver: 'Hook'
        },
        {
          system: 'Query.getPermissions',
          resolver: 'Permission'
        },
        {
          system: 'Query.getResourceHooks',
          resolver: 'ResourceHook'
        },
        {
          system: 'Query.getRoleHooks',
          resolver: 'RoleHook'
        },
        {
          system: 'Query.getRoleUsers',
          resolver: 'RoleUser'
        },
        {
          system: 'Mutation.createRole',
          resolver: 'Role'
        },
        {
          system: 'Mutation.updateRole',
          resolver: 'Role'
        },
        {
          system: 'Mutation.createUser',
          resolver: 'User'
        },
        {
          system: 'Mutation.updateUser',
          resolver: 'User'
        },
        {
          system: 'Mutation.uploadAvatar',
          resolver: 'User'
        },
        {
          system: 'Mutation.createResource',
          resolver: 'Resource'
        },
        {
          system: 'Mutation.updateResource',
          resolver: 'Resource'
        },
        {
          system: 'Mutation.createHook',
          resolver: 'Hook'
        },
        {
          system: 'Mutation.updateHook',
          resolver: 'Hook'
        },
        {
          system: 'Mutation.updatePermission',
          resolver: 'Permission'
        },
        {
          system: 'Mutation.updateResourceHook',
          resolver: 'ResourceHook'
        },
        {
          system: 'Mutation.updateRoleHook',
          resolver: 'RoleHook'
        },
        {
          system: 'Mutation.updateRoleUser',
          resolver: 'RoleUser'
        }
      ]);
    });
};
