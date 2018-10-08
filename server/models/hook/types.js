module.exports = `

  type HookList {
    total: Int
    results: [Hook]
  }

  type Hook {
    id: ID!
    system: String
  }

  type ResourceHook {
    id: ID!
    system: String
    active: Boolean
    order: Int
  }
`