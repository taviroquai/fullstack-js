const schema = `
  type Query {
    
    getAccessToken(email: String!, password: String!): User 
    getUsers(query: String, limit: Int, offset: Int): UserList
    getUserById(id: ID!): User

    getRoles(query: String, limit: Int, offset: Int): RoleList
    getRoleById(id: ID!): Role
  
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
  }
  
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
`

module.exports = schema;