module.exports = `

  type PermissionList {
    total: Int
    results: [Permission]
  }

  type Permission {
    id: ID!
    resource_id: ID!
    role_id: ID!
    access: Boolean
    resource: Resource
    role: Role
  }
`