import gql from 'graphql-tag';

export const getHooks = gql`
query getHooks {
  getHooks {
    total
    results {
      id
      system
    }
  }
}`;

export const getHookById = gql`
query getHookById($id: ID!) {
  getHookById(id: $id) {
    id
    system
  }
}`;

export const createHook = gql`
mutation createHook(
    $system: String!
  ) {
  createHook(
    system: $system
    ) {
        id
        system
    }
}`;


export const updateHook = gql`
mutation updateHook(
    $id: ID!
    $system: String!
  ) {
    updateHook(
      id: $id
      system: $system
    ) {
        id
        system
    }
}`;

export const changeHookResource = gql`
mutation changeHookResource(
    $id: ID!
    $resource_id: ID!
    $active: Boolean!
    $order: Int!
  ) {
    changeHookResource(
      id: $id
      resource_id: $resource_id
      active: $active
      order: $order
    )
}`;

export const updateRoleHook = gql`
mutation updateRoleHook(
  $id: ID!
  $role_id: ID!
  $hook_id: ID!
  $bypass: Boolean!
) {
  updateRoleHook(
    id: $id
    role_id: $role_id
    hook_id: $hook_id
    bypass: $bypass
  ) {
    id
    role_id
    hook_id
    bypass 
  }
}`;
