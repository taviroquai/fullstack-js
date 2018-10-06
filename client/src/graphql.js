import { Cookies } from 'react-cookie';
import ApolloBoost from "apollo-boost";
const cookies = new Cookies();

export const getClient = () => {
  const client = new ApolloBoost({
    uri: 'http://localhost:4000/graphql',
    request: async (operation) => {
      const jwt = cookies.get('jwt')
      if (jwt) {
        operation.setContext({
          headers: {
              authorization: 'Bearer ' + jwt.token
          }
        });
      }
    },
  });
  return client
}
