import { get, put } from '../../../graphql';
import * as Queries from './queries';

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
