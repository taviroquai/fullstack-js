module.exports = `

  type HookList {
    total: Int
    results: [Hook]
  }

  type Hook {
    id: ID!
    system: String
  }
`
