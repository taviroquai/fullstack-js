const config = [
  {
    type: 'Query',
    paths: [
      { name: 'getAccessToken', resolver: 'User' },
      { name: 'getUsers', resolver: 'User', before: ['isAuthenticated'] }
    ]
  }
];

module.exports = config;