import { getClient } from '../../graphql';
import * as Queries from './queries';
import { Cookies } from 'react-cookie';

/**
 * Start recover password
 * @param {String} email 
 */
export const recover = (email) => {
  return new Promise((resolve, reject) => {
    const { protocol, hostname, port } = window.location;
    const client_url = protocol + '//' 
      + hostname + ( port ? ':' + port : '')
      + '/#/reset?token=';
    const variables = {
      email,
      client_url
    };
    const client = getClient();
    client.query({
      query: Queries.recoverUserPassword,
      variables
    }).then(r => {
      resolve(true);
    })
    .catch(error => {
      reject(false)
    });
  });
}

/**
 * Reset password
 * @param {String} email 
 */
export const resetUserPassword = (token, password, password_confirm) => {
  return new Promise((resolve, reject) => {
    const variables = {
      token,
      password,
      password_confirm
    };
    console.log(variables, Queries.resetUserPassword);
    const client = getClient();
    client.mutate({
      mutation: Queries.resetUserPassword,
      variables
    }).then(r => {
      resolve(true);
    })
    .catch(error => {
      reject(false)
    });
  });
}

/**
 * Authenticate user
 *
 * @param {String} email
 * @param {String} password
 */
export const login = (email, password, history, redirect) => {
  return new Promise((resolve, reject) => {
    const client = getClient();
    client.query({
      query: Queries.getAccessToken,
      variables: { email, password }
    }).then(r => {
      const cookies = new Cookies();
      const options = {
        maxAge: parseInt(process.env.REACT_APP_AUTH_EXPIRES, 10)
      };
      const user = r.data.getAccessToken;
      cookies.set('user', user, options);
      resolve(user);
    })
    .catch(error => {
      reject(error.graphQLErrors)
    });
  });
}

/**
 * Validate cookie
 */
export const validateCookie = () => {
  return new Promise((resolve, reject) => {
    const cookies = new Cookies();
    const user = cookies.get('user');
    if (!user) resolve(true);
    else {
      const client = getClient();
      client.query({
        query: Queries.getUserByAccessToken,
        variables: { authtoken: user.authtoken }
      }).then(r => {
          resolve(user);
      })
      .catch(error => {
        cookies.remove('user');
        reject(error.graphQLErrors)
      });
    }
  });
}

/**
 * Get user from cookies
 */
export const getUserFromCookie = () => {
  const cookies = new Cookies();
  return cookies.get('user');
}

/**
 * Remove user cookie
 */
export const logout = (history, redirect) => {
  return new Promise((resolve, reject) => {
    const cookies = new Cookies();
    cookies.remove('user');
    if (history.location.pathname !== redirect) history.push(redirect);
    resolve(true);
  });
}
