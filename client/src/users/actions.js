import { getModelList, getModelById, saveModel, getUploadClient } from '../graphql';
import * as Queries from './queries';

/**
 * Get users list
 */
export const getUsers = () => {
  return getModelList(Queries, 'Users');
}

/**
 * Get user by id
 * @param {Number} id 
 */
export const getUserById = (id) => {
  return getModelById(Queries, 'User', id);
}

/**
 * Save user
 * @param {Object} user 
 */
export const saveUser = (user) => {
  return saveModel(Queries, 'User', user);
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
