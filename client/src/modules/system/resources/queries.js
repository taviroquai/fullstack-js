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
query getResourceHooks($id: ID!) {
  getResourceHooks(id: $id) {
    id
    system
    active
    order
  }
}`;