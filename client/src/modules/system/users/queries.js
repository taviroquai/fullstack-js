import gql from 'graphql-tag';

export const getUsers = gql`
query getUsers {
  getUsers {
    total
    results {
      id
      username
      email
      active
    }
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
    $password_confirm: String!
    $active: Boolean
  ) {
  createUser(
    username: $username
    email: $email
    password: $password
    password_confirm: $password_confirm
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
    $password_confirm: String
    $active: Boolean
  ) {
    updateUser(
      id: $id
      username: $username
      email: $email
      password: $password
      password_confirm: $password_confirm
      active: $active
    ) {
        id
        username
        email
        active
        avatar
    }
}`;

export const changeUserRole = gql`
mutation changeUserRole(
    $id: ID!
    $role_id: ID
  ) {
    changeUserRole(
      id: $id
      role_id: $role_id
    )
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

export const getRoleUsers = gql`
query getRoleUsers(
  $user_id: ID
  $role_id: ID
  $active: Boolean
  $limit: Int
  $page: Int
) {
  getRoleUsers(
    role_id: $role_id
    user_id: $user_id
    active: $active
    limit: $limit
    page: $page
  ) {
    total
    results {
      id
      role_id
      user_id
      active
      role {
        id
        label
      }
      user {
        id
        username
      }
    }
  }
}`;

export const updateRoleUser = gql`
mutation updateRoleUser(
  $id: ID!
  $role_id: ID!
  $user_id: ID!
  $active: Boolean!
) {
  updateRoleUser(
    id: $id
    role_id: $role_id
    user_id: $user_id
    active: $active
  )
}`;
