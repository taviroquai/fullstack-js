const schema = `
  type Query {
    
    getAccessToken(email: String!, password: String!): User
    
    getUsers: [User]
    
    getUserById(id: ID!): User
  
  }

  type Mutation {

    uploadAvatar(id: ID!, file: Upload!): File!
    
    createUser(
      username: String!
      email: String!
      password: String!
      active: Boolean
    ): User
    
    updateUser(
      id: ID!
      username: String!
      email: String!
      password: String
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