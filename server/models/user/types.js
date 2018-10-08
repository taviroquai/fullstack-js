module.exports = `

  type UserList {
    total: Int,
    results: [User]
  }

  type User {
    id: ID!
    username: String
    email: String
    authtoken: String
    active: Boolean
    avatar: String
    role_id: ID
  }
`