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
