import { getModelList, getById, saveModel, get, put } from '../../../graphql';
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
 * Get hooks of role
 * @param {String} id
 */
export const getRoleHooks = (variables) => {
  return get(Queries.getRoleHooks, 'getRoleHooks', variables);
}

/**
 * Update role hook
 * @param {Object} variables
 */
export const updateRoleHook = (variables) => {
  return put(Queries.updateRoleHook, 'updateRoleHook', variables);
}
