module.exports = `

  type PermissionList {
    total: Int
    results: [Permission]
  }

  type Permission {
    id: ID!
    resource: String!
    role_id: ID!
    access: Boolean
    role: Role
  }
`