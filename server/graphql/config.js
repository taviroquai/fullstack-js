const config = [
  {
    type: 'Query',
    paths: [
      { name: 'getAccessToken', resolver: 'User', after: ['afterExample'] },
      { name: 'getUsers', resolver: 'User', before: ['isAuthenticated'] },
      { name: 'getUserById', resolver: 'User', before: ['isAuthenticated'] }
    ]
  },
  {
    type: 'Mutation',
    paths: [
      { name: 'createUser', resolver: 'User', before: ['isAuthenticated'] },
      { name: 'updateUser', resolver: 'User', before: ['isAuthenticated'] },
      { name: 'uploadAvatar', resolver: 'User', before: ['isAuthenticated'] }
    ]
  }
];

module.exports = config;