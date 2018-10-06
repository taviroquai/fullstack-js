const schema = `
  type Query {
    getAccessToken(username: String!, password: String!): User
    getUsers: [User]
  }
`

module.exports = schema;