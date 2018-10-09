module.exports = `

  type RoleHookList {
    total: Int
    results: [RoleHook]
  }

  type RoleHook {
    id: ID!
    hook_id: ID!
    role_id: ID!
    bypass: Boolean
    hook: Hook
    role: Role
  }
`