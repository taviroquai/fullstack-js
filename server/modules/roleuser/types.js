module.exports = `

  type RoleUserList {
    total: Int
    results: [RoleUser]
  }

  type RoleUser {
    id: ID!
    user_id: ID!
    role_id: ID!
    active: Boolean
    user: User
    role: Role
  }
`
