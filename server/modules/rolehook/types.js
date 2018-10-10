module.exports = `

  type RoleHookList {
    total: Int
    results: [RoleHook]
  }

  type RoleHook {
    id: ID!
    hook: String!
    role_id: ID!
    bypass: Boolean
    role: Role
  }
`