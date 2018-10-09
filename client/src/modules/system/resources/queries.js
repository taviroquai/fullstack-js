import gql from 'graphql-tag';

export const getResources = gql`
query getResources($query: String) {
  getResources(query: $query) {
    total
    results {
      id
      system
      resolver
    }
  }
}`;

export const getResourceById = gql`
query getResourceById($id: ID!) {
  getResourceById(id: $id) {
    id
    system
    resolver
  }
}`;

export const createResource = gql`
mutation createResource(
    $system: String!
    $resolver: String!
  ) {
  createResource(
    system: $system
    resolver: $resolver
    ) {
        id
        system
        resolver
    }
}`;


export const updateResource = gql`
mutation updateResource(
    $id: ID!
    $system: String!
    $resolver: String!
  ) {
    updateResource(
      id: $id
      system: $system
      resolver: $resolver
    ) {
        id
        system
        resolver
    }
}`;

export const getResourceHooks = gql`
query getResourceHooks(
  $hook_id: ID
  $resource_id: ID
  $active: Boolean
  $limit: Int
  $page: Int
) {
  getResourceHooks(
    resource_id: $resource_id
    hook_id: $hook_id
    active: $active
    limit: $limit
    page: $page
  ) {
    total
    results {
      id
      resource_id
      hook_id
      active
      order
      resource {
        id
        system
      }
      hook {
        id
        system
      }
    }
  }
}`;

export const updateResourceHook = gql`
mutation updateResourceHook(
    $id: ID!
    $resource_id: ID!
    $hook_id: ID!
    $active: Boolean!
    $order: Int!
  ) {
    updateResourceHook(
      id: $id
      resource_id: $resource_id
      hook_id: $hook_id
      active: $active
      order: $order
    )
}`;
