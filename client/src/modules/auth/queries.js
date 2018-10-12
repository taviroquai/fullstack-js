import gql from 'graphql-tag';

export const getAccessToken = gql`
query getAccessToken($email: String!, $password: String!) {
    getAccessToken(email: $email, password: $password) {
        id
        username
        email
        authtoken
        active
        avatar
    }
}`;

export const getUserByAccessToken = gql`
query getUserByAccessToken($authtoken: String!) {
    getUserByAccessToken(authtoken: $authtoken) {
        id
        username
        email
        authtoken
        active
        avatar
    }
}`;


export const recoverUserPassword = gql`
query recoverUserPassword(
  $email: String!
  $client_url: String!
) {
  recoverUserPassword(
    email: $email
    client_url: $client_url
  )
}`;

export const resetUserPassword = gql`
mutation resetUserPassword(
  $token: String!
  $password: String!
  $password_confirm: String!
) {
  resetUserPassword(
    token: $token
    password: $password
    password_confirm: $password_confirm
  )
}`;
