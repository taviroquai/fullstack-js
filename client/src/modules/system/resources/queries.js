import gql from 'graphql-tag';

export const getResources = gql`
query getResources($query: String) {
  getResources(query: $query) {
    total
    results
  }
}`;

export const getResourceHooks = gql`
query getResourceHooks(
  $hook: String
  $resource: String
  $active: Boolean
  $limit: Int
  $page: Int
) {
  getResourceHooks(
    resource: $resource
    hook: $hook
    active: $active
    limit: $limit
    page: $page
  ) {
    total
    results {
      id
      resource
      hook
      active
      order
    }
  }
}`;

export const updateResourceHook = gql`
mutation updateResourceHook(
    $id: ID!
    $resource: String!
    $hook: String!
    $active: Boolean!
    $order: Int!
  ) {
    updateResourceHook(
      id: $id
      resource: $resource
      hook: $hook
      active: $active
      order: $order
    )
}`;
