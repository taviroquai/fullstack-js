import { getModelList, getById, saveModel, getUploadClient, put, get } from '../../../graphql';
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
  return getById(Queries, 'getUserById', id);
}

/**
 * Save user
 * @param {Object} user
 */
export const saveUser = (user) => {
  return saveModel(Queries, 'User', user);
}

/**
 * Update model
 * @param {Object} Queries
 * @param {String} modelName
 * @param {Object} model
 */
export const changeUserRole = (id, role_id) => {
  return put(Queries.changeUserRole, 'changeUserRole', { id, role_id });
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

/**
 * Get users that belongs to role
 * @param {String} id
 */
export const getRoleUsers = (variables) => {
  return get(Queries.getRoleUsers, 'getRoleUsers', variables);
}

/**
 * Update role hook
 * @param {Object} variables
 */
export const updateRoleUser = (variables) => {
  return put(Queries.updateRoleUser, 'updateRoleUser', variables);
}
