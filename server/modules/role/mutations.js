module.exports = `

  createRole(
    label: String!
    system: String!
  ): Role

  updateRole(
    id: ID!
    label: String!
    system: String!
  ): Role

`
