import gql from 'graphql-tag';

export const getUsers = gql`
query getUsers {
    getUsers {
        id
        username
        email
        active
    }
}`;

export const getUserById = gql`
query getUserById($id: ID!) {
  getUserById(id: $id) {
    id
    username
    email
    active
    avatar
  }
}`;

export const createUser = gql`
mutation createUser(
    $username: String!
    $email: String!
    $password: String!
    $active: Boolean
  ) {
  createUser(
    username: $username
    email: $email
    password: $password
    active: $active
    ) {
        id
        username
        email
        active
        avatar
    }
}`;


export const updateUser = gql`
mutation updateUser(
    $id: ID!
    $username: String!
    $email: String!
    $password: String
    $active: Boolean
  ) {
    updateUser(
      id: $id
      username: $username
      email: $email
      password: $password
      active: $active
    ) {
        id
        username
        email
        active
        avatar
    }
}`;

export const uploadAvatar = gql`
mutation uploadAvatar(
  $id: ID!
  $file: Upload!
  ) {
    uploadAvatar(
      id: $id
      file: $file
    ) {
      filename
    }
}`;
