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
