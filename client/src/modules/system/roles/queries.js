import gql from 'graphql-tag';

export const getRoles = gql`
query getRoles {
  getRoles {
    total
    results {
      id
      label
      system
    }
  }
}`;

export const getRoleById = gql`
query getRoleById($id: ID!) {
  getRoleById(id: $id) {
    id
    label
    system
  }
}`;

export const createRole = gql`
mutation createRole(
    $label: String!
    $system: String!
  ) {
  createRole(
    label: $label
    system: $system
    ) {
        id
        label
        system
    }
}`;


export const updateRole = gql`
mutation updateRole(
    $id: ID!
    $label: String!
    $system: String!
  ) {
    updateRole(
      id: $id
      label: $label
      system: $system
    ) {
        id
        label
        system
    }
}`;

export const getRoleUsers = gql`
query getRoleUsers($id: ID!) {
  getRoleUsers(id: $id) {
    id
    username
    role_id
  }
}`;

export const getRoleHooks = gql`
query getRoleHooks(
  $hook_id: ID
  $role_id: ID
  $bypass: Boolean
  $limit: Int
  $page: Int
) {
  getRoleHooks(
    role_id: $role_id
    hook_id: $hook_id
    bypass: $bypass
    limit: $limit
    page: $page
  ) {
    total
    results {
      id
      role_id
      hook_id
      bypass
      role {
        id
        label
      }
      hook {
        id
        system
      }
    }
  }
}`;
