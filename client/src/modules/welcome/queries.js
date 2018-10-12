import gql from 'graphql-tag';

export const getHello = gql`
query getHello(
  $name: String!
) {
  getHello(
    name: $name
  ) {
    name
  }
}`;
