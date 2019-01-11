import { get, put } from '../../../graphql';
import * as Queries from './queries';

/**
 * Get roles list
 */
export const getRoles = (variables) => {
  return get(Queries.getRoles, 'getRoles', variables);
}

/**
 * Get role by id
 * @param {Number} id
 */
export const getRoleById = (id) => {
  return get(Queries.getRoleById, 'getRoleById', {id});
}

/**
 * Save role
 * @param {Object} role
 */
export const saveRole = (role) => {
  return role.id ? put(Queries.updateRole, 'updateRole', role)
    : put(Queries.createRole, 'createRole', role)
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

/**
 * Get permissions list
 */
export const getPermissions = (variables) => {
  return get(Queries.getPermissions, 'getPermissions', variables);
}

/**
 * Save permission
 * @param {Object} permission
 */
export const updatePermission = (variables) => {
  return put(Queries.updatePermission, 'updatePermission', variables);
}
