import { Cookies } from 'react-cookie';
import ApolloBoost from "apollo-boost";
import ApolloClient from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
const cookies = new Cookies();
const endpoint = process.env.REACT_APP_API_URL;

/**
 * Run query
 * @param {Object} Queries
 * @param {String} modelName
 * @param {Object} model
 */
export const get = (query, dataName, variables) => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.query({
      query,
      variables
    }).then(r => {
      resolve(r.data[dataName]);
    })
    .catch(error => {
      reject(error.graphQLErrors);
    })
  })
}

/**
 * Run query
 * @param {Object} Queries
 * @param {String} dataName
 * @param {Object} variables
 */
export const put = (mutation, dataName, variables) => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.mutate({
      mutation,
      variables
    }).then(r => {
      resolve(r.data[dataName]);
    })
    .catch(error => {
      reject(error.graphQLErrors);
    })
  })
}

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
