import gql from 'graphql-tag';

export const getPermissions = gql`
query getPermissions(
  $role_id: ID
  $resource_id: ID
  $access: Boolean
  $limit: Int
  $page: Int
) {
  getPermissions(
    role_id: $role_id
    resource_id: $resource_id
    access: $access
    limit: $limit
    page: $page
  ) {
    total
    results {
      id
      resource_id
      role_id
      access
      resource {
        id
        system
      }
      role {
        id
        label
      }
    }
  }
}`;

export const getPermissionById = gql`
query getPermissionById($id: ID!) {
  getPermissionById(id: $id) {
    id
    resource_id
    role_id
    access
  }
}`;

export const createPermission = gql`
mutation createPermission(
  $role_id: ID!
  $resource_id: ID!
  $access: Boolean!
) {
createPermission(
    role_id: $role_id
    resource_id: $resource_id
    access: $access
  ) {
    id
    resource_id
    role_id
    access
  }
}`;


export const updatePermission = gql`
mutation updatePermission(
  $id: ID!
  $role_id: ID!
  $resource_id: ID!
  $access: Boolean!
) {
  updatePermission(
    id: $id
    role_id: $role_id
    resource_id: $resource_id
    access: $access
  ) {
    id
    resource_id
    role_id
    access
  }
}`;
