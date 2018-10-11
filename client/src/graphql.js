import { Cookies } from 'react-cookie';
import ApolloBoost from "apollo-boost";
import ApolloClient from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
const cookies = new Cookies();
const endpoint = process.env.REACT_APP_API_URL;

/**
 * Format error
 * @param {Object} error 
 */
export const formatErrors = (error) => {
  let errors = [];
  if (error.graphQLErrors) errors = error.graphQLErrors;
  if (error.networkError) errors = [error.networkError];
  return errors.map(e => ({ message: e.message }));
}

/**
 * Run query
 * @param {Object} Queries
 * @param {String} modelName
 * @param {Object} model
 */
export const get = (query, dataName, variables) => {
  return new Promise((resolve, reject) => {
    const client = getClient();
    client.query({
      query,
      variables
    }).then(r => {
      resolve(r.data[dataName]);
    })
    .catch(error => {
      const errors = formatErrors(error);
      reject(errors);
    })
  })
}

/**
 * Run mutation
 * @param {Object} Queries
 * @param {String} dataName
 * @param {Object} variables
 */
export const put = (mutation, dataName, variables) => {
  return new Promise((resolve, reject) => {
    const client = getClient();
    client.mutate({
      mutation,
      variables
    }).then(r => {
      resolve(r.data[dataName]);
    })
    .catch(error => {
      const errors = formatErrors(error);
      reject(errors);
    })
  })
}

/**
 * Get apollo client
 */
export const getClient = () => {
  const client = new ApolloBoost({
    uri: endpoint,
    request: async (operation) => {
      const user = cookies.get('user');
      if (user) {
        operation.setContext({
          headers: {
            authorization: 'Bearer ' + user.authtoken
          }
        });
      }
    },
  });
  return client
}

/**
 * Get upload client
 */
export const getUploadClient = () => {
  const user = cookies.get('user');
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: createUploadLink({
      uri: endpoint,
      headers: {
        authorization: 'Bearer ' + (user ? user.authtoken : '')
      }
    })
  });
  return client;
}
