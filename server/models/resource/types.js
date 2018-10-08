module.exports = `

  type ResourceList {
    total: Int
    results: [Resource]
  }

  type Resource {
    id: ID!
    system: String
    resolver: String
  }
`