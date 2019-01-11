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

export const getRoleHooks = gql`
query getRoleHooks(
  $hook: String
  $role_id: ID
  $bypass: Boolean
  $limit: Int
  $page: Int
) {
  getRoleHooks(
    role_id: $role_id
    hook: $hook
    bypass: $bypass
    limit: $limit
    page: $page
  ) {
    total
    results {
      id
      role_id
      hook
      bypass
      role {
        id
        label
      }
    }
  }
}`;

export const updateRoleHook = gql`
mutation updateRoleHook(
  $id: ID!
  $role_id: ID!
  $hook: String!
  $bypass: Boolean!
) {
  updateRoleHook(
    id: $id
    role_id: $role_id
    hook: $hook
    bypass: $bypass
  )
}`;

export const getPermissions = gql`
query getPermissions(
  $role_id: ID
  $resource: String
  $access: Boolean
  $limit: Int
  $page: Int
) {
  getPermissions(
    role_id: $role_id
    resource: $resource
    access: $access
    limit: $limit
    page: $page
  ) {
    total
    results {
      id
      resource
      role_id
      access
      role {
        id
        label
      }
    }
  }
}`;

export const updatePermission = gql`
mutation updatePermission(
  $id: ID!
  $role_id: ID!
  $resource: String!
  $access: Boolean!
) {
  updatePermission(
    id: $id
    role_id: $role_id
    resource: $resource
    access: $access
  ) {
    id
    resource
    role_id
    access
  }
}`;
