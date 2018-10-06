import { getClient } from '../graphql';
import * as Queries from './queries';
import { Cookies } from 'react-cookie';

export const login = (username, password) => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.query({
      query: Queries.getAccessToken,
      variables: { username, password }
    }).then(r => {
        console.log(r);
        if (r.data.getAccessToken) {
          const cookies = new Cookies();
          cookies.set('jwt', r.data.getAccessToken.authtoken);
          resolve(r.data.getAccessToken);
        } else reject();
      })
      .catch(error => {
        console.log(error);
      })
  })
}

export const isAuthenticated = () => {
  const cookies = new Cookies();
  return cookies.get('jwt');
}

export const logout = () => {
  const cookies = new Cookies();
  cookies.remove('jwt');
}