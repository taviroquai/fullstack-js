module.exports = `

  getResources(
    query: String
    limit: Int
    page: Int
  ): ResourceList

  getResourceById(id: ID!): Resource

`
