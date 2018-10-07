import { Cookies } from 'react-cookie';
import ApolloBoost from "apollo-boost";
import ApolloClient from "apollo-client";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createUploadLink } from 'apollo-upload-client';
const cookies = new Cookies();
const endpoint = process.env.REACT_APP_API_URL;

/**
 * Get model list
 * @param {Object} Queries 
 * @param String} modelName 
 */
export const getModelList = (Queries, modelName) => {
  const action = 'get' + modelName;
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.query({
      query: Queries[action]
    }).then(r => {
      resolve(r.data[action].results, r.data[action].total);
    })
    .catch(error => {
      reject(error.graphQLErrors)
    })
  })
}

/**
 * Get single model
 * @param {Object} Queries 
 * @param {String} modelName 
 * @param {String} id 
 */
export const getById = (Queries, queryName, id) => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.query({
      query: Queries[queryName],
      variables: { id }
    }).then(r => {
      resolve(r.data[queryName]);
    })
    .catch(error => {
      reject(error.graphQLErrors)
    })
  })
}

/**
 * Create model
 * @param {Object} Queries 
 * @param {String} modelName 
 * @param {object} model 
 */
export const createModel = (Queries, modelName, model) => {
  const action = 'create' + modelName;
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.mutate({
      mutation: Queries[action],
      variables: model
    }).then(r => {
      resolve(r.data[action]);
    })
    .catch(error => {
      reject(error.graphQLErrors);
    })
  })
}

/**
 * Update model
 * @param {Object} Queries 
 * @param {String} modelName 
 * @param {Object} model 
 */
export const updateModel = (Queries, modelName, model) => {
  const action = 'update' + modelName;
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.mutate({
      mutation: Queries[action],
      variables: model
    }).then(r => {
      resolve(r.data[action]);
    })
    .catch(error => {
      reject(error.graphQLErrors);
    })
  })
}

/**
 * Run querie
 * @param {Object} Queries 
 * @param {String} modelName 
 * @param {Object} model 
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

/**
 * Shared actions
 */
const Actions = {
  getModelList,
  getById,
  createModel,
  updateModel  
}

/**
 * Save model
 * @param {Object} Queries 
 * @param {String} modelName 
 * @param {object} model 
 */
export const saveModel = (Queries, modelName, model) => {
  const name = model.id ? 'updateModel' : 'createModel';
  return new Promise(async (resolve, reject) => {
    await Actions[name](Queries, modelName, model)
      .then(() => resolve())
      .catch(errors => reject(errors));
  });
}
