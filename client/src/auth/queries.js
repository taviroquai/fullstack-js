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
