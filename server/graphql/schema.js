const schema = `
  type Query {
    
    getAccessToken(email: String!, password: String!): User 
    getUsers(query: String, limit: Int, offset: Int): UserList
    getUserById(id: ID!): User

    getRoles(query: String, limit: Int, offset: Int): RoleList
    getRoleById(id: ID!): Role
    getRoleUsers(id: ID!): [User]

    getResources(query: String, limit: Int, offset: Int): ResourceList
    getResourceById(id: ID!): Resource
    getResourceHooks(id: ID!): [ResourceHook]

    getHooks(query: String, limit: Int, offset: Int): HookList
    getHookById(id: ID!): Hook

    getPermissions(
      resource_id: ID
      role_id: ID
      access: Boolean
      limit: Int
      page: Int
    ): PermissionList
    getPermissionById(id: ID!): Permission
  
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

    uploadAvatar(id: ID!, file: Upload!): File!
    
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

    changeUserRole(id: ID!, role_id: ID): Boolean

    createResource(
      system: String!
      resolver: String!
    ): Resource
    
    updateResource(
      id: ID!
      system: String!
      resolver: String!
    ): Resource

    changeHookResource(
      id: ID!
      resource_id: ID!
      active: Boolean!
      order: Int!
    ): Boolean

    createHook(
      system: String!
    ): Resource
    
    updateHook(
      id: ID!
      system: String!
    ): Resource

    createPermission(
      resource_id: ID!
      role_id: ID!
      access: Boolean!
    ): Permission
    
    updatePermission(
      id: ID!
      resource_id: ID!
      role_id: ID!
      access: Boolean!
    ): Permission
  }
  
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
`

module.exports = schema;