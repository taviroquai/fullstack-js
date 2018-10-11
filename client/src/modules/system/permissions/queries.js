import gql from 'graphql-tag';

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
