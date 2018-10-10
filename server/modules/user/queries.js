module.exports = `

  getAccessToken(
    email: String!
    password: String!
  ): User

  getUsers(
    query: String
    limit: Int,
    page: Int
  ): UserList

  getUserById(id: ID!): User

`
