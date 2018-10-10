module.exports = `

  type ResourceHookList {
    total: Int
    results: [ResourceHook]
  }

  type ResourceHook {
    id: ID!
    hook_id: ID!
    resource_id: ID!
    active: Boolean
    type: String
    order: Int
    hook: Hook
    resource: Resource
  }
`
