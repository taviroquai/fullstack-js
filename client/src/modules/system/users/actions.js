import { getUploadClient, put, get, formatErrors } from '../../../graphql';
import * as Queries from './queries';

/**
 * Get users list
 */
export const getUsers = (variables) => {
  return get(Queries.getUsers, 'getUsers', variables);
}

/**
 * Get user by id
 * @param {Number} id
 */
export const getUserById = (id) => {
  return get(Queries.getUserById, 'getUserById', {id});
}

/**
 * Save user
 * @param {Object} user
 */
export const saveUser = (user) => {
  return user.id ? put(Queries.updateUser, 'updateUser', user)
    : put(Queries.createUser, 'createUser', user)
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
      const errors = formatErrors(error);
      reject(errors);
    })
  })
}