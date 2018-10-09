import { getModelList, getById, saveModel, get } from '../../../graphql';
import * as Queries from './queries';

/**
 * Get roles list
 */
export const getRoles = () => {
  return getModelList(Queries, 'Roles');
}

/**
 * Get role by id
 * @param {Number} id
 */
export const getRoleById = (id) => {
  return getById(Queries, 'getRoleById', id);
}

/**
 * Save role
 * @param {Object} role
 */
export const saveRole = (role) => {
  return saveModel(Queries, 'Role', role);
}

/**
 * Get users that belongs to role
 * @param {String} id
 */
export const getRoleUsers = (id) => {
  return getById(Queries, 'getRoleUsers', id);
}

/**
 * Get hooks of role
 * @param {String} id
 */
export const getRoleHooks = (variables) => {
  console.log('getRoleHooks', variables)
  return get(Queries.getRoleHooks, 'getRoleHooks', variables);
}
