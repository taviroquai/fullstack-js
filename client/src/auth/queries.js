import gql from 'graphql-tag';

export const getAccessToken = gql`
query getAccessToken($username: String!, $password: String!) {
    getAccessToken(username: $username, password: $password) {
        id
        username
        email
        authtoken
    }
}`;
