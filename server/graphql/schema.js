const schema = `
  type Query {

    getAccessToken(email: String!, password: String!): User
    getUsers(query: String, limit: Int, offset: Int): UserList
    getUserById(id: ID!): User

    getRoles(query: String, limit: Int, offset: Int): RoleList
    getRoleById(id: ID!): Role

    getResources(query: String, limit: Int, offset: Int): ResourceList
    getResourceById(id: ID!): Resource

    getHooks(query: String, limit: Int, offset: Int): HookList
    getHookById(id: ID!): Hook

    getPermissions(
      resource_id: ID
      role_id: ID
      access: Boolean
      limit: Int
      page: Int
    ): PermissionList

    getResourceHooks(
      resource_id: ID
      hook_id: ID
      active: Boolean
      type: String
      limit: Int
      page: Int
    ): ResourceHookList

    getRoleHooks(
      hook_id: ID
      role_id: ID
      bypass: Boolean
      limit: Int
      page: Int
    ): RoleHookList

    getRoleUsers(
      user_id: ID
      role_id: ID
      active: Boolean
      limit: Int
      page: Int
    ): RoleUserList

  }

  type Mutation {

    createRole(
      label: String!
      system: String!
    ): Role

    updateRole(
      id: ID!
      label: String!
      system: String!
    ): Role

    createUser(
      username: String!
      email: String!
      password: String!
      password_confirm: String!
      active: Boolean
    ): User

    updateUser(
      id: ID!
      username: String!
      email: String!
      password: String
      password_confirm: String
      active: Boolean
    ): User

    uploadAvatar(id: ID!, file: Upload!): File!

    createResource(
      system: String!
    ): Resource

    updateResource(
      id: ID!
      system: String!
    ): Resource

    createHook(
      system: String!
    ): Resource

    updateHook(
      id: ID!
      system: String!
    ): Resource

    updatePermission(
      id: ID!
      resource_id: ID!
      role_id: ID!
      access: Boolean!
    ): Permission

    updateResourceHook(
      id: ID!
      resource_id: ID!
      hook_id: ID!
      active: Boolean!
      order: Int!
    ): Boolean

    updateRoleHook(
      id: ID!
      hook_id: ID!
      role_id: ID!
      bypass: Boolean!
    ): Boolean

    updateRoleUser(
      id: ID!
      user_id: ID!
      role_id: ID!
      active: Boolean!
    ): Boolean
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
`

module.exports = schema;
