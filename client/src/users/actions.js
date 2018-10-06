import { getClient, getUploadClient } from '../graphql';
import * as Queries from './queries';

/**
 * Get all users
 */
export const getUsers = () => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.query({
      query: Queries.getUsers
    }).then(r => {
        resolve(r.data.getUsers);
      })
      .catch(error => {
        reject(error.graphQLErrors)
      })
  })
}

/**
 * Get user by id
 * @param {Number} id 
 */
export const getUserById = (id) => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.query({
      query: Queries.getUserById,
      variables: { id }
    }).then(r => {
        resolve(r.data.getUserById);
      })
      .catch(error => {
        reject(error.graphQLErrors)
      })
  })
}

/**
 * Save user
 * @param {Object} user 
 */
export const saveUser = (user) => {
  return new Promise(async (resolve, reject) => {
    if (user.id) await updateUser(user)
      .then(() => resolve())
      .catch(errors => reject(errors));
    else await createUser(user)
    .then(() => resolve())
    .catch(errors => reject(errors));
  });
}

/**
 * Create a new user
 */
export const createUser = (user) => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.mutate({
      mutation: Queries.createUser,
      variables: user
    }).then(r => {
        resolve(r.data.createUser);
      })
      .catch(error => {
        reject(error.graphQLErrors);
      })
  })
}

/**
 * Update user
 * @param {Object} user 
 */
export const updateUser = (user) => {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.mutate({
      mutation: Queries.updateUser,
      variables: user
    }).then(r => {
        resolve(r.data.updateUser);
      })
      .catch(error => {
        reject(error.graphQLErrors);
      })
  })
}

/**
 * Upload avatar image
 * @param {Object} user 
 */
export const uploadAvatar = (id, file) => {
  const client = getUploadClient();
  return new Promise((resolve, reject) => {
    client.mutate({
      mutation: Queries.uploadAvatar,
      variables: { id, file }
    }).then(r => {
        resolve(r.data.uploadAvatar);
      })
      .catch(error => {
        reject(error.graphQLErrors);
      })
  })
}
