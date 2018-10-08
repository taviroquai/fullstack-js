exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('resources').del()
    .then(function () {

      // Inserts seed entries
      return knex('resources').insert([
        {
          id: 1,
          system: 'Query.getRoles',
          resolver: 'Role'
        },
        {
          id: 2,
          system: 'Query.getRoleById',
          resolver: 'Role'
        },
        {
          id: 3,
          system: 'Mutation.createRole',
          resolver: 'Role'
        },
        {
          id: 4,
          system: 'Mutation.updateRole',
          resolver: 'Role'
        },
        {
          id: 5,
          system: 'Query.getUsers',
          resolver: 'User'
        },
        {
          id: 6,
          system: 'Query.getUserById',
          resolver: 'User'
        },
        {
          id: 7,
          system: 'Mutation.createUser',
          resolver: 'User'
        },
        {
          id: 8,
          system: 'Mutation.updateUser',
          resolver: 'User'
        },
        {
          id: 9,
          system: 'Mutation.uploadAvatar',
          resolver: 'User'
        },
        {
          id: 10,
          system: 'Mutation.changeUserRole',
          resolver: 'User'
        },
        {
          id: 11,
          system: 'Query.getRoleUsers',
          resolver: 'Role'
        }
      ]);
    });
};
